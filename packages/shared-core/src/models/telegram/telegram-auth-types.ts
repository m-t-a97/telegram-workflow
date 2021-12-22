export type SentCodeResultType = {
  phoneCodeHash: string;
};

export type SignInResultType = {
  passwordHint?: string;
  isPasswordRequired: boolean;
};
