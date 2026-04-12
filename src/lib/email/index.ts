import { sendEmail } from "./client";
import {
  silencioTemplate,
  expiryReminderTemplate,
  type SilencioTemplateArgs,
  type ExpiryReminderArgs,
} from "./templates";

export async function sendSilencioEmail(to: string, args: SilencioTemplateArgs) {
  const { subject, html, text } = silencioTemplate(args);
  return sendEmail({ to, subject, html, text });
}

export async function sendExpiryReminderEmail(to: string, args: ExpiryReminderArgs) {
  const { subject, html, text } = expiryReminderTemplate(args);
  return sendEmail({ to, subject, html, text });
}

export { sendEmail } from "./client";
