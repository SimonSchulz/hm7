import nodemailer from 'nodemailer';
import { SETTINGS } from "../../core/setting/setting";

export const nodemailerService = {
  async sendEmail(
    email: string,
    code: string,
    template: (code: string) => string
  ): Promise<void> {
    let transporter = nodemailer.createTransport({
      host: 'smtp.yandex.ru',
      port: 465,
      secure: true,
      auth: {
        user: SETTINGS.EMAIL,
        pass: SETTINGS.EMAIL_PASS,
      },
    });

    transporter.verify((err, success) => {
      if (err) {
        console.error('SMTP проверка НЕ прошла:', err);
      } else {
        console.log('SMTP работает нормально!');
      }
    });

    await transporter.sendMail({
      from: `"Blogs platform" <${SETTINGS.EMAIL}>`, // обратные кавычки и <...>
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
    let transporter = nodemailer.createTransport({
      host: 'smtp.yandex.ru',
      port: 465,
      secure: true,
      auth: {
        user: SETTINGS.EMAIL,
        pass: SETTINGS.EMAIL_PASS,
      },
    });

    transporter.verify((err, success) => {
      if (err) {
        console.error('SMTP проверка НЕ прошла:', err);
      } else {
        console.log('SMTP работает нормально!');
      }
    });

    await transporter.sendMail({
      from: `"Blogs platform 2" <${SETTINGS.EMAIL}>`, // тоже исправлено
      to: email,
      subject: 'Your new account confirmation code',
      html: template(code),
    });
  },
};
