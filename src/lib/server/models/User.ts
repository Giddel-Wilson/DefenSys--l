import mongoose from 'mongoose';

const { Schema, model, models } = mongoose;

export interface IUser {
	_id?: string;
	name: string;
	email: string;
	password_hash: string;
	role: 'user' | 'admin';
	status: 'active' | 'suspended' | 'banned';
	created_at: Date;
	updated_at?: Date;
}

const UserSchema = new Schema<IUser>(
	{
		name: {
			type: String,
			required: [true, 'Name is required'],
			trim: true,
			minlength: [2, 'Name must be at least 2 characters long']
		},
		email: {
			type: String,
			required: [true, 'Email is required'],
			unique: true,
			lowercase: true,
			trim: true,
			match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
			index: true // Explicitly set index here instead of using UserSchema.index()
		},
		password_hash: {
			type: String,
			required: [true, 'Password is required'],
			minlength: [6, 'Password must be at least 6 characters long']
		},
		role: {
			type: String,
			enum: ['user', 'admin'],
			default: 'user'
		},
		status: {
			type: String,
			enum: ['active', 'suspended', 'banned'],
			default: 'active'
		},
		created_at: {
			type: Date,
			default: Date.now
		},
		updated_at: {
			type: Date
		}
	},
	{
		timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
	}
);

// Index for faster queries (email index is already set in schema definition)
UserSchema.index({ role: 1, status: 1 });

export const User = models.User || model<IUser>('User', UserSchema);
