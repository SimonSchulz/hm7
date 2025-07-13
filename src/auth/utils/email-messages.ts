export const emailExamples = {
  registrationEmail: (code: string) => {
    return `<h1>Thank for your registration</h1>
<p>To finish registration please follow the link below:
    <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>
</p>`;
  },
  resendEmail: (code: string) => {
    return `<h1 style="font-weight: normal; margin-bottom: 16px; color: #333;">
  Thanks for your registration
</h1>
<p style="font-size: 16px; line-height: 1.4; color: #555; margin-bottom: 24px;">
  To finish registration please follow the link below:
</p>
<p style="margin-bottom: 24px;">
  <a href="https://somesite.com/confirm-email?code=${code}" 
     style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px;">
    Complete registration
  </a>
</p>
<p style="font-size: 14px; color: #999;">
  If you did not register, please ignore this email.
</p>`;
  },
};
