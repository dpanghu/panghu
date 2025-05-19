/**
 * 课题配置
 * fuxueyan
 */
import IconFont from '@/components/Iconfont';
import { delTopicConfig, getTopConfigList } from '@/services/topicConfig';
import { Button, Dropdown, Input, Modal, Pagination, Table, message } from 'antd';
import { useEffect, useState } from 'react';
import Header from './components/Header';
import AddTopicConfig from './components/AddTopicConfig';
import ImportTopicConfig from './components/ImportTopicConfig';
import TopicConfigDetail from './components/TopicConfigDetail';
import { TYPE, TYPE_VALUE } from './components/contants';
import styles from './index.less';
import searchSvg from '@/assets/images/reSearch/search.svg';
import addPng from '@/assets/images/reSearch/add.png';
import dropDownPng from '@/assets/images/reSearch/dropDown.png';

const TopicConfig = () => {
  const [params, setParams] = useState({
    pageNum: 1,
    limit: 10,
    subjectName: '',
    subjectEnum: '',
  });
  const [inputValue, setInputValue] = useState('');
  const [selectKey, setSelectKey] = useState<any>('');
  const [dataSource, setDataSource] = useState([]);
  const [total, setTotal] = useState(0);
  const [isShowAddTopic, setIsShowAddTopic] = useState(false);
  const [detail, setDetail] = useState({});
  const [isShowImportModal, setIsShowImportModal] = useState(false);
  const [iShowDetail, setIsShowDetail] = useState(false);

  const getTopConfigListData = () => {
    getTopConfigList(params).then((res) => {
      setDataSource(res.data);
      setTotal(Number(res.total));
    });
  };

  useEffect(() => {
    getTopConfigListData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const handleImport = () => {
    setIsShowImportModal(true);
  };

  const items: any = [
    {
      key: '1',
      label: (
        <a className={styles.menu} onClick={handleImport}>
          <IconFont type="icon-icon_import" style={{ marginRight: 8 }} />
          导入课题
        </a>
      ),
    },
  ];
  const handleClickTab = (key: string) => {
    setSelectKey(key);
    setParams({ ...params, subjectEnum: key });
  };
  const handleDel = (e: any, id: string) => {
    e.stopPropagation();
    Modal.confirm({
      title: '删除课题',
      content: '请确认是否要删除此课题！',
      onOk: () => {
        delTopicConfig({ id }).then(() => {
          message.success('删除成功');
          getTopConfigListData();
        });
      },
    });
  };
  const handleAddTopic = (e: any, item: any) => {
    e.stopPropagation();
    setDetail(item);
    setIsShowAddTopic(true);
  };
  const columns: any = [
    {
      title: '序号',
      dataIndex: 'xuhao',
      align: 'center',
      width: 85,
      render(value: any, record: any, index: number) {
        const i = params.limit * (params.pageNum - 1);
        return i + index + 1;
      },
    },
    {
      title: '参考课题',
      dataIndex: 'subjectName',
      width: 570,
    },
    {
      title: '类别',
      dataIndex: 'subjectTypeName',
      width: 137,
      align: 'center',
      render: (text: any) => <div>{TYPE_VALUE[text]}</div>,
    },
    {
      title: '发布时间',
      dataIndex: 'issueTime',
      align: 'center',
      width: 196,
      render: (text: any) => <div>{text}年</div>,
    },
    {
      title: '点击量',
      dataIndex: 'offlineClick',
      align: 'center',
      width: 168,
      render: (text: any) => <div>{text || 0}</div>,
    },
    {
      title: '操作',
      dataIndex: 'operator',
      align: 'center',
      width: 168,
      render: (text: any, record: any) => (
        <div className={styles.operator}>
          <a onClick={(e) => handleAddTopic(e, record)}>编辑</a>
          <a onClick={(e) => handleDel(e, record.id)}>删除</a>
        </div>
      ),
    },
  ];
  const onChangePage = (page: number, pageSize: number) => {
    setParams({ ...params, pageNum: page, limit: pageSize });
  };

  const handleClickDetail = (item: any) => {
    setIsShowDetail(true);
    setDetail(item);
  };

  return (
    <div className={styles.container}>
      <Header seTitle="课题配置" />
      <div className={styles.content}>
        <div className={styles.box}>
          <div className={styles.header}>
            <span className={styles.title}>课题配置</span>
            <div className={styles.headerRight}>
              <Input
                placeholder="请输入课题名称进行搜索"
                className={styles.input}
                suffix={
                  <img
                    src={searchSvg}
                    className={styles.search}
                    onClick={() => {
                      setParams({ ...params, subjectName: inputValue });
                    }}
                  />
                }
                onChange={(e) => setInputValue(e.target.value.replace(/\s+/g, ''))}
                onPressEnter={() => {
                  setParams({ ...params, subjectName: inputValue });
                }}
              />
              <Dropdown menu={{ items }} overlayClassName={styles.dropDown}>
                <Button
                  type="primary"
                  className={styles.btn}
                  onClick={(e) => handleAddTopic(e, {})}
                >
                  <img src={addPng} /> 添加课题
                  <img src={dropDownPng} />
                </Button>
              </Dropdown>
            </div>
          </div>
          <div className={styles.box_content}>
            <div className={styles.left}>
              <div
                className={selectKey === '' ? styles.activeTab : styles.tab}
                onClick={() => handleClickTab('')}
              >
                全部课题
              </div>
              {TYPE.map((item) => (
                <div
                  key={item.key}
                  className={selectKey === item.key ? styles.activeTab : styles.tab}
                  onClick={() => handleClickTab(item.key)}
                >
                  {item.name}
                </div>
              ))}
            </div>
            <div className={styles.right}>
              <div className={styles.tableContent}>
                <Table
                  columns={columns}
                  dataSource={dataSource}
                  className={styles.table}
                  pagination={false}
                  rowKey="id"
                  onRow={(record) => {
                    return {
                      onClick: () => handleClickDetail(record), // 点击行
                    };
                  }}
                />
              </div>
              <Pagination
                total={total}
                current={params.pageNum}
                pageSize={params.limit}
                onChange={onChangePage}
                className={styles.page}
                hideOnSinglePage
              />
            </div>
          </div>
        </div>
      </div>
      {isShowAddTopic && (
        <AddTopicConfig
          onCancel={() => {
            setIsShowAddTopic(false);
            getTopConfigListData();
          }}
          detail={detail}
        />
      )}

      {isShowImportModal && (
        <ImportTopicConfig
          onCancel={() => {
            setIsShowImportModal(false);
            getTopConfigListData();
          }}
        />
      )}

      {iShowDetail && (
        <TopicConfigDetail
          onCancel={() => {
            setIsShowDetail(false);
            getTopConfigListData();
          }}
          detail={detail}
        />
      )}
    </div>
  );
};

export default TopicConfig;
