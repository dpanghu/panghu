import {
  canvasCopy,
  canvasDel,
  canvasPage,
  copyUpdate,
  levelDel,
  levelPage,
  stateUpdate,
} from '@/services/canvaTools';
import { ArrowLeftOutlined, CheckOutlined, DashOutlined } from '@ant-design/icons';
import { useMount } from 'ahooks';
import { Button, Dropdown, Input, message, Modal, Pagination, Select, Tabs } from 'antd';
import Cookies from 'js-cookie';
import { cloneDeep } from 'lodash-es';
import qs from 'qs';
import React, { useState } from 'react';
import { base64 } from 'seent-tools';
import { history } from 'umi';
import AddCanva from './components/AddCanva';
import AddTags from './components/AddTags';
import styles from './index.less';

const { TabPane } = Tabs;
const { confirm } = Modal;

const { schoolMemberId: memberId } = Cookies.get();

const CanvaList: React.FC = () => {
  const [tabsKey, setTabsKey] = useState('0');
  const [mineCanvaList, setMineCanvaList] = useState<RecordItem[]>([]);
  const [canvaList, setCanvaList] = useState<RecordItem[]>([]); // 画布列表
  const [pageNum, setPageNum] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [open, setOpen] = useState(false); // 新建画布弹窗
  const [selectItem, setSelectItem] = useState<RecordItem>({});
  const [currentRecord, setCurrentRecord] = useState<RecordItem>({});
  const [dataSource, setDataSource] = useState([]);
  const [tagPage, setTagPage] = useState(1);
  const [tagLimit, setTageLimit] = useState(10);
  const [tagTotal, setTagTotal] = useState(0);
  const [tagOpen, setTagOpen] = useState(false);
  const [tagCurrent, setTagCurrent] = useState<RecordItem>({});
  const [canvanItems, setCanvaItems] = useState<RecordItem[] | any>([]);
  const [searchValue, setSearchValue] = useState('');
  const [canvasName, setCanvasName] = useState('');
  const [copyOpen, setCopyOpen] = useState(false);
  const [searchLabel, setSearchLabel] = useState('');
  const orgInfo = sessionStorage.getItem('orgInfo');

  console.log('orgInfo', orgInfo, selectItem, currentRecord, dataSource);

  const getList = (cur: number, page: number, name?: string, key?: string, label?: any) => {
    canvasPage({
      caseCode: '0',
      pageNum: cur,
      limit: page,
      paintboardConfigName: name,
      sourceFlag: 'CV',
      memberId: key === '0' ? memberId : '',
      state: key === '0' ? '' : 1,
      paintboardLabel: label,
    }).then((res) => {
      key === '0' ? setMineCanvaList(res?.data || []) : setCanvaList(res?.data || []);
      setTotal(Number(res?.total || 0));
    });
  };

  // const getMineList = (cur: number, page: number, name?: string) => {
  //   canvasPage({
  //     caseCode: '0',
  //     pageNum: cur,
  //     limit: page,
  //     name,
  //     sourceFlag: 'CV',
  //   }).then((res) => {
  //     setCanvaList(res?.data || []);
  //     setTotal(Number(res?.total || 0));
  //   });
  // };

  // 获取标签 levelPage
  const getLevelPage = (cur: number, page: number) => {
    levelPage({
      pageNum: cur,
      limit: page,
    }).then((res) => {
      // console.log(res);
      setDataSource(cloneDeep(res));
      setTagTotal(Number(cloneDeep(res)) || 0);
    });
  };

  console.log('canvaList', canvaList, dataSource);

  const getLevelGet = () => {
    levelPage({
      // name: '',
      // code:''
      limit: 9999,
    }).then((res) => {
      // console.log('resresres', res);
      setCanvaItems(cloneDeep(res));
    });
  };

  const onChange = (key: any) => {
    setTabsKey(key);
    key === '3' && getLevelPage(tagPage, tagLimit);
    getList(pageNum, limit, searchValue, key, searchLabel);
  };

  const handlePage = (cur: number, page: number) => {
    setPageNum(cur);
    setLimit(page);
    getList(cur, page, searchValue, tabsKey, searchLabel);
  };

  const handleTagPage = (cur: number, page: number) => {
    setTagPage(cur);
    setTageLimit(page);
    getLevelPage(cur, page);
  };

  const onSelectChange = (val: any) => {
    console.log(val);
    setSearchLabel(val);
    getList(pageNum, limit, searchValue, tabsKey, val);
  };

  const handleChoose = (item: any): void => {
    console.log('item', item);
    setOpen(true);
    // const newArr = canvaList.filter((i: any) => i.id !== item.id);
    // let chooseArr = cloneDeep(canvaList);
    // chooseArr.forEach((ele) => {
    //   if (ele.id === item.id) {
    //     ele.choose = true;
    //   }
    // });
    // // const arr = [item, ...newArr];
    // console.log('newArr', item, canvaList, chooseArr);
    // setCanvaList(chooseArr);
    // history.push('/tools/canvaPanble');
    sessionStorage.setItem('selectItem', JSON.stringify(item));
    setSelectItem(item);
    getLevelGet();
    // getLevelPage()
  };

  // 复制画布
  const handleCopy = () => {
    setCopyOpen(true);
  };

  // 发布/停用/启用
  const handleUpdate = async (state: number, type: string) => {
    await copyUpdate({
      state,
      canvasId: currentRecord?.id,
      memberId: currentRecord?.memberId,
    }).then(() => {
      message.success('发布成功');
      getList(pageNum, limit, searchValue, tabsKey, searchLabel);
    });
  };

  const handleStateUpdate = async (state: number, type: string) => {
    await stateUpdate({
      state,
      canvasId: currentRecord?.id,
      isEnable: state,
      memberId: currentRecord?.memberId,
    }).then(() => {
      // type === '发布' && message.success('发布成功');
      type === '停用' && message.success('停用成功');
      type === '启用' && message.success('启用成功');
      getList(pageNum, limit, searchValue, tabsKey, searchLabel);
    });
  };

  // 删除
  const handleDelete = async (id: string) => {
    confirm({
      title: '删除确认',
      content: '确认删除该条画布信息吗？',
      onOk: async () => {
        await canvasDel({ canvasId: currentRecord?.id }).then((res) => {
          message.success('删除成功');
          Modal.destroyAll();
          getList(pageNum, limit, searchValue, tabsKey, searchLabel);
        });
      },
      onCancel: () => {},
    });
  };

  const handleEdit = (row: RecordItem) => {
    setTagOpen(true);
    setTagCurrent(row);
  };

  const items: any = [
    Number(currentRecord?.state === 0) && {
      key: '1',
      label: tabsKey === '0' && (
        <Button type="link" onClick={() => handleUpdate(1, '发布')}>
          发布画布
        </Button>
      ),
    },
    {
      key: '2',
      label:
        tabsKey === '0' && currentRecord?.state === 0 ? (
          <Button
            type="link"
            onClick={() => {
              //base64.encode(qs.stringify({
              // history.push('/tools/canvaPanble');
              // console.log(
              //   '257027502750275',
              //   currentRecord,
              //   base64.encode(qs.stringify(currentRecord)),
              // );
              window.open(
                `${window.location.origin}/bus_canvas_web/tools/canvaPanble?qs=${base64.encode(
                  qs.stringify({ ...currentRecord, platformCode: 'DBE3' }),
                )}`,
                '_blank',
              );

              // localStorage.setItem('selectItem', JSON.stringify());
              setSelectItem(currentRecord);
            }}
          >
            编辑画布
          </Button>
        ) : (
          <Button
            type="link"
            onClick={() => {
              //base64.encode(qs.stringify({
              // history.push('/tools/canvaPanble');
              // console.log(
              //   '257027502750275',
              //   currentRecord,
              //   base64.encode(qs.stringify(currentRecord)),
              // );
              window.open(
                `${window.location.origin}/bus_canvas_web/tools/canvaRole?qs=${base64.encode(
                  qs.stringify({ ...currentRecord, platformCode: 'DBE3' }),
                )}`,
                '_blank',
              );

              // localStorage.setItem('selectItem', JSON.stringify());
              setSelectItem(currentRecord);
            }}
          >
            查看画布
          </Button>
        ),
    },
    {
      key: '3',
      label: (
        <Button type="link" onClick={() => handleCopy()}>
          复制画布
        </Button>
      ),
    },
    {
      key: '4',
      label: tabsKey === '0' && (
        <Button type="link" onClick={() => handleDelete('1')} disabled={currentRecord?.state === 1}>
          删除画布
        </Button>
      ),
    },
    Number(currentRecord?.state === 1 && tabsKey === '0') && {
      key: '5',
      label: (
        <Button
          type="link"
          onClick={() =>
            handleStateUpdate(
              currentRecord?.isEnable === 1 ? 2 : 1,
              currentRecord?.isEnable === 1 ? '停用' : '启用',
            )
          }
        >
          {currentRecord?.isEnable === 1 ? '停用画布' : '启用画布'}
        </Button>
      ),
    },
  ];

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      render: (_: string, record: RecordItem, index: number) => <div>{index + 1}</div>,
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '编码',
      dataIndex: 'code',
    },
    {
      title: '操作',
      dataIndex: '_',
      width: 200,
      render: (_: string, record: RecordItem) => {
        return (
          <div>
            <Button type="link" onClick={() => handleEdit(record)}>
              编辑
            </Button>
            <Button
              type="link"
              onClick={() => {
                levelDel({
                  id: record?.id,
                }).then(() => {
                  message.success('删除成功');
                  getLevelPage(tagPage, tagLimit);
                });
              }}
            >
              删除
            </Button>
          </div>
        );
      },
    },
  ] as any;

  useMount(() => {
    getList(1, 10, '', '0', '');
    getLevelPage(1, 10);
    getLevelGet();
    // if (
    //   document.removeEventListener(
    //     'visibilitychange',
    //     getList(1, 10, '', '0', '') as any,
    //   ) as any
    // ) {
    // }
  });

  return (
    <div className={styles?.main}>
      <div className={styles?.title}>
        <div className={styles?.titleFont}>
          <ArrowLeftOutlined
            style={{ marginRight: '12px' }}
            onClick={() => history.push('/configIndex')}
          />
          画布列表
        </div>
        <div>
          <Select
            placeholder="根据标签搜索"
            style={{ width: 220, marginRight: '22px' }}
            onChange={onSelectChange}
            allowClear
            options={
              (canvanItems &&
                canvanItems.length > 0 &&
                canvanItems.map((item: RecordItem) => ({
                  label: item?.name,
                  value: item?.id,
                }))) ||
              []
            }
            filterOption={(input, option) =>
              ((option?.label ?? '') as any).toLowerCase().includes(input.toLowerCase())
            }
          />
          <Input
            placeholder="请输入内容，按回车键搜索"
            allowClear
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
            onPressEnter={() => {
              getList(pageNum, limit, searchValue, tabsKey, searchLabel);
            }}
            style={{ width: 220, marginRight: '22px' }}
          />
          {(tabsKey === '1' || tabsKey === '0') && (
            <Button
              type="primary"
              onClick={() => {
                setOpen(true);
                setSelectItem({});
                getLevelGet();
              }}
            >
              新增画布
            </Button>
          )}
          {tabsKey === '3' && (
            <Button
              type="primary"
              onClick={() => {
                setTagOpen(true);
                setTagCurrent({});
              }}
            >
              新增标签
            </Button>
          )}
        </div>
      </div>
      <div className={styles?.content}>
        <Tabs activeKey={tabsKey} onChange={onChange} style={{ height: '100%' }}>
          <TabPane tab="我的画布" key="0">
            <div style={{ overflowY: 'auto', height: '100%', overflowX: 'hidden' }}>
              <div className={styles?.contentList}>
                {mineCanvaList &&
                  mineCanvaList.map((item: RecordItem) => (
                    <div
                      key={item?.id}
                      className={item.choose ? styles.modal_content_box_check : styles.canvaDiv}
                    >
                      {item.choose && (
                        <div className={styles.modal_add}>
                          <CheckOutlined
                            style={{ color: 'white' }}
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                          />
                        </div>
                      )}
                      <img
                        src={require('@/assets/images/banner12.png')}
                        className={styles?.canvaDivImg}
                        onClick={() => {
                          console.log('252075027520752057205', item);
                          handleChoose(item);
                        }}
                      />
                      <div className={styles?.canvaDivInfo}>
                        <div
                          style={{
                            fontSize: '18px',
                            fontWeight: 600,
                            height: '36px',
                            lineHeight: '36px',
                            width: '200px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            cursor: 'pointer',
                          }}
                        >
                          <span title={item.paintboardConfigName}>{item.paintboardConfigName}</span>
                        </div>
                        <div className={styles?.titleName}>
                          <p
                            style={{
                              width: '160px',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              cursor: 'pointer',
                            }}
                          >
                            <span title={item.paintboardConfigDesc}>
                              {item.paintboardConfigDesc}
                            </span>
                          </p>
                          <Dropdown menu={{ items }} placement="bottom" trigger={['click']}>
                            <DashOutlined
                              onPointerEnterCapture={undefined}
                              onPointerLeaveCapture={undefined}
                              style={{ cursor: 'pointer' }}
                              onClick={(e: any) => {
                                e.preventDefault();
                                // console.log('9985938593', item);
                                setCurrentRecord(item);
                              }}
                            />
                          </Dropdown>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              <div className={styles?.pagination}>
                <Pagination
                  current={pageNum}
                  pageSize={limit}
                  total={total}
                  onChange={handlePage}
                />
              </div>
            </div>
          </TabPane>
          <TabPane tab="新道画布" key="1">
            <div style={{ overflowY: 'auto', height: '100%', overflowX: 'hidden' }}>
              <div className={styles?.contentList}>
                {canvaList &&
                  canvaList.map((item: RecordItem) => (
                    <div
                      key={item?.id}
                      className={item.choose ? styles.modal_content_box_check : styles.canvaDiv}
                    >
                      {item.choose && (
                        <div className={styles.modal_add}>
                          <CheckOutlined
                            style={{ color: 'white' }}
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                          />
                        </div>
                      )}
                      <img
                        src={require('@/assets/images/banner12.png')}
                        className={styles?.canvaDivImg}
                        onClick={() => {
                          console.log('252075027520752057205', item);
                          handleChoose(item);
                        }}
                      />
                      <div className={styles?.canvaDivInfo}>
                        <div
                          style={{
                            fontSize: '18px',
                            fontWeight: 600,
                            height: '36px',
                            lineHeight: '36px',
                            width: '200px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            cursor: 'pointer',
                          }}
                        >
                          <span title={item.paintboardConfigName}>{item.paintboardConfigName}</span>
                        </div>
                        <div className={styles?.titleName}>
                          <p
                            style={{
                              width: '160px',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              cursor: 'pointer',
                            }}
                          >
                            <span title={item.paintboardConfigDesc}>
                              {item.paintboardConfigDesc}
                            </span>
                          </p>
                          <Dropdown menu={{ items }} placement="bottom" trigger={['click']}>
                            <DashOutlined
                              onPointerEnterCapture={undefined}
                              onPointerLeaveCapture={undefined}
                              style={{ cursor: 'pointer' }}
                              onClick={(e: any) => {
                                e.preventDefault();
                                // console.log('9985938593', item);
                                setCurrentRecord(item);
                              }}
                            />
                          </Dropdown>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              <div className={styles?.pagination}>
                <Pagination
                  current={pageNum}
                  pageSize={limit}
                  total={total}
                  onChange={handlePage}
                />
              </div>
            </div>
          </TabPane>
          <TabPane tab="公共市场" key="2" disabled>
            <div>
              <div className={styles?.contentList}>
                {canvaList &&
                  canvaList.map((item: RecordItem) => (
                    <div
                      onClick={() => handleChoose(item)}
                      key={item?.id}
                      className={item.choose ? styles.modal_content_box_check : styles.canvaDiv}
                    >
                      {item.choose && (
                        <div className={styles.modal_add}>
                          <CheckOutlined
                            style={{ color: 'white' }}
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                          />
                        </div>
                      )}
                      <img
                        src={require('@/assets/images/banner12.png')}
                        className={styles?.canvaDivImg}
                      />
                      <div className={styles?.canvaDivInfo}>
                        <div
                          style={{
                            fontSize: '18px',
                            fontWeight: 600,
                            height: '36px',
                            lineHeight: '36px',
                          }}
                        >
                          {item.name}
                        </div>
                        <div className={styles?.titleName}>
                          <p>{item.name}</p>
                          <Dropdown menu={{ items }} placement="bottom" trigger={['click']}>
                            <DashOutlined
                              onPointerEnterCapture={undefined}
                              onPointerLeaveCapture={undefined}
                              onClick={(e) => {
                                e.preventDefault();
                                console.log('50484068046');
                              }}
                            />
                          </Dropdown>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              <div className={styles?.pagination}>
                <Pagination
                  current={pageNum}
                  pageSize={limit}
                  total={total}
                  onChange={handlePage}
                />
              </div>
            </div>
          </TabPane>
          {/* <TabPane tab="标签管理" key="3">
            <Table
              rowKey="id"
              columns={columns}
              dataSource={dataSource}
              pagination={{
                current: tagPage,
                pageSize: tagLimit,
                total: tagTotal,
                onChange: handleTagPage,
              }}
            />
          </TabPane> */}
        </Tabs>
      </div>
      {
        <AddCanva
          open={open}
          setOpen={setOpen}
          getList={getList}
          pageNum={pageNum}
          limit={limit}
          currentRecord={selectItem}
          items={canvanItems}
          getLevelGet={getLevelGet}
          setCurrentRecord={setSelectItem}
        />
      }
      {
        <AddTags
          open={tagOpen}
          setOpen={setTagOpen}
          getList={getLevelPage}
          pageNum={tagPage}
          limit={tagLimit}
          currentRecord={tagCurrent}
          setCurrentRecord={setCurrentRecord}
        />
      }
      {
        <Modal
          title="复制名称"
          open={copyOpen}
          onCancel={() => {
            setCopyOpen(false);
          }}
          onOk={async () => {
            if (!canvasName || canvasName === '' || canvasName.length === 0) {
              message.error('请输入复制名称！');
              return;
            }
            await canvasCopy({
              canvasName,
              canvasId: currentRecord?.id,
              // memberId: currentRecord?.memberId,
            }).then(() => {
              message.success('复制成功');
              getList(pageNum, limit, searchValue, tabsKey, searchLabel);
              setCopyOpen(false);
            });
          }}
        >
          <Input
            placeholder="请输入名称"
            value={canvasName}
            onChange={(e: any) => {
              setCanvasName(e.target.value);
            }}
          />
        </Modal>
      }
    </div>
  );
};
export default CanvaList;
