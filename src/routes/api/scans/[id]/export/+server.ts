import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { connectDB } from '$lib/server/db';
import { Scan } from '$lib/server/models/Scan';
import { Vulnerability } from '$lib/server/models/Vulnerability';
import { verifyToken } from '$lib/server/auth';
import PDFDocument from 'pdfkit';

interface VulnType {
	type: string;
	severity: string;
	title: string;
	description: string;
	affectedUrl?: string;
	affectedParameter?: string;
	evidence?: string;
	recommendation?: string;
	cveId?: string;
	cvssScore?: number;
	status: string;
}

export const GET: RequestHandler = async ({ request, params, url }) => {
	try {
		const authHeader = request.headers.get('authorization');
		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return json({ success: false, error: 'Unauthorized' }, { status: 401 });
		}

		const token = authHeader.substring(7);
		const payload = verifyToken(token);
		if (!payload) {
			return json({ success: false, error: 'Invalid token' }, { status: 401 });
		}

		await connectDB();

		const { id } = params;
		const format = url.searchParams.get('format') || 'json';

		const scan = await Scan.findById(id);
		if (!scan) {
			return json({ success: false, error: 'Scan not found' }, { status: 404 });
		}

		const vulnerabilities = await Vulnerability.find({ scanId: id }).sort({ severity: 1 });

		// Generate export based on format
		if (format === 'json') {
			const reportData = {
				scan: {
					name: scan.name,
					targetUrl: scan.targetUrl,
					scanType: scan.scanType,
					status: scan.status,
					securityScore: scan.securityScore,
					createdAt: scan.createdAt,
					completedAt: scan.completedAt,
					stats: {
						critical: scan.criticalCount,
						high: scan.highCount,
						medium: scan.mediumCount,
						low: scan.lowCount,
						info: scan.infoCount
					}
				},
				vulnerabilities: vulnerabilities.map((v: VulnType) => ({
					type: v.type,
					severity: v.severity,
					title: v.title,
					description: v.description,
					affectedUrl: v.affectedUrl,
					affectedParameter: v.affectedParameter,
					evidence: v.evidence,
					recommendation: v.recommendation,
					cveId: v.cveId,
					cvssScore: v.cvssScore,
					status: v.status
				})),
				generatedAt: new Date().toISOString()
			};

			return new Response(JSON.stringify(reportData, null, 2), {
				headers: {
					'Content-Type': 'application/json',
					'Content-Disposition': `attachment; filename="${scan.name}-report.json"`
				}
			});
		} else if (format === 'csv') {
			// Generate CSV
			const csvRows = [
				[
					'Type',
					'Severity',
					'Title',
					'Description',
					'Affected URL',
					'Parameter',
					'Recommendation',
					'CVE ID',
					'CVSS Score'
				]
			];

			vulnerabilities.forEach((v: VulnType) => {
				csvRows.push([
					v.type,
					v.severity,
					v.title,
					v.description,
					v.affectedUrl || '',
					v.affectedParameter || '',
					v.recommendation || '',
					v.cveId || '',
					v.cvssScore?.toString() || ''
				]);
			});

			const csvContent = csvRows.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');

			return new Response(csvContent, {
				headers: {
					'Content-Type': 'text/csv',
					'Content-Disposition': `attachment; filename="${scan.name}-report.csv"`
				}
			});
		} else if (format === 'pdf') {
			// Generate PDF using PDFKit
			return new Promise((resolve) => {
				const doc = new PDFDocument({ margin: 50, size: 'A4' });
				const chunks: Buffer[] = [];

				doc.on('data', (chunk) => chunks.push(chunk));
				doc.on('end', () => {
					const pdfBuffer = Buffer.concat(chunks);
					resolve(
						new Response(pdfBuffer, {
							headers: {
								'Content-Type': 'application/pdf',
								'Content-Disposition': `attachment; filename="${scan.name}-report.pdf"`
							}
						})
					);
				});

				// Colors for severity
				const severityColors: Record<string, string> = {
					critical: '#dc2626',
					high: '#ea580c',
					medium: '#f59e0b',
					low: '#3b82f6',
					info: '#64748b'
				};

				// Header
				doc.fontSize(24).fillColor('#1e293b').text('Security Scan Report', { align: 'center' });
				doc.moveDown(0.5);
				doc
					.fontSize(10)
					.fillColor('#64748b')
					.text(`Generated on ${new Date().toLocaleString()}`, { align: 'center' });
				doc.moveDown(2);

				// Scan Information Box
				doc.fillColor('#f1f5f9').rect(50, doc.y, 495, 140).fill();
				doc.fillColor('#1e293b').fontSize(16).text(scan.name, 60, doc.y + 10);
				doc.fillColor('#334155').fontSize(10);
				doc.text(`Target URL: ${scan.targetUrl}`, 60, doc.y + 5);
				doc.text(`Scan Type: ${scan.scanType}`, 60, doc.y + 5);
				doc.text(`Status: ${scan.status}`, 60, doc.y + 5);
				doc.text(`Security Score: ${scan.securityScore || 'N/A'}/100`, 60, doc.y + 5);
				doc.text(`Started: ${new Date(scan.createdAt).toLocaleString()}`, 60, doc.y + 5);
				if (scan.completedAt) {
					doc.text(`Completed: ${new Date(scan.completedAt).toLocaleString()}`, 60, doc.y + 5);
				}
				doc.moveDown(3);

				// Vulnerability Summary Stats
				doc.fontSize(14).fillColor('#334155').text('Vulnerability Summary', { underline: true });
				doc.moveDown(1);

				const statsY = doc.y;
				const statWidth = 90;
				const statHeight = 60;
				const stats = [
					{ label: 'Critical', count: scan.criticalCount, color: '#dc2626', x: 50 },
					{ label: 'High', count: scan.highCount, color: '#ea580c', x: 150 },
					{ label: 'Medium', count: scan.mediumCount, color: '#f59e0b', x: 250 },
					{ label: 'Low', count: scan.lowCount, color: '#3b82f6', x: 350 },
					{ label: 'Info', count: scan.infoCount, color: '#64748b', x: 450 }
				];

				stats.forEach((stat) => {
					doc.fillColor(stat.color).rect(stat.x, statsY, statWidth, statHeight).fill();
					doc
						.fontSize(20)
						.fillColor('#ffffff')
						.text(stat.count.toString(), stat.x, statsY + 15, {
							width: statWidth,
							align: 'center'
						});
					doc.fontSize(10).text(stat.label, stat.x, statsY + 40, {
						width: statWidth,
						align: 'center'
					});
				});

				doc.moveDown(5);

				// Vulnerabilities Section
				doc
					.fontSize(14)
					.fillColor('#334155')
					.text(`Vulnerabilities (${vulnerabilities.length})`, { underline: true });
				doc.moveDown(1);

				vulnerabilities.forEach((vuln: VulnType) => {
					// Check if we need a new page
					if (doc.y > 650) {
						doc.addPage();
					}

					const startY = doc.y;

					// Vulnerability Box
					doc.strokeColor('#e2e8f0').rect(50, startY, 495, 0).stroke();

					// Title with severity badge
					const color = severityColors[vuln.severity] || '#64748b';
					doc.fontSize(12).fillColor('#1e293b').text(vuln.title, 60, startY + 10, {
						width: 350,
						continued: false
					});

					// Severity badge
					doc
						.fillColor(color)
						.fontSize(8)
						.text(vuln.severity.toUpperCase(), 420, startY + 12, {
							width: 70,
							align: 'center'
						});

					doc.moveDown(0.5);

					// Vulnerability details
					doc.fontSize(9).fillColor('#64748b').text(`Type: ${vuln.type}`, 60, doc.y + 5);
					doc.fontSize(9).fillColor('#334155').text(vuln.description, 60, doc.y + 5, { width: 480 });

					if (vuln.affectedUrl) {
						doc.fontSize(8).fillColor('#64748b').text(`Affected URL: ${vuln.affectedUrl}`, 60, doc.y + 5, {
							width: 480
						});
					}

					if (vuln.affectedParameter) {
						doc.text(`Parameter: ${vuln.affectedParameter}`, 60, doc.y + 5);
					}

					if (vuln.evidence) {
						doc.fillColor('#f8fafc').rect(60, doc.y + 5, 480, 30).fill();
						doc
							.fontSize(7)
							.fillColor('#475569')
							.text(vuln.evidence.substring(0, 200), 65, doc.y + 10, { width: 470 });
						doc.moveDown(1);
					}

					if (vuln.recommendation) {
						doc.fillColor('#dbeafe').rect(60, doc.y + 5, 480, 0).fill();
						doc
							.fontSize(8)
							.fillColor('#1e40af')
							.text(`Recommendation: ${vuln.recommendation}`, 65, doc.y + 10, { width: 470 });
					}

					if (vuln.cvssScore || vuln.cveId) {
						doc.moveDown(0.3);
						if (vuln.cvssScore) {
							doc.fontSize(8).fillColor('#64748b').text(`CVSS Score: ${vuln.cvssScore}`, 60, doc.y + 5);
						}
						if (vuln.cveId) {
							doc.text(`CVE ID: ${vuln.cveId}`, 60, doc.y + 5);
						}
					}

					doc.moveDown(1.5);
				});

				// Footer
				doc
					.fontSize(8)
					.fillColor('#94a3b8')
					.text(
						`Report generated by DefenSys - Page ${doc.bufferedPageRange().count}`,
						50,
						doc.page.height - 50,
						{ align: 'center' }
					);

				doc.end();
			});
		}

		return json({ success: false, error: 'Invalid format' }, { status: 400 });
	} catch (error: unknown) {
		console.error('Error exporting report:', error);
		return json(
			{ success: false, error: error instanceof Error ? error.message : 'Unknown error' },
			{ status: 500 }
		);
	}
};
