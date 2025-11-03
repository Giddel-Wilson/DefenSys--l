<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let name = '';
	let email = '';
	let password = '';
	let confirmPassword = '';
	let loading = false;
	let error = '';
	let showPassword = false;
	let showConfirmPassword = false;
	let isLoaded = false;

	onMount(() => {
		isLoaded = true;
	});

	async function handleSignup() {
		error = '';
		
		// Client-side validation
		if (!name || !email || !password || !confirmPassword) {
			error = 'All fields are required';
			return;
		}

		if (password !== confirmPassword) {
			error = 'Passwords do not match';
			return;
		}

		if (password.length < 8) {
			error = 'Password must be at least 8 characters long';
			return;
		}

		loading = true;

		try {
			const response = await fetch('/api/auth/signup', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ name, email, password })
			});

			const data = await response.json();

			if (response.ok) {
				// Store user data
				localStorage.setItem('user', JSON.stringify(data.user));
				localStorage.setItem('token', data.token);
				
				// Redirect to dashboard
				goto('/dashboard');
			} else {
				error = data.error || 'Failed to create account';
			}
		} catch (err) {
			console.error('Signup error:', err);
			error = 'An unexpected error occurred. Please try again.';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Sign Up - DefenSys</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden relative flex items-center justify-center">
	<!-- Background Pattern -->
	<div class="absolute inset-0 opacity-10">
		<div class="absolute top-0 left-0 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
		<div class="absolute top-0 right-0 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
		<div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-500"></div>
	</div>

	<!-- Navigation Bar -->
	<nav class="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 lg:px-12">
		<a href="/" class="flex items-center space-x-3 {isLoaded ? 'animate-[fadeInLeft_1s_ease-out]' : 'opacity-0'}">
			<div class="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl hover:scale-110 transition-transform duration-300">
				<svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
					<path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
				</svg>
			</div>
			<span class="text-2xl font-bold">DefenSys</span>
		</a>
		
		<a href="/login" class="text-sm w-32 md:w-auto hover:text-blue-400 transition-all duration-300 font-medium relative group {isLoaded ? 'animate-[fadeInRight_1s_ease-out]' : 'opacity-0'}">
			Already have an account? <span class="text-blue-400 font-semibold">Sign In</span>
		</a>
	</nav>

	<!-- Signup Form -->
	<div class="relative mt-28 mb-18 md:mt-auto md:mb-auto z-10 w-full max-w-md px-6 {isLoaded ? 'animate-[fadeInUp_1s_ease-out_0.3s]' : 'opacity-0'} [animation-fill-mode:both]">
		<div class="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-slate-700/50">
			<!-- Header -->
			<div class="text-center mb-8">
				<h1 class="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
					Create Account
				</h1>
				<p class="text-slate-400">Join DefenSys and secure your applications</p>
			</div>

			<!-- Error Message -->
			{#if error}
				<div class="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
					<div class="flex items-center space-x-2">
						<svg class="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
						</svg>
						<p class="text-red-400 text-sm">{error}</p>
					</div>
				</div>
			{/if}

			<!-- Form -->
			<form on:submit|preventDefault={handleSignup} class="space-y-6">
				<!-- Name Field -->
				<div>
					<label for="name" class="block text-sm font-medium text-slate-300 mb-2">
						Full Name
					</label>
					<input
						type="text"
						id="name"
						bind:value={name}
						required
						placeholder="John Doe"
						class="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-white placeholder-slate-400"
					/>
				</div>

				<!-- Email Field -->
				<div>
					<label for="email" class="block text-sm font-medium text-slate-300 mb-2">
						Email Address
					</label>
					<input
						type="email"
						id="email"
						bind:value={email}
						required
						placeholder="you@example.com"
						class="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-white placeholder-slate-400"
					/>
				</div>

				<!-- Password Field -->
				<div>
					<label for="password" class="block text-sm font-medium text-slate-300 mb-2">
						Password
					</label>
					<div class="relative">
						<input
							type={showPassword ? 'text' : 'password'}
							id="password"
							bind:value={password}
							required
							placeholder="••••••••"
							class="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-white placeholder-slate-400 pr-12"
						/>
						<button
							type="button"
							on:click={() => showPassword = !showPassword}
							class="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
						>
							{#if showPassword}
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
								</svg>
							{:else}
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
								</svg>
							{/if}
						</button>
					</div>
					<p class="mt-1 text-xs text-slate-400">Must be at least 8 characters with uppercase, lowercase, and number</p>
				</div>

				<!-- Confirm Password Field -->
				<div>
					<label for="confirmPassword" class="block text-sm font-medium text-slate-300 mb-2">
						Confirm Password
					</label>
					<div class="relative">
						<input
							type={showConfirmPassword ? 'text' : 'password'}
							id="confirmPassword"
							bind:value={confirmPassword}
							required
							placeholder="••••••••"
							class="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-white placeholder-slate-400 pr-12"
						/>
						<button
							type="button"
							on:click={() => showConfirmPassword = !showConfirmPassword}
							class="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
						>
							{#if showConfirmPassword}
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
								</svg>
							{:else}
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
								</svg>
							{/if}
						</button>
					</div>
				</div>

				<!-- Submit Button -->
				<button
					type="submit"
					disabled={loading}
					class="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2"
				>
					{#if loading}
						<svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						<span>Creating Account...</span>
					{:else}
						<span>Create Account</span>
					{/if}
				</button>
			</form>

			<!-- Terms -->
			<p class="mt-6 text-center text-xs text-slate-400">
				By creating an account, you agree to our
				<a href="/terms" class="text-blue-400 hover:text-blue-300 transition-colors">Terms of Service</a>
				and
				<a href="/privacy" class="text-blue-400 hover:text-blue-300 transition-colors">Privacy Policy</a>
			</p>
		</div>
	</div>
</div>

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

	@keyframes fadeInLeft {
		from {
			opacity: 0;
			transform: translateX(-30px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	@keyframes fadeInRight {
		from {
			opacity: 0;
			transform: translateX(30px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}
</style>
