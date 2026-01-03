import { BaseButton } from '../ui/base-button';
import { cn } from '@/lib/utils';

export type IntercomWidgetProps = {
  renderTrigger?: () => React.ReactNode;
};

export const INTERCOM_CUSTOM_LAUNCHER_BUTTON_ID = 'intercom-custom-launcher-button';

const IntercomWidget = (props: IntercomWidgetProps) => {
  const { renderTrigger } = props;

  return (
    <>
      {renderTrigger ? (
        renderTrigger()
      ) : (
        <BaseButton
          id={INTERCOM_CUSTOM_LAUNCHER_BUTTON_ID}
          className={cn(`flex flex-row justify-center items-center bg-secondary-500 text-white rounded-m`)}
          // onClick={onClick}
        >
          <span>Open</span>
        </BaseButton>
      )}
    </>
  );
};

export default IntercomWidget;
