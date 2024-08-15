import React, { useEffect, useRef } from 'react';
import { Card } from 'antd';
import { getAICardDetail } from '@/services/aiJobHunt'
import styles from './index.less';

const AllModels: React.FC<{ items: any[]; activeKey: string | null; activesKey: string | null; scrollKey: string | null }> = ({ items, activeKey, activesKey, scrollKey }) => {
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
      {items.map((item, index) => (
        <div className='Card' key={index} data-key={item.key} style={{ fontWeight: 500, fontSize: '20px', color: 'gray' }}><span style={{ marginRight: '8px' }}>{item.icon}</span>{item.label}</div>
      ))}
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
          <Card.Grid key={item.id} className={styles.card} hoverable={true}>
            <div className={styles.cardContent}>
              <div className={styles.left}>
                <img src="" alt="" />
              </div>
              <div className={styles.right}>
                <div className={styles.cardPicture}></div>
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