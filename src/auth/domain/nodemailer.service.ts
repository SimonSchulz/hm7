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
  private initialized = false;

  // Инициализируем только один раз
  private async init() {
    if (this.initialized) return;

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

    this.initialized = true;

    console.log("✅ Nodemailer инициализирован");
    console.log("📧 user:", testAccount.user);
    console.log("📧 pass:", testAccount.pass);
  }

  // Публичный метод для отправки писем
  public async sendEmail(to: string, code: string, getHtml: (code: string) => string): Promise<void> {
    // Инициализация перед первой отправкой
    await this.init();

    const info = await this.transporter.sendMail({
      from: '"My App" <no-reply@myapp.com>',
      to,
      subject: "Email Confirmation",
      html: getHtml(code),
    });

    console.log("📬 Email отправлен, preview URL:", nodemailer.getTestMessageUrl(info));
  }
}
export const nodemailerService = new NodemailerService();