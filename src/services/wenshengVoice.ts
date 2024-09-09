import { $axios } from '@/utils/http';

// AI上传
export async function widgetDtcTTS<T>(params?: RecordItem): Promise<T> {
  return $axios.request({
    url: '/widget/xai/dtc/tts',
    method: 'POST',
    params,
    isJSON: true,
    hiddenLoading: true,
  });
}

export async function randomExampleVolume<T>(params?: RecordItem): Promise<T> {
  return $axios.request({
    url: '/xai/plugin/example/random',
    method: 'POST',
    params,
  });
}
