import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {LocalStorageModule} from 'angular-2-local-storage';
import {Select2Module} from 'ng2-select2';
import {CustomFormsModule} from 'ng2-validation';
import {CollapseModule} from 'ngx-bootstrap/collapse';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {BsModalRef, ModalModule} from 'ngx-bootstrap/modal';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {TypeaheadModule} from 'ngx-bootstrap/typeahead';
import {NgxCurrencyModule} from 'ngx-currency';
import {NgPipesModule} from 'ngx-pipes';
import {environment} from '../environments/environment';
import {SelectModule} from '../ng-select/ng-select'; // TODO Change repo to ng-select
import {AppComponent} from './app.component';
import {AngularTrixDirective} from './directive/angular-trix.directive';
import {ElasticDirective} from './directive/elastic.directive';
import {ImgPopoverDirective} from './directive/img-popover.directive';
import {NgxAutoScrollDirective} from './directive/ngx-auto-scroll.directive';
import {TimeAgoDirective} from './directive/time-ago.directive';
import {LayoutNavbarComponent} from './layout/layout-navbar/layout-navbar.component';
import {LayoutComponent} from './layout/layout.component';
import {LoginComponent} from './login/login.component';
import {MockComponent} from './mock/mock.component';
import {ArrayDiffPipe} from './pipe/array-diff.pipe';
import {ContainsPipe} from './pipe/contains.pipe';
import {DateObjPipe} from './pipe/date-obj.pipe';
import {DateThaiPipe} from './pipe/date-thai.pipe';
import {FirstNamePipe} from './pipe/first-name.pipe';
import {HighlightPipe} from './pipe/highlight.pipe';
import {IsInPipe} from './pipe/is-in.pipe';
import {MomentFormatPipe} from './pipe/moment-format.pipe';
import {ObjToArrayPipe} from './pipe/obj-to-array.pipe';
import {SplitPipe} from './pipe/split.pipe';
import {AppRoutingModule} from './routing/app-routing.module';
import {AttachFileService} from './service/attach-file/attach-file.service';
import {BranchService} from './service/branch/branch.service';
import {CommentService} from './service/comment/comment.service';
import {CompanyService} from './service/company/company.service';
import {ConfirmModalService} from './service/confirm-model/confirm-modal.service';
import {CreditApproversService} from './service/credit-approvers/credit-approvers.service';
import {EmployeeService} from './service/employee/employee.service';
import {FcmService} from './service/fcm.service';
import {FileDownloadService} from './service/file-download.service';
import {HttpClientModule} from './service/http-client/http-client.module';
import {NotificationService} from './service/notification/notification.service';
import {NotifyService} from './service/notify.service';
import {RealTimeService} from './service/realtime/realtime.service';
import {ResponsiblePersonService} from './service/responsible-person/responsible-person.service';
import {SubscriptionService} from './service/subscription/subscription.service';
import {TagService} from './service/tag/tag.service';
import {TaskModalService} from './service/task-modal/task-modal.service';
import {TaskService} from './service/task/task.service';
import {UserDataService} from './service/user-data/user-data.service';
import {TagInputComponent} from './tag-input/tag-input.component';
import {ApprovalPenddingTaskComponent} from './task/approval-pendding-task/approval-pendding-task.component';
import {CompletedTaskComponent} from './task/completed-task/completed-task.component';
import {EmptyTaskBoxComponent} from './task/empty-task-box/empty-task-box.component';
import {TaskBoxGroupComponent} from './task/task-box-group/task-box-group.component';
import {ExpectDateComponent} from './task/task-box/expect-date/expect-date.component';
import {TaskBoxComponent} from './task/task-box/task-box.component';
import {TaskByOwnerComponent} from './task/task-by-owner/task-by-owner.component';
import {TaskByPriorityComponent} from './task/task-by-priority/task-by-priority.component';
import {TaskColumnsComponent} from './task/task-columns/task-columns.component';
import {TaskModalComponent} from './task/task-modal/task-modal.component';
import {TaskNavbarComponent} from './task/task-navbar/task-navbar.component';
import {TestZoneComponent} from './test-zone/test-zone.component';
import {ConfirmModalComponent} from './confirm-modal/confirm-modal.component';
import {TimeThaiPipe} from './pipe/time-thai.pipe';
import {DateTimeThaiPipe} from './pipe/date-time-thai.pipe';
import {ServiceMonitorComponent} from './service-monitor/service-monitor.component';
import { NotificationListComponent } from './notification/notification-list/notification-list.component';
import { NotificationManagerComponent } from './notification/notification-manager/notification-manager.component';

@NgModule({
  declarations: [
    AppComponent,
    MockComponent,
    LoginComponent,
    LayoutComponent,
    TaskByPriorityComponent,
    TimeAgoDirective,
    ApprovalPenddingTaskComponent,
    LayoutNavbarComponent,
    TaskNavbarComponent,
    TagInputComponent,
    ObjToArrayPipe,
    ArrayDiffPipe,
    TaskColumnsComponent,
    TaskBoxComponent,
    TaskBoxGroupComponent,
    ExpectDateComponent,
    DateObjPipe,
    DateThaiPipe,
    EmptyTaskBoxComponent,
    TaskByOwnerComponent,
    HighlightPipe,
    FirstNamePipe,
    CompletedTaskComponent,
    TaskModalComponent,
    MomentFormatPipe,
    SplitPipe,
    ContainsPipe,
    ImgPopoverDirective,
    AngularTrixDirective,
    IsInPipe,
    TestZoneComponent,
    NgxAutoScrollDirective,
    ElasticDirective,
    ConfirmModalComponent,
    TimeThaiPipe,
    DateTimeThaiPipe,
    ServiceMonitorComponent,
    NotificationListComponent,
    NotificationManagerComponent
  ],
  entryComponents: [
    TaskModalComponent,
    ConfirmModalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    Select2Module,
    LocalStorageModule.withConfig({
      prefix: 'task-v3',
      storageType: 'localStorage'
    }),
    AppRoutingModule,
    NgPipesModule,
    NgxDatatableModule,
    BsDropdownModule.forRoot(),
    TypeaheadModule.forRoot(),
    CollapseModule.forRoot(),
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
    SelectModule,
    NgxCurrencyModule,
    CustomFormsModule
  ],
  providers: [
    UserDataService,
    NotificationService,
    EmployeeService,
    TagService,
    ResponsiblePersonService,
    TaskService,
    BsModalRef,
    TaskModalService,
    CompanyService,
    BranchService,
    CreditApproversService,
    AttachFileService,
    CommentService,
    ConfirmModalService,
    FileDownloadService,
    SubscriptionService,
    RealTimeService,
    {
      provide: 'REAL_TIME_SERVICE_CONFIG',
      useValue: {target: (environment.production ? 'wss://' : 'ws://') + window.location.hostname + ':9002'}
    },
    NotifyService,
    FcmService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
