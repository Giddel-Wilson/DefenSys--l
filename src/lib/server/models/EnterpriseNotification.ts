import mongoose from 'mongoose';

const enterpriseNotificationSchema = new mongoose.Schema({
	name: {
		type: String,
		required: false
	},
	email: {
		type: String,
		required: true,
		lowercase: true,
		trim: true
	},
	company: {
		type: String,
		required: false
	},
	message: {
		type: String,
		required: false
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

// Indexes
enterpriseNotificationSchema.index({ email: 1 });
enterpriseNotificationSchema.index({ createdAt: -1 });

export const EnterpriseNotification = mongoose.models.EnterpriseNotification || 
	mongoose.model('EnterpriseNotification', enterpriseNotificationSchema);
