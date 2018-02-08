import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {LocalStorageService} from 'angular-2-local-storage';
import {Select2OptionData, Select2TemplateFunction} from 'ng2-select2';
import {environment} from '../../../environments/environment';
import {EmployeeService} from '../../service/employee/employee.service';
import {ResponsiblePersonService} from '../../service/responsible-person/responsible-person.service';
import {TagService} from '../../service/tag/tag.service';
import {TaskModalService} from '../../service/task-modal/task-modal.service';
import {UserDataService} from '../../service/user-data/user-data.service';
import {TaskFilter} from '../task-filter';

const avatarUrl = environment.avatarUrl;
const reponseByTmp: Select2TemplateFunction = (state: Select2OptionData) => {
  const type = state.additional ? state.additional.type : null;
  const uek = state.additional ? state.additional.userEmpKey : null;
  const default_src = 'assets/images/user.png';
  const src = (uek > 0) ? (avatarUrl + 'emp' + uek + '_40x40.png') : default_src;
  let label = '';

  if (type !== null) {
    if (type === 'all') {
      label = '<i class=\'avatar fa fa-asterisk\' /></i>' + state.text;
    }
    else if (type === 'cc') {
      label = '<i class=\'avatar fa fa-cc\' /></i>' + state.text;
    }
    else if (type === 'dept') {
      label = '<i class=\'avatar fa fa-sitemap\'></i>' + state.text;
    }
    else if (type === 'emp') {
      label = '<img class=\'avatar\' src=\'' + src + '\' onerror=\'this.src="' + default_src + '";\' />' + state.text;
    }
  }
  else if (uek !== null) {
    label = '<img class=\'avatar\' src=\'' + src + '\' onerror=\'this.src="' + default_src + '";\' />' + state.text;
  }
  else {
    label = '<div class=\'avatar\'></div>' + state.text;
  }

  return $('<span class="select2-response-by-option">' + label + '</span>');
};

@Component({
  selector: 'app-task-navbar',
  templateUrl: './task-navbar.component.html',
  styleUrls: ['./task-navbar.component.less']
})
export class TaskNavbarComponent implements OnInit, OnChanges {
  @Input() reponseByLabel: string = 'งานของ'; // ผู้อนุมัติ
  @Input() canAddTask: boolean = false;
  @Input() initFilter: {
    assignBy?: number,
    assignDateAfter?: string,
    assignDateBefore?: string,
    completeDateAfter?: string,
    completeDateBefore?: string,
    searchText?: string,
    reponseBy?: string
  } = {};
  @Input() enableCompleteDate: boolean = false;
  @Input() saveState: boolean = false;
  @Output() onSubmit = new EventEmitter();
  @Output() fullScreenModeChange: EventEmitter<boolean> = new EventEmitter();
  tags: string[] = [];
  tagList: string[] = [];
  searchText: string = '';
  reponseBy: string = null;
  dropdownFilter: {
    assignBy: number;
    assignDateAfter: string;
    assignDateBefore: string;
    completeDateAfter: string;
    completeDateBefore: string;
  };
  dropdownFilterBadge: number = 0;
  employees: Select2OptionData[];
  reponseByList: Select2OptionData[];
  reponseByTmp: Select2TemplateFunction = reponseByTmp;
  fullScreenMode: boolean = false;

  constructor(private employeeService: EmployeeService,
              private tagService: TagService,
              private responsiblePersonService: ResponsiblePersonService,
              private userDataService: UserDataService,
              private taskModalService: TaskModalService,
              private ls: LocalStorageService) { }

  ngOnInit() {
    this.employeeService.getAllEmployee()
        .then((employees) => {
          this.employees = employees.map(item => {
            return {id: item.id + '', text: item.name};
          });
        });
    this.tagService.getAllTag()
        .then((tags) => {
          this.tagList = tags;
        });
    this.responsiblePersonService.getResponsible()
        .then((reponseBy) => {
          this.reponseByList = reponseBy.map(item => {
            return {
              id: item.id + '',
              text: item.name,
              additional: {
                type: item.type,
                userEmpKey: item.userEmpKey || null
              }
            };
          });
        });
  }

