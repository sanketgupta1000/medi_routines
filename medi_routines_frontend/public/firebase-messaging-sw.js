// Using compat libraries for easier service worker integration
importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyAr_gpTVwymWmPT0-Uhkd-no8RqaTo6nNE",
  authDomain: "medi-routines.firebaseapp.com",
  projectId: "medi-routines",
  storageBucket: "medi-routines.firebasestorage.app",
  messagingSenderId: "765745319502",
  appId: "1:765745319502:web:27ee85ccc032f0dea67d1f",
  measurementId: "G-WJSXXD2YXX"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging(); // Using the compat version

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification?.title || 'Medi Routine';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new reminder.'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', function(event) {
  console.log('[firebase-messaging-sw.js] Notification click Received.', event.notification.data);
  event.notification.close(); // Close the notification

  const urlToOpen = '/'; // Default to root if no URL in data

  // Attempt to focus an existing window or open a new one
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true })
    .then(function(clientList) {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        // If an already open window is found, focus it.
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // If no window is found, or focusing fails, open a new window.
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});