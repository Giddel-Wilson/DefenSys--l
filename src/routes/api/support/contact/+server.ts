import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sendEmail } from '$lib/server/email';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { name, email, subject, priority, message } = await request.json();

		// Validate required fields
		if (!name || !email || !subject || !message) {
			return json({ error: 'Please fill in all required fields' }, { status: 400 });
		}

		// Validate email
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			return json({ error: 'Please enter a valid email address' }, { status: 400 });
		}

		// Send support email to admin
		try {
			await sendEmail({
				to: 'giddel100@gmail.com',
				subject: `[DefenSys Support] ${priority?.toUpperCase() || 'MEDIUM'}: ${subject}`,
				text: `New Support Request\n\nName: ${name}\nEmail: ${email}\nPriority: ${priority || 'MEDIUM'}\nSubject: ${subject}\n\nMessage:\n${message}\n\nReceived: ${new Date().toLocaleString()}`,
				html: `
					<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
						<div style="background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); padding: 20px; border-radius: 8px 8px 0 0;">
							<h2 style="color: white; margin: 0;">New Support Request</h2>
						</div>
						<div style="background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px;">
							<div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
								<h3 style="color: #1f2937; margin-top: 0;">Contact Information</h3>
								<p><strong>Name:</strong> ${name}</p>
								<p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
								<p><strong>Priority:</strong> <span style="color: ${
									priority === 'urgent' ? '#dc2626' : 
									priority === 'high' ? '#f97316' : 
									priority === 'medium' ? '#f59e0b' : '#10b981'
								}; font-weight: bold; text-transform: uppercase;">${priority || 'MEDIUM'}</span></p>
							</div>
							<div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
								<h3 style="color: #1f2937; margin-top: 0;">Subject</h3>
								<p style="font-size: 16px; font-weight: 600;">${subject}</p>
							</div>
							<div style="background-color: white; padding: 20px; border-radius: 8px;">
								<h3 style="color: #1f2937; margin-top: 0;">Message</h3>
								<p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
							</div>
							<p style="color: #6b7280; font-size: 12px; margin-top: 20px; text-align: center;">
								Received: ${new Date().toLocaleString()}
							</p>
						</div>
					</div>
				`
			});

			// Send confirmation email to user
			await sendEmail({
				to: email,
				subject: 'We received your support request',
				text: `Hi ${name},\n\nThank you for contacting DefenSys Support. We've received your ${priority || 'medium'} priority request about "${subject}" and our team will respond within 2 hours.\n\nReference: ${Date.now()}\nPriority: ${priority || 'Medium'}\n\nBest regards,\nDefenSys Support Team`,
				html: `
					<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
						<div style="background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); padding: 20px; border-radius: 8px 8px 0 0;">
							<h2 style="color: white; margin: 0;">Support Request Received</h2>
						</div>
						<div style="background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px;">
							<p style="font-size: 16px; color: #1f2937;">Hi ${name},</p>
							<p style="color: #4b5563; line-height: 1.6;">
								Thank you for contacting DefenSys Support. We've received your ${priority || 'medium'} priority request about "${subject}" and our team will respond within 2 hours.
							</p>
							<div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
								<p style="color: #6b7280; margin: 0;"><strong>Reference:</strong> ${Date.now()}</p>
								<p style="color: #6b7280; margin: 10px 0 0 0;"><strong>Priority:</strong> ${priority || 'Medium'}</p>
							</div>
							<p style="color: #4b5563; line-height: 1.6;">
								In the meantime, you can:
							</p>
							<ul style="color: #4b5563; line-height: 1.6;">
								<li>Check out our <a href="https://defensys.com/docs" style="color: #3b82f6;">documentation</a></li>
								<li>Browse our <a href="https://defensys.com/support" style="color: #3b82f6;">FAQ section</a></li>
								<li>Visit our community forum</li>
							</ul>
							<p style="color: #4b5563; line-height: 1.6;">
								Best regards,<br/>
								<strong>DefenSys Support Team</strong>
							</p>
							<p style="color: #9ca3af; font-size: 12px; margin-top: 20px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
								This is an automated confirmation email. Please do not reply directly to this message.
							</p>
						</div>
					</div>
				`
			});

			return json({
				success: true,
				message: 'Support request sent successfully. Check your email for confirmation.'
			});
		} catch (emailError) {
			console.error('Failed to send support email:', emailError);
			return json(
				{ error: 'Failed to send support request. Please try again or email us directly.' },
				{ status: 500 }
			);
		}
	} catch (error) {
		console.error('Support request error:', error);
		return json(
			{ error: 'An unexpected error occurred. Please try again.' },
			{ status: 500 }
		);
	}
};
