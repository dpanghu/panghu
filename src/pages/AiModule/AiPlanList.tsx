import React from 'react';
import { saveAnswer } from '@/services/aiJobHunt';
import { useMount, useReactive } from 'ahooks';
import styles from './AiPlanList.less';
import Backs from '@/assets/images/backs.png'
import { getConvertParamId } from '@/services/aiJobHunt/index';
import { message } from 'antd';
import planbac from '@/assets/images/plantitle.png';
import { history } from 'umi';
interface TState {
    curTheme: any;
    dialogList: any;
    excludeId: any;
    editId: string;
    editName: string;
    imgId: any;
    data: any;
    baseData: any;
    allow: any;
    introduce: any;
    aiData: any;
    imgUrl: any;
    isLoading: any;
    messageArr: any;
    patams: any;
    visible: any;
    isTyping: any;
    messageList: any;
    typewriterArrCache: any;
}
const App: React.FC = () => {
    const state = useReactive<TState>({
        curTheme: undefined,
        introduce: false,
        dialogList: [],
        baseData: [],
        typewriterArrCache: [],
        editId: '',
        excludeId: '',
        messageArr: [],
        isLoading: false,
        isTyping: false,
        messageList: [],
        allow: '',
        aiData: {},
        imgUrl: '',
        editName: '',
        imgId: '',
        visible: false,
        patams: '',
        data: [],
    });

    const save = (values: any) => {
        let arr: any = [];
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions, array-callback-return
        Object.keys(values) && Object.keys(values).map((el: any) => {
            let obj: any = {};
            obj.questionId = el;
            obj.answerOptionIds = values[el];
            obj.answerInput = values[el];
            arr.push(obj);
        })
        saveAnswer({
            answer: JSON.stringify(arr),
            userId: '42084774553583616',
            userToken: '2ba4dcfc10abe43a03e7253e8ed53998',
            memberId: '42084774565642240',
            schoolId: '100678506119168',
            classId: '1',
            taskId: '2',
            paramId: state.patams,
            dbeProjectVersionId: '1'
        }).then((res: any) => {
            message.success('保存成功');
            console.log(res);
            window.sessionStorage.setItem('portfolio',res.portfolio);
            history.push('/AiPlanPeople');
        });
    }

    useMount(() => {
        getConvertParamId({}).then((res: any) => {
            state.patams = res;
        });
        // getQuestion({
        //     userId: '42084774553583616',
        //     userToken: '2ba4dcfc10abe43a03e7253e8ed53998',
        //     memberId: '42084774565642240',
        //     schoolId: '100678506119168',
        //     classId: '1',
        //     taskId: '2',
        //     dbeProjectVersionId: '1'
        // }).then((res: any) => {
        //     console.log(res);
        //     let arr: any = [];
        //     let types: any = {
        //         'INPUT': 'input',
        //         'SINGLE_CHOICE': 'radio',
        //     }
        //     // eslint-disable-next-line @typescript-eslint/no-unused-expressions, array-callback-return
        //     res.questionList && res.questionList.map((item: any) => {
        //         if (item.options) {
        //             // eslint-disable-next-line @typescript-eslint/no-unused-expressions, array-callback-return
        //             item.options && item.options.map((element: any) => {
        //                 element.label = element.name;
        //                 element.value = element.id;
        //             })
        //         }
        //         arr.push({
        //             title: item.name,
        //             type: types[item.type],
        //             // eslint-disable-next-line eqeqeq
        //             isRequired: item.required == 1 ? true : false,
        //             id: item.id,
        //             options: item.options ? item.options : '',
        //         })
        //     })
        //     state.data = arr;
        //     console.log(JSON.stringify(state.data));
        // })
    })

    return (
        <div className={styles.peoplecontainer} >
            <div className={styles.head} onClick={()=> {
                history.push('/AiPlan')
            }}>
                <img src={Backs} style={{ width: 16, height: 16 }}></img>
                <div className={styles.backText} style={{ color: '#999999' }}>返回</div>
                <div className={styles.backText} style={{ marginLeft: 5, color: '#999999' }}>|</div>
                <div className={styles.backText} style={{ lineHeight: '22px', marginLeft: 12 }}>AI学习规划</div>
            </div>
            <div className={styles.contents} style={{ width: '100%', paddingLeft: 8, paddingRight: 8 }}>
                <div className={styles.content}>
                    <img src={planbac} style={{ position:'absolute',width:'868px',height: 49, marginTop: 19 }}></img>
                    <div className={styles.tables}>
                         <div className={styles.box}>
                            <div className={styles.ths} style={{ width: '65px' }}>日期</div>
                            <div className={styles.ths}>学习内容</div>
                            <div className={styles.ths}>学习内容</div>
                            <div className={styles.ths}>学习内容</div>
                            <div className={styles.ths} style={{ borderRight: 'none' }}>学习内容</div>
                         </div>
                         
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
