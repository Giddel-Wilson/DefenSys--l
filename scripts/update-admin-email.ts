import mongoose from 'mongoose';
import { User } from '../src/lib/server/models/User.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://giddelwilson:10%2EFlash%2E01@cluster0.2kyflvr.mongodb.net/defensys?retryWrites=true&w=majority';

async function updateAdminEmail() {
	try {
		await mongoose.connect(MONGODB_URI);
		console.log('✅ Connected to MongoDB');

		// Find the admin user with the fake email
		const admin = await User.findOne({ email: 'admin@defensys.com', role: 'admin' });

		if (admin) {
			// Update to your real email
			admin.email = 'giddel100@gmail.com';
			await admin.save();
			console.log('✅ Admin email updated to: giddel100@gmail.com');
		} else {
			console.log('ℹ️  No admin user with admin@defensys.com found');
		}

		// Show all admin users
		const admins = await User.find({ role: 'admin' });
		console.log('\n📋 Current admin users:');
		admins.forEach(admin => {
			console.log(`   - ${admin.name} (${admin.email})`);
		});

		await mongoose.disconnect();
		console.log('\n✅ Disconnected from MongoDB');
	} catch (error) {
		console.error('❌ Error:', error);
		process.exit(1);
	}
}

updateAdminEmail();
