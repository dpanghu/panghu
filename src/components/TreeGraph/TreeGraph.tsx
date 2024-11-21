import G6 from '@antv/g6';
import { values } from 'lodash-es';
import {
  COLLAPSE_NAME,
  FIRST_NODE_NAME,
  NodeType,
  SUB_NODE_NAME,
} from './constants';
import { dataTransform } from './utils';

const { Util } = G6;

export class TreeGraph {
  tree: any;
  data: any;
  originData: any;
  options: any;
  constructor(width: number, height: number, container: string, options: any) {
    this.options = options || {};
    this._registerElements();
    this.tree = new G6.TreeGraph({
      container,
      width,
      height,
      autoPaint: true,
      fitCenter: true,
      layout: {
        type: 'mindmap',
        direction: 'H',
        getHeight: () => {
          return 16;
        },
        getWidth: (node: any) => {
          return node.level === 0
            ? Util.getTextSize(node.name, 16)[0] + 12
            : Util.getTextSize(node.name, 12)[0];
        },
        getVGap: (node: any) => {
          // 当父节点为最后一个兄弟元素，则当前节点高度为10
          if (node.id.split('-').length > 1) {
            let parentNode: any;
            Util.traverseTree(this.data, (t: any) => {
              if (t.id === node.id.slice(0, -2)) {
                parentNode = t;
                return false;
              } else {
                return true;
              }
            });
            if (
              parentNode?.level === 0 ||
              (parentNode && parentNode.order === 2)
            ) {
              return 10;
            }
          }
          // 若为最后一个节点，则高度为22
          if (node.order === 2) {
            return 22;
          } else {
            return 10;
          }
        },
        getHGap: () => {
          return 60;
        },
        getSide: (node: any) => {
          return node.data.direction;
        },
      },
      animate: false,
      defaultEdge: {
        type: 'cubic-horizontal',
        style: {
          lineWidth: 2,
        },
      },
      plugins: [],
      modes: {
        default: ['drag-canvas', 'zoom-canvas'], // 可拖拽
      },
      minZoom: 0.25,
      maxZoom: 2,
    });
    this._travelsEle();
    this._listeners();
  }

  _colorIsBlue(id: number) {
    if (this.options?.editable) {
      if (id % 4 === 0 || id % 4 === 3) {
        return false;
      } else {
        return true;
      }
    } else {
      return id % 2 === 0;
    }
  }

