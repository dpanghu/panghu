import deleteIcon from '@/assets/images/deleteIcon.png';
import PDFIcon from '@/assets/images/icon-file_PDF.png';
import WordIcon from '@/assets/images/icon-file_word.png';
import collapseIcon from '@/assets/images/mind_collapse_icon.png';
import fitContentIcon from '@/assets/images/mind_fitContent_icon.png';
import fullscreenIcon from '@/assets/images/mind_fullscreen_icon.png';
import zoomInIcon from '@/assets/images/mind_zoomIn_icon.png';
import zoomOutIcon from '@/assets/images/mind_zoomOut_icon.png';
import { sliceString } from '@/utils/utils';
import Hierarchy from '@antv/hierarchy';
import { Cell, Graph, Path } from '@antv/x6';
import { useMount } from 'ahooks';
import { Divider } from 'antd';
import { nanoid } from 'nanoid';
import React, { useEffect, useRef } from 'react';
import styles from './index.less';

type TDateSource = {
  name: string;
  children?: TDateSource[];
  [key: string]: any;
};

interface TProps {
  dataSource: TDateSource;
  isFullscreen?: boolean;
  attachmentName?: string;
  attachmentSuffixname?: string;
  getMindGraph?: (graphT: Graph) => void;
  changeFullscreen?: (isFullscreen: boolean) => void;
}

interface MindMapData {
  id: string;
  type: 'topic' | 'topic-branch' | 'topic-child';
  label: string;
  width: number;
  height: number;
  children?: MindMapData[];
}

interface HierarchyResult {
  id: string;
  x: number;
  y: number;
  data: MindMapData;
  children?: HierarchyResult[];
}

