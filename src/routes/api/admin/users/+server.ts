import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { connectDB } from '$lib/server/db';
import { User } from '$lib/server/models/User';
import { verifyToken } from '$lib/server/auth';
import bcrypt from 'bcryptjs';

// GET - Fetch all users
export const GET: RequestHandler = async ({ request }) => {
	try {
		const authHeader = request.headers.get('authorization');
		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return json({ success: false, error: 'Unauthorized' }, { status: 401 });
		}

		const token = authHeader.substring(7);
		const decoded = verifyToken(token);
		
		if (!decoded) {
			return json({ success: false, error: 'Invalid token' }, { status: 401 });
		}

		await connectDB();

		const requestingUser = await User.findById(decoded.userId);
		if (!requestingUser || requestingUser.role !== 'admin') {
			return json({ success: false, error: 'Admin access required' }, { status: 403 });
		}

		const users = await User.find({}).select('-password_hash').sort({ createdAt: -1 });

		return json({ success: true, users });
	} catch (error: any) {
		console.error('Error fetching users:', error);
		return json({ success: false, error: error.message }, { status: 500 });
	}
};

// POST - Create new user
export const POST: RequestHandler = async ({ request }) => {
	try {
		const authHeader = request.headers.get('authorization');
		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return json({ success: false, error: 'Unauthorized' }, { status: 401 });
		}

		const token = authHeader.substring(7);
		const decoded = verifyToken(token);
		
		if (!decoded) {
			return json({ success: false, error: 'Invalid token' }, { status: 401 });
		}

		await connectDB();

		const requestingUser = await User.findById(decoded.userId);
		if (!requestingUser || requestingUser.role !== 'admin') {
			return json({ success: false, error: 'Admin access required' }, { status: 403 });
		}

		const { name, email, password, role } = await request.json();

		if (!name || !email || !password) {
			return json({ success: false, error: 'Missing required fields' }, { status: 400 });
		}

		// Check if user already exists
		const existingUser = await User.findOne({ email: email.toLowerCase() });
		if (existingUser) {
			return json({ success: false, error: 'User with this email already exists' }, { status: 400 });
		}

		// Hash password
		const password_hash = await bcrypt.hash(password, 12);

		// Create user
		const newUser = await User.create({
			name,
			email: email.toLowerCase(),
			password_hash,
			role: role || 'user',
			status: 'active'
		});

		return json({ 
			success: true, 
			user: {
				id: newUser._id.toString(),
				name: newUser.name,
				email: newUser.email,
				role: newUser.role,
				status: newUser.status,
				createdAt: newUser.createdAt
			}
		});
	} catch (error: any) {
		console.error('Error creating user:', error);
		return json({ success: false, error: error.message }, { status: 500 });
	}
};
