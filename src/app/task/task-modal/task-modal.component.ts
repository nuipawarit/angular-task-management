import {HttpEvent, HttpEventType, HttpResponse} from '@angular/common/http';
import {Component, ContentChild, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {environment} from '../../../environments/environment';
import {IOption} from '../../../ng-select/ng-select';
import {ElasticDirective} from '../../directive/elastic.directive';
import {DateObjPipe} from '../../pipe/date-obj.pipe';
import {MomentFormatPipe} from '../../pipe/moment-format.pipe';
import {AttachFile, UploadedFile} from '../../service/attach-file/attach-file';
import {AttachFileService} from '../../service/attach-file/attach-file.service';
import {Branch} from '../../service/branch/branch';
import {BranchService} from '../../service/branch/branch.service';
import {Comment} from '../../service/comment/comment';
import {CommentService} from '../../service/comment/comment.service';
import {Company} from '../../service/company/company';
import {CompanyService} from '../../service/company/company.service';
import {CreditApprovers} from '../../service/credit-approvers/credit-approvers';
import {CreditApproversService} from '../../service/credit-approvers/credit-approvers.service';
import {Customer} from '../../service/customer/customer';
import {Employee} from '../../service/employee/employee';
import {EmployeeService} from '../../service/employee/employee.service';
import {HttpClientService} from '../../service/http-client/http-client.service';
import {NotificationService} from '../../service/notification/notification.service';
import {RealTimeService} from '../../service/realtime/realtime.service';
import {SubscriptionService} from '../../service/subscription/subscription.service';
import {TagService} from '../../service/tag/tag.service';
import {Task} from '../../service/task/task';
import {TaskService} from '../../service/task/task.service';
import {UserData} from '../../service/user-data/user-data';
import {UserDataService} from '../../service/user-data/user-data.service';
import {ConfirmModalService} from '../../service/confirm-model/confirm-modal.service';

const FILE_ICON_CLASS = {
  'doc': 'fa-file-word-o',
  'docx': 'fa-file-word-o',
  'ppt': 'fa-file-powerpoint-o',
  'pptx': 'fa-file-powerpoint-o',
  'xls': 'fa-file-excel-o',
  'xlsx': 'fa-file-excel-o',
  'pdf': 'fa-file-pdf-o',
  'zip': 'fa-file-zip-o',
  'rar': 'fa-file-zip-o'
};
const PRI_LIST = [
  {id: 3, name: '  This Week'},
  {id: 2, name: '  This Month'},
  {id: 1, name: '  Later'}
];
const TASK_TYPE_LIST = [
  {id: 1, name: 'มอบหมายงาน'},
  {id: 3, name: 'ขออนุมัติวงเงิน/วัน'},
  {id: 5, name: 'ขออนุมัติทั่วไป'},
  {id: 7, name: 'เกี่ยวกับลูกค้า'}
];
const CONTACT_TYPE_LIST = [
  'ข้อมูลพื้นฐาน',
  'เป้าหมาย',
  'ข้อร้องเรียน',
  'ติดตามหนี้',
  'ขอเงินสนับสนุน',
  'อื่นๆ'
];
const FILE_UPLOAD_URL = environment.uploadUrl;

@Component({
  selector: 'app-task-modal',
  templateUrl: './task-modal.component.html',
  styleUrls: ['./task-modal.component.less'],
  providers: [MomentFormatPipe, DateObjPipe],
  exportAs: 'task-modal'
})
export class TaskModalComponent implements OnInit, OnDestroy {
  @ViewChild('commentElastic') commentElastic: ElasticDirective;
  fileIconClass = FILE_ICON_CLASS;
  avatarUrl: string = environment.avatarUrl;
  submitting: boolean = false;
  private _mode: string;
  get mode() {
    return this._mode;
  }

  set mode(val: string) {
    this._mode = val;
    this.is_add_mode = (this._mode === 'add');
    this.is_edit_mode = (this._mode === 'edit');
    this.auto_submit = (this.is_edit_mode);
  }

  is_add_mode: boolean;
  is_edit_mode: boolean;
  auto_submit: boolean;
  is_readonly: boolean;

  private _readonly: boolean;
  get readonly() {
    return this._readonly;
  }

  set readonly(val: boolean) {
    this._readonly = val;
    this.is_readonly = this._readonly;
  }

  user_id: number;
  user_emp_id: number;
  user_emp_key: number;
  user_emp_name: string;

  task_type_list = TASK_TYPE_LIST;
  priority_list = PRI_LIST;
  tag_list: string[] = [];
  emp_list: Employee[] = [];
  empOptions: { value: Employee; label: string; }[] = [];
  company_list: Company[] = [];
  branch_list: Branch[] = [];
  contact_type_list: string[] = CONTACT_TYPE_LIST;
  credit_approvers_list: CreditApprovers[] = [];
  customerOptions: { value: Customer; label: string; }[] = [];

  protected _formData: Task;
  get formData(): Task {
    return this._formData;
  }

  set formData(value: Task) {
    this._formData = value;
    this.is_responsible = this.user_emp_id === this._formData.ReponsedBy;
    this.is_assigner = this.user_emp_id === this._formData.AssignedBy;
    this.is_approver = [this._formData.Ar_UserID1, this._formData.Ar_UserID2, this._formData.Ar_UserID3].includes(this.user_emp_id);
    this.is_task_closer = this.user_emp_id === this._formData.TaskEmpIDCanCloseJob;
    this.prevent_edit = this.is_readonly || (!this.is_responsible && !this.is_assigner && !this.is_approver && !this.is_task_closer);
    this.task_type = this._formData.TaskType;
    this.title = this._formData.TaskTitle;
    this.detail = this._formData.TaskDetail;
    this.cc = this._formData.TaskMail_CC;
    this.tag = this._formData.TaskTag;
    this.expect_date = this.momentFormatPipe.transform(this._formData.TaskExpectDate, 'YYYY-MM-DD');
    this.priority = this._formData.TaskPriority;
    this.assign_date = this._formData.AssignedDate;
    this.company = this._formData.Ar_Company;
    this.branch = this._formData.Ar_BranchID;
    this.customer = {id: this._formData.TaskPartyID, text: this._formData.TaskCustomerName};
    this.customer_name = this._formData.TaskCustomerName;
    this.customerOptions = [{value: this.customer, label: this.customer_name}];
    this.contact_type = this._formData.TaskSystem;
    this.customer_credit = {
      amount: this._formData.Ar_Amount,
      amount_old: this._formData.Ar_AmountOLD,
      due1: this._formData.Ar_CusCrTerm,
      due1_old: this._formData.Ar_CusCrTermOLD,
      due2: this._formData.Ar_CusCrTerm2,
      due2_old: this._formData.Ar_CusCrTermOLD2,
      due3: this._formData.Ar_CusCrTerm3,
      due3_old: this._formData.Ar_CusCrTermOLD3,
      due0: this._formData.Ar_CusCrTerm0,
      due0_old: this._formData.Ar_CusCrTermOLD0,
      due1_day: this._formData.Ar_CustCT1PayValue,
      due1_day_old: this._formData.Ar_CustCT1PayValue_Old,
      due2_day: this._formData.Ar_CustCT2PayValue,
      due2_day_old: this._formData.Ar_CustCT2PayValue_Old,
      approvers: this._formData.Ar_UserID1
    };


    this.employeeService.getAllEmployee().then((emps: Employee[]) => {
      emps = emps.filter((emp) => emp.id === this._formData.ReponsedBy);
      this.reponse_by = emps.length > 0 ? emps[0] : null;
    });


    this.employeeService.getAllEmployee().then((emps: Employee[]) => {
      this.approves = [
        {id: this._formData.Ar_UserID1, is_approved: !!this._formData.Ar_Approve1},
        {id: this._formData.Ar_UserID2, is_approved: !!this._formData.Ar_Approve2},
        {id: this._formData.Ar_UserID3, is_approved: !!this._formData.Ar_Approve3}
      ].map((approve) => {
        const emp = emps.find((o) => o.id === approve.id);
        if (emp !== undefined) {
          return Object.assign({}, emp, {is_approved: approve.is_approved});
        }
        return null;
      }).filter((o) => o !== null);
    });
  }

  is_responsible: boolean = false;
  is_assigner: boolean = false;
  is_approver: boolean = false;
  is_task_closer: boolean = false;
  prevent_edit: boolean = false;
  show_invalid: boolean = false;

  private _task_type: number = 1;
  get task_type(): number {
    return this._task_type;
  }

  set task_type(value: number) {
    if (value === 3) {
      this.customer = null;
    }

    this._task_type = value;
  }

  title: string = '';
  detail: string = '';
  detail_edit_mode: boolean = false;
  detail_temp_upload: UploadedFile[] = [];

  protected _cc: Employee[] = [];
  get cc(): string {
    return this._cc.map(o => o.userEmail).join(',');
  }

  set cc(emailList: string) {
    if (!emailList) {
      this._cc = [];
      return;
    }

    this.employeeService.getAllEmployee().then((emps: Employee[]) => {
      this._cc = emailList.split(',')
          .map(o => o.trim())
          .filter((v) => v !== '')
          .filter((v, i, a) => a.indexOf(v) === i)
          .map((email) => emps.find((emp) => emp.userEmail === email))
          .filter(o => o !== undefined);
    });
  }

  protected _tag: string[] = [];
  get tag(): string {
    return this._tag.map(o => o.replace('#', '')).join(',');
  }

  set tag(tagList: string) {
    if (!tagList) {
      this._tag = [];
      return;
    }

    this._tag = tagList.split(',')
        .map(o => o.trim())
        .filter((v) => v !== '')
        .filter((v, i, a) => a.indexOf(v) === i)
        .map(o => '#' + o);
  }

  attach: AttachFile[] = [];
  attach_fetching: boolean = false;
  comments: Comment[] = [];
  comment_form: { message: string; attachment: FileList; } = {message: '', attachment: null};
  comment_fetching: boolean = false;
  comment_submiting: boolean = false;
  comment_task_history: boolean = false;
  expect_date: string = null;
  priority: number = null;
  reponse_by: Employee = null;
  assign_date: string = null;
  company: string = null;
  branch: number = null;
  approves: { id: number, is_approved: boolean }[] = [];
  customer: Customer = null;
  customer_name: string = null;
  contact_type: string = null;
  customer_credit: {
    amount: number;
    amount_old: number;
    due1: number;
    due1_old: number;
    due2: number;
    due2_old: number;
    due3: number;
    due3_old: number;
    due0: number;
    due0_old: number;
    due1_day: number;
    due1_day_old: number;
    due2_day: number;
    due2_day_old: number;
    approvers: number;
  } = {
    amount: null,
    amount_old: null,
    due1: null,
    due1_old: null,
    due2: null,
    due2_old: null,
    due3: null,
    due3_old: null,
    due0: null,
    due0_old: null,
    due1_day: 0,
    due1_day_old: null,
    due2_day: 0,
    due2_day_old: null,
    approvers: null
  };
  searchCustomerRequest: Subscription;
  realTimeServiceSubs: Subscription;

  constructor(private modalRef: BsModalRef,
              private http: HttpClientService,
              private momentFormatPipe: MomentFormatPipe,
              private dateObjPipe: DateObjPipe,
              private taskService: TaskService,
              private userDateService: UserDataService,
              private tagService: TagService,
              private employeeService: EmployeeService,
              private companyService: CompanyService,
              private branchService: BranchService,
              private creditApproversService: CreditApproversService,
              private attachFileService: AttachFileService,
              private commentService: CommentService,
              private confirmModelService: ConfirmModalService,
              private subscriptionService: SubscriptionService,
              private realTimeService: RealTimeService) {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.realTimeServiceSubs)
      this.realTimeServiceSubs.unsubscribe();
  }

  init(mode: string, task?: Task | Promise<Task | false>, readonly?: boolean): void {
    this.mode = mode;
    this.readonly = undefined;

    this.userDateService.getUserData().then((userData: UserData) => {
      this.user_id = userData.UserID;
      this.user_emp_id = userData.UserEmpID;
      this.user_emp_key = userData.UserEmpKey;
      this.user_emp_name = userData.UserName;

      if (this.is_edit_mode) {
        if (task instanceof Promise) {
          task.then((result: Task | false) => {
            if (result !== false) {
              this.setTaskData(result);
              this.readonly = (readonly !== undefined) ? readonly : (result.TaskIsCompleted === 1);
            }
            else {
              alert('ไม่สามารถเปิดงานได้');
              this.close();
            }
          });
        }
        else {
          this.setTaskData(task);
          this.readonly = (readonly !== undefined) ? readonly : (task.TaskIsCompleted === 1);
        }
      }
      else {
        this.company = userData.UserCompany;
        this.branch = userData.UserBranchID;
        this.readonly = (readonly !== undefined) ? readonly : false;
      }
    });

    this.tagService.getAllTag().then((tags: string[]) => {
      this.tag_list = tags;
    });

    this.employeeService.getAllEmployee().then((emps: Employee[]) => {
      this.emp_list = emps;
      this.empOptions = emps.map((item: Employee) => {
        return {value: item, label: item.name};
      });
    });

    this.companyService.getAllCompany().then((companies: Company[]) => {
      this.company_list = companies;
    });

    this.branchService.getAllBranch().then((branchs: Branch[]) => {
      this.branch_list = branchs;
    });

    this.creditApproversService.getAllCreditApprovers().then((approvers: CreditApprovers[]) => {
      this.credit_approvers_list = approvers;
    });
  }

  setTaskData(task: Task): void {
    this.formData = task;

    this.attach = [];
    if (this.formData.AttachFileCount > 0) {
      this.attach_fetching = true;
      this.attachFileService.getAttachFile(this.formData.TaskID).then((files: AttachFile[]) => {
        this.attach = files;
        this.attach_fetching = false;
      });
    }

    this.comments = [];
    if (this.formData.CommentCount > 0) {
      this.comment_fetching = true;
      this.commentService.getTaskComment(this.formData.TaskID).then((comments: Comment[]) => {
        this.comments = comments.map((comment) => {
          comment.isSelf = (comment.TC_UserID === this.user_id);
          return comment;
        });
        this.comment_fetching = false;
      });
    }

    if (this.realTimeServiceSubs)
      this.realTimeServiceSubs.unsubscribe();

    this.realTimeServiceSubs = this.realTimeService.message.subscribe((update_data) => {
      const is_change_list = ['comment', 'attachment', 'task'].includes(update_data.table);
      const is_current_task_id = (update_data.filter_key && +update_data.filter_key.TaskID === this.formData.TaskID);

      if (is_change_list && is_current_task_id) {
        switch (update_data.table) {
          case 'comment' :
            switch (update_data.type) {
              case 'insert' :
                const updateValue = update_data.value;

                if (updateValue.TC_UserID) {
                  updateValue.isSelf = (updateValue.TC_UserID === this.user_id);
                }

                if (!updateValue.temp_key) {
                  this.comments.push(updateValue);
                }
                else {
                  const index = this.comments.map(v => v.tempKey).indexOf(updateValue.temp_key);
                  if (index > -1)
                    this.comments[index] = Object.assign({}, this.comments[index], updateValue);
                  else
                    this.comments.push(updateValue);
                }
                break;
            }
            break;

          case 'attachment' :
            switch (update_data.type) {
              case 'insert' :
                this.attach = this.attach.concat(update_data.value);
                break;
            }
            break;

          case  'task' :
            switch (update_data.type) {
              case 'update' :
                this.formData = Object.assign({}, this.formData, update_data.value);
                break;

              case 'delete' :
                this.close();
                break;
            }
            break;
        }
      }
    });
  }

  close(): void {
    this.modalRef.hide();
  }

  blurOnEnter(event): void {
    if (event.keyCode === 13) {
      event.target.blur();
    }
  }

  reqTaskClose(): void {
    this.confirmModelService.open({
      content: 'คุณต้องการขอปิดงาน ใช่หรือไม่ ?',
      confirmCallback: () => {
        this.submitting = true;
        this.taskService.requestTaskClose(this.formData.TaskID).then(() => {
          this.submitting = false;
        });
      }
    });
  }

  approveTaskClose(): void {
    this.confirmModelService.open({
      content: 'คุณต้องการปิดงาน ใช่หรือไม่ ?',
      confirmCallback: () => {
        this.submitting = true;
        this.taskService.approveTaskClose(this.formData.TaskID).then(() => {
          this.submitting = false;
        });
      }
    });
  }

  disapproveTaskClose(): void {
    this.confirmModelService.open({
      content: 'คุณต้องการยกเลิกการปิดงาน ใช่หรือไม่ ?',
      confirmCallback: () => {
        this.submitting = true;
        this.taskService.disapproveTaskClose(this.formData.TaskID).then(() => {
          this.submitting = false;
        });
      }
    });
  }

  approveTask(): void {
    if (this.task_type === 3) {
      this.confirmModelService.open({
        content: 'โปรดระบุเหตุผลในการแก้ไขวงเงิน/กลุ่ม Due',
        messageBox: true,
        messageRequire: true,
        confirmCallback: (message) => {
          this.submitting = true;
          this.taskService.approveTask(this.formData.TaskID, true, message).then(() => {
            this.submitting = false;
          });
        }
      });
    }
    else {
      this.confirmModelService.open({
        content: 'คุณต้องการอนุมัติงานนี้ ใช่หรือไม่ ?',
        confirmCallback: () => {
          this.submitting = true;
          this.taskService.approveTask(this.formData.TaskID, true).then(() => {
            this.submitting = false;
          });
        }
      });
    }
  }

  disapproveTask(): void {
    if (this.task_type === 3) {
      this.confirmModelService.open({
        content: 'โปรดระบุเหตุผลในการแก้ไขวงเงิน/กลุ่ม Due',
        messageBox: true,
        messageRequire: true,
        confirmCallback: (message) => {
          this.submitting = true;
          this.taskService.approveTask(this.formData.TaskID, false, message).then(() => {
            this.submitting = false;
          });
        }
      });
    }
    else {
      this.confirmModelService.open({
        content: 'คุณต้องการไม่อนุมัติงานนี้ ใช่หรือไม่ ?',
        confirmCallback: () => {
          this.submitting = true;
          this.taskService.approveTask(this.formData.TaskID, false).then(() => {
            this.submitting = false;
          });
        }
      });
    }
  }

  printApproveForm(): void {
    this.submitting = true;
    this.taskService.printApproveForm(this.formData.TaskID).then(() => {
      this.submitting = false;
    });
  }

  toggleSubscription(): void {
    this.formData.TaskSubscription = (!this.formData.TaskSubscription) ? 1 : 0;
    this.subscriptionService.toggleSubscription(this.formData.TaskID, this.formData.TaskSubscription);
  }

  titleSubmit(): void {
    if (this.auto_submit) {
      if (this.title !== this.formData.TaskTitle) {
        this.taskService.editTaskTitle(this.formData.TaskID, this.title);
      }
    }
  }

  detailEnableEditMode(): void {
    if (this.prevent_edit)
      return;

    this.detail_edit_mode = true;
  }


  detailOnClick(event): void {
    event.preventDefault();

    if (event.target.nodeName === 'A' && event.target.href) {
      window.open(event.target.href, '_blank');
      return;
    }
    else if (event.target.nodeName === 'IMG' && event.target.src) {
      window.open(event.target.src, '_blank');
      return;
    }

    this.detailEnableEditMode();
  }

  detailTrixAttachmentAdd(e): void {
    const attachment = e.attachment;
    if (attachment.file) {
      (this.attachFileService.uploadTmpFile(attachment.file, false) as Observable<HttpEvent<any>>)
          .subscribe(event => {
            if (event.type === HttpEventType.UploadProgress) {
              const progress = event.loaded / event.total * 100;
              attachment.setUploadProgress(progress);
            }
            else if (event instanceof HttpResponse) {
              const data = event.body;
              const save_file_result: UploadedFile = data.save_file_result[0];

              this.detail_temp_upload = this.detail_temp_upload.concat(data.save_file_result);
              if (event.status === 200 && save_file_result) {
                attachment.setAttributes({
                  url: FILE_UPLOAD_URL + save_file_result.serverFileName,
                  href: FILE_UPLOAD_URL + save_file_result.serverFileName
                });
              }
              else {
                alert('Upload Error');
              }
            }
          });
    }
  }

  detailEditCancel(): void {
    this.detail_edit_mode = false;
    this.detail = this.formData.TaskDetail;
  }

  detailSubmit(): void {
    this.detail_edit_mode = false;
    if (this.auto_submit) {
      if (this.detail !== this.formData.TaskDetail) {
        this.taskService.editTaskDetail(this.formData.TaskID, this.detail, this.detail_temp_upload)
            .then(() => {
              this.detail_temp_upload = []; // Clear Upload Cache
            });
      }
    }
  }

  attachUploadFiles(event): void {
    const files: FileList = event.target.files;
    if (files) {
      if (this.auto_submit) {
        this.attach_fetching = true;
        this.attachFileService.uploadFile(this.formData.TaskID, files)
            .then(() => {
              this.attach_fetching = false;
            });
      }
      else {
        this.attach_fetching = true;
        (this.attachFileService.uploadTmpFile(files) as Promise<HttpResponse<any>>)
            .then((response) => {
              this.attach_fetching = false;
              const uploadedFiles: UploadedFile[] = response.body.save_file_result;
              const new_attach: AttachFile[] = uploadedFiles.map(file => Object.assign({}, {
                TAF_CreationDate: null,
                TAF_Date: null,
                TAF_FileName: null,
                TAF_FileNameDB: null,
                TAF_ID: null,
                TAF_SystermID: null,
                TAF_Terminal: null,
                TAF_Type: null,
                TAF_UserID: null,
                TC_ID: null
              }, file));
              this.attach = this.attach.concat(new_attach);
            });
      }
    }
  }

  loadCustomerInfo(customer: IOption): void {
    this.http.get('customer/credit', {customerID: +customer.value.id})
        .subscribe((data) => {
          this.customer_credit.amount_old = data.CustomerCreditLimit;
          this.customer_credit.due1_old = data.CustomerMaxCreditTerm;
          this.customer_credit.due2_old = data.CustomerCreditTerm2;
          this.customer_credit.due3_old = data.CustomerCreditTerm3;
          this.customer_credit.due0_old = data.CustomerCreditTerm0;
          this.customer_credit.due1_day_old = data.CustomerCT1PayValue;
          this.customer_credit.due2_day_old = data.CustomerCT2PayValue;
        });
  }

  searchCustomer(searchTerm): void {
    if (!searchTerm || searchTerm.length <= 2)
      return;

    // Cancel old request
    if (this.searchCustomerRequest) {
      this.searchCustomerRequest.unsubscribe();
    }

    this.searchCustomerRequest = this.http.get('customer', {searchTerm: searchTerm, taskType: this.task_type})
        .subscribe((customers) => {
          this.customerOptions = customers.map((item: Customer) => {
            return {value: item, label: item.text};
          });
        });
  }

  contactTypeSubmit(): void {
    if (this.auto_submit) {
      if (this.contact_type !== this.formData.TaskSystem) {
        this.taskService.editTaskContactType(this.formData.TaskID, this.contact_type);
      }
    }
  }

  expectDateSubmit(): void {
    const expectDate = this.dateObjPipe.transform(this.expect_date);
    const TaskExpectDate = this.dateObjPipe.transform(this.formData.TaskExpectDate);
    const TaskExpectDate_TS = (TaskExpectDate !== null) ? TaskExpectDate.getTime() : null;
    if (this.auto_submit) {
      if (expectDate === null || expectDate.getTime() !== TaskExpectDate_TS) {
        const expect_date = this.momentFormatPipe.transform(this.expect_date, 'YYYY-MM-DD');
        this.taskService.editExpectDate(this.formData.TaskID, expect_date);
      }
    }
  }

  prioritySubmit(): void {
    if (this.auto_submit) {
      if (this.priority !== this.formData.TaskPriority) {
        this.taskService.editPriority(this.formData.TaskID, this.priority);
      }
    }
  }

  reponseBySubmit(): void {
    if (this.auto_submit) {
      if (this.reponse_by.id !== this.formData.ReponsedBy) {
        this.taskService.editReponsedBy(this.formData.TaskID, this.reponse_by.id);
      }
    }
  }

  ccSubmit(): void {
    if (this.auto_submit) {
      const mailCC = this.formData.TaskMail_CC
          .split(',')
          .map(v => v.trim())
          .filter((v, i, a) => a.indexOf(v) === i)
          .sort()
          .join(',');
      if (this.cc !== mailCC) {
        this.taskService.editCC(this.formData.TaskID, this.cc);
      }
    }
  }

  tagSubmit(): void {
    if (this.auto_submit) {
      const tag = this.formData.TaskTag
          .split(',')
          .sort()
          .join(',');
      if (this.tag !== tag) {
        this.taskService.editTag(this.formData.TaskID, this.tag);
      }
    }
  }

  cancelTask(): void {
    this.confirmModelService.open({
      content: 'คุณต้องการยกเลิกงาน ใช่หรือไม่ ?',
      confirmCallback: () => {
        this.taskService.cancelTask(this.formData.TaskID);
      }
    });
  }

  toggleChatEditHistory(): void {
    event.preventDefault();
    this.comment_task_history = !this.comment_task_history;
  }

  commentAttachFilesAdd(event): void {
    const files: FileList = event.target.files;
    this.comment_form.attachment = files;
  }

  commentSubmit(): void {
    if (this.comment_form.message || this.comment_form.attachment) {
      const file = this.comment_form.attachment || null;
      const tempKey = Math.random().toString(36).substr(2);

      this.comments.push({
        TC_Comments: this.comment_form.message,
        TC_CreationDate: null,
        TC_Date: (new Date()).toISOString(),
        TC_ID: null,
        TC_SystermID: null,
        TC_Type: 1,
        TC_USER_EMP_KEY: this.user_emp_key,
        TC_USER_EMP_NAME: this.user_emp_name.split(' ')[0],
        TC_UserID: this.user_id,
        isSelf: true,
        attachList: [],
        tempKey: tempKey
      });

      this.comment_submiting = true;
      this.commentService.addComment(this.formData.TaskID, this.comment_form.message, file, tempKey)
          .then(() => {
            this.comment_submiting = false;
          });

      this.comment_form.message = '';
      this.comment_form.attachment = null;
      setTimeout(() => { this.commentElastic.adjust(); });
    }
  }

  newTaskSubmit(): void {
    this.submitting = true;
    this.taskService.createTask({
      task_type: this.task_type,
      title: this.title,
      detail: this.detail,
      detail_temp_upload: this.detail_temp_upload,
      task_attach: this.attach as UploadedFile[],
      expect_date: (this.reponse_by && this.user_emp_id === this.reponse_by.id) ?
          this.momentFormatPipe.transform(this.expect_date, 'YYYY-MM-DD') :
          null,
      priority: this.priority,
      reponse_by: this.reponse_by ? this.reponse_by.id : null,
      cc: this.cc,
      tag: this.tag,
      company: this.company,
      branch: this.branch,
      approves: this.approves.map((item) => item.id),
      customer: this.customer !== null ? this.customer.id : null,
      cus_contact_type: this.contact_type,
      cus_credit: this.customer_credit
    })
        .then(() => {
          this.submitting = false;
          this.close();
        });
  }
}
