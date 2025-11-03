import nodemailer from 'nodemailer';
import { env } from '$env/dynamic/private';

// Simple Gmail SMTP configuration
// Just use your Gmail and an app password - that's it!
const GMAIL_USER = env.GMAIL_USER || 'giddel100@gmail.com';
const GMAIL_APP_PASSWORD = env.GMAIL_APP_PASSWORD;

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
	if (!transporter && GMAIL_APP_PASSWORD) {
		transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: GMAIL_USER,
				pass: GMAIL_APP_PASSWORD
			}
		});
	}
	return transporter;
}

interface EmailOptions {
	to: string | string[];
	subject: string;
	text: string;
	html: string;
	replyTo?: string;
	fromName?: string;
}

export async function sendEmail({ to, subject, text, html, replyTo, fromName }: EmailOptions): Promise<boolean> {
	const transport = getTransporter();

	// If Gmail is not configured, log the email instead
	if (!transport) {
		console.log('📧 Email notification (not sent - Gmail not configured):');
		console.log('To:', to);
		console.log('Subject:', subject);
		console.log('Message:', text);
		console.log('---');
		return true;
	}

	try {
		const recipients = Array.isArray(to) ? to : [to];
		
		// Display the user's name in the From field, with actual email in angle brackets
		const displayFrom = fromName 
			? `${fromName} (via DefenSys) <${GMAIL_USER}>`
			: `DefenSys Security <${GMAIL_USER}>`;

		await transport.sendMail({
			from: displayFrom,
			to: recipients,
			replyTo: replyTo || GMAIL_USER,
			subject,
			text,
			html
		});

		console.log('✅ Email sent successfully to:', recipients);
		return true;
	} catch (error) {
		console.error('❌ Failed to send email:', error);
		// Log instead of failing
		console.log('📧 Email content (failed to send):');
		console.log('To:', to);
		console.log('Subject:', subject);
		console.log('Message:', text);
		return false;
	}
}

export async function sendAdminNotification(
	userName: string,
	userEmail: string,
	subject: string,
	message: string,
	adminEmails: string[]
): Promise<boolean> {
	const emailSubject = `[DefenSys] New Message from ${userName}`;
	const emailText = `
You have received a new message from a user on DefenSys.

User: ${userName} (${userEmail})
Subject: ${subject}

Message:
${message}

---
This is an automated notification from DefenSys Security Platform.
	`.trim();

	const emailHtml = `
<!DOCTYPE html>
<html>
<head>
	<style>
		body {
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
			line-height: 1.6;
			color: #334155;
			max-width: 600px;
			margin: 0 auto;
			padding: 20px;
		}
		.container {
			background: linear-gradient(to bottom, #f8fafc, #ffffff);
			border: 1px solid #e2e8f0;
			border-radius: 12px;
			padding: 30px;
			box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
		}
		.header {
			background: linear-gradient(to right, #3b82f6, #06b6d4);
			color: white;
			padding: 20px;
			border-radius: 8px;
			margin-bottom: 20px;
		}
		.header h1 {
			margin: 0;
			font-size: 24px;
			font-weight: bold;
		}
		.badge {
			display: inline-block;
			background: #ef4444;
			color: white;
			padding: 4px 12px;
			border-radius: 9999px;
			font-size: 12px;
			font-weight: 600;
			margin-top: 8px;
		}
		.info-box {
			background: #f1f5f9;
			border-left: 4px solid #3b82f6;
			padding: 15px;
			margin: 20px 0;
			border-radius: 4px;
		}
		.info-box strong {
			color: #1e293b;
			display: block;
			margin-bottom: 5px;
		}
		.message-box {
			background: white;
			border: 1px solid #e2e8f0;
			border-radius: 8px;
			padding: 20px;
			margin: 20px 0;
		}
		.message-box h3 {
			margin-top: 0;
			color: #1e293b;
			font-size: 16px;
		}
		.message-content {
			color: #475569;
			white-space: pre-wrap;
		}
		.footer {
			margin-top: 30px;
			padding-top: 20px;
			border-top: 1px solid #e2e8f0;
			text-align: center;
			color: #64748b;
			font-size: 14px;
		}
	</style>
</head>
<body>
	<div class="container">
		<div class="header">
			<h1>🛡️ DefenSys Security Platform</h1>
			<span class="badge">NEW MESSAGE</span>
		</div>
		
		<p>You have received a new message from a user:</p>
		
		<div class="info-box">
			<strong>👤 User:</strong> ${userName}
			<strong>📧 Email:</strong> ${userEmail}
			<strong>📌 Subject:</strong> ${subject}
		</div>
		
		<div class="message-box">
			<h3>Message:</h3>
			<div class="message-content">${message}</div>
		</div>
		
		<div class="footer">
			<p>This is an automated notification from DefenSys Security Platform.</p>
			<p>Please log in to the admin dashboard to respond to this message.</p>
		</div>
	</div>
</body>
</html>
	`.trim();

	return await sendEmail({
		to: adminEmails,
		subject: emailSubject,
		text: emailText,
		html: emailHtml,
		replyTo: `${userName} <${userEmail}>`,
		fromName: userName
	});
}
