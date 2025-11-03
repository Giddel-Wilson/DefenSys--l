import mongoose from 'mongoose';
import { MONGODB_URI } from '$env/static/private';

let isConnected = false;

export async function connectDB() {
	if (isConnected) {
		return;
	}

	try {
		const db = await mongoose.connect(MONGODB_URI);
		isConnected = db.connections[0].readyState === 1;
		console.log('✅ MongoDB Connected Successfully');
	} catch (error) {
		console.error('❌ MongoDB Connection Error:', error);
		throw new Error('Failed to connect to MongoDB');
	}
}

export default mongoose;
