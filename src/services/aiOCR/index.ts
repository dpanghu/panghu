import { $axios } from '@/utils/http';
//查询预制图片
export async function getPrefabPic(params?: RecordItem) {
    return $axios.request({
        url: '/widget/xai/pic/recognition/preset/page',
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
    });
}
