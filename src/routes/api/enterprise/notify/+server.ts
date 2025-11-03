import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { EnterpriseNotification } from '$lib/server/models/EnterpriseNotification';
import { connectDB } from '$lib/server/db';
import { sendEmail } from '$lib/server/email';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { email, name, company, message } = await request.json();

		// Validate email
		if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			return json({ error: 'Valid email is required' }, { status: 400 });
		}

		// Connect to database
		await connectDB();

		// Check if email already exists
		const existingNotification = await EnterpriseNotification.findOne({ email });
		if (existingNotification) {
			return json({ error: 'This email is already registered for notifications' }, { status: 400 });
		}

		// Save to database
		const notification = new EnterpriseNotification({
			email,
			name: name || '',
			company: company || '',
			message: message || '',
			createdAt: new Date()
		});

		await notification.save();

		// Send notification email to admin
		try {
			await sendEmail({
				to: 'giddel100@gmail.com',
				subject: 'New Enterprise Notification Signup',
				html: `
					<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
						<h2 style="color: #2563eb;">New Enterprise Interest</h2>
						<p>Someone has signed up for enterprise notifications:</p>
						<div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
							<p><strong>Email:</strong> ${email}</p>
							${name ? `<p><strong>Name:</strong> ${name}</p>` : ''}
							${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
							${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
							<p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
						</div>
						<p style="color: #6b7280; font-size: 14px;">This is an automated notification from DefenSys.</p>
					</div>
				`
			});
		} catch (emailError) {
			console.error('Failed to send notification email:', emailError);
			// Don't fail the request if email fails
		}

		return json({
			success: true,
			message: 'Successfully registered for enterprise notifications'
		});
	} catch (error) {
		console.error('Enterprise notification error:', error);
		return json(
			{ error: 'Failed to register for notifications. Please try again.' },
			{ status: 500 }
		);
	}
};
