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
