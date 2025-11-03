import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { connectDB } from '$lib/server/db';
import { User } from '$lib/server/models/User';
import { hashPassword, validateEmail, validatePassword, generateToken } from '$lib/server/auth';

export const POST: RequestHandler = async ({ request }) => {
	try {
		await connectDB();

		const { name, email, password } = await request.json();

		// Validation
		if (!name || !email || !password) {
			return json({ error: 'All fields are required' }, { status: 400 });
		}

		if (name.trim().length < 2) {
			return json({ error: 'Name must be at least 2 characters long' }, { status: 400 });
		}

		if (!validateEmail(email)) {
			return json({ error: 'Invalid email format' }, { status: 400 });
		}

		const passwordValidation = validatePassword(password);
		if (!passwordValidation.valid) {
			return json({ error: passwordValidation.message }, { status: 400 });
		}

		// Check if user already exists
		const existingUser = await User.findOne({ email: email.toLowerCase() });
		if (existingUser) {
			return json({ error: 'An account with this email already exists' }, { status: 409 });
		}

		// Hash password
		const password_hash = await hashPassword(password);

		// Create user (always as 'user' role - admins can only be created by other admins)
		const user = await User.create({
			name: name.trim(),
			email: email.toLowerCase(),
			password_hash,
			role: 'user',
			status: 'active'
		});

		// Generate token
		const token = generateToken({
			userId: user._id.toString(),
			email: user.email,
			role: user.role
		});

		return json(
			{
				success: true,
				message: 'Account created successfully',
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
				status: 201,
				headers: {
					'Set-Cookie': `token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${7 * 24 * 60 * 60}`
				}
			}
		);
	} catch (error) {
		console.error('Signup error:', error);
		return json({ error: 'Failed to create account. Please try again.' }, { status: 500 });
	}
};
