import G6, { Graph } from '@antv/g6';
import { useMount, useReactive } from 'ahooks';
import { Tooltip } from 'antd';
import { random } from 'lodash';
import React, { useRef } from 'react';
import { GraphDataType } from '../type';
import styles from './index.less';

type Props = {
  data: GraphDataType;
};

const KnowledgeGraph: React.FC<Props> = ({ data }) => {
  const graph = useRef<Graph | null>(null);
  const state = useReactive({
    scale: 100,
    isFullscreen: false,
  });

  useMount(() => {
    const container = document.getElementById('graph');
    if (!container) return;
    const width = container.scrollWidth;
    const height = (container.scrollHeight || 500) - 10;
    if (!width || !height) return;
    const graphObj = new G6.Graph({
      container: 'graph',
      width,
      height,
      modes: {
        default: ['drag-canvas', 'drag-node'],
      },
      layout: {
        type: 'gForce',
        linkDistance: 100,
        preventOverlap: true,
        nodeSize: 50,
      },
      animate: true,
    });
    graphObj.node((node) => {
      if (node.level === 0) {
        node.size = 32;
        node.style = {
          lineWidth: 0,
          fill: '#ABE143',
        };
      } else if (node.level === 1) {
        node.size = 24;
        node.style = {
          lineWidth: 0,
          fill: random(0, 1) ? '#7B8FFF' : '#FF6774',
        };
      } else if (node.level === 2) {
        node.size = 16;
        node.style = {
          lineWidth: 0,
          fill: '#FFAF5F',
        };
      } else {
        node.size = 8;
        node.style = {
          lineWidth: 0,
          fill: '#FF7F5F',
        };
      }
      node.labelCfg = {
        position: 'bottom',
        style: {
          fontSize: 12,
          fill: '#333',
        },
      };
      return node;
    });
    graphObj.edge((edge) => {
      edge.style = {
        endArrow: {
          path: 'M 0,0 L 8,4 L 8,-4 Z',
          fill: '#7B8FFF',
          stroke: '#7B8FFF',
        },
        stroke: '#7B8FFF',
      };
      edge.labelCfg = {
        autoRotate: true,
        position: 'middle',
        refX: -G6.Util.getTextSize(edge.label, 12)[0] / 2,
        refY: 12,
        style: {
          fill: '#7B8FFF',
          fontSize: 12,
        },
      };
      return edge;
    });
    graphObj.data(data);
    graphObj.render();
    graph.current = graphObj;

    const resizeObserver = new ResizeObserver((entries) => {
      if (entries.length) {
        const {
          contentRect: { width, height },
        } = entries[0];
        graphObj.changeSize(width, height - 10);
      }
    });

    // 开始观察div元素
    resizeObserver.observe(container);
  });

  const resetPosition = () => {
    graph.current?.fitCenter();
  };

  const scaleIn = () => {
    if (state.scale - 10 < 50) {
      return;
    }
    graph.current?.zoomTo((state.scale - 10) / 100);
    graph.current?.fitCenter();
    state.scale -= 10;
  };

  const scaleOut = () => {
    if (state.scale + 10 > 200) {
      return;
    }
    graph.current?.zoomTo((state.scale + 10) / 100);
    graph.current?.fitCenter();
    state.scale += 10;
  };

  return (
    <div className={styles['container']}>
      <div id="graph"></div>
      <div className={styles['operate']}>
        <Tooltip title="回到初始位置">
          <div
            className={styles['icon-reset-position']}
            onClick={resetPosition}
          ></div>
        </Tooltip>
        <div className={styles['icon-scale']}>
          <Tooltip title="缩小10%">
            <div className={styles['icon-scale-in']} onClick={scaleIn}></div>
          </Tooltip>
          <span>{state.scale}%</span>
          <Tooltip title="放大10%">
            <div className={styles['icon-scale-out']} onClick={scaleOut}></div>
          </Tooltip>
        </div>
        <Tooltip title="全屏">
          <div
            className={
              state.isFullscreen
                ? styles['icon-no-full-screen']
                : styles['icon-full-screen']
            }
            onClick={() => {
              state.isFullscreen = !state.isFullscreen;
              const ele = document.getElementById('graphContent');
              if (!ele) return;
              if (state.isFullscreen) {
                ele!.style.left = '8px';
                ele!.style.borderTopLeftRadius = '8px';
                ele!.style.borderBottomLeftRadius = '8px';
              } else {
                ele!.style.left = '600px';
                ele!.style.borderTopLeftRadius = '0';
                ele!.style.borderBottomLeftRadius = '0';
              }
            }}
          ></div>
        </Tooltip>
      </div>
    </div>
  );
};

export default KnowledgeGraph;
