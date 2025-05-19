import { createFromIconfontCN } from '@ant-design/icons';
// const { PUBLIC_PATH } = process.env;
// let scriptUrl =
//   NODE_ENV === 'development' ? '/iconfont/iconfont.js' : `${PUBLIC_PATH}iconfont/iconfont.js`;
let scriptUrl = `//at.alicdn.com/t/c/font_3984160_3svq7q8gedc.js`;
const IconFont = createFromIconfontCN({
  scriptUrl,
});
export default IconFont;
