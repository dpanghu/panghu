/**
 * 数据集
 * fuxueyan
 */
import addPng from '@/assets/images/reSearch/add.png';
import iconCloseSvg from '@/assets/images/reSearch/icon-close.svg';
import screenSvg from '@/assets/images/reSearch/screen.svg';
import searchSvg from '@/assets/images/reSearch/search.svg';
import { getScientificCaseAll, getScientificTagAll } from '@/services/research';
import { updateSessionStorage } from '@/utils/utils';
import type { PaginationProps } from 'antd';
import { Button, Input, Pagination, Tooltip, Tree } from 'antd';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { history, useDispatch } from 'umi';
import { getCoverByIndex } from './components/CoverModal';
import Header from './components/Header';
import style from './index.less';
import { PUBLISH, RECOMMEND } from './contant';

const DataSet = () => {
  const [isShowSearch, setIsShowSearch] = useState(true);
  const [domain, setDomain] = useState([]);
  const [technology, setTechnology] = useState([]);
  const [caseData, setCaseData] = useState<RecordItem>([]);
  const [total, setTotal] = useState<number>(0);
  const [caseName, setCaeName] = useState<string>('');
  const [subject, setSubject] = useState([]);
  // const [labels, setLabels] = useState<any>([]);
  const [searchHeight, setSearchHeight] = useState<any>(0);

  const [queryParams, setQueryParams] = useState({
    casesName: '',
    pageNum: 1,
    limit: 24,
    pertainIndustry: '',
    pertainDomain: '',
    involvingTechnology: '',
    isPropose: '',
    casesState: '',
  });
  const [tagObj, setTagObj] = useState<any>({});
  const [searchArr, setSearchArr] = useState<any>([]);

  const dispatch = useDispatch();

  const onSelect = (selectedKeys: any) => {
    setQueryParams({
      ...queryParams,
      pertainIndustry: selectedKeys.join(','),
      pageNum: 1,
    });
  };

  const getScientificTagAllDomainData = () => {
    getScientificTagAll({ tagTypeEnum: 'domain' }).then((res) => {
      setDomain(res);
    });
  };

  const getScientificTagAllIndustryData = () => {
    getScientificTagAll({ tagTypeEnum: 'technology' }).then((res) => {
      setTechnology(res);
    });
  };

  const handleSearch = () => {
    setQueryParams({
      ...queryParams,
      casesName: caseName,
      pageNum: 1,
    });
  };

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
      setQueryParams({ ...queryParams, pertainDomain: id, pageNum: 1 });
    } else if (type === 'technology') {
      setQueryParams({ ...queryParams, involvingTechnology: id, pageNum: 1 });
    } else if (type === 'recommend') {
      setQueryParams({ ...queryParams, isPropose: id, pageNum: 1 });
    } else {
      setQueryParams({ ...queryParams, casesState: id, pageNum: 1 });
    }
    getSearchArr(id, name, type);
  };

  const getScientificTagAllData = () => {
    getScientificTagAll({ tagTypeEnum: 'industry' }).then((res) => {
      const arr = res
        .filter((item: any) => !item.parentCode)
        .map((item: any) => ({
          title: item.name,
          key: item.code,
          id: item.id,
          //   disabled: true,
          children: [],
        }));
      arr.map((item: any) => {
        res.map((iitem: any) => {
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
    });
  };

  const queryCaseData = async () => {
    const result = await getScientificCaseAll({
      ...queryParams,
    });
    setCaseData(result.data);
    setTotal(result.total);
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

  const handleDelete = (index: number, type: string) => {
    switch (type) {
      case 'domain':
        setQueryParams({
          ...queryParams,
          pageNum: 1,
          pertainDomain: '',
        });
        break;
      case 'technology':
        setQueryParams({
          ...queryParams,
          pageNum: 1,
          involvingTechnology: '',
        });
        break;
      case 'recommend':
        setQueryParams({
          ...queryParams,
          pageNum: 1,
          isPropose: '',
        });
        break;
      case 'publish':
        setQueryParams({
          ...queryParams,
          pageNum: 1,
          casesState: '',
        });
        break;
      default:
        break;
    }
    searchArr.splice(index, 1);
    tagObj[type] = '-1';
    setSearchArr([...searchArr]);
    setTagObj({ ...tagObj });
  };

  // 选择课程
  const handleChooseContent = (params: RecordItem) => {
    dispatch({
      type: 'case/update',
      payload: {
        caseCode: params.casesCode,
      },
    });
    console.log('paramsparamsparamsparams', params);
    updateSessionStorage('case', params);
    history.push('/viewCase');
  };

  useEffect(() => {
    queryCaseData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams]);

  useEffect(() => {
    getScientificTagAllData();
    getScientificTagAllDomainData();
    getScientificTagAllIndustryData();
  }, []);

  useEffect(() => {
    let element: any = document.getElementById('searchShow');
    if (element) {
      let height = element.offsetHeight;
      setSearchHeight(height);
    }
  }, []);

  return (
    <div className={style.container}>
      <Header seTitle="案例设置" oneRoutePath="/configIndex" />
      <div className={style.content}>
        <div className={style.box}>
          <div className={style.header}>
            <span className={style.title}>案例设置</span>
            <div className={style.headerRight}>
              <Input
                onChange={(e) => {
                  setCaeName(e.target.value.trim());
                }}
                placeholder="搜索最多30字符"
                className={style.input}
                onPressEnter={handleSearch}
                value={caseName}
                style={{ width: 275 }}
                maxLength={30}
                suffix={<img src={searchSvg} onClick={handleSearch} />}
              />
              <Button
                type="primary"
                className={style.btn}
                onClick={() => {
                  updateSessionStorage('case', {});
                  history.push('/addCase');
                }}
              >
                <img src={addPng} /> 新建案例
              </Button>
            </div>
          </div>
          <div className={style.box_content}>
            <div className={style.left}>
              <div className={style.left_title}>行业</div>
              <Tree onSelect={onSelect} treeData={subject} className={style.tree} />
            </div>
            <div className={style.right}>
              <div className={style.screenContainer}>
                <div className={style.screenLeft}>
                  <div className={style.screen} onClick={() => setIsShowSearch(!isShowSearch)}>
                    <img src={screenSvg} />
                    {isShowSearch ? '收起' : '展开'}筛选
                  </div>
                  {/* {isShowSearch && (
                    <div className={style.select}>
                      {searchArr.map((item: any, index: number) => (
                        <span key={item.type}>
                          {item.name}{' '}
                          <img
                            src={require('@/assets/images/reSearch/icon-close.svg')}
                            onClick={() => handleDelete(index, item.type)}
                          />
                        </span>
                      ))}
                    </div>
                  )} */}
                  <div className={style.select}>
                    {searchArr.map((item: any, index: number) => (
                      <span key={item.type}>
                        {item.name}{' '}
                        <img src={iconCloseSvg} onClick={() => handleDelete(index, item.type)} />
                      </span>
                    ))}
                  </div>
                </div>
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
                  <span>技术标签</span>
                  <div className={style.selected}>
                    <div
                      className={tagObj.technology === '' ? style.noLimitActive : style.noLimit}
                      onClick={
                        tagObj.technology === ''
                          ? () => {}
                          : () => handleClickTag('technology', '', '不限')
                      }
                    >
                      不限
                    </div>
                    {technology.map((item: any) => (
                      <div
                        key={item.id}
                        className={
                          tagObj.technology === item.code ? style.noLimitActive : style.noLimit
                        }
                        onClick={
                          tagObj.technology === item.code
                            ? () => {}
                            : () => handleClickTag('technology', item.code, item.name)
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
                <div className={style.searchContent}>
                  <span>是否发布</span>
                  {PUBLISH.map((item) => (
                    <div
                      className={tagObj.publish === item.key ? style.noLimitActive : style.noLimit}
                      key={item.key}
                      onClick={
                        tagObj.publish === item.key
                          ? () => {}
                          : () => handleClickTag('publish', item.key, item.name)
                      }
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
              </div>
              <div
                className={style.dataSetContainer}
                style={{
                  height: isShowSearch
                    ? `calc(100% - 150px - ${searchHeight}px)`
                    : 'calc(100% - 97px)',
                }}
              >
                {caseData.map((item: RecordItem) => (
                  <div
                    className={style.caseContent}
                    key={item.id}
                    onClick={() => {
                      handleChooseContent(item);
                    }}
                  >
                    <div className={style.caseTop}>
                      <img src={getCoverByIndex(item.casesCover)} alt="" />
                      <div
                        className={classNames(style.release, !item.casesState && style.notRelease)}
                      >
                        {item.casesState ? '已发布' : '未发布'}
                      </div>
                      <div className={style.caseTag}>
                        <Tooltip
                          title={[
                            ...JSON.parse(item?.pertainDomain || '[]').flat(),
                            ...JSON.parse(item?.involvingTechnology || '[]').flat(),
                          ].map((ele: RecordItem) => (
                            <span key={ele.code} className={style.span}>
                              {ele.name}
                            </span>
                          ))}
                          overlayClassName={style.tooltip}
                        >
                          <div className={style.tagsel}>
                            {[
                              ...JSON.parse(item?.pertainDomain || '[]').flat(),
                              ...JSON.parse(item?.involvingTechnology || '[]').flat(),
                            ].map((ele: RecordItem) => (
                              <span key={ele.code}>{ele.name}</span>
                            ))}
                          </div>
                        </Tooltip>
                      </div>
                    </div>
                    <div className={style.caseBottom}>
                      <div className={style.caseTitle}>
                        <span title={item.casesName}>{item.casesName}</span>
                        {!!item.isPropose ? <span>推荐</span> : <i />}
                      </div>
                      <p className={style.firstP} title={item.casesDesc}>
                        {item.casesDesc}
                      </p>
                      <p>使用平台：YonBIP 3</p>
                      <p>引用案例：{item.platformCasesName}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className={style.footer}>
                <Pagination
                  onChange={onPageNumChange}
                  onShowSizeChange={onShowSizeChange}
                  total={total}
                  current={queryParams.pageNum}
                  pageSize={queryParams.limit}
                  showSizeChanger
                  showQuickJumper
                  pageSizeOptions={[24, 48, 72, 120]}
                  showTotal={(t) => `总共 ${t} 条案例`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataSet;