// 定义节点
const MindMap: React.FC<TProps> = ({
  dataSource,
  getMindGraph,
  changeFullscreen,
  attachmentName,
  isFullscreen,
  attachmentSuffixname,
}) => {
  const graphRef = useRef<Graph | null>(null);
  const findChildrenById = (node: RecordItem, id: string) => {
    // 检查当前节点的 id 是否匹配传入的 id
    if (node.id === id) {
      // 如果匹配，返回当前节点的所有子节点
      return node.children || [];
    }

    // 如果当前节点有子节点，递归查找
    if (node.children && node.children.length > 0) {
      for (let child of node.children) {
        const result: RecordItem[] = findChildrenById(child, id);
        if (result.length > 0) {
          return result;
        }
      }
    }
    // 如果没有找到匹配的 id，返回空数组
    return [];
  };

  const getAllIds = (nodes: RecordItem[]) => {
    const ids: string[] = [];

    function traverse(node: RecordItem) {
      // 将当前节点的 id 添加到 ids 数组中
      ids.push(node.id);
      // 如果当前节点有子节点，递归遍历每个子节点
      if (node.children && node.children.length > 0) {
        node.children.forEach((child: any) => traverse(child));
      }
    }
    // 遍历传入的节点数组
    nodes.forEach((node) => traverse(node));
    return ids;
  };

  const traversalTreeData = (
    dataSource: RecordItem[],
    result: RecordItem[],
  ) => {
    dataSource.forEach((item) => {
      const newItem = {
        id: nanoid(),
        type: 'topic-child',
        label: item.name,
        width: 60,
        height: 30,
        children: [],
      };
      result.push(newItem);
      if (item.children?.length) {
        traversalTreeData(item.children, newItem.children);
      }
    });
    return result;
  };

  // 将数据格式化为标准格式
  const formatData = (dataSource: RecordItem) => {
    let result: RecordItem = [];
    if (dataSource.name) {
      result = {
        id: nanoid(),
        type: 'topic',
        label: sliceString(dataSource.name, 7, '...'),
        title: dataSource.name,
        width: 160,
        height: 50,
      };
    }
    if (dataSource.children?.length) {
      result.children = dataSource.children.map((item: RecordItem) => {
        const childrenArr: RecordItem[] = [];
        return {
          id: nanoid(),
          type: 'topic-branch',
          label: sliceString(item.name, 7, '...'),
          title: item.name,
          width: 120,
          height: 40,
          children: item.children?.length
            ? traversalTreeData(item.children, childrenArr)
            : [],
        };
      });
    }
    return result;
  };

  const initMindMap = () => {
    // 中心主题
    Graph.registerNode(
      'topic',
      {
        inherit: 'rect',
        markup: [
          {
            tagName: 'rect',
            selector: 'body',
          },
          {
            tagName: 'image',
            selector: 'img',
          },
          {
            tagName: 'text',
            selector: 'label',
          },
        ],
        attrs: {
          body: {
            rx: 6,
            ry: 6,
            stroke: 'transparent',
            fill: {
              type: 'linearGradient',
              stops: [
                { offset: '0%', color: '#5F75FF' },
                { offset: '60%', color: '#8883FF' },
                { offset: '100%', color: '#B092FF' },
              ],
            },
            strokeWidth: 1,
          },
          img: {
            ref: 'body',
            refX: '100%',
            refY: '50%',
            refY2: -8,
            width: 16,
            height: 16,
            // 'xlink:href':
            //   'https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*SYCuQ6HHs5cAAAAAAAAAAAAAARQnAQ',
            // event: 'add:topic',
            // class: 'topic-image',
          },
          label: {
            fontSize: 14,
            fill: '#fff',
          },
        },
      },
      true,
    );

    // 分支主题
    Graph.registerNode(
      'topic-branch',
      {
        inherit: 'rect',
        markup: [
          {
            tagName: 'rect',
            selector: 'body',
          },
          {
            tagName: 'image',
            selector: 'img',
          },
          {
            tagName: 'text',
            selector: 'label',
          },
        ],
        attrs: {
          body: {
            rx: 6,
            ry: 6,
            stroke: '#D8C6FF',
            fill: '#F6F1FF',
            strokeWidth: 1.5,
          },
          img: {
            ref: 'body',
            refX: '100%',
            refY: '50%',
            refY2: -8,
            width: 16,
            height: 16,
            // 'xlink:href':
            //   'https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*SYCuQ6HHs5cAAAAAAAAAAAAAARQnAQ',
            event: 'node:collapse',
            // class: 'topic-image',
          },
          label: {
            fontSize: 14,
            fill: '#9D72F0',
            ellipsis: true, // 文本超出显示范围时，自动添加省略号
          },
        },
      },
      true,
    );

    // 子主题
    Graph.registerNode(
      'topic-child',
      {
        inherit: 'rect',
        markup: [
          {
            tagName: 'rect',
            selector: 'body',
          },
          {
            tagName: 'text',
            selector: 'label',
          },
          {
            tagName: 'path',
            selector: 'line',
          },
        ],
        attrs: {
          body: {
            fill: 'transparent',
            strokeWidth: 0,
            // stroke: '#5F95FF',
          },
          label: {
            fontSize: 14,
            fill: '#262626',
            textVerticalAnchor: 'bottom',
            textAnchor: 'start',
            ellipsis: true, // 文本超出显示范围时，自动添加省略号
            breakWord: true, // 是否截断单词
          },
          line: {
            stroke: '#DCCAFF',
            strokeWidth: 2,
            d: 'M 0 15 L 160 15',
          },
        },
      },
      true,
    );

    // 连接器
    Graph.registerConnector(
      'mindmap',
      (sourcePoint, targetPoint, routerPoints, options) => {
        const midX = sourcePoint.x + 10;
        const midY = sourcePoint.y;
        const ctrX = (targetPoint.x - midX) / 5 + midX;
        const ctrY = targetPoint.y;
        const pathData = `
       M ${sourcePoint.x} ${sourcePoint.y}
       L ${midX} ${midY}
       Q ${ctrX} ${ctrY} ${targetPoint.x} ${targetPoint.y}
      `;
        return options.raw ? Path.parse(pathData) : pathData;
      },
      true,
    );

    // 边
    Graph.registerEdge(
      'mindmap-edge',
      {
        inherit: 'edge',
        connector: {
          name: 'mindmap',
        },
        attrs: {
          line: {
            targetMarker: '',
            stroke: {
              type: 'linearGradient',
              stops: [
                { offset: '0%', color: '#DCCAFF' },
                { offset: '100%', color: '#DCCAFF' },
              ],
            },
            strokeWidth: 2,
          },
        },
        zIndex: 0,
      },
      true,
    );

    const data: any = formatData(dataSource);
    const graph = new Graph({
      container: document.getElementById('MindMapContainer')!,
      connecting: {
        connectionPoint: 'anchor',
      },
      selecting: {
        enabled: true,
      },
      scaling: {
        min: 0.25,
        max: 2,
      },
      panning: true,
      mousewheel: true,
      interacting: false,
      keyboard: {
        enabled: true,
      },
    });

    graphRef.current = graph;
    getMindGraph && getMindGraph(graph);

    // graph.on('add:topic', ({ node }: { node: Node }) => {
    //   const { id } = node;
    //   const result = findChildrenById(data, id);
    //   const ids: string[] = getAllIds(result);
    //   node.setZIndex(99);
    //   // node.isVisible() ? node.hide() : node.show();
    //   ids.forEach((item) => {
    //     const cell = graph.getCellById(item);
    //     // cell.isVisible() ? cell.hide() : cell.show();
    //     cell.toggleVisible();
    //   });
    //   // node.visible = true;
    //   // const collapsed = node.isCollapsed();
    //   // const cells = node.getDescendants();
    //   // cells.forEach((node: any) => {
    //   //   if (collapsed) {
    //   //     node.hide();
    //   //   } else {
    //   //     node.show();
    //   //   }
    //   // });
    // });

    const render = () => {
      const result: HierarchyResult = Hierarchy.mindmap(data, {
        direction: 'H',
        getHeight(d: MindMapData) {
          return d.height;
        },
        getWidth(d: MindMapData) {
          return d.width;
        },
        getHGap() {
          return 40;
        },
        getVGap() {
          return 20;
        },
        getSide: () => {
          return 'right';
        },
      });
      const cells: Cell[] = [];
      const traverse = (hierarchyItem: HierarchyResult) => {
        if (hierarchyItem) {
          const { data, children } = hierarchyItem;
          cells.push(
            graph.createNode({
              id: data.id,
              shape: data.type,
              x: hierarchyItem.x,
              y: hierarchyItem.y,
              width: data.width,
              height: data.height,
              label: data.label,
              type: data.type,
            }),
          );
          if (children) {
            children.forEach((item: HierarchyResult) => {
              const { id, data } = item;
              cells.push(
                graph.createEdge({
                  shape: 'mindmap-edge',
                  source: {
                    cell: hierarchyItem.id,
                    anchor:
                      data.type === 'topic-child'
                        ? {
                            name: 'right',
                            args: {
                              dx: -16,
                            },
                          }
                        : {
                            name: 'center',
                            args: {
                              dx: '25%',
                            },
                          },
                  },
                  target: {
                    cell: id,
                    anchor: {
                      name: 'left',
                    },
                  },
                }),
              );
              traverse(item);
            });
          }
        }
      };
      traverse(result);
      graph.resetCells(cells);
      graphRef.current?.zoomToFit();
      graph.centerContent();
    };

    render();
  };

  const handleZoomOut = () => {
    const zoom = graphRef.current?.zoom() || 1;
    graphRef.current?.zoomTo(zoom + 0.25, {
      minScale: 0.25,
      maxScale: 2,
    });
  };

  const handleZoomIn = () => {
    const zoom = graphRef.current?.zoom() || 1;
    graphRef.current?.zoomTo(zoom - 0.25, {
      minScale: 0.25,
      maxScale: 2,
    });
  };

  const handleFitContent = () => {
    graphRef.current?.zoomToFit();
    graphRef.current?.centerContent();
  };

  const handleFullscreen = () => {
    changeFullscreen && changeFullscreen(!isFullscreen);
  };

  useMount(() => {
    initMindMap();
  });

  useEffect(() => {
    const data: any = formatData(dataSource);
    const render = () => {
      const result: HierarchyResult = Hierarchy.mindmap(data, {
        direction: 'H',
        getHeight(d: MindMapData) {
          return d.height;
        },
        getWidth(d: MindMapData) {
          return d.width;
        },
        getHGap() {
          return 40;
        },
        getVGap() {
          return 20;
        },
        getSide: () => {
          return 'right';
        },
      });
      const cells: Cell[] = [];
      const traverse = (hierarchyItem: HierarchyResult) => {
        if (hierarchyItem) {
          const { data, children } = hierarchyItem;
          if (!graphRef.current) {
            return;
          }
          cells.push(
            graphRef.current.createNode({
              id: data.id,
              shape: data.type,
              x: hierarchyItem.x,
              y: hierarchyItem.y,
              width: data.width,
              height: data.height,
              label: data.label,
              type: data.type,
            }),
          );
          if (children) {
            children.forEach((item: HierarchyResult) => {
              const { id, data } = item;
              if (!graphRef.current) {
                return;
              }
              cells.push(
                graphRef.current.createEdge({
                  shape: 'mindmap-edge',
                  source: {
                    cell: hierarchyItem.id,
                    anchor:
                      data.type === 'topic-child'
                        ? {
                            name: 'right',
                            args: {
                              dx: -16,
                            },
                          }
                        : {
                            name: 'center',
                            args: {
                              dx: '25%',
                            },
                          },
                  },
                  target: {
                    cell: id,
                    anchor: {
                      name: 'left',
                    },
                  },
                }),
              );
              traverse(item);
            });
          }
        }
      };
      traverse(result);
      graphRef.current?.resetCells(cells);
      graphRef.current?.zoomToFit();
      graphRef.current?.centerContent();
    };

    render();
  }, [dataSource]);

  return (
    <div className={styles.mindMapContent}>
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
          <img src={fitContentIcon} alt="" onClick={handleFitContent} />
          <Divider type="vertical" />
          <img src={collapseIcon} alt="" />
          <Divider type="vertical" />
          <img src={zoomInIcon} alt="" onClick={handleZoomIn} />
          <Divider type="vertical" />
          <img src={zoomOutIcon} alt="" onClick={handleZoomOut} />
        </div>
        <div className={styles.fullscreenIcon}>
          <img src={fullscreenIcon} alt="" onClick={handleFullscreen} />
        </div>
      </div>
    </div>
  );
};

export default MindMap;
