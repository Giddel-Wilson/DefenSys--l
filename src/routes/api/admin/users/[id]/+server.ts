import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { connectDB } from '$lib/server/db';
import { User } from '$lib/server/models/User';
import { verifyToken } from '$lib/server/auth';
import bcrypt from 'bcryptjs';

// PUT - Update user
export const PUT: RequestHandler = async ({ request, params }) => {
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

		const { id } = params;
		const { name, email, role, status, password } = await request.json();

		const updateData: Record<string, any> = {};
		if (name) updateData.name = name;
		if (email) updateData.email = email.toLowerCase();
		if (role) updateData.role = role;
		if (status) updateData.status = status;
		if (password) {
			updateData.password_hash = await bcrypt.hash(password, 12);
		}

		const updatedUser = await User.findByIdAndUpdate(id, updateData, {
			new: true,
			runValidators: true
		}).select('-password_hash');

		if (!updatedUser) {
			return json({ success: false, error: 'User not found' }, { status: 404 });
		}

		return json({ success: true, user: updatedUser });
	} catch (error: any) {
		console.error('Error updating user:', error);
		return json({ success: false, error: error.message }, { status: 500 });
	}
};

// DELETE - Delete user
export const DELETE: RequestHandler = async ({ request, params }) => {
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

		const { id } = params;

		// Prevent self-deletion
		if (id === decoded.userId) {
			return json({ success: false, error: 'Cannot delete your own account' }, { status: 400 });
		}

		const deletedUser = await User.findByIdAndDelete(id);

		if (!deletedUser) {
			return json({ success: false, error: 'User not found' }, { status: 404 });
		}

		return json({ success: true, message: 'User deleted successfully' });
	} catch (error: any) {
		console.error('Error deleting user:', error);
		return json({ success: false, error: error.message }, { status: 500 });
	}
};
