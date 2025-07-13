import nodemailer, { SendMailOptions } from "nodemailer";
import { SETTINGS } from "../../core/setting/setting";
import { emailLog } from "../utils/email-mock-log";

const getTransporter = () => {
  if (process.env.NODE_ENV === 'test') {
    return {
      sendMail: async ({ to, subject, html }:SendMailOptions) => {
        const codeMatch = html?.toString().match(/code=([a-zA-Z0-9\-]+)/);
        emailLog.push({
          to: to?.toString() ?? 'unknown',
          subject: subject?.toString() ?? 'no subject',
          html: html?.toString() ?? '',
          code: codeMatch ? codeMatch[1] : 'UNKNOWN',
          sentAt: new Date(),
        });
        console.log(`[TEST EMAIL MOCK] Sent to ${to}: ${subject}`);
      }
    };
  }

  return nodemailer.createTransport({
    host: 'smtp.yandex.ru',
    port: 465,
    secure: true,
    auth: {
      user: SETTINGS.EMAIL,
      pass: SETTINGS.EMAIL_PASS,
    },
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

  async resendEmail(
    email: string,
    code: string,
    template: (code: string) => string
  ): Promise<void> {
    const transporter = getTransporter();

    await transporter.sendMail({
      from: `"Blogs platform hw7" <${SETTINGS.EMAIL}>`,
      to: email,
      subject: 'Email confirmation',
      html: template(code),
    });
  },
};