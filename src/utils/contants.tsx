const video = ['flv', 'rm', 'rmvb', 'wmv', 'avi', 'mp4'];
const compress = ['zip', 'rar', '7z'];
const image = ['jpg', 'png', 'gif', 'jpeg', 'bmp', 'svg', 'psd', 'webp'];
const word = ['docx', 'doc'];
const excel = ['xls', 'xlsx', 'xlsm'];
const ppt = ['ppt', 'pptx'];
const pdf = ['pdf'];
const html = ['html'];
const txt = ['txt'];
const java = ['java'];
const python = ['py'];

const FILE_TYPES = {
  video,
  compress,
  image,
  word,
  excel,
  ppt,
  pdf,
  html,
  txt,
};
export const validateFile: (type: keyof typeof FILE_TYPES, fileType: string) => boolean = (
  type,
  fileType,
) => {
  return FILE_TYPES[type].includes(fileType?.toLocaleLowerCase());
};
export const isVideo = (fileType: string) => validateFile('video', fileType);
export const isCompress = (fileType: string) => validateFile('compress', fileType);
export const isImage = (fileType: string) => validateFile('image', fileType);
export const isWord = (fileType: string) => validateFile('word', fileType);
export const isExcel = (fileType: string) => validateFile('excel', fileType);
export const isPpt = (fileType: string) => validateFile('ppt', fileType);
export const isPdf = (fileType: string) => validateFile('pdf', fileType);
export const isHtml = (fileType: string) => validateFile('html', fileType);
export const isTxt = (fileType: string) => validateFile('txt', fileType);

// 用于attachment.oss.add的attachmentMajorType字段
export function getFileMajorType(fileType: string) {
  if (isVideo(fileType)) {
    return 'VIDEO';
  } else if (isImage(fileType)) {
    return 'IMAGE';
  } else if (
    isExcel(fileType) ||
    isPdf(fileType) ||
    isPpt(fileType) ||
    isWord(fileType) ||
    isCompress(fileType) ||
    isHtml(fileType) ||
    isTxt(fileType)
  ) {
    return 'DOC';
  } else {
    return 'OTHER';
  }
}

export const allowVideoSuffix: string = video.map((item) => '.' + item).join(',');

export function renderResourceIcon(suffixName: string) {
  suffixName = suffixName.toLocaleLowerCase();
  if (word.indexOf(suffixName) != -1) {
    return { type: 'icon-stu_bill_word' };
  } else if (excel.indexOf(suffixName) != -1) {
    return { type: 'icon-stu_bill_xlx' };
  } else if (compress.indexOf(suffixName) != -1) {
    return { type: 'icon-stu_bill_file' };
  } else if (video.indexOf(suffixName) != -1) {
    return { type: 'icon-stu_bill_video' };
  } else if (suffixName == 'pdf') {
    return { type: 'icon-stu_bill_pdf' };
  } else if (ppt.indexOf(suffixName) != -1) {
    return { type: 'icon-stu_bill_p' };
  } else if (image.indexOf(suffixName) != -1) {
    return { type: 'icon-stu_bill_img' };
  } else if (java.indexOf(suffixName) !== -1) {
    return { type: 'icon-java' };
  } else if (python.indexOf(suffixName) !== -1) {
    return { type: 'icon-python' };
  } else {
    return { type: 'icon-stu_bill_file' };
  }
}

// 快速获取26个大小写英文字母
const getLetter = (format: 'toUpperCase' | 'toLowerCase') => {
  const start = format === 'toUpperCase' ? 65 : 97;
  const end = format === 'toUpperCase' ? 91 : 123;
  let count = 0;
  const arr = [];
  for (let i = start; i < end; i++) {
    arr[count] = String.fromCharCode(i);
    count++;
  }
  return arr;
};

// 根据英文字母匹配颜色
export const FORMAT_COLOR = new Map([
  [['0', '1', '2', '3', ...getLetter('toUpperCase').slice(0, 9)], '#FF8000'],
  [['4', '5', '6', ...getLetter('toUpperCase').slice(9, 17)], '#47CC5E'],
  [['7', '8', '9', ...getLetter('toUpperCase').slice(17)], '#4285F4'],
]);
