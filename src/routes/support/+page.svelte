<script lang="ts">
	import Navigation from '$lib/components/Navigation.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	
	let isLoaded = false;
	let selectedCategory = 'technical';
	
	// Form state
	let name = '';
	let email = '';
	let subject = '';
	let priority = 'medium';
	let message = '';
	let isSubmitting = false;
	let submitMessage = '';
	let submitMessageType = ''; // 'success' or 'error'
	
	onMount(() => {
		isLoaded = true;
	});

	async function handleSubmit(event: Event) {
		event.preventDefault();

		// Validation
		if (!name || !email || !subject || !message) {
			submitMessage = 'Please fill in all required fields';
			submitMessageType = 'error';
			setTimeout(() => { submitMessage = ''; }, 3000);
			return;
		}

		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			submitMessage = 'Please enter a valid email address';
			submitMessageType = 'error';
			setTimeout(() => { submitMessage = ''; }, 3000);
			return;
		}

		isSubmitting = true;
		submitMessage = '';

		try {
			const response = await fetch('/api/support/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, email, subject, priority, message })
			});

			const data = await response.json();

			if (response.ok) {
				submitMessage = data.message || 'Message sent successfully! We\'ll get back to you soon.';
				submitMessageType = 'success';
				// Reset form
				name = '';
				email = '';
				subject = '';
				priority = 'medium';
				message = '';
			} else {
				submitMessage = data.error || 'Failed to send message. Please try again.';
				submitMessageType = 'error';
			}
		} catch (error) {
			submitMessage = 'Network error. Please try again or email us directly.';
			submitMessageType = 'error';
		} finally {
			isSubmitting = false;
			setTimeout(() => { submitMessage = ''; }, 7000);
		}
	}

	const supportOptions = [
		{
			id: 'technical',
			title: 'Technical Support',
			icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
			description: 'Get help with technical issues, bugs, or platform problems'
		},
		{
			id: 'billing',
			title: 'Billing & Accounts',
			icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z',
			description: 'Questions about your subscription, billing, or account management'
		},
		{
			id: 'security',
			title: 'Security Concerns',
			icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
			description: 'Report security vulnerabilities or discuss security practices'
		},
		{
			id: 'general',
			title: 'General Inquiries',
			icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
			description: 'General questions about DefenSys or partnership opportunities'
		}
	];

	const faqItems = [
		{
			question: 'How quickly can I get started with DefenSys?',
			answer: 'You can start scanning within 5 minutes of signing up. Our quick start guide will walk you through the setup process, and you can run your first vulnerability scan immediately.'
		},
		{
			question: 'What types of scans does DefenSys support?',
			answer: 'DefenSys supports comprehensive network scans, port scans, vulnerability assessments, configuration audits, and compliance checks. We support both internal and external scanning.'
		},
		{
			question: 'Is my data secure with DefenSys?',
			answer: 'Yes, we use enterprise-grade security including AES-256 encryption, zero-trust architecture, and SOC 2 Type II compliance. Your scan data is never stored longer than necessary and is encrypted at rest and in transit.'
		},
		{
			question: 'Can I integrate DefenSys with my existing tools?',
			answer: 'Absolutely! DefenSys offers comprehensive API access, webhooks, and pre-built integrations with popular security tools, SIEM platforms, and CI/CD pipelines.'
		},
		{
			question: 'What support is included with my subscription?',
			answer: 'All plans include email support, documentation access, and community forums. Professional and Enterprise plans include priority support, phone support, and dedicated account management.'
		},
		{
			question: 'Do you offer custom scanning policies?',
			answer: 'Yes, you can create custom scanning policies tailored to your specific compliance requirements, industry standards, or organizational security policies.'
		}
	];
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
			<div class="max-w-7xl mx-auto">
				<div class="text-center space-y-8 lg:space-y-12">
					<!-- Badge -->
					<div class="inline-flex items-center justify-center gap-3 bg-blue-900/60 backdrop-blur-sm border border-blue-400/50 rounded-full px-6 py-3 glass {isLoaded ? 'animate-[fadeInUp_0.8s_ease-out_0.1s]' : 'opacity-0'} [animation-fill-mode:both]">
						<div class="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
						<span class="text-white font-bold text-sm md:text-base">24/7 Support Available</span>
					</div>
					
					<!-- Main Headline -->
					<div class="space-y-6">
						<h1 class="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight {isLoaded ? 'animate-[fadeInUp_1s_ease-out_0.3s]' : 'opacity-0'} [animation-fill-mode:both]">
							<span class="text-white">Support &</span>
							<span class="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400">
								Help Center
							</span>
						</h1>
						
						<p class="text-lg sm:text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-4xl mx-auto {isLoaded ? 'animate-[fadeInUp_1s_ease-out_0.5s]' : 'opacity-0'} [animation-fill-mode:both]">
							Get the help you need, when you need it. Our expert support team and comprehensive resources are here to ensure your success.
						</p>
					</div>
					
					<!-- Support Stats -->
					<div class="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto {isLoaded ? 'animate-[fadeInUp_1s_ease-out_0.7s]' : 'opacity-0'} [animation-fill-mode:both]">
						<div class="text-center">
							<div class="text-2xl sm:text-3xl font-bold text-blue-400 mb-1">&lt;2min</div>
							<div class="text-sm text-gray-400">Average Response</div>
						</div>
						<div class="text-center">
							<div class="text-2xl sm:text-3xl font-bold text-cyan-400 mb-1">99.9%</div>
							<div class="text-sm text-gray-400">Customer Satisfaction</div>
						</div>
						<div class="text-center">
							<div class="text-2xl sm:text-3xl font-bold text-indigo-400 mb-1">24/7</div>
							<div class="text-sm text-gray-400">Support Coverage</div>
						</div>
						<div class="text-center">
							<div class="text-2xl sm:text-3xl font-bold text-purple-400 mb-1">Global</div>
							<div class="text-sm text-gray-400">Support Team</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Support Options Section -->
	<div class="bg-slate-900 py-16 sm:py-20 lg:py-24 relative overflow-x-hidden">
		<div class="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
			<div class="text-center mb-12 sm:mb-16">
				<h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
					How Can We Help?
				</h2>
				<p class="text-base sm:text-lg lg:text-xl text-gray-400">
					Choose the type of support you need
				</p>
			</div>
			
			<div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
				{#each supportOptions as option}
					<button 
						class="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20 hover:border-blue-400/50 transition-all duration-300 hover-lift glass text-left w-full"
						on:click={() => selectedCategory = option.id}
						class:ring-2={selectedCategory === option.id}
						class:ring-blue-400={selectedCategory === option.id}
					>
						<div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
							<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={option.icon}/>
							</svg>
						</div>
						<h3 class="text-lg font-bold text-white mb-2">{option.title}</h3>
						<p class="text-sm text-gray-400">{option.description}</p>
					</button>
				{/each}
			</div>
		</div>
	</div>

	<!-- Contact Form Section -->
	<div class="bg-gradient-to-r from-slate-800 to-slate-900 py-16 sm:py-20 lg:py-24 relative overflow-hidden">
		<div class="relative z-10 max-w-4xl mx-auto px-6 lg:px-12">
			<div class="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-3xl p-8 lg:p-12 border border-blue-500/20 glass">
				<div class="text-center mb-8">
					<h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
						Get in Touch
					</h2>
					<p class="text-gray-400">
						Fill out the form below and we'll get back to you as soon as possible.
					</p>
				</div>
				
				<form on:submit={handleSubmit} class="space-y-6">
					<div class="grid sm:grid-cols-2 gap-6">
						<div>
							<label for="name" class="block text-sm font-medium text-gray-300 mb-2">Name</label>
							<input 
								type="text" 
								id="name"
								bind:value={name}
								disabled={isSubmitting}
								class="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-blue-500/30 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors disabled:opacity-50"
								placeholder="Your full name"
							/>
						</div>
						<div>
							<label for="email" class="block text-sm font-medium text-gray-300 mb-2">Email</label>
							<input 
								type="email" 
								id="email"
								bind:value={email}
								disabled={isSubmitting}
								class="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-blue-500/30 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors disabled:opacity-50"
								placeholder="your@email.com"
							/>
						</div>
					</div>
					
					<div>
						<label for="subject" class="block text-sm font-medium text-gray-300 mb-2">Subject</label>
						<input 
							type="text" 
							id="subject"
							bind:value={subject}
							disabled={isSubmitting}
							class="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-blue-500/30 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors disabled:opacity-50"
							placeholder="Brief description of your issue"
						/>
					</div>
					
					<div>
						<label for="priority" class="block text-sm font-medium text-gray-300 mb-2">Priority</label>
						<select 
							id="priority"
							bind:value={priority}
							disabled={isSubmitting}
							class="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-blue-500/30 text-white focus:outline-none focus:border-blue-400 transition-colors disabled:opacity-50"
						>
							<option value="low">Low - General inquiry</option>
							<option value="medium">Medium - Standard issue</option>
							<option value="high">High - Important problem</option>
							<option value="urgent">Urgent - Critical issue</option>
						</select>
					</div>
					
					<div>
						<label for="message" class="block text-sm font-medium text-gray-300 mb-2">Message</label>
						<textarea 
							id="message"
							rows="6"
							bind:value={message}
							disabled={isSubmitting}
							class="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-blue-500/30 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors resize-none disabled:opacity-50"
							placeholder="Please describe your issue or question in detail..."
						></textarea>
					</div>
					
					{#if submitMessage}
						<div class="text-center p-4 rounded-xl {submitMessageType === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'}">
							{submitMessage}
						</div>
					{/if}
					
					<div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
						<button 
							type="submit"
							disabled={isSubmitting}
							class="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
						>
							{isSubmitting ? 'Sending...' : 'Send Message'}
						</button>
						<a 
							href="mailto:giddel100@gmail.com?subject=Schedule Call Request"
							class="flex items-center justify-center border-2 border-blue-400 hover:bg-blue-400/10 px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:border-blue-300 text-white"
						>
							Schedule Call
						</a>
					</div>
				</form>
			</div>
		</div>
	</div>

	<!-- FAQ Section -->
	<div class="bg-slate-900 py-16 sm:py-20 lg:py-24 relative overflow-x-hidden">
		<div class="relative z-10 max-w-4xl mx-auto px-6 lg:px-12">
			<div class="text-center mb-12 sm:mb-16">
				<h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
					Frequently Asked Questions
				</h2>
				<p class="text-base sm:text-lg lg:text-xl text-gray-400">
					Quick answers to common questions
				</p>
			</div>
			
			<div class="space-y-6">
				{#each faqItems as item, index}
					<div class="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 glass overflow-hidden">
						<details class="group">
							<summary class="flex justify-between items-center p-6 cursor-pointer">
								<h3 class="text-lg font-semibold text-white pr-4">{item.question}</h3>
								<svg class="w-5 h-5 text-blue-400 transition-transform duration-300 group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
								</svg>
							</summary>
							<div class="px-6 pb-6">
								<p class="text-gray-400 leading-relaxed">{item.answer}</p>
							</div>
						</details>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<!-- Support Channels Section -->
	<div class="bg-gradient-to-r from-slate-800 to-slate-900 py-16 sm:py-20 lg:py-24 relative overflow-hidden">
		<div class="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
			<div class="text-center mb-12 sm:mb-16">
				<h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
					Multiple Ways to Get Help
				</h2>
				<p class="text-base sm:text-lg lg:text-xl text-gray-400">
					Choose the support channel that works best for you
				</p>
			</div>
			
			<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
				<!-- Email Support -->
				<div class="text-center group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-500 hover-lift glass">
					<div class="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
						<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
						</svg>
					</div>
					<h3 class="text-xl font-bold text-white mb-3">Email Support</h3>
					<p class="text-gray-400 mb-4">Get detailed help via email with response times under 2 hours.</p>
					<div class="text-blue-400 font-semibold">support@defensys.com</div>
				</div>
				
				<!-- Live Chat -->
				<div class="text-center group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-500 hover-lift glass">
					<div class="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
						<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
						</svg>
					</div>
					<h3 class="text-xl font-bold text-white mb-3">Live Chat</h3>
					<p class="text-gray-400 mb-4">Instant help through our live chat system during business hours.</p>
					<div class="text-blue-400 font-semibold">Available 9 AM - 6 PM PST</div>
				</div>
				
				<!-- Community -->
				<div class="text-center group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-500 hover-lift glass">
					<div class="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
						<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
						</svg>
					</div>
					<h3 class="text-xl font-bold text-white mb-3">Community Forum</h3>
					<p class="text-gray-400 mb-4">Connect with other users and get help from the community.</p>
					<div class="text-blue-400 font-semibold">Join Discussion</div>
				</div>
			</div>
		</div>
	</div>
</div>
