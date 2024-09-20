import { DetailResponseType } from '../type';

export const formatData = (data: DetailResponseType) => {
  const columnLength = data.columns.length;
  const rst = [];
  for (let i = 0; i < data.data.length; i++) {
    const ind = Math.floor(i / columnLength);
    if (i % columnLength === 0) {
      rst[ind] = [data.data[i]['A' + (i % columnLength)]];
    } else {
      rst[ind].push(data.data[i]['A' + (i % columnLength)]);
    }
  }
  return rst;
};

// 定义一个函数来检查子div是否完全在父div内部
export function isChildInsideParent(child: Element, parent: Element) {
  const childRect = child.getBoundingClientRect();
  const parentRect = parent.getBoundingClientRect();

  // 检查子div的四个角是否都在父div内
  return (
    childRect.top >= parentRect.top &&
    childRect.left >= parentRect.left &&
    childRect.bottom <= parentRect.bottom &&
    childRect.right <= parentRect.right
  );
}
