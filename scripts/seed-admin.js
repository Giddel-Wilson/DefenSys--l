import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://giddelwilson:10.Flash.01@cluster0.9u7m3eg.mongodb.net/defensys?retryWrites=true&w=majority';

// User Schema
const UserSchema = new mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true, lowercase: true },
	password_hash: { type: String, required: true },
	role: { type: String, enum: ['user', 'admin'], default: 'user' },
	status: { type: String, enum: ['active', 'suspended', 'banned'], default: 'active' },
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date }
}, {
	timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function seedDefaultAdmin() {
	try {
		console.log('🔗 Connecting to MongoDB...');
		await mongoose.connect(MONGODB_URI);
		console.log('✅ Connected to MongoDB');

		// Default admin credentials
		const adminEmail = 'admin@defensys.com';
		const adminPassword = 'Admin123!@#';
		const adminName = 'System Administrator';

		// Check if admin already exists
		const existingAdmin = await User.findOne({ email: adminEmail });

		if (existingAdmin) {
			console.log('⚠️  Default admin account already exists');
			console.log('📧 Email:', adminEmail);
			console.log('👤 Name:', existingAdmin.name);
			console.log('🔑 Role:', existingAdmin.role);
			console.log('📊 Status:', existingAdmin.status);
		} else {
			// Hash password
			const salt = await bcrypt.genSalt(12);
			const password_hash = await bcrypt.hash(adminPassword, salt);

			// Create admin user
			const admin = await User.create({
				name: adminName,
				email: adminEmail,
				password_hash,
				role: 'admin',
				status: 'active'
			});

			console.log('✨ Default admin account created successfully!');
			console.log('');
			console.log('═══════════════════════════════════════════════');
			console.log('🔐 DEFAULT ADMIN CREDENTIALS');
			console.log('═══════════════════════════════════════════════');
			console.log('📧 Email:    ', adminEmail);
			console.log('🔑 Password: ', adminPassword);
			console.log('👤 Name:     ', adminName);
			console.log('🆔 ID:       ', admin._id.toString());
			console.log('═══════════════════════════════════════════════');
			console.log('');
			console.log('⚠️  IMPORTANT: Please change the password after first login!');
			console.log('');
		}

		await mongoose.disconnect();
		console.log('👋 Disconnected from MongoDB');
		process.exit(0);
	} catch (error) {
		console.error('❌ Error seeding admin:', error);
		process.exit(1);
	}
}

// Run the seed function
seedDefaultAdmin();
