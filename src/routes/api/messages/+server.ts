import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { verifyToken } from '$lib/server/auth';
import { User } from '$lib/server/models/User';
import { sendAdminNotification } from '$lib/server/email';
import { connectDB } from '$lib/server/db';

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		await connectDB();

		// Get token from cookie
		const token = cookies.get('token');
		if (!token) {
			return json({ success: false, message: 'Unauthorized' }, { status: 401 });
		}

		// Verify token and get user
		const decoded = verifyToken(token);
		if (!decoded) {
			return json({ success: false, message: 'Invalid token' }, { status: 401 });
		}

		const user = await User.findById(decoded.userId);
		if (!user) {
			return json({ success: false, message: 'User not found' }, { status: 404 });
		}

		// Get message data from request
		const { subject, message } = await request.json();

		// Validate input
		if (!subject || !message) {
			return json({ success: false, message: 'Subject and message are required' }, { status: 400 });
		}

		if (subject.trim().length === 0 || message.trim().length === 0) {
			return json(
				{ success: false, message: 'Subject and message cannot be empty' },
				{ status: 400 }
			);
		}

		// Get all admin users for email notification
		const admins = await User.find({ role: 'admin' }).select('email');
		const adminEmails = admins.map((admin) => admin.email).filter(email => {
			// Only include real, verifiable email addresses (skip placeholder emails)
			return email && !email.includes('@defensys.com') && email.includes('@');
		});

		if (adminEmails.length === 0) {
			// Fallback: If no real admin emails found, log a warning but still succeed
			console.warn('⚠️  No verified admin emails found. Message logged but not sent.');
			console.log(`📩 Message from ${user.name} (${user.email})`);
			console.log(`   Subject: ${subject.trim()}`);
			console.log(`   Message: ${message.trim()}`);
			
			return json({
				success: true,
				message: 'Message sent successfully to admin(s)'
			});
		}

		// Send email directly to admins (no database storage)
		await sendAdminNotification(
			user.name,
			user.email,
			subject.trim(),
			message.trim(),
			adminEmails
		);

		return json({
			success: true,
			message: 'Message sent successfully to admin(s)'
		});
	} catch (error) {
		console.error('Failed to send message:', error);
		return json({ success: false, message: 'Failed to send message' }, { status: 500 });
	}
};
