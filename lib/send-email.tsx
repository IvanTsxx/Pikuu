import { render } from "@react-email/components";
import { transporter } from "@/config/mail.config";
import MagicLinkEmail from "@/emails/magic-link";
import { env } from "@/env/server";

interface BaseEmailParams {
  to: string;
  userFirstname?: string;
}

interface MagicLinkEmailParams extends BaseEmailParams {
  type: "magic-link";
  magicLinkUrl: string;
  expiresIn?: string;
}

type EmailParams = MagicLinkEmailParams;

const APP_NAME = "Memes Dev";
const LOGO_URL = "https://memes-dev-prod.t3.storage.dev/logo.webp";

const subjectMap: Record<string, string> = {
  "magic-link": `${APP_NAME} - Enlace de inicio de sesión`,
  "notification-system": `${APP_NAME} - Notificación del sistema`,
};

export async function sendEmail(params: EmailParams) {
  const html = await render(
    MagicLinkEmail({
      appName: APP_NAME,
      expiresIn: params.expiresIn,
      logoUrl: LOGO_URL,
      magicLinkUrl: params.magicLinkUrl,
    }),
  );
  const subject = subjectMap["magic-link"];

  await transporter.sendMail({
    from: env.EMAIL_FROM,
    html,
    subject,
    to: params.to,
  });
}
