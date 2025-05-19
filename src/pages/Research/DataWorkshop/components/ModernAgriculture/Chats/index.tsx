import { Col, Empty, Input, Radio, Row } from 'antd';
import React, { useState } from 'react';
import ChatDualAxes from './ChatDualAxes';
import styles from './index.less';

interface Props {
  typeList: any;
  checkList: any;
  currentList: any;
  setCheckList: any;
  setTypeList: any;
  searchList: any;
}

// 其余代码同上
const handleSearch = (queryString: any, allMsg: any) => {
  let filterMsg: any = [];
  let queryStringArr = queryString.split('');
  let str = '(.*?)';
  filterMsg = [];
  let regStr = str + queryStringArr.join(str) + str;
  let reg = RegExp(regStr, 'i'); // 以mh为例生成的正则表达式为/(.*?)m(.*?)h(.*?)/i
  // console.log('regStr', regStr, reg);
  allMsg.map((item: any) => {
    if (reg.test(item)) {
      filterMsg.push(item);
    }
  });
  return filterMsg;
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
  const [searchValue, setSearchValue] = useState('');

  const AO1 =
    (currentList && checkList && currentList?.A0[checkList] && currentList?.A0[checkList]) || [];
  const AO2 =
    (currentList && checkList && currentList?.A1[checkList] && currentList?.A1[checkList]) || [];
  const AO3 =
    (currentList && checkList && currentList?.A2[checkList] && currentList?.A2[checkList]) || [];

  const handleBlur = () => {
    const newArr = handleSearch(searchValue, searchList);
    setTypeList(newArr);
  };

  const handleInputChange = (e: any) => {
    setSearchValue(e.target.value);
  };

  const onChange = (e: any) => {
    console.log('checked = ', e.target.value);
    setCheckList(e.target.value);
  };

  return (
    <div className={styles?.main}>
      <p className={styles?.secondTitle}>农产品贸易趋势</p>
      <div className={styles?.content}>
        <div className={styles?.contentLeft}>
          <div className={styles?.contentLeftInfo}>
            <Input
              placeholder="搜索"
              onChange={handleInputChange}
              onPressEnter={() => handleBlur()}
              style={{ width: '130px', marginBottom: '12px' }}
            />
            <Radio.Group onChange={onChange} value={checkList}>
              <Row>
                {(typeList &&
                  typeList.length > 0 &&
                  typeList.map((item: string) => (
                    <Col span={24} key={item}>
                      <Radio.Group onChange={onChange} value={item}></Radio.Group>
                      <Radio value={item}>{item}</Radio>
                    </Col>
                  ))) || (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    style={{ height: '530px', width: '140px', marginTop: '150px' }}
                  />
                )}
              </Row>
            </Radio.Group>
            {/* <Checkbox.Group style={{ width: '100%' }} onChange={onChange}>
              <Row>
                {typeList &&
                  typeList.length > 0 &&
                  typeList.map((item: string) => (
                    <Col span={24} key={item}>
                      <Checkbox value={item}>{item}</Checkbox>
                    </Col>
                  ))}
              </Row>
            </Checkbox.Group> */}
          </div>
        </div>
        <div style={{ flex: 1, width: '100%', marginLeft: '16px', height: 'calc(100% - 230px)' }}>
          <div>
            <div className={styles?.container}>
              <p className={styles?.secondTitle}>农产品贸易量</p>
              {(checkList && checkList.length > 0 && <ChatDualAxes data={AO1} />) || (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ height: '280px' }} />
              )}
            </div>
          </div>
          <div className={styles?.chatTwo}>
            <div className={styles.container}>
              <p className={styles?.secondTitle}>农产品贸易额</p>
              {(checkList && checkList.length > 0 && <ChatDualAxes data={AO2} />) || (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ height: '280px' }} />
              )}
            </div>
            <div className={styles.container} style={{ marginLeft: '12px' }}>
              <p className={styles?.secondTitle}>农产品贸易单价</p>
              {(checkList && checkList.length > 0 && <ChatDualAxes data={AO3} />) || (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ height: '280px' }} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Chats;
