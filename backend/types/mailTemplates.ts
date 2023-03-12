export type MailTemplates = {
  /** User registered successfully */
  signup: {
    subject: string;
    name: string;
    link: string;
  };
  /** User requested for reset password */
  resetPassword: {
    subject: string;
    name: string;
    token: string;
  };
  /** User request for verify mail */
  verifyMail: {
    subject: string;
    name: string;
    link: string;
  };
};
