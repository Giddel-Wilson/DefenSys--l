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
	
	@keyframes float {
		0%, 100% {
			transform: translateY(0px);
		}
		50% {
			transform: translateY(-20px);
		}
	}
	
	@keyframes pulse {
		0%, 100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
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
	
	.floating {
		animation: float 6s ease-in-out infinite;
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

        <!-- Navigation -->
		<Navigation />

		<!-- Hero Content -->
		<div class="relative z-10 px-6 pt-10 pb-20 md:py-20 lg:px-12 lg:py-32 parallax-container">
			<div class="max-w-4xl mx-auto text-center">
				<div class="space-y-8">
					<!-- Badge -->
					<div class="inline-flex items-center justify-center gap-3 bg-blue-900/60 backdrop-blur-sm border border-blue-400/50 rounded-full px-6 py-3 glass {isLoaded ? 'animate-[fadeInUp_0.8s_ease-out_0.1s]' : 'opacity-0'} [animation-fill-mode:both]">
						<div class="w-3 h-3 bg-orange-400 rounded-full" style="animation: pulse 2s infinite;"></div>
						<span class="text-white font-bold text-sm md:text-base">Coming Soon</span>
					</div>
					
					<!-- Main Headline -->
					<div class="space-y-6">
						<h1 class="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight {isLoaded ? 'animate-[fadeInUp_1s_ease-out_0.3s]' : 'opacity-0'} [animation-fill-mode:both]">
							<span class="text-white">Enterprise</span>
							<span class="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400">
								Solutions
							</span>
						</h1>
						
						<p class="text-xl sm:text-2xl lg:text-3xl text-gray-300 leading-relaxed max-w-3xl mx-auto {isLoaded ? 'animate-[fadeInUp_1s_ease-out_0.5s]' : 'opacity-0'} [animation-fill-mode:both]">
							Advanced enterprise features designed for large organizations with complex security requirements are currently in development.
						</p>
					</div>
					
					<!-- Coming Soon Features -->
					<div class="space-y-6 {isLoaded ? 'animate-[fadeInUp_1s_ease-out_0.7s]' : 'opacity-0'} [animation-fill-mode:both]">
						<div class="text-lg text-blue-400 font-semibold mb-4">What's Coming:</div>
						<div class="grid sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
							<div class="flex items-center space-x-3">
								<div class="w-2 h-2 bg-blue-400 rounded-full" style="animation: pulse 2s infinite;"></div>
								<span class="text-gray-300">Advanced Role-Based Access Control</span>
							</div>
							<div class="flex items-center space-x-3">
								<div class="w-2 h-2 bg-cyan-400 rounded-full" style="animation: pulse 2s infinite; animation-delay: 0.5s;"></div>
								<span class="text-gray-300">Custom Compliance Reporting</span>
							</div>
							<div class="flex items-center space-x-3">
								<div class="w-2 h-2 bg-indigo-400 rounded-full" style="animation: pulse 2s infinite; animation-delay: 1s;"></div>
								<span class="text-gray-300">Multi-Tenant Architecture</span>
							</div>
							<div class="flex items-center space-x-3">
								<div class="w-2 h-2 bg-blue-300 rounded-full" style="animation: pulse 2s infinite; animation-delay: 1.5s;"></div>
								<span class="text-gray-300">Dedicated Security Operations Center</span>
							</div>
							<div class="flex items-center space-x-3">
								<div class="w-2 h-2 bg-purple-400 rounded-full" style="animation: pulse 2s infinite; animation-delay: 2s;"></div>
								<span class="text-gray-300">Private Cloud Deployment</span>
							</div>
							<div class="flex items-center space-x-3">
								<div class="w-2 h-2 bg-pink-400 rounded-full" style="animation: pulse 2s infinite; animation-delay: 2.5s;"></div>
								<span class="text-gray-300">24/7 Dedicated Support</span>
							</div>
						</div>
					</div>
					
					<!-- Notification Signup -->
					<div class="space-y-6 {isLoaded ? 'animate-[fadeInUp_1s_ease-out_0.9s]' : 'opacity-0'} [animation-fill-mode:both]">
						<div class="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-3xl p-8 border border-blue-500/20 glass max-w-md mx-auto">
							<h3 class="text-xl font-bold text-white mb-4">Get Notified</h3>
							<p class="text-gray-400 mb-6">Be the first to know when Enterprise features launch.</p>
							<div class="space-y-4">
								<input 
									type="email" 
									placeholder="Enter your email address"
									class="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-blue-500/30 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
								>
								<button class="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25">
									Notify Me
								</button>
							</div>
						</div>
					</div>
					
					<!-- Contact CTA -->
					<div class="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 {isLoaded ? 'animate-[fadeInUp_1s_ease-out_1.1s]' : 'opacity-0'} [animation-fill-mode:both]">
						<button class="border-2 border-blue-400 hover:bg-blue-400/10 px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-400/25 group">
							<span class="flex items-center justify-center space-x-2">
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
								</svg>
								<span>Contact Sales Team</span>
							</span>
						</button>
						<button class="border-2 border-gray-600 hover:bg-gray-600/10 px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:border-gray-500 text-gray-300 hover:text-white">
							Learn About Current Features
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Timeline Section -->
	<div class="bg-slate-900 py-16 sm:py-20 lg:py-24 relative overflow-x-hidden">
		<div class="relative z-10 max-w-4xl mx-auto px-6 lg:px-12">
			<div class="text-center mb-12 sm:mb-16">
				<div class="inline-block bg-blue-900/30 border border-blue-500/30 rounded-full px-6 py-2 mb-6">
					<span class="text-blue-400 font-semibold">Development Roadmap</span>
				</div>
				<h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
					Coming in 2026
				</h2>
				<p class="text-base sm:text-lg lg:text-xl text-gray-400">
					Our enterprise development timeline
				</p>
			</div>
			
			<div class="space-y-8">
				<!-- Q2 2026 -->
				<div class="flex items-start space-x-6">
					<div class="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
						<span class="text-white font-bold">Q2</span>
					</div>
					<div class="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20 glass flex-1">
						<h3 class="text-xl font-bold text-white mb-2">Beta Testing Phase</h3>
						<p class="text-gray-400 mb-4">Initial enterprise features beta program with select customers</p>
						<div class="text-sm text-blue-400">• Advanced RBAC • Custom Dashboards • Extended API</div>
					</div>
				</div>
				
				<!-- Q3 2026 -->
				<div class="flex items-start space-x-6">
					<div class="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full flex items-center justify-center">
						<span class="text-white font-bold">Q3</span>
					</div>
					<div class="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20 glass flex-1">
						<h3 class="text-xl font-bold text-white mb-2">Enterprise Launch</h3>
						<p class="text-gray-400 mb-4">Full enterprise suite with compliance and multi-tenant support</p>
						<div class="text-sm text-blue-400">• Compliance Reporting • Multi-Tenant • Private Cloud</div>
					</div>
				</div>
				
				<!-- Q4 2026 -->
				<div class="flex items-start space-x-6">
					<div class="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
						<span class="text-white font-bold">Q4</span>
					</div>
					<div class="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20 glass flex-1">
						<h3 class="text-xl font-bold text-white mb-2">Advanced Features</h3>
						<p class="text-gray-400 mb-4">AI-powered analytics and dedicated SOC services</p>
						<div class="text-sm text-blue-400">• AI Analytics • Dedicated SOC • Advanced Integrations</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- FAQ Section -->
	<div class="bg-gradient-to-r from-slate-800 to-slate-900 py-16 sm:py-20 lg:py-24 relative overflow-hidden">
		<div class="relative z-10 max-w-4xl mx-auto px-6 lg:px-12">
			<div class="text-center mb-12 sm:mb-16">
				<h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
					Frequently Asked Questions
				</h2>
			</div>
			
			<div class="space-y-6">
				<div class="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20 glass">
					<h3 class="text-xl font-bold text-white mb-3">When will Enterprise features be available?</h3>
					<p class="text-gray-400">We're targeting Q2 2026 for beta testing and Q3 2026 for the full enterprise launch. Sign up for notifications to be the first to know about availability.</p>
				</div>
				
				<div class="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20 glass">
					<h3 class="text-xl font-bold text-white mb-3">Can I use current DefenSys features now?</h3>
					<p class="text-gray-400">Absolutely! Our core platform with network scanning, vulnerability assessment, and real-time monitoring is available now. Enterprise features will be an add-on to existing capabilities.</p>
				</div>
				
				<div class="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20 glass">
					<h3 class="text-xl font-bold text-white mb-3">What will Enterprise pricing look like?</h3>
					<p class="text-gray-400">Enterprise pricing will be custom-tailored based on your organization's size, requirements, and deployment preferences. Contact our sales team for early discussions.</p>
				</div>
			</div>
		</div>
	</div>
</div>
