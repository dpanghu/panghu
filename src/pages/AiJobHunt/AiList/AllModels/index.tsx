import React, { useEffect, useRef, } from 'react';
import { Card } from 'antd';
import { getAICardDetail } from '@/services/aiJobHunt'
import styles from './index.less';
import { EllipsisOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Space } from 'antd';
import xinImg from '@/assets/images/xin.png';
import eyeImg from '@/assets/images/eye.png';

const AllModels: React.FC<{ itemss: any[]; activeKey: string | null; activesKey: string | null; scrollKey: string | null }> = ({ itemss, activeKey, activesKey, scrollKey }) => {

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
      }
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
        console.log('res', res);
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
        console.log('res', res);
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
  const handleEditClick = () => {
    console.log('修改')
  }
  return (
    <div ref={contentRef}>
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
        {data.map((item) => (
          <Card.Grid key={item.id} className={styles.card} hoverable={true} onClick={handleEditClick}>
            <div className={styles.cardContent}>
              <div className={styles.left}>
                <img src={xinImg} alt="" />
              </div>
              <div className={styles.right}>
                <div className={styles.cardPicture}>
                  <img src={eyeImg} alt="" />
                  <Dropdown className={styles.maohao} autoAdjustOverflow={true} overlayStyle={{ width: '92px', height: '141px' }} menu={{ items }}>
                    <a onClick={(e) => e.preventDefault()}>
                      <Space>
                        <EllipsisOutlined />
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