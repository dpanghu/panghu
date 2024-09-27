import React from 'react';
import Backs from '@/assets/images/backs.png'
import Questionnaire from '../../components/Question';
import { getAiPlanList, saveAnswer } from '@/services/aiJobHunt';
import { useMount, useReactive } from 'ahooks';
import styles from './AiPlanPeople.less';
import { getConvertParamId } from '@/services/aiJobHunt/index';
import { Modal } from 'antd';
import { Button, Input } from 'SeenPc';
import { history } from 'umi';
import banner1 from '@/assets/images/banner1.png';
import banner1Text from '@/assets/images/banner1text.png';
import banner1people from '@/assets/images/banner1people.png';
import banner2Text from '@/assets/images/banner2text.png';
import banner2 from '@/assets/images/banner2.png';
import { message } from 'antd';
interface TState {
    curTheme: any;
    dialogList: any;
    excludeId: any;
    editId: string;
    editName: string;
    portfolio: any;
    textvalue: any;
    portrait: any;
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
    open: any;
    visible: any;
    isTyping: any;
    messageList: any;
    typewriterArrCache: any;
}
const App: React.FC = () => {
    const state = useReactive<TState>({
        curTheme: undefined,
        introduce: false,
        portfolio: '',
        textvalue: '',
        dialogList: [],
        baseData: [],
        typewriterArrCache: [],
        open: false,
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
        portrait: [],
        data: [],
    });

    const save = () => {
        getAiPlanList({
            userMessage: state.portfolio,
            paramId: state.patams,
            pluginCode: 'studyPlan',
        }).then((res: any) => {
            if (res) {
                window.sessionStorage.setItem('planList', res);
                window.sessionStorage.setItem('planportfolio', state.portfolio);
                message.success('生成成功');
                if (JSON.parse(res)?.length > 7) {
                    history.push('/AiPlanList');
                } else {
                    history.push('/AiPlanLists');
                }
            }
        })
    }

    useMount(() => {
        getConvertParamId({}).then((res: any) => {
            state.patams = res;
        });
        state.portfolio = window.sessionStorage.getItem('portfolio');
        state.portrait = JSON.parse(window.sessionStorage.getItem('portrait') as any);
        console.log(JSON.parse(window.sessionStorage.getItem('portrait') as any));
    })

    return (
        <div className={styles.peoplecontainer} >
            <Modal onCancel={() => {
                state.open = false;
            }} width={480} onOk={() => {
                let data: any = state.portfolio;
                data = data + state.textvalue;
                state.portfolio = data;
                state.open = false;
            }} cancelText={'取消'} okText={'确定'} title='补充学习规划内容' open={state.open}>
                <div style={{ width: '100%' }}>
                    <Input maxLength={100} onChange={(e: any) => {
                        state.textvalue = e;
                    }} value={state.textvalue} style={{ width: '100%', background: 'rgba(0,0,0,0.04)' }} type='textarea' placeholder={'请补充你的学习规划，例如：当前学习水平，获得证书、个人优势与特点……'}></Input>
                </div>
            </Modal>
            <div className={styles.head} onClick={() => {
                history.push('/AiPlan')
            }}>
                <img src={Backs} style={{ width: 16, height: 16 }}></img>
                <div className={styles.backText} style={{ color: '#999999' }}>返回</div>
                <div className={styles.backText} style={{ marginLeft: 5, color: '#999999' }}>|</div>
                <div className={styles.backText} style={{ lineHeight: '22px', marginLeft: 12 }}>AI学习规划</div>
            </div>
            <div style={{ width: '100%', paddingLeft: 24, paddingRight: 24 }}>
                <div className={styles.banner1}>
                    <img src={banner1} style={{ position: 'absolute', width: '100%', height: "100%" }}></img>
                    <img src={banner1Text} style={{ position: 'absolute', width: 130, height: 17, top: 13 }}></img>
                    <div style={{ width: "885px", position: 'relative', marginTop: 60, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ display: "flex", width: '100%', flexWrap: 'wrap', marginTop: 60 }}>
                            {
                                state.portrait && state.portrait.map((lists: any, index: any) => {
                                    return <>
                                        {
                                            (index%2) === 0 ? <><div key={lists.id} style={{ width: '40%', display: 'flex', justifyContent: 'flex-end', minHeight: 50, paddingRight: Math.floor(index / 3) * 35, position: 'relative' }}>
                                                <div className={styles.left}>{lists}</div>
                                            </div>
                                                <div className={styles.mid} style={{ width: '18%', minHeight: 50 }}></div></> :
                                                <div style={{ width: '33%', display: 'flex', justifyContent: 'flex-start', minHeight: 50, paddingLeft: Math.floor(index / 3) * 35, position: 'relative' }}>
                                                    <div className={styles.right}>{lists}</div>
                                                </div>
                                        }
                                    </>
                                })
                            }
                        </div>
                        <img src={banner1people} style={{ position: 'absolute', width: '80%', top: 0, }}></img>
                    </div>
                    <img src={banner2} style={{ position: 'absolute', width: '100%', bottom: 205, height: 43 }}></img>
                    <img src={banner2Text} style={{ position: 'absolute', width: 174, bottom: 221 }}></img>
                    <div className={styles.foot}>
                        {state.portfolio}
                    </div>
                    <div className={styles.btnBox}>
                        <Button size='small' type='primary' style={{ height: 28 }} onClick={() => { state.open = true; state.textvalue = '' }}>补充学习规划内容</Button>
                        <Button onClick={() => {
                            Modal.confirm({
                                title: '生成学习规划',
                                content: '是否生成学习规划',
                                onOk: () => {
                                    save();
                                },
                                okText: '确定',
                                cancelText: '取消'
                            })
                        }} className={styles.btn} size='small' style={{ height: 28, marginLeft: 72, background: '#FF2739' }}>生成学习规划</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