  // 注册自定义节点
  _registerElements() {
    // eslint-disable-next-line
    const that = this;
    //根节点
    G6.registerNode(
      NodeType.ROOT,
      {
        draw: function drawShape(cfg, group) {
          const width = Util.getTextSize(cfg.name, 16)[0] + 24;
          const rect = group.addShape('rect', {
            attrs: {
              fill: 'l(180) 0:#B393FF  1:#5A73FF',
              width: width,
              height: 38,
              cursor: 'pointer',
              textAlign: 'center',
              radius: 4,
              padding: [10],
            },
            name: 'first-level-rect',
          });
          group.addShape('text', {
            attrs: {
              text: cfg.name,
              fontSize: 16,
              y: 27,
              x: 12,
              fill: '#fff',
              cursor: 'pointer',
            },
            name: FIRST_NODE_NAME,
          });

          return rect;
        },
        setState() {},
        getAnchorPoints() {
          return [
            [0, 0.5],
            [1, 0.5],
          ];
        },
      },
      FIRST_NODE_NAME,
    );
    // 次级节点
    G6.registerNode(
      NodeType.SUB,
      {
        draw: function drawShape(cfg: any, group) {
          const isRight = that.options.editable
            ? cfg.id.split('-')[1] % 2 === 0
            : true;
          const width = Util.getTextSize(cfg.name, 14)[0] + 16;
          const isBlue = that._colorIsBlue(parseFloat(cfg.id.split('-')[1]));
          const color = isBlue
            ? {
                color: '#5A73FF',
                background: '#EEF1FF',
                border: '#8B9DFF',
              }
            : {
                color: '#9D72F0',
                background: '#F6F1FF',
                border: '#C1A1FF',
              };
          const rect = group.addShape('rect', {
            attrs: {
              fill: color.background,
              width: width,
              height: 28,
              cursor: 'pointer',
              radius: 4,
              stroke: color.color,
              borderColor: color.border,
            },
            name: 'sub-level-rect',
          });
          group.addShape('text', {
            attrs: {
              text: cfg.name,
              fontSize: 14,
              x: 4,
              y: 21,
              marginTop: 162,
              marginLeft: 4,
              fill: color.color,
              cursor: 'pointer',
              borderColor: color.border,
            },
            name: SUB_NODE_NAME,
          });
          // 收缩marker
          cfg.children &&
            group.addShape('marker', {
              attrs: {
                x: isRight ? width + 9 : -9,
                y: 14,
                r: 6,
                opacity: cfg.collapsed ? 1 : 0,
                symbol: G6.Marker.expand,
                stroke: isBlue ? '#BDC7FF' : '#DCCAFF',
                lineWidth: 1,
                fill: '#fff',
                cursor: 'pointer',
              },
              name: 'count-icon-expand',
            });
          // 展开marker
          cfg.children &&
            group.addShape('marker', {
              attrs: {
                x: isRight ? width + 9 : -9,
                y: 14,
                r: 6,
                opacity: cfg.collapsed ? 0 : 1,
                symbol: G6.Marker.collapse,
                stroke: isBlue ? '#BDC7FF' : '#DCCAFF',
                lineWidth: 1,
                fill: '#fff',
                cursor: 'pointer',
              },
              name: 'count-icon',
            });
          return rect;
        },
        setState(name, value, item: any) {
          const eleCollapse = item
            .get('group')
            .find((e: any) => e.get('name') === 'count-icon');
          const eleExpand = item
            .get('group')
            .find((e: any) => e.get('name') === 'count-icon-expand');
          if (!eleCollapse || !eleExpand) {
            return;
          }
          // 若已经收缩，则收缩maker不显示，否则显示。此处更适合用hide和show？
          if (name === 'collapsed' && value) {
            eleCollapse.attr('opacity', 0);
            eleExpand.attr('opacity', 1);
          } else if (name === 'collapsed' && !value) {
            eleCollapse.attr('opacity', 1);
            eleExpand.attr('opacity', 0);
          }
        },
        getAnchorPoints() {
          return [
            [0, 0.5],
            [1, 0.5],
          ];
        },
      },
      SUB_NODE_NAME,
    );
    // 三级及一下节点
    G6.registerNode(
      NodeType.LEAF,
      {
        draw: function drawShape(cfg: any, group) {
          const isRight = that.options.editable
            ? cfg.id.split('-')[1] % 2 === 0
            : true;
          const width = Util.getTextSize(cfg.name, 14)[0];
          let color;
          if ((this as any).options.editable) {
            color = cfg.id.split('-')[1] % 3 ? '#CDD5FF' : '#DCCAFF';
          } else {
            color = cfg.id.split('-')[1] % 2 === 0 ? '#CDD5FF' : '#DCCAFF';
          }
          const rect = group.addShape('rect', {
            attrs: {
              fill: 'transparent',
              stroke: 'transparent',
              x: 0,
              y: 0,
              width: width + 38,
              height: 26,
            },
            name: 'rect-shape',
          });
          // 文字下的线条
          group.addShape('rect', {
            attrs: {
              fill: color,
              stroke: 'transparent',
              x: -1,
              y: 24.5,
              width: width + 40,
              height: 2,
              marginLeft: 100,
            },
            // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
            name: 'rect-shape',
          });
          group.addShape('text', {
            attrs: {
              text: cfg.name,
              x: isRight ? 18 : 20,
              y: 12,
              fontSize: 14,
              textBaseline: 'middle',
              fill: '#666',
              cursor: 'pointer',
            },
            // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
            name: COLLAPSE_NAME,
          });
          // 子节点显示信息
          cfg.children &&
            group.addShape('rect', {
              attrs: {
                opacity: cfg.collapsed ? 1 : 0,
                width: 14,
                height: 14,
                stroke: color,
                x: isRight ? width + 22 : 2,
                y: 5,
                radius: 7,
                fill: '#fff',
                cursor: 'pointer',
              },
              name: 'rect-text-number',
            });
          cfg.children &&
            group.addShape('text', {
              attrs: {
                opacity: cfg.collapsed ? 1 : 0,
                text: cfg.children.length,
                x:
                  (isRight ? width + 22 : 2) +
                  (14 -
                    Util.getTextSize(cfg.children.length.toString(), 10)[0]) /
                    2 -
                  0.5,
                y: 18,
                fontSize: 10,
                fill: color,
                cursor: 'pointer',
              },
              name: 'text-number',
            });
          cfg.children &&
            group.addShape('marker', {
              attrs: {
                x: isRight ? width + 36 : 4,
                y: 25,
                r: 6,
                opacity: cfg.collapsed ? 0 : 1,
                symbol: G6.Marker.collapse,
                stroke: color,
                lineWidth: 1,
                fill: '#fff',
                cursor: 'pointer',
              },
              name: 'count-icon',
            });

          return rect;
        },
        // 线条起终点
        getAnchorPoints() {
          return [
            [0, 0.965],
            [1, 0.965],
          ];
        },
        setState(name, value, item: any) {
          // 若收缩，则子节点个数显示信息显示，收缩maker隐藏
          const eles = item
            .get('group')
            .findAll(
              (ele: any) =>
                ele.get('name') === 'rect-text-number' ||
                ele.get('name') === 'text-number' ||
                ele.get('name') === 'count-icon',
            );
          eles.forEach((e: any) => {
            if (e) {
              if (name === 'collapsed' && value) {
                e.attr('opacity', e.get('name') === 'count-icon' ? 0 : 1);
              } else if (name === 'collapsed' && !value) {
                e.attr('opacity', e.get('name') === 'count-icon' ? 1 : 0);
              }
            }
          });
        },
      },
      'single-node',
    );

    G6.registerBehavior('scroll-canvas', {
      getEvents: function getEvents() {
        return {
          wheel: 'onWheel',
        };
      },

      onWheel: function onWheel(ev: any) {
        const { graph } = this as any;
        if (!graph) {
          return;
        }
        if (ev.ctrlKey) {
          const canvas = graph.get('canvas');
          const point = canvas.getPointByClient(ev.clientX, ev.clientY);
          let ratio = graph.getZoom();
          if (ev.wheelDelta > 0) {
            ratio += ratio * 0.05;
          } else {
            ratio *= ratio * 0.05;
          }
          graph.zoomTo(ratio, {
            x: point.x,
            y: point.y,
          });
        } else {
          const x = ev.deltaX || ev.movementX;
          const y = ev.deltaY || ev.movementY || (-ev.wheelDelta * 125) / 3;
          graph.translate(-x, -y);
        }
        ev.preventDefault();
      },
    });
  }

