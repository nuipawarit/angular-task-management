import {AttachFile} from '../attach-file/attach-file';

export class Comment {
  TC_Comments: string;
  TC_CreationDate: string;
  TC_Date: string;
  TC_ID: number;
  TC_SystermID: number;
  TC_Type: number;
  TC_USER_EMP_KEY: number;
  TC_USER_EMP_NAME: string;
  TC_UserID: number;
  isSelf: boolean;
  attachList: AttachFile[];
  tempKey?: string;
}
