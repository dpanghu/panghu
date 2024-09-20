import { useState } from 'react';
import { UploadDataType } from './type';

export default function DataVisualizationStore() {
  const [fileList, setFileList] = useState<UploadDataType[]>([]);
  return { fileList, setFileList };
}
