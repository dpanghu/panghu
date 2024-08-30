import { useMount } from 'ahooks';
import * as docx from 'docx-preview';
import React from 'react';
interface Props {
  file?: string;
  url: string;
  attachmentId?: any;
  onLoaded?: () => void;
  onLeave?: () => void;
}
const FileViewer: React.FC<Props> = (props: Props) => {
  const { url, onLoaded } = props;

  useMount(() => {
    // console.log(docx);
    // console.log(document.getElementById('panel-section'));
    // console.log(url);

    // 核心代码
    docx
      .renderAsync(url, document.getElementById('panel-section') as HTMLElement)
      .then((x) => console.log('docx: finished'));
  });

  return (
    <div style={{ width: '100%', display: 'flex', height: '100%' }}>
      <iframe
        id="fileViewH5"
        style={{ border: 'none' }}
        src={url}
        width="100%"
        height="100%"
        // @ts-ignore
        allowFullScreen="true"
      />
    </div>
  );
};
export default FileViewer;
