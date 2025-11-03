import mongoose from 'mongoose';
import { env } from '$env/dynamic/private';

let isConnected = false;

export async function connectDB() {
	if (isConnected) {
		return;
	}

	const MONGODB_URI = env.MONGODB_URI;
	
	if (!MONGODB_URI) {
		console.warn('⚠️  MONGODB_URI not configured. Database operations will fail.');
		throw new Error('MONGODB_URI environment variable is not set');
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
