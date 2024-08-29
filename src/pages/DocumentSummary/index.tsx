import recentRecordPng from '@/assets/images/recent_record.png';
import { useReactive } from 'ahooks';
import React from 'react';
import AnalysisSummary from './AnalysisSummary';
import FileUpload from './FileUpload';
import styles from './index.less';

interface TState {
  showSummary: boolean;
  summaryData: RecordItem;
}

const DocumentSummary: React.FC = () => {
  const state = useReactive<TState>({
    showSummary: true,
    summaryData: {
      attachmentName: '冲刺教育学_removed.pdf',
      attachmentSuffixname: 'pdf',
      classId: '1722944161997548',
      createTime: '1724912108475',
      creator: '63105158182600735',
      id: '926297393857572864',
      materialId: '926286018888359936',
      memberId: '63105158210387988',
      mindMap:
        '{"name":"教育时政热点预测","children":[{"name":"习近平总书记关于教育的重要论述","children":[{"name":"教育家精神","children":[]},{"name":"铸牢中华民族共同体意识","children":[]},{"name":"少年儿童的培养","children":[]},{"name":"党的教育方针","children":[]},{"name":"科技自立自强","children":[]},{"name":"教育家的榜样作用","children":[]},{"name":"教育的工作目标","children":[]},{"name":"教育的根本任务","children":[]},{"name":"思想政治工作","children":[]},{"name":"教师的地位和责任","children":[]},{"name":"尊师重教的社会风尚","children":[]},{"name":"课堂学习与乡村实践结合","children":[]},{"name":"提升办学水平","children":[]},{"name":"培养“四个自信”的孩子","children":[]},{"name":"传道授业解惑的本领","children":[]},{"name":"立德树人的初心和使命","children":[]},{"name":"高质量发展","children":[]},{"name":"中国特色教师教育体系","children":[]},{"name":"思想政治理论课","children":[]},{"name":"教育强国的意义","children":[]}]},{"name":"二十大报告","children":[{"name":"教育、科技、人才的支撑作用","children":[]},{"name":"办好人民满意的教育","children":[]},{"name":"育人的根本在于立德","children":[]},{"name":"以人民为中心发展教育","children":[]},{"name":"加强师德师风建设","children":[]},{"name":"坚持创新的核心地位","children":[]},{"name":"建设人才队伍","children":[]}]}]}',
      modifier: '63105158182600735',
      modifyTime: '1724912170941',
      projectVersionId: '918043291856957440',
      schoolId: '100678506119168',
      status: 2,
      summary:
        '# 教育时政热点预测\n- **习近平总书记关于教育的重要论述**：    - 强调教育家精神的重要性。    - 提出学校思政课要重点讲好相关故事，将中华民族共同体意识植入孩子心灵。    - 鼓励少年儿童树立远大志向，全面发展。    - 要求全面贯彻党的教育方针，落实立德树人根本任务，推进大中小学思想政治教育一体化建设。    - 希望学校师生为实现高水平科技自立自强和建设教育强国等作出贡献。    - 倡导弘扬教育家精神，牢记初心使命。    - 明确教育的工作目标和根本任务。    - 指出思想政治工作的重要性和教师的责任。    - 强调尊师重教的社会风尚。    - 鼓励课堂学习与乡村实践结合。    - 要求提升办学水平，推动铸牢中华民族共同体意识。    - 提出培养拥有“四个自信”的孩子。    - 强调增长传道授业解惑本领。    - 希望教师不忘立德树人初心，积极探索教育教学方法。    - 强调教育质量的重要性，建设高质量教育体系。    - 提出健全教师教育体系，弘扬尊师重教风尚。    - 指出思想政治理论课的关键在于重视、适应和做好。    - 强调教育强国的战略先导、支撑和基础工程作用。- **二十大报告**：    - 强调教育、科技、人才的基础性、战略性支撑作用。    - 提出深入实施科教兴国战略、人才强国战略、创新驱动发展战略。    - 指出办好人民满意的教育，育人的根本在于立德。    - 要求全面贯彻党的教育方针，落实立德树人根本任务，培养德智体美劳全面发展的社会主义建设者和接班人。    - 强调以人民为中心发展教育，加快建设高质量教育体系，促进教育公平。    - 提出加强师德师风建设，培养高素质教师队伍，推进教育数字化，建设学习型社会、学习型大国。    - 强调坚持创新在我国现代化建设全局中的核心地位。    - 提出建设规模宏大、结构合理、素质优良的人才队伍。',
      taskId: '917976699664695296',
    },
  });

  const changeContent = (dataSource: RecordItem) => {
    state.showSummary = true;
    state.summaryData = dataSource;
  };

  return (
    <div className={styles.DocumentSummaryContainer}>
      <div className={styles.header}>
        <div className={styles.title}>AI文档总结</div>
        <div className={styles.action}>
          <div className={styles.recordLast}>
            <img src={recentRecordPng} alt="" />
            <span>最近记录</span>
          </div>
        </div>
      </div>
      <div className={styles.main}>
        <div className={styles.content}>
          {state.showSummary ? (
            <AnalysisSummary summaryData={state.summaryData} />
          ) : (
            <FileUpload onChange={changeContent} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentSummary;
