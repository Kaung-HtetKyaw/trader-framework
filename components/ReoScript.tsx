'use client';
import config from '@/lib/config';
import { useEffect, useState } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { loadReoScript as loadReoScriptNative } from 'reodotdev';

type LoadReoScript = (config: { clientID: string; source?: string }) => Promise<Reo>;

type Reo = {
  init(config: { clientID: string }): void;
};

const loadReoScript = loadReoScriptNative as LoadReoScript;

const ReoScript = () => {
  const [isReoInitialized, setIsReoInitialized] = useState(false);

  useEffect(() => {
    if (isReoInitialized || !config.NEXT_PUBLIC_REO_ENABLE) {
      return;
    }

    const clientID = config.NEXT_PUBLIC_REO_CLIENT_ID;

    if (!clientID) {
      console.warn('Cannot find client id for reodotdev');
      return;
    }

    const reoPromise = loadReoScript({ clientID });

    reoPromise
      .then(Reo => {
        Reo.init({ clientID });
        setIsReoInitialized(true);
      })
      .catch(error => {
        console.error('Error loading Reo', error);
      });
  }, [isReoInitialized]);

  return null;
};

export default ReoScript;
