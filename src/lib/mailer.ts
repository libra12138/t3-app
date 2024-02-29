import { SendMailOptions, createTransport, SentMessageInfo } from "nodemailer";
import { env } from "~/env";

export function sendMail(
  mailOptions: SendMailOptions,
  callback: (err: Error | null, info: SentMessageInfo) => void,
) {
  const server = {
    host: env.EMAIL_SERVER_HOST,
    port: env.EMAIL_SERVER_PORT,
    auth: {
      user: env.EMAIL_SERVER_USER,
      pass: env.EMAIL_SERVER_PASSWORD,
    },
  };
  const transporter = createTransport(server);
  return transporter.sendMail(
    { from: env.EMAIL_FROM, ...mailOptions },
    callback,
  );
}
