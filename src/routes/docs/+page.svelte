<script>
	import Navigation from '$lib/components/Navigation.svelte';
	import { onMount } from 'svelte';
	
	let isLoaded = false;
	let searchQuery = '';
	
	onMount(() => {
		isLoaded = true;
	});

	const docSections = [
		{
			title: 'Getting Started',
			items: [
				{ title: 'Quick Start Guide', description: 'Get up and running in 5 minutes', time: '5 min read' },
				{ title: 'Installation', description: 'Complete installation instructions', time: '10 min read' },
				{ title: 'First Scan', description: 'Run your first vulnerability scan', time: '8 min read' },
				{ title: 'Configuration', description: 'Basic configuration options', time: '12 min read' }
			]
		},
		{
			title: 'API Reference',
			items: [
				{ title: 'Authentication', description: 'API authentication methods', time: '6 min read' },
				{ title: 'Scanning Endpoints', description: 'Programmatic scanning APIs', time: '15 min read' },
				{ title: 'Reporting APIs', description: 'Generate and retrieve reports', time: '10 min read' },
				{ title: 'Webhooks', description: 'Real-time notifications', time: '8 min read' }
			]
		},
		{
			title: 'Advanced Features',
			items: [
				{ title: 'Custom Policies', description: 'Create custom scanning policies', time: '20 min read' },
				{ title: 'Integrations', description: 'Third-party tool integrations', time: '15 min read' },
				{ title: 'Automation', description: 'Automated scanning workflows', time: '18 min read' },
				{ title: 'Compliance', description: 'Compliance frameworks and reporting', time: '25 min read' }
			]
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
		<div class="relative z-10 px-6 py-20 lg:px-12 lg:py-32">
			<div class="max-w-7xl mx-auto">
				<div class="text-center space-y-8 lg:space-y-12">
					<!-- Badge -->
					<div class="inline-flex items-center justify-center gap-3 bg-blue-900/60 backdrop-blur-sm border border-blue-400/50 rounded-full px-6 py-3 glass {isLoaded ? 'animate-[fadeInUp_0.8s_ease-out_0.1s]' : 'opacity-0'} [animation-fill-mode:both]">
						<svg class="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
							<path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3M5 19V5H9V19H5M19 19H11V5H19V19Z"/>
						</svg>
						<span class="text-white font-bold text-sm md:text-base">Comprehensive Documentation</span>
					</div>
					
					<!-- Main Headline -->
					<div class="space-y-6">
						<h1 class="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight {isLoaded ? 'animate-[fadeInUp_1s_ease-out_0.3s]' : 'opacity-0'} [animation-fill-mode:both]">
							<span class="text-white">Documentation &</span>
							<span class="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400">
								Developer Guides
							</span>
						</h1>
						
						<p class="text-lg sm:text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-4xl mx-auto {isLoaded ? 'animate-[fadeInUp_1s_ease-out_0.5s]' : 'opacity-0'} [animation-fill-mode:both]">
							Complete guides, API references, and tutorials to help you get the most out of DefenSys security platform.
						</p>
					</div>
					
					<!-- Search Bar -->
					<div class="max-w-2xl mx-auto {isLoaded ? 'animate-[fadeInUp_1s_ease-out_0.7s]' : 'opacity-0'} [animation-fill-mode:both]">
						<div class="relative">
							<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
								<svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
								</svg>
							</div>
							<input 
								type="text" 
								bind:value={searchQuery}
								placeholder="Search documentation..."
								class="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-800/50 backdrop-blur-sm border border-blue-500/30 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors text-lg"
							>
						</div>
					</div>
					
					<!-- Quick Links -->
					<div class="flex flex-wrap justify-center gap-4 {isLoaded ? 'animate-[fadeInUp_1s_ease-out_0.9s]' : 'opacity-0'} [animation-fill-mode:both]">
						<button class="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25">
							Quick Start
						</button>
						<button class="border border-blue-400 hover:bg-blue-400/10 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:border-blue-300">
							API Reference
						</button>
						<button class="border border-gray-600 hover:bg-gray-600/10 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:border-gray-500 text-gray-300 hover:text-white">
							Examples
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Documentation Sections -->
	<div class="bg-slate-900 py-16 sm:py-20 lg:py-24 relative overflow-x-hidden">
		<div class="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
			<div class="space-y-12 lg:space-y-16">
				{#each docSections as section}
					<div class="space-y-6">
						<h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-8">
							{section.title}
						</h2>
						
						<div class="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
							{#each section.items as item}
								<div class="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20 hover:border-blue-400/50 transition-all duration-300 hover-lift glass cursor-pointer">
									<div class="flex items-start space-x-3 mb-4">
										<div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
											<svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
												<path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
											</svg>
										</div>
										<div class="flex-1">
											<h3 class="text-lg font-bold text-white mb-1">{item.title}</h3>
											<span class="text-xs text-blue-400 font-medium">{item.time}</span>
										</div>
									</div>
									<p class="text-sm text-gray-400 leading-relaxed mb-4">{item.description}</p>
									<div class="text-blue-400 font-semibold group-hover:text-cyan-400 transition-colors text-sm flex items-center space-x-2">
										<span>Read More</span>
										<svg class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
										</svg>
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<!-- Code Examples Section -->
	<div class="bg-gradient-to-r from-slate-800 to-slate-900 py-16 sm:py-20 lg:py-24 relative overflow-hidden">
		<div class="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
			<div class="text-center mb-12 sm:mb-16">
				<h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
					Code Examples
				</h2>
				<p class="text-base sm:text-lg lg:text-xl text-gray-400">
					Get started quickly with these practical examples
				</p>
			</div>
			
			<div class="grid lg:grid-cols-2 gap-8">
				<!-- Python Example -->
				<div class="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 glass overflow-hidden">
					<div class="bg-slate-800/80 px-6 py-4 border-b border-blue-500/20">
						<div class="flex items-center space-x-3">
							<div class="w-3 h-3 rounded-full bg-red-500"></div>
							<div class="w-3 h-3 rounded-full bg-yellow-500"></div>
							<div class="w-3 h-3 rounded-full bg-green-500"></div>
							<span class="text-gray-400 text-sm ml-4">Python SDK</span>
						</div>
					</div>
					<div class="p-6">
						<pre class="text-sm text-gray-300 overflow-x-auto"><code>
import defensys

# Initialize client
client = defensys.Client(api_key="your_api_key")

# Start a vulnerability scan
scan = client.scans.create(
    target="192.168.1.0/24",
    scan_type="comprehensive",
    callback_url="https://your-app.com/webhook"
)

# Get scan results
results = client.scans.get_results(scan.id)
print(f"Found &#123;len(results.vulnerabilities)&#125; vulnerabilities")
						</code></pre>
					</div>
				</div>

				<!-- cURL Example -->
				<div class="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 glass overflow-hidden">
					<div class="bg-slate-800/80 px-6 py-4 border-b border-blue-500/20">
						<div class="flex items-center space-x-3">
							<div class="w-3 h-3 rounded-full bg-red-500"></div>
							<div class="w-3 h-3 rounded-full bg-yellow-500"></div>
							<div class="w-3 h-3 rounded-full bg-green-500"></div>
							<span class="text-gray-400 text-sm ml-4">REST API</span>
						</div>
					</div>
					<div class="p-6">
						<pre class="text-sm text-gray-300 overflow-x-auto"><code>
# Start a new scan
curl -X POST "https://api.defensys.com/v1/scans" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '&#123;
    "target": "example.com",
    "scan_type": "quick",
    "options": &#123;
      "port_scan": true,
      "vulnerability_check": true
    &#125;
  &#125;'

# Response
&#123;
  "scan_id": "scan_123456",
  "status": "running",
  "estimated_completion": "2025-01-01T12:30:00Z"
&#125;
						</code></pre>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Popular Guides Section -->
	<div class="bg-slate-900 py-16 sm:py-20 lg:py-24 relative overflow-x-hidden">
		<div class="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
			<div class="text-center mb-12 sm:mb-16">
				<h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
					Popular Guides
				</h2>
				<p class="text-base sm:text-lg lg:text-xl text-gray-400">
					Most accessed documentation by our community
				</p>
			</div>
			
			<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
				<!-- Guide 1 -->
				<div class="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20 hover:border-blue-400/50 transition-all duration-300 hover-lift glass">
					<div class="flex items-center space-x-3 mb-4">
						<div class="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
							<span class="text-white font-bold text-sm">1</span>
						</div>
						<div class="text-sm text-green-400 font-semibold">Most Popular</div>
					</div>
					<h3 class="text-xl font-bold text-white mb-3">Setting Up Your First Scan</h3>
					<p class="text-gray-400 text-sm mb-4">Complete guide to configuring and running your initial vulnerability assessment.</p>
					<div class="flex items-center justify-between text-xs text-gray-500">
						<span>15 min read</span>
						<span>1.2k views</span>
					</div>
				</div>

				<!-- Guide 2 -->
				<div class="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20 hover:border-blue-400/50 transition-all duration-300 hover-lift glass">
					<div class="flex items-center space-x-3 mb-4">
						<div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
							<span class="text-white font-bold text-sm">2</span>
						</div>
						<div class="text-sm text-blue-400 font-semibold">Trending</div>
					</div>
					<h3 class="text-xl font-bold text-white mb-3">API Authentication</h3>
					<p class="text-gray-400 text-sm mb-4">Learn how to securely authenticate with the DefenSys API using various methods.</p>
					<div class="flex items-center justify-between text-xs text-gray-500">
						<span>8 min read</span>
						<span>956 views</span>
					</div>
				</div>

				<!-- Guide 3 -->
				<div class="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20 hover:border-blue-400/50 transition-all duration-300 hover-lift glass">
					<div class="flex items-center space-x-3 mb-4">
						<div class="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
							<span class="text-white font-bold text-sm">3</span>
						</div>
						<div class="text-sm text-purple-400 font-semibold">Updated</div>
					</div>
					<h3 class="text-xl font-bold text-white mb-3">Integrating with CI/CD</h3>
					<p class="text-gray-400 text-sm mb-4">Automate security scanning in your development pipeline with GitHub Actions.</p>
					<div class="flex items-center justify-between text-xs text-gray-500">
						<span>22 min read</span>
						<span>743 views</span>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Support CTA Section -->
	<div class="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 py-16 sm:py-20 lg:py-24 relative overflow-x-hidden">
		<div class="relative z-10 max-w-4xl mx-auto text-center px-6 lg:px-12">
			<h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
				Need Help?
			</h2>
			<p class="text-lg sm:text-xl text-gray-300 mb-8">
				Can't find what you're looking for? Our support team is here to help.
			</p>
			<div class="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
				<button class="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25">
					Contact Support
				</button>
				<button class="border-2 border-blue-400 hover:bg-blue-400/10 px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:border-blue-300 text-white">
					Join Community
				</button>
			</div>
		</div>
	</div>
</div>
