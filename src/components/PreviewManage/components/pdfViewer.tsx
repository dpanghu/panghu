import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
} from '@ant-design/icons';
import { useFullscreen, useInfiniteScroll } from 'ahooks';
import { Anchor, Spin } from 'antd';
import classnames from 'classnames';
import React, { useRef, useState } from 'react';
import { Document, Page } from 'react-pdf';
import styles from './pdfView.less';

const { Link } = Anchor;
const loadLimit = 20; //每次加载数量

interface Result {
  list: string[];
  nextId: string | undefined;
}

let resultData: string[] = [];

function getLoadMoreList(nextId: string | undefined, limit: number): Promise<Result> {
  let start = 0;
  if (nextId) {
    start = resultData.findIndex((i) => i === nextId);
  }
  const end = start + limit;
  const list = resultData.slice(start, end);
  const nId = resultData.length >= end ? resultData[end] : undefined;
  return new Promise((resolve) => {
    resolve({
      list,
      nextId: nId,
    });
  });
}

interface IProps {
  url: string;
  width?: number;
  cMapUrl?: string;
  height?: any;
}

const PDFViewer: React.FC<IProps> = (props) => {
  const [totalPages, setTotalPages] = useState(1);
  const [loaded, setLoaded] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);

  const pdfViewRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const [isFullscreen, { toggleFullscreen }] = useFullscreen(wrapRef);
  const { data, reload, loadMore, loadingMore, noMore } = useInfiniteScroll(
    (d) => getLoadMoreList(d?.nextId, loadLimit),
    {
      target: pdfViewRef,
      isNoMore: (d) => d?.nextId === undefined,
      manual: true,
      threshold: 200,
    },
  );

  const onDocumentLoad = ({ numPages }: any) => {
    setTotalPages(numPages);
    setLoaded(true);
    resultData = Array.from({ length: numPages }, (item, index) => index + '');
    reload();
  };

  // 定位到指定页
  function goPage(index: number) {
    document.getElementById('page_' + index)?.scrollIntoView();
  }

  //下一页
  function goForward() {
    if (data?.list.length === pageIndex + 1 && !noMore) {
      loadMore();
    }
    goPage(pageIndex + 1);
  }

  //上一页
  function goBack() {
    goPage(pageIndex - 1);
  }

  // 滚动监听
  function onScrollHandler(pageId: string) {
    pageId = pageId.replace('#page_', '');

    setPageIndex(Number(pageId));
  }

  const disableb = pageIndex <= 0;
  const disablef = pageIndex >= totalPages - 1;

  const width = isFullscreen ? window.screen.width : props.width;

  return (
    <div className={styles.view_wrap} id="pdf_containr" ref={wrapRef}>
      <Anchor
        onChange={onScrollHandler}
        // offsetTop={200}
        getContainer={() => document.getElementById('pdf') as HTMLElement}
        style={{ display: 'none' }}
      >
        {Array.from({ length: totalPages }, (item, index) => (
          <Link href={`#page_${index}`} title="page" key={index} />
        ))}
      </Anchor>
      <div className={styles.header}>
        <div className={styles.btn_group}>
          <ArrowLeftOutlined
            className={classnames(styles.left, (!loaded || disableb) && styles.ban)}
            onClick={goBack}
          />
          <div className={styles.center}>
            {pageIndex + 1}/{totalPages}页
          </div>
          <ArrowRightOutlined
            className={classnames(styles.right, (!loaded || disablef) && styles.ban)}
            onClick={goForward}
          />
        </div>
        <div className={styles.screen_btn} onClick={toggleFullscreen}>
          {isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
        </div>
      </div>
      <div className={styles.pdf_content} id="pdf" ref={pdfViewRef}>
        <Spin spinning={loadingMore}>
          <div style={{ height: props.height, width, margin: '0 auto' }}>
            {props.url ? (
              <Document
                file={props.url}
                onLoadSuccess={onDocumentLoad}
                loading={<Spin />}
                error="文档加载失败，请刷新重试"
                options={{
                  cMapUrl: props.cMapUrl,
                  cMapPacked: true,
                }}
              >
                {data?.list.map((item: any, index) => (
                  <div id={`page_${item}`} key={item.id}>
                    <Page width={width} pageIndex={index} />
                  </div>
                ))}
              </Document>
            ) : null}
          </div>
        </Spin>
      </div>
    </div>
  );
};

PDFViewer.defaultProps = {
  width: 948,
  cMapUrl: 'https://oss-public.seentao.com/webapps/public/cmaps/',
};

export default PDFViewer;
