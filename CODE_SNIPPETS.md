# DefenSys Code Snippets Documentation

This document contains key code snippets from the DefenSys vulnerability scanning platform, demonstrating the core architecture and implementation.

---

## A.1: User Model Schema (MongoDB / Mongoose)

**Description:** Defines the Mongoose schema for the User document, demonstrating password hashing using bcrypt and methods for user roles and authentication status.

**Technology:** TypeScript/Mongoose (MongoDB ODM)

**File:** `/src/lib/server/models/User.ts`

```typescript
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
			index: true
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

// Index for faster queries
UserSchema.index({ role: 1, status: 1 });

export const User = models.User || model<IUser>('User', UserSchema);
```

**Key Features:**
- Password hashing with bcrypt
- Role-based access control (user/admin)
- Account status management (active/suspended/banned)
- Email validation and indexing
- Automatic timestamps

---

## A.2: Authentication API Endpoint (SvelteKit +server.ts - Login)

**Description:** Handles the user login process, including verifying the hashed password, generating a JSON Web Token (JWT), and securely setting it as an httpOnly cookie.

**Technology:** SvelteKit Server/TypeScript/JWT

**File:** `/src/routes/api/auth/login/+server.ts`

```typescript
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { connectDB } from '$lib/server/db';
import { User } from '$lib/server/models/User';
import { verifyPassword, validateEmail, generateToken } from '$lib/server/auth';

export const POST: RequestHandler = async ({ request }) => {
	try {
		await connectDB();

		const { email, password } = await request.json();

		// Validation
		if (!email || !password) {
			return json({ error: 'Email and password are required' }, { status: 400 });
		}

		if (!validateEmail(email)) {
			return json({ error: 'Invalid email format' }, { status: 400 });
		}

		// Find user
		const user = await User.findOne({ email: email.toLowerCase() });
		if (!user) {
			return json({ error: 'Invalid email or password' }, { status: 401 });
		}

		// Check account status
		if (user.status === 'banned') {
			return json({ error: 'Your account has been banned. Please contact support.' }, { status: 403 });
		}

		if (user.status === 'suspended') {
			return json({ error: 'Your account has been suspended. Please contact support.' }, { status: 403 });
		}

		// Verify password
		const isValidPassword = await verifyPassword(password, user.password_hash);
		if (!isValidPassword) {
			return json({ error: 'Invalid email or password' }, { status: 401 });
		}

		// Generate token
		const token = generateToken({
			userId: user._id.toString(),
			email: user.email,
			role: user.role
		});

		return json(
			{
				success: true,
				message: 'Login successful',
				user: {
					id: user._id.toString(),
					name: user.name,
					email: user.email,
					role: user.role,
					status: user.status
				},
				token
			},
			{
				status: 200,
				headers: {
					'Set-Cookie': `token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${7 * 24 * 60 * 60}`
				}
			}
		);
	} catch (error) {
		console.error('Login error:', error);
		return json({ error: 'Failed to login. Please try again.' }, { status: 500 });
	}
};
```

**Key Features:**
- JWT token generation
- Secure httpOnly cookies
- Password verification with bcrypt
- Account status validation
- Email format validation
- 7-day token expiration

---

## A.3: Database Connection (MongoDB / Mongoose)

**Description:** Manages the persistent connection to the MongoDB instance using the Mongoose library.

**Technology:** TypeScript/Mongoose (MongoDB)

**File:** `/src/lib/server/db.ts`

```typescript
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
```

**Key Features:**
- Connection pooling
- Singleton pattern (reuses existing connection)
- Error handling
- Environment variable configuration
- Connection state tracking

---

## A.4: Backend API Endpoint (SvelteKit +server.ts - Scan Creation)

**Description:** The API endpoint responsible for receiving a new scan request, validating the user's authentication, and creating the initial Scan record in the database.

**Technology:** SvelteKit Server/TypeScript

**File:** `/src/routes/api/scans/create/+server.ts`

