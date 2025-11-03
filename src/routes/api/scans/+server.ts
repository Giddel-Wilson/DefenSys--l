import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { connectDB } from '$lib/server/db';
import { Scan } from '$lib/server/models/Scan';
import { verifyToken } from '$lib/server/auth';
import { VulnerabilityScanner } from '$lib/server/scanner';

export const GET: RequestHandler = async ({ cookies, url }) => {
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

		// Query parameters
		const limit = parseInt(url.searchParams.get('limit') || '50');
		const status = url.searchParams.get('status');

		// Build query
		const query: Record<string, string> = {};
		
		// Admin can see all scans, users only see their own
		if (payload.role !== 'admin') {
			query.userId = payload.userId;
		}

		if (status) {
			query.status = status;
		}

		// Fetch scans
		const scans = await Scan.find(query)
			.sort({ createdAt: -1 })
			.limit(limit)
			.select('-__v')
			.lean();

		// Calculate score for each scan
		const scansWithScore = scans.map(scan => {
			const totalVulns = scan.totalVulnerabilities || 0;
			let overallScore = 100;
			
			if (totalVulns > 0) {
				const critical = scan.criticalCount || 0;
				const high = scan.highCount || 0;
				const medium = scan.mediumCount || 0;
				const low = scan.lowCount || 0;
				const info = scan.infoCount || 0;
				
				const weightedScore = critical * 10 + high * 5 + medium * 2 + low * 1 + info * 0.5;
				overallScore = Math.max(0, Math.round(100 - (weightedScore / totalVulns) * 10));
			}

			return {
				id: scan._id,
				name: scan.name,
				targetUrl: scan.targetUrl,
				scanType: scan.scanType,
				status: scan.status,
				progress: scan.progress,
				currentActivity: scan.currentActivity,
				estimatedTimeRemaining: scan.estimatedTimeRemaining,
				totalVulnerabilities: scan.totalVulnerabilities,
				criticalCount: scan.criticalCount,
				highCount: scan.highCount,
				mediumCount: scan.mediumCount,
				lowCount: scan.lowCount,
				infoCount: scan.infoCount,
				overallScore: overallScore,
				startedAt: scan.startedAt,
				completedAt: scan.completedAt,
				createdAt: scan.createdAt
			};
		});

		return json({
			success: true,
			scans: scansWithScore
		});

	} catch (error) {
		console.error('Fetch scans error:', error);
		return json({ error: 'Failed to fetch scans' }, { status: 500 });
	}
};

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

		// Get request body
		const { name, targetUrl, scanType } = await request.json();

		// Validate required fields
		if (!name || !targetUrl) {
			return json({ error: 'Name and target URL are required' }, { status: 400 });
		}

		// Validate URL format
		try {
			new URL(targetUrl);
		} catch {
			return json({ error: 'Invalid URL format' }, { status: 400 });
		}

		// Create new scan
		const newScan = new Scan({
			name: name.trim(),
			targetUrl: targetUrl.trim(),
			scanType: scanType || 'quick',
			userId: payload.userId,
			status: 'pending',
			progress: 0,
			currentActivity: 'Initializing scan...',
			totalVulnerabilities: 0,
			criticalCount: 0,
			highCount: 0,
			mediumCount: 0,
			lowCount: 0,
			infoCount: 0,
			startedAt: new Date(),
			createdAt: new Date()
		});

		await newScan.save();

		// Start real vulnerability scanning in background (non-blocking)
		const scanner = new VulnerabilityScanner(newScan._id.toString(), targetUrl.trim());
		scanner.performScan().catch(error => {
			console.error('Background scan error:', error);
		});

		return json({
			success: true,
			message: 'Scan created successfully',
			scan: {
				id: newScan._id,
				name: newScan.name,
				targetUrl: newScan.targetUrl,
				scanType: newScan.scanType,
				status: newScan.status,
				progress: newScan.progress,
				createdAt: newScan.createdAt
			}
		});

	} catch (error) {
		console.error('Create scan error:', error);
		return json({ error: 'Failed to create scan' }, { status: 500 });
	}
};
