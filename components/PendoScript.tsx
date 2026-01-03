// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable no-var */
'use client';
import { useCallback, useEffect } from 'react';
import config from '@/lib/config';
import { useSession } from 'next-auth/react';
import { useLazyGetUserInfoQuery } from '@/store/api/usersApi';

const PendoScript = () => {
  const { data: session } = useSession();
  const [getUserInfo] = useLazyGetUserInfoQuery();

  const onInitializePendo = useCallback(async () => {
    if (
      !config.NEXT_PUBLIC_PENDO_API_KEY ||
      !session?.user?.id ||
      typeof window.pendo === 'undefined' ||
      !window.pendo
    ) {
      return;
    }

    const userInfo = await getUserInfo();

    window.pendo.initialize({
      visitor: {
        id: userInfo.data?.id,
        email: userInfo.data?.email,
      },
      account: {
        id: userInfo.data?.organizationID,
      },
    });
  }, [session?.user?.id, getUserInfo]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (!config.NEXT_PUBLIC_PENDO_API_KEY) {
      return;
    }

    // Check if Pendo is already loaded
    if (window.pendo) {
      return;
    }

    if (!config.NEXT_PUBLIC_PENDO_API_KEY) {
      console.warn('Failed to load Pendo: No API key found');
      return;
    }

    // Initialize Pendo
    (function (p, e, n, d, o) {
      var v, w, x, y, z;
      o = p[d] = p[d] || {};
      o._q = o._q || [];
      v = ['initialize', 'identify', 'updateOptions', 'pageLoad', 'track', 'trackAgent'];
      for (w = 0, x = v.length; w < x; ++w) {
        (function (m) {
          o[m] =
            o[m] ||
            function () {
              // eslint-disable-next-line prefer-rest-params
              o._q[m === v[0] ? 'unshift' : 'push']([m].concat([].slice.call(arguments, 0)));
            };
        })(v[w]);
      }
      y = e.createElement(n);
      y.async = true;
      y.src = 'https://cdn.pendo.io/agent/static/' + config.NEXT_PUBLIC_PENDO_API_KEY + '/pendo.js';
      z = e.getElementsByTagName(n)[0];
      z.parentNode.insertBefore(y, z);
    })(window, document, 'script', 'pendo');
  }, []);

  useEffect(() => {
    if (!config.NEXT_PUBLIC_PENDO_API_KEY) {
      console.warn('Failed to initialize Pendo: No API key found');
      return;
    }

    onInitializePendo();
  }, [onInitializePendo]);

  return null;
};

export default PendoScript;
