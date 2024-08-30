import { getConvertParamId } from '@/services/aiJobHunt';
import { useMount, useReactive } from 'ahooks';

export default function DocumentSummaryModel() {
  const extraParams = JSON.parse(
    window.sessionStorage.getItem('queryParams') || '{}',
  );

  const state = useReactive({
    paramsId: '',
  });

  const getParamId = async () => {
    try {
      const result = await getConvertParamId(extraParams);
      state.paramsId = result;
    } catch (error) {}
  };

  useMount(() => {
    getParamId();
  });

  return {
    paramsId: state.paramsId,
  };
}
