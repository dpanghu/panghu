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
        isJSON: true
    });
}

//上传图片

export async function uploadPic(params?: RecordItem) {
    return $axios.request({
        url: '/widget/xai/pic/recognition/upload',
        method: 'POST',
        params,
        isJSON: true
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
