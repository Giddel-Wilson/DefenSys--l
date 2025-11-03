import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';

export interface TokenPayload {
	userId: string;
	email: string;
	role: 'user' | 'admin';
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
	const salt = await bcrypt.genSalt(12);
	return bcrypt.hash(password, salt);
}

/**
 * Compare a password with a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
	return bcrypt.compare(password, hash);
}

/**
 * Generate a JWT token
 */
export function generateToken(payload: TokenPayload): string {
	return jwt.sign(payload, JWT_SECRET, {
		expiresIn: '7d'
	});
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): TokenPayload | null {
	try {
		return jwt.verify(token, JWT_SECRET) as TokenPayload;
	} catch (error) {
		console.error('Token verification failed:', error);
		return null;
	}
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): { valid: boolean; message?: string } {
	if (password.length < 8) {
		return { valid: false, message: 'Password must be at least 8 characters long' };
	}
	if (!/[A-Z]/.test(password)) {
		return { valid: false, message: 'Password must contain at least one uppercase letter' };
	}
	if (!/[a-z]/.test(password)) {
		return { valid: false, message: 'Password must contain at least one lowercase letter' };
	}
	if (!/[0-9]/.test(password)) {
		return { valid: false, message: 'Password must contain at least one number' };
	}
	return { valid: true };
}
