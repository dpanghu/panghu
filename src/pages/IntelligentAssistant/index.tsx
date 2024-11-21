import React from 'react';
import { useMount, useReactive } from 'ahooks';
import styles from './index.less';
import layout1 from '@/assets/images/layout1.png';
import layout2 from '@/assets/images/layout2.png';
import layout3 from '@/assets/images/layout3.png';
import layout4 from '@/assets/images/layout4.png';
import { Table } from 'SeenPc';
import logos from '@/assets/images/seentao_logo.svg';
interface TState {
    layoutData: any;
    currentLayout: any;
}
const App: React.FC = () => {
    const state = useReactive<TState>({
        layoutData: [
            {
                name: '应用管理',
                id: '1',
            },
            {
                name: '知识库',
                id: '2',
            },
            {
                name: '团队管理',
                id: '3',
            },
            {
                name: '数据统计',
                id: '4',
            }
        ],
        currentLayout: '1'
    });

    useMount(() => {
        
    })

    const chooseLayout = (id: any) => {
       state.currentLayout = id;
    }

    const column = [
        {
            title: '序号',
            dataIndex: 'sort',
            key: 'sort',
            align: 'center',
            width: 80,
          },
          {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
          },
          {
            title: '学号',
            dataIndex: 'sno',
            key: 'sno',
          },
          {
            title: '学校',
            dataIndex: 'school',
            key: 'school',
          },
          {
            title: '学院',
            dataIndex: 'college',
            key: 'college',
          },
          {
            title: '专业',
            dataIndex: 'master',
            key: 'master',
          },
          {
            title: '班级',
            dataIndex: 'class',
            key: 'class',
          },
          {
            1 : '财务会计的要素',
            2 : '资产的定义，分类',
            3 : '流动性资产和非流动性资产定义，包含那些内容',
            4 : '所有者权益包含哪些',
            5 : '财务核算的基本假设包括什么',
            6 : '会计核算的基础',
            7 : '会计核算的基本过程（步骤）'
          },
          {
            1 : '支出的分类',
            2 : '支出、费用、成本之间的关系，费用、成本直接的区别',
            3 : '费用确认的条件及其所属会计期间的确认',
            4 : '成本核算的方法',
            5 : '直接成本和间接成本的定义（分别包含哪些）',
            6 : '期间费用包含哪些费用',
          },
          {
            1 : '收入的定义及其包含哪些',
            2 : '收入的分类',
            3 : '',
            4 : '成本核算的方法',
            5 : '直接成本和间接成本的定义（分别包含哪些）',
            6 : '期间费用包含哪些费用',
          }
    ]

    return (
        <div className={styles.container} >
            <div className={styles.head}>         
                <div className={styles.head_title}><img src={logos} style={{ width: 40,height: 25,marginLeft: 0, marginRight: 6 }}></img>新道教育知识库</div>
                <div className={styles.head_right}>
                   <span>四川大学</span>
                   <div className={styles.average_img}></div>
                </div>
            </div>
            <div className={styles.content}>
                <div className={styles.content_left}>
                    {
                        // eslint-disable-next-line array-callback-return
                        state.layoutData && state.layoutData.map((item: any,index: any)=> {
                            return <div onClick={()=> {
                                chooseLayout(item.id);
                            }} className={state.currentLayout === item.id ? styles.layout_boxs : styles.layout_box} key={item.id}>
                                <img className={styles.layout_img} src={index === 0 ? layout1 : index === 1 ? layout2 : index === 2 ? layout3 : layout4}></img>
                                {item.name}
                            </div>
                        })
                    }
                </div>
                <div className={styles.content_right}>
                    <div className={styles.content_right_box}>
                       <Table dataSource={[]} columns={column}></Table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
