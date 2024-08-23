import React, { useEffect } from 'react';
import { getAIProductList, getAllAIModel } from '@/services/aiJobHunt';
import { SearchOutlined } from '@ant-design/icons';
import { Space, Button } from 'antd';
import { Menu } from 'antd';
import styles from './index.less';
import AllModels from './AllModels/index';
import { history } from 'umi';
import homeworkImg from '@/assets/images/homework.png';
import searchImg from '@/assets/images/search.png';
import addImg from '@/assets/images/add.png';
import selectImg from '@/assets/images/select.png';
import aiTitleImg from '@/assets/images/aiTitle.png';
import { Input } from 'SeenPc';
const suffix = (
  <SearchOutlined
    style={{
      width: '13px',
      height: '13px',
    }}
  />);
const AiList: React.FC = () => {
  const [data, setData] = React.useState<any>([]);
  const [list, setList] = React.useState<any>([]);
  const [select, setSelect] = React.useState<any>(null);//用于控制点击渲染背景色
  const [selectedKey, setSelectedKey] = React.useState<string>();//子组件查询所需要的modelTypeId参数
  const [selectedsKey, setSelectedsKey] = React.useState<any>(null);//子组件查询所需要的domainId参数
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
  const handleMenuClick = (key: any, items: any) => {
    setSelectedKey(key);
    setScrollKey(key);
    setItem(items);
  };
  const handleModelClick = (keys: any) => {
    setSelectedsKey(keys);
    setSelect(keys);
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
    icon: <img style={{ width: '16px', height: '16px' }} src={homeworkImg} alt='' />,
    onClick: () => handleMenuClick(item.id, items),
    children: item.children?.map((child: any) => ({
      // key: child.id,
      label: child.name,
    })) || undefined,
  }));
  useEffect(() => {
    if (data.length > 0) {
      setSelectedKey(data[0].id);
    }
  }, [data]);
  const [value, setvalue] = React.useState<any>('');//用于搜索框的值
  return (
    <div className={styles.container}>
      <div className={styles.header}></div>
      <div className={styles.content}>
        <Menu
          className={styles.left}
          mode="inline"
          defaultSelectedKeys={[selectedKey]}
          selectedKeys={[selectedKey]}
          items={items}
        />
        <div className={styles.right}>
          <div className={styles.title}>
            <div className={styles.text}>
              <img src={aiTitleImg} alt="" />
              <p className={styles.description}>精选AI产品，高效工作，乐享生活！</p>
            </div>
            <div className={styles.choice}>
              <div className={styles.models}>
                <ul style={select === null ? { backgroundImage: `url(${selectImg})`, backgroundSize: '100% 100%', color: 'white' } : {}}><li onClick={() => handleModelClick(null)}>全部</li></ul>
                {list.map((item: any) => (
                  <ul style={select === item.id ? { backgroundImage: `url(${selectImg})`, backgroundSize: '100% 100%', color: 'white' } : {}}><li onClick={() => handleModelClick(item.id)}>{item.name}</li></ul>
                ))}
              </div>
              <div className={styles.search}>
                <div className={styles.searchBox}>
                  <Input
                    className={styles.searchInput}
                    allowClear={true}
                    style={{ width: 240, height: 32 }}
                    placeholder="请输入搜索内容"
                    value={value}
                    onChange={(e: any) => {
                      setvalue(e);
                    }}
                    size="medium"
                  ></Input>
                  <img className={styles.searchImg} src={searchImg} alt="" />
                </div>
                {/* <Space direction="vertical">
                  <Input className={styles.searchInput} placeholder="请输入搜索内容" allowClear suffix={suffix} style={{ width: 240, height: 32 }} />
                </Space> */}
                <Button className={styles.searchBtn} onClick={() => {
                  history.push('/createAiModule');
                }} type="primary" danger><img src={addImg} alt="" /><span className={styles.words}>新建</span></Button>
              </div>
            </div>
          </div>
          <div className={styles.contents}>
            <AllModels itemss={item} activeKey={selectedKey} activesKey={selectedsKey} scrollKey={scrollKey}></AllModels>
          </div>
        </div>
      </div >
    </div >
  );
};

export default AiList;