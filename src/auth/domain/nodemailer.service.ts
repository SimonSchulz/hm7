import nodemailer from "nodemailer";
import { SETTINGS } from "../../core/setting/setting";

export const nodemailerService = {
  async sendEmail(
    email: string,
    code: string,
    template: (code: string) => string,
  ): Promise<void> {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: SETTINGS.EMAIL,
        pass: SETTINGS.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      }
    });
    await transporter.sendMail({
      from: `"Blogs platform" <${SETTINGS.EMAIL}>`,
      to: email,
      subject: "Email confirmation",
      html: template(code),
    });
  },

};
