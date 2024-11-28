import React from 'react';
import { useMount, useReactive } from 'ahooks';
import styles from './index.less';
import { useOutlet } from '@umijs/max';
import { getQueryParam } from '@/utils/utils';
import qs from 'qs';
import { base64 } from 'seent-tools';
interface TState {
    layoutData: any;
    currentLayout: any;
    page: any;
    limit: any;
    accountId: any;
}
const App: React.FC = () => {
    const outlet = useOutlet();
    const state = useReactive<TState>({
        accountId: '',
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

    useMount(() => {
        let qs: any = getQueryParam();
        let accountId: any = '';
        if (qs.accountId !== void 0) {
            state.accountId = qs.accountId;
        } else {
            state.accountId = JSON.parse(
                (window.sessionStorage.getItem('commonDatas') as any) || '{}',
            ).accountId;
        }
    })

    return (
        <div className={styles.container} >
            <iframe style={{ width:'100%',height:'100%',border:'none' }} src={`http://10.10.16.33:1180/repo_simple_web/loginByWorkbench/${state.accountId}?qs=${
               base64.encode(
                qs.stringify({
                    route: '/statistic',
                    frame: 1,
                }),
              )
            }`}></iframe>
        </div>
    );
};

export default App;
