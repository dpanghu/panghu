import ICON_FILE_EXCEL from '@/assets/images/fileIcon/icon-file_Excel@2x.png';
import ICON_FILE_HREF from '@/assets/images/fileIcon/icon-file_href@2x.png';
import ICON_FILE_IMAGE from '@/assets/images/fileIcon/icon-file_image@2x.png';
import ICON_FILE_PDF from '@/assets/images/fileIcon/icon-file_PDF@2x.png';
import ICON_FILE_PPT from '@/assets/images/fileIcon/icon-file_ppt@2x.png';
import ICON_FILE_VIDEO from '@/assets/images/fileIcon/icon-file_video@2x.png';
import ICON_FILE_WORD from '@/assets/images/fileIcon/icon-file_word@2x.png';
import ICON_FILE_ZIP from '@/assets/images/fileIcon/icon-file_zip@2x.png';
import ICON_FILE_CSV from '@/assets/images/fileIcon/icon-file-csv@2x.png';
import ICON_FILE_RAR from '@/assets/images/fileIcon/icon-file-rar@2x.png';

const video = ['flv', 'rm', 'rmvb', 'wmv', 'avi', 'mp4'];
const compressZip = ['zip'];
const compressRar = ['rar'];
const image = ['jpg', 'png', 'gif', 'jpeg', 'bmp', 'svg', 'psd', 'webp'];
const word = ['docx', 'doc'];
const excel = ['xls', 'xlsx', 'xlsm'];
const ppt = ['ppt', 'pptx'];
const pdf = ['pdf'];
const csv = ['csv'];
const compressed = ['zip', 'rar', '7z']; //  压缩文件类型

/**
 * 获取文件名的后缀（扩展名）
 * @param {string} fileName - 完整的文件名，包括路径和扩展名
 * @return {string} - 文件的后缀（扩展名），不包含点（.）
 */
const getFileExtension = (fileName: string) => {
  if (!fileName) {
    return '';
  }
  const lastDotIndex = fileName.lastIndexOf('.');
  if (lastDotIndex === -1) {
    return '';
  } // 没有找到点，返回空字符串
  return fileName.slice(lastDotIndex + 1);
};

/**
 *  @description 根据文件类型  获取 Icon
 *  @param suffixName 文件后缀 pdf/ppt/png...
 *  @returns Icon
 */
const obtainIconBasedFileType = (suffixName?: string) => {
  const lowCaseSuffixName = suffixName?.toLowerCase();
  if (!lowCaseSuffixName) {
    return ICON_FILE_HREF;
  } else if (video.includes(lowCaseSuffixName)) {
    return ICON_FILE_VIDEO;
  } else if (compressZip.includes(lowCaseSuffixName)) {
    return ICON_FILE_ZIP;
  } else if (compressRar.includes(lowCaseSuffixName)) {
    return ICON_FILE_RAR;
  } else if (image.includes(lowCaseSuffixName)) {
    return ICON_FILE_IMAGE;
  } else if (word.includes(lowCaseSuffixName)) {
    return ICON_FILE_WORD;
  } else if (excel.includes(lowCaseSuffixName)) {
    return ICON_FILE_EXCEL;
  } else if (ppt.includes(lowCaseSuffixName)) {
    return ICON_FILE_PPT;
  } else if (pdf.includes(lowCaseSuffixName)) {
    return ICON_FILE_PDF;
  } else if (csv.includes(lowCaseSuffixName)) {
    return ICON_FILE_CSV;
  } else if (compressed.includes(lowCaseSuffixName)) {
    return ICON_FILE_ZIP;
  } else {
    return ICON_FILE_HREF;
  }
};

export {
  ICON_FILE_EXCEL,
  ICON_FILE_HREF,
  ICON_FILE_IMAGE,
  ICON_FILE_PDF,
  ICON_FILE_PPT,
  ICON_FILE_VIDEO,
  ICON_FILE_WORD,
  ICON_FILE_ZIP,
  obtainIconBasedFileType,
  getFileExtension,
};
