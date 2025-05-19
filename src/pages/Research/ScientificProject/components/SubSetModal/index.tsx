import { SearchOutlined } from '@ant-design/icons';
import type { PaginationProps } from 'antd';
import { Checkbox, Empty, Input, Modal, Pagination, Select, Tooltip, message } from 'antd';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import CaseCard from '../CaseCard';
import DataSetCard from '../DataSetCard';
import styles from './index.less';
import { getScientificCaseAll, getScientificTagAll } from '@/services/research';
import { getDataSetList } from '@/services/dataSet';
// import { CheckboxChangeEvent } from 'antd/lib/checkbox';

interface TProps {
  subSetType: number;
  onOk: (record: RecordItem[]) => void;
  onCancel: () => void;
  open: boolean;
  baseRecord: RecordItem[];
}
const { Option } = Select;

const Container: React.FC<TProps> = ({ subSetType, onCancel, onOk, open, baseRecord }) => {
  const [queryParams, setQueryParams] = useState({
    subject: undefined,
    pageNum: 1,
    domain: undefined,
    technology: undefined,
    pertainIndustry: undefined,
    topicCode: undefined,
    limit: 6,
    casesName: undefined,
    name: undefined,
  });
  const [dataSource, setDataSource] = useState<RecordItem[]>([]);
  const [iptValue, setIptValue] = useState<string>('');
  const [total, setTotal] = useState<number>(0);
  const [activePanel, setActivePanel] = useState<RecordItem[]>([]);
  const [domain, setDomain] = useState<RecordItem[]>([]);
  const [topicCode, setTopicCode] = useState<RecordItem[]>([]);
  const [industryEnum, setIndustryEnum] = useState<RecordItem[]>([]);
  const [technology, setTechnology] = useState<RecordItem[]>([]);
  const [checkAll, setCheckAll] = useState<boolean>(false);
  const [indeterminate, setIndeterminate] = useState(false);

  const queryPanelData = async () => {
    const params: RecordItem = {
      pageNum: queryParams.pageNum,
      limit: queryParams.limit,
    };
    if (subSetType === 1) {
      params.pertainDomain = queryParams.domain;
      params.involvingTechnology = queryParams.technology;
      params.pertainIndustry = queryParams.pertainIndustry;
      params.casesState = 1;
      params.casesName = queryParams.casesName;
    } else {
      params.domainLabel = queryParams.domain;
      params.industryLabel = queryParams.technology;
      params.topicCode = queryParams.topicCode;
      params.isPublish = 1;
      params.tagTypeEnum = 'subject';
      params.name = queryParams.name;
    }
    const queryData = subSetType === 1 ? getScientificCaseAll : getDataSetList;
    const result = await queryData({ ...params, productCode: 'BIP' });
    setDataSource(result.data);
    setTotal(result.total);
  };

  const getScientificTag = () => {
    getScientificTagAll().then((res: RecordItem[]) => {
      // const tagType = res.filter((item) => item.groupType === 9);
      const industry = res.filter((item) => item.groupType === 3);
      const domain1 = res.filter((item) => item.groupType === 7);
      const technology1 = res.filter((item) => item.groupType === 1);
      // setTopicCode(tagType);
      setIndustryEnum(industry);
      setTechnology(technology1);
      setDomain(domain1);
    });
    getScientificTagAll({ tagTypeEnum: 'subject' }).then((res: RecordItem[]) => {
      const tagType = res.filter((item) => item.groupType === 9);
      setTopicCode(tagType);
    });
  };

  const onPageNumChange: PaginationProps['onChange'] = (page: number, pageSize: number) => {
    setQueryParams({
      ...queryParams,
      pageNum: page,
      limit: pageSize,
    });
  };

  const onShowSizeChange = (current: number, size: number) => {
    setQueryParams({
      ...queryParams,
      pageNum: current,
      limit: size,
    });
  };

  const handleSearch = () => {
    setQueryParams({
      ...queryParams,
      [subSetType === 1 ? 'casesName' : 'name']: iptValue,
      pageNum: 1,
    });
  };

  // 数组中是否包含此对象的方法
  const containsObject = (arr: any, obj: any) => {
    return arr.map(JSON.stringify).includes(JSON.stringify(obj));
  };

  const handleChoosePanel = (chooseRecord: RecordItem) => {
    if (subSetType === 1) {
      if (containsObject(activePanel, chooseRecord)) {
        setActivePanel([]);
      } else {
        setActivePanel([chooseRecord]);
      }
    } else {
      if (containsObject(activePanel, chooseRecord)) {
        const newIds = activePanel.filter((i) => i.id !== chooseRecord.id);
        setActivePanel(newIds);
        setIndeterminate(!!newIds.length && newIds.length < dataSource.length);
        setCheckAll(!!newIds.length && newIds.length === dataSource.length);
      } else {
        setActivePanel([...activePanel, chooseRecord]);
        setCheckAll([...activePanel, chooseRecord].length === dataSource.length);
        setIndeterminate([...activePanel, chooseRecord].length < dataSource.length);
      }
    }
  };

  const handleChangeSelect = (value: any, key: string) => {
    setQueryParams({
      ...queryParams,
      [key]: value,
    });
  };

  const onCheckboxChange = (e: any) => {
    if (e.target.checked) {
      // 去除重复项后合并
      const newArr: RecordItem[] = [];
      [...activePanel, ...dataSource].forEach((item) => {
        if (!newArr.find((ele: RecordItem) => ele.id === item.id)) {
          newArr.push(item);
        }
      });
      setActivePanel(newArr);
    } else {
      // 将当页数据清除
      const dataSourceIds = dataSource.map((item) => item.id);
      const newArr: RecordItem[] = activePanel.filter((item) => !dataSourceIds.includes(item.id));
      setActivePanel(newArr);
    }
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  useEffect(() => {
    if (open) {
      queryPanelData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, queryParams]);

  useEffect(() => {
    if (open) {
      getScientificTag();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (baseRecord.length) {
      setActivePanel(baseRecord);
    }
  }, [baseRecord]);

  useEffect(() => {
    const activeIds = activePanel.map((item) => item.id);
    const selectPanel = dataSource.filter((item) => activeIds.includes(item.id));
    setCheckAll(selectPanel.length === dataSource.length);
    setIndeterminate(selectPanel.length === 0 ? false : selectPanel.length !== dataSource.length);
  }, [dataSource, activePanel]);

  return (
    <div className={styles.container} id="subSetModalContainer">
      <Modal
        open={true || open}
        getContainer={() => document.getElementById('subSetModalContainer') as HTMLElement}
        title={
          <div className={styles.header}>
            <div className={styles.title}>选择{subSetType === 1 ? '案例' : '数据集'}</div>
            <Tooltip title="全选/反选">
              <Checkbox
                onChange={onCheckboxChange}
                checked={checkAll}
                indeterminate={indeterminate}
              ></Checkbox>
            </Tooltip>
            <div className={styles.action} id="action">
              <Select
                placeholder={`请选择${subSetType === 1 ? '行业标签' : '主题标签'} `}
                showSearch
                allowClear
                getPopupContainer={() =>
                  document.getElementById('subSetModalContainer') as HTMLElement
                }
                style={{ width: 160 }}
                value={subSetType === 1 ? queryParams.pertainIndustry : queryParams.topicCode}
                onChange={(e) => {
                  handleChangeSelect(e, subSetType === 1 ? 'pertainIndustry' : 'topicCode');
                }}
                filterOption={(input, option) =>
                  (option!.children as unknown as string)
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              >
                {subSetType === 1
                  ? industryEnum.map((item) => (
                      <Option value={item.code} key={item.code}>
                        {item.name}
                      </Option>
                    ))
                  : topicCode.map((item) => (
                      <Option value={item.code} key={item.code}>
                        {item.name}
                      </Option>
                    ))}
              </Select>
              <Select
                placeholder="请选择所属领域"
                getPopupContainer={() => document.getElementById('action') as HTMLElement}
                showSearch
                allowClear
                style={{ width: 160 }}
                value={queryParams.domain}
                onChange={(e) => {
                  handleChangeSelect(e, 'domain');
                }}
                filterOption={(input, option) =>
                  (option!.children as unknown as string)
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              >
                {domain.map((item) => (
                  <Option value={item.code} key={item.code}>
                    {item.name}
                  </Option>
                ))}
              </Select>
              <Select
                placeholder="请选择使用技术"
                getPopupContainer={() => document.getElementById('action') as HTMLElement}
                showSearch
                allowClear
                value={queryParams.technology}
                onChange={(e) => {
                  handleChangeSelect(e, 'technology');
                }}
                style={{ width: 160 }}
                filterOption={(input, option) =>
                  (option!.children as unknown as string)
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              >
                {technology.map((item) => (
                  <Option value={item.code} key={item.code}>
                    {item.name}
                  </Option>
                ))}
              </Select>
              <Input
                suffix={<SearchOutlined onClick={handleSearch} />}
                style={{ width: 200 }}
                allowClear
                placeholder={`输入名称查询`}
                maxLength={20}
                onChange={(e) => {
                  setIptValue(e.target.value.trim());
                }}
                value={iptValue}
                onPressEnter={handleSearch}
              />
            </div>
          </div>
        }
        maskClosable={false}
        width={subSetType === 1 ? 980 : 892}
        onCancel={onCancel}
        centered={true}
        onOk={() => {
          if (!activePanel.length) {
            message.warning('请选择后再确认');
            return;
          }
          onOk(activePanel);
        }}
      >
        <div className={styles.content}>
          <div
            className={classNames(
              styles.main,
              subSetType === 1 ? styles.caseCard : styles.dataSetCard,
            )}
          >
            {dataSource.length ? (
              dataSource.map((item) =>
                subSetType === 1 ? (
                  <CaseCard
                    caseData={item}
                    checked={!!activePanel.find((ele) => ele.id === item.id)}
                    key={item.id}
                    onClick={() => {
                      handleChoosePanel(item);
                    }}
                  />
                ) : (
                  <DataSetCard
                    dataSetData={item}
                    key={item.id}
                    onClick={() => {
                      handleChoosePanel(item);
                    }}
                    checked={!!activePanel.find((ele) => ele.id === item.id)}
                  />
                ),
              )
            ) : (
              <Empty className={styles.empty} image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </div>
          <div className={styles.pagination}>
            <Pagination
              onChange={onPageNumChange}
              onShowSizeChange={onShowSizeChange}
              total={total}
              current={queryParams.pageNum}
              pageSize={queryParams.limit}
              showSizeChanger
              showQuickJumper
              pageSizeOptions={[6, 18, 36, 60]}
              showTotal={(t) => `总共 ${t} 条`}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Container;
