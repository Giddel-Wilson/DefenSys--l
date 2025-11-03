<script lang="ts">
	import Navigation from '$lib/components/Navigation.svelte';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import { goto } from '$app/navigation';
	
	let isLoaded = false;
	let searchQuery = '';
	let activeSection: string | null = null;
	let showApiReference = false;
	let showGuideModal = false;
	let selectedGuide: typeof popularGuides[0] | null = null;
	
	onMount(() => {
		isLoaded = true;
	});

	// Real documentation sections from the codebase
	const docSections = [
		{
			id: 'getting-started',
			title: 'Getting Started',
			items: [
				{ 
					id: 'quick-start',
					title: 'Quick Start Guide', 
					description: 'Sign up, login, and run your first scan in 5 minutes', 
					time: '5 min read',
					content: `
						<h3>Quick Start</h3>
						<ol>
							<li>Sign up at <code>/signup</code> or login at <code>/login</code></li>
							<li>Navigate to your dashboard</li>
							<li>Click "New Scan" button</li>
							<li>Enter target URL (e.g., https://example.com)</li>
							<li>Select scan type (Quick or Comprehensive)</li>
							<li>Monitor results in real-time</li>
						</ol>
					`
				},
				{ 
					id: 'installation',
					title: 'Installation', 
					description: 'Set up DefenSys locally for development', 
					time: '10 min read',
					content: `
						<h3>Installation</h3>
						<p><strong>Prerequisites:</strong></p>
						<ul>
							<li>Node.js 18+ or Bun</li>
							<li>MongoDB Atlas account</li>
							<li>Gmail account (for notifications)</li>
						</ul>
						<p><strong>Steps:</strong></p>
						<pre><code>git clone https://github.com/Giddel-Wilson/DefenSys--l.git
cd DefenSys
bun install
cp .env.example .env
# Edit .env with your credentials
bun run scripts/seed-admin.js
bun dev</code></pre>
					`
				},
				{ 
					id: 'first-scan',
					title: 'Your First Scan', 
					description: 'Create and run your first vulnerability scan', 
					time: '8 min read',
					content: `
						<h3>Running Your First Scan</h3>
						<p>DefenSys scans for:</p>
						<ul>
							<li><strong>SQL Injection:</strong> Database query vulnerabilities</li>
							<li><strong>XSS:</strong> Cross-site scripting attacks</li>
							<li><strong>Security Headers:</strong> Missing CSP, HSTS, X-Frame-Options</li>
							<li><strong>SSL/TLS:</strong> Certificate validity and configuration</li>
							<li><strong>Information Disclosure:</strong> Exposed server information</li>
						</ul>
					`
				},
				{ 
					id: 'configuration',
					title: 'Configuration', 
					description: 'Environment variables and setup options', 
					time: '12 min read',
					content: `
						<h3>Environment Configuration</h3>
						<pre><code># MongoDB
MONGODB_URI=your-mongodb-uri

# JWT Secret
JWT_SECRET=your-secret-key

# Gmail SMTP
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password</code></pre>
					`
				}
			]
		},
		{
			id: 'api-reference',
			title: 'API Reference',
			items: [
				{ 
					id: 'auth-api',
					title: 'Authentication API', 
					description: 'JWT-based authentication endpoints', 
					time: '6 min read',
					content: `
						<h3>Authentication Endpoints</h3>
						<h4>POST /api/auth/signup</h4>
						<pre><code>{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}</code></pre>
						<h4>POST /api/auth/login</h4>
						<pre><code>{
  "email": "john@example.com",
  "password": "SecurePass123!"
}</code></pre>
						<h4>POST /api/auth/logout</h4>
						<p>Clears JWT token and logs out user.</p>
					`
				},
				{ 
					id: 'scanning-api',
					title: 'Scanning API', 
					description: 'Create and manage vulnerability scans', 
					time: '15 min read',
					content: `
						<h3>Scan Management</h3>
						<h4>POST /api/scans/create</h4>
						<pre><code>{
  "name": "Production Scan",
  "targetUrl": "https://example.com",
  "scanType": "comprehensive"
}</code></pre>
						<h4>GET /api/scans</h4>
						<p>Get all scans for authenticated user</p>
						<h4>GET /api/scans/[id]</h4>
						<p>Get detailed scan results with vulnerabilities</p>
					`
				},
				{ 
					id: 'reporting-api',
					title: 'Reporting API', 
					description: 'Export and retrieve scan reports', 
					time: '10 min read',
					content: `
						<h3>Report Generation</h3>
						<h4>GET /api/scans/[id]/export?format=pdf</h4>
						<p>Export scan results as PDF</p>
						<h4>GET /api/scans/[id]/export?format=json</h4>
						<p>Export scan results as JSON</p>
						<h4>GET /api/scans/[id]/vulnerabilities</h4>
						<p>Get all vulnerabilities for a specific scan</p>
					`
				},
				{ 
					id: 'admin-api',
					title: 'Admin API', 
					description: 'User management and system administration', 
					time: '8 min read',
					content: `
						<h3>Admin Endpoints (Admin Role Required)</h3>
						<h4>GET /api/admin/users</h4>
						<p>Get all users in the system</p>
						<h4>PATCH /api/admin/users/[id]</h4>
						<pre><code>{
  "role": "admin",
  "status": "active"
}</code></pre>
						<p>Update user role or status (suspend/ban)</p>
					`
				}
			]
		},
		{
			id: 'features',
			title: 'Core Features',
			items: [
				{ 
					id: 'vulnerability-scanning',
					title: 'Vulnerability Scanning', 
					description: 'Comprehensive security assessment capabilities', 
					time: '20 min read',
					content: `
						<h3>Vulnerability Detection</h3>
						<p>DefenSys identifies:</p>
						<ul>
							<li><strong>Critical:</strong> Immediate action required</li>
							<li><strong>High:</strong> Important security issues</li>
							<li><strong>Medium:</strong> Should be addressed soon</li>
							<li><strong>Low:</strong> Minor issues or recommendations</li>
							<li><strong>Info:</strong> Informational findings</li>
						</ul>
					`
				},
				{ 
					id: 'user-management',
					title: 'User Management', 
					description: 'Role-based access control and user administration', 
					time: '15 min read',
					content: `
						<h3>User Roles</h3>
						<ul>
							<li><strong>User:</strong> Create scans, view own reports</li>
							<li><strong>Admin:</strong> Manage users, view all scans, system analytics</li>
						</ul>
						<p><strong>User Status:</strong></p>
						<ul>
							<li>Active - Full access</li>
							<li>Suspended - Temporarily restricted</li>
							<li>Banned - No access</li>
						</ul>
					`
				},
				{ 
					id: 'email-notifications',
					title: 'Email Notifications', 
					description: 'Contact admin feature with email delivery', 
					time: '18 min read',
					content: `
						<h3>Contact Admin Feature</h3>
						<p>Users can send messages directly to admin emails:</p>
						<ul>
							<li>Click "Contact Admin" in dashboard</li>
							<li>Enter subject and message</li>
							<li>Message sent to all admin emails</li>
							<li>No database storage - privacy focused</li>
							<li>Admins can reply directly to user email</li>
						</ul>
					`
				},
				{ 
					id: 'dashboard',
					title: 'Analytics Dashboard', 
					description: 'Real-time security metrics and reporting', 
					time: '25 min read',
					content: `
						<h3>Dashboard Features</h3>
						<ul>
							<li><strong>Security Score:</strong> 0-100 rating based on vulnerabilities</li>
							<li><strong>Scan History:</strong> View all past scans</li>
							<li><strong>Vulnerability Breakdown:</strong> By severity level</li>
							<li><strong>Quick Actions:</strong> New scan, view reports</li>
							<li><strong>Real-time Updates:</strong> Monitor scan progress</li>
						</ul>
					`
				}
			]
		}
	];

	// Filter sections based on search
	$: filteredSections = searchQuery.trim() === '' 
		? docSections 
		: docSections.map(section => ({
				...section,
				items: section.items.filter(item =>
					item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
					item.description.toLowerCase().includes(searchQuery.toLowerCase())
				)
		  })).filter(section => section.items.length > 0);

	function toggleSection(sectionId: string) {
		activeSection = activeSection === sectionId ? null : sectionId;
	}

	function handleQuickStart() {
		goto('/login');
	}

	function toggleApiReference() {
		showApiReference = !showApiReference;
		if (showApiReference) {
			// Scroll to API reference section
			const apiSection = document.getElementById('api-reference');
			if (apiSection) {
				apiSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}
		}
	}

	function toggleExamples() {
		// Scroll to code examples section
		const examplesSection = document.getElementById('code-examples');
		if (examplesSection) {
			examplesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}

	function handleContactSupport() {
		// Navigate to support page which has the contact admin form
		goto('/support');
	}

	function handleJoinCommunity() {
		// Open GitHub repository in new tab
		window.open('https://github.com/defensys/defensys', '_blank');
	}

	function openGuideModal(guide: typeof popularGuides[0]) {
		selectedGuide = guide;
		showGuideModal = true;
		// Prevent body scroll when modal is open
		document.body.style.overflow = 'hidden';
	}

	function closeGuideModal() {
		showGuideModal = false;
		selectedGuide = null;
		// Restore body scroll
		document.body.style.overflow = 'auto';
	}

	// Close modal on Escape key
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && showGuideModal) {
			closeGuideModal();
		}
	}

	// Popular guides with detailed content
	const popularGuides = [
		{
			id: 'guide-vulnerability-scanning',
			badge: 'Most Popular',
			badgeColor: 'green',
			title: 'Vulnerability Scanning',
			description: 'Comprehensive security scanning with XSS, SQL injection, and CSRF detection. Real-time threat analysis.',
			category: 'Core Feature',
			icon: '🔒 Security',
			details: `
				<h3 class="text-xl font-bold text-white mb-4">Vulnerability Detection Features</h3>
				<p class="text-gray-300 mb-4">DefenSys provides comprehensive security scanning to identify potential vulnerabilities in your web applications:</p>
				
				<div class="space-y-4">
					<div class="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
						<h4 class="text-red-400 font-bold mb-2">🔴 Critical Vulnerabilities</h4>
						<p class="text-gray-300 text-sm">Immediate action required - SQL Injection, Remote Code Execution, Authentication Bypass</p>
					</div>
					
					<div class="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4">
						<h4 class="text-orange-400 font-bold mb-2">🟠 High Priority</h4>
						<p class="text-gray-300 text-sm">Important security issues - XSS vulnerabilities, CSRF tokens missing, Insecure configurations</p>
					</div>
					
					<div class="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
						<h4 class="text-yellow-400 font-bold mb-2">🟡 Medium Priority</h4>
						<p class="text-gray-300 text-sm">Should be addressed soon - Weak encryption, Information disclosure, Cookie security</p>
					</div>
					
					<div class="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
						<h4 class="text-blue-400 font-bold mb-2">🔵 Low Priority</h4>
						<p class="text-gray-300 text-sm">Minor issues - Missing headers, Outdated libraries, Best practice recommendations</p>
					</div>
				</div>
				
				<div class="mt-6 p-4 bg-slate-800/50 rounded-lg">
					<h4 class="text-white font-bold mb-2">Real-time Monitoring</h4>
					<p class="text-gray-300 text-sm">Track scan progress, get instant notifications, and export detailed reports in PDF or JSON format.</p>
				</div>
			`
		},
		{
			id: 'guide-user-management',
			badge: 'Essential',
			badgeColor: 'blue',
			title: 'User Management & Roles',
			description: 'Role-based access control with admin privileges. JWT authentication with secure password hashing.',
			category: 'Authentication',
			icon: '👥 Multi-User',
			details: `
				<h3 class="text-xl font-bold text-white mb-4">User Authentication & Authorization</h3>
				<p class="text-gray-300 mb-4">DefenSys implements a robust user management system with role-based access control:</p>
				
				<div class="space-y-4 mb-6">
					<div class="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
						<h4 class="text-blue-400 font-bold mb-2">🔐 JWT Authentication</h4>
						<p class="text-gray-300 text-sm mb-2">Secure token-based authentication with httpOnly cookies</p>
						<ul class="text-gray-400 text-sm space-y-1 ml-4">
							<li>• Automatic token refresh</li>
							<li>• Secure password hashing with bcrypt</li>
							<li>• Session management</li>
						</ul>
					</div>
					
					<div class="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
						<h4 class="text-purple-400 font-bold mb-2">👑 Role-Based Access Control</h4>
						<p class="text-gray-300 text-sm mb-2">Two user roles with different permissions:</p>
						<ul class="text-gray-400 text-sm space-y-1 ml-4">
							<li>• <strong class="text-white">Admin:</strong> Full access, user management, system settings</li>
							<li>• <strong class="text-white">User:</strong> Create scans, view own reports, contact support</li>
						</ul>
					</div>
				</div>
				
				<div class="p-4 bg-slate-800/50 rounded-lg">
					<h4 class="text-white font-bold mb-2">Admin Features</h4>
					<p class="text-gray-300 text-sm mb-2">Administrators can:</p>
					<ul class="text-gray-400 text-sm space-y-1 ml-4">
						<li>• View and manage all users</li>
						<li>• Update user roles and permissions</li>
						<li>• Suspend or ban user accounts</li>
						<li>• Access system-wide reports</li>
					</ul>
				</div>
			`
		},
		{
			id: 'guide-email-notifications',
			badge: 'New',
			badgeColor: 'purple',
			title: 'Email Notifications',
			description: 'Direct admin contact via Gmail SMTP. Automatic notifications with user reply-to headers.',
			category: 'Communication',
			icon: '📧 Email',
			details: `
				<h3 class="text-xl font-bold text-white mb-4">Email Notification System</h3>
				<p class="text-gray-300 mb-4">DefenSys uses Gmail SMTP to send notifications and enable direct communication:</p>
				
				<div class="space-y-4 mb-6">
					<div class="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
						<h4 class="text-green-400 font-bold mb-2">📨 Contact Admin Feature</h4>
						<p class="text-gray-300 text-sm mb-2">Users can send messages directly to all administrators</p>
						<ul class="text-gray-400 text-sm space-y-1 ml-4">
							<li>• No database storage - emails sent directly</li>
							<li>• User email set as Reply-To header</li>
							<li>• Formatted HTML emails with user details</li>
							<li>• Automatic filtering of test emails</li>
						</ul>
					</div>
					
					<div class="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-4">
						<h4 class="text-cyan-400 font-bold mb-2">⚙️ Gmail SMTP Configuration</h4>
						<p class="text-gray-300 text-sm mb-2">Reliable email delivery using Gmail's infrastructure:</p>
						<ul class="text-gray-400 text-sm space-y-1 ml-4">
							<li>• Gmail App Passwords for authentication</li>
							<li>• Sender shows: "User Name (via DefenSys)"</li>
							<li>• Admins can reply directly to user's email</li>
							<li>• HTML email templates with styling</li>
						</ul>
					</div>
				</div>
				
				<div class="p-4 bg-slate-800/50 rounded-lg">
					<h4 class="text-white font-bold mb-2">Setup Requirements</h4>
					<p class="text-gray-300 text-sm mb-2">Environment variables needed:</p>
					<pre class="text-xs text-gray-400 mt-2 bg-slate-900/50 p-3 rounded">GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password</pre>
				</div>
			`
		}
	];
