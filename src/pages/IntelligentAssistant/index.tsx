import React from 'react';
import { useMount, useReactive } from 'ahooks';
import styles from './index.less';
interface TState {
    curTheme: any;
}mai
const App: React.FC = () => {
    const state = useReactive<TState>({
        curTheme: undefined,
    });

    useMount(() => {
        
    })

    return (
        <div className={styles.container} >
            <div className={styles.head}>
                <div className={styles.head_title}>新道教育知识库</div>
                <div className={styles.head_right}>
                   <span>四川大学</span>
                   <div className={styles.average_img}></div>
                </div>
            </div>
            <div className={styles.content}>

            </div>
        </div>
    );
};

export default App;
