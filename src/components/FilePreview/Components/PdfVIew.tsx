// import { fullscreen, sliceString } from '@/utils/utils';
// // import { useDebounce } from 'ahooks';
// import {
//   ArrowLeftOutlined,
//   ArrowRightOutlined,
//   FullscreenExitOutlined,
//   FullscreenOutlined,
//   ZoomInOutlined,
//   ZoomOutOutlined,
// } from '@ant-design/icons';
// import { Spin, Tooltip } from 'antd';
// import React, { useState } from 'react';
// import { Document, Page, pdfjs } from 'react-pdf';
// import styles from './PDFViewer.less';
// pdfjs.GlobalWorkerOptions.workerSrc = `/bus_xai_web/pdf.worker.mjs`;

// const loadSize = 5; // 每次加载的页面

// // 统计pdf每一页的高度 当高度一样，则默认通过第一页高度进行计算
// function getPageHeights() {
//   // console.log('111', document.getElementsByClassName('react-pdf__Document'));
//   const arr = document.getElementsByClassName('react-pdf__Document');
//   const pages = arr.length > 0 && (Array.from(arr[0].children) as any);

//   // console.log(pages);
//   const pageHeights =
//     pages.length > 0 && pages.map((item: RecordItem) => item?.offsetHeight);
//   if ([...new Set(pageHeights || [])].length == 1) {
//     return [pageHeights[0]];
//   } else {
//     return (
//       pages.length > 0 && pages.map((item: RecordItem) => item.offsetHeight)
//     );
//   }
// }

// // 通过滚动的高度 来计算当前所在页数 [page1Height，page2Height]
// function getCurrentPage(scrollTop: number) {
//   let heights = getPageHeights();
//   if (heights.length == 1) {
//     return Math.round(scrollTop / heights[0]);
//   }
//   let sumHeight = 0;
//   let page = 0;

//   if (scrollTop < heights[0]) {
//     return page;
//   }

//   for (let i = 0; i < heights.length; i++) {
//     sumHeight += heights[i];
//     if (scrollTop < sumHeight) {
//       page = i;
//       break;
//     }
//   }
//   return page;
// }
// // const cMapUrl = 'https://dbe3-public.oss-cn-beijing.aliyuncs.com/bus-builder/';

// interface Props {
//   filename: string;
//   // width: number;
//   url: string;
// }

// const PdfView: React.FC<Props> = (props: Props) => {
//   const { filename, url } = props;
//   const [pageIndex, setPageIndex] = useState(0);
//   const [pageWidth, setPageWidth] = useState(800);
//   const [numPages, setNumPages] = useState(1);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [loadPages, setLoadPages] = useState(1);
//   const pageLengthArray = Array.from({ length: loadPages });

//   // console.log('4343434343', pageLengthArray, setPageWidth);
//   const switchFullscreen = () => {
//     fullscreen(isFullscreen, document.getElementById('pdf_containr'));
//     setIsFullscreen(!isFullscreen);
//   };

//   const lazyLoadPage = () => {
//     // const { numPages, loadPages } = this.state;
//     if (numPages == loadPages) {
//       return;
//     }
//     if (loadPages + loadSize >= numPages) {
//       setLoadPages(numPages);
//     } else {
//       setLoadPages(loadPages + loadSize);
//     }
//   };

//   // 滚动监听
//   const onScrollHandler = () => {
//     const pdfBox = document.getElementById('pdf') as any;
//     const wrapScrollTop = Math.ceil(pdfBox?.scrollTop);
//     const totalHeight = pdfBox?.scrollHeight;
//     const offsetHeight = pdfBox?.offsetHeight;

//     if (numPages > loadSize) {
//       // 距离底部600像素 加载剩余文档
//       if (wrapScrollTop + offsetHeight > totalHeight - 600) {
//         lazyLoadPage();
//       }
//     }

//     let page = 0;

//     if (wrapScrollTop + offsetHeight >= totalHeight) {
//       page = loadPages - 1;
//     } else {
//       page = getCurrentPage(wrapScrollTop);
//     }

//     setPageIndex(page);
//     // this.setState({ pageIndex });
//   };

//   // console.log('3232323', url);
//   // 定位到指定页
//   const goPage = (index: number) => {
//     if (index == loadPages - 1) {
//       lazyLoadPage();
//     }

//     const heights = getPageHeights();
//     let scrollTop = 0;

//     if (heights.length == 1) {
//       scrollTop = index * heights[0];
//     } else {
//       scrollTop = heights
//         .slice(0, index)
//         .reduce((prev: any, item: RecordItem) => prev + item, 0);
//     }