  _stayRootCenter() {
    const node = this.tree.findById('0');
    if (node) {
      this.tree.focusItem(node);
    }
  }

  _travelsEle() {
    // 绘制线条触发
    this.tree.edge((edge: any) => {
      const secondId = edge.target.split('-')[1];
      const isBlue = this._colorIsBlue(parseFloat(edge.target.split('-')[1]));

      // 目标节点是否为在右侧的节点
      const isTargetRight = this.options.editable ? secondId % 2 === 0 : true;
      let color;
      if (this.options.editable) {
        color = secondId % 3 ? '#CDD5FF' : '#DCCAFF';
      } else {
        color = isBlue ? '#CDD5FF' : '#DCCAFF';
      }
      // 源节点为根节点
      if (edge.source?.split('-').length === 1) {
        return {
          id: edge.id,
          type: 'cubic-horizontal',
          sourceAnchor: isTargetRight ? 1 : 0, // 若目标节点在右侧，则起始位置在右侧
          targetAnchor: isTargetRight ? 0 : 1, // 若目标节点在右侧，则结束位置在左侧
          style: {
            stroke: color,
            width: 2,
          },
        };
      } else {
        // 源节点为非根节点
        return {
          id: edge.id,
          type: 'cubic-horizontal',
          sourceAnchor: isTargetRight ? 1 : 0, // 若目标节点在右侧，则起始位置在右侧
          targetAnchor: isTargetRight ? 0 : 1, // 若目标节点在右侧，则结束位置在左侧
          style: {
            radius: 8,
            offset: 20,
            stroke: color,
            width: 2,
          },
        };
      }
    });
    // 为node分配自定义node类型
    this.tree.node((node: any) => {
      switch (node.depth) {
        case 0:
          node.type = NodeType.ROOT;
          break;
        case 1:
          node.type = NodeType.SUB;
          break;
        default:
          node.type = NodeType.LEAF;
          break;
      }
      return node;
    });
  }

  _listeners() {
    this.tree.on('afterrender', () => {
      if (this.options.editable) {
        this.tree.fitCenter();
      } else {
        this._setTargetNodesCollapse(false, (node: any) => {
          return node.getModel()?.level < 2;
        });
        this._setTargetNodesCollapse(true, (node: any) => {
          return node.getModel()?.level >= 2;
        });
        const node = this.tree.findById('0-0');
        if (node) {
          this.tree.focusItem(node);
        }
      }
      this.tree.fitView();
    });

    this.tree.on('node:click', (e: any) => {
      const model = e?.item?.getModel();
      let type = model?.type;
      // 点击节点控制收缩展开子节点
      if (values(NodeType).some((item) => item === type)) {
        e.item.getModel().collapsed = !e.item.getModel().collapsed;
        this.tree.setItemState(
          e.item,
          'collapsed',
          e.item.getModel().collapsed,
        );
        this.tree.layout();
      }
    });
  }

