import nodemailer from "nodemailer";
import { envs } from "../../config/plugins/envs.plugin";

export type Attachment = {
	fileName: string;
	path: string;
};

export interface sendEmailOptions {
	to: string | string[];
	subject: string;
	htmlBody: string;
	attachments?: Attachment[];
}

export class EmailService {
	private transporter = nodemailer.createTransport({
		service: envs.MAILER_SERVICE,
		auth: {
			user: envs.MAILER_EMAIL,
			pass: envs.MAILER_SECRET_KEY,
		},
	});

	async sendEmail({
		to,
		subject,
		htmlBody,
		attachments = [],
	}: sendEmailOptions): Promise<boolean> {
		try {
			await this.transporter.sendMail({
				to,
				subject,
				html: htmlBody,
				attachments,
			});

			return true;
		} catch (error) {
			return false;
		}
	}

	async sendEmailWithFileSystemLogs(to: string | string[]) {
		const subject = "Logs del servidor";
		const htmlBody = `<h1>Logs del sistema NOC</h1/>
<p>texto de prueba</p>`;
		const attachments: Attachment[] = [
			{ fileName: "logs-all.log", path: "./logs/logs-all.log" },
			{ fileName: "logs-medium.log", path: "./logs/logs-medium.log" },
			{ fileName: "logs-high.log", path: "./logs/logs-high.log" },
		];

		return await this.sendEmail({ to, subject, htmlBody, attachments });
	}
}
