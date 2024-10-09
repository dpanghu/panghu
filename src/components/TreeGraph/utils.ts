import { NodeType } from './constants';

export const dataTransform = (originData: any, isEdit = false) => {
  const changeData = (
    d: any,
    level = 0,
    id?: string,
    ind?: number,
    isFirst?: boolean,
    isLast?: boolean,
  ) => {
    const data = {
      ...d,
      originId: d.originId || d.id,
      name: d.name || d.topic,
      id: id ? id + '-' + ind : '0',
      level,
      order: 0 | (isFirst ? 1 : 0) | (isLast ? 2 : 0), // 判断当前节点所处位置
    };
    switch (level) {
      case 0:
        data.type = NodeType.ROOT;
        break;
      case 1:
        data.type = NodeType.SUB;
        break;
      default:
        data.type = NodeType.LEAF;
        break;
    }

    data.hover = false;

    if (level === 1) {
      if (isEdit) {
        data.direction = data.id.split('-')[1] % 2 === 0 ? 'right' : 'left';
      } else {
        data.direction = 'right';
      }
    }

    if (d.children) {
      data.order = 0;
      data.children = d.children.map((child: any, index: any) =>
        changeData(
          child,
          level + 1,
          data.id,
          index,
          index === 0,
          index === d.children.length - 1,
        ),
      );
    }
    return data;
  };
  return changeData(originData, 0);
};
