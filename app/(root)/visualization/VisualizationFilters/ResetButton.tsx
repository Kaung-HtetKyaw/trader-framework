import { BaseButton } from '@/components/ui/base-button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export type ResetButtonProps = {
  onResetAll: () => void;
  disabled?: boolean;
};

const ResetButton = (props: ResetButtonProps) => {
  const { onResetAll } = props;

  return (
    <div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <BaseButton onClick={onResetAll} variant="text" color="text" className="hover:underline">
              Reset All
            </BaseButton>
          </TooltipTrigger>
          <TooltipContent side="left">
            <div className="relative shadow-lg px-2 py-1 min-h-4 bg-white rounded-[5px] ">
              <div className="flex flex-row h-full items-center min-w-15 gap-1">
                <p className="body-2 text-text-800 p-2">
                  This will reset the filters to show all
                  <br /> object kinds, cluster wide objects, <br /> and namespaces.
                </p>
              </div>

              <svg
                className="absolute top-1/2 right-0 translate-x-full translate-y-[-50%] "
                xmlns="http://www.w3.org/2000/svg"
                width="7"
                height="11"
                viewBox="0 0 7 11"
                fill="none"
              >
                <path d="M6.24072 5.7952L0.168458 11L0.168457 0.590402L6.24072 5.7952Z" fill="white" />
              </svg>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default ResetButton;
