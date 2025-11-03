import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/defensys';

const userSchema = new mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password_hash: { type: String, required: true },
	role: { type: String, enum: ['user', 'admin'], default: 'user' },
	status: { type: String, enum: ['active', 'suspended', 'banned'], default: 'active' },
	createdAt: { type: Date, default: Date.now },
	lastLogin: Date
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function createAdmin() {
	try {
		await mongoose.connect(MONGODB_URI);
		console.log('✅ Connected to MongoDB');

		// Check if admin already exists
		const existingAdmin = await User.findOne({ email: 'admin@defensys.com' });
		if (existingAdmin) {
			console.log('⚠️  Admin user already exists');
			console.log('Email:', existingAdmin.email);
			console.log('Role:', existingAdmin.role);
			console.log('Status:', existingAdmin.status);
			
			// Update the password
			const salt = await bcrypt.genSalt(12);
			const password_hash = await bcrypt.hash('Admin123!@#', salt);
			
			existingAdmin.password_hash = password_hash;
			existingAdmin.role = 'admin';
			existingAdmin.status = 'active';
			await existingAdmin.save();
			
			console.log('✅ Admin password updated to: Admin123!@#');
		} else {
			// Create admin user
			const salt = await bcrypt.genSalt(12);
			const password_hash = await bcrypt.hash('Admin123!@#', salt);

			const admin = await User.create({
				name: 'System Administrator',
				email: 'admin@defensys.com',
				password_hash,
				role: 'admin',
				status: 'active'
			});

			console.log('✅ Admin user created successfully!');
			console.log('📧 Email:', admin.email);
			console.log('🔑 Password: Admin123!@#');
			console.log('👤 Name:', admin.name);
			console.log('🛡️  Role:', admin.role);
		}

		await mongoose.disconnect();
		console.log('✅ Disconnected from MongoDB');
	} catch (error) {
		console.error('❌ Error:', error);
		process.exit(1);
	}
}

createAdmin();
