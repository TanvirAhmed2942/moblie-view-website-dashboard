export type loginFormType = {
  email: string;
  password: string;
  remember: boolean;
};

export type forgetPasswordFormType = {
  email: string;
};

export type resetPasswordFormType = {
  password: string;
  confirmPassword: string;
};
