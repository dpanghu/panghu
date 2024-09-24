/* eslint-disable array-callback-return */
import { useMount, useReactive } from 'ahooks';
import React from 'react';
import styles from './createAiModule.less';
import aiHead from '@/assets/images/rebotIcon.png';
import { Input, Select, Button, ComboBox } from 'SeenPc';
import { Divider, Tabs, Modal, message, Tag } from 'antd';
import { Select as Selects } from 'antd';
import textImg from '@/assets/images/textImg.png';
import selectImg from '@/assets/images/selectImgs.png';
import radioImgs from '@/assets/images/radioImgs.png';
import checkboxImgs from '@/assets/images/checkboxImgs.png';
import { history } from 'umi';
import tushengwen from '@/assets/images/tushengwen.png';
import uploadspng from '@/assets/images/uploads.png';
import { saveAiModule, iconList, getPluginDetail } from '@/services/aiModule';
import { getAIProductList, getAllAIModel } from '@/services/aiJobHunt';
import { CloseOutlined, LeftOutlined } from '@ant-design/icons';

type IState = {
  status: any
  data: any;
  draggleData: any;
  tabId: any;
  domainData: any;
  baseData: any;
  open1: any;
  open: any;
  modalData: any;
  chooseData: any;
  moveStartIndex: any;
  option: any;
  portfolioOption: any;
  open2: any;
  saveData: any;
  iconImg: any;
  modelTypeIdData: any;
  iconData: any;
};
const Resume: React.FC = ({ }) => {
  const state = useReactive<IState>({
    status: 'empty',
    domainData: [],
    draggleData: {},
    portfolioOption: '',
    modelTypeIdData: [],
    open2: false,
    option: [],
    open1: false,
    iconImg: '',
    saveData: {
      portfolio: ''
    },
    moveStartIndex: '',
    open: false,
    iconData: [],
    modalData: {
      name: '',
      keys: '',
    },
    tabId: '1',
    baseData: {},
    chooseData: {},
    data: [
    ],
  });
  useMount(() => {
    iconList({
      userId: '1',
      memberId: '1',
      schoolId: '1',
    }).then((res: any) => {
      console.log(res);
      // state.iconImg = res[0]?.icon;
      // res[0].choose = true;
      state.iconData = res;
    })
    getAIProductList({
      userId: '1',
      memberId: '1',
      schoolId: '1',
    }).then((el: any) => {
      state.modelTypeIdData = el;
    });
    getAllAIModel({
      userId: '1',
      memberId: '1',
      schoolId: '1',
    }).then((el: any) => {
      state.domainData = el;
    });
    if (window.sessionStorage.getItem('pluginId') !== 'null') {
      getPluginDetail({
        id: window.sessionStorage.getItem('pluginId'),
      }).then((res: any) => {
        let arr: any = [];
        let portfoliosClone: any = [];
        let jsonData: any = JSON.parse(res.param?.params);
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        jsonData && jsonData.map((el: any) => {
          portfoliosClone.push({
            id: el.name,
            name: el.displayName,
          });
          if (el.elementType == 'input') {
            arr.push({
              title: el.displayName,
              length: el.maxLength,
              type: 'text',
              limit: 0,
              placeholder: el.placeholder,
            })
          } else if (el.elementType == 'file') {
            arr.push({
              title: el.displayName,
              length: el.maxLength,
              type: 'file',
            })
          } else if (el.elementType == 'select') {
            arr.push({
              title: el.displayName,
              length: el.maxLength,
              type: 'select',
              option: el.options,
            })
          } else if (el.elementType == 'treeSelect' || el.elementType == 'radio') {
            arr.push({
              title: el.displayName,
              length: el.maxLength,
              type: 'radio',
              option: el.options,
            })
          } else if (el.elementType == 'selectCheck' || el.elementType == 'checkbox') {
            arr.push({
              title: el.displayName,
              length: el.maxLength,
              type: 'checkbox',
              option: el.options,
            })
          }
        })
        state.data = arr;

        state.baseData = {
          note: res.plugin.note,
          name: res.plugin.name,
          tips: res.plugin.tips,
          id: res.plugin.id,
        }
        let newportfolio: any = res.plugin.portfolio;
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        let portfoliosArr: any = extractContentBetweenDoubleBraces(res.plugin.portfolio);
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        portfoliosArr && portfoliosArr.map((el: any) => {
          // eslint-disable-next-line
          let finddata: any = portfoliosClone.find((els: any) => els.id == el.trim());
          console.log('find', JSON.stringify(finddata));
          if (finddata !== void 0) {
            newportfolio = newportfolio.replace(el, finddata.name);
          }
        })
        state.saveData = {
          modelTypeId: res.plugin.modelTypeId,
          domainId: res.plugin.domainId,
          portfolio: newportfolio
        }
        state.iconImg = res.plugin.icon;
      })
    }
  });

  const save = () => {
    let paramsArr: any = [];
    let newArr: any = [];
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions, array-callback-return
    state.data && state.data.map((element: any, index: any) => {
      newArr.push({
        id: `ai${index}`,
        name: element.title
      })
    });
    console.log(JSON.stringify(newArr));
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions, array-callback-return
    state.data && state.data.map((item: any, index: any) => {
      if (item.type === 'text') {
        paramsArr.push({
          name: `ai${index}`,
          required: 'true',
          placeholder: item.placeholder,
          displayName: item.title,
          decimalLength: 0,
          elementType: 'input',
          dataType: 'string',
          maxLength: item.length,
        });
      } else if (item.type === 'select') {
        paramsArr.push({
          name: `ai${index}`,
          required: 'true',
          placeholder: item.placeholder,
          displayName: item.title,
          decimalLength: 0,
          elementType: 'select',
          dataType: 'string',
          options: item.option,
        });
      } else if (item.type === 'radio') {
        paramsArr.push({
          name: `ai${index}`,
          required: 'true',
          displayName: item.title,
          decimalLength: 0,
          elementType: 'radio',
          dataType: 'string',
          options: item.option,
        });
      } else if (item.type === 'checkbox') {
        paramsArr.push({
          name: `ai${index}`,
          required: 'true',
          displayName: item.title,
          decimalLength: 0,
          elementType: 'checkbox',
          dataType: 'string',
          options: item.option,
        });
      }else if (item.type === 'file') {
        paramsArr.push({
          name: `ai${index}`,
          required: 'true',
          displayName: item.title,
          decimalLength: 0,
          elementType: 'file',
          dataType: 'string',
        });
      }
    })
    let hasFile: any = state.data.find((element: any)=> element.type == 'file');
    if(hasFile !== void 0 && state.saveData.modelTypeId !== '12') {
      message.error('该模型分类下不支持文件工具类型，请修改工具配置');
      return;
    }
    let newportfolio: any = state.saveData.portfolio;
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    let portfolios: any = extractContentBetweenDoubleBraces(state.saveData.portfolio);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions, array-callback-return
    portfolios && portfolios.map((el: any) => {
      // eslint-disable-next-line eqeqeq
      let finddata: any = newArr.find((els: any) => els.name == el.trim());
      console.log('find', JSON.stringify(finddata));
      if (finddata !== void 0) {
        newportfolio = newportfolio.replace(el, finddata.id);
      }
    })
    console.log('mew', newportfolio);
    let send = {
      ...state.baseData,
      userId: '1',
      memberId: '1',
      schoolId: '1',
      ...state.saveData,
      portfolio: newportfolio,
      icon: state.iconImg,
      params: JSON.stringify(paramsArr),
    }
    saveAiModule({
      ...send,
    }).then((res: any) => {
      console.log(res);
      message.success('保存成功');
      history.push('/aiJobHunt/aiList');
    })
  }

  const extractContentBetweenDoubleBraces = (str: any) => {
    const regex = /{{([^}]*?)}}/g;
    let matches = str.match(regex);

    // 如果存在匹配项，则映射每个匹配项以仅提取括号内的内容  
    if (matches) {
      // 映射matches数组，对于每个匹配项，使用replace方法移除'{{'和'}}'  
      return matches.map((match: any) => match.replace(/{{|}}/g, ''));
    }

    // 如果没有匹配项，返回一个空数组  
    return [];
  }

  const renderData = (item: any, index: any) => {
    switch (item.type) {
      case 'text':
        return <div className={styles.inputBox} onDragOver={(e: any) => {
          e.preventDefault();
        }} onDrop={() => {
          if (state.draggleData.type === 5) {
            if (index !== state.moveStartIndex) {
              console.log('22222222',state.moveStartIndex);
              let cloneData: any = state.data;
              let mid: any = {};
              mid = cloneData[index - 1]
              cloneData[index - 1] = cloneData[state.moveStartIndex - 1];
              cloneData[state.moveStartIndex - 1] = mid;
              state.data = cloneData;
              console.log('start', JSON.stringify(state.data));
            }
          }
        }} onDragStart={() => {
          state.draggleData.type = 5;
          state.moveStartIndex = index;
        }} draggable onClick={() => {
          state.tabId = '1';
          state.chooseData = item;
        }}>
          <div style={{ position: "absolute", bottom: 10, right: 14, color: 'white' }} onClick={() => {
            message.success('操作成功');
            let clone: any = state.data;
            clone.splice(index, 0, item); // 在索引为2的位置插入元素5
            state.data = clone;
          }}>复制</div>
          <div className={styles.close} onClick={() => {
            const datas: any = state.data;
            let delIndex = datas.findIndex((el: any) => el.id === item.id);
            datas.splice(delIndex, 1);
            // eslint-disable-next-line array-callback-return
            datas.map((items: any, index: any) => {
              items.id = index;
            });
            state.data = datas;
          }}>
            <CloseOutlined style={{ color: '#5A73FF', fontWeight: 600 }} />
          </div>
          <Input onChange={(e: any) => {
            item.title = e;
          }} style={{ width: '100%' }} size='large' value={item.title} placeholder={'请输入标题'}></Input>
          <Input type='textarea' value={item.value} placeholder={item.placeholder} style={{ marginTop: 15, width: '100%', background: 'white' }}></Input>
        </div>
      case 'file':
        return <div className={styles.inputBox} onDragOver={(e: any) => {
          e.preventDefault();
        }} onDrop={() => {
          // if (state.draggleData.type === 5) {
          //   if (index !== state.moveStartIndex) {
          //     let cloneData: any = state.data;
          //     let mid: any = {};
          //     mid = cloneData[index - 1]
          //     cloneData[index - 1] = cloneData[state.moveStartIndex - 1];
          //     cloneData[state.moveStartIndex - 1] = mid;
          //     state.data = cloneData;
          //     console.log('start', state.data);
          //   }
          // }
        }} onDragStart={() => {
          state.draggleData.type = 5;
          state.moveStartIndex = index;
        }} draggable onClick={() => {
          state.tabId = '1';
          state.chooseData = item;
        }}>
          <div style={{ position: "absolute", bottom: 10, right: 14, color: 'white' }} onClick={() => {
            message.success('操作成功');
            let clone: any = state.data;
            clone.splice(index, 0, item); // 在索引为2的位置插入元素5
            state.data = clone;
          }}>复制</div>
          <div className={styles.close} onClick={() => {
            const datas: any = state.data;
            let delIndex = datas.findIndex((el: any) => el.id === item.id);
            datas.splice(delIndex, 1);
            // eslint-disable-next-line array-callback-return
            datas.map((items: any, index: any) => {
              items.id = index;
            });
            state.data = datas;
          }}>
            <CloseOutlined style={{ color: '#5A73FF', fontWeight: 600 }} />
          </div>
          <div style={{ color:'white',fontSize: 18,display:'flex',justifyContent:'center' }}>图片组件</div>
        </div>
      case 'select':
        return <div draggable onDragStart={() => {
          state.draggleData.type = 5;
          state.moveStartIndex = index;
        }} className={styles.selectBox} onDragOver={(e: any) => {
          e.preventDefault();
        }} onDrop={() => {
          if (state.draggleData.type === 5) {
            if (index !== state.moveStartIndex) {
              let cloneData: any = state.data;
              let mid: any = {};
              mid = cloneData[index - 1]
              cloneData[index - 1] = cloneData[state.moveStartIndex - 1];
              cloneData[state.moveStartIndex - 1] = mid;
              state.data = cloneData;
              console.log('start', state.data);
            }
          }
        }} onClick={() => {
          state.tabId = '1';
          state.chooseData = item;
        }}>
          <div style={{ position: "absolute", bottom: 10, right: 14, color: 'white' }} onClick={() => {
            message.success('操作成功');
            let clone: any = state.data;
            clone.splice(index, 0, item); // 在索引为2的位置插入元素5
            state.data = clone;
          }}>复制</div>
          <div className={styles.close} onClick={() => {
            const datas: any = state.data;
            let delIndex = datas.findIndex((el: any) => el.id === item.id);
            datas.splice(delIndex, 1);
            // eslint-disable-next-line array-callback-return
            datas.map((items: any, index: any) => {
              items.id = index;
            });
            state.data = datas;
          }}>
            <CloseOutlined style={{ color: '#5A73FF', fontWeight: 600 }} />
          </div>
          <Input onChange={(e: any) => {
            item.title = e;
          }} style={{ width: '100%' }} size='large' value={item.title} placeholder={'请输入标题'}></Input>
          <Selects style={{ width: '100%', marginTop: 15 }}>
            {
              state.chooseData.option && state.chooseData.option.map((el: any) => {
                return <Selects.Option key={el.id} value={el.value}>{el.label}</Selects.Option>
              })
            }
          </Selects>
          {/* <Select placeholder={'下拉框数据预置'} style={{ width: '100%', marginTop: 15 }} option={item.option}></Select> */}
        </div>
      case 'radio':
        return <div draggable onDragStart={() => {
          state.draggleData.type = 5;
          state.moveStartIndex = index;
        }} className={styles.radioBox} onDragOver={(e: any) => {
          e.preventDefault();
        }} onDrop={() => {
          if (state.draggleData.type === 5) {
            if (index !== state.moveStartIndex) {
              let cloneData: any = state.data;
              let mid: any = {};
              mid = cloneData[index - 1]
              cloneData[index - 1] = cloneData[state.moveStartIndex - 1];
              cloneData[state.moveStartIndex - 1] = mid;
              state.data = cloneData;
              console.log('start', state.data);
            }
          }
        }} onClick={() => {
          state.tabId = '1';
          state.chooseData = item;
        }}>
          <div style={{ position: "absolute", bottom: 10, right: 14, color: 'white' }} onClick={() => {
            message.success('操作成功');
            let clone: any = state.data;
            clone.splice(index, 0, item); // 在索引为2的位置插入元素5
            state.data = clone;
          }}>复制</div>
          <div className={styles.close} onClick={() => {
            const datas: any = state.data;
            let delIndex = datas.findIndex((el: any) => el.id === item.id);
            datas.splice(delIndex, 1);
            // eslint-disable-next-line array-callback-return
            datas.map((items: any, index: any) => {
              items.id = index;
            });
            state.data = datas;
          }}>
            <CloseOutlined style={{ color: '#5A73FF', fontWeight: 600 }} />
          </div>
          <Input onChange={(e: any) => {
            item.title = e;
          }} style={{ width: '100%' }} size='large' value={item.title} placeholder={'请输入标题'}></Input>
          <div style={{ display: 'flex', marginTop: 15 }}>
            <ComboBox value={state.chooseData.limit} options={item.option} onChange={(e: any) => {
              state.chooseData.limit = e.target.value;
            }}></ComboBox>
          </div>
        </div>
      case 'checkbox':
        return <div draggable onDragStart={() => {
          state.draggleData.type = 5;
          state.moveStartIndex = index;
        }} className={styles.checkboxBox} onDragOver={(e: any) => {
          e.preventDefault();
        }} onDrop={() => {
          if (state.draggleData.type === 5) {
            if (index !== state.moveStartIndex) {
              let cloneData: any = state.data;
              let mid: any = {};
              mid = cloneData[index - 1]
              cloneData[index - 1] = cloneData[state.moveStartIndex - 1];
              cloneData[state.moveStartIndex - 1] = mid;
              state.data = cloneData;
              console.log('start', state.data);
            }
          }
        }} onClick={() => {
          state.tabId = '1';
          state.chooseData = item;
        }}>
          <div style={{ position: "absolute", bottom: 10, right: 14, color: 'white' }} onClick={() => {
            message.success('操作成功');
            let clone: any = state.data;
            clone.splice(index, 0, item); // 在索引为2的位置插入元素5
            state.data = clone;
          }}>复制</div>
          <div className={styles.close} onClick={() => {
            const datas: any = state.data;
            let delIndex = datas.findIndex((el: any) => el.id === item.id);
            datas.splice(delIndex, 1);
            // eslint-disable-next-line array-callback-return
            datas.map((items: any, index: any) => {
              items.id = index;
            });
            state.data = datas;
          }}>
            <CloseOutlined style={{ color: '#5A73FF', fontWeight: 600 }} />
          </div>
          <Input onChange={(e: any) => {
            item.title = e;
          }} style={{ width: '100%' }} size='large' value={item.title} placeholder={'请输入标题'}></Input>
          <div style={{ display: 'flex', marginTop: 5, alignItems: 'center' }}>
            {
              item.option && item.option.map((el: any, index: any) => {
                return <div style={{ display: 'flex', alignItems: 'center', marginTop: 10 }} key={el.value}>
                  <Input size='large' onChange={(e: any) => {
                    const cloneData = state.data;
                    el.label = e;
                    state.data = cloneData;
                  }} value={el.label} placeholder={'请输入'} style={{ marginLeft: index === 0 ? 0 : 10 }}></Input>
                </div>
              })
            }
          </div>

        </div>
    }
  }

  const createComponents = () => {
    const datas = state.data;
    switch (state.draggleData.type) {
      case 1:
        datas.push({
          type: 'text',
          value: '',
          title: '默认标题',
          id: datas.length + 1,
          limit: 0,
          desc: '请输入',
          length: 20,
        });
        state.data = datas;
        break;
      case 2:
        datas.push({
          type: 'select',
          value: '',
          title: '默认标题',
          option: [],
          desc: '请输入',
          id: datas.length + 1,
        });
        state.data = datas;
        break;
      case 3:
        datas.push({
          type: 'radio',
          value: '1',
          title: '默认标题',
          option: [
          ],
          id: datas.length + 1,
        });
        state.data = datas;
        break;
      case 4:
        datas.push({
          type: 'checkbox',
          value: '',
          title: '默认标题',
          option: [
          ],
          id: datas.length + 1,
        });
        state.data = datas;
        break;
      case 6:
        datas.push({
          type: 'file',
          value: '',
          title: '',
          id: datas.length + 1,
        });
        state.data = datas;
        break;
    }
  }

  const getPopupContainer = (triggerNode: any) => {
    return triggerNode.parentElement; // 返回你想要挂载下拉菜单的DOM元素
  };

  const renderPreview = (item: any) => {
    switch (item.type) {
      case 'text':
        return <div className={styles.previewBox}>
          <div className={styles.previewTitle}>{item.title}</div>
          <Input maxLength={item.length} showCount={true} type='textarea' style={{ width: '100%' }} placeholder={item.tips}></Input>
        </div>
      case 'select':
        return <div className={styles.previewBox}>
          <div className={styles.previewTitle}>{item.title}</div>
          <Selects getPopupContainer={getPopupContainer} style={{ width: '100%' }} placeholder={item.tips} option={item.option}></Selects>
        </div>
      case 'radio':
        return <div className={styles.previewBox}>
          <div className={styles.previewTitle}>{item.title}</div>
          <ComboBox style={{ width: '100%' }} value={item.value} options={item.option}></ComboBox>
        </div>
      case 'file':
        return <div style={{ width:'100%',display:'flex',flexDirection:'column' }}>
          <Button icon={<img src={uploadspng} style={{ width: 16,height: 16,marginRight: 4 }}></img>} style={{ width: 92,marginTop: 12 }} size={'small'} type='primary'>上传图片</Button>
          <div className={styles.previewBox} style={{ width: 291,height: 163,display:'flex',marginTop: 8,justifyContent:'center',flexDirection:'column',cursor:'pointer',color:'#333333',fontSize: 14,lineHeight:'21px',position:'relative' }}>
          <img src={tushengwen} style={{ position:'absolute',width:'291px',height: 163 }}></img>
          <div className={styles.file_text}>支持jpg、jpeg、png、1MB以内</div>
          <div className={styles.file_text}>或按【ctrl+v】粘贴到这里</div>
          <div className={styles.file_text}>或点击此处【上传】</div>
        </div>
        </div>
      case 'checkbox':
        return <div className={styles.previewBox}>
          <div className={styles.previewTitle}>{item.title}</div>
          <div className={styles.previewCheckBox}>
            {
              item.option && item.option.map((items: any) => {
                return <div key={items.id} className={styles.previewCheck}>{items.label}</div>
              })
            }
          </div>
        </div>
    }
  }

  return (
    <div className={styles.container}>
      <Modal open={state.open2} title={'图标选择'} width={822} maskClosable={false} cancelText={'取消'}
        okText={'确定'}
        onOk={() => {
          let chooseIcon: any = state.iconData.find((item: any) => item.choose === true);
          if (chooseIcon === void 0) {
            message.warning('请至少选择一个图标');
            return;
          }
          console.log('choose', chooseIcon);
          state.open2 = false;
          state.iconImg = chooseIcon.icon;
        }}
        onCancel={() => {
          state.open2 = false;
        }}>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {
            state.iconData && state.iconData.map((el: any) => {
              return <div onClick={() => {
                let cloneIcon: any = state.iconData;
                cloneIcon.forEach((element: any) => {
                  element.choose = false;
                });
                el.choose = true;
                console.log('staef', JSON.stringify(cloneIcon));
                state.iconData = cloneIcon;
              }} key={el.id} style={{ width: 70, height: 70, marginTop: 24, marginLeft: 24, cursor: 'pointer', boxShadow: '0 2px 6px 0 rgba(0,0,0,.15)', padding: 5, borderRadius: 3, border: el.choose ? '1px solid rgb(86, 114, 255)' : 'none' }}>
                <img src={el.icon} style={{ width: "100%", height: '100%' }}></img>
              </div>
            })
          }
        </div>
      </Modal>
      <Modal open={state.open1} title={'保存'} width={600} maskClosable={false} cancelText={'取消'}
        okText={'保存'}
        onOk={() => {
          save();
        }}
        onCancel={() => {
          state.open1 = false;
        }}>
        <div style={{ paddingLeft: 35, marginTop: 30, marginBottom: 30 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 14 }}>
            <div style={{ minWidth: 42, marginRight: 10 }}><span style={{ color: 'red', marginRight: 7 }}>*</span>模型分类</div>
            <Select option={state.modelTypeIdData} label={'name'} text={'id'} value={state.saveData.modelTypeId} onChange={(e: any) => { state.saveData.modelTypeId = e }} placeholder={'选择模型分类'}></Select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 14 }}>
            <div style={{ minWidth: 42, marginRight: 10 }}><span style={{ color: 'red', marginRight: 7 }}>*</span>所属领域</div>
            <Select label={'name'} text={'id'} option={state.domainData} value={state.saveData.domainId} onChange={(e: any) => { state.saveData.domainId = e }} placeholder={'请选择所属领域'}></Select>
          </div>
          <div style={{ display: 'flex', marginTop: 14 }}>
            <div style={{ minWidth: 42, marginRight: 10, paddingTop: 5 }}><span style={{ color: 'red', marginRight: 7 }}>*</span>系统人设</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                <Select option={state.option} value={state.portfolioOption} style={{ width: 179 }} onChange={(e: any) => { state.portfolioOption = e }}></Select>
                <Button type='primary' onClick={() => {
                  let portfolioOptionValue: any = state.option.find((ids: any) => ids.value === state.portfolioOption);
                  state.saveData.portfolio = state.saveData.portfolio + `{{ ${portfolioOptionValue.label} }}`;
                }} style={{ marginLeft: 16 }}>插入</Button>
              </div>
              <Input value={state.saveData.portfolio} type='textarea' onChange={(e: any) => {
                state.saveData.portfolio = e;
              }} placeholder={'请预置系统人设'}></Input>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        open={state.open}
        title={'数据维护'}
        width={350}
        maskClosable={false}
        cancelText={'取消'}
        okText={'保存'}
        onOk={() => {
          const chooseDatas: any = state.chooseData;
          console.log(JSON.stringify(chooseDatas.option));
          let allow: any = chooseDatas.option.find((element: any) => element.label === state.modalData.name);
          if (allow !== void 0) {
            message.warning('该标签已经存在，请修改之后再保存');
            return
          }
          chooseDatas.option.push({
            label: state.modalData.name,
            value: state.modalData.name,
          })
          message.success('保存成功');
          state.open = false;
        }}
        onCancel={() => {
          state.open = false;
        }}
      >
        <div style={{ paddingLeft: 25, marginTop: 30, marginBottom: 30 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
            <div style={{ minWidth: 42, marginRight: 10 }}><span style={{ color: 'red', marginRight: 7 }}>*</span>标签</div>
            <Input value={state.modalData.name} onChange={(e: any) => { state.modalData.name = e }} maxLength={state.chooseData.type === 'checkbox' ? 6 : 999} placeholder={state.chooseData.type === 'checkbox' ? '最多6个字' : '请输入label值'}></Input>
          </div>
          {/* <div style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
            <div style={{ minWidth: 42, marginRight: 10 }}><span style={{ color: 'red', marginRight: 7 }}>*</span>值</div>
            <Input value={state.modalData.keys} onChange={(e: any) => { state.modalData.keys = e }} placeholder={'请输入key值'}></Input>
          </div> */}

        </div>
      </Modal>
      <div className={styles.content}>
        <div className={styles.left}>
          <div className={styles.left_head}>
            <img src={aiHead}></img>
            <div>AI配置中心</div>
          </div>
          <div className={styles.left_content}>
            <div className={styles.left_box} draggable onDragStart={() => {
              console.log('触发了');
              state.draggleData.type = 1;
            }}>
              {/* <DesktopOutlined style={{ fontSize: 30, color: '#707070' }} /> */}
              <img src={textImg}></img>
              <div style={{ marginTop: 12, fontSize: 14 }}>文本框</div>
            </div>
            <div className={styles.left_box} draggable onDragStart={() => {
              console.log('触发了');
              state.draggleData.type = 2;
            }}>
              <img src={selectImg} style={{ width: 30, height: 30, marginTop: -2 }}></img>
              <div style={{ marginTop: 9.5, fontSize: 14 }}>下拉框</div>
            </div>
            <div className={styles.left_box} draggable onDragStart={() => {
              console.log('触发了');
              state.draggleData.type = 3;
            }}>
              <img src={radioImgs}></img>
              <div style={{ marginTop: 12, fontSize: 14 }}>单选框</div>
            </div>
            <div className={styles.left_box} draggable onDragStart={() => {
              console.log('触发了');
              state.draggleData.type = 4;
            }}>
              <img src={checkboxImgs}></img>
              <div style={{ marginTop: 12, fontSize: 14 }}>点列式</div>
            </div>
            <div className={styles.left_box} draggable onDragStart={() => {
              console.log('触发了');
              state.draggleData.type = 6;
            }}>
              <img src={checkboxImgs}></img>
              <div style={{ marginTop: 12, fontSize: 14 }}>图片</div>
            </div>
          </div>
        </div>
        <div className={styles.middle} onDragOver={(e: any) => {
          e.preventDefault();
        }} onDrop={() => {
          createComponents();
        }}>
          <div className={styles.middleHead}>
            <div style={{ display: 'flex', alignItems: 'center', color: '#333333', cursor: 'pointer' }} onClick={() => {
              history.push('/aiJobHunt/aiList');
            }}>
              <LeftOutlined style={{ marginRight: 10 }} />
              <div>返回</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {/* <Button type='primary' style={{ width: 70 }} onClick={() => {
                save();
              }}>预览</Button> */}
              <Button type='primary' style={{ width: 70, marginLeft: 20 }} onClick={() => {
                state.open1 = true;
                let arr: any = [];
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions, array-callback-return
                state.data && state.data.map((el: any, index: any) => {
                  arr.push({
                    label: el.title,
                    value: `ai${index + 1}`,
                  })
                })
                state.option = arr;
              }}>保存</Button>
            </div>
          </div>
          {
            state.data.length === 0 ? <div style={{ margin: 'auto auto', fontSize: 30, color: '#868EB3', }}>请将左边配置项拖拽到此区域进行配置</div> : <>
              {
                state.data && state.data.map((el: any, index: any) => {
                  return renderData(el, index + 1);
                })
              }
            </>
          }
        </div>
        <div className={styles.right}>
          <div style={{ width: '100%', height: 70 }}>
            <Tabs activeKey={state.tabId} items={[
              {
                key: '1',
                label: '配置设置'
              },
              {
                key: '2',
                label: '预览'
              },
            ]} onChange={(e: any) => {
              state.tabId = e;
            }} />
          </div>
          {
            state.tabId === '1' ? <>
              <div className={styles.setTitle}>场景设置<span style={{ marginLeft: 8, fontSize: 13, color: 'rgba(0,0,0,0.6)' }}>（填写场景基础信息）</span></div>
              <div className={styles.textBox}>
                <h3><span style={{ color: 'red', marginRight: 5 }}>*</span>场景标题</h3>
                <Input value={state.baseData.name} maxLength={20} style={{ width: 175 }} onChange={(e: any) => {
                  state.baseData.name = e;
                }}></Input>
              </div>
              <div className={styles.textBox}>
                <h3><span style={{ color: 'red', marginRight: 5 }}>*</span>场景描述</h3>
                <Input type='textarea' value={state.baseData.note} style={{ width: 175, height: 60, resize: 'none' }} onChange={(e: any) => {
                  state.baseData.note = e;
                }}></Input>
              </div>
              <div className={styles.textBox}>
                <h3><span style={{ color: 'red', marginRight: 5 }}>*</span>场景提示语</h3>
                <Input type='textarea' value={state.baseData.tips} style={{ width: 175, height: 60, resize: 'none' }} onChange={(e: any) => {
                  state.baseData.tips = e;
                }}></Input>
              </div>
              <div className={styles.textBox}>
                <h3 style={{ width: 90 }}><span style={{ color: 'red', marginRight: 5 }}>*</span>场景图标</h3>
                {
                  state.iconImg === '' ? <span style={{ fontSize: 14, color: '#5A73FF', marginLeft: 0, cursor: 'pointer' }} onClick={() => {
                    state.open2 = true;
                  }}>点击选择</span> : <>
                    <img src={state.iconImg} style={{ width: 40, height: 40, borderRadius: 2 }}></img>
                    <span onClick={() => {
                      state.open2 = true;
                    }} style={{ fontSize: 14, cursor: 'pointer', color: '#5A73FF', marginLeft: 15 }}>替换</span>
                  </>
                }
              </div>
              <Divider></Divider>
              {
                state.chooseData.type === 'text' ? <>
                  <div className={styles.setTitle} style={{ marginTop: 0 }}>元素设置<span style={{ marginLeft: 8, fontSize: 13, color: 'rgba(0,0,0,0.6)' }}>（已选择文本框）</span></div>
                  <div className={styles.textBox}>
                    <h3 style={{ width: 60, display: 'flex', justifyContent: 'flex-end', marginRight: 20 }}><span style={{ color: 'red', marginRight: 5 }}>*</span>标题</h3>
                    <Input placeholder={'请输入标题'} value={state.chooseData.title} style={{ width: 175 }} onChange={(e: any) => {
                      state.chooseData.title = e;
                    }}></Input>
                  </div>
                  <div className={styles.textBox}>
                    <h3 style={{ width: 60, display: 'flex', justifyContent: 'flex-end', marginRight: 20 }}><span style={{ color: 'red', marginRight: 5 }}>*</span>提示语</h3>
                    <Input placeholder={'请输入预置提示语'} value={state.chooseData.placeholder} style={{ width: 175 }} onChange={(e: any) => {
                      state.chooseData.placeholder = e;
                    }}></Input>
                  </div>
                  <div className={styles.textBox}>
                    <h3 style={{ width: 60, display: 'flex', justifyContent: 'flex-end', marginRight: 20 }}><span style={{ color: 'red', marginRight: 5 }}>*</span>长度</h3>
                    <Input placeholder={'请输入最大长度限制'} value={state.chooseData.length} style={{ width: 175 }} onChange={(e: any) => {
                      state.chooseData.length = e;
                    }}></Input>
                  </div>
                  <div className={styles.textBox}>
                    <h3 style={{ width: 60, display: 'flex', justifyContent: 'flex-end', marginRight: 20 }}>限制</h3>
                    <ComboBox value={state.chooseData.limit} options={[
                      {
                        label: '无限制',
                        value: 0,
                      },
                      {
                        label: '数字',
                        value: 1,
                      }
                    ]} onChange={(e: any) => {
                      state.chooseData.limit = e.target.value;
                    }}></ComboBox>
                  </div>
                </> : state.chooseData.type === 'select' ? <>
                  <div className={styles.setTitle} style={{ marginTop: 0 }}>元素设置<span style={{ marginLeft: 8, fontSize: 13, color: 'rgba(0,0,0,0.6)' }}>（已选择下拉框）</span></div>
                  <div className={styles.textBox}>
                    <h3 style={{ width: 60, display: 'flex', justifyContent: 'flex-end', marginRight: 20 }}><span style={{ color: 'red', marginRight: 5 }}>*</span>标题</h3>
                    <Input placeholder={'请输入标题'} value={state.chooseData.title} style={{ width: 175 }} onChange={(e: any) => {
                      state.chooseData.title = e
                    }}></Input>
                  </div>
                  <div className={styles.textBox}>
                    <h3 style={{ width: 60, display: 'flex', justifyContent: 'flex-end', marginRight: 20 }}><span style={{ color: 'red', marginRight: 5 }}>*</span>提示语</h3>
                    <Input placeholder={'请输入预置提示语'} value={state.chooseData.placeholder} style={{ width: 175 }} onChange={(e: any) => {
                      state.chooseData.placeholder = e
                    }}></Input>
                  </div>
                  <div className={styles.textBox} style={{ alignItems: 'flex-start' }}>
                    <h3 style={{ display: 'flex', justifyContent: 'flex-end', marginRight: 20, minWidth: 56, marginTop: 10, width: 60 }}>数据配置</h3>
                    <div style={{ width: 175, display: 'flex', flexDirection: 'column' }}>
                      <Select option={state.chooseData.option} style={{ width: '100%' }} value={state.baseData.limit}>
                      </Select>
                      <div style={{ fontSize: 14, color: '#5A73FF', marginTop: 10, cursor: 'pointer' }} onClick={() => {
                        state.open = true;
                        state.modalData = {};
                      }}>添加选项</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        {
                          state.chooseData.option && state.chooseData.option.map((item: any, index: any) => {
                            return <Tag color="blue" onClose={(e: any) => {
                              e.stopPropagation();
                              e.preventDefault();
                              const chooseDataClone: any = state.chooseData;
                              chooseDataClone.option.splice(index, 1);
                              state.chooseData = chooseDataClone;
                              message.success('删除成功');
                            }} key={item.id} closable style={{ marginTop: 12 }}>{item.label}</Tag>
                          })
                        }
                      </div>
                    </div>
                  </div>
                </> : state.chooseData.type === 'radio' ? <>
                  <div className={styles.setTitle} style={{ marginTop: 0 }}>元素设置<span style={{ marginLeft: 8, fontSize: 13, color: 'rgba(0,0,0,0.6)' }}>（已选择单选框框）</span></div>
                  <div className={styles.textBox}>
                    <h3 style={{ width: 60, display: 'flex', justifyContent: 'flex-end', marginRight: 20 }}><span style={{ color: 'red', marginRight: 5 }}>*</span>标题</h3>
                    <Input placeholder={'请输入标题'} value={state.chooseData.title} style={{ width: 175 }} onChange={(e: any) => {
                      state.chooseData.title = e
                    }}></Input>
                  </div>
                  <div className={styles.textBox} style={{ alignItems: 'flex-start' }}>
                    <h3 style={{ display: 'flex', justifyContent: 'flex-end', marginRight: 20, minWidth: 56, marginTop: 10, width: 60 }}>数据配置</h3>
                    <div style={{ width: 175, display: 'flex', flexDirection: 'column' }}>
                      <Select option={state.chooseData.option} style={{ width: '100%' }} value={state.baseData.limit}></Select>
                      <div style={{ fontSize: 14, color: '#5A73FF', marginTop: 10, cursor: 'pointer' }} onClick={() => {
                        state.open = true;
                        state.modalData = {};
                      }}>添加选项</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        {
                          state.chooseData.option && state.chooseData.option.map((item: any, index: any) => {
                            return <Tag color="blue" onClose={(e: any) => {
                              e.stopPropagation();
                              e.preventDefault();
                              const chooseDataClone: any = state.chooseData;
                              chooseDataClone.option.splice(index, 1);
                              state.chooseData = chooseDataClone;
                              message.success('删除成功');
                            }} key={item.id} closable style={{ marginTop: 12 }}>{item.label}</Tag>
                          })
                        }
                      </div>
                    </div>
                  </div>
                </> : state.chooseData.type === 'checkbox' ? <>
                  <div className={styles.setTitle} style={{ marginTop: 0 }}>元素设置<span style={{ marginLeft: 8, fontSize: 13, color: 'rgba(0,0,0,0.6)' }}>（已选择点列式）</span></div>
                  <div className={styles.textBox}>
                    <h3 style={{ width: 60, display: 'flex', justifyContent: 'flex-end', marginRight: 20 }}><span style={{ color: 'red', marginRight: 5 }}>*</span>标题</h3>
                    <Input placeholder={'请输入标题'} value={state.chooseData.title} style={{ width: 175 }} onChange={(e: any) => {
                      state.chooseData.title = e
                    }}></Input>
                  </div>
                  <div className={styles.textBox} style={{ alignItems: 'flex-start' }}>
                    <h3 style={{ display: 'flex', justifyContent: 'flex-end', marginRight: 20, minWidth: 56, marginTop: 10, width: 60 }}>数据配置</h3>
                    <div style={{ width: 175, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ fontSize: 14, color: '#5A73FF', marginTop: 10, cursor: 'pointer' }} onClick={() => {
                        state.open = true;
                        state.modalData = {};
                      }}>添加选项</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        {
                          state.chooseData.option && state.chooseData.option.map((item: any, index: any) => {
                            return <Tag color="blue" onClose={(e: any) => {
                              e.stopPropagation();
                              e.preventDefault();
                              const chooseDataClone: any = state.chooseData;
                              chooseDataClone.option.splice(index, 1);
                              state.chooseData = chooseDataClone;
                              message.success('删除成功');
                            }} key={item.id} closable style={{ marginTop: 12 }}>{item.label}</Tag>
                          })
                        }
                      </div>
                    </div>
                  </div>
                </> : <></>
              }
            </> : <div style={{ width: '100%', paddingLeft: 24, paddingRight: 24, height: 'calc(100vh - 105px)', overflowY: 'auto' }}>
              {
                state.data && state.data.map((item: any) => {
                  return renderPreview(item);
                })
              }
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default Resume;
