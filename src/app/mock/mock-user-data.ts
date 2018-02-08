import {UserData} from '../service/user-data/user-data';

export const mockUserData: UserData = {
  UserID: 100,
  UserName: 'Test User',
  UserBranchID: 1,
  UserCode: '',
  UserCompany: '',
  UserEmpKey: 1000,
  UserEmpID: 1000,
  UserRTName: '',
  UserEmail: 'test@ss.co.th',
  userRights: [],
  environment: {
    name: 'unit test',
    hostname: '',
    database: ''
  }
};
