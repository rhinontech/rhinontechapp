interface WelcomeEmailOptions {
  fullName: string;
  companyEmail: string;
  tempPassword: string;
  onboardingUrl: string;
}

export function welcomeEmail({ fullName, companyEmail, tempPassword, onboardingUrl }: WelcomeEmailOptions) {
  const firstName = fullName.split(" ")[0];

  const subject = `Welcome to Rhinon Tech — Set up your account`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to Rhinon Tech</title>
</head>
<body style="margin:0;padding:0;background-color:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background-color:#18181b;padding:28px 32px;">
              <p style="margin:0;font-size:18px;font-weight:700;color:#ffffff;letter-spacing:-0.3px;">Rhinon Tech</p>
              <p style="margin:4px 0 0;font-size:12px;color:#a1a1aa;">Internal Admin Panel</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#18181b;">Welcome, ${firstName}!</p>
              <p style="margin:0 0 24px;font-size:14px;color:#6b7280;line-height:1.6;">
                Your account has been created. Here are your login credentials for the Rhinon Tech Admin Panel.
              </p>

              <!-- Credentials Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;margin-bottom:28px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 14px;font-size:11px;font-weight:600;color:#9ca3af;letter-spacing:0.08em;text-transform:uppercase;">Your credentials</p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:6px 0;border-bottom:1px solid #e5e7eb;">
                          <span style="font-size:12px;color:#9ca3af;display:block;margin-bottom:2px;">Company Email</span>
                          <span style="font-size:14px;font-weight:600;color:#18181b;">${companyEmail}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0 0;">
                          <span style="font-size:12px;color:#9ca3af;display:block;margin-bottom:2px;">Temporary Password</span>
                          <span style="font-size:14px;font-weight:600;color:#18181b;font-family:monospace;">${tempPassword}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 20px;font-size:14px;color:#6b7280;line-height:1.6;">
                Click the button below to set your own password and complete your account setup.
                This link expires in <strong style="color:#18181b;">48 hours</strong>.
              </p>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="background-color:#18181b;border-radius:8px;">
                    <a href="${onboardingUrl}" style="display:inline-block;padding:12px 28px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:-0.1px;">
                      Set Up Your Account →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.6;">
                If you weren't expecting this email, you can safely ignore it.
                If the button doesn't work, copy this link:<br/>
                <a href="${onboardingUrl}" style="color:#6b7280;word-break:break-all;">${onboardingUrl}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;border-top:1px solid #f3f4f6;background:#fafafa;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                Rhinon Tech · Internal Admin Panel
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `Welcome to Rhinon Tech, ${firstName}!

Your account has been created.

Company Email: ${companyEmail}
Temporary Password: ${tempPassword}

Set up your account here: ${onboardingUrl}

This link expires in 48 hours.

If you weren't expecting this email, you can safely ignore it.`;

  return { subject, html, text };
}
