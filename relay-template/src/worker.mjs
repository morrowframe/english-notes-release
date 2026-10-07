// Transport only. No sync implementation, storage bindings, analytics or logging.
export const FULL_WEB_ORIGIN = 'https://morrowframe.github.io';
const UPSTREAM = 'https://dav.jianguoyun.com';
const METHODS = ['OPTIONS', 'PROPFIND', 'MKCOL', 'GET', 'PUT'];
const REQUEST_HEADERS = ['authorization', 'content-type', 'depth', 'if-none-match', 'if-match', 'accept'];
const RESPONSE_HEADERS = ['content-type', 'etag', 'last-modified', 'dav', 'allow', 'retry-after', 'www-authenticate'];
const EXPOSE = [...RESPONSE_HEADERS, 'x-relay-error'].join(', ');
class LimitError extends Error {}
async function bytes(stream, limit, signal) {
  if (!stream) return new Uint8Array();
  const reader = stream.getReader(), chunks = []; let size = 0;
  const abort = () => { void reader.cancel().catch(() => {}); };
  signal.addEventListener('abort', abort, {once:true});
  try {
    while (true) {
      if (signal.aborted) throw new Error('aborted');
      const {done, value} = await reader.read();
      if (signal.aborted) throw new Error('aborted');
      if (done) break;
      size += value.byteLength;
      if (size > limit) { await reader.cancel(); throw new LimitError(); }
      chunks.push(value);
    }
    const result = new Uint8Array(size); let at = 0;
    for (const chunk of chunks) { result.set(chunk, at); at += chunk.byteLength; }
    return result;
  } finally { signal.removeEventListener('abort', abort); reader.releaseLock(); }
}
export function createRelay({fetcher = fetch, timeoutMs = 10000, maxRequestBytes = 8 * 1024 * 1024, maxResponseBytes = 32 * 1024 * 1024} = {}) {
  return async function relay(request) {
    const origin = request.headers.get('Origin');
    const headers = new Headers({'Cache-Control':'no-store', 'Vary':'Origin, Access-Control-Request-Method, Access-Control-Request-Headers', 'X-Content-Type-Options':'nosniff'});
    if (origin === FULL_WEB_ORIGIN) {
      headers.set('Access-Control-Allow-Origin', FULL_WEB_ORIGIN);
      headers.set('Access-Control-Allow-Methods', METHODS.join(', '));
      headers.set('Access-Control-Allow-Headers', REQUEST_HEADERS.join(', '));
      headers.set('Access-Control-Expose-Headers', EXPOSE);
      headers.set('Access-Control-Max-Age', '300');
    }
    const error = (status, code) => { headers.set('X-Relay-Error', code); return new Response(null, {status, headers}); };
    if (origin !== FULL_WEB_ORIGIN) return error(403, 'cors');
    const url = new URL(request.url);
    if (url.search || url.hash || !url.pathname.startsWith('/dav/') || url.pathname.includes('//')) return error(400, 'path');
    try {
      for (const part of url.pathname.split('/')) {
        const decoded = decodeURIComponent(part);
        if (decoded === '.' || decoded === '..' || /[/%\\\x00-\x1f\x7f]/.test(decoded)) return error(400, 'path');
      }
    } catch { return error(400, 'path'); }
    if (request.method === 'OPTIONS' && request.headers.has('Access-Control-Request-Method')) {
      const method = request.headers.get('Access-Control-Request-Method');
      const asked = (request.headers.get('Access-Control-Request-Headers') ?? '').toLowerCase().split(',').map(s=>s.trim()).filter(Boolean);
      if (!METHODS.includes(method) || asked.some(h=>!REQUEST_HEADERS.includes(h))) return error(403, 'cors');
      return new Response(null, {status:204, headers});
    }
    if (!METHODS.includes(request.method)) { headers.set('Allow', METHODS.join(', ')); return error(405, 'method'); }
    const authorization = request.headers.get('Authorization');
    if (!authorization || !/^Basic [A-Za-z0-9+/]+=*$/.test(authorization) || authorization.length > 4096) return error(400, 'authorization');
    const length = Number(request.headers.get('Content-Length') ?? 0);
    if (!Number.isSafeInteger(length) || length < 0 || length > maxRequestBytes) return error(413, 'request_size');
    const controller = new AbortController();
    const timer = setTimeout(()=>controller.abort(), timeoutMs);
    const cancel = () => controller.abort();
    request.signal.addEventListener('abort', cancel, {once:true});
    if (request.signal.aborted) controller.abort();
    let stage = 'request';
    try {
      const body = await bytes(request.body, maxRequestBytes, controller.signal);
      const outgoing = new Headers();
      for (const h of REQUEST_HEADERS) if (request.headers.has(h)) outgoing.set(h, request.headers.get(h));
      stage = 'upstream';
      const upstream = await fetcher(UPSTREAM + url.pathname, {method:request.method, headers:outgoing, ...(request.method === 'GET' ? {} : {body:body.length?body:undefined}), redirect:'manual', credentials:'omit', cache:'no-store', signal:controller.signal});
      for (const h of RESPONSE_HEADERS) if (upstream.headers.has(h)) headers.set(h, upstream.headers.get(h));
      if (upstream.status >= 300 && upstream.status < 400) {
        headers.set('X-Relay-Error','redirect_blocked');
        await upstream.body?.cancel();
        return new Response(null, {status:upstream.status, headers});
      }
      const bodyOut = await bytes(upstream.body, maxResponseBytes, controller.signal);
      return new Response([204,205,304].includes(upstream.status)?null:bodyOut, {status:upstream.status, headers});
    } catch (e) {
      if (controller.signal.aborted) return error(504,'timeout');
      if (e instanceof LimitError) return error(stage === 'request'?413:502, stage === 'request'?'request_size':'response_size');
      return error(502,'connection');
    } finally {
      clearTimeout(timer); request.signal.removeEventListener('abort', cancel);
    }
  };
}
const relay = createRelay();
export default {fetch(request) { return relay(request); }};
