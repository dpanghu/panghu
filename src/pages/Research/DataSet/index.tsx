/**
 * 数据集
 * fuxueyan
 */
import screenSvg from '@/assets/images/reSearch/screen.svg';
import screensqSvg from '@/assets/images/reSearch/screensq.png';
import searchSvg from '@/assets/images/reSearch/search.svg';
import { getDataSetList } from '@/services/dataSet';
import { getScientificTagAll } from '@/services/research';
import { Input, Pagination, Tooltip, Tree } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { history, useSelector } from 'umi';
import ImportDataSet from './components/ImportDataSet';
import { DATA_VOLUME_VALUE, PURCHASE, RECOMMEND } from './components/contant';
import style from './index.less';
import icon_closeSvg from '@/assets/images/reSearch/icon-close.svg';

const DataSet = () => {
  const [isShowSearch, setIsShowSearch] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [domain, setDomain] = useState([]);
  const [industry, setIndustry] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [returnCount, setReturnCount] = useState(0);
  const [tagObj, setTagObj] = useState<any>({
    domain: '',
    industry: '',
    recommend: '',
    isPurchase: '',
  });
  const [searchArr, setSearchArr] = useState<any>([]);
  const [subject, setSubject] = useState([]);
  const [expandedKeys, setExpandKeys] = useState<React.Key[]>([]);
  const [isShowImportModal, setIsShowImportModal] = useState(false);
  // const [searchHeight, setSearchHeight] = useState<any>(0);
  const [params, setParams] = useState<any>({
    pageNum: 1,
    limit: 8,
    platform: 'bip3',
    industryLabel: '',
    domainLabel: '',
    name: '',
    isPropers: '',
    isPublish: '1',
    tagTypeEnum: 'subject',
    topicCode: '',
    isPurchase: '',
  });
  const jurisdictionModal = useSelector((store: any) => store.app)?.jurisdictionModal;
  const onSelect = (selectedKeys: any) => {
    setParams({ ...params, topicCode: selectedKeys.join(','), pagNum: 1 });
  };

  const getScientificTagAllDomainData = () => {
    getScientificTagAll({ tagTypeEnum: 'domain' }).then((res) => {
      setDomain(res);
    });
  };

  const getScientificTagAllIndustryData = () => {
    getScientificTagAll({ tagTypeEnum: 'industry' }).then((res) => {
      setIndustry(res?.filter((item: any) => !item.parentCode));
    });
  };

  const getScientificTagAllSubjectData = () => {
    getScientificTagAll({ tagTypeEnum: 'subject' }).then((res) => {
      const arr = res
        ?.filter((item: any) => !item.parentCode)
        ?.map((item: any) => ({
          title: item.name,
          key: item.code,
          children: [],
        }));
      arr?.map((item: any) => {
        res?.map((iitem: any) => {
          if (item.key === iitem.parentCode) {
            item.children.push({
              title: iitem.name,
              key: iitem.code,
            });
          }
        });
        return item;
      });

      setSubject(arr);
      setExpandKeys(arr.map((item: any) => item.key));
    });
  };

  const getDataSetListData = useCallback(() => {
    getDataSetList(params).then((res) => {
      setDataSource(res.data);
      setReturnCount(Number(res.total));
    });
  }, [params]);

  useEffect(() => {
    getDataSetListData();
  }, [getDataSetListData]);

  useEffect(() => {
    getScientificTagAllDomainData();
    getScientificTagAllIndustryData();
    getScientificTagAllSubjectData();
  }, []);

  const handleClickScreen = () => {
    setIsShowSearch(true);
  };
  const handleClickScreensq = () => {
    setIsShowSearch(false);
  };
  // useEffect(() => {
  //   let element: any = document.getElementById('searchShow');
  //   element.addEventListener('DOMNodeInserted', function () {
  //     let height = element.offsetHeight;
  //     setSearchHeight(height);
  //   });
  // }, []);

  // const items: any = [
  //   {
  //     key: '1',
  //     label: (
  //       <a className={style.menu} onClick={() => setIsShowImportModal(true)}>
  //         <IconFont type="icon-icon_import" style={{ marginRight: 8 }} />
  //         导入数据集
  //       </a>
  //     ),
  //   },
  // ];

  // const handleAdd = () => {
  //   history.push('/addDataSet');
  //   sessionStorage.setItem('detailObj', '');
  // };

  const getSearchArr = (id: string, name: string, type: string) => {
    let flag: boolean = false;

    searchArr.map((item: any) => {
      if (`${item.key}-${item.type}` === `${id}-${tagObj[type]}` || item.type === type) {
        flag = true;
      }
    });
    const index = searchArr.findIndex((item: any) => item.type === type);

    if (!flag) {
      searchArr.push({ key: id, name, type });
    } else {
      searchArr.splice(index, 1, { key: id, name, type });
    }
    setSearchArr([...searchArr]);
  };

  const handleClickTag = (type: string, id: string, name: string) => {
    tagObj[type] = id;
    setTagObj({ ...tagObj });
    if (type === 'domain') {
      setParams({ ...params, domainLabel: id, pageNum: 1 });
    } else if (type === 'industry') {
      setParams({ ...params, industryLabel: id, pageNum: 1 });
    } else if (type === 'recommend') {
      setParams({ ...params, isPropers: id, pageNum: 1 });
    } else {
      setParams({ ...params, isPurchase: id, pageNum: 1 });
    }
    getSearchArr(id, name, type);
  };

  const onChangePage = (page: number, pageSize: number) => {
    setParams({ ...params, pageNum: page, limit: pageSize });
  };

  const handleDelete = (index: number, type: string) => {
    searchArr.splice(index, 1);
    tagObj[type] = '-1';
    setTagObj({ ...tagObj });
    if (type === 'domain') {
      setParams({ ...params, domainLabel: '', pageNum: 1 });
    } else if (type === 'industry') {
      setParams({ ...params, industryLabel: '', pageNum: 1 });
    } else if (type === 'recommend') {
      setParams({ ...params, isPropers: '', pageNum: 1 });
    } else {
      setParams({ ...params, isPurchase: '', pageNum: 1 });
    }
  };

  const goDetail = (id: string) => {
    sessionStorage.setItem('dataSetId', id);
    sessionStorage.setItem('subject', JSON.stringify(subject));
    history.push('/dataSetDetail');
  };

  return (
    <div className={style.container}>
      <div className={style.content}>
        <div className={style.box}>
          <div className={style.header}>
            <span className={style.title}>数据集市</span>
            <div className={style.headerRight}>
              <Input
                placeholder="搜索"
                className={style.input}
                suffix={
                  <img
                    src={searchSvg}
                    className={style.search}
                    onClick={() => {
                      setParams({ ...params, name: inputValue });
                    }}
                  />
                }
                onChange={(e) => setInputValue(e.target.value.replace(/\s+/g, ''))}
                onPressEnter={() => {
                  setParams({ ...params, name: inputValue });
                }}
              />
              {/* <Dropdown menu={{ items }} overlayClassName={style.dropDown}>
                <Button type="primary" className={style.btn} onClick={handleAdd}>
                  <img src={require('@/assets/images/reSearch/add.png')} /> 新建数据集
                  <img src={require('@/assets/images/reSearch/dropDown.png')} />
                </Button>
              </Dropdown> */}
            </div>
          </div>
          <div className={style.box_content}>
            <div className={style.left}>
              <div className={style.left_title}>主题板块</div>
              <Tree
                onSelect={onSelect}
                treeData={subject}
                className={style.tree}
                onExpand={(e) => {
                  setExpandKeys(e);
                }}
                expandedKeys={expandedKeys as string[]}
              />
            </div>
            <div className={style.right}>
              <div className={style.screenContainer}>
                {/* <div className={style.screenLeft}>
                  <div className={style.screen} onClick={handleClickScreen}>
                    <img src={screenSvg} />
                    {isShowSearch ? '收起' : '展开'}筛选
                  </div> */}
                <div className={style.screenLeft}>
                  <div className={style.screen} onClick={handleClickScreen}>
                    <img src={screenSvg} />
                    筛选
                  </div>
                </div>
                <div className={style.select}>
                  {searchArr.map((item: any, index: number) => (
                    <span key={item.type}>
                      {item.name}
                      <img src={icon_closeSvg} onClick={() => handleDelete(index, item.type)} />
                    </span>
                  ))}
                </div>
                {/* </div>
                <div className={style.screenRight}>
                  <div className={style.screensq} onClick={handleClickScreen}>
                    {isShowSearch ? '收起' : '展开'}筛选
                    <img src={screenSvg} />
                  </div>
                </div> */}

                {isShowSearch && (
                  <div className={style.screenRight}>
                    <div className={style.screensq} onClick={handleClickScreensq}>
                      收起
                      <img src={screensqSvg} />
                    </div>
                  </div>
                )}
              </div>
              <div className={isShowSearch ? style.searchShow : style.search} id="searchShow">
                <div className={style.searchContent}>
                  <span>领域标签</span>
                  <div className={style.selected}>
                    <div
                      className={tagObj.domain === '' ? style.noLimitActive : style.noLimit}
                      onClick={
                        tagObj.domain === '' ? () => {} : () => handleClickTag('domain', '', '不限')
                      }
                    >
                      不限
                    </div>
                    {domain.map((item: any) => (
                      <div
                        key={item.id}
                        className={
                          tagObj.domain === item.code ? style.noLimitActive : style.noLimit
                        }
                        onClick={
                          tagObj.domain === item.code
                            ? () => {}
                            : () => handleClickTag('domain', item.code, item.name)
                        }
                      >
                        {item.name}
                      </div>
                    ))}
                  </div>
                </div>
                <div className={style.searchContent}>
                  <span>行业标签</span>
                  <div className={style.selected}>
                    <div
                      className={tagObj.industry === '' ? style.noLimitActive : style.noLimit}
                      onClick={
                        tagObj.industry === ''
                          ? () => {}
                          : () => handleClickTag('industry', '', '不限')
                      }
                    >
                      不限
                    </div>
                    {industry.map((item: any) => (
                      <div
                        key={item.id}
                        className={
                          tagObj.industry === item.code ? style.noLimitActive : style.noLimit
                        }
                        onClick={
                          tagObj.industry === item.code
                            ? () => {}
                            : () => handleClickTag('industry', item.code, item.name)
                        }
                      >
                        {item.name}
                      </div>
                    ))}
                  </div>
                </div>
                <div className={style.searchContent}>
                  <span>是否推荐</span>
                  {RECOMMEND.map((item) => (
                    <div
                      className={
                        tagObj.recommend === item.key ? style.noLimitActive : style.noLimit
                      }
                      key={item.key}
                      onClick={
                        tagObj.recommend === item.key
                          ? () => {}
                          : () => handleClickTag('recommend', item.key, item.name)
                      }
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
                {jurisdictionModal.online ? null : (
                  <div className={style.searchContent}>
                    <span>是否购买</span>
                    {PURCHASE.map((item) => (
                      <div
                        className={
                          tagObj.isPurchase === item.key ? style.noLimitActive : style.noLimit
                        }
                        key={item.key}
                        onClick={
                          tagObj.isPurchase === item.key
                            ? () => {}
                            : () => handleClickTag('isPurchase', item.key, item.name)
                        }
                      >
                        {item.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div
                className={style.dataSetContainer}
                // style={{
                //   height: isShowSearch ? `calc(100% - 108px - 100px)` : 'calc(100% - 97px)',
                // }}
              >
                {dataSource.map((item: any) => {
                  const domainArr = (item.domainLabel && JSON.parse(item.domainLabel)) || [];
                  const industryArr = (item.industryLabel && JSON.parse(item.industryLabel)) || [];
                  const arr = domainArr.concat(industryArr);

                  return (
                    <div className={style.dataSet} key={item.id} onClick={() => goDetail(item.id)}>
                      {jurisdictionModal?.online ? null : (
                        <div className={item.isPurchase ? style.noRelease : style.release}>
                          {item.isPurchase ? '未购买' : '已购买'}
                        </div>
                      )}

                      <div className={style.dataSet_title}>
                        <p title={item.name}>
                          {item.name.length > 15 ? item.name.slice(0, 15) + '...' : item.name}
                        </p>{' '}
                        {item.isPropers === 1 && <span>推荐</span>}
                      </div>
                      <div className={style.tag}>
                        <Tooltip
                          title={arr?.map((iitem: any) => (
                            <span key={iitem.code} className={style.span}>
                              {iitem.name}
                            </span>
                          ))}
                          overlayClassName={style.tooltip}
                        >
                          <div className={style.tagsel}>
                            {arr?.map((iitem: any) => (
                              <span className={style.span} key={iitem.code}>
                                {iitem.name}
                              </span>
                            ))}
                          </div>
                        </Tooltip>
                      </div>
                      <p className={style.text} title={item.datasetDesc}>
                        {item.datasetDesc}
                      </p>
                      <div className={style.platform}>
                        <span>使用平台：</span>
                        <span>{item.platform}</span>
                      </div>
                      <div className={style.dataCount}>
                        数据量：{DATA_VOLUME_VALUE[item.datasetVolume]}
                      </div>
                      <div className={style.endText}>
                        引用数据集：
                        {item?.referenceDatasets && JSON.parse(item?.referenceDatasets)[0]?.name}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className={style.footer}>
                <Pagination
                  total={returnCount}
                  current={params.pageNum}
                  pageSize={params.limit}
                  showSizeChanger
                  showQuickJumper
                  showTotal={(total) => `共 ${total} 个数据集`}
                  onChange={onChangePage}
                  pageSizeOptions={[8, 16, 32, 64]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <ImportDataSet
        open={isShowImportModal}
        onCancel={() => {
          setIsShowImportModal(false);
          getDataSetListData();
        }}
      />
    </div>
  );
};

export default DataSet;
