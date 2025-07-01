<script>
	import Navigation from '$lib/components/Navigation.svelte';
	import { onMount } from 'svelte';
	
	let isLoaded = false;
	
	onMount(() => {
		isLoaded = true;
	});
</script>

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
			<div class="max-w-7xl mx-auto text-center">
				<div class="space-y-8">
					<!-- Badge -->
									<div class="inline-flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3 bg-blue-900/60 backdrop-blur-sm border border-blue-400/50 rounded-full px-6 py-3 glass {isLoaded ? 'animate-[scaleIn_0.8s_ease-out_0.1s]' : 'opacity-0'} [animation-fill-mode:both]">
						<div class="flex text-yellow-400">
							<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
								<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
							</svg>
							<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
								<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
							</svg>
							<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
								<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
							</svg>
							<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
								<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
							</svg>
							<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
								<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
							</svg>
						</div>
						<span class="text-white font-bold text-sm md:text-base">Complete Security Platform</span>
					</div>
					
					<!-- Main Headline -->
					<div class="space-y-6">
						<h1 class="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight {isLoaded ? 'animate-[fadeInUp_1s_ease-out_0.3s]' : 'opacity-0'} [animation-fill-mode:both]">
							<span class="text-white">Comprehensive</span>
							<span class="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400">
								Security Features
							</span>
						</h1>
						
						<p class="text-lg sm:text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-4xl mx-auto {isLoaded ? 'animate-[fadeInUp_1s_ease-out_0.5s]' : 'opacity-0'} [animation-fill-mode:both]">
							Advanced vulnerability scanning, real-time threat detection, and intelligent security analytics - all in one powerful platform designed for modern security teams.
						</p>
					</div>
					
					<!-- CTA Buttons -->
					<div class="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 {isLoaded ? 'animate-[fadeInUp_1s_ease-out_0.7s]' : 'opacity-0'} [animation-fill-mode:both]">
						<button class="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 group">
							<span class="flex items-center justify-center space-x-2">
								<span>Start Free Trial</span>
								<svg class="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
								</svg>
							</span>
						</button>
						<button class="border-2 border-blue-400 hover:bg-blue-400/10 px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-400/25 group">
							<span class="flex items-center justify-center space-x-2">
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
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
	<div class="bg-slate-900 py-16 sm:py-20 lg:py-24 relative overflow-x-hidden">
		<!-- Background Pattern -->
		<div class="absolute inset-0 opacity-10">
			<div class="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-500 to-transparent"></div>
			<div class="absolute top-0 left-2/4 w-px h-full bg-gradient-to-b from-transparent via-cyan-500 to-transparent"></div>
			<div class="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-indigo-500 to-transparent"></div>
		</div>

		<div class="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
			<div class="text-center mb-12 sm:mb-16 lg:mb-20">
				<div class="inline-block bg-blue-900/30 border border-blue-500/30 rounded-full px-6 py-2 mb-6">
					<span class="text-blue-400 font-semibold">Core Features</span>
				</div>
				<h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
					Everything You Need for
					<span class="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
						Complete Security
					</span>
				</h2>
				<p class="text-base sm:text-lg lg:text-xl text-gray-400 max-w-3xl mx-auto">
					From automated vulnerability scanning to real-time threat intelligence, DefenSys provides comprehensive security capabilities.
				</p>
			</div>
			
			<div class="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
				<!-- Network Scanning -->
				<div class="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-blue-500/20 hover:border-blue-400/50 transition-all duration-300 hover-lift glass">
					<div class="flex items-center mb-4 lg:mb-6">
						<div class="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mr-3 lg:mr-4 group-hover:scale-110 transition-transform">
							<svg class="w-6 h-6 lg:w-7 lg:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
								<path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z"/>
							</svg>
						</div>
						<h3 class="text-lg lg:text-xl font-bold text-white">Network Discovery</h3>
					</div>
					<p class="text-sm lg:text-base text-gray-400 leading-relaxed mb-4">
						Comprehensive network mapping with automated asset discovery, service fingerprinting, and topology visualization.
					</p>
					<div class="text-blue-400 font-semibold group-hover:text-cyan-400 transition-colors text-sm flex items-center space-x-2">
						<span>Learn More</span>
						<svg class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
						</svg>
					</div>
				</div>
				
				<!-- Vulnerability Assessment -->
				<div class="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-blue-500/20 hover:border-blue-400/50 transition-all duration-300 hover-lift glass">
					<div class="flex items-center mb-4 lg:mb-6">
						<div class="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center mr-3 lg:mr-4 group-hover:scale-110 transition-transform">
							<svg class="w-6 h-6 lg:w-7 lg:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
								<path d="M12,2L13.09,8.26L22,9L13.09,9.74L12,16L10.91,9.74L2,9L10.91,8.26L12,2M12,21.5A9.5,9.5 0 0,1 2.5,12A9.5,9.5 0 0,1 12,2.5A9.5,9.5 0 0,1 21.5,12A9.5,9.5 0 0,1 12,21.5M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20Z"/>
							</svg>
						</div>
						<h3 class="text-lg lg:text-xl font-bold text-white">Vulnerability Scanning</h3>
					</div>
					<p class="text-sm lg:text-base text-gray-400 leading-relaxed mb-4">
						Advanced vulnerability detection with CVE mapping, CVSS scoring, and prioritized remediation recommendations.
					</p>
					<div class="text-blue-400 font-semibold group-hover:text-cyan-400 transition-colors text-sm flex items-center space-x-2">
						<span>Learn More</span>
						<svg class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
						</svg>
					</div>
				</div>
				
				<!-- Real-time Monitoring -->
				<div class="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-blue-500/20 hover:border-blue-400/50 transition-all duration-300 hover-lift glass">
					<div class="flex items-center mb-4 lg:mb-6">
						<div class="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mr-3 lg:mr-4 group-hover:scale-110 transition-transform">
							<svg class="w-6 h-6 lg:w-7 lg:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
								<path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M15,17H9V15H15V17M15,13H9V11H15V13M15,9H9V7H15V9Z"/>
							</svg>
						</div>
						<h3 class="text-lg lg:text-xl font-bold text-white">Real-time Monitoring</h3>
					</div>
					<p class="text-sm lg:text-base text-gray-400 leading-relaxed mb-4">
						Continuous security monitoring with instant threat detection, automated alerting, and rapid incident response.
					</p>
					<div class="text-blue-400 font-semibold group-hover:text-cyan-400 transition-colors text-sm flex items-center space-x-2">
						<span>Learn More</span>
						<svg class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
						</svg>
					</div>
				</div>

				<!-- Threat Intelligence -->
				<div class="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-blue-500/20 hover:border-blue-400/50 transition-all duration-300 hover-lift glass">
					<div class="flex items-center mb-4 lg:mb-6">
						<div class="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center mr-3 lg:mr-4 group-hover:scale-110 transition-transform">
							<svg class="w-6 h-6 lg:w-7 lg:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
								<path d="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9M10,16V19.08L13.08,16H20V4H4V16H10Z"/>
							</svg>
						</div>
						<h3 class="text-lg lg:text-xl font-bold text-white">Threat Intelligence</h3>
					</div>
					<p class="text-sm lg:text-base text-gray-400 leading-relaxed mb-4">
						AI-powered threat analysis with global intelligence feeds, behavioral analytics, and predictive security insights.
					</p>
					<div class="text-blue-400 font-semibold group-hover:text-cyan-400 transition-colors text-sm flex items-center space-x-2">
						<span>Learn More</span>
						<svg class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
						</svg>
					</div>
				</div>

				<!-- Compliance Management -->
				<div class="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-blue-500/20 hover:border-blue-400/50 transition-all duration-300 hover-lift glass">
					<div class="flex items-center mb-4 lg:mb-6">
						<div class="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center mr-3 lg:mr-4 group-hover:scale-110 transition-transform">
							<svg class="w-6 h-6 lg:w-7 lg:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
								<path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
							</svg>
						</div>
						<h3 class="text-lg lg:text-xl font-bold text-white">Compliance Center</h3>
					</div>
					<p class="text-sm lg:text-base text-gray-400 leading-relaxed mb-4">
						Automated compliance reporting for SOC2, ISO 27001, PCI DSS, and other regulatory frameworks.
					</p>
					<div class="text-blue-400 font-semibold group-hover:text-cyan-400 transition-colors text-sm flex items-center space-x-2">
						<span>Learn More</span>
						<svg class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
						</svg>
					</div>
				</div>

				<!-- API Integration -->
				<div class="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-blue-500/20 hover:border-blue-400/50 transition-all duration-300 hover-lift glass">
					<div class="flex items-center mb-4 lg:mb-6">
						<div class="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mr-3 lg:mr-4 group-hover:scale-110 transition-transform">
							<svg class="w-6 h-6 lg:w-7 lg:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
								<path d="M8,3A2,2 0 0,0 6,5V9A2,2 0 0,1 4,11H3V13H4A2,2 0 0,1 6,15V19A2,2 0 0,0 8,21H10V19H8V14A2,2 0 0,0 6,12A2,2 0 0,0 8,10V5H10V3H8M16,3A2,2 0 0,1 18,5V9A2,2 0 0,0 20,11H21V13H20A2,2 0 0,0 18,15V19A2,2 0 0,1 16,21H14V19H16V14A2,2 0 0,1 18,12A2,2 0 0,1 16,10V5H14V3H16Z"/>
							</svg>
						</div>
						<h3 class="text-lg lg:text-xl font-bold text-white">API Integration</h3>
					</div>
					<p class="text-sm lg:text-base text-gray-400 leading-relaxed mb-4">
						Comprehensive REST API for seamless integration with existing security tools, SIEM platforms, and workflows.
					</p>
					<div class="text-blue-400 font-semibold group-hover:text-cyan-400 transition-colors text-sm flex items-center space-x-2">
						<span>Learn More</span>
						<svg class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
						</svg>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Feature Comparison Section -->
	<div class="bg-gradient-to-r from-slate-800 to-slate-900 py-16 sm:py-20 lg:py-24 relative overflow-hidden">
		<!-- Animated background -->
		<div class="absolute inset-0 opacity-20">
			<div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500 shimmer"></div>
			<div class="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-cyan-500 to-blue-500 shimmer"></div>
		</div>
		
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
			<div class="text-center mb-12 sm:mb-16">
				<h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
					Why Choose DefenSys?
				</h2>
				<p class="text-base sm:text-lg lg:text-xl text-gray-400">
					See how we compare to traditional security solutions
				</p>
			</div>
			
			<div class="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-3xl p-8 border border-blue-500/20 glass">
				<div class="overflow-x-auto">
					<table class="w-full">
						<thead>
							<tr class="border-b border-gray-700">
								<th class="text-left py-4 px-6 text-white font-semibold">Feature</th>
								<th class="text-center py-4 px-6 text-blue-400 font-semibold">DefenSys</th>
								<th class="text-center py-4 px-6 text-gray-400 font-semibold">Traditional Tools</th>
							</tr>
						</thead>
						<tbody class="text-gray-300">
							<tr class="border-b border-gray-800">
								<td class="py-4 px-6">Setup Time</td>
								<td class="text-center py-4 px-6">
									<span class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-500/20 text-green-400">
										&lt; 5 minutes
									</span>
								</td>
								<td class="text-center py-4 px-6">
									<span class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-500/20 text-red-400">
										Days/Weeks
									</span>
								</td>
							</tr>
							<tr class="border-b border-gray-800">
								<td class="py-4 px-6">Real-time Scanning</td>
								<td class="text-center py-4 px-6">
									<svg class="w-6 h-6 text-green-400 mx-auto" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
									</svg>
								</td>
								<td class="text-center py-4 px-6">
									<svg class="w-6 h-6 text-red-400 mx-auto" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
									</svg>
								</td>
							</tr>
							<tr class="border-b border-gray-800">
								<td class="py-4 px-6">AI-Powered Analysis</td>
								<td class="text-center py-4 px-6">
									<svg class="w-6 h-6 text-green-400 mx-auto" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
									</svg>
								</td>
								<td class="text-center py-4 px-6">
									<span class="text-gray-500">Limited</span>
								</td>
							</tr>
							<tr>
								<td class="py-4 px-6">Cost per Month</td>
								<td class="text-center py-4 px-6">
									<span class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-500/20 text-blue-400">
										&lt; $10
									</span>
								</td>
								<td class="text-center py-4 px-6">
									<span class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-500/20 text-red-400">
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
	<div class="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 py-16 sm:py-20 lg:py-24 relative overflow-x-hidden">
		<div class="relative z-10 max-w-4xl mx-auto text-center px-6 lg:px-12">
			<h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
				Ready to Secure Your Network?
			</h2>
			<p class="text-lg sm:text-xl text-gray-300 mb-8">
				Join thousands of security teams who trust DefenSys to protect their infrastructure.
			</p>
			<div class="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
				<button class="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25">
					Start Free Trial
				</button>
				<button class="border-2 border-blue-400 hover:bg-blue-400/10 px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:border-blue-300 text-white">
					Contact Sales
				</button>
			</div>
		</div>
	</div>
</div>
