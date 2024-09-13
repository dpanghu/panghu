import { FileType } from './constants';

export type UploadDataType = {
  classId: string;
  createTime: string;
  creator: string;
  fileName: string;
  fileUrl: string;
  id: string;
  modelId: string;
  modifyTime: string;
  userId: string;
  modifier?: string;
  onAnalysis?: string;
  fileType: FileType;
  fileSize: string;
  presetFileId?: string;
};

export type DetailResponseType = {
  file: UploadDataType;
  columns: any[];
  data: any[];
};

export type UploadResult = {
  file: UploadDataType;
};
