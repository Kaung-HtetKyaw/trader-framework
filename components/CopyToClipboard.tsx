import { Check, Copy } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { useState } from 'react';

export type CopyToClipboardProps = {
  text: string;
  color?: string;
};

// TODO: animation when copied
const CopyToClipboard = ({ text, color = 'white' }: CopyToClipboardProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <>
      {/* <button onClick={copyToClipboard} className={cn('text-gray-400 hover:text-white transition', className)}>
        <Copy color={color} size={16} />
      </button> */}

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={copyToClipboard}
              className="p-1 rounded-md  transition-colors flex-shrink-0"
              aria-label="Copy API key"
            >
              {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy color={color} className="h-4 w-4" />}
            </button>
          </TooltipTrigger>
          <TooltipContent>
            {/* Add if you need message to show to user */}
            <p></p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
};

export default CopyToClipboard;
