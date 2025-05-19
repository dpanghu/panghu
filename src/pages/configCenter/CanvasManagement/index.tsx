import { canvasDel, canvasPage } from '@/services/canvaTools';
import { DashOutlined } from '@ant-design/icons';
import { useMount } from 'ahooks';
import { Button, Dropdown, message, Pagination, Select, Tabs } from 'antd';
import React, { useState } from 'react';
import AddCanva from './components/AddCanva';
import styles from './index.less';

const { TabPane } = Tabs;

const CanvasManagement: React.FC = () => {
  const [tabsKey, setTabsKey] = useState('1');
  const [canvaList, setCanvaList] = useState<RecordItem[]>([]); // 画布列表
  const [pageNum, setPageNum] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [open, setOpen] = useState(false); // 新建画布弹窗

  const getList = (cur: number, page: number) => {
    canvasPage({
      caseCode: '0',
      pageNum: cur,
      limit: page,
    }).then((res) => {
      setCanvaList(res?.data || []);
      setTotal(Number(res?.total || 0));
    });
  };

  console.log('canvaList', canvaList);
  const onChange = (key: any) => {
    // console.log('key', key);
    setTabsKey(key);
  };

  const handlePage = (cur: number, page: number) => {
    setPageNum(cur);
    setLimit(page);
  };

  const handleDelete = async (id: string) => {
    await canvasDel({ id }).then(() => {
      message.success('删除成功');
      getList(pageNum, limit);
    });
  };

  const items: any = [
    {
      key: '1',
      label: <Button type="link">发布画布</Button>,
    },
    {
      key: '2',
      label: <Button type="link">编辑画布</Button>,
    },
    {
      key: '3',
      label: <Button type="link">复制画布</Button>,
    },
    {
      key: '4',
      label: (
        <Button type="link" onClick={() => handleDelete('1')}>
          删除画布
        </Button>
      ),
    },
    {
      key: '5',
      label: <Button type="link">停用画布/启动画布</Button>,
    },
  ];

  useMount(() => {
    getList(1, 10);
  });

  return (
    <div className={styles?.main}>
      <div className={styles?.title}>
        <div className={styles?.titleFont}>画布管理</div>
        <div>
          <Select placeholder="搜索" style={{ width: 220, marginRight: '22px' }} />
          <Button
            type="primary"
            onClick={() => {
              setOpen(true);
            }}
          >
            新增画布
          </Button>
        </div>
      </div>
      <div className={styles?.content}>
        <Tabs activeKey={tabsKey} onChange={onChange}>
          <TabPane tab="我的画布" key="1">
            <div>
              <div className={styles?.contentList}>
                <div className={styles?.canvaDiv}>
                  <img className={styles?.canvaDivImg} />
                  <div className={styles?.canvaDivInfo}>
                    <div style={{ fontSize: '18px', fontWeight: 600 }}>逆向思维分析画布</div>
                    <div className={styles?.titleName}>
                      <p>姓名</p>
                      <Dropdown menu={{ items }} placement="bottom">
                        <DashOutlined
                          onPointerEnterCapture={undefined}
                          onPointerLeaveCapture={undefined}
                        />
                      </Dropdown>
                    </div>
                  </div>
                </div>
                <div className={styles?.canvaDiv}>
                  <img className={styles?.canvaDivImg} />
                  <div className={styles?.canvaDivInfo}>
                    <div style={{ fontSize: '18px', fontWeight: 600 }}>逆向思维分析画布</div>
                    <div className={styles?.titleName}>
                      <p>姓名</p>
                      <Dropdown menu={{ items }} placement="bottom">
                        <DashOutlined
                          onPointerEnterCapture={undefined}
                          onPointerLeaveCapture={undefined}
                        />
                      </Dropdown>
                    </div>
                  </div>
                </div>
                <div className={styles?.canvaDiv}>
                  <img className={styles?.canvaDivImg} />
                  <div className={styles?.canvaDivInfo}>
                    <div
                      style={{
                        fontSize: '18px',
                        fontWeight: 600,
                        height: '40px',
                        lineHeight: '40px',
                      }}
                    >
                      逆向思维分析画布
                    </div>
                    <div className={styles?.titleName}>
                      <p>姓名</p>
                      <Dropdown menu={{ items }} placement="bottom">
                        <DashOutlined
                          onPointerEnterCapture={undefined}
                          onPointerLeaveCapture={undefined}
                        />
                      </Dropdown>
                    </div>
                  </div>
                </div>
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
          <TabPane tab="公共市场" key="2">
            <div>
              <div className={styles?.contentList}>
                <div className={styles?.canvaDiv}>
                  <img className={styles?.canvaDivImg} />
                  <div>
                    <div
                      style={{
                        paddingLeft: '16px',
                        fontSize: '18px',
                        fontWeight: 600,
                      }}
                    >
                      逆向思维分析画布
                    </div>
                    <div className={styles?.titleName}>
                      <p>姓名</p>
                      <Dropdown menu={{ items }} placement="bottom">
                        <DashOutlined
                          onPointerEnterCapture={undefined}
                          onPointerLeaveCapture={undefined}
                        />
                      </Dropdown>
                    </div>
                  </div>
                </div>
                <div className={styles?.canvaDiv}>
                  <img className={styles?.canvaDivImg} />
                  <div>
                    <div
                      style={{
                        paddingLeft: '16px',
                        fontSize: '18px',
                        fontWeight: 600,
                      }}
                    >
                      逆向思维分析画布
                    </div>
                    <div className={styles?.titleName}>
                      <p>姓名</p>
                      <Dropdown menu={{ items }} placement="bottom">
                        <DashOutlined
                          onPointerEnterCapture={undefined}
                          onPointerLeaveCapture={undefined}
                        />
                      </Dropdown>
                    </div>
                  </div>
                </div>
                <div className={styles?.canvaDiv}>
                  <img className={styles?.canvaDivImg} />
                  <div>
                    <div
                      style={{
                        paddingLeft: '16px',
                        fontSize: '18px',
                        fontWeight: 600,
                      }}
                    >
                      逆向思维分析画布2
                    </div>
                    <div className={styles?.titleName}>
                      <p>姓名</p>
                      <Dropdown menu={{ items }} placement="bottom">
                        <DashOutlined
                          onPointerEnterCapture={undefined}
                          onPointerLeaveCapture={undefined}
                        />
                      </Dropdown>
                    </div>
                  </div>
                </div>
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
        </Tabs>
      </div>
      {<AddCanva open={open} setOpen={setOpen} />}
    </div>
  );
};
export default CanvasManagement;
