const sizeM = 1024 * 1024; //1m

const video = ['flv', 'rm', 'rmvb', 'wmv', 'avi', 'mp4'];
const compress = ['zip', 'rar', '7z'];
const image = ['jpg', 'png', 'gif', 'jpeg', 'bmp', 'svg', 'psd'];
const word = ['docx', 'doc'];
const excel = ['xls', 'xlsx', 'xlsm'];
const ppt = ['ppt', 'pptx'];
const pdf = ['pdf'];
const html = ['html'];
const compressed_file = ['zip', 'rar', '7z']; //  压缩文件类型
const showImgType = ['jpg', 'png', 'gif', 'jpeg', 'webp'];
const txt = ['txt'];

export const previewFile = [...word, ...excel, ...ppt, ...pdf, ...txt, ...html, ...image, ...video];
export const SUMMARY = [...word, ...ppt, ...pdf, ...compressed_file];

export const returnFileType = (file: any) => {
  if ([...word, ...excel, ...ppt, ...pdf, ...txt, ...html].includes(file)) {
    return 'FILE';
  }
  if (image.includes(file)) {
    return 'IMAGE';
  }
  if (video.includes(file)) {
    return 'VIDEO';
  }
  return null;
};

export const FILE_TYPES = {
  video,
  compress,
  image,
  word,
  excel,
  ppt,
  pdf,
  html,
  compressed_file,
  showImgType,
  txt,
};

export const validateFile: (type: keyof typeof FILE_TYPES, fileType: string) => boolean = (
  type,
  fileType,
) => {
  return FILE_TYPES[type]?.includes(fileType?.toLocaleLowerCase());
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

export const validateResourceAllowFileType = (fileType: string) => {
  return (
    isVideo(fileType) ||
    isCompress(fileType) ||
    isImage(fileType) ||
    isWord(fileType) ||
    isExcel(fileType) ||
    isPpt(fileType) ||
    isPdf(fileType)
  );
};

/**
 * @description 通过文件后缀输出文件icon
 * @param fileType 文件后缀
 * @returns icon图标类型
 */
export function renderIconWithFileType(fileType: string) {
  if (isPpt(fileType)) {
    return 'icon-file_ppt';
  } else if (isImage(fileType)) {
    return 'icon-file_image';
  } else if (isVideo(fileType)) {
    return 'icon-file_video';
  } else if (isPdf(fileType)) {
    return 'icon-file_PDF';
  } else if (isWord(fileType)) {
    return 'icon-file_word';
  } else if (isExcel(fileType)) {
    return 'icon-file_Excel';
  } else if (isCompress(fileType)) {
    return 'icon-stu_bill_file';
  } else if (fileType == 'dir') {
    return 'icon-stu_icon_mater';
  } else {
    return 'icon-file_other';
  }
}

// 用于attachment.oss.add的attachmentMajorType字段
export function getFileMajorType(fileType: string) {
  if (isVideo(fileType)) {
    return 'VIDEO';
  } else if (isImage(fileType)) {
    return 'IMAGE';
  } else if (isExcel(fileType) || isPdf(fileType) || isPpt(fileType) || isWord(fileType)) {
    return 'DOC';
  } else {
    return 'OTHER';
  }
}

export function getFileType(fileType: string) {
  if (isVideo(fileType)) {
    return '1';
  } else if (isImage(fileType)) {
    return '3';
  } else if (isExcel(fileType) || isPdf(fileType) || isPpt(fileType) || isWord(fileType)) {
    return '4';
  }
  return '';
}

// 所有支持的文件后缀集合
export const allowFileSuffix: string = Array(0)
  .concat(compress, excel, image, ppt, pdf, word)
  .map((item) => '.' + item)
  .join(',');

export const allowVideoSuffix: string = video.map((item) => '.' + item).join(',');

export function isAllowUploadFileWithSize(fileType: string, fileSize: number) {
  if (isPdf(fileType) || isWord(fileType) || isExcel(fileType) || isPpt(fileType)) {
    return fileSize < 100 * sizeM;
  } else if (isVideo(fileType)) {
    return fileSize < 2 * 1024 * sizeM;
  } else if (isImage(fileType)) {
    return fileSize < 2 * sizeM;
  } else if (isCompress(fileType)) {
    return fileSize < 500 * sizeM;
  }
  return;
}

// 目录类型
export const ATTACHMENT_TYPE = {
  FOLDER: 'FOLDER',
  FILE: 'FILE',
};

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
  } else {
    return { type: 'icon-stu_bill_file' };
  }
}
