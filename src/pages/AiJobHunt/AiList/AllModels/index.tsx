import React, { useEffect, useRef } from 'react';
import { Card } from 'antd';
import { getAICardDetail, deletePlugin, copyPlugin, publishPlugin } from '@/services/aiJobHunt'
import styles from './index.less';
import { Dropdown, Space } from 'antd';
import eyeImg from '@/assets/images/eye.png';
import maohaoImg from '@/assets/images/maohao.png';
import { message, Modal } from 'antd';
import { history } from 'umi';
import ScenePreview from '../../../AiModule/scenePreview';

const AllModels: React.FC<{ itemss: any[]; activeKey: string | null; activesKey: string | null; scrollKey: string | null; values: any | null }> = ({ itemss, activeKey, activesKey, scrollKey, values }) => {

  const [data, setData] = React.useState<any>([]);
  const [open, setOpen] = React.useState<any>(false);
  const [id, setId] = React.useState<any>(null);
  const [messageApi, contextHolder] = message.useMessage();
  // 状态管理变量，用对象存储每个 item 的发布状态
  const [publishedStates, setPublishedStates] = React.useState<Record<string, boolean>>({});
  // 获取发布按钮的标签文本
  const getPublishLabel = (keys: any) => {
    return publishedStates[keys] ? '取消发布' : '发布';
  };

  // 处理发布按钮点击事件
  const handlePublishClick = (keyToDelete: string) => {
    const state = publishedStates[keyToDelete] ? 'unrelase' : 'normal';
    publishPlugin({
      userId: 1,
      userToken: 2,
      schoolId: 3,
      memberId: 5,
      pluginId: keyToDelete,
      state,
    }).then((res) => {
      messageApi.open({
        type: 'success',
        content: publishedStates[keyToDelete] ? '取消发布成功' : '发布成功',
      });
      setPublishedStates({
        ...publishedStates,
        [keyToDelete]: !publishedStates[keyToDelete],
      });
      if (activeKey && activesKey) {
        getAICardDetail({
          userId: 1,
          userToken: 2,
          schoolId: 3,
          memberId: 5,
          domainId: activesKey,
          modelTypeId: activeKey,
          search: values,
        }).then((res) => {
          setData(res);
        });
      } else if (activeKey && activesKey === null) {
        getAICardDetail({
          userId: 1,
          userToken: 2,
          schoolId: 3,
          memberId: 5,
          search: values,
        }).then((res) => {
          setData(res);
        });
      }
    });
  };
  useEffect(() => {
    // 根据参数获取不同AI数据
    if (activeKey && activesKey) {
      getAICardDetail({
        userId: 1,
        userToken: 2,
        schoolId: 3,
        memberId: 5,
        domainId: activesKey,
        modelTypeId: activeKey,
        search: values,
      }).then((res) => {
        setData(res);
      });
    }
    else if (activeKey && activesKey === null) {
      getAICardDetail({
        userId: 1,
        userToken: 2,
        schoolId: 3,
        memberId: 5,
        search: values,
      }).then((res) => {
        setData(res);
      });
    }
  }, [activeKey, activesKey, values]);
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
      {
        open && <ScenePreview id={id} onCancel={()=> { setOpen(false) }} onOk={()=> { setOpen(false) }}></ScenePreview>
      }
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
                  <img onClick={()=> {
                    console.log('222222222222');
                    setOpen(true);
                    setId(item.id);
                  }} className={styles.eye} src={eyeImg} alt="" />
                  {item.isConfig === 0 ? (
                    <Dropdown
                      className={`${styles.maohao} disabled-dropdown`}
                      autoAdjustOverflow={true}
                      overlayStyle={{ width: '92px', height: '141px' }}
                      menu={{
                        items: [
                          {
                            label: getPublishLabel(item.id),
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
                              handlePublishClick(item.id)
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
                            },
                            onClick: () => {
                              window.sessionStorage.setItem('pluginId', item.id);
                              history.push('/createAiModule');
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
                              copyPlugin({
                                userId: 1,
                                userToken: 2,
                                schoolId: 3,
                                memberId: 5,
                                pluginId: item.id
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
                                    modelTypeId: activeKey,
                                    search: values,
                                  }).then((res) => {
                                    setData(res);
                                  });
                                }
                                else if (activeKey && activesKey === null) {
                                  getAICardDetail({
                                    userId: 1,
                                    userToken: 2,
                                    schoolId: 3,
                                    memberId: 5,
                                    search: values,
                                  }).then((res) => {
                                    setData(res);
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
                                    pluginId: item.id
                                  }).then((res) => {
                                    if (activeKey && activesKey) {
                                      getAICardDetail({
                                        userId: 1,
                                        userToken: 2,
                                        schoolId: 3,
                                        memberId: 5,
                                        domainId: activesKey,
                                        modelTypeId: activeKey,
                                        search: values,
                                      }).then((res) => {
                                        setData(res);
                                      });
                                    } else if (activeKey && activesKey === null) {
                                      getAICardDetail({
                                        userId: 1,
                                        userToken: 2,
                                        schoolId: 3,
                                        memberId: 5,
                                        search: values,
                                      }).then((res) => {
                                        setData(res);
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
                        ]
                      }}
                      disabled
                      style={{ pointerEvents: 'none', opacity: 0.5 }}
                      onMouseEnter={(e: any) => {
                        e.currentTarget.style.opacity = 0.5;
                        e.currentTarget.style.cursor = 'not-allowed';
                      }}
                      onMouseLeave={(e: any) => {
                        e.currentTarget.style.opacity = 0.5;
                      }}
                    >
                      <a onClick={(e) => e.preventDefault()}>
                        <Space>
                          <img src={maohaoImg} alt="" />
                        </Space>
                      </a>
                    </Dropdown>
                  ) : (
                    <Dropdown
                      className={styles.maohao}
                      autoAdjustOverflow={true}
                      overlayStyle={{ width: '92px', height: '141px' }}
                      menu={{
                        items: [
                          {
                            label: getPublishLabel(item.id),
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
                              handlePublishClick(item.id)
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
                            },
                            onClick: () => {
                              window.sessionStorage.setItem('pluginId', item.id);
                              history.push('/createAiModule');
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
                              copyPlugin({
                                userId: 1,
                                userToken: 2,
                                schoolId: 3,
                                memberId: 5,
                                pluginId: item.id
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
                                    modelTypeId: activeKey,
                                    search: values,
                                  }).then((res) => {
                                    setData(res);
                                  });
                                }
                                else if (activeKey && activesKey === null) {
                                  getAICardDetail({
                                    userId: 1,
                                    userToken: 2,
                                    schoolId: 3,
                                    memberId: 5,
                                    search: values,
                                  }).then((res) => {
                                    setData(res);
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
                                    pluginId: item.id
                                  }).then((res) => {
                                    messageApi.open({
                                      type: 'success',
                                      content: '删除成功',
                                    });
                                    if (activeKey && activesKey) {
                                      getAICardDetail({
                                        userId: 1,
                                        userToken: 2,
                                        schoolId: 3,
                                        memberId: 5,
                                        domainId: activesKey,
                                        modelTypeId: activeKey,
                                        search: values,
                                      }).then((res) => {
                                        setData(res);
                                      });
                                    } else if (activeKey && activesKey === null) {
                                      getAICardDetail({
                                        userId: 1,
                                        userToken: 2,
                                        schoolId: 3,
                                        memberId: 5,
                                        search: values,
                                      }).then((res) => {
                                        setData(res);
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
                        ]
                      }}
                    >
                      <a onClick={(e) => e.preventDefault()}>
                        <Space>
                          <img src={maohaoImg} alt="" />
                        </Space>
                      </a>
                    </Dropdown>
                  )}
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