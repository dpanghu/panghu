import PageLoading from '@/components/PageLoading';
import { createRoot } from 'react-dom/client';

const collectors = new Map<string, string>();
let pageLoading = null;

const getLoadingDom = () => {
  let loadingDom = document.getElementById('page-loading');

  if (!loadingDom) {
    loadingDom = document.createElement('div');
    loadingDom.setAttribute('id', 'page-loading');
    document.body.appendChild(loadingDom);
  }
  return loadingDom;
};

const showLoading = (url: string, show: any) => {
  if (collectors.size === 0 && show === undefined) {
    const loadingDom = getLoadingDom();
    pageLoading = createRoot(loadingDom);
    pageLoading.render(<PageLoading />);
  }
  collectors.set(url, url);
};

const clearLoading = (url: string, show: any) => {
  if (url && collectors.has(url)) {
    collectors.delete(url);
  }
  if (collectors.size === 0 && show === undefined) {
    pageLoading?.unmount();
  }
};

export { showLoading, clearLoading };
