export const columns = [
  {
    width: '60px',
    title: '序号',
    dataIndex: 'index',
    align: 'center',
    key: 'index',
    render: (_, record, index) => index + 1,
  },
  {
    title: '实体',
    dataIndex: 'entity1',
    key: 'entity1',
    width: 106,
    ellipsis: true,
  },
  {
    title: '关系',
    dataIndex: 'rel',
    key: 'rel',
    width: 106,
    ellipsis: true,
  },
  {
    title: '实体',
    dataIndex: 'entity2',
    key: 'entity2',
    width: 106,
    ellipsis: true,
  },
];

export const formItems = [
  {
    label: '实体1',
    name: 'entity1',
  },
  {
    label: '关联关系',
    name: 'rel',
  },
  {
    label: '实体2',
    name: 'entity2',
  },
];
