import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LayoutComponent} from '../layout/layout.component';
import {LoginComponent} from '../login/login.component';
import {NotificationManagerComponent} from '../notification/notification-manager/notification-manager.component';
import {ServiceMonitorComponent} from '../service-monitor/service-monitor.component';
import {AuthenService} from '../service/authen.service';
import {ApprovalPenddingTaskComponent} from '../task/approval-pendding-task/approval-pendding-task.component';
import {CompletedTaskComponent} from '../task/completed-task/completed-task.component';
import {TaskByOwnerComponent} from '../task/task-by-owner/task-by-owner.component';
import {TaskByPriorityComponent} from '../task/task-by-priority/task-by-priority.component';
// import {TestZoneComponent} from '../test-zone/test-zone.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/app/taskByPriority',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'app',
    component: LayoutComponent,
    canActivate: [AuthenService],
    canActivateChild: [AuthenService],
    children: [
      {
        path: 'taskByPriority',
        component: TaskByPriorityComponent
      },
      {
        path: 'taskByOwner',
        component: TaskByOwnerComponent
      },
      {
        path: 'approvalPenddingTask',
        component: ApprovalPenddingTaskComponent
      },
      {
        path: 'completedTask',
        component: CompletedTaskComponent
      },
      {
        path: 'notificationManager',
        component: NotificationManagerComponent
      },
      {
        path: 'serviceMonitor',
        component: ServiceMonitorComponent
      }
    ]
  }
  // ,{
  //   path: 'testZone',
  //   component: TestZoneComponent
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  providers: [AuthenService],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
