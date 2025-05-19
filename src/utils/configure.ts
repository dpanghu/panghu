export interface TModule {
  type: string;
  name: string;
  key: string;
}

const moduleList: TModule[] = [
  {
    type: 'h1',
    key: '9',
    name: '一级标题',
  },
  {
    type: 'h2',
    key: '10',
    name: '二级标题',
  },
  {
    type: 'text',
    key: '1',
    name: '文本',
  },
  {
    type: 'link',
    key: '5',
    name: '超链接',
  },
  {
    type: 'video',
    key: '12',
    name: '视频',
  },
  {
    type: 'image',
    key: '11',
    name: '图片',
  },
  {
    type: 'download',
    key: '6',
    name: '附件',
  },
  {
    type: 'judge',
    key: '4',
    name: '判断题',
  },
  {
    type: 'radio',
    key: '2',
    name: '单选题',
  },
  {
    type: 'checkbox',
    key: '3',
    name: '多选题',
  },
  {
    type: 'code',
    key: '7',
    name: '代码块',
  },
  {
    type: 'editor',
    key: '8',
    name: '编辑器',
  },
];

export { moduleList };
