// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts("https://www.gstatic.com/firebasejs/8.2.2/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.2/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyDpLr_54y_Gat6wpEkdwCOk7cCHqJOLIxA",
  authDomain: "agalia-nurseapp.firebaseapp.com",
  projectId: "agalia-nurseapp",
  storageBucket: "agalia-nurseapp.appspot.com",
  messagingSenderId: "777088927666",
  appId: "1:777088927666:web:ceb4df4b9dd59f219546ab",
  measurementId: "G-T4D7EB8JEQ",
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );

  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    data: { url: payload.notification.click_action },
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", function (event) {
  
  event.notification.close();
  if (event.notification.data.url) {
    event.waitUntil(clients.openWindow(event.notification.data.url));
  } else {
    // const data = JSON.parse(event.notification.data.data)
    event.waitUntil(clients.openWindow("/notifications"));
  }
});
