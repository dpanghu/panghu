import React from 'react';
import styles from './scenePreview.less';
import { useReactive, useMount } from 'ahooks';
import { Input, Select, ComboBox } from 'SeenPc';
import { getPluginDetail } from '@/services/aiModule';
import { Modal } from 'antd';

interface TState {
  curTheme: any;
  dialogList: any;
  editId: string;
  editName: string;
  data: any;
  allow: any;
  aiData: any;
}

const renderPreview = (item: any) => {
  switch (item.elementType) {
    case 'input':
      return <div className={styles.previewBox}>
        <div className={styles.previewTitle}>{item.displayName}</div>
        <Input maxLength={item.maxLength} showCount={true} type={Number(item.maxLength) < 30 ? 'default' : 'textarea'} style={{ width: '100%' }} placeholder={item.desc}></Input>
      </div>
    case 'select':
      return <div className={styles.previewBox}>
        <div className={styles.previewTitle}>{item.displayName}</div>
        <Select style={{ width: '100%' }} value={item.value} placeholder={item.desc} option={item.options}></Select>
      </div>
    case 'treeSelect':
      return <div className={styles.previewBox}>
        <div className={styles.previewTitle}>{item.displayName}</div>
        <ComboBox style={{ width: '100%' }} onChange={(e: any) => {
          item.value = e.target.value;
        }} value={item.value} options={item.options}></ComboBox>
      </div>
    case 'radio':
      return <div className={styles.previewBox}>
        <div className={styles.previewTitle}>{item.displayName}</div>
        <ComboBox style={{ width: '100%' }} onChange={(e: any) => {
          item.value = e.target.value;
        }} value={item.value} options={item.options}></ComboBox>
      </div>
    case 'selectCheck':
      return <div className={styles.previewBox}>
        <div className={styles.previewTitle}>{item.displayName}</div>
        <div className={styles.previewCheckBox}>
          {
            item.options && item.options.map((items: any) => {
              return <div onClick={() => {
                if (item.value === void 0) {
                  item.value = [];
                  item.value.push(items.value)
                } else {
                  if (item.value?.includes(items.value)) {
                    console.log(JSON.stringify(item.value));
                    let delIndex: any = item.value.findIndex((el: any) => el === items.value);
                    console.log(delIndex);
                    item.value.splice(delIndex, 1);
                  } else {
                    item.value.push(items.value)
                  }
                }
              }} key={items.id} style={{ border: item.value?.includes(items.value) ? '1px solid rgb(86, 114, 255)' : '1px solid rgba(0, 0, 0, 0.25)' }} className={styles.previewCheck}>{items.label}</div>
            })
          }
        </div>
      </div>
    case 'checkbox':
      return <div className={styles.previewBox}>
        <div className={styles.previewTitle}>{item.displayName}</div>
        <div className={styles.previewCheckBox}>
          {
            item.options && item.options.map((items: any) => {
              return <div onClick={() => {
                if (item.value === void 0) {
                  item.value = [];
                  item.value.push(items.value)
                } else {
                  if (item.value?.includes(items.value)) {
                    console.log(JSON.stringify(item.value));
                    let delIndex: any = item.value.findIndex((el: any) => el === items.value);
                    console.log(delIndex);
                    item.value.splice(delIndex, 1);
                  } else {
                    item.value.push(items.value)
                  }
                }
              }} key={items.id} style={{ border: item.value?.includes(items.value) ? '1px solid rgb(86, 114, 255)' : '1px solid rgba(0, 0, 0, 0.25)' }} className={styles.previewCheck}>{items.label}</div>
            })
          }
        </div>
      </div>
  }
}

const JobHunt: React.FC = (props: any) => {
  const state = useReactive<TState>({
    curTheme: undefined,
    dialogList: [],
    editId: '',
    allow: '',
    aiData: {},
    editName: '',
    data: [],
  });

  useMount(() => {
    console.log('id', props.id);
    if (props.id !== null) {
      getPluginDetail({ id: props.id }).then((res: any) => {
        state.data = JSON.parse(res.param?.params);
      });
    }
  });

  return (
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    <Modal footer={false} width={435} open={true} onCancel={() => { props.onCancel && props.onCancel() }} onOk={() => { props.onOk && props.onOk() }}>
      <div className={styles.aicontainer}>
        <div className={styles.left_content}>
          <div className={styles.left_top}>
            {
              state.data && state.data.map((item: any) => {
                return renderPreview(item);
              })
            }
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default JobHunt;
