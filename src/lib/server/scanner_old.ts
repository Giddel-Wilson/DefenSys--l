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

// Enhanced SQL Injection payloads
const SQL_PAYLOADS = [
	"' OR '1'='1",
	"' OR '1'='1' -- ",
	"' OR '1'='1' /* ",
	"' UNION SELECT NULL, NULL, NULL -- ",
	"' AND 1=1 -- ",
	"' AND 1=2 -- ",
	"' OR 1=1 -- ",
	"' OR IF(1=1, SLEEP(3), 0) -- ",
	"admin' --",
	"admin' #",
	"' OR 'x'='x",
	"1' OR '1' = '1",
	"' UNION SELECT username, password FROM users -- "
];

// Enhanced XSS payloads
const XSS_PAYLOADS = [
	'<script>alert("XSS")</script>',
	'<img src=x onerror=alert("XSS")>',
	'<svg onload=alert("XSS")>',
	'<iframe src="javascript:alert(\'XSS\')">',
	'<body onload=alert("XSS")>',
	'<input onfocus=alert("XSS") autofocus>',
	'"><script>alert(String.fromCharCode(88,83,83))</script>',
	"';alert('XSS');//"
];

export class VulnerabilityScanner {
	private scanId: string;
	private targetUrl: string;
	private vulnerabilities: ScanResult[] = [];
	private discoveredUrls: Set<string> = new Set();

	constructor(scanId: string, targetUrl: string) {
		this.scanId = scanId;
		this.targetUrl = targetUrl;
		this.discoveredUrls.add(targetUrl);
	}

	async performScan(): Promise<void> {
		try {
			// Update scan status to running
			await Scan.findByIdAndUpdate(this.scanId, {
				status: 'running',
				startedAt: new Date(),
				progress: 5
			});

			// Crawl URLs
			await this.crawlUrls();
			await this.updateProgress(15);

			// Run all scan modules
			await this.checkSecurityHeaders();
			await this.updateProgress(25);

			await this.checkSSLTLS();
			await this.updateProgress(35);

			await this.scanForSQLInjection();
			await this.updateProgress(55);

			await this.scanForXSS();
			await this.updateProgress(75);

			await this.checkCSRF();
			await this.updateProgress(85);

			await this.checkInformationDisclosure();
			await this.updateProgress(95);

			// Save all vulnerabilities to database
			await this.saveVulnerabilities();

			// Update scan with final results
			await this.completeScan();
		} catch (error) {
			console.error('Scan error:', error);
			await Scan.findByIdAndUpdate(this.scanId, {
				status: 'failed',
				progress: 0
			});
		}
	}

	private async crawlUrls(): Promise<void> {
		try {
			const { data } = await axios.get(this.targetUrl, { timeout: 10000 });
			const $ = cheerio.load(data);

			$('a[href]').each((_, element) => {
				const href = $(element).attr('href');
				if (href) {
					try {
						const absoluteUrl = new URL(href, this.targetUrl).href;
						const baseHost = new URL(this.targetUrl).hostname;
						const urlHost = new URL(absoluteUrl).hostname;
						
						// Only add URLs from the same domain
						if (urlHost === baseHost && !absoluteUrl.includes('#') && this.discoveredUrls.size < 20) {
							this.discoveredUrls.add(absoluteUrl);
						}
					} catch {
						// Invalid URL, skip
					}
				}
			});

			console.log(`Discovered ${this.discoveredUrls.size} URLs for scanning`);
		} catch (error) {
			console.error('URL crawling error:', error);
			// Continue with just the target URL
		}
	}

	private async updateProgress(progress: number): Promise<void> {
		await Scan.findByIdAndUpdate(this.scanId, { progress });
	}

