import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { connectDB } from '$lib/server/db';
import { User } from '$lib/server/models/User';
import { verifyPassword, validateEmail, generateToken } from '$lib/server/auth';

export const POST: RequestHandler = async ({ request }) => {
	try {
		await connectDB();

		const { email, password } = await request.json();

		// Validation
		if (!email || !password) {
			return json({ error: 'Email and password are required' }, { status: 400 });
		}

		if (!validateEmail(email)) {
			return json({ error: 'Invalid email format' }, { status: 400 });
		}

		// Find user
		const user = await User.findOne({ email: email.toLowerCase() });
		if (!user) {
			return json({ error: 'Invalid email or password' }, { status: 401 });
		}

		// Check account status
		if (user.status === 'banned') {
			return json({ error: 'Your account has been banned. Please contact support.' }, { status: 403 });
		}

		if (user.status === 'suspended') {
			return json({ error: 'Your account has been suspended. Please contact support.' }, { status: 403 });
		}

		// Verify password
		const isValidPassword = await verifyPassword(password, user.password_hash);
		if (!isValidPassword) {
			return json({ error: 'Invalid email or password' }, { status: 401 });
		}

		// Generate token
		const token = generateToken({
			userId: user._id.toString(),
			email: user.email,
			role: user.role
		});

		return json(
			{
				success: true,
				message: 'Login successful',
				user: {
					id: user._id.toString(),
					name: user.name,
					email: user.email,
					role: user.role,
					status: user.status
				},
				token
			},
			{
				status: 200,
				headers: {
					'Set-Cookie': `token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${7 * 24 * 60 * 60}`
				}
			}
		);
	} catch (error) {
		console.error('Login error:', error);
		return json({ error: 'Failed to login. Please try again.' }, { status: 500 });
	}
};
