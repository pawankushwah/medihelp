self.addEventListener('push', function(event) {
    if (event.data) {
        const data = event.data.json();
        
        const options = {
            body: data.body,
            icon: data.icon || '/vite.svg',
            vibrate: [100, 50, 100],
            data: data.data || { dateOfArrival: Date.now(), primaryKey: '1' }
        };

        event.waitUntil(
            self.registration.showNotification(data.title || "Medi-Help Alert", options)
        );
    }
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    if (event.notification.data && event.notification.data.url) {
        event.waitUntil(
            clients.openWindow(event.notification.data.url)
        );
    }
});
