<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let email = '';
	let password = '';
	let loading = false;
	let error = '';
	let showPassword = false;
	let isLoaded = false;
	let rememberMe = false;

	onMount(() => {
		isLoaded = true;
		// Check if user is already logged in
		const token = localStorage.getItem('token');
		if (token) {
			goto('/dashboard');
		}
	});

	async function handleLogin() {
		error = '';
		
		// Client-side validation
		if (!email || !password) {
			error = 'Email and password are required';
			return;
		}

		loading = true;

		try {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email, password })
			});

			const data = await response.json();

			if (response.ok) {
				// Store user data
				localStorage.setItem('user', JSON.stringify(data.user));
				localStorage.setItem('token', data.token);
				
				// Redirect based on role
				if (data.user.role === 'admin') {
					goto('/admin');
				} else {
					goto('/dashboard');
				}
			} else {
				error = data.error || 'Failed to login';
			}
		} catch (err) {
			console.error('Login error:', err);
			error = 'An unexpected error occurred. Please try again.';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Sign In - DefenSys</title>
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
		
		<a href="/signup" class="text-sm w-32 md:w-auto hover:text-blue-400 transition-all duration-300 font-medium relative group {isLoaded ? 'animate-[fadeInRight_1s_ease-out]' : 'opacity-0'}">
			Don't have an account? <span class="text-blue-400 font-semibold">Sign Up</span>
		</a>
	</nav>

	<!-- Login Form -->
	<div class="relative z-10 w-full max-w-md px-6 {isLoaded ? 'animate-[fadeInUp_1s_ease-out_0.3s]' : 'opacity-0'} [animation-fill-mode:both]">
		<div class="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-slate-700/50">
			<!-- Header -->
			<div class="text-center mb-8">
				<h1 class="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
					Welcome Back
				</h1>
				<p class="text-slate-400">Sign in to access your dashboard</p>
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
			<form on:submit|preventDefault={handleLogin} class="space-y-6">
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
					<div class="flex items-center justify-between mb-2">
						<label for="password" class="block text-sm font-medium text-slate-300">
							Password
						</label>
						<a href="/forgot-password" class="text-xs text-blue-400 hover:text-blue-300 transition-colors">
							Forgot password?
						</a>
					</div>
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
				</div>

				<!-- Remember Me -->
				<div class="flex items-center">
					<input
						type="checkbox"
						id="rememberMe"
						bind:checked={rememberMe}
						class="w-4 h-4 text-blue-500 bg-slate-700 border-slate-600 rounded focus:ring-blue-500 focus:ring-2"
					/>
					<label for="rememberMe" class="ml-2 text-sm text-slate-300">
						Remember me for 7 days
					</label>
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
						<span>Signing In...</span>
					{:else}
						<span>Sign In</span>
					{/if}
				</button>
			</form>

			<!-- Divider -->
			<div class="relative my-6">
				<div class="absolute inset-0 flex items-center">
					<div class="w-full border-t border-slate-600"></div>
				</div>
				<div class="relative flex justify-center text-sm">
					<span class="px-4 bg-slate-800/50 text-slate-400">Or continue with</span>
				</div>
			</div>

			<!-- Social Login -->
			<div class="grid grid-cols-2 gap-4">
				<button class="flex items-center justify-center px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg hover:bg-slate-700 transition-all duration-300 space-x-2">
					<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
						<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
						<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
						<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
						<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
					</svg>
					<span class="text-sm font-medium">Google</span>
				</button>
				
				<button class="flex items-center justify-center px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg hover:bg-slate-700 transition-all duration-300 space-x-2">
					<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
						<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
					</svg>
					<span class="text-sm font-medium">GitHub</span>
				</button>
			</div>
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
