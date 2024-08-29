import { UploadOutlined } from '@ant-design/icons';
import { useReactive } from 'ahooks';
import { Tooltip } from 'antd';
import classNames from 'classnames';
import React, { useEffect } from 'react';
import {
  Button,
  Cascader,
  DatePicker,
  Form,
  Input,
  message,
  Select,
  Upload,
} from 'SeenPc';
import sf from 'SeenPc/dist/esm/globalStyle/global.less';
import type { FieldProperties, Plugin } from '../../../../type';

type Props = {
  plugin: Plugin;
  formRef: any;
};

type TState = {
  optionsCache: RecordItem;
};

const RenderFormItem: React.FC<Props> = ({ formRef, plugin }) => {
  const state = useReactive<TState>({
    optionsCache: {},
  });

  const fetchOptions = (data: { key: string; url: string | undefined }) => {
    return fetch(data.url!)
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        return {
          key: data.key,
          value: json,
        };
      });
  };

  useEffect(() => {
    if (!plugin) {
      return;
    }
    const asyncItems = plugin.paramMetadataList
      .filter((item) => !!item.treeSelectOptionsUrl)
      .map((item) => ({
        key: item.name,
        url: item.treeSelectOptionsUrl,
      }));
    Promise.all(asyncItems.map((item) => fetchOptions(item))).then((res) => {
      state.optionsCache = res.reduce(
        (rst, cur) => ({ ...rst, [cur.key]: cur.value }),
        {},
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plugin]);

  const handleTreeSelectChange = (name: string) => (value: any, extra: any) => {
    if (extra.children && extra.children.length > 0) {
      formRef.setFieldsValue({ [name]: '' });
    } else {
      formRef.setFieldsValue({ [name]: value });
    }
  };
  const renderElement = (item: FieldProperties) => {
    switch (item.elementType) {
      case 'input':
        return (
          <Input
            maxLength={item.maxLength}
            style={{ width: 104 }}
            placeholder={item.displayName}
          />
        );
      case 'select':
        return (
          <Select
            options={item.options}
            placement="topLeft"
            style={{ width: 104 }}
            dropdownMatchSelectWidth={false}
            placeholder={item.displayName}
          />
        );
      case 'number':
        return (
          <Input
            type="number"
            precision={item.decimalLength}
            style={{ width: 104 }}
            min={item.minValue}
            placeholder={item.displayName}
            max={item.maxLength}
            defaultValue={item.defaultValue}
          />
        );
      case 'datePicker':
        return (
          <DatePicker
            format={item.dataFormat || 'YYYY-MM-DD'}
            style={{ width: 104 }}
            placeholder={item.displayName}
          />
        );
      case 'file':
        // eslint-disable-next-line
        const extraParams = JSON.parse(
          window.sessionStorage.getItem('queryParams') || '{}',
        );
        // eslint-disable-next-line
        const params = {
          seenOss: {
            url: '/api/bus-xai/dbe3.private.params.upload.get',
            extraParams,
          },
        };
        return item?.fileConf ? (
          <Upload
            {...params}
            accept={(item?.fileConf?.ext || [])
              .map((item) => '.' + item)
              .join(',')}
            className={classNames(sf.sFlex, sf.sFlexGap10)}
            beforeUpload={(file) => {
              const isOverSize =
                file.size / 1024 / 1024 > item.fileConf?.maxSize;
              if (isOverSize) {
                message.warning(
                  '请上传不超过' + item.fileConf?.maxSize + 'MB的文件',
                );
                return Upload.LIST_IGNORE;
              }
              return true;
            }}
          >
            <Tooltip
              title={`上传${item?.fileConf?.ext.join(
                '、',
              )}类型文件，大小不超过${item?.fileConf?.maxSize}MB`}
            >
              <Button style={{ width: 104 }} icon={<UploadOutlined />}>
                点击上传
              </Button>
            </Tooltip>
          </Upload>
        ) : (
          <Upload {...params} className={classNames(sf.sFlex, sf.sFlexGap10)}>
            <Button style={{ width: 104 }} icon={<UploadOutlined />}>
              点击上传
            </Button>
          </Upload>
        );
      default:
        return (
          <Cascader
            style={{ width: 104 }}
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            dropdownMatchSelectWidth={false}
            maxLength={item.maxLength}
            placeholder={item.displayName}
            options={state.optionsCache[item.name] || []}
            value={formRef?.getFieldValue(item.name)} // 确保这里和 formItem 的 name 属性一致
            onChange={handleTreeSelectChange(item.name)}
          />
        );
    }
  };
  return (
    <>
      {(plugin?.paramMetadataList || []).map((item) => (
        <Form.Item
          key={item.name}
          label={item.displayName}
          name={item.name}
          noStyle
          rules={
            item.required
              ? [{ required: true, message: '请输入' + item.displayName }]
              : []
          }
        >
          {renderElement(item)}
        </Form.Item>
      ))}
    </>
  );
};

export default React.memo(RenderFormItem);
