import PageLoading from '@/components/PageLoading';
import ReactDOM from 'react-dom';

const collectors = new Map<string, string>();

const getLoadingDom = () => {
  let loadingDom = document.getElementById('page-loading');

  if (!loadingDom) {
    loadingDom = document.createElement('div');
    loadingDom.setAttribute('id', 'page-loading');
    document.body.appendChild(loadingDom);
  }
  return loadingDom;
};

const showLoading = (url: string, tip?: string) => {
  if (collectors.size === 0) {
    const loadingDom = getLoadingDom();
    // collectors.set(url, url);
    ReactDOM.render(<PageLoading tip={tip} />, loadingDom);
  }
  collectors.set(url, url);
};

const clearLoading = (url: string, show: any) => {
  try {
    if (url && collectors.has(url)) {
      collectors.delete(url);
    }
    if (collectors.size === 0 && !show) {
      const flag = ReactDOM.unmountComponentAtNode(
        document.getElementById('page-loading') as HTMLDivElement,
      );
      const loadingChild = document.getElementById('custom_loading');
      const loadingParent = getLoadingDom();
      if (!flag && loadingChild && loadingParent) {
        loadingParent?.removeChild(loadingChild as HTMLElement);
      }
    }
  } catch (error) {}
};
export { showLoading, clearLoading };
