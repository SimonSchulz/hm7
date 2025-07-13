import nodemailer from 'nodemailer';
import {SETTINGS} from "../../core/setting/setting";

export const nodemailerService = {
    async sendEmail(
        email: string,
        code: string,
        template: (code: string) => string
    ): Promise<void> {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: SETTINGS.EMAIL,
                pass: SETTINGS.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: '"Blogs platform" <codeSender>',
            to: email,
            subject: 'Your account confirmation code',
            html: template(code), // html body
        });
    },
  async resendEmail(
    email: string,
    code: string,
    template: (code: string) => string
  ): Promise<void> {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: SETTINGS.EMAIL,
        pass: SETTINGS.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: '"Blogs platform 2" <codeSender>',
      to: email,
      subject: 'Your new account confirmation code',
      html: template(code), // html body
    });
  },
};