export const LOGIN_PATH = '/log-in';

export const SIGNUP_PATH = '/sign-up';

export const SIGN_OUT_PATH = '/sign-out';

export const FORGOT_PASSWORD_PATH = '/forgot-password';

export const RESET_PASSWORD_PATH = '/reset-password';

export const EMAIL_VERIFICATION_PATH = '/verify';

export const EMAIL_VERIFICATION_SUCCESS_PATH = '/email-verification/email-verified';

export const EMAIL_VERIFICATION_FAILED_PATH = '/email-verification/email-verification-failed';

export const EMAIL_VERIFICATION_EXPIRED_PATH = '/email-verification/link-expired';

export const ORG_INVITATION_PATH = '/org-invitation';

export const ORG_INVITATION_NOT_FOUND_PATH = `${ORG_INVITATION_PATH}/not-found`;

export const ORG_INVITATION_ALREADY_ACCEPTED_PATH = `${ORG_INVITATION_PATH}/already-accepted`;

export const ORG_INVITATION_FAILED_PATH = `${ORG_INVITATION_PATH}/failed`;

export const ORG_INVITATION_CHANGE_ACCOUNT_PATH = `${ORG_INVITATION_PATH}/change-account`;

export const ORG_INVITATION_ACCEPTED_PATH = `${ORG_INVITATION_PATH}/accepted`;

export const authFeedbackRoutes = [
  EMAIL_VERIFICATION_PATH,
  EMAIL_VERIFICATION_SUCCESS_PATH,
  EMAIL_VERIFICATION_FAILED_PATH,
  EMAIL_VERIFICATION_EXPIRED_PATH,
  ORG_INVITATION_NOT_FOUND_PATH,
  ORG_INVITATION_FAILED_PATH,
  ORG_INVITATION_ACCEPTED_PATH,
  ORG_INVITATION_CHANGE_ACCOUNT_PATH,
];
