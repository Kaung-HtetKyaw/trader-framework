export type SignUpPayload = {
  email: string;
  password: string;
};

export type LogInPayload = {
  email: string;
  password: string;
};

export type ForgotPasswordPayload = {
  email: string;
};

export type ResetPasswordPayload = {
  password: string;
  forgotPasswordToken: string;
};
