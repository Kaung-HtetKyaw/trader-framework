'use client';
import Script from 'next/script';
import { BaseButton } from '@/components/ui/base-button';
import { cn } from '@/lib/utils';
import { useCallback, useEffect, useRef, useState } from 'react';

export type KlinkWidgetProps = {
  renderTrigger?: ({ onClick }: { onClick: () => void }) => React.ReactNode;
};

const KLINK_WIDGET_CONTAINER_ID = 'klink-chat-widget-container';

const KlinkWidget = (props: KlinkWidgetProps) => {
  const { renderTrigger } = props;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isWidgetInitialized, setIsWidgetInitialized] = useState(false);

  useEffect(() => {
    // Clear any existing interval first
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      if (typeof window === 'undefined' || isWidgetInitialized) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }

        return;
      }

      const widgetContainer = document.getElementById(`${KLINK_WIDGET_CONTAINER_ID}`);

      if (!widgetContainer) {
        return;
      }
      widgetContainer.style.opacity = '0';

      const button = widgetContainer.shadowRoot?.querySelector('button');
      if (!button) return;

      button.style.display = 'none';
      setIsWidgetInitialized(true);
    }, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isWidgetInitialized]);

  const onClick = useCallback(() => {
    if (typeof window === 'undefined') return;

    const widgetContainer = document.getElementById(`${KLINK_WIDGET_CONTAINER_ID}`);
    if (!widgetContainer) return;

    const button = widgetContainer.shadowRoot?.querySelector('button');
    if (!button) return;

    button.click();
    widgetContainer.style.opacity = '1';
  }, []);

  return (
    <>
      {renderTrigger ? (
        renderTrigger({ onClick })
      ) : (
        <BaseButton
          className={cn(`flex flex-row justify-center items-center bg-secondary-500 text-white rounded-m`)}
          onClick={onClick}
        >
          <span>Open</span>
        </BaseButton>
      )}

      <Script
        src="https://chat.klink.cloud/klink-chat-widget.embed.latest.js"
        strategy="afterInteractive" // Load after page becomes interactive
        async
        defer
        onLoad={() => {
          if (!window.klinkChatSDK) return;

          window.klinkChatSDK
            ?.run({
              serverUrl: 'https://apigw.klink.cloud',
              // Since scId is a public configuration identifier, we do not need to configure it via .env
              scId: 'e3bf5065-8e34-48c6-b29b-d7444345e908',
            })
            .then(() => {
              const widgetContainer = document.getElementById(`${KLINK_WIDGET_CONTAINER_ID}`);
              if (!widgetContainer) return;
              widgetContainer.style.opacity = '0';

              const button = widgetContainer.shadowRoot?.querySelector('button');
              if (!button) return;
              button.style.display = 'none';
            });
        }}
      />
    </>
  );
};

export default KlinkWidget;
