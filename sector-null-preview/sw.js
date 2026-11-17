// Retire the old preview's worker without touching other projects on this origin.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const scope = self.registration.scope;
    await self.registration.unregister();
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    await Promise.all(windows.filter(client => client.url.startsWith(scope)).map(client => client.navigate(scope)));
  })());
});
