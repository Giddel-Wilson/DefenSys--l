<script>
	import { onDestroy, onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	
	let mobileMenuOpen = false;
	
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

	// Navigation items
	const navItems = [
		{ href: '/features', label: 'Features' },
		{ href: '/security', label: 'Security' },
		{ href: '/enterprise', label: 'Enterprise' },
		{ href: '/docs', label: 'Docs' },
		{ href: '/support', label: 'Support' }
	];
</script>

<!-- Navigation -->
<nav class="z-50 flex items-center justify-between px-4 sm:px-6 py-4 sm:py-6 lg:px-12 {mobileMenuOpen ? 'fixed top-0 left-0 right-0 bg-slate-900/95 backdrop-blur-sm' : 'relative'} transition-all duration-500">
	<div class="flex items-center space-x-3">
		<a href="/" class="flex items-center space-x-3">
			<div class="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl hover-glow">
				<svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
					<path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
				</svg>
			</div>
			<span class="text-xl sm:text-2xl font-bold text-white">DefenSys</span>
		</a>
	</div>
	
	<!-- Desktop Navigation -->
	<div class="hidden lg:flex items-center space-x-8">
		{#each navItems as item}
			<a href={item.href} class="hover:text-blue-400 transition-all duration-300 font-medium relative group {$page.url.pathname === item.href ? 'text-blue-400' : 'text-white'}">
				{item.label}
				<span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full {$page.url.pathname === item.href ? 'w-full' : ''}"></span>
			</a>
		{/each}
	</div>
	
	<!-- Desktop CTA Buttons -->
	<div class="hidden sm:flex items-center space-x-3 lg:space-x-4">
		<a href="/login" class="text-sm hover:text-blue-400 transition-all duration-300 font-medium relative group text-white">
			Sign In
			<span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
		</a>
		<a href="/signup" class="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 px-4 lg:px-6 py-2 lg:py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25 text-white">
			Get Started
		</a>
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
					{#each navItems as item}
						<a href={item.href} class="block text-2xl font-medium text-white hover:text-blue-400 transition-colors {$page.url.pathname === item.href ? 'text-blue-400' : ''}" on:click={toggleMobileMenu}>{item.label}</a>
					{/each}
				</div>
				
				<div class="pt-8 space-y-4 flex flex-col">
					<a href="/login" class="text-xl font-medium text-white textcenter hover:text-blue-400 transition-colors" on:click={toggleMobileMenu}>
						Sign In
					</a>
					<a href="/signup" class="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-300 text-white" on:click={toggleMobileMenu}>
						Get Started
					</a>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.hover-glow:hover {
		box-shadow: 0 0 20px rgba(59, 130, 246, 0.6);
	}
	
	.floating {
		animation: float 6s ease-in-out infinite;
	}
	
	@keyframes float {
		0%, 100% {
			transform: translateY(0px);
		}
		50% {
			transform: translateY(-10px);
		}
	}
</style>
