// นำเข้า Firebase Scripts สำหรับ Service Worker (CDN Compat Version)
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// กำหนดค่า Firebase Config เดียวกันกับหน้า index.html
const firebaseConfig = {
  apiKey: "AIzaSyBYh9A6rnlE-fk59R__ZxZT6AMfMwreIJc",
  authDomain: "pwa-aqi-alert.firebaseapp.com",
  projectId: "pwa-aqi-alert",
  storageBucket: "pwa-aqi-alert.firebasestorage.app",
  messagingSenderId: "G-J0LEYE4YFT",
  appId: "1:351293220998:web:631e82ed1049c986d60907"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// รับ Event เมื่อมี Push แจ้งเตือนเข้ามาในขณะที่ไม่ได้เปิดหน้าเว็บ
messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title || "🌿 รายงานคุณภาพอากาศ มหิดล";
  const notificationOptions = {
    body: payload.notification?.body || "มีการอัปเดตข้อมูลคุณภาพอากาศล่าสุด",
    icon: './icon-192.png',
    badge: './icon-192.png',
    data: {
      url: payload.data?.url || './index.html'
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// เมื่อผู้ใช้แตะที่การแจ้งเตือนบนหน้าจอมือถือ
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