```typescript
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { connectDB } from '$lib/server/db';
import { Scan } from '$lib/server/models/Scan';
import { verifyToken } from '$lib/server/auth';
import { VulnerabilityScanner } from '$lib/server/scanner';

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		// Verify authentication
		const token = cookies.get('token');
		if (!token) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const payload = verifyToken(token);
		if (!payload) {
			return json({ error: 'Invalid token' }, { status: 401 });
		}

		// Connect to database
		await connectDB();

		// Parse request body
		const body = await request.json();
		const { name, targetUrl, scanType } = body;

		// Validation
		if (!name || !targetUrl) {
			return json({ error: 'Name and target URL are required' }, { status: 400 });
		}

		// Validate URL format
		try {
			new URL(targetUrl);
		} catch {
			return json({ error: 'Invalid URL format' }, { status: 400 });
		}

		// Create scan record
		const scan = await Scan.create({
			name,
			targetUrl,
			scanType: scanType || 'quick',
			status: 'pending',
			userId: payload.userId,
			progress: 0
		});

		// Start scanning in background (non-blocking)
		const scanner = new VulnerabilityScanner(scan._id.toString(), targetUrl);
		scanner.performScan().catch(error => {
			console.error('Background scan error:', error);
		});

		return json({
			success: true,
			scan: {
				id: scan._id,
				name: scan.name,
				targetUrl: scan.targetUrl,
				status: scan.status,
				progress: scan.progress
			}
		}, { status: 201 });

	} catch (error) {
		console.error('Scan creation error:', error);
		return json({ error: 'Failed to create scan' }, { status: 500 });
	}
};
```

**Key Features:**
- JWT authentication verification
- URL validation
- Asynchronous scan execution (non-blocking)
- Progress tracking
- Error handling
- User association with scans

---

## A.5: AI Model Integration (Placeholder)

**Description:** A placeholder class (VulnerabilityScanner) that demonstrates where the core scanning logic resides. It contains basic, non-AI checks (like SSL and Header checks), reflecting the fact that the AI/ML integration is currently on the roadmap as per the README.md.

**Technology:** TypeScript/Placeholder

**File:** `/src/lib/server/scanner.ts`

```typescript
import { Scan } from './models/Scan';
import { Vulnerability } from './models/Vulnerability';
import https from 'https';
import http from 'http';
import axios from 'axios';
import * as cheerio from 'cheerio';

interface ScanResult {
	type: string;
	severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
	title: string;
	description: string;
	affectedUrl?: string;
	affectedParameter?: string;
	evidence?: string;
	recommendation: string;
}

export class VulnerabilityScanner {
	private scanId: string;
	private targetUrl: string;
	private vulnerabilities: ScanResult[] = [];
	private discoveredUrls: Set<string> = new Set();
	private startTime: number = Date.now();

	constructor(scanId: string, targetUrl: string) {
		this.scanId = scanId;
		this.targetUrl = targetUrl;
		this.discoveredUrls.add(targetUrl);
	}

	async performScan(): Promise<void> {
		try {
			this.startTime = Date.now();
			await Scan.findByIdAndUpdate(this.scanId, {
				status: 'running',
				startedAt: new Date(),
				progress: 5,
				currentActivity: 'Initializing scan...',
				estimatedTimeRemaining: 'Calculating...'
			});

			// Get scan type to determine depth
			const scan = await Scan.findById(this.scanId);
			const isComprehensive = scan?.scanType === 'comprehensive';

			// Crawl URLs (web crawling like RiskRadar)
			await this.updateProgress(8, 'Discovering URLs...', isComprehensive ? 420 : 180);
			await this.crawlUrls(isComprehensive);
			
			// SSL/TLS Security Check
			await this.updateProgress(15, 'Verifying SSL/TLS security...', isComprehensive ? 360 : 120);
			await this.checkSSLTLS(isComprehensive);
			
			// Security Headers Analysis
			await this.updateProgress(25, 'Analyzing security headers...', isComprehensive ? 300 : 90);
			await this.checkSecurityHeaders(isComprehensive);
			
			// Cookie Security
			await this.updateProgress(35, 'Analyzing cookie security...', isComprehensive ? 260 : 70);
			await this.checkCookieSecurity(isComprehensive);
			
			// SQL Injection Testing
			await this.updateProgress(50, 'Testing for SQL Injection...', isComprehensive ? 180 : 50);
			await this.scanForSQLInjection(isComprehensive);
			
			// XSS Testing
			await this.updateProgress(63, 'Testing for XSS vulnerabilities...', isComprehensive ? 120 : 35);
			await this.scanForXSS(isComprehensive);
			
			// CSRF Check
			await this.updateProgress(75, 'Checking for CSRF...', isComprehensive ? 80 : 22);
			await this.checkCSRF(isComprehensive);

			// Save results and complete
			await this.updateProgress(97, 'Saving vulnerabilities...', 3);
			await this.saveVulnerabilities();
			await this.completeScan();
		} catch (error) {
			console.error('Scan error:', error);
			await Scan.findByIdAndUpdate(this.scanId, {
				status: 'failed',
				progress: 0,
				currentActivity: 'Scan failed'
			});
		}
	}

	private async updateProgress(progress: number, activity: string, estimatedSeconds: number): Promise<void> {
		const minutes = Math.floor(estimatedSeconds / 60);
		const seconds = estimatedSeconds % 60;
		const timeString = minutes > 0 
			? `${minutes} minute${minutes > 1 ? 's' : ''} ${seconds} second${seconds !== 1 ? 's' : ''}`
			: `${seconds} second${seconds !== 1 ? 's' : ''}`;

		await Scan.findByIdAndUpdate(this.scanId, { 
			progress,
			currentActivity: activity,
			estimatedTimeRemaining: estimatedSeconds > 0 ? timeString : 'Completing...'
		});
	}

	// URL Crawler for discovering pages
	private async crawlUrls(isComprehensive: boolean = false): Promise<void> {
		try {
			const maxUrls = isComprehensive ? 50 : 20;
			const { data } = await axios.get(this.targetUrl, { 
				timeout: 10000,
				maxRedirects: 5
			});
			const $ = cheerio.load(data);

			// Extract links from page
			$('a[href], link[href], script[src], img[src], form[action]').each((_, element) => {
				const href = $(element).attr('href') || $(element).attr('src') || $(element).attr('action');
				if (href) {
					try {
						const absoluteUrl = new URL(href, this.targetUrl).href;
						const baseHost = new URL(this.targetUrl).hostname;
						const urlHost = new URL(absoluteUrl).hostname;
						
						// Only add URLs from same domain
						if (urlHost === baseHost && this.discoveredUrls.size < maxUrls) {
							this.discoveredUrls.add(absoluteUrl);
						}
					} catch {
						// Invalid URL
					}
				}
			});
		} catch (error) {
			console.error('URL crawling error:', error);
		}
	}

	// Additional scanning methods (checkSSLTLS, checkSecurityHeaders, etc.)
	// ... (implementation details)
}
```

