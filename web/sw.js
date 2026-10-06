// Retire the former /web/ shell without touching databases or active forms.
const OLD_ROOT=new URL('./',self.location.href);
const OLD_PREFIX='english-notes-shell:'+OLD_ROOT.pathname+':';
self.addEventListener('install',event=>event.waitUntil(self.skipWaiting()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 for(const name of await caches.keys())if(name.startsWith(OLD_PREFIX))await caches.delete(name);
 await self.clients.claim();
 await self.registration.unregister();
})()));
