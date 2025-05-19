import { Empty, Input, Radio, Tree } from 'antd';
import React, { useMemo, useState } from 'react';
import ChartBar from './ChartBar';
import ChatLine from './ChartLine';
// import ChartPie from './ChartPie';
import CircleColumn from './CircleColumn';
import styles from './index.less';
import SingleDualAxes from './SingleDualAxes';
import { cloneDeep } from 'lodash-es';

interface Props {
  typeList: any;
  checkList: any;
  currentList: any;
  setCheckList: any;
  setTypeList: any;
  searchList: any;
}

const handleMajorsList = (data: RecordItem[]) => {
  if (data && data.length !== 0) {
    return data.map((item) => {
      const result: RecordItem = {};
      result.value = item.id;
      result.label = item.name;
      result.title = item.name;
      // result.id = item.id;
      result.key = item.id;
      if (item.children) {
        result.children = handleMajorsList(item.children);
      }
      return result;
    });
  }
  return data;
};
const defaultData: any[] = [];

const dataList: { key: React.Key; title: string }[] = [];
const generateList = (data: any[]) => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const { key } = node;
    dataList.push({ key, title: key as string });
    if (node.children) {
      generateList(node.children);
    }
  }
};
generateList(defaultData);

const getParentKey = (key: React.Key, tree: any[]): React.Key => {
  let parentKey: React.Key;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some((item: any) => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey!;
};

const Chats: React.FC<Props> = (props: Props) => {
  const {
    typeList,
    checkList = [],
    currentList = [],
    searchList,
    setTypeList,
    setCheckList,
  } = props;
  // const [searchTreeValue, setSearchValue] = useState('');
  const [size, setSize] = useState<any>('small');
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [searchTreeValue, setSearchTreeValue] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [selectedKeys, setSelectedKeys] = useState(['']);
  const [currentA2, setCurrentA2] = useState([]);

  const A2 =
    (currentList?.A2 &&
      currentList?.A2?.A2DataList.length > 0 &&
      currentList?.A2?.A2DataList.map((item: RecordItem) => ({
        ...item,
        value: Number(item.value || 0),
        // structure: enumData[item.structure],
      }))) ||
    [];

  // console.log('502752057', size);
  const getArea = (name: string) => {
    const area1 = currentList?.A3?.areaBarList.map((item: any) => ({
      value: item[`${name}播种面积(千公顷)`],
      key: item['年份'],
      type: `${name}播种面积(千公顷)`,
    }));

    const area2 = currentList?.A3?.areaLineList.map((item: any) => ({
      value: item[`${name}播种面积(千公顷)`],
      key: item['年份'],
      type: `${name}播种面积(千公顷)增长率`,
    }));

    const newObj = {
      barList: area1,
      lineList: area2,
    };
    return newObj;
  };

  const getOutput = (name: string) => {
    const output1 = currentList?.A3?.outputBarList.map((item: any) => ({
      value: item[`${name}产量(万吨)`],
      key: item['年份'],
      type: `${name}产量(万吨)`,
    }));
    const output2 = currentList?.A3?.outputLineList.map((item: any) => ({
      value: item[`${name}产量(万吨)`],
      key: item['年份'],
      type: `${name}产量(万吨)增长率`,
    }));
    const newObj = {
      barList: output1,
      lineList: output2,
    };
    return newObj;
  };

  const getPerUnitYieldBarList = (name: string) => {
    const output1 = currentList?.A3?.perUnitYieldBarList.map((item: any) => ({
      value: item[`${name}单位面积产量(公斤/公顷)`],
      key: item['年份'],
      type: `${name}单位面积产量(公斤/公顷)`,
    }));
    return output1;
  };

  const AO1 = (currentList && checkList && getArea(checkList)) || [];
  const AO2 = (currentList && checkList && getOutput(checkList)) || [];
  const AO3 = (currentList && checkList && getPerUnitYieldBarList(checkList)) || [];

  // console.log('checkList', getArea(checkList), getPerUnitYieldBarList(checkList), currentList?.A3);

  const onExpand = (newExpandedKeys: React.Key[]) => {
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
  };

  const onChTreeange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // console.log('value', value);
    const newExpandedKeys = dataList
      .map((item: any) => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, defaultData);
        }
        return null;
      })
      .filter((item: any, i: any, self: any) => item && self.indexOf(item) === i);
    setExpandedKeys(newExpandedKeys as React.Key[]);
    setSearchTreeValue(value);
    setAutoExpandParent(true);
  };

  // const handleBlur = () => {
  //   const newArr = handleSearch(searchTreeValue, searchList);
  //   setTypeList(newArr);
  // };

  // const handleInputChange = (e: any) => {
  //   setSearchValue(e.target.value);
  // };

  const onChange = (e: any) => {
    setSize(e.target.value);
    const sizeList =
      currentList?.A2?.A2DataList &&
      currentList?.A2?.A2DataList.filter((item: any) => item.type === e.target.value);
    setCurrentA2(sizeList || []);
  };

  // 选中树
  const handleTreeSelect = (e: any, key: any) => {
    // console.log(e, key);
    setSelectedKeys([e.key]);
    // const newArr = handleSearch(e.node.label, searchList);
    // setTypeList(newArr);
    setCheckList(e.label);
  };

  const treeData = useMemo(() => {
    const loop = (data: any[]): any[] =>
      data.map((item) => {
        const strTitle = item.title as string;
        const index = strTitle.indexOf(searchTreeValue);
        const beforeStr = strTitle.substring(0, index);
        const afterStr = strTitle.slice(index + searchTreeValue.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span className="site-tree-search-value">{searchTreeValue}</span>
              {afterStr}
            </span>
          ) : (
            <span>{strTitle}</span>
          );
        if (item.children) {
          return { title, key: item.key, children: loop(item.children) };
        }

        return {
          title,
          key: item.key,
        };
      });

    return loop(handleMajorsList(cloneDeep(searchList)) || []);
  }, [searchTreeValue]);

  console.log(treeData);
  return (
    <div className={styles?.main}>
      <p className={styles?.secondTitle}>农产品生产水平分析</p>
      <div className={styles?.content}>
        <div className={styles?.contentLeft}>
          <div className={styles?.contentLeftInfo}>
            {/* <Input
              placeholder="搜索"
              onChange={handleInputChange}
              onPressEnter={() => handleBlur()}
              style={{ width: '130px', marginBottom: '12px' }}
            /> */}
            <Input.Search
              // value={searchTreeValue}
              style={{ marginBottom: 8 }}
              placeholder="请输入"
              onChange={onChTreeange}
            />
            {handleMajorsList(cloneDeep(searchList)) &&
              handleMajorsList(cloneDeep(searchList)).length > 0 && (
                <Tree
                  onExpand={onExpand}
                  expandedKeys={expandedKeys}
                  autoExpandParent={autoExpandParent}
                  selectedKeys={selectedKeys}
                  onSelect={(keys: any[], e: RecordItem) => {
                    handleTreeSelect(e.node, keys[0]);
                  }}
                  // treeData={handleMajorsList(cloneDeep(searchList))}
                  treeData={handleMajorsList(cloneDeep(searchList))}
                />
              )}
          </div>
        </div>
        <div className={styles?.contentRight}>
          <div className={styles?.product}>
            <div className={styles?.productLeft}>
              <div className={styles.container} style={{ height: '330px' }}>
                <p className={styles?.secondTitle}>农产品产量</p>
                {/* <SingleDualAxes /> */}
                {(checkList && checkList.length > 0 && <SingleDualAxes data={AO1} />) || (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ height: '330px' }} />
                )}
              </div>
              <div className={styles.container} style={{ height: '330px' }}>
                <p className={styles?.secondTitle}>农产品种植面积</p>
                {(checkList && checkList.length > 0 && <SingleDualAxes data={AO2} />) || (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ height: '330px' }} />
                )}
              </div>
            </div>
            <div className={styles?.productRight}>
              <div className={styles.container} style={{ height: '668px' }}>
                <p className={styles?.secondTitle}>单位面积产量</p>
                {(checkList && checkList.length > 0 && <ChartBar data={AO3} />) || (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ height: '300px' }} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <p className={styles?.secondTitle}>农产品生产结构分析</p> */}
      {/* <div className={styles?.chatTwo}>
        <div className={styles.container}>
          <p>农产品产量分布</p>
          <ChartPie />
        </div>
        <div className={styles.container} style={{ marginLeft: '12px' }}>
          <p>农产品种植面积分布</p>
          <ChartPie />
        </div>
      </div> */}
      <p className={styles?.secondTitle} style={{ marginBottom: '10px' }}>
        农产品市场交易情况
      </p>
      <div>
        <Radio.Group value={size} onChange={onChange} style={{ marginBottom: 16 }}>
          {currentList?.A2?.title &&
            currentList?.A2?.title.length > 0 &&
            currentList?.A2?.title.map((item: any, index: number) => (
              <Radio.Button
                key={index}
                value={item}
                style={{ marginLeft: '10px', marginBottom: '6px' }}
              >
                {item}
              </Radio.Button>
            ))}
        </Radio.Group>
      </div>
      <div className={styles?.chatTwo}>
        <div className={styles.container} style={{ height: '490px' }}>
          <p className={styles?.secondTitle}>价格指数分析</p>
          {((A2.length > 0 || currentA2.length > 0) && (
            <ChatLine data={currentA2.length > 0 ? currentA2 : A2} />
          )) || <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ height: '330px' }} />}
        </div>
      </div>
      <div className={styles?.chatTwo}>
        <div className={styles.container} style={{ height: '360px' }}>
          <p className={styles?.secondTitle}>农产品人均分析</p>
          {/* <CircleColumn data={currentList.A0} /> */}
          {(currentList?.A0 && <CircleColumn data={currentList.A0} />) || (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ height: '330px' }} />
          )}
        </div>
        <div className={styles.container} style={{ height: '360px', marginLeft: '12px' }}>
          <p className={styles?.secondTitle}>交易市场金额分析</p>
          {(currentList?.A1 && <SingleDualAxes data={currentList.A1} />) || (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ height: '330px' }} />
          )}
        </div>
      </div>
    </div>
  );
};
export default Chats;
