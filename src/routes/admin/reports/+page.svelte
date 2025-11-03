<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let user: any = null;
	let loading = true;
	let isLoaded = false;
	let scans: any[] = [];
	let filteredScans: any[] = [];
	let selectedScan: any = null;
	let selectedVulnerability: any = null;
	let vulnerabilities: any[] = [];
	let showExportModal = false;
	let selectedExportFormat = 'pdf';

	// Filters
	let searchQuery = '';
	let filterStatus = 'all';
	let sortBy = 'date-desc';

	// Notification state
	let notification: { message: string; type: 'success' | 'error' | 'info' } | null = null;

	// Mobile sidebar state
	let showMobileSidebar = false;

	async function fetchScans() {
		try {
			const token = localStorage.getItem('token');
			const response = await fetch('/api/scans', {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});
			const data = await response.json();

			if (data.success) {
				scans = data.scans.map((scan: any) => ({
					...scan,
					isActive: scan.status === 'running',
					completedTime: scan.completedAt
						? new Date(scan.completedAt).toLocaleString()
						: 'In Progress'
				}));
				applyFilters();
			}
		} catch (error) {
			console.error('Failed to fetch scans:', error);
		}
	}

	async function fetchVulnerabilities(scanId: string) {
		try {
			const token = localStorage.getItem('token');
			const response = await fetch(`/api/scans/${scanId}/vulnerabilities`, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});
			const data = await response.json();

			if (data.success) {
				vulnerabilities = data.vulnerabilities;
			} else {
				showNotification('Failed to load vulnerabilities', 'error');
			}
		} catch (error) {
			console.error('Failed to fetch vulnerabilities:', error);
			showNotification('Failed to load vulnerabilities', 'error');
		}
	}

	async function selectScan(scan: any) {
		selectedScan = scan;
		selectedVulnerability = null;
		vulnerabilities = [];
		await fetchVulnerabilities(scan.id);
		// Close mobile sidebar after selection
		showMobileSidebar = false;
	}

	function applyFilters() {
		filteredScans = scans.filter((scan) => {
		const matchesSearch =
			searchQuery === '' ||
			scan.targetUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
			scan.name?.toLowerCase().includes(searchQuery.toLowerCase());			const matchesStatus =
				filterStatus === 'all' ||
				(filterStatus === 'completed' && scan.status === 'completed') ||
				(filterStatus === 'running' && scan.status === 'running') ||
				(filterStatus === 'failed' && scan.status === 'failed');

			return matchesSearch && matchesStatus;
		});

		// Apply sorting
		filteredScans.sort((a, b) => {
			switch (sortBy) {
				case 'date-asc':
					return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
				case 'date-desc':
					return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
			case 'name-asc':
				return (a.name || a.targetUrl).localeCompare(b.name || b.targetUrl);
			case 'name-desc':
				return (b.name || b.targetUrl).localeCompare(a.name || a.targetUrl);
				case 'score-asc':
					return (a.overallScore || 0) - (b.overallScore || 0);
				case 'score-desc':
					return (b.overallScore || 0) - (a.overallScore || 0);
				default:
					return 0;
			}
		});
	}

	async function exportReport() {
		if (!selectedScan) return;

		try {
			const token = localStorage.getItem('token');
			const response = await fetch(
				`/api/scans/${selectedScan.id}/export?format=${selectedExportFormat}`,
				{
					headers: {
						Authorization: `Bearer ${token}`
					}
				}
			);

			if (!response.ok) {
				throw new Error('Export failed');
			}

			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;

			const extension = selectedExportFormat === 'pdf' ? 'html' : selectedExportFormat;
			a.download = `scan-report-${selectedScan.id}.${extension}`;
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);
			document.body.removeChild(a);

			showNotification('Report exported successfully', 'success');
			showExportModal = false;
		} catch (error) {
			console.error('Export error:', error);
			showNotification('Failed to export report', 'error');
		}
	}
	
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

	function showNotification(message: string, type: 'success' | 'error' | 'info' = 'info') {
		notification = { message, type };
		setTimeout(() => {
			notification = null;
		}, 5000);
	}

	function getSeverityColor(severity: string) {
		switch (severity.toLowerCase()) {
			case 'critical':
				return 'from-red-500 to-red-600';
			case 'high':
				return 'from-orange-500 to-orange-600';
			case 'medium':
				return 'from-yellow-500 to-yellow-600';
			case 'low':
				return 'from-blue-500 to-blue-600';
			case 'info':
				return 'from-cyan-500 to-cyan-600';
			default:
				return 'from-slate-500 to-slate-600';
		}
	}

	function getStatusColor(status: string) {
		switch (status) {
			case 'completed':
				return 'from-green-500 to-green-600';
			case 'running':
				return 'from-blue-500 to-blue-600';
			case 'failed':
				return 'from-red-500 to-red-600';
			default:
				return 'from-slate-500 to-slate-600';
		}
	}

	$: {
		searchQuery;
		filterStatus;
		sortBy;
		applyFilters();
	}

	onMount(async () => {
		const storedUser = localStorage.getItem('user');
		const token = localStorage.getItem('token');

		if (!storedUser || !token) {
			goto('/login');
			return;
		}

		user = JSON.parse(storedUser);

		if (user.role !== 'admin') {
			goto('/dashboard');
			return;
		}

		await fetchScans();
		loading = false;
		setTimeout(() => (isLoaded = true), 100);
	});
