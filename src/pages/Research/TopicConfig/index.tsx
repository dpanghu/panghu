/**
 * 课题配置
 * fuxueyan
 */
import { Input, Pagination, Table } from 'antd';
import { useEffect, useState } from 'react';
import TopicConfigDetail from './components/TopicConfigDetail';
import { TYPE, TYPE_VALUE } from './components/contants';
import styles from './index.less';
import searchSvg from '@/assets/images/reSearch/search.svg';
import paginationBtn from '@/assets/images/pagination_btn.svg';
import { clickTopic, getTopConfigList } from '@/services/topicConfig';

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
  const [detail, setDetail] = useState({});
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

  const handleClickTab = (key: string) => {
    setSelectKey(key);
    setParams({ ...params, subjectEnum: key });
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
      // render: (text: any, record: any) => (
      //   <div onClick={(e) => handleClick(e, record.id)} className={styles.clickCount}>
      //     {text || 0}
      //   </div>
      // ),
    },
  ];

  const onChangePage = (page: number, pageSize: number) => {
    setParams({ ...params, pageNum: page, limit: pageSize });
  };

  const handleClickDetail = (item: any) => {
    setIsShowDetail(true);
    setDetail(item);
    clickTopic({ id: item.id });
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.box}>
          <div className={styles.header}>
            <span className={styles.title}>课题</span>
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
                showSizeChanger
                // showQuickJumper
                showTotal={(t) => `共 ${t} 个课题`}
                itemRender={(page, type, originalElement) => {
                  if (type === 'prev') {
                    return (
                      <img
                        style={{
                          display: 'inline-block',
                          transform: 'rotate(180deg)',
                        }}
                        src={paginationBtn}
                      />
                    );
                  }
                  if (type === 'next') {
                    return <img src={paginationBtn} />;
                  }
                  return originalElement;
                }}
              />
            </div>
          </div>
        </div>
      </div>

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
