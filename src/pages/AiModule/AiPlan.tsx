import React from 'react';
import Questionnaire from '../../components/Question';
import { getQuestion, saveAnswer } from '@/services/aiJobHunt';
import { useMount, useReactive } from 'ahooks';
import styles from './AiPlan.less';
import { getConvertParamId } from '@/services/aiJobHunt/index';
import { Button } from 'SeenPc';
import { useRef } from 'react';
import { message } from 'antd';
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
    questionData: any;
    patams: any;
    visible: any;
    isTyping: any;
    messageList: any;
    typewriterArrCache: any;
}
const App: React.FC = () => {
    const refs: any = React.createRef();
    const state = useReactive<TState>({
        curTheme: undefined,
        introduce: false,
        dialogList: [],
        baseData: [],
        typewriterArrCache: [],
        editId: '',
        questionData: {},
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
    const data = [
        {
            title: 'What is your age?1',
            type: 'radio',
            options: [
                { label: 'Under 18', value: '1' },
                { label: '18-25', value: '2' },
                { label: '26-35', value: '3' },
                { label: '36-45', value: '4' },
                { label: '其他', value: '0' }
            ],
            isRequired: true,
            id: '1',
        },
        {
            title: 'What is your age?2',
            type: 'radio',
            options: [
                { label: 'Under 18', value: '1' },
                { label: '18-25', value: '2' },
                { label: '26-35', value: '3' },
                { label: '36-45', value: '4' },
                { label: '其他', value: '0' }
            ],
            isRequired: true,
            id: '2',
        },
        {
            title: 'What is your age?3',
            type: 'radio',
            options: [
                { label: 'Under 18', value: '1' },
                { label: '18-25', value: '2' },
                { label: '26-35', value: '3' },
                { label: '36-45', value: '4' },
                { label: '其他', value: '0' }
            ],
            isRequired: true,
            id: '3',
        },
        {
            title: 'What is your favorite color?4',
            type: 'select',
            options: [
                { label: 'Red', value: '1' },
                { label: 'Blue', value: '2' },
                { label: 'Green', value: '3' }
            ],
            isRequired: true,
            id: '4',
        },
        {
            title: 'What is your favorite color?5',
            type: 'checkbox',
            options: [
                { label: 'Red', value: '1' },
                { label: 'Blue', value: '2' },
                { label: 'Green', value: '3' }
            ],
            isRequired: false,
            id: '5',
        },
        {
            title: 'What is your name?6',
            type: 'input',
            isRequired: false,
            id: '6',
        },
        {
            title: 'What is your name?7',
            type: 'input',
            isRequired: false,
            id: '7',
        }
    ];

    const save = (values: any) => {
        let arr: any = [];
        console.log('2222222222', values);
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions, array-callback-return
        values && values.map((el: any) => {
            let obj: any = {};
            if (el.type === 'radio') {
                // eslint-disable-next-line array-callback-return, @typescript-eslint/no-unused-expressions, eqeqeq
                let chooseInput: any = el.options.find((el: any) => el.needInput == 1);;
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions, array-callback-return
                if (chooseInput !== void 0) {
                    // eslint-disable-next-line eqeqeq
                    if (chooseInput.id == el.value) {
                        obj.answerInput = chooseInput.needValue
                    }
                }
                obj.questionId = el.id;
                obj.answerOptionIds = el.value;
            } else if (el.type === 'input') {
                obj.questionId = el.id;
                obj.answerInput = el.value;
            } else if (el.type == 'checkbox') {
                obj.questionId = el.id;
                obj.answerOptionIds = el.value.join(',');
            }
            arr.push(obj);
        })
        console.log('values', arr);
        saveAnswer({
            answer: JSON.stringify(arr),
            userId: '42084774553583616',
            userToken: '2ba4dcfc10abe43a03e7253e8ed53998',
            memberId: '42084774565642240',
            schoolId: '100678506119168',
            classId: '1',
            paramId: state.patams,
            dbeProjectVersionId: '1'
        }).then((res: any) => {
            message.success('保存成功');
            console.log(res);
            window.sessionStorage.setItem('portfolio', res.portfolio);
            window.sessionStorage.setItem('portrait', res.portrait);
            history.push('/AiPlanPeople');
        });
    }

    useMount(() => {
        getConvertParamId({}).then((res: any) => {
            state.patams = res;
        });
        let send: any = {
            userId: '42084774553583616',
            userToken: '2ba4dcfc10abe43a03e7253e8ed53998',
            memberId: '42084774565642240',
            schoolId: '100678506119168',
            classId: '1',
            dbeProjectVersionId: '1'
        };
        if (JSON.parse(window.sessionStorage.getItem('commonDatas') as any || '{}').origin == 'application') {
            send.taskId = 0;
        }
        getQuestion({ ...send }).then((res: any) => {
            console.log(res);
            let arr: any = [];
            let types: any = {
                'INPUT': 'input',
                'SINGLE_CHOICE': 'radio',
                'MULTI_CHOICE': 'checkbox'
            }

            // eslint-disable-next-line @typescript-eslint/no-unused-expressions, array-callback-return
            res.questionList && res.questionList.map((item: any) => {
                if (item.options) {
                    // eslint-disable-next-line @typescript-eslint/no-unused-expressions, array-callback-return
                    item.options && item.options.map((element: any) => {
                        element.label = element.name;
                        element.value = element.id;
                    })
                }
                arr.push({
                    title: item.name,
                    type: types[item.type],
                    // eslint-disable-next-line eqeqeq
                    isRequired: item.required == 1 ? true : false,
                    displays: item.display,
                    display: item.display,
                    id: item.id,
                    options: item.options ? item.options : '',
                })
            })
            state.data = arr;
            state.questionData = res.xaiSp;
            console.log(JSON.stringify(state.data));
        })
    })

    return (
        <div className={styles.container} >
            <div className={styles.head}>AI学习规划</div>
            <div style={{ width: '100%', paddingLeft: 8, paddingRight: 8 }}>
                <div className={styles.banner}>
                    <div className={styles.banner_head}>{state.questionData.name}</div>
                    <div className={styles.benner_desc}>{state.questionData.content}</div>
                    {/* <div className={styles.benner_desc}>期望、专业技能等方面，请您根据自身情况，真实、客观的填写。您的图谱仅用于本项目案例应用。感谢您的参与和支持！</div> */}
                </div>
            </div>
            <div className={styles.mid}>
                <Questionnaire ref={refs} footer={false} dataSource={state.data} title=''
                    description=''
                    footerDescription={state.questionData.endtips}
                    submit={(values: any) => {
                        save(values);
                    }} insertPosition={3}
                // insertContent={<div>xxxxx</div>}
                />
            </div>
            {/* <div className={styles.foot}>
                <Button type='primary' onClick={()=> {
                    save();
                }}>生成画像</Button>
            </div> */}
        </div>
    );
};

export default App;
