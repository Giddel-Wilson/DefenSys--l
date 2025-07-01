<script>
	import { onDestroy, onMount } from 'svelte';
	import { browser } from '$app/environment';
	import mrWilson from '$lib/assets/c7ddb4c8-ea6d-47c0-a148-480b86d104fb.jpeg';
	
	let mobileMenuOpen = false;
	let isLoaded = false;
	let mouseX = 0;
	let mouseY = 0;
	
	// Intersection Observer for scroll animations
	let heroSection;
	let featureCards = [];
	let statsCards = [];
	let testimonialCard;
	
	onMount(() => {
		isLoaded = true;
		
		// Parallax mouse movement
		const handleMouseMove = (e) => {
			mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
			mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
		};
		
		// Intersection Observer for animations on scroll
		const observerOptions = {
			threshold: 0.1,
			rootMargin: '0px 0px -50px 0px'
		};
		
		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					entry.target.classList.add('animate-in');
				}
			});
		}, observerOptions);
		
		// Observe elements for scroll animations
		const animatedElements = document.querySelectorAll('[data-animate]');
		animatedElements.forEach(el => observer.observe(el));
		
		document.addEventListener('mousemove', handleMouseMove);
		
		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
			observer.disconnect();
		};
	});
	
	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
		
		// Prevent body scroll when menu is open (only on client)
		if (browser) {
			if (mobileMenuOpen) {
				document.body.style.overflow = 'hidden';
			} else {
				document.body.style.overflow = 'unset';
			}
		}
	}

	// Clean up on component destroy (only on client)
	onDestroy(() => {
		if (browser) {
			document.body.style.overflow = 'unset';
		}
	});
</script>

