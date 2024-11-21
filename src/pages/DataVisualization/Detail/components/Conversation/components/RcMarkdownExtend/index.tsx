import { useMount } from 'ahooks';
import RcMarkdown from 'rc-markdown';
import React from 'react';

type IRcMarkdown = {
  content: string;
  typeWriter?: boolean;
  compoents?: any;
  elementAttr?: {
    video?: React.MediaHTMLAttributes<HTMLVideoElement>;
    img?: React.ImgHTMLAttributes<HTMLImageElement>;
  };
};

const RcMarkdownExtend: React.FC<
  IRcMarkdown & React.HTMLAttributes<HTMLDivElement>
> = (props) => {
  useMount(() => {
    // 因为rc-markdown未暴露主题色配置，因此暂时使用这种方式处理内部主题色设置
    Array.from(document.querySelectorAll('.rc-markdown-body')).forEach(
      (element) => {
        element.className = 'rc-markdown-body-extend';
      },
    );
  });
  return <RcMarkdown {...props} />;
};

export default RcMarkdownExtend;
