import confings from '@/assets/images/configs.png';
import aiimg from '@/assets/images/rebotIcon.png';
import { getPluginDetail } from '@/services/aiModule';
import { getQueryParam } from '@/utils/utils';
import { Button, ComboBox, Input, Select } from 'SeenPc';
import { useMount, useReactive } from 'ahooks';
import { message } from 'antd';
import React from 'react';
import { history } from 'umi';
import styles from './AiScene.less';

interface TState {
  curTheme: any;
  dialogList: any;
  editId: string;
  editName: string;
  data: any;
  allow: any;
  aiData: any;
}
9;

const renderPreview = (item: any) => {
  switch (item.elementType) {
    case 'input':
      return (
        <div className={styles.previewBox}>
          <div className={styles.previewTitle}>{item.displayName}</div>
          <Input
            maxLength={item.maxLength}
            showCount={true}
            type={Number(item.maxLength) < 30 ? 'default' : 'textarea'}
            style={{ width: '100%' }}
            placeholder={item.desc}
          ></Input>
        </div>
      );
    case 'select':
      return (
        <div className={styles.previewBox}>
          <div className={styles.previewTitle}>{item.displayName}</div>
          <Select
            style={{ width: '100%' }}
            value={item.value}
            placeholder={item.desc}
            option={item.options}
          ></Select>
        </div>
      );
    case 'treeSelect':
      return (
        <div className={styles.previewBox}>
          <div className={styles.previewTitle}>{item.displayName}</div>
          <ComboBox
            style={{ width: '100%' }}
            onChange={(e: any) => {
              item.value = e.target.value;
            }}
            value={item.value}
            options={item.options}
          ></ComboBox>
        </div>
      );
    case 'selectCheck':
      return (
        <div className={styles.previewBox}>
          <div className={styles.previewTitle}>{item.displayName}</div>
          <div className={styles.previewCheckBox}>
            {item.options &&
              item.options.map((items: any) => {
                return (
                  <div
                    onClick={() => {
                      if (item.value === void 0) {
                        item.value = [];
                        item.value.push(items.value);
                      } else {
                        if (item.value?.includes(items.value)) {
                          console.log(JSON.stringify(item.value));
                          let delIndex: any = item.value.findIndex(
                            (el: any) => el === items.value,
                          );
                          console.log(delIndex);
                          item.value.splice(delIndex, 1);
                        } else {
                          item.value.push(items.value);
                        }
                      }
                    }}
                    key={items.id}
                    style={{
                      border: item.value?.includes(items.value)
                        ? '1px solid rgb(86, 114, 255)'
                        : '1px solid rgba(0, 0, 0, 0.25)',
                    }}
                    className={styles.previewCheck}
                  >
                    {items.label}
                  </div>
                );
              })}
          </div>
        </div>
      );
  }
};

const JobHunt: React.FC = () => {
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
    let qsData: any = getQueryParam();
    getPluginDetail({
      id: qsData.imageId,
      userId: '1',
      memberId: '1',
      schoolId: '1',
    }).then((res: any) => {
      if (
        res.plugin?.code === 'resume' ||
        res.plugin?.code === 'aiInterviewer'
      ) {
        history.push('/aiJobHunt');
      } else {
        state.data = JSON.parse(res.param?.params);
        state.aiData = res;
      }
    });
  });

  return (
    <div className={styles.aicontainer}>
      <div className={styles.head}>{state.aiData.plugin?.name}</div>
      <div className={styles.content}>
        <div className={styles.left_content}>
          <div className={styles.config_head}>
            <img
              src={confings}
              style={{ width: 16, height: 16, marginRight: 4 }}
            ></img>
            <div>生成配置</div>
            <div
              className={styles.confing_text}
              onClick={() => {
                message.warning('该功能暂未开放');
              }}
            >
              填入示例
            </div>
          </div>
          <div className={styles.left_top}>
            {state.data &&
              state.data.map((item: any) => {
                return renderPreview(item);
              })}
          </div>
          <div className={styles.left_bottom}>
            <Button type="primary">AI生成</Button>
            <div
              style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}
            >
              <ComboBox
                type="checkbox"
                options={[
                  {
                    label: '',
                    value: '1',
                  },
                ]}
                value={state.allow}
                onChange={(e: any) => {
                  state.allow = e;
                }}
              ></ComboBox>
              <div
                style={{ fontSize: 12, color: '#666666', lineHeight: '12px' }}
              >
                我已阅读并同意《AI内容生成功能使用说明》
              </div>
            </div>
          </div>
        </div>
        <div className={styles.mid_content}>
          <div className={styles.warningBox}>
            <img
              src={aiimg}
              style={{ width: 24, height: 24, marginRight: 16 }}
            ></img>
            <div className={styles.warning}>
              <div>{state.aiData.plugin?.tips}</div>
              <div className={styles.subwarning}>
                {state.aiData.plugin?.note}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobHunt;