  ngOnChanges(change: SimpleChanges) {
    if (change.hasOwnProperty('initFilter')) {
      if (this.initFilter !== undefined) {
        this.resetFilter();
      }
    }
    else {
      this.initFilter = {};
      this.resetFilter();
    }
  }

  resetFilter(clearState: boolean = false): void {
    if (clearState) {
      this.ls.remove('filter');
    }

    if (this.saveState) {
      this.initFilter = this.ls.get('filter') || {};
    }

    this.dropdownFilter = {
      assignBy: this.initFilter.assignBy || null,
      assignDateAfter: this.initFilter.assignDateAfter || null,
      assignDateBefore: this.initFilter.assignDateBefore || null,
      completeDateAfter: null,
      completeDateBefore: null
    };

    if (this.enableCompleteDate) {
      const date = new Date(), y = date.getFullYear(), m = date.getMonth();
      const firstDayInMonth = new Date(y, m, 1);
      const lastDayInMonth = new Date(y, m + 1, 0);
      const completeDateAfter = firstDayInMonth.toISOString().substr(0, 10);
      const completeDateBefore = lastDayInMonth.toISOString().substr(0, 10);
      this.dropdownFilter.completeDateAfter = this.initFilter.completeDateAfter || completeDateAfter;
      this.dropdownFilter.completeDateBefore = this.initFilter.completeDateBefore || completeDateBefore;
    }

    this.updateDropdownFilterBadge();

    this.searchText = this.initFilter.searchText || '';
    this.userDataService.getUserData()
        .then((userData) => {
          this.reponseBy = this.initFilter.reponseBy || 'e-' + userData.UserEmpID;
          this.submit();
        });
  }

  showAssignedTask(): void {
    this.userDataService.getUserData()
        .then((userData) => {
          const assignBy: Select2OptionData[] = this.employees.filter((emp) => {
            return +emp.id === userData.UserEmpID;
          });
          const assignByID: number = (assignBy.length === 1) ? +assignBy[0].id : null;
          this.changeAssignBy(assignByID);
          this.reponseBy = 'a-0';
          this.submit();
        });
  }

  changeAssignBy(value): void {
    this.dropdownFilter.assignBy = (value === null ? null : value * 1);
    this.updateDropdownFilterBadge();
  }

  updateDropdownFilterBadge(): void {
    this.dropdownFilterBadge = Object.keys(this.dropdownFilter)
        .map((key) => this.dropdownFilter[key])
        .filter((item) => !!item)
        .length;
  }

  reponseByOnChange(value): void {
    if (this.reponseBy !== value) {
      this.reponseBy = value;
      const e: any = event;
      const triggerEvent = e.path ? e.path.some((elm) => elm.classList ? elm.classList.contains('select2-container') : false) : false;
      if (triggerEvent) {
        this.submit();
      }
    }
  }

  fullScreenToggle(): void {
    this.fullScreenMode = !this.fullScreenMode;
    this.fullScreenModeChange.emit(this.fullScreenMode);
  }

  submit(): void {
    const taskFilter: TaskFilter = {
      tags: this.tags,
      searchText: this.searchText,
      reponseBy: this.reponseBy,
      assignBy: this.dropdownFilter.assignBy,
      assignDateAfter: this.dropdownFilter.assignDateAfter,
      assignDateBefore: this.dropdownFilter.assignDateBefore,
      completeDateAfter: this.dropdownFilter.completeDateAfter,
      completeDateBefore: this.dropdownFilter.completeDateBefore
    };
    this.onSubmit.emit(taskFilter);

    if (this.saveState) {
      this.ls.set('filter', taskFilter);
    }
  }

  newTask(): void {
    this.taskModalService.openAddTaskModel();
  }
}