</script>

<svelte:head>
	<title>View Reports - DefenSys</title>
</svelte:head>

{#if loading}
	<div
		class="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900"
	>
		<div class="text-center text-white">
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
			<p class="text-slate-300">Loading...</p>
		</div>
	</div>
{:else}
	<div
		class="flex h-screen flex-col md:flex-row overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50"
	>
		<!-- Mobile Header with Menu Button -->
		<div class="md:hidden flex items-center justify-between border-b border-slate-200 bg-white p-4">
			<button
				on:click={() => goto('/admin')}
				class="flex items-center space-x-2 text-slate-900/70 transition-all hover:text-slate-900"
			>
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M10 19l-7-7m0 0l7-7m-7 7h18"
					/>
				</svg>
				<span class="text-sm font-semibold text-slate-900">Back to Dashboard</span>
			</button>
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

		<!-- Sidebar: Scans List -->
		<div
			class="flex w-96 flex-col border-r border-slate-200 bg-white  {isLoaded
				? 'animate-[slideInLeft_0.6s_ease-out]'
				: 'opacity-0'} [animation-fill-mode:both]
				{showMobileSidebar ? 'fixed inset-y-0 left-0 z-50' : 'hidden'} md:flex"
		>
			<!-- Logo & Back Button -->
			<div class="border-b border-slate-200 p-6 pb-5">
				<button
					on:click={() => goto('/admin')}
					class="mb-4 flex items-center space-x-2 text-slate-900/70 transition-all hover:text-slate-900"
				>
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M10 19l-7-7m0 0l7-7m-7 7h18"
						/>
					</svg>
					<span class="text-sm">Back to Dashboard</span>
				</button>
				<h1 class="mb-2 text-2xl font-bold text-slate-900">Scan Reports</h1>
				<p class="text-sm text-slate-900/60">View and export scan results</p>
			</div>

			<!-- Filters -->
			<div class="border-b border-slate-200 p-6 pt-1 space-y-4">
				<!-- Search -->
				<div>
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Search scans..."
						class="w-full rounded-lg border border-slate-500 bg-slate-50 px-4 py-2 text-sm text-slate-900 placeholder-white/40 outline-none  transition-all focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50"
					/>
				</div>

				<!-- Status Filter -->
				<div class="flex space-x-2">
					<select
						bind:value={filterStatus}
						class="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none  transition-all focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50"
					>
						<option value="all">All Status</option>
						<option value="completed">Completed</option>
						<option value="running">Running</option>
						<option value="failed">Failed</option>
					</select>

					<select
						bind:value={sortBy}
						class="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none  transition-all focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50"
					>
						<option value="date-desc">Newest First</option>
						<option value="date-asc">Oldest First</option>
						<option value="name-asc">Name A-Z</option>
						<option value="name-desc">Name Z-A</option>
						<option value="score-desc">Score High-Low</option>
						<option value="score-asc">Score Low-High</option>
					</select>
				</div>
			</div>

			<!-- Scans List -->
			<div class="flex-1 overflow-y-auto p-4">
				{#if filteredScans.length === 0}
					<div class="py-16 text-center">
						<svg
							class="mx-auto mb-4 h-16 w-16 text-slate-900/30"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							/>
						</svg>
						<p class="text-slate-900/60">No scans found</p>
					</div>
				{:else}
					<div class="space-y-2">
						{#each filteredScans as scan, i}
							<button
								on:click={() => selectScan(scan)}
								class="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-left transition-all hover:bg-slate-50 hover:scale-[1.02] {selectedScan?.id ===
								scan.id
									? 'ring-2 ring-cyan-500 bg-white/10'
									: ''} {isLoaded
									? `animate-[fadeIn_0.6s_ease-out_${0.1 + i * 0.05}s]`
									: 'opacity-0'} [animation-fill-mode:both]"
							>
									<div class="mb-2 flex items-start justify-between">
									<div class="flex-1">
										<div class="mb-1 font-medium text-slate-900 line-clamp-1">
											{scan.name || 'Unnamed Scan'}
										</div>
										<div class="text-xs text-slate-500 line-clamp-1">{scan.targetUrl}</div>
									</div>
									<span
										class="ml-2 inline-block rounded-full bg-gradient-to-r {getStatusColor(
											scan.status
										)} px-2 py-0.5 text-xs font-bold text-slate-900 shadow-lg"
									>
										{scan.status}
									</span>
								</div>

								<div class="flex items-center justify-between text-xs text-slate-900/60">
									<span>{new Date(scan.createdAt).toLocaleDateString()}</span>
									{#if scan.overallScore !== undefined}
										<span class="font-medium text-slate-900">Score: {scan.overallScore}/100</span>
									{/if}
								</div>
							</button>
						{/each}
					</div>
				{/if}
			</div>
		</div>

		<!-- Main Content -->
		<div class="flex flex-1 flex-col overflow-hidden">
			<!-- Header -->
			<div class="border-b border-slate-200 bg-white px-4 md:px-8 py-4 md:py-6">
				<div class="flex flex-row justify-between items-center space-y-4 md:space-y-0 {isLoaded ? 'animate-[fadeInDown_0.6s_ease-out]' : 'opacity-0'}">
					<div>
						<h1 class="text-2xl md:text-3xl font-bold text-slate-800">Scan Reports</h1>
						<p class="mt-1 text-xs md:text-sm text-slate-600">View and export scan results</p>
					</div>
					<div class="flex items-center justify-between md:justify-start md:space-x-4">
						<button class="rounded-lg p-2 transition-colors hover:bg-slate-100 md:block hidden" aria-label="Search">
							<svg
								class="h-6 w-6 text-slate-600"
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
							class="relative rounded-lg p-2 transition-colors hover:bg-slate-100 md:block hidden"
							aria-label="Notifications"
						>
							<svg
								class="h-6 w-6 text-slate-600"
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
							<span class="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
						</button>
						<div class="flex items-center space-x-2 md:space-x-3 md:border-l border-slate-300 md:pl-4">
							<div class="text-right hidden md:block">
								<p class="text-sm text-slate-500">Administrator</p>
								<p class="text-sm font-semibold text-black">
									{user?.name || 'System Administrator'}
								</p>
							</div>
							<button
										on:click={handleLogout}
										class="rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-3 py-2 md:px-4 text-sm font-medium text-white transition-all duration-300 hover:scale-105"
									>
										Logout
									</button>
						</div>
					</div>
				</div>
			</div>
			
			{#if !selectedScan}
				<!-- Empty State -->
				<div
					class="flex flex-1 items-center justify-center {isLoaded
						? 'animate-[fadeInUp_0.6s_ease-out_0.2s]'
						: 'opacity-0'} [animation-fill-mode:both]"
				>
					<div class="text-center">
						<svg
							class="mx-auto mb-4 md:mb-6 h-16 w-16 md:h-24 md:w-24 text-slate-900/20"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							/>
						</svg>
						<h3 class="mb-2 text-xl md:text-2xl font-bold text-slate-900">No Scan Selected</h3>
						<p class="text-sm md:text-base text-slate-900/60">Select a scan from the list to view its report</p>
					</div>
				</div>
			{:else}
				<!-- Report View -->
				<div class="flex flex-1 flex-col overflow-hidden">
					<!-- Top Bar -->
					<div class="border-b border-slate-200 bg-white p-4 md:p-6 ">
						<div class="flex flex-col md:flex-row md:items-start md:justify-between space-y-4 md:space-y-0">
							<div class="flex-1">
								<h2 class="mb-1 text-xl md:text-2xl font-bold text-slate-900">
									{selectedScan.name || 'Unnamed Scan'}
								</h2>
								<p class="mb-3 text-xs md:text-sm text-slate-600">{selectedScan.targetUrl}</p>
								<div class="flex flex-wrap gap-2 md:gap-4 text-xs md:text-sm">
									<div class="flex items-center space-x-2">
										<svg class="h-4 w-4 text-slate-900/50" fill="currentColor" viewBox="0 0 20 20">
											<path
												fill-rule="evenodd"
												d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
												clip-rule="evenodd"
											/>
										</svg>
										<span class="text-slate-900/70"
											>{new Date(selectedScan.createdAt).toLocaleString()}</span
										>
									</div>
									<div class="flex items-center space-x-2">
										<svg class="h-4 w-4 text-slate-900/50" fill="currentColor" viewBox="0 0 20 20">
											<path
												fill-rule="evenodd"
												d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
												clip-rule="evenodd"
											/>
										</svg>
										<span class="text-slate-900/70">Score: {selectedScan.overallScore || 0}/100</span>
									</div>
								</div>
							</div>
							<button
								on:click={() => (showExportModal = true)}
								class="flex items-center space-x-1 md:space-x-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-4 md:px-6 py-2 md:py-3 text-sm md:text-base font-semibold text-slate-900 shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/30"
							>
								<svg class="h-4 w-4 md:h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
									/>
								</svg>
								<span class="hidden md:inline">Export Report</span>
								<span class="md:hidden">Export</span>
							</button>
						</div>
					</div>

					<!-- Vulnerabilities List -->
					<div class="flex-1 overflow-y-auto p-4 md:p-6">
						<div
							class="rounded-2xl border border-slate-200 bg-white shadow-xl {isLoaded
								? 'animate-[fadeInUp_0.6s_ease-out_0.3s]'
								: 'opacity-0'} [animation-fill-mode:both]"
						>
							{#if vulnerabilities.length === 0}
								<div class="py-12 md:py-16 text-center">
									<svg
										class="mx-auto mb-4 h-12 w-12 md:h-16 md:w-16 text-slate-900/30"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
									<p class="text-sm md:text-base text-slate-900/60">No vulnerabilities found</p>
								</div>
							{:else}
								<div class="divide-y divide-white/10">
									{#each vulnerabilities as vuln, i}
										<button
											on:click={() =>
												(selectedVulnerability =
													selectedVulnerability?.id === vuln.id ? null : vuln)}
											class="w-full p-4 md:p-6 text-left transition-all hover:bg-slate-50 {isLoaded
												? `animate-[fadeIn_0.6s_ease-out_${0.4 + i * 0.05}s]`
												: 'opacity-0'} [animation-fill-mode:both]"
										>
											<div class="flex items-start justify-between">
												<div class="flex-1">
													<div class="mb-2 flex items-center space-x-3">
														<span
															class="inline-block rounded-full bg-gradient-to-r {getSeverityColor(
																vuln.severity
															)} px-3 py-1 text-xs font-bold text-slate-900 shadow-lg"
														>
															{vuln.severity}
														</span>
														<span class="text-xs text-slate-900/50">{vuln.type}</span>
													</div>
													<h3 class="mb-2 text-base md:text-lg font-semibold text-slate-900">{vuln.title}</h3>
													<p class="text-xs md:text-sm text-slate-900/70">{vuln.description}</p>

													{#if vuln.affectedUrl}
														<div class="mt-3 flex items-center space-x-2 text-xs text-slate-900/50">
															<svg
																class="h-3 w-3 md:h-4 md:w-4 flex-shrink-0"
																fill="none"
																stroke="currentColor"
																viewBox="0 0 24 24"
															>
																<path
																	stroke-linecap="round"
																	stroke-linejoin="round"
																	stroke-width="2"
																	d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
																/>
															</svg>
															<span class="line-clamp-1 break-all">{vuln.affectedUrl}</span>
														</div>
													{/if}

													{#if selectedVulnerability?.id === vuln.id}
														<div class="mt-4 space-y-3 md:space-y-4 rounded-xl bg-slate-50 p-3 md:p-4">
															{#if vuln.evidence}
																<div>
																	<h4 class="mb-2 text-xs md:text-sm font-semibold text-slate-900/90">
																		Evidence
																	</h4>
																	<pre
																		class="overflow-x-auto rounded-lg bg-black/40 p-2 md:p-3 text-xs text-slate-900/70">{vuln.evidence}</pre>
																</div>
															{/if}

															{#if vuln.recommendation}
																<div>
																	<h4 class="mb-2 text-xs md:text-sm font-semibold text-slate-900/90">
																		Recommendation
																	</h4>
																	<p class="text-xs md:text-sm text-slate-900/70">{vuln.recommendation}</p>
																</div>
															{/if}

															{#if vuln.cwe}
																<div>
																	<h4 class="mb-2 text-xs md:text-sm font-semibold text-slate-900/90">CWE</h4>
																	<p class="text-xs md:text-sm text-slate-900/70">{vuln.cwe}</p>
																</div>
															{/if}
														</div>
													{/if}
												</div>

												<svg
													class="ml-2 md:ml-4 h-4 w-4 md:h-5 md:w-5 text-slate-900/50 transition-transform flex-shrink-0 {selectedVulnerability?.id ===
													vuln.id
														? 'rotate-180'
														: ''}"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M19 9l-7 7-7-7"
													/>
												</svg>
											</div>
										</button>
									{/each}
								</div>
							{/if}
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<!-- Export Modal -->
	{#if showExportModal}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
			on:click={() => (showExportModal = false)}
		>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div
				class="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-2xl"
				on:click|stopPropagation
			>
				<h2 class="mb-6 text-2xl font-bold text-slate-900">Export Report</h2>

				<div class="mb-6 space-y-3">
					<label class="block">
						<input
							type="radio"
							bind:group={selectedExportFormat}
							value="pdf"
							class="mr-3"
						/>
						<span class="text-slate-900">PDF (HTML Print)</span>
						<p class="ml-6 text-sm text-slate-900/60">
							Download as HTML and print to PDF in your browser
						</p>
					</label>

					<label class="block">
						<input
							type="radio"
							bind:group={selectedExportFormat}
							value="json"
							class="mr-3"
						/>
						<span class="text-slate-900">JSON</span>
						<p class="ml-6 text-sm text-slate-900/60">Machine-readable format with full data</p>
					</label>

					<label class="block">
						<input
							type="radio"
							bind:group={selectedExportFormat}
							value="csv"
							class="mr-3"
						/>
						<span class="text-slate-900">CSV</span>
						<p class="ml-6 text-sm text-slate-900/60">Spreadsheet-friendly format</p>
					</label>
				</div>

				<div class="flex space-x-3">
					<button
						on:click={() => (showExportModal = false)}
						class="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 font-medium text-slate-900 transition-all hover:bg-slate-50"
					>
						Cancel
					</button>
					<button
						on:click={exportReport}
						class="flex-1 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-3 font-medium text-slate-900 shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/30"
					>
						Export
					</button>
				</div>
			</div>
		</div>
	{/if}

	<!-- Notification -->
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
{/if}

<style>
	@keyframes slideInRight {
		from {
			opacity: 0;
			transform: translateX(100%);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	@keyframes slideInLeft {
		from {
			opacity: 0;
			transform: translateX(-100%);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

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

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
