import nodemailer from "nodemailer";
import { SETTINGS } from "../../core/setting/setting";

let transporter = nodemailer.createTransport({
  host: "smtp.yandex.ru",
  port: 465,
  secure: true,
  auth: {
    user: SETTINGS.EMAIL,
    pass: SETTINGS.EMAIL_PASS,
  },
});
export const nodemailerService = {
  async sendEmail(
    email: string,
    code: string,
    template: (code: string) => string,
  ): Promise<void> {
    await transporter.sendMail({
      from: `"Blogs platform" <${SETTINGS.EMAIL}>`, // обратные кавычки и <...>
      to: email,
      subject: "Your account confirmation code",
      html: template(code),
    });
  },

  async resendEmail(
    email: string,
    code: string,
    template: (code: string) => string,
  ): Promise<void> {
    await transporter.sendMail({
      from: `"Blogs platform hw7" <${SETTINGS.EMAIL}>`, // тоже исправлено
      to: email,
      subject: "Email confirmation",
      html: template(code),
    });
  },
};
