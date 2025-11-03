<script>
	import Navigation from '$lib/components/Navigation.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let isLoaded = false;

	onMount(() => {
		isLoaded = true;
	});
</script>

<div class="overflow-x-hidden">
	<!-- Hero Section -->
	<div
		class="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white"
	>
		<!-- Background Pattern -->
		<div class="absolute inset-0 opacity-10">
			<div
				class="absolute top-0 left-0 h-48 w-48 animate-pulse rounded-full bg-blue-500 mix-blend-multiply blur-xl filter sm:h-72 sm:w-72"
			></div>
			<div
				class="absolute top-0 right-0 h-48 w-48 animate-pulse rounded-full bg-cyan-500 mix-blend-multiply blur-xl filter delay-1000 sm:h-72 sm:w-72"
			></div>
			<div
				class="absolute bottom-0 left-1/2 h-48 w-48 -translate-x-1/2 transform animate-pulse rounded-full bg-indigo-500 mix-blend-multiply blur-xl filter delay-500 sm:h-72 sm:w-72"
			></div>
		</div>

		<Navigation />

		<!-- Hero Content -->
		<div class="parallax-container relative z-10 px-6 pt-10 pb-20 md:py-20 lg:px-12 lg:py-32">
			<div class="mx-auto max-w-7xl text-center">
				<div class="space-y-8">
					<!-- Badge -->
					<div
						class="glass inline-flex flex-col items-center justify-center gap-2 rounded-full border border-blue-400/50 bg-blue-900/60 px-6 py-3 backdrop-blur-sm md:flex-row md:gap-3 {isLoaded
							? 'animate-[scaleIn_0.8s_ease-out_0.1s]'
							: 'opacity-0'} [animation-fill-mode:both]"
					>
						<div class="flex text-yellow-400">
							<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
								<path
									d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
								/>
							</svg>
							<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
								<path
									d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
								/>
							</svg>
							<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
								<path
									d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
								/>
							</svg>
							<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
								<path
									d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
								/>
							</svg>
							<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
								<path
									d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
								/>
							</svg>
						</div>
						<span class="text-sm font-bold text-white md:text-base">Complete Security Platform</span
						>
					</div>

					<!-- Main Headline -->
					<div class="space-y-6">
						<h1
							class="text-4xl leading-tight font-black sm:text-5xl lg:text-6xl xl:text-7xl {isLoaded
								? 'animate-[fadeInUp_1s_ease-out_0.3s]'
								: 'opacity-0'} [animation-fill-mode:both]"
						>
							<span class="text-white">Comprehensive</span>
							<span
								class="block bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent"
							>
								Security Features
							</span>
						</h1>

						<p
							class="mx-auto max-w-4xl text-lg leading-relaxed text-gray-300 sm:text-xl lg:text-2xl {isLoaded
								? 'animate-[fadeInUp_1s_ease-out_0.5s]'
								: 'opacity-0'} [animation-fill-mode:both]"
						>
							Advanced vulnerability scanning, real-time threat detection, and intelligent security
							analytics - all in one powerful platform designed for modern security teams.
						</p>
					</div>

					<!-- CTA Buttons -->
					<div
						class="flex flex-col justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6 {isLoaded
							? 'animate-[fadeInUp_1s_ease-out_0.7s]'
							: 'opacity-0'} [animation-fill-mode:both]"
					>
						<button
							on:click={() => goto('/login')}
							class="group transform rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-10 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:from-blue-600 hover:to-cyan-600 hover:shadow-2xl hover:shadow-blue-500/25"
						>
							<span class="flex items-center justify-center space-x-2">
								<span>Start Free Trial</span>
								<svg
									class="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M13 7l5 5m0 0l-5 5m5-5H6"
									/>
								</svg>
							</span>
						</button>
						<button
							on:click={() => goto('/docs')}
							class="group rounded-xl border-2 border-blue-400 px-10 py-4 text-lg font-semibold transition-all duration-300 hover:border-blue-300 hover:bg-blue-400/10 hover:shadow-lg hover:shadow-blue-400/25"
						>
							<span class="flex items-center justify-center space-x-2">
								<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								<span>Live Demo</span>
							</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Core Features Section -->
	<div class="relative overflow-x-hidden bg-slate-900 py-16 sm:py-20 lg:py-24">
		<!-- Background Pattern -->
		<div class="absolute inset-0 opacity-10">
			<div
				class="absolute top-0 left-1/4 h-full w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent"
			></div>
			<div
				class="absolute top-0 left-2/4 h-full w-px bg-gradient-to-b from-transparent via-cyan-500 to-transparent"
			></div>
			<div
				class="absolute top-0 left-3/4 h-full w-px bg-gradient-to-b from-transparent via-indigo-500 to-transparent"
			></div>
		</div>

		<div class="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
			<div class="mb-12 text-center sm:mb-16 lg:mb-20">
				<div
					class="mb-6 inline-block rounded-full border border-blue-500/30 bg-blue-900/30 px-6 py-2"
				>
					<span class="font-semibold text-blue-400">Core Features</span>
				</div>
				<h2 class="mb-6 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
					Everything You Need for
					<span
						class="block bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"
					>
						Complete Security
					</span>
				</h2>
				<p class="mx-auto max-w-3xl text-base text-gray-400 sm:text-lg lg:text-xl">
					From automated vulnerability scanning to real-time threat intelligence, DefenSys provides
					comprehensive security capabilities.
				</p>
			</div>

			<div class="grid gap-6 sm:grid-cols-2 lg:gap-8 xl:grid-cols-3">
				<!-- SQL Injection Detection -->
				<div
					class="group hover-lift glass rounded-2xl border border-blue-500/20 bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-blue-400/50 lg:p-8"
				>
					<div class="mb-4 flex items-center lg:mb-6">
						<div
							class="mr-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 transition-transform group-hover:scale-110 lg:mr-4 lg:h-14 lg:w-14"
						>
							<svg class="h-6 w-6 text-white lg:h-7 lg:w-7" fill="currentColor" viewBox="0 0 24 24">
								<path
									d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z"
								/>
							</svg>
						</div>
						<h3 class="text-lg font-bold text-white lg:text-xl">SQL Injection Detection</h3>
					</div>
					<p class="mb-4 text-sm leading-relaxed text-gray-400 lg:text-base">
						Automated testing for SQL injection vulnerabilities with comprehensive payload testing across GET/POST parameters, headers, and cookies.
					</p>
					<button
						on:click={() => goto('/docs')}
						class="flex items-center space-x-2 text-sm font-semibold text-blue-400 transition-colors group-hover:text-cyan-400"
					>
						<span>Learn More</span>
						<svg
							class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 7l5 5m0 0l-5 5m5-5H6"
							/>
						</svg>
					</button>
				</div>

				<!-- XSS Detection -->
				<div
					class="group hover-lift glass rounded-2xl border border-blue-500/20 bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-blue-400/50 lg:p-8"
				>
					<div class="mb-4 flex items-center lg:mb-6">
						<div
							class="mr-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 transition-transform group-hover:scale-110 lg:mr-4 lg:h-14 lg:w-14"
						>
							<svg class="h-6 w-6 text-white lg:h-7 lg:w-7" fill="currentColor" viewBox="0 0 24 24">
								<path
									d="M12,2L13.09,8.26L22,9L13.09,9.74L12,16L10.91,9.74L2,9L10.91,8.26L12,2M12,21.5A9.5,9.5 0 0,1 2.5,12A9.5,9.5 0 0,1 12,2.5A9.5,9.5 0 0,1 21.5,12A9.5,9.5 0 0,1 12,21.5M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20Z"
								/>
							</svg>
						</div>
						<h3 class="text-lg font-bold text-white lg:text-xl">XSS Vulnerability Scanning</h3>
					</div>
					<p class="mb-4 text-sm leading-relaxed text-gray-400 lg:text-base">
						Cross-Site Scripting detection with reflected, stored, and DOM-based XSS testing using advanced payloads and context analysis.
					</p>
					<button
						on:click={() => goto('/docs')}
						class="flex items-center space-x-2 text-sm font-semibold text-blue-400 transition-colors group-hover:text-cyan-400"
					>
						<span>Learn More</span>
						<svg
							class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 7l5 5m0 0l-5 5m5-5H6"
							/>
						</svg>
	</button>
				</div>

				<!-- Real-time Monitoring -->
				<div
					class="group hover-lift glass rounded-2xl border border-blue-500/20 bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-blue-400/50 lg:p-8"
				>
					<div class="mb-4 flex items-center lg:mb-6">
						<div
							class="mr-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 transition-transform group-hover:scale-110 lg:mr-4 lg:h-14 lg:w-14"
						>
							<svg class="h-6 w-6 text-white lg:h-7 lg:w-7" fill="currentColor" viewBox="0 0 24 24">
								<path
									d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M15,17H9V15H15V17M15,13H9V11H15V13M15,9H9V7H15V9Z"
								/>
							</svg>
						</div>
						<h3 class="text-lg font-bold text-white lg:text-xl">SSL/TLS Verification</h3>
					</div>
					<p class="mb-4 text-sm leading-relaxed text-gray-400 lg:text-base">
						Complete SSL/TLS certificate validation including expiration dates, cipher strength, certificate chains, and protocol versions.
					</p>
					<button
						on:click={() => goto('/docs')}
						class="flex items-center space-x-2 text-sm font-semibold text-blue-400 transition-colors group-hover:text-cyan-400"
					>
						<span>Learn More</span>
						<svg
							class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 7l5 5m0 0l-5 5m5-5H6"
							/>
						</svg>
					</button>
				</div>

				<!-- Threat Intelligence -->
				<div
					class="group hover-lift glass rounded-2xl border border-blue-500/20 bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-blue-400/50 lg:p-8"
				>
					<div class="mb-4 flex items-center lg:mb-6">
						<div
							class="mr-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 transition-transform group-hover:scale-110 lg:mr-4 lg:h-14 lg:w-14"
						>
							<svg class="h-6 w-6 text-white lg:h-7 lg:w-7" fill="currentColor" viewBox="0 0 24 24">
								<path
									d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7A2,2 0 0,1 14,9C14,10.11 13.11,11 12,11C10.89,11 10,10.11 10,9A2,2 0 0,1 12,7Z"
								/>
							</svg>
						</div>
						<h3 class="text-lg font-bold text-white lg:text-xl">Security Headers</h3>
					</div>
					<p class="mb-4 text-sm leading-relaxed text-gray-400 lg:text-base">
						Comprehensive security headers analysis including CSP, HSTS, X-Frame-Options, X-Content-Type-Options, and more.
					</p>
					<button
						on:click={() => goto('/docs')}
						class="flex items-center space-x-2 text-sm font-semibold text-blue-400 transition-colors group-hover:text-cyan-400"
					>
						<span>Learn More</span>
						<svg
							class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 7l5 5m0 0l-5 5m5-5H6"
							/>
						</svg>
					</button>
				</div>

				<!-- Compliance Management -->
				<div
					class="group hover-lift glass rounded-2xl border border-blue-500/20 bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-blue-400/50 lg:p-8"
				>
					<div class="mb-4 flex items-center lg:mb-6">
						<div
							class="mr-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-green-500 to-blue-500 transition-transform group-hover:scale-110 lg:mr-4 lg:h-14 lg:w-14"
						>
							<svg class="h-6 w-6 text-white lg:h-7 lg:w-7" fill="currentColor" viewBox="0 0 24 24">
								<path
									d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z"
								/>
							</svg>
						</div>
						<h3 class="text-lg font-bold text-white lg:text-xl">CSRF Protection</h3>
					</div>
					<p class="mb-4 text-sm leading-relaxed text-gray-400 lg:text-base">
						Cross-Site Request Forgery detection with token validation analysis and state-changing operation testing.
					</p>
					<button
						on:click={() => goto('/docs')}
						class="flex items-center space-x-2 text-sm font-semibold text-blue-400 transition-colors group-hover:text-cyan-400"
					>
						<span>Learn More</span>
						<svg
							class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 7l5 5m0 0l-5 5m5-5H6"
							/>
						</svg>
					</button>
				</div>

				<!-- API Integration -->
				<div
					class="group hover-lift glass rounded-2xl border border-blue-500/20 bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-blue-400/50 lg:p-8"
				>
					<div class="mb-4 flex items-center lg:mb-6">
						<div
							class="mr-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-red-500 transition-transform group-hover:scale-110 lg:mr-4 lg:h-14 lg:w-14"
						>
							<svg class="h-6 w-6 text-white lg:h-7 lg:w-7" fill="currentColor" viewBox="0 0 24 24">
								<path
									d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"
								/>
							</svg>
						</div>
						<h3 class="text-lg font-bold text-white lg:text-xl">Cookie & CORS Analysis</h3>
					</div>
					<p class="mb-4 text-sm leading-relaxed text-gray-400 lg:text-base">
						Detailed cookie security assessment and CORS policy analysis to identify potential security risks and misconfigurations.
					</p>
					<button
						on:click={() => goto('/docs')}
						class="flex items-center space-x-2 text-sm font-semibold text-blue-400 transition-colors group-hover:text-cyan-400"
					>
						<span>Learn More</span>
						<svg
							class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 7l5 5m0 0l-5 5m5-5H6"
							/>
						</svg>
					</button>
				</div>
			</div>
		</div>
	</div>

	<!-- Feature Comparison Section -->
	<div
		class="relative overflow-hidden bg-gradient-to-r from-slate-800 to-slate-900 py-16 sm:py-20 lg:py-24"
	>
		<!-- Animated background -->
		<div class="absolute inset-0 opacity-20">
			<div
				class="shimmer absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500"
			></div>
			<div
				class="shimmer absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-indigo-500 via-cyan-500 to-blue-500"
			></div>
		</div>

		<div class="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
			<div class="mb-12 text-center sm:mb-16">
				<h2 class="mb-3 text-3xl font-bold text-white sm:mb-4 sm:text-4xl lg:text-5xl">
					Why Choose DefenSys?
				</h2>
				<p class="text-base text-gray-400 sm:text-lg lg:text-xl">
					See how we compare to traditional security solutions
				</p>
			</div>

			<div
				class="glass rounded-3xl border border-blue-500/20 bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-8 backdrop-blur-sm"
			>
				<div class="overflow-x-auto">
					<table class="w-full">
						<thead>
							<tr class="border-b border-gray-700">
								<th class="px-6 py-4 text-left font-semibold text-white">Feature</th>
								<th class="px-6 py-4 text-center font-semibold text-blue-400">DefenSys</th>
								<th class="px-6 py-4 text-center font-semibold text-gray-400">Traditional Tools</th>
							</tr>
						</thead>
						<tbody class="text-gray-300">
							<tr class="border-b border-gray-800">
								<td class="px-6 py-4">Setup Time</td>
								<td class="px-6 py-4 text-center">
									<span
										class="inline-flex items-center rounded-full bg-green-500/20 px-3 py-1 text-sm text-green-400"
									>
										&lt; 5 minutes
									</span>
								</td>
								<td class="px-6 py-4 text-center">
									<span
										class="inline-flex items-center rounded-full bg-red-500/20 px-3 py-1 text-sm text-red-400"
									>
										Days/Weeks
									</span>
								</td>
							</tr>
							<tr class="border-b border-gray-800">
								<td class="px-6 py-4">Real-time Scanning</td>
								<td class="px-6 py-4 text-center">
									<svg
										class="mx-auto h-6 w-6 text-green-400"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fill-rule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clip-rule="evenodd"
										/>
									</svg>
								</td>
								<td class="px-6 py-4 text-center">
									<svg class="mx-auto h-6 w-6 text-red-400" fill="currentColor" viewBox="0 0 20 20">
										<path
											fill-rule="evenodd"
											d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
											clip-rule="evenodd"
										/>
									</svg>
								</td>
							</tr>
							<tr class="border-b border-gray-800">
								<td class="px-6 py-4">AI-Powered Analysis</td>
								<td class="px-6 py-4 text-center">
									<svg
										class="mx-auto h-6 w-6 text-green-400"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fill-rule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clip-rule="evenodd"
										/>
									</svg>
								</td>
								<td class="px-6 py-4 text-center">
									<span class="text-gray-500">Limited</span>
								</td>
							</tr>
							<tr>
								<td class="px-6 py-4">Cost per Month</td>
								<td class="px-6 py-4 text-center">
									<!-- <span
										class="inline-flex items-center rounded-full bg-blue-500/20 px-3 py-1 text-sm text-blue-400"
									>
										&lt; $10
									</span> -->
									<span class="text-gray-500">Free</span>

								</td>
								<td class="px-6 py-4 text-center">
									<span
										class="inline-flex items-center rounded-full bg-red-500/20 px-3 py-1 text-sm text-red-400"
									>
										$200+
									</span>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>

	<!-- CTA Section -->
	<div
		class="relative overflow-x-hidden bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 py-16 sm:py-20 lg:py-24"
	>
		<div class="relative z-10 mx-auto max-w-4xl px-6 text-center lg:px-12">
			<h2 class="mb-6 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
				Ready to Secure Your Network?
			</h2>
			<p class="mb-8 text-lg text-gray-300 sm:text-xl">
				Join thousands of security teams who trust DefenSys to protect their infrastructure.
			</p>
			<div class="flex flex-col justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
				<button
							on:click={() => goto('/login')}
					class="transform rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-10 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:from-blue-600 hover:to-cyan-600 hover:shadow-2xl hover:shadow-blue-500/25"
				>
					Start Free Trial
				</button>
				<button
							on:click={() => goto('/support')}
					class="rounded-xl border-2 border-blue-400 px-10 py-4 text-lg font-semibold text-white transition-all duration-300 hover:border-blue-300 hover:bg-blue-400/10"
				>
					Contact Sales
				</button>
			</div>
		</div>
	</div>
</div>

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

	@keyframes shimmer {
		0% {
			background-position: -200% 0;
		}
		100% {
			background-position: 200% 0;
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

	.shimmer {
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
		background-size: 200% 100%;
		animation: shimmer 2s infinite;
	}
</style>
