import nodemailer from "nodemailer";
import { SETTINGS } from "../../core/setting/setting";
import { User } from "../../user/domain/user.entity";

export const nodemailerService = {
  async sendEmail(
    user: User,
  ): Promise<void> {
    let transporter = nodemailer.createTransport({
      host: "smtp.yandex.ru",
      port: 465,
      secure: true,
      auth: {
        user: SETTINGS.EMAIL,
        pass: SETTINGS.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    await transporter.sendMail({
      from: `"Blogs platform" <${SETTINGS.EMAIL}>`,
      to: user.email,
      subject: "Email confirmation",
      html: `<h1>Thank for your registration</h1>
<p>To finish registration please follow the link below:
    <a href='https://somesite.com/confirm-email?code=${user.emailConfirmation.confirmationCode}'>complete registration</a>
</p>`,
    });
  },
};
