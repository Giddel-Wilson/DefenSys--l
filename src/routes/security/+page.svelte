<script>
	import Navigation from '$lib/components/Navigation.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	
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
					<div class="inline-flex items-center justify-center gap-3 bg-blue-900/60 backdrop-blur-sm border border-blue-400/50 rounded-full px-6 py-3 glass {isLoaded ? 'animate-[fadeInUp_0.8s_ease-out_0.1s]' : 'opacity-0'} [animation-fill-mode:both]">
						<div class="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
						<span class="text-white font-bold text-sm md:text-base">Bank-Grade Security</span>
					</div>
					
					<!-- Main Headline -->
					<div class="space-y-6">
						<h1 class="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight {isLoaded ? 'animate-[fadeInUp_1s_ease-out_0.3s]' : 'opacity-0'} [animation-fill-mode:both]">
							<span class="text-white">Enterprise-Grade</span>
							<span class="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400">
								Security Architecture
							</span>
						</h1>
						
						<p class="text-lg sm:text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-4xl mx-auto {isLoaded ? 'animate-[fadeInUp_1s_ease-out_0.5s]' : 'opacity-0'} [animation-fill-mode:both]">
							Advanced threat protection with zero-trust architecture, end-to-end encryption, and military-grade security protocols designed for the most demanding enterprise environments.
						</p>
					</div>
					
					<!-- Security Badges -->
					<div class="flex flex-wrap justify-center gap-4 {isLoaded ? 'animate-[fadeInUp_1s_ease-out_0.7s]' : 'opacity-0'} [animation-fill-mode:both]">
						<div class="bg-slate-800/50 backdrop-blur-sm border border-blue-500/30 rounded-xl px-4 py-2 glass">
							<span class="text-sm font-semibold text-blue-400">SOC 2 Type II</span>
						</div>
						<div class="bg-slate-800/50 backdrop-blur-sm border border-blue-500/30 rounded-xl px-4 py-2 glass">
							<span class="text-sm font-semibold text-blue-400">ISO 27001</span>
						</div>
						<div class="bg-slate-800/50 backdrop-blur-sm border border-blue-500/30 rounded-xl px-4 py-2 glass">
							<span class="text-sm font-semibold text-blue-400">PCI DSS</span>
						</div>
						<div class="bg-slate-800/50 backdrop-blur-sm border border-blue-500/30 rounded-xl px-4 py-2 glass">
							<span class="text-sm font-semibold text-blue-400">HIPAA</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Security Features Section -->
	<div class="bg-slate-900 py-16 sm:py-20 lg:py-24 relative overflow-x-hidden">
		<div class="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
			<div class="text-center mb-12 sm:mb-16 lg:mb-20">
				<div class="inline-block bg-blue-900/30 border border-blue-500/30 rounded-full px-6 py-2 mb-6">
					<span class="text-blue-400 font-semibold">Security Framework</span>
				</div>
				<h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
					Multi-Layered Protection
				</h2>
				<p class="text-base sm:text-lg lg:text-xl text-gray-400 max-w-3xl mx-auto">
					Comprehensive security architecture designed to protect against modern threats and ensure complete data integrity.
				</p>
			</div>
			
			<div class="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
				<!-- Security Features List -->
				<div class="space-y-6">
					<div class="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20 hover:border-blue-400/50 transition-all duration-300 hover-lift glass">
						<div class="flex items-start space-x-4">
							<div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
								<svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
									<path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z"/>
								</svg>
							</div>
							<div>
								<h3 class="text-xl font-bold text-white mb-2">JWT Authentication</h3>
								<p class="text-gray-400">Secure token-based authentication with httpOnly cookies and bcrypt password hashing for maximum protection.</p>
							</div>
						</div>
					</div>

					<div class="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20 hover:border-blue-400/50 transition-all duration-300 hover-lift glass">
						<div class="flex items-start space-x-4">
							<div class="w-12 h-12 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
								<svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
									<path d="M6,2L18,2V20L6,20V2M7,3V19H17V3H7M8,4H16V18H8V4M9,5V17H15V5H9Z"/>
								</svg>
							</div>
							<div>
								<h3 class="text-xl font-bold text-white mb-2">Encrypted Data Storage</h3>
								<p class="text-gray-400">MongoDB with secure connections, data encryption, and role-based access control for all stored information.</p>
							</div>
						</div>
					</div>

					<div class="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20 hover:border-blue-400/50 transition-all duration-300 hover-lift glass">
						<div class="flex items-start space-x-4">
							<div class="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
								<svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
									<path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4Z"/>
								</svg>
							</div>
							<div>
								<h3 class="text-xl font-bold text-white mb-2">Vulnerability Detection</h3>
								<p class="text-gray-400">Automated scanning for SQL injection, XSS, CSRF, SSL/TLS issues, and security misconfigurations.</p>
							</div>
						</div>
					</div>

					<div class="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20 hover:border-blue-400/50 transition-all duration-300 hover-lift glass">
						<div class="flex items-start space-x-4">
							<div class="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
								<svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
									<path d="M15,4A4,4 0 0,0 11,8A4,4 0 0,0 15,12A4,4 0 0,0 19,8A4,4 0 0,0 15,4M15,5.9A2.1,2.1 0 0,1 17.1,8A2.1,2.1 0 0,1 15,10.1A2.1,2.1 0 0,1 12.9,8A2.1,2.1 0 0,1 15,5.9M4,7V10H1V12H4V15H6V12H9V10H6V7H4M15,13C12.33,13 7,14.33 7,17V20H23V17C23,14.33 17.67,13 15,13M15,14.9C17.97,14.9 21.1,16.36 21.1,17V18.1H8.9V17C8.9,16.36 12,14.9 15,14.9Z"/>
								</svg>
							</div>
							<div>
								<h3 class="text-xl font-bold text-white mb-2">Role-Based Access</h3>
								<p class="text-gray-400">Granular user and admin roles with customizable permissions to control access to sensitive features.</p>
							</div>
						</div>
					</div>
				</div>

				<!-- Security Visualization -->
				<div class="relative">
					<div class="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-3xl p-8 border border-blue-500/20 glass">
						<div class="text-center mb-8">
							<h3 class="text-2xl font-bold text-white mb-2">Security Layers</h3>
							<p class="text-gray-400">Multiple protection barriers ensure comprehensive security</p>
						</div>
						
						<!-- Concentric Security Circles -->
						<div class="relative mx-auto w-64 h-64 flex items-center justify-center">
							<!-- Outer Layer -->
							<div class="absolute w-64 h-64 rounded-full border-2 border-blue-500/30 bg-blue-500/5 animate-pulse" style="animation-delay: 0s;"></div>
							
							<!-- Middle Layer -->
							<div class="absolute w-48 h-48 rounded-full border-2 border-cyan-500/40 bg-cyan-500/10 animate-pulse" style="animation-delay: 1s;"></div>
							
							<!-- Inner Layer -->
							<div class="absolute w-32 h-32 rounded-full border-2 border-indigo-500/50 bg-indigo-500/20 animate-pulse" style="animation-delay: 2s;"></div>
							
							<!-- Core -->
							<div class="relative w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
								<svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
									<path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1Z"/>
								</svg>
							</div>
							
							<!-- Layer Labels -->
							<div class="absolute top-2 left-1/2 transform -translate-x-1/2">
								<span class="text-xs text-blue-400 font-semibold">Perimeter Defense</span>
							</div>
							<div class="absolute top-8 left-1/2 transform -translate-x-1/2">
								<span class="text-xs text-cyan-400 font-semibold">Access Control</span>
							</div>
							<div class="absolute top-14 left-1/2 transform -translate-x-1/2">
								<span class="text-xs text-indigo-400 font-semibold">Data Protection</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Compliance Section -->
	<div class="bg-gradient-to-r from-slate-800 to-slate-900 py-16 sm:py-20 lg:py-24 relative overflow-hidden">
		<!-- Animated background -->
		<div class="absolute inset-0 opacity-20">
			<div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500 shimmer"></div>
			<div class="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-cyan-500 to-blue-500 shimmer"></div>
		</div>
		
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
			<div class="text-center mb-12 sm:mb-16">
				<h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
					Compliance & Certifications
				</h2>
				<p class="text-base sm:text-lg lg:text-xl text-gray-400">
					Meet the highest industry standards and regulatory requirements
				</p>
			</div>
			
			<div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
				<!-- SOC 2 -->
				<div class="text-center group">
					<div class="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-blue-500/20 group-hover:border-blue-400/40 transition-all duration-500 hover-lift glass">
						<div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
							<span class="text-white font-bold text-lg">SOC</span>
						</div>
						<h3 class="text-lg font-bold text-white mb-2">SOC 2 Type II</h3>
						<p class="text-sm text-gray-400">Audited security controls and operational effectiveness</p>
					</div>
				</div>
				
				<!-- ISO 27001 -->
				<div class="text-center group">
					<div class="bg-gradient-to-br from-indigo-900/40 to-blue-900/40 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-blue-500/20 group-hover:border-blue-400/40 transition-all duration-500 hover-lift glass">
						<div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl flex items-center justify-center">
							<span class="text-white font-bold text-sm">ISO</span>
						</div>
						<h3 class="text-lg font-bold text-white mb-2">ISO 27001</h3>
						<p class="text-sm text-gray-400">International information security management</p>
					</div>
				</div>
				
				<!-- PCI DSS -->
				<div class="text-center group">
					<div class="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-blue-500/20 group-hover:border-blue-400/40 transition-all duration-500 hover-lift glass">
						<div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center">
							<span class="text-white font-bold text-sm">PCI</span>
						</div>
						<h3 class="text-lg font-bold text-white mb-2">PCI DSS</h3>
						<p class="text-sm text-gray-400">Payment card industry data security standards</p>
					</div>
				</div>
				
				<!-- HIPAA -->
				<div class="text-center group">
					<div class="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-blue-500/20 group-hover:border-blue-400/40 transition-all duration-500 hover-lift glass">
						<div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center">
							<span class="text-white font-bold text-xs">HIPAA</span>
						</div>
						<h3 class="text-lg font-bold text-white mb-2">HIPAA Compliant</h3>
						<p class="text-sm text-gray-400">Healthcare information privacy and security</p>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Security Stats Section -->
	<div class="bg-slate-900 py-16 sm:py-20 lg:py-24 relative overflow-x-hidden">
		<div class="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
			<div class="text-center mb-12 sm:mb-16">
				<h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
					Security by the Numbers
				</h2>
				<p class="text-base sm:text-lg lg:text-xl text-gray-400">
					Our track record speaks for itself
				</p>
			</div>
			
			<div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
				<div class="text-center">
					<div class="text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 mb-2">
						99.99%
					</div>
					<div class="text-gray-300 font-medium">Uptime SLA</div>
					<div class="text-sm text-gray-500 mt-1">Last 12 months</div>
				</div>
				
				<div class="text-center">
					<div class="text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-2">
						&lt;30ms
					</div>
					<div class="text-gray-300 font-medium">Threat Response</div>
					<div class="text-sm text-gray-500 mt-1">Average detection time</div>
				</div>
				
				<div class="text-center">
					<div class="text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 mb-2">
						Zero
					</div>
					<div class="text-gray-300 font-medium">Data Breaches</div>
					<div class="text-sm text-gray-500 mt-1">In company history</div>
				</div>
				
				<div class="text-center">
					<div class="text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-2">
						24/7
					</div>
					<div class="text-gray-300 font-medium">Security Monitoring</div>
					<div class="text-sm text-gray-500 mt-1">Global SOC coverage</div>
				</div>
			</div>
		</div>
	</div>

	<!-- CTA Section -->
	<div class="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 py-16 sm:py-20 lg:py-24 relative overflow-x-hidden">
		<div class="relative z-10 max-w-4xl mx-auto text-center px-6 lg:px-12">
			<h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
				Secure Your Infrastructure Today
			</h2>
			<p class="text-lg sm:text-xl text-gray-300 mb-8">
				Experience enterprise-grade security with the simplicity of modern cloud platforms.
			</p>
			<div class="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
				<button
					on:click={() => goto('/login')}
					class="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25"
				>
					Start Security Assessment
				</button>
				<button
					on:click={() => goto('/docs')}
					class="border-2 border-blue-400 hover:bg-blue-400/10 px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:border-blue-300 text-white"
				>
					View Security Whitepaper
				</button>
			</div>
		</div>
	</div>
</div>
