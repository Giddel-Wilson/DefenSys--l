import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true
	},
	email: {
		type: String,
		required: true,
		trim: true,
		lowercase: true
	},
	subject: {
		type: String,
		required: true,
		trim: true
	},
	message: {
		type: String,
		required: true,
		trim: true
	},
	priority: {
		type: String,
		enum: ['low', 'medium', 'high', 'urgent'],
		default: 'medium'
	},
	category: {
		type: String,
		enum: ['technical', 'billing', 'security', 'general'],
		default: 'general'
	},
	status: {
		type: String,
		enum: ['unread', 'read', 'replied', 'archived'],
		default: 'unread'
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

// Add index for faster queries
MessageSchema.index({ status: 1, createdAt: -1 });
MessageSchema.index({ email: 1 });

const Message = mongoose.models.Message || mongoose.model('Message', MessageSchema);

export default Message;
