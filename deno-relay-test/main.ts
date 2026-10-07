const FULL_WEB_ORIGIN = "https://morrowframe.github.io";
const UPSTREAM = "https://dav.jianguoyun.com";

const ALLOWED_METHODS = ["OPTIONS","PROPFIND","MKCOL","GET","PUT"];
const ALLOWED_HEADERS = ["authorization","content-type","depth","if-none-match","if-match","accept"];
const EXPOSE_HEADERS = ["content-type","etag","last-modified","dav","allow","retry-after","www-authenticate","x-relay-error"];

function corsHeaders(origin: string | null) {
  const h = new Headers({
    "Cache-Control":"no-store",
    "Vary":"Origin, Access-Control-Request-Method, Access-Control-Request-Headers",
    "X-Content-Type-Options":"nosniff",
  });
  if (origin === FULL_WEB_ORIGIN) {
    h.set("Access-Control-Allow-Origin", FULL_WEB_ORIGIN);
    h.set("Access-Control-Allow-Methods", ALLOWED_METHODS.join(", "));
    h.set("Access-Control-Allow-Headers", ALLOWED_HEADERS.join(", "));
    h.set("Access-Control-Expose-Headers", EXPOSE_HEADERS.join(", "));
    h.set("Access-Control-Max-Age", "300");
  }
  return h;
}

Deno.serve(async (request) => {
  const origin = request.headers.get("Origin");
  const headers = corsHeaders(origin);
  const error = (status:number, code:string) => {
    headers.set("X-Relay-Error", code);
    return new Response(null,{status,headers});
  };

  if (origin !== FULL_WEB_ORIGIN) return error(403,"cors");

  const url = new URL(request.url);
  if (!url.pathname.startsWith("/dav/") || url.search || url.hash) return error(400,"path");

  if (request.method === "OPTIONS" && request.headers.has("Access-Control-Request-Method")) {
    const method = request.headers.get("Access-Control-Request-Method") || "";
    const asked = (request.headers.get("Access-Control-Request-Headers") || "")
      .toLowerCase().split(",").map(s=>s.trim()).filter(Boolean);
    if (!ALLOWED_METHODS.includes(method) || asked.some(h=>!ALLOWED_HEADERS.includes(h))) return error(403,"cors");
    return new Response(null,{status:204,headers});
  }

  if (!ALLOWED_METHODS.includes(request.method)) return error(405,"method");

  const authorization = request.headers.get("Authorization");
  if (!authorization || !/^Basic [A-Za-z0-9+/]+=*$/.test(authorization)) return error(400,"authorization");

  const outgoing = new Headers();
  for (const h of ALLOWED_HEADERS) if (request.headers.has(h)) outgoing.set(h, request.headers.get(h)!);

  try {
    const upstream = await fetch(UPSTREAM + url.pathname, {
      method: request.method,
      headers: outgoing,
      body: ["GET","PROPFIND","OPTIONS"].includes(request.method) ? undefined : request.body,
      redirect: "manual",
    });
    for (const h of EXPOSE_HEADERS) if (upstream.headers.has(h)) headers.set(h,upstream.headers.get(h)!);
    if (upstream.status >= 300 && upstream.status < 400) {
      await upstream.body?.cancel();
      headers.set("X-Relay-Error","redirect_blocked");
      return new Response(null,{status:upstream.status,headers});
    }
    return new Response(upstream.body,{status:upstream.status,headers});
  } catch {
    return error(502,"connection");
  }
});
