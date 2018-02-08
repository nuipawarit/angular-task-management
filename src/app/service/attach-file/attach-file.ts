export class UploadedFile {
  filExtension: string;
  fileName: string;
  isExist: boolean;
  isImage: boolean;
  serverFileName: string;
  fileUrl: string;
}

export class AttachFile extends UploadedFile {
  TAF_CreationDate: string;
  TAF_Date: string;
  TAF_FileName: string;
  TAF_FileNameDB: string;
  TAF_ID: number;
  TAF_SystermID: number;
  TAF_Terminal: number;
  TAF_Type: number;
  TAF_UserID: number;
  TC_ID: number;
}
