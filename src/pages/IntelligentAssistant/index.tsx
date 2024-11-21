import React from 'react';
import { useMount, useReactive } from 'ahooks';
import styles from './index.less';
import layout1 from '@/assets/images/layout1.png';
import layout2 from '@/assets/images/layout2.png';
import layout3 from '@/assets/images/layout3.png';
import layout4 from '@/assets/images/layout4.png';
import { Table } from 'SeenPc';
import { useOutlet } from '@umijs/max';
import { getTeamList } from '@/services/aiassistant';
import logos from '@/assets/images/seentao_logo.svg';
interface TState {
  layoutData: any;
  currentLayout: any;
  page: any;
  limit: any;
}
const App: React.FC = () => {
  const outlet = useOutlet();
  const state = useReactive<TState>({
    page: 1,
    limit: 10,
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

  const getList = () => {
    getTeamList({
      page: state.page,
      limit: state.limit,
      userId: '95996487937818663',
      userName: '13581731521',
      userToken: '3dad8428b2d16fbf4b0207f099c496a9',
      userType: 'PLATFORM',
      memberId: '119223553064173608',
      orgType: 'SCHOOL',
      orgId: '119223501898383409',
      schoolId: '119223501898383409',
      memberType: 'TEACHER',
      dbeCourseId: '102822587426836481',
      orgCode: 'test_datasets_auth',
      memberCode: '3123123',

    }).then((res: any) => {
      console.log(res);
    })
  }

  useMount(() => {
  })

  const chooseLayout = (id: any) => {
    state.currentLayout = id;
  }

  const column = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: '最后操作时间',
      dataIndex: 'last_login_at',
      key: 'last_login_at',
    },
  ]

  return (
    <div className={styles.container} >
      <div className={styles.head}>
        <div className={styles.head_title}><img src={logos} style={{ width: 40, height: 25, marginLeft: 0, marginRight: 6 }}></img>新道教育知识库</div>
        <div className={styles.head_right}>
          <span>四川大学</span>
          <div className={styles.average_img}></div>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.content_left}>
          {
            // eslint-disable-next-line array-callback-return
            state.layoutData && state.layoutData.map((item: any, index: any) => {
              return <div onClick={() => {
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
            {/* <Table dataSource={[]} columns={column}></Table> */}
            {outlet}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