<style>
	/* Sophisticated Animation Framework */
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
	
	@keyframes fadeInLeft {
		from {
			opacity: 0;
			transform: translateX(-60px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}
	
	@keyframes fadeInRight {
		from {
			opacity: 0;
			transform: translateX(60px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}
	
	@keyframes scaleIn {
		from {
			opacity: 0;
			transform: scale(0.8);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}
	
	@keyframes glow {
		0%, 100% {
			box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
		}
		50% {
			box-shadow: 0 0 40px rgba(59, 130, 246, 0.6);
		}
	}
	
	@keyframes float {
		0%, 100% {
			transform: translateY(0px);
		}
		50% {
			transform: translateY(-10px);
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
	
	@keyframes pulse-border {
		0%, 100% {
			border-color: rgba(59, 130, 246, 0.3);
		}
		50% {
			border-color: rgba(59, 130, 246, 0.8);
		}
	}
	
	/* Hover effects */
	.hover-lift {
		transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
	}
	
	.hover-lift:hover {
		transform: translateY(-8px);
		box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
	}
	
	.hover-glow:hover {
		animation: glow 2s ease-in-out infinite;
	}
	
	.floating {
		animation: float 6s ease-in-out infinite;
	}
	
	.shimmer {
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
		background-size: 200% 100%;
		animation: shimmer 2s infinite;
	}
	
	/* Glass morphism effects */
	.glass {
		backdrop-filter: blur(30px);
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
	}
	
	/* Parallax container */
	.parallax-container {
		transform-style: preserve-3d;
	}
	
	.parallax-element {
		transition: transform 0.1s ease-out;
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
	<nav class="z-50 flex items-center justify-between px-4 sm:px-6 py-4 sm:py-6 lg:px-12 {mobileMenuOpen ? 'fixed top-0 left-0 right-0 bg-slate-900/95 backdrop-blur-sm' : 'relative'} transition-all duration-500">
		<div class="flex items-center space-x-3 {isLoaded ? 'animate-[fadeInLeft_1s_ease-out]' : 'opacity-0'}">
			<div class="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl hover-glow floating">
				<svg class="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
					<path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
				</svg>
			</div>
			<span class="text-xl sm:text-2xl font-bold">DefenSys</span>
		</div>
		
		<!-- Desktop Navigation -->
		<div class="hidden lg:flex items-center space-x-8 {isLoaded ? 'animate-[fadeInUp_1s_ease-out_0.2s]' : 'opacity-0'} [animation-fill-mode:both]">
			<a href="/features" class="hover:text-blue-400 transition-all duration-300 font-medium relative group">
				Features
				<span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
			</a>
			<a href="/security" class="hover:text-blue-400 transition-all duration-300 font-medium relative group">
				Security
				<span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
			</a>
			<a href="/enterprise" class="hover:text-blue-400 transition-all duration-300 font-medium relative group">
				Enterprise
				<span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
			</a>
			<a href="/docs" class="hover:text-blue-400 transition-all duration-300 font-medium relative group">
				Docs
				<span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
			</a>
			<a href="/support" class="hover:text-blue-400 transition-all duration-300 font-medium relative group">
				Support
				<span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
			</a>
		</div>
		
		<!-- Desktop CTA Buttons -->
		<div class="hidden sm:flex items-center space-x-3 lg:space-x-4 {isLoaded ? 'animate-[fadeInRight_1s_ease-out_0.3s]' : 'opacity-0'} [animation-fill-mode:both]">
			<button class="text-sm hover:text-blue-400 transition-all duration-300 font-medium relative group">
				Sign In
				<span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
			</button>
			<button class="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 px-4 lg:px-6 py-2 lg:py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25">
				Get Started
			</button>
		</div>

		<!-- Mobile Menu Button -->
		<button 
			class="sm:hidden relative z-50 flex flex-col items-center justify-center w-8 h-8 space-y-1"
			on:click={toggleMobileMenu}
			aria-label="Toggle mobile menu"
		>
			<span class="w-6 h-0.5 bg-white transition-all duration-300 {mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}"></span>
			<span class="w-6 h-0.5 bg-white transition-all duration-300 {mobileMenuOpen ? 'opacity-0' : ''}"></span>
			<span class="w-6 h-0.5 bg-white transition-all duration-300 {mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}"></span>
		</button>
	</nav>

	<!-- Mobile Menu Overlay -->
	{#if mobileMenuOpen}
		<div class="fixed inset-0 z-40 sm:hidden">
			<div class="fixed inset-0 bg-slate-900/95 backdrop-blur-sm"></div>
			<div class="relative z-50 flex flex-col items-center justify-center min-h-screen px-6">
				<div class="space-y-8 text-center">
					<div class="space-y-6">
						<a href="/features" class="block text-2xl font-medium text-white hover:text-blue-400 transition-colors" on:click={toggleMobileMenu}>Features</a>
						<a href="/security" class="block text-2xl font-medium text-white hover:text-blue-400 transition-colors" on:click={toggleMobileMenu}>Security</a>
						<a href="/enterprise" class="block text-2xl font-medium text-white hover:text-blue-400 transition-colors" on:click={toggleMobileMenu}>Enterprise</a>
						<a href="/docs" class="block text-2xl font-medium text-white hover:text-blue-400 transition-colors" on:click={toggleMobileMenu}>Docs</a>
						<a href="/support" class="block text-2xl font-medium text-white hover:text-blue-400 transition-colors" on:click={toggleMobileMenu}>Support</a>
					</div>
					
					<div class="pt-8 space-y-4">
						<button class="block w-full text-lg font-medium text-white hover:text-blue-400 transition-colors" on:click={toggleMobileMenu}>
							Sign In
						</button>
						<button class="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 px-8 py-3 rounded-xl text-lg font-semibold transition-all transform hover:scale-105" on:click={toggleMobileMenu}>
							Get Started
						</button>
					</div>
				</div>
			</div>
		</div>
	{/if}

	<!-- Hero Content -->
	<div class="relative z-10 px-6 pt-10 pb-20 md:py-20 lg:px-12 lg:py-32 {mobileMenuOpen ? 'pt-20' : ''} parallax-container">
		<div class="max-w-7xl mx-auto">
			<div class="text-center space-y-12">
				<!-- Badge -->
				<div class="inline-flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3 bg-blue-900/60 backdrop-blur-sm border border-blue-400/50 rounded-full px-6 py-3 glass hover-lift {isLoaded ? 'animate-[scaleIn_0.8s_ease-out_0.1s]' : 'opacity-0'} [animation-fill-mode:both]"
				     style="transform: translateZ({mouseY * 10}px)">
					<div class="flex text-yellow-400 order-2 md:order-1">
						<span>★★★★★</span>
					</div>
					<span class="text-white font-bold text-sm md:text-base text-center md:text-left order-1 md:order-2 drop-shadow-lg">Trusted by 10,000+ Security Teams</span>
				</div>
				
				<!-- Main Headline -->
				<div class="space-y-6" style="transform: translateZ({mouseY * 20}px)">
					<h1 class="text-4xl sm:text-5xl lg:text-6xl xl:text-8xl font-black leading-tight">
						<span class="block">Secure Your</span>
						<span class="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400">
							Network Infrastructure
						</span>
						<span class="block text-2xl sm:text-3xl lg:text-4xl xl:text-5xl mt-4 text-gray-300 font-medium">
							with DefenSys
						</span>
					</h1>
					
					<p class="text-lg sm:text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-4xl mx-auto">
						Advanced vulnerability scanning that identifies open ports, misconfigurations, exposed services, and security threats across your entire network infrastructure in real-time.
					</p>
				</div>
				
				<!-- CTA Buttons -->
				<div class="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 {isLoaded ? 'animate-[fadeInUp_1s_ease-out_1.5s]' : 'opacity-0'} [animation-fill-mode:both]">
					<button class="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 hover-glow group">
						<span class="flex items-center justify-center space-x-2">
							<span>Start Free Scan</span>
							<svg class="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
							</svg>
						</span>
					</button>
					<button class="border-2 border-blue-400 hover:bg-blue-400/10 px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-400/25 group">
						<span class="flex items-center justify-center space-x-2">
							<svg class="w-5 h-5 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.5a2.5 2.5 0 110 5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
							</svg>
							<span>Watch Demo</span>
						</span>
					</button>
				</div>
			</div>

			<!-- Dashboard Preview -->
			<div class="mt-20 relative {isLoaded ? 'animate-[fadeInUp_1s_ease-out_1.7s]' : 'opacity-0'} [animation-fill-mode:both]">
				<div class="relative mx-auto max-w-5xl parallax-element" style="transform: translateZ({mouseY * 30}px)">
					<!-- Floating Cards -->
					<div class="hidden sm:block absolute -top-8 -left-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 shadow-2xl transform rotate-6 opacity-90 hover-lift floating"
					     style="animation-delay: 0s;">
						<div class="text-white">
							<div class="text-3xl font-bold">24/7</div>
							<div class="text-sm opacity-80">Network Monitoring</div>
						</div>
					</div>
					
					<div class="hidden sm:block absolute -top-8 -right-8 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-6 shadow-2xl transform -rotate-6 opacity-90 hover-lift floating"
					     style="animation-delay: 3s;">
						<div class="text-white">
							<div class="text-3xl font-bold">99.9%</div>
							<div class="text-sm opacity-80">Threat Detection</div>
						</div>
					</div>

					<!-- Main Dashboard -->
					<div class="bg-slate-800/70 backdrop-blur-xl rounded-3xl p-8 border border-blue-500/20 shadow-2xl glass group">
						<div class="flex items-center space-x-3 mb-8">
							<div class="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
							<div class="w-4 h-4 bg-yellow-500 rounded-full animate-pulse" style="animation-delay: 0.5s;"></div>
							<div class="w-4 h-4 bg-green-500 rounded-full animate-pulse" style="animation-delay: 1s;"></div>
							<div class="ml-4 text-gray-400 font-mono text-sm">DefenSys Security Dashboard</div>
						</div>
						
						<!-- Dashboard Grid -->
						<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
							<!-- Scan Status -->
							<div class="lg:col-span-2 bg-gradient-to-br from-blue-900/50 to-indigo-900/50 rounded-2xl p-6 border border-blue-500/30">
								<h3 class="text-xl font-semibold text-white mb-4">Active Scans</h3>
								<div class="space-y-3">
									<div class="flex items-center justify-between">
										<span class="text-gray-300">Network Range: 192.168.1.0/24</span>
										<span class="text-green-400 font-medium">✓ Complete</span>
									</div>
									<div class="flex items-center justify-between">
										<span class="text-gray-300">DMZ Subnet: 10.0.0.0/16</span>
										<span class="text-blue-400 font-medium">⟲ Scanning...</span>
									</div>
									<div class="w-full bg-gray-700 rounded-full h-2">
										<div class="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full w-3/4"></div>
									</div>
								</div>
							</div>
							
							<!-- Stats -->
							<div class="space-y-4">
								<div class="bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-2xl p-6 border border-gray-600/30">
									<div class="text-3xl font-bold text-blue-400">1,247</div>
									<div class="text-sm text-gray-400">Devices Scanned</div>
								</div>
								<div class="bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-2xl p-6 border border-gray-600/30">
									<div class="text-3xl font-bold text-red-400">15</div>
									<div class="text-sm text-gray-400">Critical Issues</div>
								</div>
							</div>
						</div>
						
						<!-- Chart Area -->
						<div class="mt-6 h-40 bg-slate-900/50 rounded-2xl flex items-center justify-center relative overflow-hidden">
							<div class="absolute inset-0">
								<div class="w-full h-full bg-gradient-to-r from-blue-600/20 via-cyan-600/30 to-indigo-600/20 rounded-2xl"></div>
								<div class="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-blue-500/40 to-transparent rounded-b-2xl"></div>
							</div>
							<div class="relative z-10 text-gray-400 font-medium">Real-time Threat Analytics</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Key Benefits Section -->
<div class="bg-slate-900 py-16 sm:py-20 lg:py-24 relative overflow-x-hidden">
	<!-- Background Elements -->
	<div class="absolute inset-0 opacity-5">
		<div class="absolute top-20 left-10 w-64 h-64 sm:w-96 sm:h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl floating"></div>
		<div class="absolute bottom-20 right-10 w-64 h-64 sm:w-96 sm:h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl floating" style="animation-delay: 2s;"></div>
	</div>

	<div class="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
		<div class="text-center mb-12 sm:mb-16 lg:mb-20">
			<div class="inline-block bg-blue-900/30 border border-blue-500/30 rounded-full px-6 py-2 mb-6 glass hover-lift">
				<span class="text-blue-400 font-semibold">Why Choose DefenSys</span>
			</div>
			<h2 class="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6">
				Enterprise-Grade Security
				<span class="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
					Made Simple
				</span>
			</h2>
			<p class="text-base sm:text-lg lg:text-xl text-gray-400 max-w-3xl mx-auto">
				Comprehensive network vulnerability management with real-time insights, automated assessments, and actionable intelligence for modern security teams.
			</p>
		</div>
		
		<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
			<!-- Real-time Monitoring -->
			<div class="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-3xl p-6 lg:p-8 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-500 hover-lift glass">
				<div class="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-4 lg:mb-6 group-hover:scale-110 transition-transform duration-300 hover-glow">
					<svg class="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
						<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
					</svg>
				</div>
				<h3 class="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-3 lg:mb-4">Real-time Monitoring</h3>
				<p class="text-sm sm:text-base text-gray-400 mb-4 lg:mb-6">Continuous network surveillance with instant threat detection and automated response capabilities.</p>
				<div class="text-blue-400 font-semibold group-hover:text-cyan-400 transition-colors text-sm sm:text-base flex items-center space-x-2">
					<span>Learn More</span>
					<svg class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
					</svg>
				</div>
			</div>
			
			<!-- Advanced Analytics -->
			<div class="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-3xl p-6 lg:p-8 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-500 hover-lift glass">
				<div class="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl flex items-center justify-center mb-4 lg:mb-6 group-hover:scale-110 transition-transform duration-300 hover-glow">
					<svg class="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
						<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
					</svg>
				</div>
				<h3 class="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-3 lg:mb-4">Advanced Analytics</h3>
				<p class="text-sm sm:text-base text-gray-400 mb-4 lg:mb-6">Deep insights with AI-powered analysis, risk scoring, and predictive threat intelligence.</p>
				<div class="text-blue-400 font-semibold group-hover:text-cyan-400 transition-colors text-sm sm:text-base flex items-center space-x-2">
					<span>Learn More</span>
					<svg class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
					</svg>
				</div>
			</div>
			
			<!-- Automated Reports -->
			<div class="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-3xl p-6 lg:p-8 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-500 hover-lift glass">
				<div class="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mb-4 lg:mb-6 group-hover:scale-110 transition-transform duration-300 hover-glow">
					<svg class="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
						<path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h8c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
					</svg>
				</div>
				<h3 class="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-3 lg:mb-4">Automated Reports</h3>
				<p class="text-sm sm:text-base text-gray-400 mb-4 lg:mb-6">Comprehensive reporting with compliance mapping, executive summaries, and technical details.</p>
				<div class="text-blue-400 font-semibold group-hover:text-cyan-400 transition-colors text-sm sm:text-base">
					Learn More →
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Performance Metrics Section -->
<div class="bg-gradient-to-r from-slate-800 to-slate-900 py-12 sm:py-16 lg:py-20 relative overflow-hidden">
	<!-- Animated background -->
	<div class="absolute inset-0 opacity-20">
		<div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500 shimmer"></div>
		<div class="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-cyan-500 to-blue-500 shimmer"></div>
	</div>
	
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
		<div class="text-center mb-12 sm:mb-16">
			<h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
				Trusted by Security Leaders Worldwide
			</h2>
			<p class="text-base sm:text-lg lg:text-xl text-gray-400">
				Industry-leading performance metrics that speak for themselves
			</p>
		</div>
		
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
			<div class="text-center group">
				<div class="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 backdrop-blur-sm rounded-2xl p-4 sm:p-6 lg:p-8 border border-blue-500/20 group-hover:border-blue-400/40 transition-all duration-500 hover-lift glass">
					<div class="text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-2">
						50K+
					</div>
					<div class="text-gray-300 font-medium text-sm sm:text-base">Networks Secured</div>
					<div class="text-xs sm:text-sm text-blue-400 mt-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">+25% this month</div>
				</div>
			</div>
			
			<div class="text-center group">
				<div class="bg-gradient-to-br from-indigo-900/40 to-blue-900/40 backdrop-blur-sm rounded-2xl p-4 sm:p-6 lg:p-8 border border-blue-500/20 group-hover:border-blue-400/40 transition-all duration-500 hover-lift glass">
					<div class="text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400 mb-2">
						99.8%
					</div>
					<div class="text-gray-300 font-medium text-sm sm:text-base">Uptime SLA</div>
					<div class="text-xs sm:text-sm text-blue-400 mt-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">24/7 monitoring</div>
				</div>
			</div>
			
			<div class="text-center group">
				<div class="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 backdrop-blur-sm rounded-2xl p-4 sm:p-6 lg:p-8 border border-blue-500/20 group-hover:border-blue-400/40 transition-all duration-500 hover-lift glass">
					<div class="text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-2">
						2.5M
					</div>
					<div class="text-gray-300 font-medium text-sm sm:text-base">Threats Blocked</div>
					<div class="text-xs sm:text-sm text-blue-400 mt-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">Last 30 days</div>
				</div>
			</div>
			
			<div class="text-center group">
				<div class="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 backdrop-blur-sm rounded-2xl p-4 sm:p-6 lg:p-8 border border-blue-500/20 group-hover:border-blue-400/40 transition-all duration-500 hover-lift glass">
					<div class="text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 mb-2">
						&lt;30s
					</div>
					<div class="text-gray-300 font-medium text-sm sm:text-base">Average Response</div>
					<div class="text-xs sm:text-sm text-blue-400 mt-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">Fastest in industry</div>
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
				<span class="text-blue-400 font-semibold">Core Capabilities</span>
			</div>
			<h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
				Complete Security Arsenal
			</h2>
			<p class="text-base sm:text-lg lg:text-xl text-gray-400 max-w-3xl mx-auto">
				Comprehensive vulnerability scanning with cutting-edge detection algorithms and intelligent threat analysis capabilities.
			</p>
		</div>
		
		<div class="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
			<!-- Port Scanning -->
			<div class="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-blue-500/20 hover:border-blue-400/50 transition-all duration-300">
				<div class="flex items-center mb-4 lg:mb-6">
					<div class="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mr-3 lg:mr-4 group-hover:scale-110 transition-transform">
						<svg class="w-6 h-6 lg:w-7 lg:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
							<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
						</svg>
					</div>
					<h3 class="text-lg lg:text-xl font-bold text-white">Advanced Port Scanning</h3>
				</div>
				<p class="text-sm lg:text-base text-gray-400 leading-relaxed">
					Comprehensive port discovery with stealth scanning techniques, service fingerprinting, and version detection across TCP and UDP protocols.
				</p>
			</div>
			
			<!-- Configuration Analysis -->
			<div class="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-blue-500/20 hover:border-blue-400/50 transition-all duration-300">
				<div class="flex items-center mb-4 lg:mb-6">
					<div class="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center mr-3 lg:mr-4 group-hover:scale-110 transition-transform">
						<svg class="w-6 h-6 lg:w-7 lg:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
							<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
						</svg>
					</div>
					<h3 class="text-lg lg:text-xl font-bold text-white">Configuration Auditing</h3>
				</div>
				<p class="text-sm lg:text-base text-gray-400 leading-relaxed">
					Automated detection of security misconfigurations, weak credentials, and compliance violations across network infrastructure and services.
				</p>
			</div>
			
			<!-- Service Discovery -->
			<div class="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-blue-500/20 hover:border-blue-400/50 transition-all duration-300">
				<div class="flex items-center mb-4 lg:mb-6">
					<div class="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mr-3 lg:mr-4 group-hover:scale-110 transition-transform">
						<svg class="w-6 h-6 lg:w-7 lg:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
							<path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-1 16H9V7h9v14z"/>
						</svg>
					</div>
					<h3 class="text-lg lg:text-xl font-bold text-white">Service Intelligence</h3>
				</div>
				<p class="text-sm lg:text-base text-gray-400 leading-relaxed">
					Deep service analysis with banner grabbing, technology stack identification, and exposed service enumeration for comprehensive visibility.
				</p>
			</div>
			
			<!-- Protocol Assessment -->
			<div class="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-blue-500/20 hover:border-blue-400/50 transition-all duration-300">
				<div class="flex items-center mb-4 lg:mb-6">
					<div class="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mr-3 lg:mr-4 group-hover:scale-110 transition-transform">
						<svg class="w-6 h-6 lg:w-7 lg:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
							<path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
						</svg>
					</div>
					<h3 class="text-lg lg:text-xl font-bold text-white">Protocol Security</h3>
				</div>
				<p class="text-sm lg:text-base text-gray-400 leading-relaxed">
					Identification of weak cryptographic protocols, SSL/TLS vulnerabilities, and insecure communication channels with remediation guidance.
				</p>
			</div>
			
			<!-- Vulnerability Assessment -->
			<div class="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-blue-500/20 hover:border-blue-400/50 transition-all duration-300">
				<div class="flex items-center mb-4 lg:mb-6">
					<div class="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-r from-red-500 to-blue-500 rounded-xl flex items-center justify-center mr-3 lg:mr-4 group-hover:scale-110 transition-transform">
						<svg class="w-6 h-6 lg:w-7 lg:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
							<path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
						</svg>
					</div>
					<h3 class="text-lg lg:text-xl font-bold text-white">Risk Assessment</h3>
				</div>
				<p class="text-sm lg:text-base text-gray-400 leading-relaxed">
					AI-powered vulnerability scoring with CVSS integration, exploit availability checks, and prioritized remediation recommendations.
				</p>
			</div>
			
			<!-- Automated Remediation -->
			<div class="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-blue-500/20 hover:border-blue-400/50 transition-all duration-300">
				<div class="flex items-center mb-4 lg:mb-6">
					<div class="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center mr-3 lg:mr-4 group-hover:scale-110 transition-transform">
						<svg class="w-6 h-6 lg:w-7 lg:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
							<path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
						</svg>
					</div>
					<h3 class="text-lg lg:text-xl font-bold text-white">Smart Remediation</h3>
				</div>
				<p class="text-sm lg:text-base text-gray-400 leading-relaxed">
					Intelligent remediation workflows with step-by-step guidance, automated patching suggestions, and compliance mapping for efficient resolution.
				</p>
			</div>
		</div>
	</div>
</div>

<!-- Impact Showcase Section -->
<div class="bg-gradient-to-br from-slate-800 to-slate-900 py-16 sm:py-24 lg:py-32 relative overflow-x-hidden">
	<!-- Background Grid -->
	<div class="absolute inset-0 opacity-5">
		<div class="w-full h-full" style="background-image: radial-gradient(circle, #3b82f6 1px, transparent 1px); background-size: 40px 40px;"></div>
	</div>

	<div class="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
		<div class="grid lg:grid-cols-2 gap-8 lg:gap-20 items-center">
			<!-- Content Side -->
			<div class="space-y-6 lg:space-y-8">
				<div class="inline-block bg-blue-900/30 border border-blue-500/30 rounded-full px-6 py-2">
					<span class="text-blue-400 font-semibold">Industry Impact</span>
				</div>
				
				<h2 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
					Securing Digital
					<span class="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
						Infrastructure
					</span>
					<span class="block text-xl sm:text-2xl md:text-3xl lg:text-4xl mt-4 text-gray-300 font-medium">
						at Enterprise Scale
					</span>
				</h2>
				
				<p class="text-base sm:text-lg lg:text-xl text-gray-400 leading-relaxed">
					DefenSys empowers global organizations to proactively defend against sophisticated cyber threats with intelligent automation and real-time visibility across complex network environments.
				</p>
				
				<!-- Feature List -->
				<div class="space-y-6">
					<div class="flex items-start space-x-4">
						<div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
							<svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
								<path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
							</svg>
						</div>
						<div>
							<h4 class="text-base sm:text-lg font-semibold text-white mb-1">Zero-Day Protection</h4>
							<p class="text-sm sm:text-base text-gray-400">Advanced behavioral analysis and machine learning algorithms detect unknown threats before they impact your infrastructure.</p>
						</div>
					</div>
					
					<div class="flex items-start space-x-4">
						<div class="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
							<svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
								<path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
							</svg>
						</div>
						<div>
							<h4 class="text-base sm:text-lg font-semibold text-white mb-1">Compliance Automation</h4>
							<p class="text-sm sm:text-base text-gray-400">Automated compliance mapping for SOC 2, ISO 27001, PCI DSS, and other industry standards with continuous monitoring.</p>
						</div>
					</div>
					
					<div class="flex items-start space-x-4">
						<div class="w-8 h-8 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
							<svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
								<path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
							</svg>
						</div>
						<div>
							<h4 class="text-base sm:text-lg font-semibold text-white mb-1">Enterprise Integration</h4>
							<p class="text-sm sm:text-base text-gray-400">Seamless integration with existing SIEM, SOAR, and security orchestration platforms for unified threat management.</p>
						</div>
					</div>
				</div>
			</div>
			
			<!-- Stats Side -->
			<div class="space-y-8 lg:space-y-12">
				<!-- Main Stats -->
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
					<div class="text-center bg-gradient-to-br from-blue-900/40 to-cyan-900/40 backdrop-blur-sm rounded-3xl p-6 lg:p-8 border border-blue-500/20">
						<div class="text-4xl sm:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-3">
							98.7%
						</div>
						<div class="text-gray-300 font-semibold text-base lg:text-lg">Threat Detection Rate</div>
						<div class="text-xs sm:text-sm text-blue-400 mt-2">Industry Leading</div>
					</div>
					
					<div class="text-center bg-gradient-to-br from-indigo-900/40 to-blue-900/40 backdrop-blur-sm rounded-3xl p-6 lg:p-8 border border-blue-500/20">
						<div class="text-4xl sm:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400 mb-3">
							45%
						</div>
						<div class="text-gray-300 font-semibold text-base lg:text-lg">Faster Response Time</div>
						<div class="text-xs sm:text-sm text-blue-400 mt-2">vs Industry Average</div>
					</div>
				</div>
				
				<!-- Additional Stats -->
				<div class="space-y-6">
					<div class="bg-gradient-to-r from-slate-700/50 to-slate-800/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-blue-500/20">
						<div class="flex items-center justify-between mb-3">
							<span class="text-gray-300 font-medium text-sm sm:text-base">Global Networks Protected</span>
							<span class="text-2xl sm:text-3xl font-bold text-blue-400">250K+</span>
						</div>
						<div class="w-full bg-gray-700 rounded-full h-2">
							<div class="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full w-5/6"></div>
						</div>
						<div class="text-xs text-blue-400 mt-2">Growing 35% YoY</div>
					</div>
					
					<div class="bg-gradient-to-r from-slate-700/50 to-slate-800/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-blue-500/20">
						<div class="flex items-center justify-between mb-3">
							<span class="text-gray-300 font-medium text-sm sm:text-base">Vulnerabilities Patched</span>
							<span class="text-2xl sm:text-3xl font-bold text-cyan-400">15M+</span>
						</div>
						<div class="w-full bg-gray-700 rounded-full h-2">
							<div class="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full w-full"></div>
						</div>
						<div class="text-xs text-cyan-400 mt-2">This Quarter</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Why DefenSys was Built Section -->
<div class="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 py-16 sm:py-20 lg:py-24 relative overflow-x-hidden">
	<!-- Background Effects -->
	<div class="absolute inset-0 opacity-20">
		<div class="absolute top-10 left-10 w-32 h-32 sm:w-48 sm:h-48 lg:w-72 lg:h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl floating"></div>
		<div class="absolute bottom-10 right-10 w-32 h-32 sm:w-48 sm:h-48 lg:w-72 lg:h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl floating" style="animation-delay: 3s;"></div>
	</div>

	<div class="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-12">
		<div class="text-center mb-12 sm:mb-16">
			<div class="inline-block bg-blue-800/30 border border-blue-400/30 rounded-full px-4 sm:px-6 py-2 mb-4 sm:mb-6 glass">
				<span class="text-blue-300 font-semibold text-sm sm:text-base">Why DefenSys was Built</span>
			</div>
			<h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
				Why Did I Build DefenSys?
			</h2>
			<p class="text-base sm:text-lg lg:text-xl text-blue-200 max-w-3xl mx-auto">
				I built DefenSys to make it easy for anyone (techie or not), to scan their web apps or network and actually understand where the real security problems are.
			</p>
		</div>

		<!-- Why I Built DefenSys -->
		<div class="bg-slate-800/30 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-12 border border-blue-400/20 mb-12 sm:mb-16 glass hover-lift group">
			<div class="grid lg:grid-cols-5 gap-6 lg:gap-8 items-center">
				<div class="lg:col-span-1 text-center lg:text-left">
					<img src={mrWilson} 
						 alt="Security Professional" 
						 class="w-20 h-20 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl object-cover mx-auto lg:mx-0 mb-3 sm:mb-4 transition-transform duration-300 group-hover:scale-110">
					<div class="text-white font-semibold text-sm sm:text-base">Giddel Wilson</div>
					<div class="text-blue-300 text-xs sm:text-sm">Founder, CEO</div>
					<div class="flex justify-center lg:justify-start mt-2">
						<div class="flex text-yellow-400 text-sm">
							★★★★★
						</div>
					</div>
				</div>
				
				<div class="lg:col-span-4">
					<blockquote class="text-lg sm:text-xl lg:text-2xl xl:text-3xl text-white font-medium leading-relaxed mb-4 sm:mb-6">
						"Most people don’t secure their sites because the tools out there either confuse them or don’t actually work. So I built DefenSys to try to tackle that.
						It was designed to be an aid that tells you exactly what’s wrong, as simply as possible whether you’re a developer, a student, or just someone trying to protect what you’ve built"
					</blockquote>
					<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center">
						<div class="group-hover:scale-105 transition-transform duration-300">
							<div class="text-xl sm:text-2xl font-bold text-blue-400">40%</div>
							<div class="text-xs sm:text-sm text-blue-200">More Threats Detected</div>
						</div>
						<div class="group-hover:scale-105 transition-transform duration-300" style="transition-delay: 0.1s;">
							<div class="text-xl sm:text-2xl font-bold text-cyan-400">75%</div>
							<div class="text-xs sm:text-sm text-blue-200">Faster Response</div>
						</div>
						<div class="group-hover:scale-105 transition-transform duration-300" style="transition-delay: 0.2s;">
							<div class="text-xl sm:text-2xl font-bold text-indigo-400">$2.3M</div>
							<div class="text-xs sm:text-sm text-blue-200">Security Cost Savings</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Company Logos -->
		<div class="text-center">
			<p class="text-blue-200 font-medium mb-6 sm:mb-8 text-sm sm:text-base">
				Protecting infrastructure for industry leaders worldwide
			</p>
			<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 lg:gap-8 items-center opacity-60">
				<div class="h-10 sm:h-12 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-lg flex items-center justify-center hover-lift">
					<span class="text-white font-semibold text-xs sm:text-sm">TechCorp</span>
				</div>
				<div class="h-10 sm:h-12 bg-gradient-to-r from-indigo-400/20 to-blue-400/20 rounded-lg flex items-center justify-center hover-lift">
					<span class="text-white font-semibold text-xs sm:text-sm">FinTech</span>
				</div>
				<div class="h-10 sm:h-12 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-lg flex items-center justify-center hover-lift">
					<span class="text-white font-semibold text-xs sm:text-sm">HealthTech</span>
				</div>
				<div class="h-10 sm:h-12 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-lg flex items-center justify-center hover-lift">
					<span class="text-white font-semibold text-xs sm:text-sm">EduTech</span>
				</div>
				<div class="h-10 sm:h-12 bg-gradient-to-r from-slate-400/20 to-blue-400/20 rounded-lg flex items-center justify-center hover-lift">
					<span class="text-white font-semibold text-xs sm:text-sm">RetailGiant</span>
				</div>
				<div class="h-10 sm:h-12 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-lg flex items-center justify-center hover-lift">
					<span class="text-white font-semibold text-xs sm:text-sm">CloudFirst</span>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Final CTA Section -->
<div class="bg-slate-900 py-20 sm:py-24 lg:py-32 relative overflow-x-hidden">
	<!-- Background Pattern -->
	<div class="absolute inset-0 opacity-10">
		<div class="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/20 via-transparent to-cyan-600/20"></div>
		<div class="absolute top-1/4 left-1/4 w-48 h-48 sm:w-64 sm:h-64 lg:w-96 lg:h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl floating"></div>
		<div class="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-64 sm:h-64 lg:w-96 lg:h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl floating" style="animation-delay: 2s;"></div>
	</div>

	<div class="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 text-center">
		<div class="space-y-8 sm:space-y-12">
			<!-- Badge -->
			<div class="inline-block bg-blue-900/30 border border-blue-500/30 rounded-full px-6 sm:px-8 py-2 sm:py-3 glass">
				<span class="text-blue-400 font-semibold text-base sm:text-lg">Ready to Get Started?</span>
			</div>
			
			<!-- Main Headline -->
			<div class="space-y-4 sm:space-y-6">
				<h2 class="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-tight">
					<span class="block">Secure Your Network</span>
					<span class="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
						in Minutes
					</span>
				</h2>
				
				<p class="text-base sm:text-lg lg:text-xl xl:text-2xl text-gray-300 leading-relaxed max-w-4xl mx-auto">
					Join thousands of security professionals who trust DefenSys to protect their critical infrastructure. Start your comprehensive security assessment today.
				</p>
			</div>
			
			<!-- CTA Buttons -->
			<div class="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 lg:space-x-8">
				<button class="group bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 px-6 sm:px-8 lg:px-12 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg lg:text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-blue-500/25 hover-glow">
					<span class="flex items-center justify-center space-x-2 sm:space-x-3">
						<span>Start Free Security Scan</span>
						<svg class="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
							<path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
						</svg>
					</span>
				</button>
				
				<button class="border-2 border-blue-400 hover:bg-blue-400/10 px-6 sm:px-8 lg:px-12 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg lg:text-xl text-blue-400 hover:text-blue-300 transition-all duration-300 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-400/25">
					Schedule Demo
				</button>
			</div>
			
			<!-- Features List -->
			<div class="grid sm:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-16">
				<div class="flex items-center justify-center space-x-2 sm:space-x-3 text-gray-300 hover:text-white transition-colors duration-300 group">
					<svg class="w-5 h-5 sm:w-6 sm:h-6 text-green-400 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
						<path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
					</svg>
					<span class="font-medium text-sm sm:text-base">No Credit Card Required</span>
				</div>
				<div class="flex items-center justify-center space-x-2 sm:space-x-3 text-gray-300">
					<svg class="w-5 h-5 sm:w-6 sm:h-6 text-green-400" fill="currentColor" viewBox="0 0 24 24">
						<path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
					</svg>
					<span class="font-medium text-sm sm:text-base">5-Minute Setup</span>
				</div>
				<div class="flex items-center justify-center space-x-2 sm:space-x-3 text-gray-300">
					<svg class="w-5 h-5 sm:w-6 sm:h-6 text-green-400" fill="currentColor" viewBox="0 0 24 24">
						<path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
					</svg>
					<span class="font-medium text-sm sm:text-base">Enterprise Support</span>
				</div>
			</div>
		</div>
		
		<!-- Download Options -->
		<div class="mt-16 sm:mt-20 pt-8 sm:pt-12 border-t border-gray-700">
			<p class="text-gray-400 font-medium mb-6 sm:mb-8 text-sm sm:text-base">
				Available on all platforms
			</p>
			<div class="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
				<button class="bg-white text-slate-900 hover:bg-gray-100 px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-base lg:text-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-2 sm:space-x-3 shadow-lg">
					<svg class="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
						<path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
					</svg>
					<span>Download for macOS</span>
				</button>
				
				<button class="bg-gray-800 hover:bg-gray-700 text-white px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-base lg:text-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-2 sm:space-x-3 shadow-lg">
					<svg class="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
						<path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993.0001.5511-.4482.9997-.9993.9997m-5.0449-1.0485c-.28.28-.42.43-.35.68-.07.08-.16.14-.27.14-.18 0-.33-.15-.33-.33 0-.08.03-.15.08-.21.22-.22.47-.22.69 0 .08.08.12.19.08.28-.05.18-.24.31-.43.31-.12 0-.23-.05-.31-.13-.08-.08-.13-.19-.13-.31 0-.24.19-.43.43-.43.11 0 .21.04.29.12.17.17.17.44 0 .61-.04.04-.09.06-.14.06s-.1-.02-.14-.06c-.17-.17-.17-.44 0-.61.04-.04.09-.06.14-.06s.1.02.14.06c.08.08.08.21 0 .29-.02.02-.04.03-.07.03s-.05-.01-.07-.03c-.04-.04-.04-.1 0-.14.01-.01.02-.01.03-.01s.02 0 .03.01c.02.02.02.05 0 .07 0 .01-.01.01-.01.01s-.01 0-.01-.01c-.01-.01-.01-.02 0-.03.003-.003.007-.003.01 0 .003.003.003.007 0 .01-.003.003-.007.003-.01 0-.003-.003-.003-.007 0-.01.003-.003.007-.003.01 0 .003.003.003.007 0 .01-.003.003-.007.003-.01 0-.003-.003-.003-.007 0-.01.003-.003.007-.003.01 0 .003.003.003.007 0 .01-.003.003-.007.003-.01 0-.003-.003-.003-.007 0-.01.003-.003.007-.003.01 0 .003.003.003.007 0 .01-.003.003-.007.003-.01 0-.003-.003-.003-.007 0-.01.007-.007.014-.007.007 0 .014.007.014.014 0 .007-.007.014-.014.014-.007 0-.014-.007-.014-.014 0-.007.007-.014.014-.014.007 0 .014.007.014.014 0 .007-.007.014-.014.014-.007 0-.014-.007-.014-.014 0-.007.007-.014.014-.014.007 0 .014.007.014.014 0 .007-.007.014-.014.014-.007 0-.014-.007-.014-.014 0-.007.007-.014.014-.014z"/>
					</svg>
					<span>Download for Windows</span>
				</button>
			</div>
		</div>
	</div>
</div>

<!-- Footer -->
<footer class="bg-slate-800 border-t border-gray-700/50 py-12 sm:py-16">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-12">
			<!-- Brand Section -->
			<div class="sm:col-span-2 lg:col-span-2">
				<div class="flex items-center space-x-3 mb-4 sm:mb-6">
					<div class="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
						<svg class="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
							<path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
						</svg>
					</div>
					<span class="text-xl sm:text-2xl font-bold text-white">DefenSys</span>
				</div>
				<p class="text-gray-400 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
					Advanced network vulnerability scanning and security intelligence platform trusted by enterprise security teams worldwide. Protect your infrastructure with cutting-edge threat detection.
				</p>
				<div class="flex space-x-3 sm:space-x-4">
					<a href="https://twitter.com/defensys" aria-label="Follow DefenSys on Twitter" class="text-gray-400 hover:text-blue-400 transition-colors">
						<svg class="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
							<path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
						</svg>
					</a>
					<a href="https://linkedin.com/company/defensys" aria-label="Connect with DefenSys on LinkedIn" class="text-gray-400 hover:text-blue-400 transition-colors">
						<svg class="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
							<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
						</svg>
					</a>
					<a href="https://github.com/defensys" aria-label="View DefenSys on GitHub" class="text-gray-400 hover:text-blue-400 transition-colors">
						<svg class="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
							<path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.1.12.112.225.085.347-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
						</svg>
					</a>
					<a href="https://instagram.com/defensys" aria-label="Follow DefenSys on Instagram" class="text-gray-400 hover:text-blue-400 transition-colors">
						<svg class="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
							<path d="M12.5 3C10.07 3 8.11 4.96 8.11 7.39s1.96 4.39 4.39 4.39 4.39-1.96 4.39-4.39S14.93 3 12.5 3zm0 6.28c-1.04 0-1.89-.85-1.89-1.89S11.46 5.5 12.5 5.5s1.89.85 1.89 1.89-.85 1.89-1.89 1.89zM19 3h-6c-1.66 0-3 1.34-3 3v12c0 1.66 1.34 3 3 3h6c1.66 0 3-1.34 3-3V6c0-1.66-1.34-3-3-3zm1 15c0 .55-.45 1-1 1h-6c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1h6c.55 0 1 .45 1 1v12z"/>
						</svg>
					</a>
				</div>
			</div>
			
			<!-- Platform -->
			<div>
				<h3 class="text-white font-bold text-base sm:text-lg mb-4 sm:mb-6">Platform</h3>
				<ul class="space-y-3 sm:space-y-4 text-gray-400 text-sm sm:text-base">
					<li><a href="/platform/network-scanner" class="hover:text-blue-400 transition-colors">Network Scanner</a></li>
					<li><a href="/platform/vulnerability-assessment" class="hover:text-blue-400 transition-colors">Vulnerability Assessment</a></li>
					<li><a href="/platform/threat-intelligence" class="hover:text-blue-400 transition-colors">Threat Intelligence</a></li>
					<li><a href="/platform/security-dashboard" class="hover:text-blue-400 transition-colors">Security Dashboard</a></li>
					<li><a href="/platform/compliance-center" class="hover:text-blue-400 transition-colors">Compliance Center</a></li>
					<li><a href="/platform/api-access" class="hover:text-blue-400 transition-colors">API Access</a></li>
				</ul>
			</div>
			
			<!-- Resources -->
			<div>
				<h3 class="text-white font-bold text-base sm:text-lg mb-4 sm:mb-6">Resources</h3>
				<ul class="space-y-3 sm:space-y-4 text-gray-400 text-sm sm:text-base">
					<li><a href="/docs" class="hover:text-blue-400 transition-colors">Documentation</a></li>
					<li><a href="/blog" class="hover:text-blue-400 transition-colors">Security Blog</a></li>
					<li><a href="/case-studies" class="hover:text-blue-400 transition-colors">Case Studies</a></li>
					<li><a href="/webinars" class="hover:text-blue-400 transition-colors">Webinars</a></li>
					<li><a href="/white-papers" class="hover:text-blue-400 transition-colors">White Papers</a></li>
					<li><a href="/community" class="hover:text-blue-400 transition-colors">Community</a></li>
				</ul>
			</div>
			
			<!-- Company -->
			<div>
				<h3 class="text-white font-bold text-base sm:text-lg mb-4 sm:mb-6">Company</h3>
				<ul class="space-y-3 sm:space-y-4 text-gray-400 text-sm sm:text-base">
					<li><a href="/about" class="hover:text-blue-400 transition-colors">About DefenSys</a></li>
					<li><a href="/careers" class="hover:text-blue-400 transition-colors">Careers</a></li>
					<li><a href="/press" class="hover:text-blue-400 transition-colors">Press Kit</a></li>
					<li><a href="/contact" class="hover:text-blue-400 transition-colors">Contact Sales</a></li>
					<li><a href="/support" class="hover:text-blue-400 transition-colors">Support Center</a></li>
					<li><a href="/partners" class="hover:text-blue-400 transition-colors">Partner Program</a></li>
				</ul>
			</div>
		</div>
		
		<!-- Bottom Section -->
		<div class="border-t border-gray-700 mt-12 sm:mt-16 pt-6 sm:pt-8">
			<div class="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
				<div class="text-gray-400 text-center lg:text-left text-sm sm:text-base">
					<p>&copy; 2025 DefenSys Inc. All rights reserved.</p>
				</div>
				<div class="flex flex-wrap justify-center lg:justify-end space-x-4 sm:space-x-6 text-gray-400 text-xs sm:text-sm">
					<a href="/privacy" class="hover:text-blue-400 transition-colors">Privacy Policy</a>
					<a href="/terms" class="hover:text-blue-400 transition-colors">Terms of Service</a>
					<a href="/cookies" class="hover:text-blue-400 transition-colors">Cookie Policy</a>
					<a href="/security" class="hover:text-blue-400 transition-colors">Security</a>
					<a href="/status" class="hover:text-blue-400 transition-colors">Status</a>
				</div>
			</div>
		</div>
	</div>
</footer>
</div>
