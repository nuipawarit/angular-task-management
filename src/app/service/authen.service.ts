import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot} from '@angular/router';

import {LocalStorageService} from 'angular-2-local-storage';

import 'rxjs/add/operator/map';
import {HttpClientService} from './http-client/http-client.service';
import {UserData} from './user-data/user-data';
import {UserDataService} from './user-data/user-data.service';

@Injectable()
export class AuthenService implements CanActivate, CanActivateChild {

  constructor(private router: Router,
              private ls: LocalStorageService,
              private http: HttpClientService,
              private userDataService: UserDataService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (route.params['allowUser']) {
      const allowUser = +route.params['allowUser'];
      this.userDataService.getUserData()
          .then((userData: UserData) => {
                if (allowUser !== userData.UserID) {
                  alert('ผู้ใช้นี้ ไม่สามารถทำรายการนี้ได้ โปรด login ด้วยผู้ใช้ที่ถูกต้อง [' + allowUser + ']');
                  console.error('Not allowed user');
                  this.ls.remove('token');
                  this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
                }
              }
          );
    }

    if (this.loggedIn())
      return true;
    else {
      // not logged in so redirect to login page with the return url
      console.error('Session Expired');
      this.ls.remove('token');
      this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
      return false;
    }
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.canActivate(route, state);
  }

  loggedIn() {
    const token: any = this.ls.get('token');
    if (!token || token.indexOf('.') === -1) {
      return false;
    }

    const token_payload = JSON.parse(atob(token.split('.')[1]));
    if (!token_payload) {
      return false;
    }

    if (token_payload.exp < Math.floor(new Date().getTime() / 1000)) {
      return false;
    }

    if (token_payload.exp < Math.floor((new Date().getTime() + (48 * 60 * 60 * 1000)) / 1000)) {
      this.renewToken();
    }

    return true;
  }

  login(username: string, password: string) {
    return this.http
        .post('authenticate', {username: username, password: password})
        .map((data) => {
          if (data && data.jwtToken) {
            this.ls.set('token', data.jwtToken);
          }
          return data;
        });
  }

  clear() {
    this.ls.clearAll();
  }

  renewToken() {
    return this.http
        .get('authenticateToken')
        .subscribe((data) => {
          if (data && data.jwtToken) {
            this.ls.set('token', data.jwtToken);
          }
        });
  }
}
