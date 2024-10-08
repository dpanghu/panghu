import deleteIcon from '@/assets/images/deleteIcon.png';
import PDFIcon from '@/assets/images/icon-file_PDF.png';
import WordIcon from '@/assets/images/icon-file_word.png';
import collapseIcon from '@/assets/images/mind_collapse_icon.png';
import fitContentIcon from '@/assets/images/mind_fitContent_icon.png';
import fullscreenIcon from '@/assets/images/mind_fullscreen_icon.png';
import zoomInIcon from '@/assets/images/mind_zoomIn_icon.png';
import zoomOutIcon from '@/assets/images/mind_zoomOut_icon.png';
import { useMount, useReactive } from 'ahooks';
import { Divider } from 'antd';
import React, { useRef } from 'react';
import { TreeGraph } from './TreeGraph';
import styles from './index.less';

interface TProps {
  dataSource: any;
  isFullscreen?: boolean;
  attachmentName?: string;
  attachmentSuffixname?: string;
  getMindGraph?: (graphT: any) => void;
  changeFullscreen?: (isFullscreen: boolean) => void;
}

interface TState {
  collapse: boolean;
}

const TreeMind: React.FC<TProps> = ({
  isFullscreen,
  attachmentSuffixname,
  attachmentName,
  changeFullscreen,
  dataSource,
  getMindGraph,
}) => {
  const graphRef = useRef<TreeGraph | null>(null);

  const state = useReactive<TState>({
    collapse: false,
  });

  const initial = () => {
    const container = document.getElementById('MindMapContainer');
    const width = container?.scrollWidth;
    const height = (container?.scrollHeight || 500) - 20;
    graphRef.current = new TreeGraph(
      width as number,
      height,
      'MindMapContainer',
      {},
    ).resetData(dataSource);
    getMindGraph && getMindGraph(graphRef.current);
  };

  const handleFullscreen = () => {
    changeFullscreen && changeFullscreen(!isFullscreen);
  };

  const handleZoomOut = () => {
    const zoom = graphRef.current?.tree?.getZoom() || 1;
    graphRef.current?.zoomTo(zoom + 0.25);
  };

  const handleZoomIn = () => {
    const zoom = graphRef.current?.tree?.getZoom() || 1;
    graphRef.current?.zoomTo(zoom - 0.25);
  };

  const handleFitContent = () => {
    graphRef.current?.tree?.fitView();
  };

  const handleCollapse = () => {
    // 判断根节点是否为收起状态
    const node = graphRef.current?.tree?.findById('0');
    const model = node?.getModel();
    state.collapse = !state.collapse;
    graphRef.current?.setLeafLevelCollapse(state.collapse);
  };

  useMount(() => {
    initial();
  });

  return (
    <div className={styles.mindMapContent} draggable={false}>
      {isFullscreen && (
        <div className={styles.fileTypeIcon}>
          <img
            src={
              ['pdf', 'PDF'].includes(attachmentSuffixname || '')
                ? PDFIcon
                : WordIcon
            }
            alt=""
            className={styles.fileTypeIcon}
          />
          <span>{attachmentName}</span>
        </div>
      )}
      {isFullscreen && (
        <img
          className={styles.exitFullscreen}
          src={deleteIcon}
          alt=""
          onClick={handleFullscreen}
        />
      )}
      <div
        id="MindMapContainer"
        style={{ width: '100%', height: '100%' }}
      ></div>
      <div
        className={styles.toolBar}
        style={isFullscreen ? { bottom: '24px' } : {}}
      >
        <div className={styles.iconBox}>
          <img
            draggable={false}
            src={fitContentIcon}
            alt=""
            onClick={handleFitContent}
          />
          <Divider type="vertical" />
          <img
            draggable={false}
            src={collapseIcon}
            alt=""
            onClick={handleCollapse}
          />
          <Divider type="vertical" />
          <img
            draggable={false}
            src={zoomInIcon}
            alt=""
            onClick={handleZoomIn}
          />
          <Divider type="vertical" />
          <img
            draggable={false}
            src={zoomOutIcon}
            alt=""
            onClick={handleZoomOut}
          />
        </div>
        <div className={styles.fullscreenIcon}>
          <img src={fullscreenIcon} alt="" onClick={handleFullscreen} />
        </div>
      </div>
    </div>
  );
};

export default TreeMind;