//     let cfs = document.getElementById('pdf') as any;
//     cfs.scrollTop = scrollTop;

//     setPageIndex(index);
//     // setPageNumberInput(index);
//   };

//   // // 下一页
//   const goForward = () => {
//     // const { pageIndex, numPages } = this.state;
//     if (pageIndex + 1 == numPages) {
//       return;
//     }
//     goPage(pageIndex + 1);
//   };

//   // // 上一页
//   const goBack = () => {
//     // const pageIndex = this.state.pageIndex;
//     if (pageIndex == 0) {
//       return;
//     }
//     goPage(pageIndex - 1);
//   };

//   const onDocumentLoad = (pages: RecordItem) => {
//     setNumPages(pages?.numPages);
//     setLoadPages(pages?.numPages > loadSize ? loadSize : pages?.numPages);

//     window.document.onkeydown = function (ent) {
//       const event = ent || window.event;
//       switch (event.keyCode) {
//         case 33: // pageup
//         case 37: // 左
//         case 38: // 上
//           goBack();
//           // lastPage();
//           break;
//         case 34: // pagedown
//         case 39: // 右
//         case 40: // 下
//           goForward();
//           // nextPage();
//           break;
//       }
//     };
//   };

//   const pageZoomOut = () => {
//     if (pageWidth <= 600) {
//       return;
//     }
//     const w = pageWidth * 0.8;
//     setPageWidth(w);
//     // this.setState({ pageWidth: pageWidth })
//   };
//   const pageZoomIn = () => {
//     const w = pageWidth * 1.2;
//     setPageWidth(w);
//     // this.setState({ pageWidth: pageWidth })
//   };

//   return (
//     <div className={styles.view_wrap} id="pdf_containr">
//       <div className={styles.header}>
//         <p className={styles.pdf_title}>{sliceString(filename, 20)}</p>
//         <div className={styles.btn_group}>
//           <div
//             className={styles.pageTool}
//             style={{ display: 'flex', alignItems: 'center' }}
//           >
//             <Tooltip title={pageIndex + 1 === 1 ? '已是第一页' : '上一页'}>
//               <ArrowLeftOutlined type="left" onClick={goBack} />
//             </Tooltip>
//             <div
//               style={{
//                 display: 'flex',
//                 height: '30px',
//                 alignItems: 'center',
//                 marginLeft: '20px',
//                 marginRight: '20px',
//               }}
//             >
//               <span>{pageIndex + 1 > numPages ? numPages : pageIndex + 1}</span>
//               <span>/</span> {numPages}
//             </div>

//             <Tooltip title={pageIndex == numPages ? '已是最后一页' : '下一页'}>
//               <ArrowRightOutlined type="right" onClick={goForward} />
//             </Tooltip>
//             <Tooltip title="放大">
//               <ZoomInOutlined
//                 type="plus-circle"
//                 onClick={pageZoomIn}
//                 style={{ fontSize: '120%', margin: '0 20px' }}
//               />
//             </Tooltip>
//             <Tooltip title="缩小">
//               <ZoomOutOutlined
//                 type="minus"
//                 onClick={pageZoomOut}
//                 style={{ fontSize: '120%' }}
//               />
//             </Tooltip>
//           </div>
//         </div>
//         <div className={styles.screen_btn} onClick={switchFullscreen}>
//           {isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
//         </div>
//       </div>
//       <div
//         className={styles.pdf_content}
//         id="pdf"
//         onScroll={() => onScrollHandler()}
//       >
//         <div
//           style={{
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             width: '100%',
//           }}
//         >
//           {url ? (
//             <Document
//               file={url}
//               onLoadSuccess={onDocumentLoad}
//               loading={
//                 <div>
//                   <Spin />
//                 </div>
//               }
//               error="文档加载失败，请刷新重试"
//               options={{
//                 cMapUrl: `https://oss-public.seentao.com/webapps/public/cmaps/`,
//                 cMapPacked: true,
//                 // disableWorker: true,
//               }}
//             >
//               {pageLengthArray.map((item: any, index: any) => (
//                 <div id={index} key={item?.id}>
//                   <Page
//                     // pageNumber={pageIndex}
//                     pageIndex={index}
//                     width={pageWidth}
//                     renderAnnotationLayer={false}
//                     renderTextLayer={false}
//                     loading={<Spin size="large" />}
//                     // willReadFrequently={true}
//                   />
//                 </div>
//               ))}
//             </Document>
//           ) : null}
//         </div>
//       </div>
//     </div>
//   );
// };
// export default PdfView;

const PdfVIew = () => {
  return <div>PdfVIew</div>;
};

export default PdfVIew;
