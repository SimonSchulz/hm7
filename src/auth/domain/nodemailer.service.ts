// import nodemailer from "nodemailer";
// import { SETTINGS } from "../../core/setting/setting";
//
// export const nodemailerService = {
//   async sendEmail(
//     email: string,
//     code: string,
//     template: (code: string) => string,
//   ): Promise<void> {
//     let transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: SETTINGS.EMAIL,
//         pass: SETTINGS.EMAIL_PASS,
//       },
//       tls: {
//         rejectUnauthorized: false,
//       }
//     });
//     await transporter.sendMail({
//       from: `"Blogs platform" <${SETTINGS.EMAIL}>`,
//       to: email,
//       subject: "Email confirmation",
//       html: template(code),
//     });
//   },
//   async resendEmail(
//     email: string,
//     code: string,
//     template: (code: string) => string,
//   ): Promise<void> {
//     let transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: SETTINGS.EMAIL,
//         pass: SETTINGS.EMAIL_PASS,
//       },
//       tls: {
//         rejectUnauthorized: false,
//       }
//     });
//     await transporter.sendMail({
//       from: `"Blogs platform" <${SETTINGS.EMAIL}>`,
//       to: email,
//       subject: "New email confirmation",
//       html: template(code),
//     });
//   },
//
// };
import nodemailer from "nodemailer";

class NodemailerService {
  private transporter!: nodemailer.Transporter;

  constructor() {
    this.init();
  }

  private async init() {
    const testAccount = await nodemailer.createTestAccount();

    this.transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    console.log("📧 Ethereal test account:");
    console.log("  🔑 User:", testAccount.user);
    console.log("  🔐 Pass:", testAccount.pass);
  }

  public async sendEmail(
    to: string,
    code: string,
    messageTemplate: (code: string) => string,
  ): Promise<void> {
    const info = await this.transporter.sendMail({
      from: '"MyApp" <no-reply@myapp.com>',
      to,
      subject: "Email Confirmation Code",
      html: messageTemplate(code),
    });

    // Это даст ссылку на просмотр письма в Ethereal Web UI
    console.log("📨 Preview email:", nodemailer.getTestMessageUrl(info));
  }
}

export const nodemailerService = new NodemailerService();
