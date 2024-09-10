import { $axios } from '@/utils/http';
//查询图片列表
export async function getImageList(params?: RecordItem) {
  return $axios.request({
    url: '/widget/xai/pic/recognition/list',
    method: 'GET',
    params,
  });
}

// 文字识别
export async function TextRecognition(params?: RecordItem) {
  return $axios.request({
    url: '/widget/xai/pic/recognition',
    method: 'POST',
    params,
    isJSON: true,
    hiddenLoading: true,
  });
}

//果蔬识别
export async function FruitRecognition(params?: RecordItem) {
  return $axios.request({
    url: '/widget/xai/pic/fruit',
    method: 'POST',
    params,
    isJSON: true,
    hiddenLoading: true,
  });
}

//车牌识别
export async function CarRecognition(params?: RecordItem) {
  return $axios.request({
    url: '/widget/xai/pic/carplate',
    method: 'POST',
    params,
    isJSON: true,
    hiddenLoading: true,
  });
}

//物体识别
export async function ObjectRecognition(params?: RecordItem) {
  return $axios.request({
    url: '/widget/xai/pic/general',
    method: 'POST',
    params,
    isJSON: true,
    hiddenLoading: true,
  });
}

//上传图片

export async function uploadPic(params?: RecordItem) {
  return $axios.request({
    url: '/widget/xai/pic/recognition/upload',
    method: 'POST',
    params,
    isJSON: true,
  });
}

//删除图片
export async function deletePic(params?: RecordItem) {
  return $axios.request({
    url: '/widget/xai/pic/recognition/del',
    method: 'POST',
    params,
  });
}

// 获取oss上传参数接口
export async function uploads(params?: RecordItem) {
  return $axios.request({
    url: '/dbe3.private.params.upload.get',
    method: 'GET',
    params,
  });
}