	private async checkSecurityHeaders(): Promise<void> {
		return new Promise((resolve) => {
			const urlObj = new URL(this.targetUrl);
			const protocol = urlObj.protocol === 'https:' ? https : http;

			const req = protocol.get(this.targetUrl, (res) => {
				const headers = res.headers;
				const securityHeaders = {
					'strict-transport-security': 'HSTS',
					'x-frame-options': 'X-Frame-Options',
					'x-content-type-options': 'X-Content-Type-Options',
					'x-xss-protection': 'X-XSS-Protection',
					'content-security-policy': 'CSP',
					'referrer-policy': 'Referrer-Policy',
					'permissions-policy': 'Permissions-Policy'
				};

				for (const [header, name] of Object.entries(securityHeaders)) {
					if (!headers[header]) {
						this.vulnerabilities.push({
							type: 'Security Headers',
							severity: header === 'content-security-policy' ? 'high' : 'medium',
							title: `Missing ${name} Header`,
							description: `The ${name} security header is not set, which may expose the application to various attacks.`,
							affectedUrl: this.targetUrl,
							recommendation: `Implement the ${name} header to enhance security. Example: ${this.getHeaderExample(header)}`
						});
					}
				}

				// Check for sensitive information disclosure
				if (headers['server']) {
					const serverHeader = Array.isArray(headers['server']) ? headers['server'][0] : headers['server'];
					this.vulnerabilities.push({
						type: 'Insecure Config',
						severity: 'low',
						title: 'Server Header Information Disclosure',
						description: `The server header reveals: ${serverHeader}`,
						affectedUrl: this.targetUrl,
						evidence: serverHeader,
						recommendation: 'Remove or obfuscate the Server header to prevent information disclosure.'
					});
				}

				resolve();
			});

			req.on('error', () => {
				resolve();
			});

			req.setTimeout(10000, () => {
				req.destroy();
				resolve();
			});
		});
	}

	private async checkSSLTLS(): Promise<void> {
		const urlObj = new URL(this.targetUrl);
		
		if (urlObj.protocol === 'http:') {
			this.vulnerabilities.push({
				type: 'SSL/TLS',
				severity: 'critical',
				title: 'Insecure HTTP Protocol',
				description: 'The application is using HTTP instead of HTTPS, which transmits data in plaintext.',
				affectedUrl: this.targetUrl,
				recommendation: 'Implement HTTPS with a valid SSL/TLS certificate to encrypt data in transit.'
			});
		} else {
			// Check for HTTPS but we'll do a basic check
			return new Promise((resolve) => {
				const req = https.get(this.targetUrl, { rejectUnauthorized: false }, () => {
					// Connection successful
					resolve();
				});

				req.on('error', (error: NodeJS.ErrnoException) => {
					if (error.code === 'CERT_HAS_EXPIRED') {
						this.vulnerabilities.push({
							type: 'SSL/TLS',
							severity: 'critical',
							title: 'Expired SSL Certificate',
							description: 'The SSL certificate has expired.',
							affectedUrl: this.targetUrl,
							recommendation: 'Renew the SSL certificate immediately.'
						});
					}
					resolve();
				});

				req.setTimeout(10000, () => {
					req.destroy();
					resolve();
				});
			});
		}
	}

	private async checkSQLInjection(): Promise<void> {
		// Test common SQL injection points
		const testParams = ['id', 'user', 'search', 'query', 'page'];
		const urlObj = new URL(this.targetUrl);
		
		// Check if URL has query parameters that might be vulnerable
		for (const param of testParams) {
			if (urlObj.searchParams.has(param)) {
				this.vulnerabilities.push({
					type: 'SQL Injection',
					severity: 'critical',
					title: 'Potential SQL Injection Point',
					description: `The URL parameter '${param}' may be vulnerable to SQL injection attacks.`,
					affectedUrl: this.targetUrl,
					affectedParameter: param,
					recommendation: 'Use parameterized queries or prepared statements. Validate and sanitize all user inputs. Implement proper input validation.'
				});
			}
		}

		// If no query params, still flag as potential risk if it's a dynamic page
		if (urlObj.pathname.includes('.php') || urlObj.pathname.includes('.asp') || urlObj.pathname.includes('/api/')) {
			this.vulnerabilities.push({
				type: 'SQL Injection',
				severity: 'high',
				title: 'SQL Injection Testing Recommended',
				description: 'This appears to be a dynamic page that may interact with a database. Manual testing for SQL injection is recommended.',
				affectedUrl: this.targetUrl,
				recommendation: 'Perform thorough SQL injection testing. Use parameterized queries and input validation.'
			});
		}
	}

