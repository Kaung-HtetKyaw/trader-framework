import { PostHog } from 'posthog-node';
import config from './config';

/**
 * @description This is a server-side PostHog client. It is used to track events on the server-side.
 * For client-side tracking, use the PostHogProvider component.
 */
let posthogClient: PostHog | null = null;

export function getPosthogServer() {
  if (!config.NEXT_PUBLIC_POSTHOG_ENABLE || !config.NEXT_PUBLIC_POSTHOG_KEY || !config.NEXT_PUBLIC_POSTHOG_HOST) {
    return null;
  }

  if (!posthogClient) {
    posthogClient = new PostHog(config.NEXT_PUBLIC_POSTHOG_KEY, {
      host: config.NEXT_PUBLIC_POSTHOG_HOST,
      flushAt: 1, // Critical for serverless
      flushInterval: 0, // Critical for serverless
      maxQueueSize: 10000,
      requestTimeout: 5000, // Prevent hanging
    });
  }
  return posthogClient;
}

export async function closePosthogServer() {
  if (posthogClient) {
    await posthogClient.shutdown();
    posthogClient = null;
  }
}
