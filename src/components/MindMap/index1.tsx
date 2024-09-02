import Hierarchy from '@antv/hierarchy';
import { Cell, Graph, Path } from '@antv/x6';
import { useMount } from 'ahooks';
import React from 'react';
type TDateSource = {
  name: string;
  children?: TDateSource[];
  [key: string]: any;
};

interface TProps {
  dataSource: TDateSource;
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

const MindMap: React.FC<TProps> = ({ dataSource }) => {
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
          },
          line: {
            stroke: '#DCCAFF',
            strokeWidth: 2,
            d: 'M 0 15 L 60 15',
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

    const data: MindMapData = {
      id: '1',
      type: 'topic',
      label: '中心主题',
      width: 160,
      height: 50,
      children: [
        {
          id: '1-1',
          type: 'topic-branch',
          label: '分支主题1',
          width: 100,
          height: 40,
          children: [
            {
              id: '1-1-1',
              type: 'topic-child',
              label: '子主题1',
              width: 60,
              height: 30,
            },
            {
              id: '1-1-2',
              type: 'topic-child',
              label: '子主题2',
              width: 60,
              height: 30,
            },
          ],
        },
        {
          id: '1-2',
          type: 'topic-branch',
          label: '分支主题2',
          width: 100,
          height: 40,
        },
      ],
    };

    const graph = new Graph({
      container: document.getElementById('MindMapContainer')!,
      connecting: {
        connectionPoint: 'anchor',
      },
      selecting: {
        enabled: true,
      },
      panning: true,
      mousewheel: true,
      interacting: false,
      keyboard: {
        enabled: true,
      },
    });

    graph.on('node:collapse', ({ node }: any) => {
      node.toggleCollapse();
      const collapsed = node.isCollapsed();
      const cells = node.getDescendants();
      cells.forEach((node: any) => {
        if (collapsed) {
          node.hide();
        } else {
          node.show();
        }
      });
    });

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
      graph.centerContent();
    };

    render();
  };

  useMount(() => {
    initMindMap();
  });

  return (
    <div id="MindMapContainer" style={{ width: '100%', height: '100%' }}>
      index
    </div>
  );
};

export default MindMap;
