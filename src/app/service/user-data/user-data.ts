export class UserRight {
  RightName: string;
  active: boolean;
  canAdd: boolean;
  canDelete: boolean;
  canEdit: boolean;
}

export class UserData {
  UserID: number;
  UserName: string;
  UserBranchID: number;
  UserCode: string;
  UserCompany: string;
  UserEmpKey: number;
  UserEmpID: number;
  UserRTName: string;
  UserEmail: string;
  userRights: UserRight[];
  environment: {
    name: string;
    hostname: string;
    database: string;
  };
}
