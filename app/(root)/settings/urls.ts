export const SETTINGS_PATH = '/settings';

export const isSettingsPath = (path: string) => {
  return path.startsWith(SETTINGS_PATH);
};

export const PROFILE_SETTINGS_PATH = `${SETTINGS_PATH}/profile`;

export const PASSWORD_SETTINGS_PATH = `${SETTINGS_PATH}/password`;

export const BILL_PAYMENT_SETTINGS_PATH = `${SETTINGS_PATH}/bill-payment`;

export const NOTIFICATION_ALERTS_SETTINGS_PATH = `${SETTINGS_PATH}/notifications-alerts`;

export const API_KEYS_SETTINGS_PATH = `${SETTINGS_PATH}/api-keys`;

export const CLUSTER_GROUPS_SETTINGS_PATH = `${SETTINGS_PATH}/cluster-groups`;

export const USER_ROLE_SETTINGS_PATH = `${SETTINGS_PATH}/user-role`;

export const CONTACT_US_SETTINGS_PATH = `${SETTINGS_PATH}/contact-us`;

export const SUPPORT_TICKET_SETTINGS_PATH = `${SETTINGS_PATH}/support-tickets`;

export const GITOPS_INTEGRATION_SETTINGS_PATH = `${SETTINGS_PATH}/gitops-integration`;
