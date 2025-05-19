declare namespace API {
  //接口返回的 原始 menu类型
  type TOriginalMenu = {
    chatInfo: string;
    chatName: string;
    chatNameExt: string;
    chatType: string;
    projectVersionId: string;
    coursewareId: string;
    createTime: string;
    creator: string;
    id: string;
    iorder: number;
    isAuto: number;
  };
  // 接口返回的  chat对话 类型
  type TBaseChat = {
    chatInfo: string;
    chatName: string;
    chatNameExt: string;
    chatType: string;
    projectVersionId: string;
    coursewareId: string;
    createTime: string;
    creator: string;
    id: string;
    iorder: number;
    isAuto: number;
    recordFlag: boolean;
    optionArr: RecordItem[];
    resAnalyse: string;
    topicContext: string;
    answerCorrect: string;
    compilePreScript: string;
    compileAnswerScript: string;
    compilePreRes: string;
    content: unknown;
    type: string;
    compiler: RecordItem;
    chatTopic: RecordItem;
    records: RecordItem;
    read?: boolean;
  };
  // 格式化之后的菜单属性
  type TAnchor = {
    title: string;
    key: string;
    id: string;
    index?: number;
    children?: {
      title: string;
      key: string;
      id: string;
    }[];
    disable?: boolean;
  };
}