  resetData(data: any) {
    this.originData = data;
    this.data = dataTransform(data, this.options?.editable);
    this.tree.data(this.data);
    this.tree.render();
    return this;
  }

  // 放大缩小
  zoomTo(value: number) {
    this.tree.zoomTo(value);
    // this.tree.fitCenter();
  }

  // 设置所有末级节点展开/收缩
  setLeafLevelCollapse(action: boolean) {
    if (!action) {
      this._setTargetNodesCollapse(false, (node: any) => {
        return node.getModel()?.level < 2;
      });
      this._setTargetNodesCollapse(true, (node: any) => {
        return node.getModel()?.level >= 2;
      });
      this.tree.fitView();
      // const node = this.tree.findById('0');
      // if (node) {
      //   node.getModel().collapsed = !node.getModel().collapsed;
      //   this.tree.setItemState(node, 'collapsed', node.getModel().collapsed);
      //   this.tree.layout();
      // }
    } else {
      // 因为不支持一次性全部展开，只能一层一层展开
      this._setTargetNodesCollapse(false, (node: any) => {
        return node.getModel()?.level === 0;
      });
      this._setTargetNodesCollapse(false, (node: any) => {
        return node.getModel()?.level === 1;
      });
      this._setTargetNodesCollapse(false, (node: any) => {
        return node.getModel()?.level === 2;
      });
      this._setTargetNodesCollapse(false, (node: any) => {
        return node.getModel()?.level === 3;
      });
      this._setTargetNodesCollapse(false, (node: any) => {
        return node.getModel()?.level === 4;
      });
      this.tree.fitView();
    }
  }

  //设置某些节点的展开和收缩，action为ture则收缩
  _setTargetNodesCollapse(action: boolean, callback: any) {
    // 获取目标节点
    const nodes = this.tree.findAll('node', function (node: any) {
      return callback(node);
    });
    // 对目标节点执行展开或收缩
    nodes.forEach((node: any) => {
      try {
        node.getModel().collapsed = action;
        this.tree.setItemState(node, 'collapsed', node.getModel().collapsed);
        this.tree.layout();
      } catch (e) {
        console.log(e);
      }
    });
  }

  resizedataURL(datas: any, canvasWidth: any, canvasHeight: any) {
    // eslint-disable-next-line
    const _this = this;
    return new Promise(async function (resolve, reject) {
      let img = document.createElement('img');
      img.onload = function () {
        let canvas = document.createElement('canvas');
        let ctx: any = canvas.getContext('2d');
        canvas.width = 1000;
        canvas.height = 500;
        const originWidth = _this.tree.getWidth();
        const originHeight = _this.tree.getHeight();
        const ratioW = canvasWidth / originWidth;
        const ratioH = canvasHeight / originHeight;
        ctx.drawImage(
          this,
          canvasWidth / 2 - 500 * ratioW,
          canvasHeight / 2 - 250 * ratioH,
          1000 * ratioW,
          500 * ratioH,
          0,
          0,
          1000,
          1000 * ((500 * ratioH) / (1000 * ratioW)),
        );
        let dataURI = canvas!.toDataURL('image/png');
        resolve(dataURI);
      };
      img.src = datas;
    });
  }

  // 导出完整图片
  getCanvasPng = () => {
    this.setLeafLevelCollapse(false);
    this.tree.fitView();
  };

  // 截图
  getScreenshot() {
    const root = this.tree.findById('0');
    root.getModel().collapsed = false;
    this.tree.setItemState(root, 'collapsed', false);
    this._setTargetNodesCollapse(true, (node: any) => {
      return node.getModel()?.level === 1;
    });
    this.tree.layout();
    this.tree.zoomTo(1);
    this._stayRootCenter();
    const { width, height } = root.getBBox();
    this.tree.translate(-(width / 2), -(height / 4));
    return new Promise((resolve) => {
      setTimeout(() => {
        const canvas: any = document.querySelector('#MindMapContainer canvas');
        this.resizedataURL(
          canvas!.toDataURL('image/png'),
          canvas.width,
          canvas.height,
        ).then((rst) => {
          resolve(rst);
        });
      }, 50);
    });
  }

  // 获取数据
  exportData() {
    return JSON.stringify(this.tree.save());
  }

  importData(data: any) {
    this.tree.read(JSON.parse(data));
  }
}
