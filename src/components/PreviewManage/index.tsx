import {
  isExcel,
  isImage,
  isPdf,
  isPpt,
  isVideo,
  isWord,
} from '@/components/UploadRepositoryModal/components/contants';
import DocViewer from './components/docViewer';
import ImageViewer from './components/imageViewer';
import PDFViewer from './components/pdfViewer';
import VideoViewer from './components/videoViewer';

type IProps = {
  url: string;
  fileType: string;
  height?: any;
};
const Preview: React.FC<IProps> = ({ url, fileType, height }) => {
  if (isVideo(fileType)) {
    return <VideoViewer url={url} height={height} />;
  } else if (isImage(fileType)) {
    return <ImageViewer url={url} />;
  } else if (isPdf(fileType)) {
    return <PDFViewer url={url} height={height} />;
  } else if (isExcel(fileType) || isPpt(fileType) || isWord(fileType)) {
    return <DocViewer url={url} />;
  } else {
    return null;
  }
};

export default Preview;
