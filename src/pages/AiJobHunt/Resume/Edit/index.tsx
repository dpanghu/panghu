import { saveResume } from '@/services/aiJobHunt';
import { useModel } from '@umijs/max';
import { Cascader, DatePicker, Form, Input, Select, message } from 'SeenPc';
import sf from 'SeenPc/dist/esm/globalStyle/global.less';
import { useCreation, useReactive } from 'ahooks';
import { Row } from 'antd';
import type { Store } from 'antd/lib/form/interface';
import { default as classNames, default as classnames } from 'classnames';
import { isArray, pick } from 'lodash';
import React, { useImperativeHandle } from 'react';
import type { FormItemType, IResumeContent, ResumeResponse } from '../../type';
import DraggableItem from './components/DraggerableItem';
import TextWithAi from './components/TextWithAi';
import { InitialValue, formItemConfig } from './constants';
import styles from './index.less';
import { formatDateForForm, getValueProps, normalizeDate } from './utils';

type Props = {
  reload: () => void;
  resumeData: ResumeResponse | null;
};

const Sections = [
  'employmentIntention',
  'educationalBackgroundList',
  'internshipExperienceList',
  'campusExperienceList',
  'skill',
  'honor',
  'selfEvaluation',
  'projectExperienceList',
  'workExperienceList',
  'selfDefList',
];
const EditResume = React.forwardRef(({ resumeData, reload }: Props, ref) => {
  const queryData = useCreation(() => {
    return JSON.parse(window.sessionStorage.getItem('queryParams') || '{}');
  }, []);

  const state = useReactive({
    useCount: pick(resumeData || {}, [
      'resume_intern',
      'resume_project',
      'resume_school',
      'resume_self',
      'resume_work',
    ]),
  });

  const initialValue = useCreation<IResumeContent>(() => {
    const content = resumeData?.xaiResume?.content as IResumeContent;
    if (content) {
      return {
        ...content,
        ...[
          'educationalBackgroundList',
          'campusExperienceList',
          'internshipExperienceList',
        ].reduce<Record<string, any>>((rst, cur) => {
          // @ts-ignore
          let curData = content[cur] as any[];
          if (curData && curData.length > 0) {
            rst[cur] = curData;
          } else {
            rst[cur] = [
              cur === 'educationalBackgroundList'
                ? {
                    schoolName: '',
                    education: '',
                    graduationEndTime: '',
                    graduationStartTime: '',
                    rangeDate: [],
                    major: '',
                    description: '',
                  }
                : {
                    description: '',
                    rangeDate: [],
                    periodEnd: '',
                    periodStart: '',
                    projectName: '',
                    role: '',
                  },
            ];
          }
          return rst;
        }, {}),
      };
    }
    return (resumeData?.xaiResume?.content || InitialValue) as IResumeContent;
  }, [resumeData]);

  const { employmentIntentionJson } = useModel('AiJobHunt.resume', (model) => ({
    employmentIntentionJson: model.employmentIntentionJson,
  }));
  const [form] = Form.useForm();
  const selfDefList = Form.useWatch('selfDefList', form);
  const workExperienceList = Form.useWatch('workExperienceList', form);
  const projectExperienceList = Form.useWatch('projectExperienceList', form);
  const sex = Form.useWatch('sex', form);

  const onSave = () => {
    form
      .validateFields()
      .then((values) => {
        formatDateForForm(values, [
          'projectExperienceList',
          'workExperienceList',
          'selfDefList',
          'campusExperienceList',
          'internshipExperienceList',
        ]);
        const ebList = values.educationalBackgroundList;
        if (ebList && ebList.length > 0) {
          ebList.forEach((value: Record<string, any>) => {
            value.graduationStartTime = value.rangeDate[0];
            value.graduationEndTime = value.rangeDate[1];
            delete value.rangeData;
          });
        }
        saveResume({
          name: resumeData?.xaiResume.name,
          content: JSON.stringify(values),
          themeId: resumeData?.xaiResume.id,
          ...queryData,
        }).then(() => {
          message.success('保存成功');
          reload();
        });
      })
      .catch((err) => {
        if (err && err?.errorFields && err.errorFields.length) {
          form.scrollToField(err.errorFields[0].name);
        }
        return;
      });
  };

  useImperativeHandle(
    ref,
    () => {
      return {
        onSave,
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [],
  );

  const renderType = (
    type: FormItemType['type'],
    elementConfig: Record<string, any>,
  ) => {
    const {
      placeholder,
      className: itemClassName,
      options,
      style,
      pluginCode,
      suffix,
    } = elementConfig;
    const eleClassName = itemClassName ? styles[itemClassName] : undefined;

    switch (type) {
      case 'input':
        return (
          <Input
            className={eleClassName}
            placeholder={placeholder}
            style={{ width: '100%' }}
          />
        );
      case 'inputNumber':
        return (
          <Input
            type="number"
            className={eleClassName}
            addonAfter="元/月"
            placeholder={placeholder}
          />
        );
      case 'select':
        return (
          <Select
            className={eleClassName}
            placeholder={placeholder}
            // @ts-ignore
            dropdownMatchSelectWidth={false}
            option={options}
          ></Select>
        );
      case 'cascader':
        return (
          <Cascader
            dropdownMatchSelectWidth={false}
            className={eleClassName}
            placeholder={placeholder}
            displayRender={(labels, selectedOptions: any) =>
              selectedOptions
                ? selectedOptions[selectedOptions.length - 1]?.label
                : ''
            }
            options={employmentIntentionJson} // 目前只有求职意向用了级联，因此直接设置对应options，若有其他字段用此类型，则需要提出
            style={style || {}}
          />
        );
      case 'rangerPicker':
        return (
          <DatePicker
            type={'range'}
            // @ts-ignore
            width="auto"
            picker="month"
            format="YYYY-MM"
            style={style || {}}
            placeholder={placeholder}
          />
        );
      case 'textarea':
        return (
          <Input
            type="textarea"
            className={eleClassName}
            style={{ width: '100%' }}
            showCount={{
              // @ts-ignore
              formatter: ({ value, count }) => (
                <span
                  className={classNames(styles['content-text-area-count'], {
                    [sf.sColorMainColor]: value.length > 2000,
                  })}
                  style={value.length > 2000 ? { color: '#ff2739' } : {}}
                >
                  {count}/2000
                </span>
              ),
            }}
            placeholder={placeholder}
          />
        );
      case 'textareaWithAi':
        return (
          <TextWithAi
            placeholder={placeholder}
            resumeData={resumeData}
            pluginCode={pluginCode}
            // @ts-ignore
            useCount={state.useCount}
            onCountChange={(code) => {
              // @ts-ignore
              state.useCount[code] = state.useCount[code] + 1;
            }}
          />
        );
    }
  };

  const renderFormItems = function (
    config:
      | FormItemType[][]
      | {
          className: string;
          name: string;
          formItems: FormItemType[][];
          draggable?: boolean;
          formName?: string;
          maxItems?: number;
        },
  ) {
    function innerRender(
      innerConfig: FormItemType[][],
      field?: Record<string, any>,
    ) {
      return innerConfig.map((section) => {
        return (
          <Row key={JSON.stringify(section)}>
            {section.map(
              ({ name, cName, rules, className, type, elementConfig }) => {
                return (
                  <Form.Item
                    key={name}
                    name={field ? [field.name, name] : name}
                    getValueProps={
                      type === 'rangerPicker' ? getValueProps : undefined
                    }
                    normalize={
                      type === 'rangerPicker' ? normalizeDate : undefined
                    }
                    rules={rules || []}
                    label={
                      cName ? (
                        <span className={styles['form-label']}>{cName}</span>
                      ) : undefined
                    }
                    className={className ? styles[className] : undefined}
                  >
                    {renderType(type, elementConfig)}
                  </Form.Item>
                );
              },
            )}
          </Row>
        );
      });
    }
    if (isArray(config)) {
      return innerRender(config);
    } else {
      // 此三个模块为额外模块，若无则隐藏
      let visible = 'block';
      if (
        (config.formName === 'selfDefList' &&
          (!selfDefList || selfDefList.length === 0)) ||
        (config.formName === 'workExperienceList' &&
          (!workExperienceList || workExperienceList.length === 0)) ||
        (config.formName === 'projectExperienceList' &&
          (!projectExperienceList || projectExperienceList.length === 0))
      ) {
        visible = 'none';
      }

      return (
        <div
          className={classnames(styles[config.className])}
          style={{ display: visible }}
        >
          <h4>
            <span>{config.name}</span>
            <div></div>
          </h4>
          {config.draggable ? (
            <>
              <DraggableItem
                formCName={config.name}
                formName={config.formName || ''}
                form={form}
                maxItems={config.maxItems}
              >
                {(field) => (
                  <div className={styles['content-section']}>
                    {innerRender(config.formItems, field)}
                  </div>
                )}
              </DraggableItem>
            </>
          ) : (
            innerRender(config.formItems)
          )}
        </div>
      );
    }
  };

  return (
    <div className={styles.container}>
      <div
        className={classNames(styles['basic-avatar'], {
          [styles['basic-avatar-male']]: sex === '男',
          [styles['basic-avatar-female']]: sex === '女',
          [styles['basic-avatar-unknowAvatar']]: !sex,
        })}
      ></div>
      <Form
        scrollToFirstError
        form={form}
        colon={false}
        // layout="vertical"
        requiredMark={false}
        initialValues={initialValue as Store}
      >
        <Form.Item name="id" hidden>
          <Input></Input>
        </Form.Item>
        <div className={styles['basic-info']}>
          <div className={sf.sFlex1}>
            {renderFormItems(formItemConfig.basicInfo)}
          </div>
          <div className={styles['basic-avatar']}></div>
        </div>
        {Sections.map((item) => {
          return renderFormItems(formItemConfig[item]);
        })}
      </Form>
      <div className={styles['append-btn-group']}>
        <div
          onClick={() => {
            form.setFieldValue('projectExperienceList', [
              {
                description: '',
                rangeDate: [],
                periodEnd: '',
                periodStart: '',
                projectName: '',
                role: '',
              },
            ]);
          }}
          style={{
            visibility:
              projectExperienceList && projectExperienceList.length > 0
                ? 'hidden'
                : 'visible',
          }}
        >
          <span>项目经历</span>
        </div>
        <div
          onClick={() => {
            form.setFieldValue('workExperienceList', [
              {
                projectName: '',
                description: '',
                rangeDate: [],
                periodEnd: '',
                periodStart: '',
                role: '',
              },
            ]);
          }}
          style={{
            visibility:
              workExperienceList && workExperienceList.length > 0
                ? 'hidden'
                : 'visible',
          }}
        >
          <span>工作经历</span>
        </div>
        <div
          onClick={() => {
            form.setFieldValue('selfDefList', [
              {
                projectName: '',
                description: '',
                rangeDate: [],
                periodEnd: '',
                moduleName: '',
                periodStart: '',
              },
            ]);
          }}
          style={{
            visibility:
              selfDefList && selfDefList.length > 0 ? 'hidden' : 'visible',
          }}
        >
          <span>自定义模块</span>
        </div>
      </div>
    </div>
  );
});

export default React.memo(EditResume);
