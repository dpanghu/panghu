import React, { useState } from 'react';

import styles from './index.less';
import { Button, Form, Input, Modal, Select, Table, Tooltip, message } from 'antd';
import { useMemoizedFn, useMount } from 'ahooks';
import { changeData, getAnswerType, getData, getProductType } from '@/services/calculate';

const Calculate: React.FC = () => {
  const [dataSource, setDataSource] = useState<any>([]);
  const [total, setTotal] = useState<any>(0);
  const [pageNum, setPageNum] = useState<any>(1);
  const [limit, setLimit] = useState<any>(10);
  // const [value1,setValue1]=useState<any>('')
  const [url, setUrl] = useState<any>('');
  const [dataSourceName, setDataSourceName] = useState<any>('');
  const [teamRank, setTeamRank] = useState<any>('');
  const [teamRanks, setTeamRanks] = useState<any>([]);
  const [answerType, setAnswerType] = useState<any>(''); //页面选择的案例编码
  const [open, setOpen] = useState(false);
  const [productTypes, setProductTypes] = useState<any>([]);
  const [productType, setProductType] = useState<any>('');
  // const [productsType, setProductsType] = useState<any>('')
  const [caseTypes, setCaseTypes] = useState<any>([]); //案例编码选项
  const [caseType, setCaseType] = useState<any>(''); //弹窗选择的案例编码
  const [hasContent, setHasContent] = useState(false);
  const { Option } = Select;
  const [form] = Form.useForm();
  const [form1] = Form.useForm();

  // 获取页面信息
  const getDatas = useMemoizedFn(async () => {
    const res = await getData({ projectVersionId: '', pageNum: pageNum, limit: limit });
    setDataSource(res.data);
    setTotal(res.total);
  });

  //  获取产品编码
  const getProductTypes = async () => {
    const res = await getProductType();
    console.log(res);
    setProductTypes(
      res?.map((item: RecordItem) => ({
        label: item.productName,
        value: item.id,
      })),
    );
  };

  const columns: any = [
    {
      title: '序号',
      dataIndex: 'code',
      width: '30px',
      align: 'center',
      render: (text: string) => (
        <Tooltip placement="top" title={text}>
          <span
            style={{
              overflow: 'hidden',
              width: '30px',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              display: 'inline-block',
            }}
          >
            {text}
          </span>
        </Tooltip>
      ),
      //   title: '序号',
      //   render: (text: string ) => <div>{index + 1}</div>,
    },
    {
      title: '核算账簿',
      dataIndex: 'bookName',
      width: '70px',
      align: 'center',
      render: (text: string) => (
        <Tooltip placement="top" title={text}>
          <span
            style={{
              overflow: 'hidden',
              width: '70px',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              display: 'inline-block',
            }}
          >
            {text}
          </span>
        </Tooltip>
      ),
      //   fixed:'left',
      //   width:'100px'
    },
    {
      title: '会计期间',
      dataIndex: 'period',
      width: '50px',
      align: 'center',
      render: (text: string) => (
        <Tooltip placement="top" title={text}>
          <span
            style={{
              overflow: 'hidden',
              width: '50px',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              display: 'inline-block',
            }}
          >
            {text}
          </span>
        </Tooltip>
      ),
    },
    {
      title: '会计科目',
      dataIndex: 'accasoaName',
      width: '105px',
      align: 'center',
      render: (text: string) => (
        <Tooltip placement="top" title={text}>
          <span
            style={{
              overflow: 'hidden',
              width: '105px',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              display: 'inline-block',
            }}
          >
            {text}
          </span>
        </Tooltip>
      ),
    },
    {
      title: '辅助核算',
      dataIndex: 'assid',
      width: '105px',
      align: 'center',
      render: (text: string) => (
        <Tooltip placement="top" title={text}>
          <span
            style={{
              overflow: 'hidden',
              width: '105px',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              display: 'inline-block',
            }}
          >
            {text}
          </span>
        </Tooltip>
      ),
    },
    {
      title: '借贷方向',
      dataIndex: 'direction',
      width: '50px',
      align: 'center',
      render: (text: string) => (
        <Tooltip placement="top" title={text}>
          <span
            style={{
              overflow: 'hidden',
              width: '50px',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              display: 'inline-block',
            }}
          >
            {text}
          </span>
        </Tooltip>
      ),
    },
    {
      title: '组织本币(借方)',
      dataIndex: 'debitamount',
      width: '70px',
      align: 'center',
      render: (text: string) => (
        <Tooltip placement="top" title={text}>
          <span
            style={{
              overflow: 'hidden',
              width: '70px',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              display: 'inline-block',
            }}
          >
            {text}
          </span>
        </Tooltip>
      ),
    },
    {
      title: '组织本币(贷方)',
      dataIndex: 'creditamount',
      width: '70px',

      render: (text: string) => (
        <Tooltip placement="top" title={text}>
          <span
            style={{
              overflow: 'hidden',
              width: '70px',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              display: 'inline-block',
            }}
          >
            {text}
          </span>
        </Tooltip>
      ),
    },
  ];

  // 获取输入框内容
  const handleUrlChange = (e: any) => {
    setUrl(e.target.value);
    form.validateFields(['url']);
  };

  // 选择NCC业务单元
  const handleRankChange = (value: any) => {
    setTeamRank(value);
  };

  // // 获取输入框内容
  // const handleTypeChange = (value: any) => {
  //     setAnswerType(value)
  // }

  // 获取输入框内容
  const handleNameChange = (e: any) => {
    setDataSourceName(e.target.value);
  };

  // 点击按钮查询对应数据
  const handleSearch = () => {
    form1.validateFields(['productsType']);
    form1.validateFields(['answersTypes']);
    getData({ projectVersionId: '', pageNum: pageNum, limit: limit, answerType: answerType }).then(
      (res) => {
        setDataSource(res.data);
        setTotal(res.total);
      },
    );
  };

  // 打开弹窗
  const handleOpen = () => {
    setOpen(true);
    getProductTypes();
    const arr = new Array();
    for (let i = 1; i < 27; i++) {
      arr.push(i);
    }
    setTeamRanks(
      arr?.map((item: RecordItem) => ({
        label: item,
        value: item,
      })),
    );
    // getAnswerTypes();
  };

  // 点击取消关闭弹窗
  const handleCancel = () => {
    setOpen(false);
    form.resetFields();
  };

  // 点击确定提交
  const handleFinish = async () => {
    const value = await form.validateFields();
    console.log(value);
    if (hasContent && !caseType) {
      message.error('请选择案例编码');
    } else if (!hasContent) {
      message.error('暂无案例编码,无法同步');
    } else {
      setOpen(false);
      form.resetFields();
      changeData({
        url: url,
        answerType: caseType,
        dataSourceName: dataSourceName,
        teamRank: teamRank,
      }).then((res) => {
        console.log(res);
        message.success('同步成功');
        getDatas();
      });
    }
  };

  // 改变页码数及每页条数
  const handlePageChange = (page: any, pageSize: any) => {
    setLimit(pageSize);
    setPageNum(page);
    getData({ projectVersionId: '', pageNum: page, limit: pageSize, answerType: answerType }).then(
      (res: any) => {
        setDataSource(res.data);
        setTotal(res.total);
      },
    );
  };
  // 页面选择产品编码
  const handlePselect = async (value: string) => {
    setProductType(value);
    form1.resetFields(['answersTypes']);
    const res = await getAnswerType();
    const content = res?.filter((item: RecordItem) => item.productId == value);
    setHasContent(content.length === 0 ? false : true);
    setCaseTypes(
      content.map((items: RecordItem) => ({ label: items.caseCode, value: items.caseCode })),
    );
  };
  // 页面选择案例编码
  const handleAselect = (value: string) => {
    console.log(value);
    setAnswerType(value);
    setPageNum(1);
    setLimit(10);
  };
  // 选择产品编码
  const handleSelect = async (value: string) => {
    setProductType(value);
    const res = await getAnswerType();
    const content = res?.filter((item: RecordItem) => item.productId == value);
    setHasContent(content.length === 0 ? false : true);
    setCaseTypes(
      content.map((items: RecordItem) => ({ label: items.caseCode, value: items.caseCode })),
    );
    form.resetFields(['answerType']);
    form.resetFields(['dataSourceName']);
    form.resetFields(['url']);
    form.resetFields(['teamRank']);
  };

  // 选择案例编码
  const handleASelect = (value: string) => {
    console.log(value);
    setCaseType(value);
  };

  useMount(() => {
    getDatas();
    getProductTypes();
    console.log(setTotal);
  });
  // 校验NCC地址格式
  const checkUrlFormat = (rule: any, value: any, callBack: any) => {
    const regExp = /^(http|https?):\/\//;
    if (!regExp.test(value)) {
      callBack('请输入正确格式的NCC地址');
    } else {
      callBack();
    }
  };
  // 校验页面是否选择answerType进行查询
  // const checkSelect=(rule: any,value: any,callBack: any)=>{
  //     if(!value) {
  //         callBack('请选择产品编码')
  //     }
  //     else {
  //         callBack()
  //     }
  // }

  return (
    <div className={styles?.main}>
      <div className={styles.selectStyle}>
        {/* <div > */}
        <Form form={form1} className={styles.answer}>
          <Form.Item
            id="productsType"
            label="产品编码:"
            name="productsType"
            rules={[{ required: true, message: '请选择产品编码' }]}
          >
            <Select onChange={handlePselect} placeholder="请选择产品编码">
              {productTypes?.map((item: RecordItem, index: any) => (
                <Option value={item.value} key={index}>
                  {item.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="案例编码:"
            name="answersTypes"
            id="answersTypes"
            rules={[{ required: true, message: '请选择案例编码' }]}
          >
            <Select
              disabled={productType == ''}
              onChange={handleAselect}
              value={answerType}
              placeholder="请选择案例编码"
            >
              {caseTypes?.map((item: RecordItem, index: any) => (
                <Option value={item.value} key={index}>
                  {item.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Button
            type="primary"
            onClick={handleSearch}
            style={{ top: '-11px', marginLeft: '10px' }}
          >
            查询
          </Button>
        </Form>
        {/* <span style={{width:'70px'}}>案例编码：</span>
                <Input
                style={{width:'230px'}}
                    allowClear
                    value={answerType}
                    placeholder="输入案例编码按回车进行查询"
                    onChange={handleTypeChange}
                    onPressEnter={handleSearch}
                /> */}
        {/* </div> */}

        <Button type="primary" onClick={handleOpen}>
          同步
        </Button>
      </div>
      <div>
        <Table
          rowKey="voucherId"
          columns={columns}
          dataSource={dataSource}
          pagination={{
            defaultCurrent: 1,
            total: total,
            pageSize: limit,
            current: pageNum,
            showSizeChanger: true,
            showTotal: (totalCount: number) => `共 ${totalCount} 项数据`,
            onChange: (page, pageSize) => handlePageChange(page, pageSize),
            showTitle: false,
          }}
        />
      </div>
      <Modal title={'同步信息填写'} open={open} onCancel={handleCancel} onOk={handleFinish}>
        <Form onFinish={handleFinish} form={form} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
          <Form.Item
            label="产品编码:"
            name="productType"
            rules={[{ required: true, message: '请选择产品编码' }]}
          >
            <Select onChange={handleSelect} placeholder="请选择产品编码">
              {productTypes?.map((item: RecordItem, index: any) => (
                <Option value={item.value} key={index}>
                  {item.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="案例编码:"
            name="answerType"
            id="answerType"
            rules={[{ required: true, message: '请选择案例编码' }]}
          >
            <Select
              disabled={productType == ''}
              onChange={handleASelect}
              value={caseType}
              placeholder="请选择案例编码"
            >
              {caseTypes?.map((item: RecordItem, index: any) => (
                <Option value={item.value} key={index}>
                  {item.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="NCC地址:"
            name="url"
            id="url"
            rules={[
              {
                validator: checkUrlFormat,
              },
            ]}
          >
            <Input allowClear value={url} placeholder="请输入NCC地址" onChange={handleUrlChange} />
          </Form.Item>
          <Form.Item
            label="NCC数据源:"
            name="dataSourceName"
            id="dataSourceName"
            rules={[{ required: true, message: 'NCC数据源不能为空' }]}
          >
            <Input
              allowClear
              value={dataSourceName}
              placeholder="请输入NCC数据源"
              onChange={handleNameChange}
            />
          </Form.Item>
          <Form.Item
            label=" NCC业务单元:"
            name="teamRank"
            id="teamRank"
            rules={[{ required: true, message: 'NCC业务单元不能为空' }]}
          >
            <Select onChange={handleRankChange} placeholder="请选择NCC业务单元">
              {teamRanks?.map((item: RecordItem, index: any) => (
                <Option value={item.value} key={index}>
                  {item.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Calculate;
