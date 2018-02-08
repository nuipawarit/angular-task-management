import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {AuthenService} from '../service/authen.service';
import {UserDataService} from '../service/user-data/user-data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;
  errorMsg: string;
  loading: boolean = false;
  returnUrl: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private authen: AuthenService,
              private userDataService: UserDataService) {
  }

  ngOnInit() {
    const body = document.getElementsByTagName('body')[0];
    body.className = 'login-page';

    // clear user data
    this.userDataService.clear();

    // reset login status
    this.authen.clear();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  login() {
    this.loading = true;
    this.authen.login(this.username, this.password)
        .subscribe(
            data => {
              this.router.navigate([this.returnUrl]);
            },
            error => {
              this.errorMsg = error.error.reason || error;
              this.loading = false;
            });
  }
}
