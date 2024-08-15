import React, { useEffect } from 'react';
import { getAIProductList, getAllAIModel } from '@/services/aiJobHunt';
import { SearchOutlined } from '@ant-design/icons';
import { Input, Space, Button } from 'antd';
import { Menu } from 'antd';
import styles from './index.less';
import AllModels from './AllModels/index';
// import { HomeWork } from "@/assets/images/homework.png"
const suffix = (
  <SearchOutlined
    style={{
      width: '13px',
      height: '13px',
      // background: '#999999',
    }}
  />);
const AiList: React.FC = () => {
  const [data, setData] = React.useState<any>([]);
  const [list, setList] = React.useState<any>([]);
  const [selectedKey, setSelectedKey] = React.useState<string>();//子组件查询所需要的modelTypeId参数
  const [selectedsKey, setSelectedsKey] = React.useState<string>();//子组件查询所需要的domainId参数
  const [scrollKey, setScrollKey] = React.useState<string>();//用于控制子组件的重新渲染，滚动参数
  const [item, setItem] = React.useState<any>([]);//用于子组件渲染数据
  // 获取AI产品列表
  useEffect(() => {
    // 获取AI产品列表
    getAIProductList({ userId: 1, userToken: 2, schoolId: 3, memberId: 4 }).then((res) => {
      setData(res);
    })
    // 获取AI模型列表
    getAllAIModel({ userId: 1, userToken: 2, schoolId: 3, memberId: 4 }).then((res) => {
      setList(res);
    })
  }, []); // 传入空数组，使副作用函数仅在组件挂载时执行一次  
  const handleMenuClick = (key: string, items: any) => {
    setSelectedKey(key);
    setScrollKey(key);
    setItem(items);
  };
  const handleModelClick = (keys: string) => {
    setSelectedsKey(keys);
  }
  //scrollKey传到子组件后，子组件重新渲染，scrollKey清空
  const deletes = setInterval(() => {
    if (scrollKey) {
      setScrollKey('');
      clearInterval(deletes);
    }
  })
  const items = data.map((item: any) => ({
    key: item.id,
    label: item.name,
    icon: <img style={{ width: '16px', height: '16px' }} src="@/assets/images/homework.png" alt='' />,
    onClick: () => handleMenuClick(item.id, items),
    children: item.children?.map((child: any) => ({
      // key: child.id,
      label: child.name,
    })) || undefined,
  }));

  return (
    <div className={styles.container}>
      <div className={styles.header}></div>
      <div className={styles.content}>
        <Menu
          className={styles.left}
          mode="inline"
          items={items}
        // imgSrc="@/assets/images/homework.png"
        />
        <div className={styles.right}>
          <div className={styles.title}>
            <p className={styles.titleName}><span className={styles.word} style={{ marginRight: '30px' }}>AI</span><span style={{ color: '#0417DB' }}>工具集</span></p>
            <p className={styles.description}>精选AI产品，高效工作，乐享生活！</p>
            <div className={styles.choice}>
              <div className={styles.models}>
                <ul><li><img src="@/assets/images/buttn.png" alt="" /></li></ul>
                {list.map((item: any) => (
                  <ul><li onClick={() => handleModelClick(item.id)}>{item.name}</li></ul>
                ))}
              </div>
              <div className={styles.search}>
                <Space direction="vertical">
                  <Input className={styles.searchInput} placeholder="请输入搜索内容" allowClear suffix={suffix} style={{ width: 240, height: 32 }} />
                </Space>
                <Button className={styles.searchBtn} type="primary" danger><img src="@/assets/images/search.png" alt="" /><span className={styles.words}>新建</span></Button>
              </div>
            </div>
          </div>
          <div className={styles.contents}>
            <AllModels items={item} activeKey={selectedKey} activesKey={selectedsKey} scrollKey={scrollKey}></AllModels>
          </div>
        </div>
      </div >
    </div >
  );
};

export default AiList;