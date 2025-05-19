/**
 * 新建数据集
 * fuxueyan
 */
import RichTextEdit from '@/components/RichText';
import UploadFile from '@/components/UploadFile';
import { getFileMajorType } from '@/components/UploadRepositoryModal/components/contants';
import { uploads } from '@/services/common';
import { getDataSet, saveDataSet } from '@/services/dataSet';
import { getAttachmentId, getScientificTagAll } from '@/services/research';
import { saveUploadFile } from '@/services/resource';
import { getResourceById } from '@/utils/utils';
import { CloseCircleOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Cascader, Form, Input, Radio, Select, Table, message } from 'antd';
import { useEffect, useState } from 'react';
import { history } from 'umi';
import AddTag from '../components/AddTag';
import CaseModal from '../components/CaseModal';
import Header from '../components/Header';
import style from './AddDataSet.less';
import { DATA_VOLUME, TAG, TYPE } from './contant';
import closePng from '@/assets/images/reSearch/close.svg';
import platformPng from '@/assets/images/reSearch/platform.png';

const AddDataSet = () => {
  const [form] = Form.useForm();
  const [isShowAddTag, setIsShowAddTag] = useState(false);
  const [tagTypeEnum, setTagTypeEnum] = useState('');
  const [tagObj, setTagObj] = useState<any>({});
  const [subject, setSubject] = useState([]);
  const [fileNameArr, setFileNameArr] = useState<any>([]);
  const [materialIds, setMaterialIds] = useState<any>([]);
  const [content, setContent] = useState('');
  const [isShowSelectDataSetModal, setIsShowSelectDataSetModal] = useState(false);
  const [dataSetList, setDataSetList] = useState<any>([]);

  const detailObj = sessionStorage.getItem('detailObj') as any;
  const detail = (detailObj && JSON.parse(detailObj)) || {};

  const getScientificTagAllData = () => {
    getScientificTagAll({ tagTypeEnum: 'subject' }).then((res) => {
      const arr = res
        .filter((item: any) => !item.parentCode)
        .map((item: any) => ({
          label: item.name,
          value: item.code,
          children: [],
        }));
      arr.map((item: any) => {
        res.map((iitem: any) => {
          if (item.value === iitem.parentCode) {
            item.children.push({
              label: iitem.name,
              value: iitem.code,
            });
          }
        });
        return item;
      });

      setSubject(arr.filter((item: any) => item.children.length > 0));
    });
  };

  useEffect(() => {
    getScientificTagAllData();
  }, []);

  useEffect(() => {
    let obj: any = {};
    obj.industry = detail?.industryLabel && JSON.parse(detail.industryLabel);
    obj.domain = detail?.domainLabel && JSON.parse(detail.domainLabel);
    setTagObj({ ...obj });
    const arr: any[] = (detail?.referenceDatasets && JSON.parse(detail?.referenceDatasets)) || [];
    setDataSetList([...arr]);
  }, [detail?.industryLabel, detail?.domainLabel, detail?.referenceDatasets]);

  useEffect(() => {
    let arr: any = [];
    let arrId: any = [];
    detail.materialsInfo?.map((item: any) => {
      arr.push(item.attachmentName);
      arrId.push({ materialId: item.materialId, id: item.id });
    });
    setFileNameArr(arr);
    setMaterialIds(arrId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddTag = (type: string) => {
    setIsShowAddTag(true);
    setTagTypeEnum(type);
  };

  const handleClickOk = (arr: any) => {
    if (arr.length > 5) {
      message.error('最多可添加5个标签');
      return;
    }
    tagObj[tagTypeEnum] = arr;
    setTagObj({ ...tagObj });
    setIsShowAddTag(false);
  };

  const handleDeleteTag = (index: number, type: string) => {
    tagObj[type].splice(index, 1);
    setTagObj({ ...tagObj });
  };

  const onUploadSuccess = (url: string, name: string, type: string, file: any) => {
    const attachmentType = file.name.split('.').pop().toLocaleLowerCase();

    if (fileNameArr.length > 4) {
      message.error('上传的文件最多不超过5个');
      return;
    }
    fileNameArr.push(name);
    setFileNameArr([...fileNameArr]);
    const params = {
      attachmentUrl: url,
      attachmentName: name,
      attachmentType: attachmentType,
      attachmentCategory: getFileMajorType(attachmentType),
      attachmentSize: file.size,
      isConvert: 1,
      suffixName: attachmentType,
    };
    saveUploadFile(params).then((res) => {
      materialIds.push({ materialId: res });
      setMaterialIds([...materialIds]);
    });
  };

  const handleDelFile = (index: number) => {
    fileNameArr.splice(index, 1);
    materialIds.splice(index, 1);
    setFileNameArr([...fileNameArr]);
    setMaterialIds([...materialIds]);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    values.materialIds = materialIds.length ? JSON.stringify(materialIds) : '[]';
    values.industryLabel = JSON.stringify(tagObj.industry);
    values.domainLabel = JSON.stringify(tagObj.domain);
    values.topicCode = values.topicCode[1] || '';
    values.content = content;
    values.isPublish = 0;
    values.id = detail.id || '';
    values.referenceDatasets = JSON.stringify(dataSetList);
    saveDataSet(values).then(() => {
      detail.id ? history.push('/dataSetDetail') : history.push('/dataSet');
    });
  };

  const handleChangeRichText = (e: any) => {
    setContent(e);
  };

  const uploadFn = async (param: any) => {
    let file = param.file;
    const data = await uploads({
      bucketNameType: 'pub',
      ossResCategory: 'builder',
      objectKey:
        `/${
          JSON.parse(window.sessionStorage.getItem('projectData') || '{}').projectVersionId
        }/task/${file.name}` || '',
    });
    const formData = new FormData();
    Object.keys(data.tokenParams).forEach((key) => {
      formData.append(key, data.tokenParams[key]);
    });
    formData.append('file', file);
    fetch(data.endpoint, {
      method: 'POST',
      body: formData,
    })
      .then(async () => {
        const attachmentType = (file.name as any).split('.').pop().toLocaleLowerCase();
        const params = {
          attachmentUrl: data.file_url,
          attachmentName: file.name,
          attachmentCategory: getFileMajorType(attachmentType),
          attachmentSize: file.size,
          isConvert: 1,
          suffixName: attachmentType,
        };
        const id = await getAttachmentId(params);
        param.success({
          url: getResourceById(id) as string,
          meta: {
            id: '',
            title: '',
            alt: '',
            loop: false,
            autoPlay: false,
            controls: false,
            poster: '',
          },
        });
      })
      .catch(() => {
        param.error({
          msg: 'unable to upload.',
        });
      });
  };

  // 选择数据集
  const handleSelectDataSet = () => {
    setIsShowSelectDataSetModal(true);
  };

  const getColumns = (data: RecordItem) => {
    const columns: any = [
      {
        title: '序号',
        dataIndex: 'index',
        render(value: any, record: any, index: number) {
          const i = data.limit * (data.pageNum - 1);
          return i + index + 1;
        },
        width: 65,
        align: 'center',
      },
      {
        title: '数据集ID',
        dataIndex: 'id',
        ellipsis: true,
      },
      {
        title: '数据集名称',
        dataIndex: 'name',
        ellipsis: true,
      },
      {
        title: '使用平台',
        dataIndex: 'platform',
        align: 'center',
        ellipsis: true,
        render() {
          return 'BIP';
        },
      },
    ];
    return columns;
  };

  const onOk = (selectedRowKey: any, selectedRow: any) => {
    setIsShowSelectDataSetModal(false);
    setDataSetList(selectedRow);
  };

  const columns: any = [
    {
      title: '数据集ID',
      dataIndex: 'id',
      ellipsis: true,
    },
    {
      title: '数据集名称',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '使用平台',
      dataIndex: 'platform',
      align: 'center',
      ellipsis: true,
      render() {
        return 'BIP';
      },
    },
  ];

  return (
    <div className={style.container}>
      <Header
        seTitle={detail.id ? '数据集详情' : '数据集设置'}
        thTitle={`${detail.id ? '编辑' : '新建'}数据集`}
        oneTitle={detail.id ? '数据集设置' : '初始化'}
        routePath={detail.id ? '/dataSetDetail' : '/dataSet'}
        oneRoutePath={detail.id ? '/dataSet' : '/configIndex'}
      />
      <div className={style.content}>
        <Form colon={false} labelCol={{ span: 3 }} wrapperCol={{ span: 21 }} form={form}>
          <div className={style.header}>
            <span>{`${detail.id ? '编辑' : '新建'}数据集`}</span>
          </div>
          <div className={style.form}>
            <Form.Item
              label="数据集名称"
              name="name"
              rules={[
                { required: true, message: '请填写数据集名称!' },
                { max: 30, message: '数据集名称最大长度为100个字符!' },
                { pattern: /^\S.*\S$|(^\S{0,1}\S$)/, message: '头尾不能输入空格！' },
              ]}
              initialValue={detail.name}
            >
              <Input
                placeholder="请输入数据集名称，最多可输入100个字"
                className={style.input}
                maxLength={100}
              />
            </Form.Item>
            <Form.Item
              label="数据集编码"
              name="datasetCode"
              rules={[
                { required: true, message: '请填写数据集编码!' },
                { max: 30, message: '数据集编码最大长度为30个字符!' },
              ]}
              initialValue={detail.datasetCode}
            >
              <Input
                placeholder="请输入数据集编码，最多可输入30个字"
                className={style.input}
                maxLength={30}
              />
            </Form.Item>
            <Form.Item
              label="数据集简介"
              name="datasetDesc"
              rules={[
                { required: true, message: '请填写数据集简介!' },
                { max: 100, message: '数据集简介最大长度为100个字符!' },
              ]}
              initialValue={detail.datasetDesc}
            >
              <Input.TextArea
                maxLength={100}
                placeholder="请输入数据集的一句话简介，最多可输入100个字"
                className={style.inputTextArea}
                showCount
                style={{
                  resize: 'none',
                  wordBreak: 'break-all',
                  whiteSpace: 'pre-line',
                  wordWrap: 'break-word',
                }}
              />
            </Form.Item>
            <Form.Item
              label="主题板块"
              name="topicCode"
              rules={[{ required: true, message: '请选择主题板块!' }]}
              initialValue={detail.topicCode?.slice(1, -1).split(',')}
            >
              <Cascader
                options={subject}
                placeholder="请选择主题板块"
                style={{ width: 555 }}
                dropdownStyle={{
                  borderRadius: 3,
                  boxShadow:
                    '0px 3px 14px 2px rgba(0,0,0,0.05), 0px 8px 10px 1px rgba(0,0,0,0.06), 0px 5px 5px -3px rgba(0,0,0,0.1)',
                }}
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
              />
            </Form.Item>
            <Form.Item
              label="类型"
              name="interfaceType"
              rules={[{ required: true, message: '请选择类型!' }]}
              initialValue={detail.interfaceType ? String(detail.interfaceType) : '1'}
            >
              <Select
                style={{ width: 182 }}
                className={style.select}
                placeholder="请选择类型"
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
              >
                {TYPE.map((item: any) => (
                  <Select.Option key={item.key} value={item.key}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            {TAG.map((tag: any) => (
              <Form.Item label={tag.name} key={tag.key}>
                <div className={style.industry}>
                  <div className={style.tags}>
                    {tagObj[tag.key]?.map((item: any, index: number) => (
                      <span className={style.tagBox} key={item.code}>
                        {item.name}
                        <CloseOutlined
                          className={style.icon}
                          onClick={() => handleDeleteTag(index, tag.key)}
                        />
                      </span>
                    ))}
                  </div>
                  <div className={style.addTag} onClick={() => handleAddTag(tag.key)}>
                    <PlusOutlined style={{ marginRight: 5 }} />
                    <span>添加标签</span>
                  </div>
                </div>
              </Form.Item>
            ))}
            <Form.Item
              label="数据量"
              name="datasetVolume"
              rules={[{ required: true, message: '请选择数据量!' }]}
              initialValue={detail.datasetVolume && String(detail.datasetVolume)}
            >
              <Select
                style={{ width: 182 }}
                className={style.select}
                placeholder="请选择数据量"
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
              >
                {DATA_VOLUME.map((item: any) => (
                  <Select.Option key={item.key} value={item.key}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="是否推荐"
              name="isPropers"
              rules={[{ required: true, message: '请选择是否推荐!' }]}
              initialValue={detail.isPropers || 0}
            >
              <Radio.Group>
                <Radio value={0}>不推荐</Radio>
                <Radio value={1}>推荐</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="文件上传">
              <div className={style.upload}>
                <UploadFile
                  multiple
                  fileTypes={['xlsx', 'xls']}
                  message="允许上传xlsx、xls文件"
                  onUploadSuccess={onUploadSuccess}
                  onBeforeUpload={(file: any) => {
                    if (file.size > 2 * 1024 * 1024) {
                      message.error('上传文件最大不超过2M');
                      return false;
                    }
                    return true;
                  }}
                >
                  <div className={style.addTag}>
                    <PlusOutlined style={{ marginRight: 5 }} />
                    <span>添加文件</span>
                  </div>
                </UploadFile>
                <span className={style.tip}>*允许上传xlsx、xls文件</span>
              </div>
              <div className={style.fileList}>
                {fileNameArr.map((item: any, index: number) => (
                  <div className={style.file} key={index}>
                    <span>{item}</span>
                    <img src={closePng} onClick={() => handleDelFile(index)} />
                  </div>
                ))}
              </div>
            </Form.Item>
            <Form.Item label="使用平台" name="platform" initialValue="bip3">
              <img src={platformPng} className={style.plat} />
            </Form.Item>
            <Form.Item label="关联数据源">
              {dataSetList.length > 0 ? (
                <div className={style.releateDataSet}>
                  <CloseCircleOutlined
                    className={style.closeIcon}
                    onClick={() => {
                      setDataSetList([]);
                    }}
                  />
                  <Table
                    columns={columns}
                    dataSource={dataSetList}
                    pagination={false}
                    className={style.table}
                    size="small"
                    rowKey="id"
                  />
                </div>
              ) : (
                <div className={style.related} onClick={handleSelectDataSet}>
                  选择数据源
                </div>
              )}
            </Form.Item>
            <Form.Item label="详细介绍" name="content">
              <div className={style.richText}>
                <RichTextEdit
                  onChange={handleChangeRichText}
                  uploadFn={uploadFn}
                  text={detail.content}
                  placeholder="请输入详细介绍"
                />
              </div>
            </Form.Item>
          </div>
          <div className={style.footer}>
            <Button onClick={() => history.push(detail.id ? '/dataSetDetail' : '/dataSet')}>
              取消
            </Button>
            <Button type="primary" onClick={handleSubmit} htmlType="submit">
              提交
            </Button>
          </div>
        </Form>
      </div>
      {isShowAddTag && (
        <AddTag
          handleCancel={() => setIsShowAddTag(false)}
          tagTypeEnum={tagTypeEnum}
          handleClickOk={handleClickOk}
          tagObj={tagObj}
        />
      )}
      <CaseModal
        open={isShowSelectDataSetModal}
        onCancel={() => setIsShowSelectDataSetModal(false)}
        onOk={onOk}
        getColumns={getColumns}
        queryData={getDataSet}
        searchWord="name"
        title="数据集"
      />
    </div>
  );
};

export default AddDataSet;
