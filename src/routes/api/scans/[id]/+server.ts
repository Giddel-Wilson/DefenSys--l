import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { connectDB } from '$lib/server/db';
import { Scan } from '$lib/server/models/Scan';
import { Vulnerability } from '$lib/server/models/Vulnerability';
import { verifyToken } from '$lib/server/auth';

export const GET: RequestHandler = async ({ cookies, params }) => {
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

		const { id } = params;

		// Fetch scan
		type ScanDoc = Record<string, unknown>;
		const scan = await Scan.findById(id).lean() as ScanDoc | null;

		if (!scan) {
			return json({ error: 'Scan not found' }, { status: 404 });
		}

		// Check authorization (users can only see their own scans, admins can see all)
		if (payload.role !== 'admin' && scan.userId !== payload.userId) {
			return json({ error: 'Forbidden' }, { status: 403 });
		}

		// Fetch vulnerabilities for this scan
		const vulnerabilities = await Vulnerability.find({ scanId: id })
			.sort({ severity: 1, createdAt: -1 })
			.select('-__v')
			.lean();

		return json({
			success: true,
			scan: {
				id: scan._id,
				name: scan.name,
				targetUrl: scan.targetUrl,
				scanType: scan.scanType,
				status: scan.status,
				progress: scan.progress,
				totalVulnerabilities: scan.totalVulnerabilities,
				criticalCount: scan.criticalCount,
				highCount: scan.highCount,
				mediumCount: scan.mediumCount,
				lowCount: scan.lowCount,
				infoCount: scan.infoCount,
				startedAt: scan.startedAt,
				completedAt: scan.completedAt,
				createdAt: scan.createdAt,
				updatedAt: scan.updatedAt
			},
			vulnerabilities: vulnerabilities.map(vuln => ({
				id: vuln._id,
				type: vuln.type,
				severity: vuln.severity,
				title: vuln.title,
				description: vuln.description,
				affectedUrl: vuln.affectedUrl,
				affectedParameter: vuln.affectedParameter,
				evidence: vuln.evidence,
				recommendation: vuln.recommendation,
				cveId: vuln.cveId,
				cvssScore: vuln.cvssScore,
				status: vuln.status,
				createdAt: vuln.createdAt
			}))
		});

	} catch (error) {
		console.error('Fetch scan details error:', error);
		return json({ error: 'Failed to fetch scan details' }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async ({ cookies, params }) => {
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

		const { id } = params;

		// Fetch scan
		const scan = await Scan.findById(id);

		if (!scan) {
			return json({ error: 'Scan not found' }, { status: 404 });
		}

		// Check authorization
		if (payload.role !== 'admin' && scan.userId !== payload.userId) {
			return json({ error: 'Forbidden' }, { status: 403 });
		}

		// Delete scan and its vulnerabilities
		await Scan.findByIdAndDelete(id);
		await Vulnerability.deleteMany({ scanId: id });

		return json({
			success: true,
			message: 'Scan deleted successfully'
		});

	} catch (error) {
		console.error('Delete scan error:', error);
		return json({ error: 'Failed to delete scan' }, { status: 500 });
	}
};

export const PATCH: RequestHandler = async ({ request, cookies, params }) => {
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

		const { id } = params;
		const { action } = await request.json();

		// Fetch scan
		const scan = await Scan.findById(id);

		if (!scan) {
			return json({ error: 'Scan not found' }, { status: 404 });
		}

		// Check authorization
		if (payload.role !== 'admin' && scan.userId !== payload.userId) {
			return json({ error: 'Forbidden' }, { status: 403 });
		}

		// Handle cancel action
		if (action === 'cancel') {
			// Only cancel if scan is running or pending
			if (scan.status === 'running' || scan.status === 'pending') {
				scan.status = 'failed';
				scan.currentActivity = 'Cancelled by user';
				scan.completedAt = new Date();
				await scan.save();

				return json({
					success: true,
					message: 'Scan cancelled successfully',
					scan: {
						id: scan._id,
						status: scan.status,
						currentActivity: scan.currentActivity
					}
				});
			} else {
				return json({ error: 'Scan is not running' }, { status: 400 });
			}
		}

		return json({ error: 'Invalid action' }, { status: 400 });

	} catch (error) {
		console.error('Update scan error:', error);
		return json({ error: 'Failed to update scan' }, { status: 500 });
	}
};
