import {Injectable} from '@angular/core';
import * as firebase from 'firebase';
import 'rxjs/add/operator/take';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {HttpClientService} from './http-client/http-client.service';

@Injectable()
export class FcmService {
  fcmConstant = {'messagingSenderId': '1031229736713'};
  messaging: firebase.messaging.Messaging;
  currentMessage = new BehaviorSubject(null);

  constructor(private http: HttpClientService) {
    firebase.initializeApp(this.fcmConstant);
    this.messaging = firebase.messaging();
  }

  updateToken(token) {
    this.http.post('fcm/token', {token: token}).toPromise();
  }

  getPermission() {
    this.messaging.requestPermission()
        .then(() => {
          // console.log('Notification permission granted.');
          return navigator.serviceWorker.register('sw.js');

        })
        .then((reg) => {
          // console.log('Service worker registration', reg);
          return navigator.serviceWorker.ready;
        })
        .then((reg) => {
          // console.log('Service worker is ready', reg);
          this.messaging.useServiceWorker(reg);
        })
        .then(() => {
          return this.messaging.getToken();
        })
        .then((token) => {
          console.log('Token received "' + token + '"');
          this.updateToken(token);
        });
  }

  receiveMessage() {
    this.messaging.onMessage((payload) => {
      console.log('Message received. ', payload);
      this.currentMessage.next(payload);
    });
  }

  currentToken(): Promise<any> {
    return this.messaging.getToken()
        .catch(function (err) {
          console.log('An error occurred while retrieving token. ', err);
        });
  }

  deleteToken(callback) {
    this.currentToken().then((currentToken) => {
      this.messaging.deleteToken(currentToken)
          .then(function () {
            console.log('Token deleted ', currentToken);

            this.http.delete('fcm/token', {token: currentToken})
                .toPromise()
                .then(() => {
                  if (typeof callback === 'function') {
                    callback();
                  }
                });

            currentToken = null;
          })
          .catch(function (err) {
            console.error('An error occurred while deleting token. ', err);
          });
    });
  }
}
