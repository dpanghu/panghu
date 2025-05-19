import { Modal, Tabs } from 'antd';
import React, { useState } from 'react';
import styles from '../index.less';

const { TabPane } = Tabs;
interface Props {
  open: boolean;
  setOpen: any;
}

const CanvasModal: React.FC<Props> = (props: Props) => {
  const { open, setOpen } = props;
  const [tabsKey, setTabsKey] = useState('1');

  const onChange = (key: any) => {
    setTabsKey(key);
  };

  return (
    <Modal title="选择画板" open={open} onCancel={() => setOpen(false)}>
      <div>
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
                    </div>
                  </div>
                </div>
                <div className={styles?.canvaDiv}>
                  <img className={styles?.canvaDivImg} />
                  <div className={styles?.canvaDivInfo}>
                    <div style={{ fontSize: '18px', fontWeight: 600 }}>逆向思维分析画布</div>
                    <div className={styles?.titleName}>
                      <p>姓名</p>
                      {/* <Dropdown menu={{ items }} placement="bottom">
                        <DashOutlined
                          onPointerEnterCapture={undefined}
                          onPointerLeaveCapture={undefined}
                        />
                      </Dropdown> */}
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
                    </div>
                  </div>
                </div>
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
                      逆向思维分析画布2
                    </div>
                    <div className={styles?.titleName}>
                      <p>姓名</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </Modal>
  );
};
export default CanvasModal;