</script>

<svelte:window on:keydown={handleKeydown} />

<style>
	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(60px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	
	.hover-lift {
		transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
	}
	
	.hover-lift:hover {
		transform: translateY(-8px);
		box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
	}
	
	.glass {
		backdrop-filter: blur(30px);
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
	}
</style>

<div class="overflow-x-hidden">
	<!-- Hero Section -->
	<div class="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden relative">
		<!-- Background Pattern -->
		<div class="absolute inset-0 opacity-10">
			<div class="absolute top-0 left-0 w-48 h-48 sm:w-72 sm:h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
			<div class="absolute top-0 right-0 w-48 h-48 sm:w-72 sm:h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
			<div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-48 h-48 sm:w-72 sm:h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-500"></div>
		</div>

		<Navigation />

		<!-- Hero Content -->
        <div class="relative z-10 px-6 pt-10 pb-20 md:py-20 lg:px-12 lg:py-32 parallax-container">
			<div class="max-w-7xl mx-auto">
				<div class="text-center space-y-8 lg:space-y-12">
					<!-- Badge -->
					<div class="inline-flex items-center justify-center gap-3 bg-blue-900/60 backdrop-blur-sm border border-blue-400/50 rounded-full px-6 py-3 glass {isLoaded ? 'animate-[fadeInUp_0.8s_ease-out_0.1s]' : 'opacity-0'} [animation-fill-mode:both]">
						<svg class="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
							<path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3M5 19V5H9V19H5M19 19H11V5H19V19Z"/>
						</svg>
						<span class="text-white font-bold text-sm md:text-base">Comprehensive Documentation</span>
					</div>
					
					<!-- Main Headline -->
					<div class="space-y-6">
						<h1 class="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight {isLoaded ? 'animate-[fadeInUp_1s_ease-out_0.3s]' : 'opacity-0'} [animation-fill-mode:both]">
							<span class="text-white">Documentation &</span>
							<span class="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400">
								Developer Guides
							</span>
						</h1>
						
						<p class="text-lg sm:text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-4xl mx-auto {isLoaded ? 'animate-[fadeInUp_1s_ease-out_0.5s]' : 'opacity-0'} [animation-fill-mode:both]">
							Complete guides, API references, and tutorials to help you get the most out of DefenSys security platform.
						</p>
					</div>
					
					<!-- Search Bar -->
					<div class="max-w-2xl mx-auto {isLoaded ? 'animate-[fadeInUp_1s_ease-out_0.7s]' : 'opacity-0'} [animation-fill-mode:both]">
						<div class="relative">
							<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
								<svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
								</svg>
							</div>
							<input 
								type="text" 
								bind:value={searchQuery}
								placeholder="Search documentation..."
								class="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-800/50 backdrop-blur-sm border border-blue-500/30 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors text-lg"
							>
						</div>
					</div>
					
					<!-- Quick Links -->
					<div class="flex flex-wrap justify-center gap-4 {isLoaded ? 'animate-[fadeInUp_1s_ease-out_0.9s]' : 'opacity-0'} [animation-fill-mode:both]">
						<button 
							on:click={handleQuickStart}
							class="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
						>
							Quick Start
						</button>
						<button 
							on:click={toggleApiReference}
							class="border border-blue-400 hover:bg-blue-400/10 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:border-blue-300 {showApiReference ? 'bg-blue-400/20 border-blue-300' : ''}"
						>
							API Reference
						</button>
						<button 
							on:click={toggleExamples}
							class="border border-gray-600 hover:bg-gray-600/10 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:border-gray-500 text-gray-300 hover:text-white"
						>
							Examples
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Documentation Sections -->
	<div class="bg-slate-900 py-16 sm:py-20 lg:py-24 relative overflow-x-hidden">
		<div class="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
			<div class="space-y-12 lg:space-y-16">
				{#each filteredSections as section}
					<div id={section.id} class="space-y-6">
						<h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-8">
							{section.title}
						</h2>
						
						{#if section.items.length === 0}
							<p class="text-gray-400 text-center py-8">No results found for "{searchQuery}"</p>
						{:else}
							<div class="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
								{#each section.items as item}
									<button 
										on:click={() => toggleSection(item.id)}
										class="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20 hover:border-blue-400/50 transition-all duration-300 hover-lift glass cursor-pointer text-left w-full {activeSection === item.id ? 'ring-2 ring-blue-400 border-blue-400' : ''}"
									>
										<div class="flex items-start space-x-3 mb-4">
											<div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
												<svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
													<path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
												</svg>
											</div>
											<div class="flex-1 min-w-0">
												<h3 class="text-lg font-bold text-white mb-1 break-words">{item.title}</h3>
												<span class="text-xs text-blue-400 font-medium">{item.time}</span>
											</div>
										</div>
										<p class="text-sm text-gray-400 leading-relaxed mb-4">{item.description}</p>
										<div class="text-blue-400 font-semibold group-hover:text-cyan-400 transition-colors text-sm flex items-center space-x-2">
											<span>{activeSection === item.id ? 'Close' : 'Read More'}</span>
											<svg 
												class="w-4 h-4 transition-transform duration-300 {activeSection === item.id ? 'rotate-90' : 'group-hover:translate-x-1'}" 
												fill="none" 
												stroke="currentColor" 
												viewBox="0 0 24 24"
											>
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
											</svg>
										</div>
									</button>
								{/each}
							</div>
						{/if}

						<!-- Expanded Content -->
						{#each section.items as item}
							{#if activeSection === item.id}
								<div class="mt-6 bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-sm rounded-2xl p-8 border border-blue-400/30 animate-[fadeInUp_0.3s_ease-out]">
									<div class="flex items-center justify-between mb-6">
										<h3 class="text-2xl font-bold text-white">{item.title}</h3>
										<button 
											on:click={() => toggleSection(item.id)}
											class="text-gray-400 hover:text-white transition-colors"
										>
											<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
											</svg>
										</button>
									</div>
									<div class="prose prose-invert prose-blue max-w-none">
										<div class="text-gray-300 leading-relaxed">
											{@html item.content}
										</div>
									</div>
								</div>
							{/if}
						{/each}
					</div>
				{/each}
			</div>
		</div>
	</div>

	<!-- Code Examples Section -->
	<div id="code-examples" class="bg-gradient-to-r from-slate-800 to-slate-900 py-16 sm:py-20 lg:py-24 relative overflow-hidden">
		<div class="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
			<div class="text-center mb-12 sm:mb-16">
				<h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
					Code Examples
				</h2>
				<p class="text-base sm:text-lg lg:text-xl text-gray-400">
					Get started quickly with these practical examples from our codebase
				</p>
			</div>
			
			<div class="grid lg:grid-cols-2 gap-8">
				<!-- Authentication Example -->
				<div class="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 glass overflow-hidden">
					<div class="bg-slate-800/80 px-6 py-4 border-b border-blue-500/20">
						<div class="flex items-center space-x-3">
							<div class="w-3 h-3 rounded-full bg-red-500"></div>
							<div class="w-3 h-3 rounded-full bg-yellow-500"></div>
							<div class="w-3 h-3 rounded-full bg-green-500"></div>
							<span class="text-gray-400 text-sm ml-4">JavaScript - Login</span>
						</div>
					</div>
					<div class="p-6">
						<pre class="text-sm text-gray-300 overflow-x-auto"><code>{`// Login User
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'SecurePass123!'
  })
});

const data = await response.json();
if (data.success) {
  console.log('Logged in:', data.user);
  // JWT token stored in httpOnly cookie
}`}</code></pre>
					</div>
				</div>

				<!-- Create Scan Example -->
				<div class="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 glass overflow-hidden">
					<div class="bg-slate-800/80 px-6 py-4 border-b border-blue-500/20">
						<div class="flex items-center space-x-3">
							<div class="w-3 h-3 rounded-full bg-red-500"></div>
							<div class="w-3 h-3 rounded-full bg-yellow-500"></div>
							<div class="w-3 h-3 rounded-full bg-green-500"></div>
							<span class="text-gray-400 text-sm ml-4">JavaScript - Create Scan</span>
						</div>
					</div>
					<div class="p-6">
						<pre class="text-sm text-gray-300 overflow-x-auto"><code>{`// Create New Scan
const response = await fetch('/api/scans/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Production Website Scan',
    targetUrl: 'https://example.com',
    scanType: 'comprehensive'
  })
});

const data = await response.json();
console.log('Scan ID:', data.scanId);`}</code></pre>
					</div>
				</div>

				<!-- Get Scan Results -->
				<div class="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 glass overflow-hidden">
					<div class="bg-slate-800/80 px-6 py-4 border-b border-blue-500/20">
						<div class="flex items-center space-x-3">
							<div class="w-3 h-3 rounded-full bg-red-500"></div>
							<div class="w-3 h-3 rounded-full bg-yellow-500"></div>
							<div class="w-3 h-3 rounded-full bg-green-500"></div>
							<span class="text-gray-400 text-sm ml-4">JavaScript - Get Results</span>
						</div>
					</div>
					<div class="p-6">
						<pre class="text-sm text-gray-300 overflow-x-auto"><code>{`// Get Scan Results
const scanId = 'your-scan-id';
const response = await fetch(\`/api/scans/\${scanId}\`);
const data = await response.json();

console.log('Security Score:', data.scan.securityScore);
console.log('Total Vulnerabilities:', 
  data.scan.totalVulnerabilities);
console.log('Status:', data.scan.status);`}</code></pre>
					</div>
				</div>

				<!-- Contact Admin Example -->
				<div class="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 glass overflow-hidden">
					<div class="bg-slate-800/80 px-6 py-4 border-b border-blue-500/20">
						<div class="flex items-center space-x-3">
							<div class="w-3 h-3 rounded-full bg-red-500"></div>
							<div class="w-3 h-3 rounded-full bg-yellow-500"></div>
							<div class="w-3 h-3 rounded-full bg-green-500"></div>
							<span class="text-gray-400 text-sm ml-4">JavaScript - Contact Admin</span>
						</div>
					</div>
					<div class="p-6">
						<pre class="text-sm text-gray-300 overflow-x-auto"><code>{`// Send Message to Admin
const response = await fetch('/api/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    subject: 'Need Help',
    message: 'I have a question about scan results...'
  })
});

const data = await response.json();
console.log(data.message); // Message sent!`}</code></pre>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Popular Guides Section -->
	<div class="bg-slate-900 py-16 sm:py-20 lg:py-24 relative overflow-x-hidden">
		<div class="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
			<div class="text-center mb-12 sm:mb-16">
				<h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
					Popular Guides
				</h2>
				<p class="text-base sm:text-lg lg:text-xl text-gray-400">
					Most accessed documentation by our community
				</p>
			</div>
			
			<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
				{#each popularGuides as guide, index (guide.id)}
				<button
					on:click={() => openGuideModal(guide)}
					class="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20 hover:border-blue-400/50 transition-all duration-300 glass text-left cursor-pointer hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20"
					type="button"
				>
					<div class="flex items-center space-x-3 mb-4">
						<div class="w-8 h-8 bg-gradient-to-r {guide.badgeColor === 'green' ? 'from-green-500 to-blue-500' : guide.badgeColor === 'blue' ? 'from-blue-500 to-cyan-500' : 'from-purple-500 to-indigo-500'} rounded-lg flex items-center justify-center flex-shrink-0">
							<span class="text-white font-bold text-sm">{index + 1}</span>
						</div>
						<div class="text-sm {guide.badgeColor === 'green' ? 'text-green-400' : guide.badgeColor === 'blue' ? 'text-blue-400' : 'text-purple-400'} font-semibold">{guide.badge}</div>
					</div>
					<h3 class="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">{guide.title}</h3>
					<p class="text-gray-400 text-sm mb-4">{guide.description}</p>
					<div class="flex items-center justify-between text-xs text-gray-500">
						<span>{guide.category}</span>
						<span>{guide.icon}</span>
					</div>
					<div class="mt-4 flex items-center text-blue-400 text-sm font-semibold group-hover:text-blue-300 transition-colors">
						<span>View Details</span>
						<svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
						</svg>
					</div>
				</button>
				{/each}
			</div>
		</div>
	</div>

	<!-- Guide Modal -->
	{#if showGuideModal && selectedGuide}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div 
		class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
		on:click={closeGuideModal}
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-title"
		tabindex="-1"
		transition:slide={{ duration: 200 }}
	>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div 
			class="relative w-full max-w-4xl max-h-[90vh] bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-blue-500/30"
			on:click|stopPropagation
		>
			<!-- Modal Header (like code window) -->
			<div class="bg-slate-800/80 px-6 py-4 border-b border-blue-500/20 flex items-center justify-between">
				<div class="flex items-center space-x-3">
					<div class="flex space-x-2">
						<div class="w-3 h-3 rounded-full bg-red-500"></div>
						<div class="w-3 h-3 rounded-full bg-yellow-500"></div>
						<div class="w-3 h-3 rounded-full bg-green-500"></div>
					</div>
					<span class="text-gray-400 text-sm ml-4">{selectedGuide.title}</span>
				</div>
				<button 
					on:click={closeGuideModal}
					class="text-gray-400 hover:text-white transition-colors"
					type="button"
					aria-label="Close modal"
				>
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
					</svg>
				</button>
			</div>

			<!-- Modal Content -->
			<div class="overflow-y-auto max-h-[calc(90vh-80px)] p-8">
				<div class="flex items-center space-x-3 mb-6">
					<div class="w-10 h-10 bg-gradient-to-r {selectedGuide.badgeColor === 'green' ? 'from-green-500 to-blue-500' : selectedGuide.badgeColor === 'blue' ? 'from-blue-500 to-cyan-500' : 'from-purple-500 to-indigo-500'} rounded-xl flex items-center justify-center">
						<span class="text-2xl">{selectedGuide.icon.split(' ')[0]}</span>
					</div>
					<div>
						<div class="text-sm {selectedGuide.badgeColor === 'green' ? 'text-green-400' : selectedGuide.badgeColor === 'blue' ? 'text-blue-400' : 'text-purple-400'} font-semibold mb-1">{selectedGuide.badge}</div>
						<h2 id="modal-title" class="text-2xl font-bold text-white">{selectedGuide.title}</h2>
					</div>
				</div>

				<p class="text-gray-300 mb-6">{selectedGuide.description}</p>

				<div class="prose prose-invert max-w-none">
					{@html selectedGuide.details}
				</div>
			</div>
		</div>
	</div>
	{/if}

	<!-- Support CTA Section -->
	<div class="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 py-16 sm:py-20 lg:py-24 relative overflow-x-hidden">
		<div class="relative z-10 max-w-4xl mx-auto text-center px-6 lg:px-12">
			<h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
				Need Help?
			</h2>
			<p class="text-lg sm:text-xl text-gray-300 mb-8">
				Can't find what you're looking for? Our support team is here to help.
			</p>
			<div class="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
				<button 
					on:click={handleContactSupport}
					class="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25"
				>
					Contact Support
				</button>
				<button 
					on:click={handleJoinCommunity}
					class="border-2 border-blue-400 hover:bg-blue-400/10 px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:border-blue-300 text-white"
				>
					Join Community
				</button>
			</div>
		</div>
	</div>
</div>
