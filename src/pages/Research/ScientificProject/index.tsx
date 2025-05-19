import addPng from '@/assets/images/reSearch/add.png';
import searchSvg from '@/assets/images/reSearch/search.svg';
import { getScProjectList } from '@/services/scientificProject';
import { updateSessionStorage } from '@/utils/utils';
import { Button, Input, Pagination, Select, Tooltip } from 'antd';
import Cookies from 'js-cookie';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { history } from 'umi';
import { projectCover } from './components/AddScientificProject';
import styles from './index.less';
import selectSvg from '@/assets/images/selectSvg.svg';
import paginationBtn from '@/assets/images/pagination_btn.svg';
const Container = () => {
  const [params, setParams] = useState<any>({
    pageNum: 1,
    limit: 4,
    projectEnv: '',
    publicStatus: '',
    name: '',
    closeStatus: '',
  });
  const [returnCount, setReturnCount] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const roleAudit = ['TEACHER', 'TEACHER_KY'].includes(Cookies.get('memberType') as string);
  const isAdmin = Cookies.get('memberType') === 'SCHOOL_ADMINISTRATOR';

  const SEARCH = [
    { key: '', name: '全部' },
    { key: '0', name: '进行中' },
    { key: '1', name: '已结项' },
  ];

  const STATUS: any = {
    0: '进行中',
    1: '已结项',
  };

  const handleClickTag = (tag: string) => {
    setParams({ ...params, closeStatus: tag });
  };

  const getScProjectListData = () => {
    if (isAdmin) {
      params.memberId = '';
    }
    getScProjectList(params).then((res) => {
      setReturnCount(res.total);
      setDataSource(res.data);
    });
  };

  useEffect(() => {
    getScProjectListData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  // 分页方法
  const onChangePage = (page: number, pageSize: number) => {
    setParams({ ...params, pageNum: page, limit: pageSize });
  };

  // 选择下拉
  const onChangeSelect = (e: any, type: string) => {
    if (type === 'env') {
      setParams({ ...params, projectEnv: e });
    } else {
      setParams({ ...params, publicStatus: e });
    }
  };

  useEffect(() => {
    updateSessionStorage('scientificProject', {});
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.title}>课题组</span>
          <div className={styles.right}>
            <Input
              placeholder="搜索"
              className={styles.input}
              suffix={
                <img
                  style={{ cursor: 'pointer' }}
                  src={searchSvg}
                  onClick={() => {
                    setParams({ ...params, name: inputValue });
                  }}
                />
              }
              onChange={(e) => setInputValue(e.target.value)}
              onPressEnter={() => {
                setParams({ ...params, name: inputValue });
              }}
              maxLength={30}
            />
            {roleAudit && (
              <Button
                type="primary"
                className={styles.btn}
                style={{ fontSize: 16 }}
                onClick={() => {
                  updateSessionStorage('case', {});
                  updateSessionStorage('dataSet', {});
                  history.push('/addScientificProject');
                }}
              >
                <img src={addPng} /> 新建课题组
              </Button>
            )}
          </div>
        </div>
        <div className={styles.box}>
          <div className={styles.search}>
            <div className={styles.left}>
              {SEARCH.map((item) => (
                <span
                  key={item.key}
                  onClick={() => handleClickTag(item.key)}
                  className={params.closeStatus === item.key ? styles.active : ''}
                >
                  {item.name}
                </span>
              ))}
            </div>
            <div>
              <Select
                placeholder="请选择课题组环境"
                className={styles.envior}
                onChange={(e) => onChangeSelect(e, 'env')}
                allowClear
                style={{ width: 185 }}
                suffixIcon={<img src={selectSvg} />}
              >
                <Select.Option key="BIP3" value="BIP3">
                  BIP3
                </Select.Option>
              </Select>
              <Select
                placeholder="请选择是否已公开"
                className={styles.open}
                onChange={(e) => onChangeSelect(e, 'public')}
                allowClear
                suffixIcon={<img src={selectSvg} />}
              >
                <Select.Option key="1">是</Select.Option>
                <Select.Option key="0">否</Select.Option>
              </Select>
            </div>
          </div>
          <div className={styles.listBox}>
            <div className={styles.list}>
              {dataSource.map((item: any) => {
                let dataset = '';
                if (item.subSetType === 2) {
                  item.subSet?.map((key: any) => {
                    if (dataset) {
                      dataset += '、';
                    }
                    dataset += key.subSetName;
                  });
                }
                const caseName =
                  item.subSet?.[0]?.subSetName.length > 10
                    ? item.subSet?.[0]?.subSetName.slice(0, 10) + '...'
                    : item.subSet?.[0]?.subSetName;
                const datasetName = dataset.length > 10 ? dataset.slice(0, 10) + '...' : dataset;
                return (
                  <div
                    className={styles.project}
                    key={item.id}
                    onClick={() => {
                      updateSessionStorage('scientificProject', item);
                      history.push('/scientificProjectDetail');
                    }}
                  >
                    <span className={item.publicStatus === 0 ? styles.status : styles.statused}>
                      {item.publicStatus === 0 ? '未公开' : '已公开'}
                    </span>
                    <img
                      src={projectCover[item.projectCover || 0]?.cover}
                      className={styles.leftImg}
                    />
                    <div>
                      <div className={styles.title} title={item.name}>
                        {item.name.length > 30 ? item.name.slice(0, 30) + '...' : item.name}
                        <span className={item.closeStatus === 0 ? styles.span : styles.spaned}>
                          {STATUS[item.closeStatus]}
                        </span>
                      </div>
                      <p title={item.note}>
                        {item.note.length > 100 ? item.note.slice(0, 100) + '...' : item.note}
                      </p>
                      <div className={styles.bottom}>
                        <div>
                          课题组环境：<span>{item.projectEnv}</span>
                        </div>
                        <div>
                          引用资源：
                          {item.subSetType === 1 ? (
                            <Tooltip
                              title={item.subSet?.[0]?.subSetName}
                              overlayClassName={styles.tooltip}
                            >
                              <span>{caseName}</span>
                            </Tooltip>
                          ) : datasetName.length > 10 ? (
                            <Tooltip
                              title={item.subSet?.map((key: any) => (
                                <div key={key.id}>{key.subSetName}</div>
                              ))}
                              overlayClassName={styles.tooltip}
                            >
                              <span>{datasetName}</span>
                            </Tooltip>
                          ) : (
                            <span>{datasetName}</span>
                          )}
                        </div>
                        <div>
                          开始时间：
                          <span>{moment(Number(item.createTime)).format('YYYY-MM-DD')}</span>
                        </div>
                        <div>
                          管理员：
                          <span title={item.leaderName}>
                            {item.leaderName.length > 10
                              ? item.leaderName.slice(0, 10) + '...'
                              : item.leaderName}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {returnCount > 0 && (
              <div className={styles.footer}>
                <Pagination
                  total={returnCount}
                  current={params.pageNum}
                  pageSize={params.limit}
                  showSizeChanger
                  // showQuickJumper
                  showTotal={(total) => `共 ${total} 个课题组`}
                  onChange={onChangePage}
                  pageSizeOptions={[4, 8, 16, 32, 64]}
                  itemRender={(page, type, originalElement) => {
                    if (type === 'prev') {
                      return (
                        <img
                          style={{
                            display: 'inline-block',
                            transform: 'rotate(180deg)',
                          }}
                          src={paginationBtn}
                        />
                      );
                    }
                    if (type === 'next') {
                      return <img src={paginationBtn} />;
                    }
                    return originalElement;
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Container;
