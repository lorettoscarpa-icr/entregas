// sw.js — AUTODESTRUIÇÃO
// Este service worker existe só para REMOVER o service worker antigo (que estava
// em loop, recarregando a página) e LIMPAR o cache velho. Ele não guarda nada
// e não intercepta nada. Depois que rodar uma vez, o app passa a carregar sempre
// a versão nova direto do servidor (sem service worker).

self.addEventListener('install', function(e){
  self.skipWaiting();
});

self.addEventListener('activate', function(e){
  e.waitUntil((async function(){
    // 1) apaga todo o cache antigo
    try{
      const nomes = await caches.keys();
      await Promise.all(nomes.map(function(n){ return caches.delete(n); }));
    }catch(_){}
    // 2) remove este próprio service worker
    try{ await self.registration.unregister(); }catch(_){}
    // 3) recarrega as abas abertas — agora elas pegam a versão nova, já sem SW
    try{
      const clients = await self.clients.matchAll({ type:'window' });
      clients.forEach(function(c){ try{ c.navigate(c.url); }catch(_){ } });
    }catch(_){}
  })());
});

// não intercepta nada: deixa tudo ir direto à rede
self.addEventListener('fetch', function(e){ /* sem cache, passa direto */ });
