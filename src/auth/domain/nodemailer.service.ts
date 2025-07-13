import nodemailer from "nodemailer";
import { SETTINGS } from "../../core/setting/setting";

const getTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'localhost',
    port: Number(process.env.SMTP_PORT) || 1025,
    secure: process.env.SMTP_SECURE === 'true', // false для MailDev
    auth: process.env.EMAIL_PASS
      ? {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      }
      : undefined,
  });
};

export const nodemailerService = {
  async sendEmail(
    email: string,
    code: string,
    template: (code: string) => string
  ): Promise<void> {
    const transporter = getTransporter();

    await transporter.sendMail({
      from: `"Blogs platform" <${SETTINGS.EMAIL}>`,
      to: email,
      subject: 'Your account confirmation code',
      html: template(code),
    });
  },
};
