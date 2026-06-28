/* Ex Home — Service Worker « network-first »
   Objectif : la dernière version se charge TOUJOURS quand il y a du réseau,
   et l'appli reste utilisable hors connexion (cache de secours).
   Fini les vieilles versions bloquées en cache. */

const VERSION = 'exhome-2026-06-28a';

// Installation : on prend la main tout de suite (pas d'attente)
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activation : on nettoie les anciens caches et on prend le contrôle des onglets ouverts
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

// Permet à la page de forcer la mise à jour immédiate si besoin
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

// Récupération : réseau d'abord, cache en secours — UNIQUEMENT pour les fichiers de l'appli
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  // On ne touche PAS aux appels externes (Supabase, API, etc.) : ils passent directement
  if (url.origin !== self.location.origin) return;

  event.respondWith((async () => {
    try {
      // 1) On tente toujours le réseau d'abord → toujours la dernière version
      const fresh = await fetch(req);
      const cache = await caches.open(VERSION);
      cache.put(req, fresh.clone());
      return fresh;
    } catch (err) {
      // 2) Pas de réseau → on sert la version en cache (mode hors-ligne)
      const cached = await caches.match(req);
      if (cached) return cached;
      throw err;
    }
  })());
});
