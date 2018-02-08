import {Component, OnInit, ViewChild} from '@angular/core';
import {NgxAutoScrollDirective} from '../directive/ngx-auto-scroll.directive';
import {HttpClientService} from '../service/http-client/http-client.service';

@Component({
  selector: 'app-service-monitor',
  templateUrl: './service-monitor.component.html',
  styleUrls: ['./service-monitor.component.less']
})
export class ServiceMonitorComponent implements OnInit {
  service_status = null;
  service_status_name = '';
  service_logs = '';
  is_working = false;
  @ViewChild(NgxAutoScrollDirective) ngxAutoScroll: NgxAutoScrollDirective;

  constructor(private http: HttpClientService) { }

  ngOnInit() {
    this.refresh();
  }

  start() {
    this.is_working = true;
    this.http.post('ServiceMonitor/start').toPromise()
        .then(() => {
          this.refresh();
        });
  }

  stop() {
    this.is_working = true;
    this.http.post('ServiceMonitor/stop').toPromise()
        .then(() => {
          this.refresh();
        });
  }

  refresh() {
    this.is_working = true;
    this.http.get('ServiceMonitor/status').toPromise()
        .then((response) => {
          this.is_working = false;
          this.service_status = response.status;

          if (this.service_status === 1) {
            this.service_status_name = 'Service is running';
          }
          else {
            this.service_status_name = 'Service is not running';
          }

          this.service_logs = response.logs;
          setTimeout(() => this.ngxAutoScroll.forceScrollDown());
        });
  }
}
