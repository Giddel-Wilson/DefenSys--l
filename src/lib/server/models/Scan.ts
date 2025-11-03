import mongoose from 'mongoose';
const { Schema, model, models } = mongoose;

export interface IScan {
	_id?: string;
	name: string;
	targetUrl: string;
	scanType: 'quick' | 'comprehensive' | 'custom';
	status: 'pending' | 'running' | 'completed' | 'failed';
	progress: number;
	currentActivity?: string;
	estimatedTimeRemaining?: string;
	userId: string;
	startedAt?: Date;
	completedAt?: Date;
	totalVulnerabilities: number;
	criticalCount: number;
	highCount: number;
	mediumCount: number;
	lowCount: number;
	infoCount: number;
	createdAt: Date;
	updatedAt: Date;
}

const scanSchema = new Schema<IScan>(
	{
		name: {
			type: String,
			required: true,
			trim: true
		},
		targetUrl: {
			type: String,
			required: true,
			trim: true
		},
		scanType: {
			type: String,
			enum: ['quick', 'comprehensive', 'custom'],
			default: 'quick'
		},
		status: {
			type: String,
			enum: ['pending', 'running', 'completed', 'failed'],
			default: 'pending'
		},
		progress: {
			type: Number,
			default: 0,
			min: 0,
			max: 100
		},
		currentActivity: {
			type: String,
			default: ''
		},
		estimatedTimeRemaining: {
			type: String,
			default: ''
		},
		userId: {
			type: String,
			required: true,
			index: true
		},
		startedAt: {
			type: Date
		},
		completedAt: {
			type: Date
		},
		totalVulnerabilities: {
			type: Number,
			default: 0
		},
		criticalCount: {
			type: Number,
			default: 0
		},
		highCount: {
			type: Number,
			default: 0
		},
		mediumCount: {
			type: Number,
			default: 0
		},
		lowCount: {
			type: Number,
			default: 0
		},
		infoCount: {
			type: Number,
			default: 0
		}
	},
	{
		timestamps: true
	}
);

// Indexes
scanSchema.index({ userId: 1, createdAt: -1 });
scanSchema.index({ status: 1 });

// Export the model
export const Scan = models.Scan || model<IScan>('Scan', scanSchema);
