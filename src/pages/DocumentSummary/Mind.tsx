import 'highlight.js/styles/atom-one-dark.css';
import ReactMarkdown from 'react-markdown';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import CopyButton from './CopyButton';

const Markdown = ({ content }: { content: string }) => {
  return (
    <div>
      <ReactMarkdown
        components={{
          code: ({ children = [], className, ...props }) => {
            return (
              <>
                <SyntaxHighlighter
                  showLineNumbers={false}
                  style={oneLight as any}
                  PreTag="div"
                  className="syntax-hight-wrapper"
                >
                  {children as string[]}
                </SyntaxHighlighter>
                <CopyButton content={children as string} />
              </>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default Markdown;
