importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyBYh9A6rnlE-fk59R__ZxZT6AMfMwreIJc",
  authDomain: "pwa-aqi-alert.firebaseapp.com",
  projectId: "pwa-aqi-alert",
  storageBucket: "pwa-aqi-alert.firebasestorage.app",
  messagingSenderId: "351293220998", // แก้ไขเป็น Sender ID ตัวเลขจริง
  appId: "1:351293220998:web:631e82ed1049c986d60907"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title || "🌿 รายงานคุณภาพอากาศ มหิดล";
  const notificationOptions = {
    body: payload.notification?.body || "มีการอัปเดตข้อมูลคุณภาพอากาศล่าสุด",
    icon: './Icon_PWA.png', // เปลี่ยนเป็น Relative Path
    badge: './icon-192.png', // เปลี่ยนเป็น Relative Path
    data: {
      url: payload.data?.url || './index.html'
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || './index.html';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // หากมีแท็บเปิดอยู่แล้วให้โฟกัสแท็บเดิม ถ้าไม่มีให้เปิดแท็บใหม่
      for (let client of windowClients) {
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});