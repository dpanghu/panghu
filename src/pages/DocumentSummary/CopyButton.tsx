import copyIconPng from '@/assets/images/copyIcon.png';
import { message } from 'SeenPc';

const CopyButton = ({ content }: { content: string }) => {
  const onCopy = async () => {
    if (navigator.clipboard && window.isSecureContext) {
      return window.navigator?.clipboard
        ?.writeText(content)
        .then(() => {
          message.success(`已复制到粘贴板`);
        })
        .catch(() => {
          message.error('复制失败，请手动右键复制');
        });
      // return navigator.clipboard.writeText(textToCopy);
    } else {
      // 创建text area
      let textArea = document.createElement('textarea');
      textArea.value = content;
      // 使text area不在viewport，同时设置不可见
      textArea.style.position = 'absolute';
      textArea.style.opacity = '0';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      return new Promise((res, rej) => {
        message.success(`已复制到粘贴板`);
        // 执行复制命令并移除文本框
        document.execCommand('copy') ? res(null) : rej();
        textArea.remove();
      });
    }
  };

  return (
    <img
      src={copyIconPng}
      style={{
        width: 16,
        cursor: 'pointer',
        position: 'absolute',
        top: 5,
        right: 5,
      }}
      onClick={onCopy}
    />
  );
};

export default CopyButton;
