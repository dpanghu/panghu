import React, { useState } from 'react';
import BraftEditor from 'braft-editor';
import { uploads } from '@/services/common';
import 'braft-editor/dist/index.css';
import { getFileMajorType } from '@/utils/file_type_contents';
import { getAttachmentId } from '@/services/research';
import { getResourceById } from '@/utils/utils';
interface TProps {
  getData: (value: string) => void;
  defaultData: string;
}

const Container: React.FC<TProps> = ({ getData, defaultData }) => {
  const [scientificAchievement, setScientificAchievement] = useState<string>(defaultData);
  const controls: any[] = [
    'undo',
    'redo',
    'separator',
    // 'headings',
    // 'font-size',
    // 'line-height',
    // 'letter-spacing',
    'separator',
    'text-color',
    'bold',
    'italic',
    'underline',
    'strike-through',
    'separator',
    'text-align',
    'separator',
    'separator',
    'link',
    'separator',
    {
      key: 'media',
      text: '本地上传',
    },
    'separator',
  ];

  const getRichText = (value: string) => {
    setScientificAchievement(value);
    getData(value);
  };

  const uploadEditor = async (param: RecordItem) => {
    let file = param.file;
    const data = await uploads({
      bucketNameType: 'pub',
      ossResCategory: 'builder',
      objectKey:
        `/${
          JSON.parse(window.sessionStorage.getItem('projectData') || '{}').projectVersionId
        }/task/${file.name}` || '',
    });
    const formData = new FormData();
    Object.keys(data.tokenParams).forEach((key) => {
      formData.append(key, data.tokenParams[key]);
    });
    formData.append('file', file);
    fetch(data.endpoint, {
      method: 'POST',
      body: formData,
    })
      .then(async () => {
        const attachmentType = (file.name as any).split('.').pop().toLocaleLowerCase();
        const params = {
          attachmentUrl: data.file_url,
          attachmentName: file.name,
          attachmentCategory: getFileMajorType(attachmentType),
          attachmentSize: file.size,
          isConvert: 1,
          suffixName: attachmentType,
        };
        const id = await getAttachmentId(params);
        param.success({
          url: getResourceById(id) as string,
          meta: {
            id: '',
            title: '',
            alt: '',
            loop: false,
            autoPlay: false,
            controls: false,
            poster: '',
          },
        });
      })
      .catch(() => {
        param.error({
          msg: 'unable to upload.',
        });
      });
  };

  return (
    <BraftEditor
      value={BraftEditor.createEditorState(scientificAchievement)}
      onChange={(e: any) => {
        getRichText(e);
      }}
      style={{ border: '1px solid #d9d9d9', height: 364 }}
      controls={[...controls]}
      placeholder={'请输入科研成果介绍。'}
      media={{
        uploadFn: uploadEditor,
      }}
    />
  );
};

export default Container;
