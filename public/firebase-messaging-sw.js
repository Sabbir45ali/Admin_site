/* eslint-disable no-undef */
// Firebase Messaging Service Worker — handles background push notifications
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: new URL(location).searchParams.get('apiKey') || "AIzaSy" + "ARxxF4kQgJ" + "hDCiwjbyoqwGI" + "Q1aGSsu7Ik",
  authDomain: new URL(location).searchParams.get('authDomain') || "ruksana-s-parlour.firebaseapp.com",
  projectId: new URL(location).searchParams.get('projectId') || "ruksana-s-parlour",
  storageBucket: new URL(location).searchParams.get('storageBucket') || "ruksana-s-parlour.firebasestorage.app",
  messagingSenderId: new URL(location).searchParams.get('messagingSenderId') || "252537312530",
  appId: new URL(location).searchParams.get('appId') || "1:252537312530:web:353d38cf9dd2bf4710cfcb",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[SW] Background message received:", payload);

  const title = payload.notification?.title || "Ruksana's Admin Alert";
  const options = {
    body: payload.notification?.body || "You have a new notification",
    icon: "/vite.svg", // Using vite default icon as placeholder
    badge: "/vite.svg",
    image: payload.notification?.image || undefined,
    data: payload.data || {},
  };

  self.registration.showNotification(title, options);
});

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return clients.openWindow("/");
    })
  );
});
