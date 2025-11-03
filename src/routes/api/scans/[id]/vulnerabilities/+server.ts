import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { connectDB } from '$lib/server/db';
import { Vulnerability } from '$lib/server/models/Vulnerability';
import { Scan } from '$lib/server/models/Scan';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';

export const GET: RequestHandler = async ({ params, request }) => {
	try {
		// Verify authentication
		const token = request.headers.get('authorization')?.replace('Bearer ', '');
		if (!token) {
			return json({ success: false, error: 'Unauthorized' }, { status: 401 });
		}

		try {
			jwt.verify(token, JWT_SECRET);
		} catch {
			return json({ success: false, error: 'Invalid token' }, { status: 401 });
		}

		await connectDB();

		const scanId = params.id;

		// Verify scan exists
		const scan = await Scan.findById(scanId);
		if (!scan) {
			return json({ success: false, error: 'Scan not found' }, { status: 404 });
		}

		// Fetch all vulnerabilities for this scan
		const vulnerabilities = await Vulnerability.find({ scanId })
			.select('type severity title description affectedUrl affectedParameter evidence recommendation createdAt')
			.sort({ severity: 1, createdAt: -1 })
			.lean();

		return json({
			success: true,
			vulnerabilities: vulnerabilities.map(v => ({
				id: v._id?.toString(),
				type: v.type,
				severity: v.severity,
				title: v.title,
				description: v.description,
				affectedUrl: v.affectedUrl,
				affectedParameter: v.affectedParameter,
				evidence: v.evidence,
				recommendation: v.recommendation,
				createdAt: v.createdAt
			}))
		});
	} catch (error) {
		console.error('Fetch vulnerabilities error:', error);
		return json({ success: false, error: 'Failed to fetch vulnerabilities' }, { status: 500 });
	}
};
