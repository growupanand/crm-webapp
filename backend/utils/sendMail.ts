import { MailTemplates } from "@app/types/mailTemplates";
import { NODEMAILER_FROM, isMailConfigured, transporter } from "@app/mailer";

// -------------------Utility Function--------------------------

type Props<T extends keyof MailTemplates> = {
  // Receiver mail id
  to: string;
  // Template name which will be used
  template: T;
  // Data which is required by template
  context: MailTemplates[T];
};

/**
 * Send mail
 * @param props
 * @returns
 */
const sendMail = async <T extends keyof MailTemplates>(props: Props<T>) => {
  const { to, template, context } = props;
  const mailOption = {
    from: NODEMAILER_FROM,
    to,
    subject: context.subject,
    template,
    context,
  };
  let data = null;
  try {
    if (!isMailConfigured) {
      throw new Error("Mail is not configured");
    }
    data = await transporter.sendMail(mailOption);
  } catch (error) {
    console.error("error while sending mail", { error });
  }
  return data;
};

export { sendMail };
