import {Injectable} from '@angular/core';
import {Department} from '../department/department';
import {Employee} from '../employee/employee';
import {EmployeeService} from '../employee/employee.service';
import {HttpClientService} from '../http-client/http-client.service';
import {ResponsiblePerson} from './responsible-person';

@Injectable()
export class ResponsiblePersonService {
  private _data: ResponsiblePerson[];

  constructor(protected http: HttpClientService,
              private employeeService: EmployeeService) {
  }

  getResponsible(): Promise<ResponsiblePerson[]> {
    if (this._data) {
      return new Promise((resolve, reject) => {
        resolve(this._data);
      });
    }
    else {
      return new Promise((resolve, reject) => {
        const partyPromise = this.http.get('department').toPromise().then((response) => response);
        const empPromise = this.employeeService.getAllEmployee();

        Promise.all([partyPromise, empPromise]).then(values => {
          const data1 = [{
            id: 'a-0',
            name: 'ทั้งหมด',
            type: 'all'
          }, {
            id: 'c-0',
            name: 'งานที่เราเกี่ยวข้อง',
            type: 'cc'
          }];
          const data2 = values[0].map((dept: Department) => {
            return {id: 'd-' + dept.id, name: dept.name, type: 'dept'};
          });
          const data3 = values[1].map((emp: Employee) => {
            return {id: 'e-' + emp.id, name: emp.name, type: 'emp', userEmpKey: emp.userEmpKey};
          });

          // cache data
          this._data = data1.concat(data2, data3);
          resolve(this._data);
        });
      });
    }
  }
}