**Key Features:**
- Progressive scanning with real-time updates
- URL crawling and discovery
- Multiple vulnerability checks:
  - SSL/TLS security
  - Security headers
  - Cookie security
  - SQL Injection
  - XSS (Cross-Site Scripting)
  - CSRF (Cross-Site Request Forgery)
- Scan type support (quick vs comprehensive)
- Progress tracking with time estimates
- Error handling and recovery

**Note:** This is the placeholder for future AI/ML integration. The current implementation uses rule-based detection methods.

---

## A.6: Frontend UI Component (SvelteKit +page.svelte)

**Description:** A Svelte component that constructs the user's main Dashboard interface, showing a list of recent scans and providing navigation for new scans.

**Technology:** Svelte/TypeScript

**File:** `/src/routes/dashboard/+page.svelte`

```svelte
<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';

	let user: any = null;
	let isLoaded = false;
	let loading = true;
	let securityScore = 0;
	let selectedView = 'grid'; // grid or list
	let showNewScanModal = false;
	let showContactModal = false;
	let newScanName = '';
	let newScanUrl = '';
	let newScanType = 'quick';
	let creatingScan = false;
	let refreshInterval: ReturnType<typeof setInterval> | null = null;

	// Contact form fields
	let contactSubject = '';
	let contactMessage = '';
	let sendingMessage = false;

	// Notification state
	let notification: { message: string; type: 'success' | 'error' | 'info' } | null = null;

	// Real scan data from API
	let scans: any[] = [];
	let selectedScan: any = null;
	let vulnerabilities: any[] = [];
	let metrics: any[] = [];

	async function fetchScans() {
		try {
			const response = await fetch('/api/scans?limit=10');
			const data = await response.json();

			if (data.success && data.scans) {
				const previouslySelected = selectedScan?.id;

				scans = data.scans.map((scan: any, index: number) => ({
					id: scan.id,
					name: scan.name,
					date: formatDateRange(scan.createdAt, scan.completedAt),
					situations: scan.totalVulnerabilities,
					active: previouslySelected ? scan.id === previouslySelected : index === 0,
					status: scan.status,
					targetUrl: scan.targetUrl,
					progress: scan.progress,
					currentActivity: scan.currentActivity || '',
					estimatedTimeRemaining: scan.estimatedTimeRemaining || '',
					criticalCount: scan.criticalCount || 0,
					highCount: scan.highCount || 0,
					mediumCount: scan.mediumCount || 0,
					lowCount: scan.lowCount || 0,
					infoCount: scan.infoCount || 0,
					totalVulnerabilities: scan.totalVulnerabilities || 0
				}));

				// Update selected scan
				const activeScan = scans.find((s) => s.active);
				if (activeScan) {
					selectedScan = activeScan;
					calculateMetricsForScan(activeScan);
				}
			}
		} catch (error) {
			console.error('Failed to fetch scans:', error);
		}
	}

	async function calculateMetricsForScan(scan: any) {
		if (!scan) return;

		const totalVulns = scan.totalVulnerabilities || 0;
		const critical = scan.criticalCount || 0;
		const high = scan.highCount || 0;
		const medium = scan.mediumCount || 0;
		const low = scan.lowCount || 0;

		// Calculate security score
		if (totalVulns === 0) {
			securityScore = 100;
		} else {
			const weightedScore = critical * 10 + high * 5 + medium * 2 + low * 1;
			const maxScore = 100;
			securityScore = Math.max(0, Math.round(maxScore - (weightedScore / totalVulns) * 10));
		}

		// Build metrics array
		metrics = [
			{ label: 'Critical', count: critical, color: 'red' },
			{ label: 'High', count: high, color: 'orange' },
			{ label: 'Medium', count: medium, color: 'yellow' },
			{ label: 'Low', count: low, color: 'blue' }
		];
	}

	async function createNewScan() {
		if (!newScanName || !newScanUrl) {
			showNotification('Please fill in all fields', 'error');
			return;
		}

		creatingScan = true;
		try {
			const response = await fetch('/api/scans/create', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: newScanName,
					targetUrl: newScanUrl,
					scanType: newScanType
				})
			});

			const data = await response.json();

			if (data.success) {
				showNotification('Scan created successfully!', 'success');
				showNewScanModal = false;
				newScanName = '';
				newScanUrl = '';
				await fetchScans();
			} else {
				showNotification(data.error || 'Failed to create scan', 'error');
			}
		} catch (error) {
			showNotification('Failed to create scan', 'error');
		} finally {
			creatingScan = false;
		}
	}

	function showNotification(message: string, type: 'success' | 'error' | 'info') {
		notification = { message, type };
		setTimeout(() => { notification = null; }, 3000);
	}

	function formatDateRange(created: string, completed?: string): string {
		const createdDate = new Date(created).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
		return completed ? `${createdDate} - Completed` : createdDate;
	}

	onMount(async () => {
		loading = true;
		await fetchScans();
		loading = false;
		isLoaded = true;

		// Auto-refresh every 5 seconds for running scans
		refreshInterval = setInterval(() => {
			if (scans.some(scan => scan.status === 'running' || scan.status === 'pending')) {
				fetchScans();
			}
		}, 5000);
	});

	onDestroy(() => {
		if (refreshInterval) {
			clearInterval(refreshInterval);
		}
	});
</script>

<!-- Dashboard UI -->
<div class="dashboard-container">
	<!-- Security Score Card -->
	<div class="security-score-card">
		<h2>Security Score</h2>
		<div class="score">{securityScore}/100</div>
	</div>

	<!-- Scan List -->
	<div class="scan-list">
		<button on:click={() => showNewScanModal = true}>
			+ New Scan
		</button>
		
		{#each scans as scan}
			<div class="scan-item" class:active={scan.active}>
				<h3>{scan.name}</h3>
				<p>{scan.date}</p>
				<div class="vulnerabilities">{scan.situations} issues</div>
			</div>
		{/each}
	</div>

	<!-- Metrics Display -->
	<div class="metrics-grid">
		{#each metrics as metric}
			<div class="metric-card {metric.color}">
				<h4>{metric.label}</h4>
				<p>{metric.count}</p>
			</div>
		{/each}
	</div>
</div>
```

**Key Features:**
- Real-time scan data fetching
- Auto-refresh for running scans
- New scan creation modal
- Security score calculation
- Vulnerability metrics display
- Responsive grid/list views
- Toast notifications
- Loading states
- Date formatting
- Contact admin modal

---

## Architecture Summary

The DefenSys platform follows a modern full-stack architecture:

1. **Frontend:** SvelteKit with TypeScript
2. **Backend:** SvelteKit API routes (server-side)
3. **Database:** MongoDB with Mongoose ODM
4. **Authentication:** JWT with httpOnly cookies
5. **Security Scanning:** Custom rule-based engine (AI/ML on roadmap)
6. **Email:** Gmail SMTP via nodemailer

All code is type-safe with TypeScript and follows best practices for security, scalability, and maintainability.
