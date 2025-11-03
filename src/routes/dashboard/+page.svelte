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
	let showCancelModal = false;
	let scanToCancel: string | null = null;
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
	let notificationTimeout: ReturnType<typeof setTimeout> | null = null;

	// Mobile sidebar state
	let showMobileSidebar = false;

	// Real scan data from API
	let scans: any[] = [];

	// Currently selected scan
	let selectedScan: any = null;

	// Vulnerability breakdown by type
	let vulnerabilities: any[] = [];

	// Security metrics by severity and status
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
				} else if (scans.length > 0) {
					scans[0].active = true;
					selectedScan = scans[0];
					calculateMetricsForScan(scans[0]);
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
		const info = scan.infoCount || 0;

		// Calculate security score for this specific scan
		if (totalVulns === 0) {
			securityScore = 100;
		} else {
			const weightedScore = critical * 10 + high * 5 + medium * 2 + low * 1 + info * 0.5;
			const maxScore = 100;
			securityScore = Math.max(0, Math.round(maxScore - (weightedScore / totalVulns) * 10));
		}

		// Calculate the max value for the bars (use the highest count, or at least 10 for better visualization)
		const maxCount = Math.max(critical, high, medium, low, info, 10);

		// Build metrics array for this scan
		metrics = [
			{ label: 'Critical', value: critical, max: maxCount },
			{ label: 'High', value: high, max: maxCount },
			{ label: 'Medium', value: medium, max: maxCount },
			{ label: 'Low', value: low, max: maxCount },
			{ label: 'Info', value: info, max: maxCount }
		];

		// Fetch actual vulnerabilities for this scan to get real breakdown
		try {
			const token = localStorage.getItem('token');
			const response = await fetch(`/api/scans/${scan.id}/vulnerabilities`, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});
			const data = await response.json();

			if (data.success && data.vulnerabilities) {
				// Group vulnerabilities by type
				const vulnByType: Record<string, any> = {};

				data.vulnerabilities.forEach((vuln: any) => {
					const type = vuln.type;
					if (!vulnByType[type]) {
						vulnByType[type] = {
							type,
							count: 0,
							severity: vuln.severity
						};
					}
					vulnByType[type].count++;
				});

				// Convert to array and calculate percentages
				const total = totalVulns || 1;
				vulnerabilities = Object.values(vulnByType).map((v: any) => ({
					...v,
					percent: Math.round((v.count / total) * 100)
				}));
			} else {
				// Fallback to generic breakdown if API fails
				vulnerabilities = [];
			}
		} catch (error) {
			console.error('Failed to fetch vulnerabilities:', error);
			vulnerabilities = [];
		}
	}

	function formatDateRange(start: string, end: string | null) {
		const startDate = new Date(start);
		const startStr = `${startDate.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })}.${startDate.getFullYear()}`;

		if (!end) {
			return startStr;
		}

		const endDate = new Date(end);
		const endStr = `${endDate.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })}.${endDate.getFullYear()}`;

		return `${startStr} - ${endStr}`;
	}

	function showNotification(message: string, type: 'success' | 'error' | 'info' = 'info') {
		if (notificationTimeout) {
			clearTimeout(notificationTimeout);
		}
		notification = { message, type };
		notificationTimeout = setTimeout(() => {
			notification = null;
		}, 5000);
	}

	function selectScan(scanId: string) {
		scans = scans.map((s) => ({ ...s, active: s.id === scanId }));
		selectedScan = scans.find((s) => s.id === scanId) || null;
		if (selectedScan) {
			calculateMetricsForScan(selectedScan);
		}
		// Close mobile sidebar
		showMobileSidebar = false;
	}

	async function createNewScan() {
		if (!newScanName.trim() || !newScanUrl.trim()) {
			showNotification('Please fill in all fields', 'error');
			return;
		}

		creatingScan = true;

		try {
			const response = await fetch('/api/scans', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name: newScanName,
					targetUrl: newScanUrl,
					scanType: newScanType
				})
			});

			const data = await response.json();

			if (data.success) {
				showNotification('Scan created successfully!', 'success');
				newScanName = '';
				newScanUrl = '';
				newScanType = 'quick';
				showNewScanModal = false;

				// Refresh scans
				await fetchScans();
			} else {
				showNotification(data.error || data.message || 'Failed to create scan', 'error');
			}
		} catch (error) {
			console.error('Create scan error:', error);
			showNotification('An error occurred while creating the scan', 'error');
		} finally {
			creatingScan = false;
		}
	}

	async function sendContactMessage() {
		if (!contactSubject.trim() || !contactMessage.trim()) {
			showNotification('Please fill in all fields', 'error');
			return;
		}

		sendingMessage = true;

		try {
			const response = await fetch('/api/messages', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					subject: contactSubject,
					message: contactMessage
				})
			});

			const data = await response.json();

			if (data.success) {
				showNotification('Message sent successfully! An admin will contact you soon.', 'success');
				contactSubject = '';
				contactMessage = '';
				showContactModal = false;
			} else {
				showNotification(data.message || 'Failed to send message', 'error');
			}
		} catch (error) {
			console.error('Send message error:', error);
			showNotification('Failed to send message. Please try again.', 'error');
		} finally {
			sendingMessage = false;
		}
	}

	onMount(() => {
		// Check authentication
		const storedUser = localStorage.getItem('user');
		const token = localStorage.getItem('token');

		if (!storedUser || !token) {
			goto('/login');
			return;
		}

		user = JSON.parse(storedUser);

		// Redirect admin to admin dashboard
		if (user.role === 'admin') {
			goto('/admin');
			return;
		}

		loading = false;
		
		// Fetch scans
		fetchScans();

		// Set up auto-refresh every 10 seconds
		refreshInterval = setInterval(fetchScans, 10000);

		// Trigger load animations
		setTimeout(() => {
			isLoaded = true;
		}, 100);
	});

	onDestroy(() => {
		if (refreshInterval) {
			clearInterval(refreshInterval);
		}
		if (notificationTimeout) {
			clearTimeout(notificationTimeout);
		}
	});

	async function handleLogout() {
		try {
			await fetch('/api/auth/logout', { method: 'POST' });
		} catch (error) {
			console.error('Logout error:', error);
		} finally {
			localStorage.removeItem('user');
			localStorage.removeItem('token');
			goto('/login');
		}
	}

	function getSeverityColor(severity: string) {
		switch (severity.toLowerCase()) {
			case 'critical':
				return 'text-red-600';
			case 'high':
				return 'text-orange-600';
			case 'medium':
				return 'text-yellow-600';
			case 'low':
				return 'text-blue-600';
			case 'info':
				return 'text-slate-500';
			default:
				return 'text-slate-600';
		}
	}

	function getSeverityGradient(severity: string) {
		switch (severity.toLowerCase()) {
			case 'critical':
				return 'from-red-500 to-pink-500';
			case 'high':
				return 'from-orange-500 to-red-500';
			case 'medium':
				return 'from-yellow-500 to-orange-500';
			case 'low':
				return 'from-blue-500 to-cyan-500';
			case 'info':
				return 'from-slate-500 to-slate-600';
			default:
				return 'from-slate-500 to-slate-600';
		}
	}

	function getOverallRiskAssessment() {
		if (!selectedScan) return { level: 'Unknown', message: 'No scan selected', color: 'slate' };

		const critical = selectedScan.criticalCount || 0;
		const high = selectedScan.highCount || 0;
		const medium = selectedScan.mediumCount || 0;
		const low = selectedScan.lowCount || 0;
		const total = selectedScan.totalVulnerabilities || 0;

		if (total === 0) {
			return {
				level: 'Excellent',
				message: 'No vulnerabilities detected. Your application appears to be secure.',
				color: 'green'
			};
		}

		if (critical > 0) {
			return {
				level: 'Critical Risk',
				message: `${critical} critical vulnerabilit${critical > 1 ? 'ies' : 'y'} detected. Immediate action required to prevent potential security breaches.`,
				color: 'red'
			};
		}

		if (high >= 5) {
			return {
				level: 'High Risk',
				message: `${high} high-severity vulnerabilities found. Address these issues as soon as possible to reduce attack surface.`,
				color: 'orange'
			};
		}

		if (high > 0) {
			return {
				level: 'Moderate Risk',
				message: `${high} high-severity vulnerabilit${high > 1 ? 'ies' : 'y'} detected. Plan remediation activities to improve security posture.`,
				color: 'yellow'
			};
		}

		if (medium >= 10) {
			return {
				level: 'Moderate Risk',
				message: `${medium} medium-severity vulnerabilities found. Consider addressing these to strengthen your security.`,
				color: 'yellow'
			};
		}

		if (medium > 0 || low > 0) {
			return {
				level: 'Low Risk',
				message:
					'Minor security issues detected. Review and address these findings as part of regular security maintenance.',
				color: 'blue'
			};
		}

		return {
			level: 'Low Risk',
			message: 'Your application has minimal security concerns.',
			color: 'blue'
		};
	}

	async function cancelScan(scanId: string) {
		scanToCancel = scanId;
		showCancelModal = true;
	}

	async function confirmCancelScan() {
		if (!scanToCancel) return;

		try {
			const response = await fetch(`/api/scans/${scanToCancel}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ action: 'cancel' })
			});

			const data = await response.json();

			if (data.success) {
				showNotification('Scan cancelled successfully', 'success');
				await fetchScans(); // Refresh list
			} else {
				showNotification(data.error || 'Failed to cancel scan', 'error');
			}
		} catch (error) {
			console.error('Cancel scan error:', error);
			showNotification('An error occurred while cancelling the scan', 'error');
		} finally {
			showCancelModal = false;
			scanToCancel = null;
		}
	}
</script>

<svelte:head>
	<title>Dashboard - DefenSys</title>
</svelte:head>

{#if loading}
	<div
		class="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
	>
		<div class="text-center">
			<svg
				class="mx-auto mb-4 h-12 w-12 animate-spin"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
			>
				<circle
					class="opacity-25"
					cx="12"
					cy="12"
					r="10"
					stroke="currentColor"
					stroke-width="4"
				></circle>
				<path
					class="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
				></path>
			</svg>
			<p class="text-slate-300">Loading dashboard...</p>
		</div>
	</div>
{:else}
	<div class="flex min-h-screen flex-col md:flex-row bg-slate-50">
		<!-- Mobile Header with Menu Button -->
		<div class="md:hidden flex items-center justify-between border-b border-slate-200 bg-white p-4 z-50">
			<div class="flex items-center space-x-3">
				<div
					class="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg"
				>
					<svg class="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
						<path
							d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"
						/>
					</svg>
				</div>
				<div>
					<h1 class="text-lg font-bold text-slate-900">DefenSys</h1>
					<span
						class="inline-block rounded-full bg-gradient-to-r from-green-500 to-emerald-500 px-2 py-0.5 text-xs font-bold text-white shadow-sm"
					>
						USER
					</span>
				</div>
			</div>
			<button
				on:click={() => showMobileSidebar = !showMobileSidebar}
				class="rounded-lg p-2 hover:bg-slate-100 transition-colors"
				aria-label="Toggle menu"
			>
				<svg class="h-6 w-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 12h16M4 18h16"
					/>
				</svg>
			</button>
		</div>

		<!-- Mobile Sidebar Overlay -->
		{#if showMobileSidebar}
			<div
				class="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
				on:click={() => showMobileSidebar = false}
			></div>
		{/if}

		<!-- Sidebar -->
		<div
			class="flex h-screen w-full md:w-80 flex-col border-r border-slate-200 bg-white shadow-xl {isLoaded
				? 'animate-[slideInLeft_0.6s_ease-out]'
				: 'opacity-0'} [animation-fill-mode:both]
				{showMobileSidebar ? 'fixed left-0 top-0 z-50' : 'hidden'} md:flex md:fixed"
		>
			<!-- Logo -->
			<div class="border-b border-slate-200 p-6">
				<div class="flex items-center space-x-3">
					<div
						class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg"
					>
						<svg class="h-7 w-7 text-white" fill="currentColor" viewBox="0 0 24 24">
							<path
								d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"
							/>
						</svg>
					</div>
					<div class="flex-1">
						<h1 class="text-2xl font-bold text-slate-900">DefenSys</h1>
						<span
							class="inline-block rounded-full bg-gradient-to-r from-green-500 to-emerald-500 px-2 py-0.5 text-xs font-bold text-white shadow-sm"
						>
							USER
						</span>
					</div>
				</div>
			</div>

			<!-- Live Now Header -->
			<div class="border-b border-slate-200 px-6 py-4">
				<div class="flex items-center justify-between">
					<h2 class="text-lg font-bold text-slate-900">Live Now</h2>
					<div class="flex space-x-2">
						<button
							class="rounded-lg p-1.5 transition-colors {selectedView === 'grid'
								? 'bg-blue-100 text-blue-600'
								: 'text-slate-400 hover:bg-slate-100'}"
							on:click={() => (selectedView = 'grid')}
							aria-label="Grid view"
						>
							<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
								<path
									d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM13 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2z"
								/>
							</svg>
						</button>
						<button
							class="rounded-lg p-1.5 transition-colors {selectedView === 'list'
								? 'bg-blue-100 text-blue-600'
								: 'text-slate-400 hover:bg-slate-100'}"
							on:click={() => (selectedView = 'list')}
							aria-label="List view"
						>
							<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
									clip-rule="evenodd"
								/>
							</svg>
						</button>
					</div>
				</div>
			</div>

			<!-- Scans List -->
			<div class="flex-1 overflow-y-auto p-4">
				{#if scans.length === 0}
					<div class="py-8 text-center">
						<svg
							class="mx-auto mb-3 h-12 w-12 text-slate-300"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
							/>
						</svg>
						<p class="text-sm text-slate-500">No scans yet</p>
						<p class="mt-1 text-xs text-slate-400">Create your first scan to get started</p>
					</div>
				{:else}
					<div class="space-y-2">
						{#each scans as scan, i}
							<button
								on:click={() => selectScan(scan.id)}
								class="group w-full rounded-xl border p-4 text-left transition-all duration-300 {scan.active
									? 'border-blue-300 bg-gradient-to-r from-blue-50 to-cyan-50 shadow-md'
									: 'border-slate-200 bg-white hover:border-blue-200 hover:shadow-sm'} {isLoaded
									? `animate-[fadeIn_0.6s_ease-out_${0.1 + i * 0.05}s]`
									: 'opacity-0'} [animation-fill-mode:both]"
							>
								<div class="mb-2 flex items-start justify-between">
									<h3
										class="text-sm font-bold {scan.active
											? 'text-slate-900'
											: 'text-slate-700'}"
									>
										{scan.name}
									</h3>
									<span
										class="inline-block rounded-full px-2 py-0.5 text-xs font-semibold {scan.status ===
										'completed'
											? 'bg-green-100 text-green-700'
											: scan.status === 'running'
												? 'bg-blue-100 text-blue-700'
												: scan.status === 'failed'
													? 'bg-red-100 text-red-700'
													: 'bg-slate-100 text-slate-700'}"
									>
										{scan.status === 'completed'
											? 'Active'
											: scan.status === 'running'
												? 'Running'
												: scan.status === 'failed'
													? 'Failed'
													: 'Pending'}
									</span>
								</div>
								<p class="mb-2 text-xs text-slate-600">{scan.date}</p>
								<div class="flex items-center justify-between">
									<span class="text-xs text-slate-500"
										>{scan.situations} {scan.situations === 1 ? 'Issue' : 'Issues'}</span
									>
									{#if scan.status === 'running'}
										<div class="flex items-center space-x-1">
											<div
												class="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500"
											></div>
											<span class="text-xs text-blue-600">{scan.progress}%</span>
										</div>
									{/if}
								</div>
							</button>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Bottom Actions -->
			<div class="border-t border-slate-200 p-4 space-y-2">
				<button
					on:click={() => (showNewScanModal = true)}
					class="flex w-full items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-3 font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:scale-105 hover:shadow-xl"
				>
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 4v16m8-8H4"
						/>
					</svg>
					<span>New Scan</span>
				</button>
			</div>
		</div>

		<!-- Main Content -->
		<div class="flex flex-1 flex-col md:ml-80">
			<!-- Top Header -->
			<div class="hidden md:block fixed w-[calc(100%-20%)] border-b border-slate-200 bg-white px-4 md:px-8 py-4 md:py-6 shadow-sm">
				<div
					class="flex flex-col md:flex-row items-start md:items-center justify-between space-y-3 md:space-y-0 {isLoaded
						? 'animate-[fadeInDown_0.6s_ease-out]'
						: 'opacity-0'}"
				>
					<div>
						<h1 class="text-2xl md:text-3xl font-bold text-slate-800">Dashboard</h1>
						<p class="mt-1 text-xs md:text-sm text-slate-600">Monitor your application security</p>
					</div>
					<div class="flex items-center space-x-2 md:space-x-4">
						<button
							class="hidden md:block rounded-lg p-2 transition-colors hover:bg-slate-100"
							aria-label="Search"
						>
							<svg
								class="h-5 w-5 md:h-6 md:w-6 text-slate-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								/>
							</svg>
						</button>
						<button
							class="hidden md:block relative rounded-lg p-2 transition-colors hover:bg-slate-100"
							aria-label="Notifications"
						>
							<svg
								class="h-5 w-5 md:h-6 md:w-6 text-slate-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
								/>
							</svg>
							<span
								class="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"
							></span>
						</button>
						<div class="flex items-center space-x-2 md:space-x-3 border-l border-slate-300 pl-2 md:pl-4">
							<div class="text-right">
								<p class="text-xs md:text-sm text-slate-500">User</p>
								<p class="text-xs md:text-sm font-semibold text-black">
									{user?.name || 'User'}
								</p>
							</div>
							<button
								on:click={handleLogout}
								class="rounded-lg bg-gradient-to-r from-red-500 to-pink-500 px-3 py-2 md:px-4 text-xs md:text-sm font-medium text-white transition-all duration-300 hover:scale-105"
							>
								Logout
							</button>
						</div>
					</div>
				</div>
			</div>

			<!-- Dashboard Content -->
			<div class="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-8 md:mt-20">
				<div class="mx-auto max-w-7xl space-y-6 md:space-y-8">
					<!-- Security Score & Quick Actions -->
					<div class="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-3">
						<!-- Security Score Card -->
						<div
							class="lg:col-span-2 rounded-xl md:rounded-2xl border border-slate-200 bg-white pt-0 md:pt-8 p-14 md:p-8 shadow-lg {isLoaded
								? 'animate-[fadeInUp_0.6s_ease-out_0.1s]'
								: 'opacity-0'} [animation-fill-mode:both]"
						>
							<div class="mb-18 md:mb-6 flex flex-col md:flex-row items-center justify-between">
								<h2 class="text-lg md:text-xl font-bold text-slate-900">Security Overview</h2>
								{#if selectedScan}
									<span class="text-xs md:text-sm text-slate-600">{selectedScan.name}</span>
								{/if}
							</div>

							<div class="relative">
								<!-- Scanning Status Badge -->
								{#if selectedScan && (selectedScan.status === 'running' || selectedScan.status === 'pending')}
									<div
									class="absolute top-3 right-3 z-20 flex flex-col items-end space-y-2 rounded-lg bg-blue-50 px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm"
								>
										<div class="flex items-center space-x-2 md:space-x-3">
											<div class="h-2 w-2 animate-pulse rounded-full bg-blue-500"></div>
											<span class="text-xs md:text-sm font-medium text-blue-600">
												{selectedScan.status === 'running'
													? `Scanning ${selectedScan.progress}%`
													: 'Pending'}
											</span>
											<button
												on:click={() => cancelScan(selectedScan.id)}
												class="text-[10px] md:text-xs text-red-500 hover:text-red-700 transition-colors underline"
												title="Cancel scan"
											>
												Cancel
											</button>
										</div>
										{#if selectedScan.currentActivity}
											<div class="text-[10px] md:text-xs font-medium text-blue-500">
												{selectedScan.currentActivity}
											</div>
										{/if}
										{#if selectedScan.estimatedTimeRemaining}
											<div class="text-[10px] md:text-xs text-slate-500">
												Est. {selectedScan.estimatedTimeRemaining} remaining
											</div>
										{/if}
									</div>
								{/if}

								<!-- Circular Progress -->
								<div class="relative mx-auto aspect-square w-full max-w-xs md:max-w-md">
									<!-- Background circle -->
									<svg
										class="h-full w-full -rotate-90 transform absolute inset-0 z-0 {selectedScan &&
										(selectedScan.status === 'running' || selectedScan.status === 'pending')
											? 'animate-[spin_3s_linear_infinite]'
											: ''}"
									>
										<circle
											cx="50%"
											cy="50%"
											r="45%"
											fill="none"
											stroke="#e5e7eb"
											stroke-width="2"
										/>
										<circle
											cx="50%"
											cy="50%"
											r="45%"
											fill="none"
											stroke="url(#gradient)"
											stroke-width="2"
											stroke-dasharray="283"
											stroke-dashoffset={283 - (283 * securityScore) / 100}
											stroke-linecap="round"
											class="transition-all duration-1000"
										/>
										<defs>
											<linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
												<stop offset="0%" style="stop-color:#06b6d4;stop-opacity:1" />
												<stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
											</linearGradient>
										</defs>
									</svg>

									<!-- Center Score -->
									<div class="absolute inset-0 flex items-center justify-center">
										<div class="text-center">
											<div
												class="mb-2 bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-6xl font-bold text-transparent"
											>
												{securityScore}
											</div>
											<div class="text-sm text-slate-400">/100</div>
											<div class="mt-2 text-base font-semibold text-slate-600">Security Score</div>
										</div>
									</div>

									<!-- Vulnerability Breakdown Around Circle -->
									<div class="pointer-events-none absolute inset-0 z-10">
										{#each vulnerabilities as vuln, i}
											{@const angle = (i / vulnerabilities.length) * 360}
											{@const radius = 58}
											{@const x = 50 + radius * Math.cos(((angle - 90) * Math.PI) / 180)}
											{@const y = 50 + radius * Math.sin(((angle - 90) * Math.PI) / 180)}
											<div
												class="pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 transform text-center"
												style="left: {x}%; top: {y}%;"
											>
												<div
													class="rounded-lg border border-slate-100 bg-white px-2 py-1 shadow-md"
												>
													<div
														class="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-xl font-bold text-transparent"
													>
														{vuln.percent}%
													</div>
													<div class="mt-0.5 text-xs font-medium whitespace-nowrap text-slate-600">
														{vuln.type}
													</div>
													<div class="text-xs {getSeverityColor(vuln.severity)} mt-0.5 font-bold">
														{vuln.count}
													</div>
												</div>
											</div>
										{/each}
									</div>
								</div>
							</div>
						</div>

						<!-- Vulnerability Breakdown -->
						<div
							class="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg {isLoaded
								? 'animate-[fadeInUp_0.6s_ease-out_0.2s]'
								: 'opacity-0'} [animation-fill-mode:both]"
						>
							<h3 class="mb-6 text-lg font-bold text-slate-800">Vulnerability Breakdown</h3>
							{#if selectedScan}
								<div class="space-y-4">
									{#each metrics as metric}
										<div>
											<div class="mb-2 flex items-center justify-between">
												<div class="flex items-center gap-2">
													<span class="text-sm font-medium text-slate-700">{metric.label}</span>
													{#if metric.label === 'Info'}
														<div class="group relative">
															<svg
																class="h-4 w-4 cursor-help text-slate-400"
																fill="none"
																stroke="currentColor"
																viewBox="0 0 24 24"
															>
																<path
																	stroke-linecap="round"
																	stroke-linejoin="round"
																	stroke-width="2"
																	d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
																/>
															</svg>
															<div
																class="invisible absolute bottom-full left-1/2 z-10 mb-2 w-64 -translate-x-1/2 transform rounded-lg bg-slate-800 px-3 py-2 text-center text-xs text-white opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100"
															>
																Informational findings - Low-priority security observations and best
																practice recommendations
															</div>
														</div>
													{/if}
												</div>
												<span class="text-sm font-bold text-slate-900">{metric.value}</span>
											</div>
											<div class="h-2 overflow-hidden rounded-full bg-slate-200">
												<div
													class="h-full rounded-full transition-all duration-1000 {metric.label ===
													'Critical'
														? 'bg-gradient-to-r from-red-500 to-red-600'
														: metric.label === 'High'
															? 'bg-gradient-to-r from-orange-500 to-orange-600'
															: metric.label === 'Medium'
																? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
																: metric.label === 'Low'
																	? 'bg-gradient-to-r from-blue-500 to-blue-600'
																	: 'bg-gradient-to-r from-slate-400 to-slate-500'}"
													style="width: {(metric.value / metric.max) * 100}%"
												></div>
											</div>
										</div>
									{/each}
								</div>

								<!-- Overall Risk Assessment -->
								{@const riskAssessment = getOverallRiskAssessment()}
								<div class="mt-6 border-t border-slate-200 pt-6">
									<div class="flex items-start space-x-3">
										<div class="mt-1 flex-shrink-0">
											{#if riskAssessment.color === 'green'}
												<svg class="h-6 w-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
													<path
														fill-rule="evenodd"
														d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
														clip-rule="evenodd"
													/>
												</svg>
											{:else if riskAssessment.color === 'red'}
												<svg class="h-6 w-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
													<path
														fill-rule="evenodd"
														d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
														clip-rule="evenodd"
													/>
												</svg>
											{:else if riskAssessment.color === 'orange'}
												<svg class="h-6 w-6 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
													<path
														fill-rule="evenodd"
														d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
														clip-rule="evenodd"
													/>
												</svg>
											{:else if riskAssessment.color === 'yellow'}
												<svg class="h-6 w-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
													<path
														fill-rule="evenodd"
														d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
														clip-rule="evenodd"
													/>
												</svg>
											{:else}
												<svg class="h-6 w-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
													<path
														fill-rule="evenodd"
														d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
														clip-rule="evenodd"
													/>
												</svg>
											{/if}
										</div>
										<div class="flex-1">
											<h4 class="mb-1 text-sm font-bold text-{riskAssessment.color}-600">
												Overall Risk: {riskAssessment.level}
											</h4>
											<p class="text-xs leading-relaxed text-slate-600">
												{riskAssessment.message}
											</p>
										</div>
									</div>
								</div>
							{:else}
								<div class="py-8 text-center">
									<svg
										class="mx-auto mb-3 h-12 w-12 text-slate-300"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
										/>
									</svg>
									<p class="text-sm text-slate-500">No scan data available</p>
									<p class="mt-1 text-xs text-slate-400">Start a scan to see vulnerability breakdown</p>
								</div>
							{/if}
						</div>
					</div>

					<!-- Grid Below: Quick Actions and More -->
					<div class="border-t border-slate-200 bg-white p-4 md:p-6 shadow-lg">
					<div
						class="grid grid-cols-1 gap-3 md:gap-4 md:grid-cols-3 {isLoaded
							? 'animate-[fadeInUp_0.6s_ease-out_0.4s]'
							: 'opacity-0'} [animation-fill-mode:both]"
					>
							<!-- New Scan -->
							<button
								on:click={() => (showNewScanModal = true)}
								class="group w-full rounded-xl md:rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-4 md:p-6 text-left shadow-lg transition-all duration-300 hover:scale-105 hover:border-blue-300 hover:shadow-xl"
							>
								<div
									class="mb-3 md:mb-4 flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg transition-transform duration-300 group-hover:scale-110"
								>
									<svg
										class="h-6 w-6 md:h-7 md:w-7 text-white"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M12 4v16m8-8H4"
										/>
									</svg>
								</div>
								<h3 class="mb-2 text-base md:text-lg font-bold text-slate-900">New Scan</h3>
								<p class="text-xs md:text-sm text-slate-600">Start a new security scan</p>
							</button>

							<!-- View Reports -->
							<button
								on:click={() => goto('/dashboard/reports')}
								class="group w-full rounded-xl md:rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-4 md:p-6 text-left shadow-lg transition-all duration-300 hover:scale-105 hover:border-purple-300 hover:shadow-xl"
							>
								<div
									class="mb-3 md:mb-4 flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg transition-transform duration-300 group-hover:scale-110"
								>
									<svg
										class="h-6 w-6 md:h-7 md:w-7 text-white"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
										/>
									</svg>
								</div>
								<h3 class="mb-2 text-base md:text-lg font-bold text-slate-900">View Reports</h3>
								<p class="text-xs md:text-sm text-slate-600">Access detailed scan reports</p>
							</button>

							<!-- Contact Admin -->
							<button
								on:click={() => (showContactModal = true)}
								class="group w-full rounded-xl md:rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-4 md:p-6 text-left shadow-lg transition-all duration-300 hover:scale-105 hover:border-green-300 hover:shadow-xl"
							>
								<div
									class="mb-3 md:mb-4 flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg transition-transform duration-300 group-hover:scale-110"
								>
									<svg
										class="h-6 w-6 md:h-7 md:w-7 text-white"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
										/>
									</svg>
								</div>
								<h3 class="mb-2 text-base md:text-lg font-bold text-slate-900">Contact Admin</h3>
								<p class="text-xs md:text-sm text-slate-600">Get help from administrators</p>
							</button>
						</div>
					</div>

					<!-- Vulnerability Details Table (if scan selected) -->
					{#if selectedScan && vulnerabilities.length > 0}
						<div
							class="rounded-xl md:rounded-2xl border border-slate-200 bg-white p-4 md:p-8 shadow-lg {isLoaded
								? 'animate-[fadeInUp_0.6s_ease-out_0.3s]'
								: 'opacity-0'} [animation-fill-mode:both]"
						>
							<h2 class="mb-4 md:mb-6 text-lg md:text-xl font-bold text-slate-900">Vulnerability Types</h2>
							<div class="grid grid-cols-1 gap-3 md:gap-4 md:grid-cols-2 lg:grid-cols-3">
								{#each vulnerabilities as vuln}
									<div
										class="rounded-xl border border-slate-200 bg-slate-50 p-4 transition-all duration-300 hover:shadow-md"
									>
										<div class="mb-2 flex items-center justify-between">
											<span
												class="inline-block rounded-full bg-gradient-to-r {getSeverityGradient(
													vuln.severity
												)} px-3 py-1 text-xs font-bold text-white shadow-sm"
											>
												{vuln.severity.toUpperCase()}
											</span>
											<span class="text-2xl font-bold text-slate-900">{vuln.count}</span>
										</div>
										<h4 class="text-sm font-semibold text-slate-800">{vuln.type}</h4>
										<p class="mt-1 text-xs text-slate-600">{vuln.percent}% of total</p>
									</div>
								{/each}
							</div>
						</div>
					{/if}

					<!-- Recent Activity -->
					<div
						class="rounded-xl md:rounded-2xl border border-slate-200 bg-white p-4 md:p-8 shadow-lg {isLoaded
							? 'animate-[fadeInUp_0.6s_ease-out_0.4s]'
							: 'opacity-0'} [animation-fill-mode:both]"
					>
						<h2 class="mb-4 md:mb-6 text-lg md:text-xl font-bold text-slate-900">Recent Activity</h2>
						{#if scans.length === 0}
							<div class="py-12 text-center">
								<svg
									class="mx-auto mb-4 h-16 w-16 text-slate-300"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
									/>
								</svg>
								<p class="text-slate-600">No recent activity</p>
								<p class="mt-2 text-sm text-slate-500">Start your first scan to see results here</p>
							</div>
						{:else}
							<div class="space-y-3">
								{#each scans.slice(0, 5) as scan}
									<div
										class="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 transition-all duration-300 hover:border-blue-200 hover:shadow-sm"
									>
										<div class="flex items-center space-x-4">
											<div
												class="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r {scan.status ===
												'completed'
													? 'from-green-500 to-emerald-500'
													: scan.status === 'running'
														? 'from-blue-500 to-cyan-500'
														: 'from-slate-500 to-slate-600'} shadow-md"
											>
												<svg
													class="h-5 w-5 text-white"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													{#if scan.status === 'completed'}
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2"
															d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
														/>
													{:else if scan.status === 'running'}
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2"
															d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
														/>
													{:else}
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2"
															d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
														/>
													{/if}
												</svg>
											</div>
											<div>
												<h4 class="font-semibold text-slate-900">{scan.name}</h4>
												<p class="text-xs text-slate-600">{scan.date}</p>
											</div>
										</div>
										<div class="text-right">
											<p class="text-sm font-bold text-slate-900">
												{scan.situations} {scan.situations === 1 ? 'Issue' : 'Issues'}
											</p>
											<span
												class="inline-block rounded-full px-2 py-0.5 text-xs font-semibold {scan.status ===
												'completed'
													? 'bg-green-100 text-green-700'
													: scan.status === 'running'
														? 'bg-blue-100 text-blue-700'
														: 'bg-slate-100 text-slate-700'}"
											>
												{scan.status === 'completed'
													? 'Completed'
													: scan.status === 'running'
														? 'Running'
														: 'Pending'}
											</span>
										</div>
									</div>
								{/each}
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Notification Toast -->
	{#if notification}
		<div class="fixed right-6 top-6 z-50 animate-[slideInRight_0.3s_ease-out]">
			<div
				class="max-w-md rounded-xl border-l-4 bg-white p-4 pr-12 shadow-2xl {notification.type ===
				'success'
					? 'border-green-500'
					: notification.type === 'error'
						? 'border-red-500'
						: 'border-blue-500'}"
			>
				<div class="flex items-start space-x-3">
					<div class="mt-0.5 flex-shrink-0">
						{#if notification.type === 'success'}
							<svg class="h-6 w-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clip-rule="evenodd"
								/>
							</svg>
						{:else if notification.type === 'error'}
							<svg class="h-6 w-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
									clip-rule="evenodd"
								/>
							</svg>
						{:else}
							<svg class="h-6 w-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
									clip-rule="evenodd"
								/>
							</svg>
						{/if}
					</div>
					<div class="flex-1">
						<p class="text-sm font-medium text-slate-800">
							{notification.message}
						</p>
					</div>
				</div>
				<button
					on:click={() => (notification = null)}
					class="absolute right-4 top-4 text-slate-400 transition-colors hover:text-slate-600"
					aria-label="Close notification"
				>
					<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
							clip-rule="evenodd"
						/>
					</svg>
				</button>
			</div>
		</div>
	{/if}

	<!-- New Scan Modal -->
	{#if showNewScanModal}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
			on:click={() => (showNewScanModal = false)}
		>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div
				class="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-2xl"
				on:click|stopPropagation
			>
				<h2 class="mb-6 text-2xl font-bold text-slate-900">Create New Scan</h2>

				<form on:submit|preventDefault={createNewScan} class="space-y-4">
					<div>
						<label for="scanName" class="mb-2 block text-sm font-medium text-slate-700"
							>Scan Name</label
						>
						<input
							id="scanName"
							type="text"
							bind:value={newScanName}
							placeholder="My Security Scan"
							class="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
							required
						/>
					</div>

					<div>
						<label for="scanUrl" class="mb-2 block text-sm font-medium text-slate-700"
							>Target URL</label
						>
						<input
							id="scanUrl"
							type="url"
							bind:value={newScanUrl}
							placeholder="https://example.com"
							class="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
							required
						/>
					</div>

					<div>
						<label for="scanType" class="mb-2 block text-sm font-medium text-slate-700"
							>Scan Type</label
						>
						<select
							id="scanType"
							bind:value={newScanType}
							class="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
						>
							<option value="quick">Quick Scan</option>
							<option value="comprehensive">Comprehensive Scan</option>
							<option value="custom">Custom Scan</option>
						</select>
					</div>

					<div class="flex space-x-3 pt-4">
						<button
							type="button"
							on:click={() => (showNewScanModal = false)}
							class="flex-1 rounded-lg border border-slate-300 px-4 py-3 font-medium text-slate-700 transition-colors hover:bg-slate-50"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={creatingScan}
							class="flex-1 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
						>
							{creatingScan ? 'Creating...' : 'Create Scan'}
						</button>
					</div>
				</form>
			</div>
		</div>
	{/if}

	<!-- Contact Admin Modal -->
	{#if showContactModal}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
			on:click={() => (showContactModal = false)}
		>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div
				class="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-2xl"
				on:click|stopPropagation
			>
				<h2 class="mb-6 text-2xl font-bold text-slate-900">Contact Administrator</h2>

				<form on:submit|preventDefault={sendContactMessage} class="space-y-4">
					<div>
						<label for="contactSubject" class="mb-2 block text-sm font-medium text-slate-700"
							>Subject</label
						>
						<input
							id="contactSubject"
							type="text"
							bind:value={contactSubject}
							placeholder="Help with scan configuration"
							class="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-green-500 focus:ring-2 focus:ring-green-500/50"
							required
						/>
					</div>

					<div>
						<label for="contactMessage" class="mb-2 block text-sm font-medium text-slate-700"
							>Message</label
						>
						<textarea
							id="contactMessage"
							bind:value={contactMessage}
							placeholder="Describe your issue or question..."
							rows="5"
							class="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-green-500 focus:ring-2 focus:ring-green-500/50"
							required
						></textarea>
					</div>

					<div class="flex space-x-3 pt-4">
						<button
							type="button"
							on:click={() => (showContactModal = false)}
							class="flex-1 rounded-lg border border-slate-300 px-4 py-3 font-medium text-slate-700 transition-colors hover:bg-slate-50"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={sendingMessage}
							class="flex-1 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
						>
							{sendingMessage ? 'Sending...' : 'Send Message'}
						</button>
					</div>
				</form>
			</div>
		</div>
	{/if}
{/if}

<!-- Cancel Scan Confirmation Modal -->
{#if showCancelModal}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
		on:click={() => {
			showCancelModal = false;
			scanToCancel = null;
		}}
	>
		<div
			class="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl"
			on:click|stopPropagation
		>
			<div class="mb-6 flex items-center space-x-3">
				<div class="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
					<svg
						class="h-6 w-6 text-red-600"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
						/>
					</svg>
				</div>
				<div>
					<h3 class="text-xl font-bold text-slate-900">Cancel Scan</h3>
					<p class="text-sm text-slate-500">Confirm your action</p>
				</div>
			</div>

			<p class="mb-6 text-slate-600">
				Are you sure you want to cancel this scan? This action cannot be undone.
			</p>

			<div class="flex space-x-3">
				<button
					type="button"
					on:click={() => {
						showCancelModal = false;
						scanToCancel = null;
					}}
					class="flex-1 rounded-lg border border-slate-300 px-4 py-3 font-medium text-slate-700 transition-colors hover:bg-slate-50"
				>
					Cancel
				</button>
				<button
					type="button"
					on:click={confirmCancelScan}
					class="flex-1 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 px-4 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105"
				>
					OK
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes fadeInDown {
		from {
			opacity: 0;
			transform: translateY(-20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes slideInLeft {
		from {
			opacity: 0;
			transform: translateX(-50px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	@keyframes slideInRight {
		from {
			opacity: 0;
			transform: translateX(50px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
