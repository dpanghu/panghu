import React from 'react';
import { useMount, useReactive } from 'ahooks';
import styles from './index.less';
import layout1 from '@/assets/images/layout1.png';
import layout2 from '@/assets/images/layout2.png';
import layout3 from '@/assets/images/layout3.png';
import layout4 from '@/assets/images/layout4.png';
import { Table } from 'SeenPc';
import { getQueryParam } from '@/utils/utils';
import qs from 'qs';
import { base64 } from 'seent-tools';
import { useOutlet } from '@umijs/max';
import { history } from 'umi';
import { getTeamList } from '@/services/aiassistant';
import logos from '@/assets/images/seentao_logo.svg';
interface TState {
  layoutData: any;
  currentLayout: any;
  page: any;
  limit: any;
  headImgUrl: any;
  schoolName: any;
}
const App: React.FC = () => {
  const outlet = useOutlet();
  const state = useReactive<TState>({
    page: 1,
    limit: 10,
    headImgUrl: '',
    schoolName: '',
    layoutData: [
      {
        name: '应用管理',
        id: 'application',
      },
      {
        name: '知识库',
        id: 'knowledge',
      },
      {
        name: '团队管理',
        id: 'teamManage',
      },
      {
        name: '数据统计',
        id: 'statistic',
      }
    ],
    currentLayout: ''
  });

  const getList = () => {
    getTeamList({
      page: state.page,
      limit: state.limit,
    }).then((res: any) => {
      console.log(res);
    })
  }

  const getSubstringAfterLastSlash = (str: any) => {
    // 找到最后一个 '/' 的索引
    const lastIndex = str.lastIndexOf('/');

    // 检查是否找到了 '/'
    if (lastIndex !== -1 && lastIndex < str.length - 1) {
      // 使用 substring 获取最后一个 '/' 后面的内容
      return str.substring(lastIndex + 1);
    } else {
      // 如果没有找到 '/'，则返回整个字符串或空字符串（根据需要调整）
      return '';
    }
  }

  useMount(() => {
    let location_url = getSubstringAfterLastSlash(window.location.pathname);
    state.currentLayout = location_url;
    let qs: any = getQueryParam();
    console.log(qs);
    if (qs.headImgUrl !== void 0) {
      state.headImgUrl = qs.headImgUrl;
      state.schoolName = qs.schoolName;
    } else {
      state.headImgUrl = JSON.parse(
        (window.sessionStorage.getItem('commonDatas') as any) || '{}',
      ).headImgUrl;
      state.headImgUrl = JSON.parse(
        (window.sessionStorage.getItem('commonDatas') as any) || '{}',
      ).schoolName;
    }
      console.log(state.currentLayout);
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
          <span>{state.schoolName}</span>
          <div className={styles.average_img}>
            <img style={{ width:'100%',height:'100%' }} src={state.headImgUrl}></img>
          </div>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.content_left}>
          {
            // eslint-disable-next-line array-callback-return
            state.layoutData && state.layoutData.map((item: any, index: any) => {
              return <div onClick={() => {
                if (item.id !== 'teamManage') {
                  let qsData: any = getQueryParam();
                  let accountId = '';
                  if (qsData.accountId !== void 0) {
                    accountId = qsData.accountId;
                  } else {
                    accountId = JSON.parse(
                      (window.sessionStorage.getItem('commonDatas') as any) || '{}',
                    ).accountId;
                  }
                  chooseLayout(item.id);
                  window.open(`http://10.10.16.33:1180/repo_simple_web/loginByWorkbench/${accountId}?qs=${base64.encode(
                    qs.stringify({
                      route: `/${item.id}`,
                      frame: 1,
                    }),
                  )
                    }`)
                } else {
                  history.push(`/IntelligentAssistant/${item.id}`);
                }
                // history.push(`/IntelligentAssistant/${item.id}`);
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
