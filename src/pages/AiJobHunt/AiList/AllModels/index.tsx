import React, { useEffect, useRef } from 'react';
import { Card } from 'antd';
import { getAICardDetail, deletePlugin, copyPlugin, publishPlugin } from '@/services/aiJobHunt'
import styles from './index.less';
import type { MenuProps } from 'antd';
import { Dropdown, Space } from 'antd';
import eyeImg from '@/assets/images/eye.png';
import maohaoImg from '@/assets/images/maohao.png';
import { message, Modal } from 'antd';

const AllModels: React.FC<{ itemss: any[]; activeKey: string | null; activesKey: string | null; scrollKey: string | null }> = ({ itemss, activeKey, activesKey, scrollKey }) => {

  const [messageApi, contextHolder] = message.useMessage();
  const items: MenuProps['items'] = [
    {
      label: '发布',
      key: '0',
      style: {
        fontFamily: 'PingFangSC, PingFang SC',
        fontWeight: 400,
        fontSize: '14px',
        color: '#333333',
        lineHeight: '20px',
        textAlign: 'center',
        fontStyle: 'normal',
        borderRadius: '4px',
      },
      onClick: () => {
        const keyToDelete = data.find((item: any) => item.id)?.id;
        publishPlugin({
          userId: 1,
          userToken: 2,
          schoolId: 3,
          memberId: 5,
          pluginId: keyToDelete,
          state: 'normal'
        }).then((res) => {
          messageApi.open({
            type: 'success',
            content: '发布成功',
          });
          if (activeKey && activesKey) {
            getAICardDetail({
              userId: 1,
              userToken: 2,
              schoolId: 3,
              memberId: 5,
              domainId: activesKey,
              modelTypeId: activeKey
            }).then((res) => {
              setData(res);
              // console.log('res', res);
            });
          }
          else if (activeKey && activesKey === null) {
            getAICardDetail({
              userId: 1,
              userToken: 2,
              schoolId: 3,
              memberId: 5,
            }).then((res) => {
              setData(res);
              // console.log('res', res);
            });
          }
        })
      }
    },
    {
      label: '编辑',
      key: '1',
      style: {
        fontFamily: 'PingFangSC, PingFang SC',
        fontWeight: 400,
        fontSize: '14px',
        color: '#333333',
        lineHeight: '20px',
        textAlign: 'center',
        fontStyle: 'normal',
        borderRadius: '4px',
      }
    },
    {
      label: '复制',
      key: '3',
      style: {
        fontFamily: 'PingFangSC, PingFang SC',
        fontWeight: 400,
        fontSize: '14px',
        color: '#333333',
        lineHeight: '20px',
        textAlign: 'center',
        fontStyle: 'normal',
        borderRadius: '4px',
      },
      onClick: () => {
        const keyToDelete = data.find((item: any) => item.id)?.id;
        copyPlugin({
          userId: 1,
          userToken: 2,
          schoolId: 3,
          memberId: 5,
          pluginId: keyToDelete
        }).then((res) => {
          messageApi.open({
            type: 'success',
            content: '复制成功',
          });
          if (activeKey && activesKey) {
            getAICardDetail({
              userId: 1,
              userToken: 2,
              schoolId: 3,
              memberId: 5,
              domainId: activesKey,
              modelTypeId: activeKey
            }).then((res) => {
              setData(res);
              // console.log('res', res);
            });
          }
          else if (activeKey && activesKey === null) {
            getAICardDetail({
              userId: 1,
              userToken: 2,
              schoolId: 3,
              memberId: 5,
            }).then((res) => {
              setData(res);
              // console.log('res', res);
            });
          }
        })
      },
    },
    {
      label: '删除',
      key: '4',
      style: {
        fontFamily: 'PingFangSC, PingFang SC',
        fontWeight: 400,
        fontSize: '14px',
        color: '#333333',
        lineHeight: '20px',
        textAlign: 'center',
        fontStyle: 'normal',
        borderRadius: '4px',
      },
      onClick: () => {
        const keyToDelete = data.find((item: any) => item.id)?.id;
        Modal.confirm({
          title: '你确定要删除吗？',
          okText: '确定',
          cancelText: '取消',
          onOk: () => {
            deletePlugin({
              userId: 1,
              userToken: 2,
              schoolId: 3,
              memberId: 5,
              pluginId: keyToDelete
            }).then((res) => {
              if (activeKey && activesKey) {
                getAICardDetail({
                  userId: 1,
                  userToken: 2,
                  schoolId: 3,
                  memberId: 5,
                  domainId: activesKey,
                  modelTypeId: activeKey
                }).then((res) => {
                  setData(res);
                  // console.log('res', res);
                });
              } else if (activeKey && activesKey === null) {
                getAICardDetail({
                  userId: 1,
                  userToken: 2,
                  schoolId: 3,
                  memberId: 5,
                }).then((res) => {
                  setData(res);
                  // console.log('res', res);
                });
              }
            });
          },
          onCancel: () => {
            // 取消操作，可根据需要进行处理
          }
        });
      }
    },
  ];
  const [data, setData] = React.useState<any>([]);
  useEffect(() => {
    // 根据参数获取不同AI数据
    if (activeKey && activesKey) {
      getAICardDetail({
        userId: 1,
        userToken: 2,
        schoolId: 3,
        memberId: 5,
        domainId: activesKey,
        modelTypeId: activeKey
      }).then((res) => {
        setData(res);
        // console.log('res', res);
      });
    }
    else if (activeKey && activesKey === null) {
      getAICardDetail({
        userId: 1,
        userToken: 2,
        schoolId: 3,
        memberId: 5,
      }).then((res) => {
        setData(res);
        // console.log('res', res);
      });
    }
  }, [activeKey, activesKey]);
  const contentRef = useRef<HTMLDivElement>(null);
  //控制滚动
  useEffect(() => {
    if (contentRef.current && scrollKey) {
      const cardElement = contentRef.current.querySelector(`.Card[data-key="${scrollKey}"]`);
      if (cardElement) {
        cardElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [scrollKey]);
  // const handleEditClick = () => {
  //   console.log('修改')
  // }
  return (
    <div ref={contentRef}>
      {contextHolder}
      {/* {itemss.map((item, index) => (
        <div className='Card' key={index} data-key={item.key} style={{ fontWeight: 500, fontSize: '20px', color: 'gray' }}><span style={{ marginRight: '8px' }}>{item.icon}</span>{item.label}</div>
      ))} */}
      {/* <Row>
        {data.map((item, index) => (
          <Col key={index} className={styles.col}>
            <Card title={item.name} extra={<Button onClick={handleEditClick} icon="" size="small">修改</Button>} bordered={true} hoverable={true} className={styles.card}>
              <div className={styles.cardContent}>{item.note}</div>
            </Card>
          </Col>
        ))}
      </Row> */}
      <div className={styles.cardGrid}>
        {data.map((item: any) => (
          <Card.Grid key={item.id} className={styles.card} hoverable={true}>
            <div className={styles.cardContent}>
              <div className={styles.left}>
                <img src={item.icon} alt="" />
              </div>
              <div className={styles.right}>
                <div className={styles.cardPicture}>
                  <img className={styles.eye} src={eyeImg} alt="" />
                  <Dropdown className={styles.maohao} autoAdjustOverflow={true} overlayStyle={{ width: '92px', height: '141px' }} menu={{ items }}>
                    <a onClick={(e) => e.preventDefault()}>
                      <Space>
                        <img src={maohaoImg} alt="" />
                      </Space>
                    </a>
                  </Dropdown>
                </div>
                <div className={styles.cardTitle}>{item.name}</div>
                <div className={styles.cardNote}>{item.note}</div>
              </div>
            </div>
          </Card.Grid>
        ))}
      </div>
    </div>
  )
};

export default AllModels;