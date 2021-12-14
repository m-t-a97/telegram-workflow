export type CredentialsMailData = { name?: string; email: string };

export interface MailData {
  from: CredentialsMailData;
  to: CredentialsMailData;
  isDynamic: boolean;
  subject?: string;
  text?: string;
  html?: string;
  templateId?: string;
  dynamicTemplateData?: Record<string, any>;
}
