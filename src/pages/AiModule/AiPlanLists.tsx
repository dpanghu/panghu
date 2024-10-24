import React from 'react';
import { saveAnswer, getAiPlanList } from '@/services/aiJobHunt';
import { useMount, useReactive } from 'ahooks';
import styles from './AiPlanLists.less';
import Backs from '@/assets/images/backs.png'
import { getConvertParamId, getGenerateStatus } from '@/services/aiJobHunt/index';
import { message, Spin } from 'antd';
import { Button } from 'SeenPc';
import planbac from '@/assets/images/plantitles.png';
import { history } from 'umi';
import html2canvas from 'html2canvas';
interface TState {
    curTheme: any;
    dialogList: any;
    excludeId: any;
    planList: any;
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
    loading: any;
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
        loading: false,
        isLoading: false,
        isTyping: false,
        messageList: [],
        allow: '',
        planList: [],
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
            window.sessionStorage.setItem('portfolio', res.portfolio);
            history.push('/AiPlanPeople');
        });
    }

    useMount(() => {
        let planList: any = JSON.parse(window.sessionStorage.getItem('planList') as any);
        state.planList = planList;
        getConvertParamId({}).then((res: any) => {
            state.patams = res;
        });
    })

    const ensureArrayLength = (arr: any, defaultData: any, targetLength = 4) => {  
        while (arr.length < targetLength) {  
            arr.push(defaultData);  
        }  
        return arr;  
    }

    const getPlan = () => {
        let loadingTimer: any;
        state.loading = true;
        getAiPlanList({
            userMessage: window.sessionStorage.getItem('planportfolio'),
            paramId: state.patams,
            pluginCode: 'studyPlan',
            async: true,
        }).then((res: any) => {
            let planState: any; // 定时器
            let isTimerSet = false;// 标记定时器是否已经设置
            const checkStatus = async () => {
                try {
                    const ress = await getGenerateStatus({
                        themeId: res.themeId,
                    });
                    console.log(ress);
                    if (ress.status === 1) {
                        // 生成成功后，关闭加载状态
                        state.loading = false;
                        let data_result: any = JSON.parse(ress.content);
                        // eslint-disable-next-line @typescript-eslint/no-unused-expressions, array-callback-return
                        data_result && data_result.map((el: any)=> {
                            if(el.plan?.length !== 4) {
                                el.plan = ensureArrayLength(el.plan, '暂无内容')
                            }
                        })
                        state.planList = data_result;
                        message.success('生成成功');
                        if (JSON.parse(ress.content)?.length > 7) {
                            history.push('/AiPlanList');
                        } else {
                            history.push('/AiPlanLists');
                        }
                        await Promise.resolve(); // 等待当前异步操作完成
                        clearInterval(planState);
                    } else if (ress.status === 2) {
                        message.error(ress.failReason);
                        // 失败时也关闭加载状态
                        clearTimeout(loadingTimer);
                        state.loading = false;
                        await Promise.resolve(); // 等待当前异步操作完成
                        clearInterval(planState);
                    } else if (ress.status === 0) {
                        if (!isTimerSet) {
                            planState = setInterval(checkStatus, 2000);
                            isTimerSet = true;
                        } else {
                            // 如果定时器已经设置，可以考虑更新定时器间隔或不做任何操作
                        }
                    }
                } catch (error) {
                    // 错误时关闭加载状态
                    clearTimeout(loadingTimer);
                    message.destroy();
                    clearInterval(planState);
                    isTimerSet = false;
                }
            };
            checkStatus();
        })
    }

    const captureElement = () => {
        let dom: any = document.getElementById('content');
        html2canvas(dom).then(canvas => {
            // 将canvas转换为图片URL  
            let imageURL = canvas.toDataURL('image/png').replace("image/png", "image/octet-stream");

            // 创建一个临时的a标签用于下载  
            let link = document.createElement('a');
            link.download = 'downloaded-image.png'; // 指定下载的文件名  
            link.href = imageURL;
            link.click(); // 触发下载  

            // 注意：在某些浏览器中，出于安全原因，可能需要在用户交互（如点击事件）中触发下载  

            // 清理：移除创建的a标签（可选）  
            link.remove();

            // 如果需要，你也可以将图片保存到服务器（例如使用Ajax）  
        });
    }

    return (
        <Spin tip='正在生成中......' spinning={state.loading}>
        <div className={styles.peoplecontainer} >
            <div className={styles.head} onClick={() => {
                history.push('/AiPlan')
            }}>
                <img src={Backs} style={{ width: 16, height: 16 }}></img>
                <div className={styles.backText} style={{ color: '#999999' }}>返回</div>
                <div className={styles.backText} style={{ marginLeft: 5, color: '#999999' }}>|</div>
                <div className={styles.backText} style={{ lineHeight: '22px', marginLeft: 12 }}>AI学习规划</div>
            </div>
            <div className={styles.contents} style={{ width: '100%', paddingLeft: 8, paddingRight: 8 }}>
                <div className={styles.content} id='content'>
                    <img src={planbac} style={{ position: 'absolute', width: '281px', marginTop: 19 }}></img>
                    <div className={styles.tables}>
                        {
                            state.planList && state.planList.map((item: any) => {
                                return <div className={styles.box} key={item.id}>
                                    <div className={styles.ths} style={{ height: 42, background: 'linear-gradient( 270deg, rgba(88,108,255,0.88) 0%, rgba(85,157,255,0.9) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>{item.day}</div>
                                    {
                                        item.plan && item.plan.map((items: any) => {
                                            return <div className={styles.ths} key={items.id}>{items}</div>
                                        })
                                    }
                                </div>
                            })
                        }
                        {/* {
                            state.planList && state.planList.map((item: any) => {
                                return <div className={styles.boxs} key={item.id}>
                                    <div className={styles.ths} style={{ width: '65px', marginLeft: 0 }}>{item.day}</div>
                                    {
                                        item.plan && item.plan.map((items: any) => {
                                            return <>
                                                <div className={styles.ths}>{items}</div>
                                            </>
                                        })
                                    }
                                </div>
                            })
                        } */}
                    </div>
                </div>
            </div>
            <div className={styles.footer}>
                <Button onClick={() => { getPlan(); }} size='small' type='default' style={{ width: 88, height: 28, border: '1px solid #5672ff', color: '#5672ff' }}>重新生成</Button>
                <Button onClick={() => {
                    captureElement();
                }} size={'small'} style={{ marginLeft: 70, width: 88, height: 28 }} type='primary'>下载</Button>
            </div>
        </div>
        </Spin>
    );
};

export default App;
