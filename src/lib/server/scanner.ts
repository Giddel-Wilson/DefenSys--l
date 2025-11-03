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

			// Crawl URLs (like RiskRadar)
			await this.updateProgress(8, 'Discovering URLs...', isComprehensive ? 420 : 180);
			await this.crawlUrls(isComprehensive);
			await this.updateProgress(12, 'URL discovery complete', isComprehensive ? 380 : 150);

			// SSL/TLS Check (comprehensive includes certificate chain, cipher strength, vulnerabilities)
			await this.updateProgress(15, 'Verifying SSL/TLS security...', isComprehensive ? 360 : 120);
			await this.checkSSLTLS(isComprehensive);
			await this.updateProgress(22, 'SSL/TLS verification complete', isComprehensive ? 320 : 100);

			// Security Headers Check (comprehensive checks all headers)
			await this.updateProgress(25, 'Analyzing security headers...', isComprehensive ? 300 : 90);
			await this.checkSecurityHeaders(isComprehensive);
			await this.updateProgress(32, 'Security headers analyzed', isComprehensive ? 280 : 80);

			// Cookie Security Analysis
			await this.updateProgress(35, 'Analyzing cookie security...', isComprehensive ? 260 : 70);
			await this.checkCookieSecurity(isComprehensive);
			await this.updateProgress(40, 'Cookie security analyzed', isComprehensive ? 240 : 65);

			// CORS Policy Analysis
			await this.updateProgress(42, 'Checking CORS policies...', isComprehensive ? 220 : 60);
			await this.checkCORSPolicies(isComprehensive);
			await this.updateProgress(47, 'CORS policies checked', isComprehensive ? 200 : 55);

			// SQL Injection (comprehensive tests more payloads and parameters)
			await this.updateProgress(50, 'Testing for SQL Injection vulnerabilities...', isComprehensive ? 180 : 50);
			await this.scanForSQLInjection(isComprehensive);
			await this.updateProgress(60, 'SQL Injection scan complete', isComprehensive ? 140 : 40);

			// XSS Scanning (comprehensive tests more contexts)
			await this.updateProgress(63, 'Testing for XSS vulnerabilities...', isComprehensive ? 120 : 35);
			await this.scanForXSS(isComprehensive);
			await this.updateProgress(72, 'XSS scan complete', isComprehensive ? 100 : 28);

			// CSRF Check
			await this.updateProgress(75, 'Checking for CSRF vulnerabilities...', isComprehensive ? 80 : 22);
			await this.checkCSRF(isComprehensive);
			await this.updateProgress(80, 'CSRF check complete', isComprehensive ? 60 : 18);

			// Information Disclosure (comprehensive checks more files)
			await this.updateProgress(83, 'Checking for information disclosure...', isComprehensive ? 50 : 15);
			await this.checkInformationDisclosure(isComprehensive);
			await this.updateProgress(88, 'Information disclosure check complete', isComprehensive ? 35 : 10);

			// Server Misconfiguration
			await this.updateProgress(90, 'Checking server configuration...', isComprehensive ? 25 : 8);
			await this.checkServerMisconfiguration(isComprehensive);
			await this.updateProgress(94, 'Server configuration checked', isComprehensive ? 15 : 5);

			await this.updateProgress(97, 'Saving vulnerabilities...', 3);
			await this.saveVulnerabilities();
			await this.completeScan();
		} catch (error) {
			console.error('Scan error:', error);
			await Scan.findByIdAndUpdate(this.scanId, {
				status: 'failed',
				progress: 0,
				currentActivity: 'Scan failed',
				estimatedTimeRemaining: '0 seconds'
			});
		}
	}

	private async updateProgress(progress: number, activity: string = '', estimatedSeconds: number = 0): Promise<void> {
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

	// URL Crawler (inspired by RiskRadar)
	private async crawlUrls(isComprehensive: boolean = false): Promise<void> {
		try {
			const maxUrls = isComprehensive ? 50 : 20; // Comprehensive scans more URLs
			const { data } = await axios.get(this.targetUrl, { 
				timeout: 10000,
				maxRedirects: 5
			});
			const $ = cheerio.load(data);

			// Extract links
			$('a[href], link[href], script[src], img[src], form[action]').each((_, element) => {
				const href = $(element).attr('href') || $(element).attr('src') || $(element).attr('action');
				if (href) {
					try {
						const absoluteUrl = new URL(href, this.targetUrl).href;
						const baseHost = new URL(this.targetUrl).hostname;
						const urlHost = new URL(absoluteUrl).hostname;
						
						// Only add URLs from same domain
						if (urlHost === baseHost && !absoluteUrl.includes('#') && this.discoveredUrls.size < maxUrls) {
							this.discoveredUrls.add(absoluteUrl);
						}
					} catch {
						// Invalid URL
					}
				}
			});

			console.log(`Discovered ${this.discoveredUrls.size} URLs for scanning`);
		} catch (error) {
			console.error('URL crawling error:', error);
		}
	}

	// Enhanced SQL Injection Scanner (based on RiskRadar approach)
	private async scanForSQLInjection(isComprehensive: boolean = false): Promise<void> {
		console.log('Scanning for SQL Injection vulnerabilities...');
		const urlsToTest = Array.from(this.discoveredUrls).slice(0, isComprehensive ? 15 : 5);
		const testParams = isComprehensive 
			? ['id', 'user', 'search', 'q', 'page', 'query', 'name', 'email', 'pid', 'uid', 'category', 'product']
			: ['id', 'user', 'search', 'q', 'page'];

		const payloads = isComprehensive 
			? [
				"' OR '1'='1",
				"' OR '1'='1' -- ",
				"' OR '1'='1' /* ",
				"' UNION SELECT NULL-- ",
				"' UNION SELECT NULL, NULL-- ",
				"' UNION SELECT NULL, NULL, NULL-- ",
				"' AND 1=1-- ",
				"' AND 1=2-- ",
				"' OR 1=1-- ",
				"' OR IF(1=1, SLEEP(3), 0)-- ",
				"admin'--",
				"' OR 'x'='x",
				"1' OR '1'='1",
				"') OR ('1'='1",
				"' WAITFOR DELAY '00:00:03'-- "
			]
			: [
				"' OR '1'='1",
				"' OR '1'='1' -- ",
				"' UNION SELECT NULL-- ",
				"' OR IF(1=1, SLEEP(2), 0)-- ",
				"admin'--",
				"' OR 1=1-- "
			];

		for (const url of urlsToTest) {
			const urlObj = new URL(url);
			const hasParams = urlObj.search !== '';
			
			for (const param of testParams) {
				let foundVulnerability = false;

				for (const payload of payloads) {
					try {
						const testUrl = hasParams 
							? `${url}&${param}=${encodeURIComponent(payload)}`
							: `${url}?${param}=${encodeURIComponent(payload)}`;

						const startTime = Date.now();
						const response = await axios.get(testUrl, {
							timeout: 5000,
							validateStatus: () => true
						});
						const responseTime = Date.now() - startTime;

						// Check for SQL error patterns
						const sqlErrors = [
							'sql syntax',
							'mysql',
							'mysqli',
							'database error',
							'warning: mysql',
							'unclosed quotation mark',
							'quoted string not properly terminated',
							'pg_query',
							'postgresql',
							'syntax error',
							'sqlstate',
							'ora-',
							'microsoft sql',
							'odbc sql server driver',
							'sql server',
							'sqlite',
							'sqlite3',
							'mariadb'
						];

						const responseText = typeof response.data === 'string' 
							? response.data.toLowerCase() 
							: JSON.stringify(response.data).toLowerCase();

						const foundError = sqlErrors.find(error => responseText.includes(error));

						if (foundError) {
							this.vulnerabilities.push({
								type: 'SQL Injection',
								severity: 'critical',
								title: 'SQL Injection Vulnerability Detected',
								description: `The parameter '${param}' appears to be vulnerable to SQL injection attacks. SQL error messages were detected in the response.`,
								affectedUrl: url,
								affectedParameter: param,
								evidence: `Payload: ${payload.substring(0, 50)}... | Error pattern: ${foundError}`,
								recommendation: 'Use parameterized queries (prepared statements) to prevent SQL injection. Never concatenate user input directly into SQL queries. Implement input validation and use an ORM.'
							});
							foundVulnerability = true;
							break;
						}

						// Time-based SQL Injection detection
						const sleepThreshold = isComprehensive ? 3000 : 2000;
						if (responseTime > sleepThreshold && (payload.includes('SLEEP') || payload.includes('WAITFOR'))) {
							this.vulnerabilities.push({
								type: 'SQL Injection',
								severity: 'critical',
								title: 'Time-Based SQL Injection Detected',
								description: `The parameter '${param}' may be vulnerable to time-based SQL injection. The server response was delayed significantly.`,
								affectedUrl: url,
								affectedParameter: param,
								evidence: `Response time: ${responseTime}ms with time-delay payload`,
								recommendation: 'Use parameterized queries and implement proper input validation to prevent SQL injection attacks.'
							});
							foundVulnerability = true;
							break;
						}

					} catch {
						continue;
					}
				}

				if (foundVulnerability) break; // Move to next URL
			}
		}
	}

	// Enhanced XSS Scanner (based on RiskRadar)
	private async scanForXSS(isComprehensive: boolean = false): Promise<void> {
		console.log('Scanning for XSS vulnerabilities...');
		const urlsToTest = Array.from(this.discoveredUrls).slice(0, isComprehensive ? 15 : 5);
		const testParams = isComprehensive
			? ['q', 'search', 'query', 'name', 'comment', 'message', 'text', 'input', 'title', 'description']
			: ['q', 'search', 'query', 'name', 'comment'];

		const payloads = isComprehensive
			? [
				'<script>alert("XSS")</script>',
				'<img src=x onerror=alert("XSS")>',
				'<svg onload=alert("XSS")>',
				'<iframe src="javascript:alert(\'XSS\')">',
				'<body onload=alert("XSS")>',
				'<input onfocus=alert("XSS") autofocus>',
				'"><script>alert(String.fromCharCode(88,83,83))</script>',
				"';alert('XSS');//",
				'<img src="x" onerror="alert(1)">',
				'javascript:alert(1)',
				'<svg><script>alert(1)</script></svg>',
				'<img src=x:alert(1)>',
				'<object data="javascript:alert(1)">',
				'<embed src="javascript:alert(1)">',
				'<math><mi//xlink:href="data:x,<script>alert(1)</script>">'
			]
			: [
				'<script>alert("XSS")</script>',
				'<img src=x onerror=alert("XSS")>',
				'<svg onload=alert("XSS")>',
				"';alert('XSS');//"
			];

		for (const url of urlsToTest) {
			const urlObj = new URL(url);
			const hasParams = urlObj.search !== '';

			for (const param of testParams) {
				let foundVulnerability = false;

				for (const payload of payloads) {
					try {
						const testUrl = hasParams
							? `${url}&${param}=${encodeURIComponent(payload)}`
							: `${url}?${param}=${encodeURIComponent(payload)}`;

						const response = await axios.get(testUrl, {
							timeout: 3000, // Reduced from 5000 to 3000
							validateStatus: () => true
						});

						const responseText = typeof response.data === 'string'
							? response.data
							: JSON.stringify(response.data);

						// Check if payload is reflected unescaped
						if (responseText.includes(payload)) {
							this.vulnerabilities.push({
								type: 'XSS',
								severity: 'high',
								title: 'Reflected XSS Vulnerability Detected',
								description: `The parameter '${param}' reflects user input without proper sanitization, allowing Cross-Site Scripting attacks.`,
								affectedUrl: url,
								affectedParameter: param,
								evidence: `Payload was reflected unescaped: ${payload.substring(0, 80)}`,
								recommendation: 'Implement proper output encoding/escaping for all user-controlled input. Use Content Security Policy (CSP) headers. Validate and sanitize inputs.'
							});
							foundVulnerability = true;
							break;
						}

						// Check for partial escaping (still risky)
						const partiallyEscaped = payload.replace(/</g, '&lt;').replace(/>/g, '&gt;');
						if (responseText.includes(partiallyEscaped)) {
							this.vulnerabilities.push({
								type: 'XSS',
								severity: 'low',
								title: 'Input Reflection with HTML Encoding',
								description: `The parameter '${param}' reflects user input with HTML encoding. While this provides basic protection, ensure all contexts are properly handled.`,
								affectedUrl: url,
								affectedParameter: param,
								evidence: `Encoded payload found in response`,
								recommendation: 'Continue using output encoding and implement Content Security Policy (CSP) for defense-in-depth.'
							});
						}

					} catch {
						continue;
					}
				}

				if (foundVulnerability) break;
			}
		}
	}

	// CSRF Detection (inspired by OWASP ASST)
	private async checkCSRF(isComprehensive: boolean = false): Promise<void> {
		try {
			const response = await axios.get(this.targetUrl, { timeout: 10000 });
			const $ = cheerio.load(response.data);

			$('form').each((_, form) => {
				const $form = $(form);
				const method = ($form.attr('method') || 'get').toLowerCase();
				const hasTokenField = $form.find('input[name*="csrf"], input[name*="token"], input[name="_csrf"], input[type="hidden"][name*="token"]').length > 0;
				const action = $form.attr('action') || 'current page';

				// Only check POST forms
				if (method === 'post' && !hasTokenField) {
					this.vulnerabilities.push({
						type: 'CSRF',
						severity: 'medium',
						title: 'Missing CSRF Protection',
						description: `A POST form was found without visible CSRF token protection. This could allow Cross-Site Request Forgery attacks.`,
						affectedUrl: this.targetUrl,
						evidence: `Form action: ${action}, method: ${method}`,
						recommendation: 'Implement CSRF tokens in all state-changing forms. Use synchronizer token pattern or double-submit cookie pattern.'
					});
				}

				if (isComprehensive) {
					// Check for forms submitted over HTTP
					const formAction = $form.attr('action');
					if (formAction && formAction.startsWith('http://')) {
						this.vulnerabilities.push({
							type: 'CSRF',
							severity: 'high',
							title: 'Form Submitted Over HTTP',
							description: `A form submits data over insecure HTTP: ${formAction}`,
							affectedUrl: this.targetUrl,
							evidence: `Form action: ${formAction}`,
							recommendation: 'All forms should submit data over HTTPS to prevent interception.'
						});
					}

					// Check for forms with autocomplete enabled on sensitive fields
					$form.find('input[type="password"], input[name*="card"], input[name*="ssn"], input[name*="credit"]').each((_, input) => {
						const $input = $(input);
						const autocomplete = $input.attr('autocomplete');
						
						if (autocomplete !== 'off' && autocomplete !== 'new-password') {
							const fieldName = $input.attr('name') || $input.attr('id') || 'unknown';
							this.vulnerabilities.push({
								type: 'CSRF',
								severity: 'low',
								title: 'Sensitive Field with Autocomplete',
								description: `Sensitive field "${fieldName}" allows autocomplete, which could expose data.`,
								affectedUrl: this.targetUrl,
								evidence: `Field: ${fieldName}`,
								recommendation: 'Disable autocomplete on sensitive fields using autocomplete="off" or autocomplete="new-password".'
							});
						}
					});
				}
			});
		} catch {
			// Skip if page can't be checked
		}
	}

	// Information Disclosure Check (inspired by OWASP ASST)
	private async checkInformationDisclosure(isComprehensive: boolean = false): Promise<void> {
		try {
			const sensitiveFiles = isComprehensive 
				? [
					'.env', '.git/config', 'composer.json', 'package.json', 'config.json',
					'web.config', '.htaccess', 'phpinfo.php', 'info.php', 'test.php',
					'db.sql', 'backup.sql', 'dump.sql', '.env.backup', 'config.php',
					'.DS_Store', 'WEB-INF/web.xml', '.git/HEAD', 'README.md',
					'robots.txt', 'sitemap.xml', 'crossdomain.xml', '.well-known/security.txt',
					'adminer.php', 'phpmyadmin/', '.svn/entries', 'Dockerfile'
				]
				: [
					'.env', '.git/config', 'composer.json', 'package.json', 'config.json',
					'web.config', '.htaccess', 'phpinfo.php', 'info.php', 'test.php',
					'db.sql', 'backup.sql', 'dump.sql', '.env.backup', 'config.php'
				];

			const baseUrl = new URL(this.targetUrl);
			const baseOrigin = baseUrl.origin;

			for (const file of sensitiveFiles) {
				try {
					const testUrl = `${baseOrigin}/${file}`;
					const response = await axios.get(testUrl, {
						timeout: 3000,
						validateStatus: () => true
					});

					if (response.status === 200 && response.data && response.data.length > 0) {
						this.vulnerabilities.push({
							type: 'Information Disclosure',
							severity: file.includes('.sql') || file.includes('.env') ? 'critical' : 'high',
							title: 'Sensitive File Exposed',
							description: `The sensitive file '${file}' is publicly accessible and may contain confidential information such as credentials, API keys, or database details.`,
							affectedUrl: testUrl,
							evidence: `HTTP ${response.status} - File size: ${response.data.length} bytes`,
							recommendation: 'Remove or restrict access to sensitive files. Use .htaccess, web.config, or server configuration to block access. Never commit sensitive files to version control.'
						});
					}
				} catch {
					// File doesn't exist or not accessible
				}
			}
		} catch {
			// Skip
		}
	}

	private async checkSecurityHeaders(isComprehensive: boolean = false): Promise<void> {
		return new Promise((resolve) => {
			const urlObj = new URL(this.targetUrl);
			const protocol = urlObj.protocol === 'https:' ? https : http;

			const req = protocol.get(this.targetUrl, (res) => {
				const headers = res.headers;
				
				const securityHeaders = isComprehensive 
					? {
						'strict-transport-security': 'HSTS',
						'x-frame-options': 'X-Frame-Options',
						'x-content-type-options': 'X-Content-Type-Options',
						'x-xss-protection': 'X-XSS-Protection',
						'content-security-policy': 'Content-Security-Policy',
						'referrer-policy': 'Referrer-Policy',
						'permissions-policy': 'Permissions-Policy',
						'cross-origin-embedder-policy': 'Cross-Origin-Embedder-Policy',
						'cross-origin-opener-policy': 'Cross-Origin-Opener-Policy',
						'cross-origin-resource-policy': 'Cross-Origin-Resource-Policy'
					}
					: {
						'strict-transport-security': 'HSTS',
						'x-frame-options': 'X-Frame-Options',
						'x-content-type-options': 'X-Content-Type-Options',
						'x-xss-protection': 'X-XSS-Protection',
						'content-security-policy': 'Content-Security-Policy',
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
							recommendation: `Implement the ${name} header. Example: ${this.getHeaderExample(header)}`
						});
					}
				}

				// Check for server header disclosure
				if (headers['server']) {
					const serverHeader = Array.isArray(headers['server']) ? headers['server'][0] : headers['server'];
					this.vulnerabilities.push({
						type: 'Server Configuration',
						severity: 'low',
						title: 'Server Header Information Disclosure',
						description: `The server header reveals: ${serverHeader}`,
						affectedUrl: this.targetUrl,
						recommendation: 'Remove or obfuscate the Server header to avoid revealing server software and version information.'
					});
				}

				resolve();
			});

			req.on('error', () => resolve());
			req.setTimeout(10000, () => {
				req.destroy();
				resolve();
			});
		});
	}

	private async checkSSLTLS(isComprehensive: boolean = false): Promise<void> {
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
			return;
		}

		// For HTTPS, perform certificate and SSL/TLS checks
		return new Promise((resolve) => {
			const options = {
				hostname: urlObj.hostname,
				port: urlObj.port || 443,
				method: 'GET',
				rejectUnauthorized: false,
				agent: false
			};

			const req = https.get(options, (res) => {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const socket = res.socket as any;
				const cert = socket.getPeerCertificate();
				const cipher = socket.getCipher();
				const protocol = socket.getProtocol();

				// Check for expired certificate
				if (cert && cert.valid_to) {
					const expiryDate = new Date(cert.valid_to);
					if (expiryDate < new Date()) {
						this.vulnerabilities.push({
							type: 'SSL/TLS',
							severity: 'critical',
							title: 'Expired SSL Certificate',
							description: `The SSL certificate expired on ${expiryDate.toLocaleDateString()}.`,
							affectedUrl: this.targetUrl,
							recommendation: 'Renew the SSL certificate immediately.'
						});
					}
				}

				if (isComprehensive) {
					// Check for weak protocols (SSLv2, SSLv3, TLS 1.0, TLS 1.1)
					if (protocol && (protocol === 'SSLv2' || protocol === 'SSLv3' || protocol === 'TLSv1' || protocol === 'TLSv1.1')) {
						this.vulnerabilities.push({
							type: 'SSL/TLS',
							severity: 'high',
							title: 'Weak SSL/TLS Protocol',
							description: `The server supports weak protocol: ${protocol}. This protocol is deprecated and vulnerable.`,
							affectedUrl: this.targetUrl,
							recommendation: 'Disable SSLv2, SSLv3, TLS 1.0, and TLS 1.1. Use TLS 1.2 or TLS 1.3 only.'
						});
					}

					// Check for weak ciphers
					if (cipher && cipher.name) {
						const weakCiphers = ['RC4', 'DES', '3DES', 'MD5', 'NULL', 'EXPORT', 'anon'];
						const isWeak = weakCiphers.some(weak => cipher.name.includes(weak));
						
						if (isWeak) {
							this.vulnerabilities.push({
								type: 'SSL/TLS',
								severity: 'high',
								title: 'Weak Cipher Suite',
								description: `The server uses weak cipher: ${cipher.name}`,
								affectedUrl: this.targetUrl,
								recommendation: 'Configure server to use strong ciphers only (AES-GCM, ChaCha20-Poly1305). Remove RC4, DES, 3DES, and NULL ciphers.'
							});
						}

						// Check for lack of Perfect Forward Secrecy
						const pfsKeywords = ['ECDHE', 'DHE'];
						const hasPFS = pfsKeywords.some(keyword => cipher.name.includes(keyword));
						
						if (!hasPFS) {
							this.vulnerabilities.push({
								type: 'SSL/TLS',
								severity: 'medium',
								title: 'Missing Perfect Forward Secrecy',
								description: `The cipher suite ${cipher.name} does not support Perfect Forward Secrecy (PFS).`,
								affectedUrl: this.targetUrl,
								recommendation: 'Configure server to prefer cipher suites with ECDHE or DHE key exchange.'
							});
						}
					}

					// Check certificate validity and chain
					if (cert) {
						// Check for self-signed certificate
						if (cert.issuer && cert.subject) {
							const issuerCN = cert.issuer.CN;
							const subjectCN = cert.subject.CN;
							
							if (issuerCN === subjectCN) {
								this.vulnerabilities.push({
									type: 'SSL/TLS',
									severity: 'high',
									title: 'Self-Signed Certificate',
									description: 'The certificate is self-signed and not trusted by browsers.',
									affectedUrl: this.targetUrl,
									recommendation: 'Use a certificate from a trusted Certificate Authority (CA).'
								});
							}
						}

						// Check certificate is about to expire (within 30 days)
						if (cert.valid_to) {
							const expiryDate = new Date(cert.valid_to);
							const daysUntilExpiry = Math.floor((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
							
							if (daysUntilExpiry > 0 && daysUntilExpiry <= 30) {
								this.vulnerabilities.push({
									type: 'SSL/TLS',
									severity: 'medium',
									title: 'Certificate Expiring Soon',
									description: `The SSL certificate will expire in ${daysUntilExpiry} days.`,
									affectedUrl: this.targetUrl,
									recommendation: 'Renew the certificate before it expires.'
								});
							}
						}
					}

					// Note: Advanced vulnerability checks (Heartbleed, DROWN, etc.)
					// These would require specialized testing with raw socket connections
					// and specific protocol-level probes. For production, consider using
					// tools like testssl.sh, SSLyze, or nmap scripts.
					
					// Placeholder for future advanced checks:
					// - Heartbleed (CVE-2014-0160): Requires OpenSSL heartbeat probe
					// - DROWN (CVE-2016-0800): Requires SSLv2 probe with RSA key export
					// - CRIME (CVE-2012-4929): Requires TLS compression check
					// - LUCKY13 (CVE-2013-0169): Requires CBC mode timing analysis
					// - Ticketbleed (CVE-2016-9244): Requires session ticket length probe
					// - Logjam (CVE-2015-4000): Requires DHE parameter size check
				}

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
				} else if (error.code === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE' || error.code === 'SELF_SIGNED_CERT_IN_CHAIN') {
					this.vulnerabilities.push({
						type: 'SSL/TLS',
						severity: 'high',
						title: 'Certificate Validation Error',
						description: `SSL certificate validation failed: ${error.message}`,
						affectedUrl: this.targetUrl,
						recommendation: 'Ensure the certificate chain is complete and trusted.'
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

	private async checkCookieSecurity(isComprehensive: boolean = false): Promise<void> {
		return new Promise((resolve) => {
			const urlObj = new URL(this.targetUrl);
			const protocol = urlObj.protocol === 'https:' ? https : http;

			const req = protocol.get(this.targetUrl, (res) => {
				const setCookieHeaders = res.headers['set-cookie'];
				
				if (!setCookieHeaders || setCookieHeaders.length === 0) {
					resolve();
					return;
				}

				setCookieHeaders.forEach((cookieHeader: string) => {
					const cookieName = cookieHeader.split('=')[0];
					const lowerCookie = cookieHeader.toLowerCase();

					// Check for HttpOnly flag
					if (!lowerCookie.includes('httponly')) {
						this.vulnerabilities.push({
							type: 'Cookie Security',
							severity: 'medium',
							title: 'Cookie Missing HttpOnly Flag',
							description: `The cookie "${cookieName}" does not have the HttpOnly flag set, making it accessible to JavaScript and vulnerable to XSS attacks.`,
							affectedUrl: this.targetUrl,
							recommendation: 'Set the HttpOnly flag on all session cookies to prevent XSS-based cookie theft.'
						});
					}

					// Check for Secure flag (only if using HTTPS)
					if (urlObj.protocol === 'https:' && !lowerCookie.includes('secure')) {
						this.vulnerabilities.push({
							type: 'Cookie Security',
							severity: 'high',
							title: 'Cookie Missing Secure Flag',
							description: `The cookie "${cookieName}" does not have the Secure flag set, allowing transmission over unencrypted HTTP.`,
							affectedUrl: this.targetUrl,
							recommendation: 'Set the Secure flag on all cookies when using HTTPS to prevent transmission over insecure connections.'
						});
					}

					// Check for SameSite attribute
					if (!lowerCookie.includes('samesite')) {
						this.vulnerabilities.push({
							type: 'Cookie Security',
							severity: 'medium',
							title: 'Cookie Missing SameSite Attribute',
							description: `The cookie "${cookieName}" does not have the SameSite attribute, making it vulnerable to CSRF attacks.`,
							affectedUrl: this.targetUrl,
							recommendation: 'Set the SameSite attribute to "Strict" or "Lax" to protect against CSRF attacks.'
						});
					}

					if (isComprehensive) {
						// Check for overly permissive Domain attribute
						const domainMatch = cookieHeader.match(/Domain=([^;]+)/i);
						if (domainMatch && domainMatch[1].startsWith('.')) {
							this.vulnerabilities.push({
								type: 'Cookie Security',
								severity: 'low',
								title: 'Cookie with Broad Domain Scope',
								description: `The cookie "${cookieName}" has a broad domain scope: ${domainMatch[1]}`,
								affectedUrl: this.targetUrl,
								recommendation: 'Restrict cookie domain scope to the specific subdomain when possible.'
							});
						}

						// Check for long-lived cookies (Max-Age > 1 year)
						const maxAgeMatch = cookieHeader.match(/Max-Age=(\d+)/i);
						if (maxAgeMatch) {
							const maxAge = parseInt(maxAgeMatch[1]);
							const oneYear = 365 * 24 * 60 * 60;
							
							if (maxAge > oneYear) {
								this.vulnerabilities.push({
									type: 'Cookie Security',
									severity: 'low',
									title: 'Long-Lived Cookie',
									description: `The cookie "${cookieName}" has a very long lifetime (${Math.floor(maxAge / oneYear)} years).`,
									affectedUrl: this.targetUrl,
									recommendation: 'Use shorter cookie lifetimes and implement proper session management.'
								});
							}
						}
					}
				});

				resolve();
			});

			req.on('error', () => resolve());
			req.setTimeout(10000, () => {
				req.destroy();
				resolve();
			});
		});
	}

	private async checkCORSPolicies(isComprehensive: boolean = false): Promise<void> {
		return new Promise((resolve) => {
			const urlObj = new URL(this.targetUrl);
			const protocol = urlObj.protocol === 'https:' ? https : http;

			const req = protocol.get(this.targetUrl, (res) => {
				const headers = res.headers;

				// Check Cross-Origin-Embedder-Policy (COEP)
				if (!headers['cross-origin-embedder-policy']) {
					this.vulnerabilities.push({
						type: 'CORS Policy',
						severity: 'medium',
						title: 'Missing Cross-Origin-Embedder-Policy',
						description: 'The Cross-Origin-Embedder-Policy (COEP) header is not set, which may allow embedding of cross-origin resources without explicit permission.',
						affectedUrl: this.targetUrl,
						recommendation: 'Set Cross-Origin-Embedder-Policy to "require-corp" to enable SharedArrayBuffer and other features securely.'
					});
				}

				// Check Cross-Origin-Opener-Policy (COOP)
				if (!headers['cross-origin-opener-policy']) {
					this.vulnerabilities.push({
						type: 'CORS Policy',
						severity: 'medium',
						title: 'Missing Cross-Origin-Opener-Policy',
						description: 'The Cross-Origin-Opener-Policy (COOP) header is not set, which may allow cross-origin documents to access the window object.',
						affectedUrl: this.targetUrl,
						recommendation: 'Set Cross-Origin-Opener-Policy to "same-origin" to isolate browsing context from cross-origin documents.'
					});
				}

				// Check Cross-Origin-Resource-Policy (CORP)
				if (!headers['cross-origin-resource-policy']) {
					this.vulnerabilities.push({
						type: 'CORS Policy',
						severity: 'medium',
						title: 'Missing Cross-Origin-Resource-Policy',
						description: 'The Cross-Origin-Resource-Policy (CORP) header is not set, which may allow cross-origin loading of resources.',
						affectedUrl: this.targetUrl,
						recommendation: 'Set Cross-Origin-Resource-Policy to "same-origin" or "same-site" to prevent cross-origin resource loading.'
					});
				}

				if (isComprehensive) {
					// Check for permissive CORS configuration
					const accessControlOrigin = headers['access-control-allow-origin'];
					if (accessControlOrigin === '*') {
						this.vulnerabilities.push({
							type: 'CORS Policy',
							severity: 'high',
							title: 'Wildcard CORS Policy',
							description: 'The Access-Control-Allow-Origin header is set to "*", allowing any origin to access resources.',
							affectedUrl: this.targetUrl,
							recommendation: 'Restrict Access-Control-Allow-Origin to specific trusted origins instead of using wildcard.'
						});
					}

					// Check for credentials with wildcard origin
					const accessControlCredentials = headers['access-control-allow-credentials'];
					if (accessControlOrigin === '*' && accessControlCredentials === 'true') {
						this.vulnerabilities.push({
							type: 'CORS Policy',
							severity: 'critical',
							title: 'Dangerous CORS Configuration',
							description: 'The server allows credentials with wildcard origin, which is a critical security misconfiguration.',
							affectedUrl: this.targetUrl,
							recommendation: 'Never use Access-Control-Allow-Credentials: true with Access-Control-Allow-Origin: *.'
						});
					}

					// Check for overly permissive allowed methods
					const accessControlMethods = headers['access-control-allow-methods'];
					if (accessControlMethods && accessControlMethods.includes('*')) {
						this.vulnerabilities.push({
							type: 'CORS Policy',
							severity: 'medium',
							title: 'Permissive CORS Methods',
							description: 'The Access-Control-Allow-Methods header allows all HTTP methods.',
							affectedUrl: this.targetUrl,
							recommendation: 'Explicitly specify allowed HTTP methods instead of using wildcard.'
						});
					}
				}

				resolve();
			});

			req.on('error', () => resolve());
			req.setTimeout(10000, () => {
				req.destroy();
				resolve();
			});
		});
	}

	private async checkServerMisconfiguration(isComprehensive: boolean = false): Promise<void> {
		try {
			// Check for directory listing
			const dirListingUrls = [
				this.targetUrl,
				`${this.targetUrl}/images/`,
				`${this.targetUrl}/uploads/`,
				`${this.targetUrl}/files/`,
				`${this.targetUrl}/assets/`
			];

			for (const url of dirListingUrls.slice(0, isComprehensive ? 5 : 2)) {
				try {
					const response = await axios.get(url, { 
						timeout: 5000,
						validateStatus: () => true
					});

					if (response.data.includes('Index of') || response.data.includes('Directory listing')) {
						this.vulnerabilities.push({
							type: 'Server Configuration',
							severity: 'medium',
							title: 'Directory Listing Enabled',
							description: `Directory listing is enabled at: ${url}`,
							affectedUrl: url,
							recommendation: 'Disable directory listing in web server configuration.'
						});
					}
				} catch {
					// Skip
				}
			}

			if (isComprehensive) {
				// Check for common admin interfaces
				const adminPaths = [
					'/admin',
					'/administrator',
					'/wp-admin',
					'/cpanel',
					'/phpmyadmin',
					'/adminer',
					'/manager',
					'/admin.php',
					'/login',
					'/admin/login'
				];

				for (const path of adminPaths) {
					try {
						const url = new URL(path, this.targetUrl).toString();
						const response = await axios.get(url, { 
							timeout: 3000,
							validateStatus: () => true,
							maxRedirects: 0
						});

						if (response.status === 200 || response.status === 401 || response.status === 403) {
							this.vulnerabilities.push({
								type: 'Server Configuration',
								severity: 'low',
								title: 'Exposed Admin Interface',
								description: `An admin interface is accessible at: ${url}`,
								affectedUrl: url,
								recommendation: 'Restrict access to admin interfaces using IP whitelisting, VPN, or move to non-standard paths.'
							});
						}
					} catch {
						// Skip
					}
				}

				// Check for backup files
				const backupFiles = [
					'.backup',
					'.bak',
					'.old',
					'.zip',
					'backup.zip',
					'backup.sql',
					'db.sql',
					'dump.sql'
				];

				for (const file of backupFiles) {
					try {
						const url = new URL(file, this.targetUrl).toString();
						const response = await axios.head(url, { 
							timeout: 3000,
							validateStatus: () => true
						});

						if (response.status === 200) {
							this.vulnerabilities.push({
								type: 'Server Configuration',
								severity: 'high',
								title: 'Exposed Backup File',
								description: `A backup file is publicly accessible: ${url}`,
								affectedUrl: url,
								recommendation: 'Remove backup files from the web root and implement proper backup procedures.'
							});
						}
					} catch {
						// Skip
					}
				}
			}
		} catch {
			// Skip
		}
	}

	private async saveVulnerabilities(): Promise<void> {
		if (this.vulnerabilities.length === 0) {
			this.vulnerabilities.push({
				type: 'Other',
				severity: 'info',
				title: 'No Major Vulnerabilities Found',
				description: 'The security scan did not detect any major vulnerabilities. However, manual testing is always recommended.',
				affectedUrl: this.targetUrl,
				recommendation: 'Continue to monitor and perform regular security assessments.'
			});
		}

		const vulnerabilityDocs = this.vulnerabilities.map(vuln => ({
			scanId: this.scanId,
			...vuln
		}));

		await Vulnerability.insertMany(vulnerabilityDocs);
	}

	private async completeScan(): Promise<void> {
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