	private async checkXSS(): Promise<void> {
		// Check for potential XSS vulnerabilities
		const urlObj = new URL(this.targetUrl);

		// Check for input parameters that might be reflected
		if (urlObj.search) {
			this.vulnerabilities.push({
				type: 'XSS',
				severity: 'high',
				title: 'Potential Cross-Site Scripting (XSS)',
				description: 'URL contains parameters that may be reflected in the response without proper encoding.',
				affectedUrl: this.targetUrl,
				recommendation: 'Implement proper output encoding/escaping. Use Content Security Policy (CSP). Sanitize all user inputs.'
			});
		}

		// Basic check for common XSS-prone patterns
		return new Promise((resolve) => {
			const protocol = urlObj.protocol === 'https:' ? https : http;

			const req = protocol.get(this.targetUrl, (res) => {
				let data = '';

				res.on('data', (chunk) => {
					data += chunk;
					// Limit data collection to prevent memory issues
					if (data.length > 100000) {
						req.destroy();
					}
				});

				res.on('end', () => {
					// Check for inline scripts without CSP
					if (data.includes('<script>') && !res.headers['content-security-policy']) {
						this.vulnerabilities.push({
							type: 'XSS',
							severity: 'medium',
							title: 'Inline Scripts Without CSP',
							description: 'The page contains inline scripts but lacks Content Security Policy protection.',
							affectedUrl: this.targetUrl,
							recommendation: 'Implement Content Security Policy to mitigate XSS attacks.'
						});
					}

					// Check for user input reflection (basic)
					if (urlObj.search && data.includes(decodeURIComponent(urlObj.search))) {
						this.vulnerabilities.push({
							type: 'XSS',
							severity: 'high',
							title: 'Reflected User Input Detected',
							description: 'User input from URL parameters appears to be reflected in the page response.',
							affectedUrl: this.targetUrl,
							recommendation: 'Implement proper output encoding and input validation to prevent XSS attacks.'
						});
					}

					resolve();
				});
			});

			req.on('error', () => {
				resolve();
			});

			req.setTimeout(10000, () => {
				req.destroy();
				resolve();
			});
		});
	}

	private async saveVulnerabilities(): Promise<void> {
		if (this.vulnerabilities.length === 0) {
			// Add a positive finding if no vulnerabilities found
			this.vulnerabilities.push({
				type: 'Other',
				severity: 'info',
				title: 'No Major Vulnerabilities Found',
				description: 'The basic security scan did not detect any major vulnerabilities.',
				affectedUrl: this.targetUrl,
				recommendation: 'Continue to monitor and perform regular security assessments.'
			});
		}

		// Save each vulnerability to database
		const vulnerabilityDocs = this.vulnerabilities.map(vuln => ({
			scanId: this.scanId,
			...vuln
		}));

		await Vulnerability.insertMany(vulnerabilityDocs);
	}

	private async completeScan(): Promise<void> {
		// Count vulnerabilities by severity
		const counts = {
			critical: 0,
			high: 0,
			medium: 0,
			low: 0,
			info: 0
		};

		this.vulnerabilities.forEach(vuln => {
			counts[vuln.severity]++;
		});

		await Scan.findByIdAndUpdate(this.scanId, {
			status: 'completed',
			progress: 100,
			completedAt: new Date(),
			totalVulnerabilities: this.vulnerabilities.length,
			criticalCount: counts.critical,
			highCount: counts.high,
			mediumCount: counts.medium,
			lowCount: counts.low,
			infoCount: counts.info
		});
	}

	private getHeaderExample(header: string): string {
		const examples: Record<string, string> = {
			'strict-transport-security': 'max-age=31536000; includeSubDomains',
			'x-frame-options': 'DENY',
			'x-content-type-options': 'nosniff',
			'x-xss-protection': '1; mode=block',
			'content-security-policy': "default-src 'self'",
			'referrer-policy': 'strict-origin-when-cross-origin',
			'permissions-policy': 'geolocation=(), microphone=()'
		};
		return examples[header] || 'See security best practices';
	}
}
