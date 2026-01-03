import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

const MarkdownOutput = ({ content }: { content: string }) => {
  return (
    <div
      className="prose prose-sm prose-p:text-sm prose-li:text-sm prose-code:text-xs prose-pre:text-xs
    prose-h2:text-sm prose-h3:text-sm prose-h4:text-sm prose-h5:text-sm prose-h6:text-sm dark:prose-invert
    max-w-none prose-p:mb-2 prose-ul:mb-2 prose-h2:mt-4 prose-h3:mt-4 prose-li:mb-2"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          table: ({ ...props }) => (
            <div className="overflow-x-auto my-3">
              <table className="w-full border-collapse border border-gray-300 text-sm" {...props} />
            </div>
          ),
          th: ({ ...props }) => (
            <th className="bg-gray-100 border border-gray-300 px-3 py-2 text-left font-medium" {...props} />
          ),
          td: ({ ...props }) => <td className="border border-gray-300 px-3 py-2 break-words" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownOutput;
