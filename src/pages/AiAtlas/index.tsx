// ai图谱
import PageLoading from '@/components/PageLoading';
import {
  extractKnowledge,
  generateAtlas,
  getAtlasHistory,
  getRandomCase,
} from '@/services/aiAtlas';
import { getConvertParamId } from '@/services/aiJobHunt';
import { useMount, useReactive } from 'ahooks';
import { useRef } from 'react';
import KnowledgeGraph from './KnowledgeGraph';
import KnowledgeMsg from './KnowledgeMsg';
import TextContent from './TextContent';
import Empty from './components/Empty';
import Loading from './components/Loading';
import { CREATE_STATUS, EXTRACT_STATUS, PluginCode } from './constants';
import styles from './index.less';
import { AtlasInfo, GraphDataType, TableDataType } from './type';

type IState = {
  data: null | AtlasInfo;
  loading: boolean;
  extractLoading: boolean;
  graphLoading: boolean;
  graphData: GraphDataType | null;
};

const AiAtlas = ({}) => {
  const state = useReactive<IState>({
    data: null,
    loading: true,
    extractLoading: false,
    graphLoading: false,
    graphData: null,
  });

  const randomId = useRef<string>('');

  // 生成图谱
  const generateGraph = (graphData: TableDataType[]) => {
    const edges: GraphDataType['edges'] = [];
    const nodes: GraphDataType['nodes'] = [];
    graphData.forEach((item) => {
      let sourceNode = nodes.find((node) => node.label === item.entity1);
      if (!sourceNode) {
        sourceNode = {
          id: item.entity1,
          label: item.entity1,
          level: 0,
        };
        nodes.push(sourceNode);
      }
      let targetNode = nodes.find((node) => node.label === item.entity2);
      if (!targetNode) {
        nodes.push({
          id: item.entity2,
          label: item.entity2,
          level: sourceNode.level + 1,
        });
      }
      edges.push({
        source: item.entity1,
        target: item.entity2,
        label: item.rel,
      });
    });
    state.graphData = {
      nodes,
      edges,
    };
    setTimeout(() => {
      state.graphLoading = false;
    }, 1000);
  };

  useMount(() => {
    const queryParams = JSON.parse(
      // @ts-ignore
      window.sessionStorage.getItem('queryParams'),
    );
    getConvertParamId(queryParams)
      .then((id) => {
        window.sessionStorage.setItem(
          'queryParams',
          JSON.stringify({ ...queryParams, paramId: id }),
        );
        getAtlasHistory().then((rst) => {
          if (rst) {
            state.data = rst;
            if (rst.createState === CREATE_STATUS.GENERATED) {
              generateGraph(JSON.parse(rst.info));
            }
          }
        });
        state.loading = false;
      })
      .catch(() => {
        state.loading = false;
      });
  });

  // 抽取知识
  const extractMsg = (userMessage: string) => {
    state.extractLoading = true;
    state.data = {
      ...state.data,
      extractState: EXTRACT_STATUS.SUCCESS,
      createState: CREATE_STATUS.UNGENERATED,
    };
    if (userMessage) {
      extractKnowledge({
        userMessage,
        pluginCode: PluginCode,
        id: state?.data?.id || '',
      })
        .then((rst) => {
          if (rst) {
            state.data!.info = rst.info;
          }
          state.extractLoading = false;
        })
        .catch(() => {
          state.extractLoading = false;
        });
    }
  };

  // 随机示例
  const createRandomCase = () => {
    state.data = {
      ...state.data,
      createState: CREATE_STATUS.UNGENERATED,
    };
    setTimeout(() => {
      getRandomCase({ id: randomId.current, pluginCode: PluginCode }).then(
        (rst) => {
          randomId.current = rst.id;
          state.data = rst;
          generateGraph(JSON.parse(state.data!.info));
        },
      );
    }, 0);
  };

  return (
    <div className={styles['container']}>
      <header>AI图谱生成</header>
      {state.loading ? (
        <PageLoading />
      ) : (
        <section>
          <div className={styles['area-content']}>
            <div className={styles['area-text-body']}>
              <div className={styles['area-text']}>
                <TextContent
                  isFirst={!state.data?.content}
                  content={state.data?.content || ''}
                  createRandomCase={createRandomCase}
                  extractMsg={extractMsg}
                  extractLoading={state.extractLoading}
                />
              </div>
              <div className={styles['area-knowledge']}>
                <KnowledgeMsg
                  extractLoading={state.extractLoading}
                  knowledgeInfo={
                    state.data?.extractState === EXTRACT_STATUS.SUCCESS
                      ? state.data?.info || ''
                      : ''
                  }
                  generateGraph={(data) => {
                    state.graphLoading = true;
                    generateAtlas({
                      id: state.data?.id,
                      info: JSON.stringify(data),
                    })
                      .then(() => {
                        generateGraph(data);
                        state.data = {
                          ...state.data,
                          createState: CREATE_STATUS.GENERATED,
                        };
                      })
                      .catch(() => {
                        state.graphLoading = false;
                      });
                  }}
                  graphLoading={state.graphLoading}
                ></KnowledgeMsg>
              </div>
            </div>
          </div>
          <div className={styles['area-atlas-container']} id="graphContent">
            <header>知识图谱</header>
            <section style={{ overflow: 'hidden' }}>
              {state.graphLoading ? (
                <Loading loadingMessage="知识图谱生成中" />
              ) : state.data?.createState === CREATE_STATUS.GENERATED ? (
                <KnowledgeGraph data={state.graphData} />
              ) : (
                <Empty emptyMessage="待生成知识图谱" />
              )}
            </section>
          </div>
        </section>
      )}
    </div>
  );
};

export default AiAtlas;
