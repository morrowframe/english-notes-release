const FILES=["assets/index-DaSEhp4g.css","assets/index-DfctJJOS.js","assets/sqlite-opfs-worker-Dd-s5EfD.js","assets/sqlite3-Con_VOcu.wasm","assets/sqlite3-opfs-async-proxy-Ck-yCayi.js","assets/sqlite3-worker1-B_sgSmL8.js","codec-worker.js","codec/excel-v8.wasm","codec/wasm_exec.js","icons/app-192.png","icons/app-512.png","icons/app.svg","icons/apple-touch-180.png","icons/maskable-512.png","index.html","manifest.webmanifest"];
const ROOT=new URL('./',self.location.href);
const PREFIX='english-notes-shell:'+ROOT.pathname+':';
const CACHE=PREFIX+"102628220d0a0debbad3";
const URLS=FILES.map(p=>new URL(p,ROOT).href);
self.addEventListener('install',event=>event.waitUntil((async()=>{
 const cache=await caches.open(CACHE);
 try {await cache.addAll(URLS.map(url=>new Request(url,{credentials:'omit',cache:'reload'})));}
 catch(error){await caches.delete(CACHE);throw error;}
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 for(const name of await caches.keys())if(name.startsWith(PREFIX)&&name!==CACHE)await caches.delete(name);
 await self.clients.claim();
})()));
self.addEventListener('fetch',event=>{
 const request=event.request,url=new URL(request.url);
 if(request.method!=='GET'||url.origin!==ROOT.origin||url.search||request.headers.has('authorization'))return;
 const home=url.pathname===ROOT.pathname||url.pathname===new URL('index.html',ROOT).pathname;
 const key=request.mode==='navigate'&&home?new URL('index.html',ROOT).href:url.href;
 if(!URLS.includes(key))return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE),response=await cache.match(key);
  return response||fetch(request);
 })());
});
