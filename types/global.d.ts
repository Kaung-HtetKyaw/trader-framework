import { PendoAccountPayload, PendoVisitorPayload } from './pendo';

declare global {
  interface Window {
    klinkChatSDK?: {
      run: (config: { serverUrl: string; scId: string }) => Promise<void>;
    };

    Reo?: {
      init(config: { clientID: string }): void;
      identify(data: ReoIdentifyPayload): void;
    };
    pendo?: {
      initialize(config: { visitor: PendoVisitorPayload; account?: PendoAccountPayload });
    };
  }
}

export type ReoIdentifyPayload = {
  username: string;
  email: string;
  type: 'github' | 'email';
  firstName?: string;
  lastName?: string;
};

export {};
