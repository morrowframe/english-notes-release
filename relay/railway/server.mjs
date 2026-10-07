import http from 'node:http';

const PORT = Number(process.env.PORT || 3000);
const FULL_WEB_ORIGIN = 'https://morrowframe.github.io';
const UPSTREAM = 'https://dav.jianguoyun.com';
const METHODS = new Set(['OPTIONS','PROPFIND','MKCOL','GET','PUT']);
const REQUEST_HEADERS = ['authorization','content-type','depth','if-none-match','if-match','accept'];
const EXPOSE_HEADERS = ['content-type','etag','last-modified','dav','allow','retry-after','www-authenticate','x-relay-error'];
const MAX_BODY = 8 * 1024 * 1024;

function baseHeaders(origin) {
  const h = new Headers({
    'Cache-Control':'no-store',
    'Vary':'Origin, Access-Control-Request-Method, Access-Control-Request-Headers',
    'X-Content-Type-Options':'nosniff'
  });
  if (origin === FULL_WEB_ORIGIN) {
    h.set('Access-Control-Allow-Origin', FULL_WEB_ORIGIN);
    h.set('Access-Control-Allow-Methods', [...METHODS].join(', '));
    h.set('Access-Control-Allow-Headers', REQUEST_HEADERS.join(', '));
    h.set('Access-Control-Expose-Headers', EXPOSE_HEADERS.join(', '));
    h.set('Access-Control-Max-Age','300');
  }
  return h;
}

function send(res,status,headers,body=null){
  res.statusCode=status;
  for(const [k,v] of headers) res.setHeader(k,v);
  if(body===null){res.end();return;}
  body.arrayBuffer().then(buf=>res.end(Buffer.from(buf))).catch(()=>res.end());
}

async function readBody(req){
  if(['GET','PROPFIND','OPTIONS'].includes(req.method)) return undefined;
  const chunks=[];let size=0;
  for await (const chunk of req){
    size+=chunk.length;
    if(size>MAX_BODY) throw new Error('body_too_large');
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

const server=http.createServer(async(req,res)=>{
  if(req.url==='/healthz'){
    res.statusCode=200;res.setHeader('Cache-Control','no-store');res.end('ok');return;
  }

  const origin=req.headers.origin ?? null;
  const headers=baseHeaders(origin);
  const fail=(status,code)=>{headers.set('X-Relay-Error',code);send(res,status,headers);};

  if(origin!==FULL_WEB_ORIGIN) return fail(403,'cors');

  let url;
  try{url=new URL(req.url ?? '/', 'https://relay.invalid');}
  catch{return fail(400,'path');}
  if(!url.pathname.startsWith('/dav/')||url.search||url.hash) return fail(400,'path');

  if(req.method==='OPTIONS' && req.headers['access-control-request-method']){
    const method=String(req.headers['access-control-request-method']);
    const asked=String(req.headers['access-control-request-headers']??'')
      .toLowerCase().split(',').map(s=>s.trim()).filter(Boolean);
    if(!METHODS.has(method)||asked.some(h=>!REQUEST_HEADERS.includes(h))) return fail(403,'cors');
    return send(res,204,headers);
  }

  if(!METHODS.has(req.method)) return fail(405,'method');
  const authorization=req.headers.authorization;
  if(!authorization||!/^Basic [A-Za-z0-9+/]+=*$/.test(authorization)) return fail(400,'authorization');

  const outgoing=new Headers();
  for(const name of REQUEST_HEADERS){
    const value=req.headers[name];
    if(value) outgoing.set(name,Array.isArray(value)?value.join(', '):String(value));
  }

  try{
    const body=await readBody(req);
    const upstream=await fetch(UPSTREAM+url.pathname,{
      method:req.method,
      headers:outgoing,
      body,
      redirect:'manual'
    });
    for(const name of EXPOSE_HEADERS){
      const value=upstream.headers.get(name);
      if(value) headers.set(name,value);
    }
    if(upstream.status>=300&&upstream.status<400){
      headers.set('X-Relay-Error','redirect_blocked');
      return send(res,upstream.status,headers);
    }
    send(res,upstream.status,headers,upstream);
  }catch(error){
    const code=error instanceof Error&&error.message==='body_too_large'?'request_too_large':'connection';
    fail(code==='request_too_large'?413:502,code);
  }
});

server.listen(PORT,'0.0.0.0',()=>console.log('relay listening on '+PORT));
