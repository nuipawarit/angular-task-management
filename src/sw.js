importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-messaging.js');

firebase.initializeApp({
  'messagingSenderId': '1031229736713'
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
  console.debug('[ServiceWorker] Received background message ', payload);

  const title = payload.data.title;
  const options = {
    body    : payload.data.body,
    icon    : (payload.data.icon || null),
    iconUrl : (payload.data.icon || null),
    badge   : (payload.data.badge || null),
    badgeUrl: (payload.data.badge || null),
    image   : (payload.data.image || null),
    imageUrl: (payload.data.image || null),
    data    : (payload.data || null)
  };

  return self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', function (event) {
  var click_target_url = event.notification.data.click_target_url.replace(/\/$/, '');
  var click_target_task_id = event.notification.data.click_target_task_id;

  event.notification.close();
  event.waitUntil(clients.matchAll({
    type: "window"
  }).then(function (clientList) {
    for (var i = 0; i < clientList.length; i++) {
      var client = clientList[i];

      if (client.url === click_target_url && 'focus' in client) {
        //windows is same url
        return client.focus();
      }
      else if ((client.url.split('#')[0] === click_target_url.split('#')[0]) && 'focus' in client) {
        //windows is same domain
        client.navigate(click_target_url);
        return client.focus();
      }
    }
    if (clients.openWindow)
    //windows is closing
      return clients.openWindow(click_target_url);
  }));
});

self.addEventListener('install', function (event) {
  console.debug('[ServiceWorker] Installing');

  event.waitUntil(
      Promise.resolve('Installed').then(function () {
        console.debug('[ServiceWorker] Installed');
        self.skipWaiting();
      })
  );
});

self.addEventListener('activate', function (event) {
  console.debug('[ServiceWorker] Activating');

  event.waitUntil(
      Promise.resolve('Activated').then(function () {
        console.debug('[ServiceWorker] Activated');
        self.skipWaiting();
      })
  );
});