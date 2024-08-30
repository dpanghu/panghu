import CustomUpload, { CustomUploadProps } from '@/components/CustomUpload';
import { getAttachmentId, uploadSummary } from '@/services/documentSummary';
import { getFileMajorType } from '@/utils/contants';
import { useReactive } from 'ahooks';
import { Spin } from 'antd';
import { RcFile } from 'antd/es/upload';
import React from 'react';
import styles from './FileUpload.less';

interface TProps {
  onChange: (dataSource: RecordItem) => void;
  paramsId: string;
}

const FileUpload: React.FC<TProps> = ({ onChange, paramsId }) => {
  const extraParams = JSON.parse(
    window.sessionStorage.getItem('queryParams') || '{}',
  );
  const state = useReactive({
    attachmentId: '',
    loading: false,
  });

  const uploadData = async () => {
    try {
      state.loading = true;
      const result1 = {
        attachmentName: '冲刺教育学_removed.pdf',
        attachmentSuffixname: 'pdf',
        classId: '1722944161997548',
        createTime: '1724912108475',
        creator: '63105158182600735',
        id: '926297393857572864',
        materialId: '926286018888359936',
        memberId: '63105158210387988',
        mindMap:
          '{"name":"教育时政热点预测","childrens":[{"name":"习近平总书记关于教育的重要论述","childrens":[{"name":"教育家精神","childrens":[]},{"name":"铸牢中华民族共同体意识","childrens":[]},{"name":"少年儿童的培养","childrens":[]},{"name":"党的教育方针","childrens":[]},{"name":"科技自立自强","childrens":[]},{"name":"教育家的榜样作用","childrens":[]},{"name":"教育的工作目标","childrens":[]},{"name":"教育的根本任务","childrens":[]},{"name":"思想政治工作","childrens":[]},{"name":"教师的地位和责任","childrens":[]},{"name":"尊师重教的社会风尚","childrens":[]},{"name":"课堂学习与乡村实践结合","childrens":[]},{"name":"提升办学水平","childrens":[]},{"name":"培养“四个自信”的孩子","childrens":[]},{"name":"传道授业解惑的本领","childrens":[]},{"name":"立德树人的初心和使命","childrens":[]},{"name":"高质量发展","childrens":[]},{"name":"中国特色教师教育体系","childrens":[]},{"name":"思想政治理论课","childrens":[]},{"name":"教育强国的意义","childrens":[]}]},{"name":"二十大报告","childrens":[{"name":"教育、科技、人才的支撑作用","childrens":[]},{"name":"办好人民满意的教育","childrens":[]},{"name":"育人的根本在于立德","childrens":[]},{"name":"以人民为中心发展教育","childrens":[]},{"name":"加强师德师风建设","childrens":[]},{"name":"坚持创新的核心地位","childrens":[]},{"name":"建设人才队伍","childrens":[]}]}]}',
        modifier: '63105158182600735',
        modifyTime: '1724912170941',
        projectVersionId: '918043291856957440',
        schoolId: '100678506119168',
        status: 2,
        summary:
          '# 教育时政热点预测\n- **习近平总书记关于教育的重要论述**：    - 强调教育家精神的重要性。    - 提出学校思政课要重点讲好相关故事，将中华民族共同体意识植入孩子心灵。    - 鼓励少年儿童树立远大志向，全面发展。    - 要求全面贯彻党的教育方针，落实立德树人根本任务，推进大中小学思想政治教育一体化建设。    - 希望学校师生为实现高水平科技自立自强和建设教育强国等作出贡献。    - 倡导弘扬教育家精神，牢记初心使命。    - 明确教育的工作目标和根本任务。    - 指出思想政治工作的重要性和教师的责任。    - 强调尊师重教的社会风尚。    - 鼓励课堂学习与乡村实践结合。    - 要求提升办学水平，推动铸牢中华民族共同体意识。    - 提出培养拥有“四个自信”的孩子。    - 强调增长传道授业解惑本领。    - 希望教师不忘立德树人初心，积极探索教育教学方法。    - 强调教育质量的重要性，建设高质量教育体系。    - 提出健全教师教育体系，弘扬尊师重教风尚。    - 指出思想政治理论课的关键在于重视、适应和做好。    - 强调教育强国的战略先导、支撑和基础工程作用。- **二十大报告**：    - 强调教育、科技、人才的基础性、战略性支撑作用。    - 提出深入实施科教兴国战略、人才强国战略、创新驱动发展战略。    - 指出办好人民满意的教育，育人的根本在于立德。    - 要求全面贯彻党的教育方针，落实立德树人根本任务，培养德智体美劳全面发展的社会主义建设者和接班人。    - 强调以人民为中心发展教育，加快建设高质量教育体系，促进教育公平。    - 提出加强师德师风建设，培养高素质教师队伍，推进教育数字化，建设学习型社会、学习型大国。    - 强调坚持创新在我国现代化建设全局中的核心地位。    - 提出建设规模宏大、结构合理、素质优良的人才队伍。',
        taskId: '917976699664695296',
      };
      onChange(result1);
      return;
      const result: RecordItem = await uploadSummary({
        paramId: paramsId,
        attachmentId: state.attachmentId,
        ...extraParams,
      });
      console.log(result);
      onChange(result);
    } finally {
      state.loading = false;
    }
  };

  const DraggerProps: CustomUploadProps = {
    dragger: true,
    accept: '.doc,.docx,.pdf,.DOC,.DOCX,.PDF',
    allowFileType: ['doc', 'docx', 'pdf', 'DOC', 'DOCX', 'PDF'],
    allowFileSize: 2,
    // action: 'https://tapi.seentao.com/bus-xai/dbe3.private.params.upload.get',
    // data: extraParams,
    seenOss: {
      url: 'https://tapi.seentao.com/bus-xai/dbe3.private.params.upload.get',
      extraParams,
    },
    customUploadSuccess: async (file: RcFile) => {
      // 附件上传成功后 去获取attachmentId
      const attachmentType = (file.name as any)
        .split('.')
        .pop()
        .toLocaleLowerCase();
      const params = {
        attachmentUrl: (file as any).key,
        attachmentName: file.name,
        attachmentCategory: getFileMajorType(attachmentType),
        attachmentSize: file.size,
        isConvert: 1,
        suffixName: attachmentType,
      };
      const attachmentId = await getAttachmentId(params);
      state.attachmentId = attachmentId;
      uploadData();
    },
  };

  return (
    <div className={styles.FileUploadContainer}>
      {state.loading ? (
        <Spin
          tip="文档解析中，请稍等！"
          spinning={state.loading}
          size="large"
        />
      ) : (
        <CustomUpload {...DraggerProps}>
          <div className={styles.uploadContainer}>
            <span>点击或将文件拖拽到此处上传</span>
            <span>文档格式:支持 PDF/Word格式</span>
            <span>文档大小:文件最大支持10M</span>
          </div>
        </CustomUpload>
      )}
    </div>
  );
};

export default FileUpload;
