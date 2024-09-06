import React from 'react';
import FileViewer from './Components/FileView';
import PdfView from './Components/PdfVIew';

interface TProps {
  materialId: string;
  fileName: string;
  learnUrl: string;
}

const FilePreview: React.FC<TProps> = (props) => {
  const { learnUrl, fileName, materialId } = props;
  return learnUrl !== '0' && learnUrl ? (
    learnUrl.split('.').pop() == 'pdf' ? (
      <PdfView filename={fileName} url={learnUrl} />
    ) : (
      <FileViewer attachmentId={materialId} url={learnUrl} />
    )
  ) : (
    <div>暂时没有可预览的文档</div>
  );
};
export default FilePreview;
