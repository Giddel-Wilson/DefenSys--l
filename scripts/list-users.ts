import mongoose from 'mongoose';
import { User } from '../src/lib/server/models/User.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://giddelwilson:10%2EFlash%2E01@cluster0.2kyflvr.mongodb.net/defensys?retryWrites=true&w=majority';

async function listAdmins() {
	try {
		await mongoose.connect(MONGODB_URI);
		console.log('✅ Connected to MongoDB\n');

		// Show all admin users
		const admins = await User.find({ role: 'admin' });
		console.log('📋 Current admin users:');
		admins.forEach(admin => {
			console.log(`   - ${admin.name} (${admin.email})`);
		});

		// Show all users
		const allUsers = await User.find({});
		console.log('\n👥 All users:');
		allUsers.forEach(user => {
			console.log(`   - ${user.name} (${user.email}) - Role: ${user.role}`);
		});

		await mongoose.disconnect();
		console.log('\n✅ Disconnected from MongoDB');
	} catch (error) {
		console.error('❌ Error:', error);
		process.exit(1);
	}
}

listAdmins();
