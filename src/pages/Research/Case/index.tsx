/**
 * 数据集
 * fuxueyan
 */
import type { PaginationProps } from 'antd';
import { Input, Pagination, Tree, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import style from './index.less';
import { history, useDispatch, useSelector } from 'umi';
import { getScientificCaseAll, getScientificTagAll } from '@/services/research';
import { PURCHASE, RECOMMEND } from './config';
import { updateSessionStorage } from '@/utils/utils';
import { getCoverByIndex } from '../components/CoverModal';
import classNames from 'classnames';
import searchSvg from '@/assets/images/reSearch/search.svg';
import screenSvg from '@/assets/images/reSearch/screen.svg';
import icon_closeSvg from '@/assets/images/reSearch/icon-close.svg';

const Case = () => {
  const [isShowSearch, setIsShowSearch] = useState(true);
  const [domain, setDomain] = useState([]);
  const [technology, setTechnology] = useState([]);
  const [caseData, setCaseData] = useState<RecordItem>([]);
  const [total, setTotal] = useState<number>(0);
  const [caseName, setCaeName] = useState<string>('');
  const [subject, setSubject] = useState([]);
  const [queryParams, setQueryParams] = useState({
    casesName: '',
    pageNum: 1,
    limit: 24,
    pertainIndustry: '',
    pertainDomain: '',
    involvingTechnology: '',
    isPropose: '',
    casesState: '1',
    isPurchase: '',
  });
  const [tagObj, setTagObj] = useState<any>({});
  const [searchArr, setSearchArr] = useState<any>([]);
  const jurisdictionModal = useSelector((store: any) => store.app)?.jurisdictionModal;

  const dispatch = useDispatch();

  const onSelect = (selectedKeys: any) => {
    setQueryParams({ ...queryParams, pertainIndustry: selectedKeys.join(','), pageNum: 1 });
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
      setQueryParams({ ...queryParams, isPurchase: id, pageNum: 1 });
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
      case 'isPurchase':
        setQueryParams({
          ...queryParams,
          pageNum: 1,
          isPurchase: '',
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
    console.log('params', params);
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

  return (
    <div className={style.container}>
      <Header oneTitle="科研广场" seTitle="案例列表" oneRoutePath="/scientificSquare" />
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
              {/* <Button
                type="primary"
                className={style.btn}
                onClick={() => {
                  updateSessionStorage('case', {});
                  history.push('/addCase');
                }}
              >
                <img src={require('@/assets/images/reSearch/add.png')} /> 新建案例
              </Button> */}
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
                        <img src={icon_closeSvg} onClick={() => handleDelete(index, item.type)} />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className={isShowSearch ? style.searchShow : style.search}>
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
                style={{
                  height: isShowSearch ? 'calc(100% - 120px - 152px)' : 'calc(100% - 120px)',
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
                      {jurisdictionModal?.online ? null : (
                        <div
                          className={classNames(
                            style.release,
                            !item.isPurchase && style.notRelease,
                          )}
                        >
                          {item.isPurchase ? '已购买' : '未购买'}
                        </div>
                      )}
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

export default Case;
