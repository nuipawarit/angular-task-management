import {CommonModule} from '@angular/common';
import {HttpClientModule as AngularHttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {HttpClientService} from './http-client.service';

@NgModule({
  imports: [
    CommonModule,
    AngularHttpClientModule
  ],
  declarations: [],
  providers: [
    HttpClientService
  ]
})
export class HttpClientModule {
}
