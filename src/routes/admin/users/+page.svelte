<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let user: any = null;
	let loading = true;
	let isLoaded = false;
	let users: any[] = [];
	let filteredUsers: any[] = [];
	let selectedUser: any = null;
	let showAddUserModal = false;
	let showEditUserModal = false;
	let showDeleteConfirm = false;

	// Filter and search
	let searchQuery = '';
	let roleFilter = 'all';
	let statusFilter = 'all';

	// Form data
	let newUserName = '';
	let newUserEmail = '';
	let newUserPassword = '';
	let newUserRole = 'user';

	let editUserName = '';
	let editUserEmail = '';
	let editUserRole = '';
	let editUserStatus = 'active';

	// Notification state
	let notification: { message: string; type: 'success' | 'error' | 'info' } | null = null;

	// Mobile sidebar state
	let showMobileSidebar = false;

	// Stats
	$: totalUsers = users.length;
	$: adminCount = users.filter(u => u.role === 'admin').length;
	$: activeUsers = users.filter(u => u.status === 'active').length;
	$: inactiveUsers = users.filter(u => u.status !== 'active').length;

	async function fetchUsers() {
		try {
			const token = localStorage.getItem('token');
			const response = await fetch('/api/admin/users', {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});
			const data = await response.json();

			if (data.success) {
				users = data.users;
				applyFilters();
			} else {
				showNotification(data.error || 'Failed to load users', 'error');
			}
		} catch (error) {
			console.error('Failed to fetch users:', error);
			showNotification('Failed to load users', 'error');
		}
	}

	function applyFilters() {
		filteredUsers = users.filter(u => {
			const matchesSearch = !searchQuery || 
				u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				u.email.toLowerCase().includes(searchQuery.toLowerCase());
			
			const matchesRole = roleFilter === 'all' || u.role === roleFilter;
			const matchesStatus = statusFilter === 'all' || u.status === statusFilter;

			return matchesSearch && matchesRole && matchesStatus;
		});
	}

	$: {
		searchQuery;
		roleFilter;
		statusFilter;
		applyFilters();
	}

	async function addUser() {
		if (!newUserName || !newUserEmail || !newUserPassword) {
			showNotification('Please fill in all fields', 'error');
			return;
		}

		try {
			const token = localStorage.getItem('token');
			const response = await fetch('/api/admin/users', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({
					name: newUserName,
					email: newUserEmail,
					password: newUserPassword,
					role: newUserRole
				})
			});

			const data = await response.json();

			if (data.success) {
				showNotification('User added successfully', 'success');
				showAddUserModal = false;
				newUserName = '';
				newUserEmail = '';
				newUserPassword = '';
				newUserRole = 'user';
				await fetchUsers();
			} else {
				showNotification(data.error || 'Failed to add user', 'error');
			}
		} catch (error) {
			console.error('Error adding user:', error);
			showNotification('Failed to add user', 'error');
		}
	}

	async function updateUser() {
		if (!editUserName || !editUserEmail) {
			showNotification('Please fill in all fields', 'error');
			return;
		}

		try {
			const token = localStorage.getItem('token');
			const response = await fetch(`/api/admin/users/${selectedUser._id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({
					name: editUserName,
					email: editUserEmail,
					role: editUserRole,
					status: editUserStatus
				})
			});

			const data = await response.json();

			if (data.success) {
				showNotification('User updated successfully', 'success');
				showEditUserModal = false;
				selectedUser = null;
				await fetchUsers();
			} else {
				showNotification(data.error || 'Failed to update user', 'error');
			}
		} catch (error) {
			console.error('Error updating user:', error);
			showNotification('Failed to update user', 'error');
		}
	}

	async function deleteUser() {
		try {
			const token = localStorage.getItem('token');
			const response = await fetch(`/api/admin/users/${selectedUser._id}`, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${token}`
				}
			});

			const data = await response.json();

			if (data.success) {
				showNotification('User deleted successfully', 'success');
				showDeleteConfirm = false;
				selectedUser = null;
				await fetchUsers();
			} else {
				showNotification(data.error || 'Failed to delete user', 'error');
			}
		} catch (error) {
			console.error('Error deleting user:', error);
			showNotification('Failed to delete user', 'error');
		}
	}

	function selectUser(u: any) {
		selectedUser = u;
		// Close mobile sidebar after selection
		showMobileSidebar = false;
	}	function openEditModal(userToEdit: any) {
		selectedUser = userToEdit;
		editUserName = userToEdit.name;
		editUserEmail = userToEdit.email;
		editUserRole = userToEdit.role;
		editUserStatus = userToEdit.status || 'active';
		showEditUserModal = true;
	}

	function openDeleteConfirm(userToDelete: any) {
		selectedUser = userToDelete;
		showDeleteConfirm = true;
	}

	function showNotification(message: string, type: 'success' | 'error' | 'info' = 'info') {
		notification = { message, type };
		setTimeout(() => {
			notification = null;
		}, 5000);
	}

	function closeNotification() {
		notification = null;
	}

	function getRoleBadgeColor(role: string) {
		switch (role) {
			case 'admin':
				return 'from-purple-500 to-pink-500';
			case 'user':
				return 'from-cyan-500 to-blue-500';
			default:
				return 'from-slate-500 to-slate-600';
		}
	}

	function getStatusColor(status: string) {
		switch (status) {
			case 'active':
				return 'bg-green-100 text-green-700';
			case 'inactive':
				return 'bg-slate-100 text-slate-700';
			case 'suspended':
				return 'bg-red-100 text-red-700';
			default:
				return 'bg-slate-100 text-slate-700';
		}
	}

	function handleLogout() {
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		goto('/login');
	}

	onMount(async () => {
		const storedUser = localStorage.getItem('user');
		const token = localStorage.getItem('token');

		if (!storedUser || !token) {
			goto('/login');
			return;
		}

		user = JSON.parse(storedUser);

		if (user.role !== 'admin') {
			goto('/dashboard');
			return;
		}

		await fetchUsers();
		loading = false;
		setTimeout(() => (isLoaded = true), 100);
	});
</script>

<svelte:head>
	<title>Manage Users - DefenSys</title>
</svelte:head>

{#if loading}
	<div
		class="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900"
	>
		<div class="text-center text-white">
			<svg
				class="mx-auto mb-4 h-12 w-12 animate-spin"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
			>
				<circle
					class="opacity-25"
					cx="12"
					cy="12"
					r="10"
					stroke="currentColor"
					stroke-width="4"
				></circle>
				<path
					class="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
				></path>
			</svg>
			<p class="text-slate-300">Loading...</p>
		</div>
	</div>
{:else}
	<!-- Notification Toast -->
	{#if notification}
		<div class="fixed top-4 right-4 z-50 animate-[slideInRight_0.3s_ease-out]">
			<div
				class="flex min-w-[320px] items-start space-x-4 rounded-xl border {notification.type ===
				'success'
					? 'border-green-200 bg-green-50'
					: notification.type === 'error'
						? 'border-red-200 bg-red-50'
						: 'border-blue-200 bg-blue-50'} p-4 shadow-2xl"
			>
				<div class="flex items-center space-x-3">
					{#if notification.type === 'success'}
						<div class="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
							<svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
							</svg>
						</div>
					{:else if notification.type === 'error'}
						<div class="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
							<svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
							</svg>
						</div>
					{:else}
						<div class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
							<svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</div>
					{/if}
					<div class="flex-1">
						<p class="text-sm font-medium text-slate-800">
							{notification.message}
						</p>
					</div>
				</div>
				<button
					on:click={closeNotification}
					class="text-slate-400 transition-colors hover:text-slate-600"
					aria-label="Close notification"
				>
					<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
							clip-rule="evenodd"
						/>
					</svg>
				</button>
			</div>
		</div>
	{/if}

	<div class="flex h-screen flex-col md:flex-row">
		<!-- Mobile Header with Menu Button -->
		<div class="md:hidden flex items-center justify-between border-b border-slate-200 bg-white p-4">
			<button
				on:click={() => goto('/admin')}
				class="flex items-center space-x-2 text-slate-900/70 transition-all hover:text-slate-900"
			>
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M10 19l-7-7m0 0l7-7m-7 7h18"
					/>
				</svg>
				<span class="text-sm font-semibold text-slate-900">Back to Dashboard</span>
			</button>
			<button
				on:click={() => showMobileSidebar = !showMobileSidebar}
				class="rounded-lg p-2 hover:bg-slate-100 transition-colors"
				aria-label="Toggle menu"
			>
				<svg class="h-6 w-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 12h16M4 18h16"
					/>
				</svg>
			</button>
		</div>

		<!-- Mobile Sidebar Overlay -->
		{#if showMobileSidebar}
			<div
				class="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
				on:click={() => showMobileSidebar = false}
			></div>
		{/if}

		<!-- Left Sidebar - User List -->
		<div
			class="flex w-96 flex-col border-r border-slate-200 bg-white {isLoaded
				? 'animate-[slideInLeft_0.6s_ease-out]'
				: 'opacity-0'} [animation-fill-mode:both]
				{showMobileSidebar ? 'fixed inset-y-0 left-0 z-50' : 'hidden'} md:flex"
		>
			<!-- Logo & Back Button -->
			<div class="border-b border-slate-200 p-6">
				<button
					on:click={() => goto('/admin')}
					class="mb-4 flex items-center space-x-2 text-slate-900/70 transition-all hover:text-slate-900"
				>
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M10 19l-7-7m0 0l7-7m-7 7h18"
						/>
					</svg>
					<span class="text-sm">Back to Dashboard</span>
				</button>
				<div class="flex items-center justify-between mb-2">
					<h1 class="text-2xl font-bold text-slate-900">User Management</h1>
				</div>
				<p class="text-sm text-slate-900/60">Manage user accounts and permissions</p>
			</div>

			<!-- Filters -->
			<div class="border-b border-slate-200 p-6 space-y-3">
					<!-- Search -->
					<div class="flex items-center gap-2">
						<input
						type="text"
						bind:value={searchQuery}
						placeholder="Search users..."
						class="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none transition-all focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
					/>
					<button
						on:click={() => (showAddUserModal = true)}
						class="rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 p-2 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
						aria-label="Add new user"
					>
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
						</svg>
					</button>
					</div>

					<!-- Role Filter -->
					<select
						bind:value={roleFilter}
						class="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none transition-all focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
					>
						<option value="all">All Roles</option>
						<option value="admin">Admins</option>
						<option value="user">Users</option>
					</select>

					<!-- Status Filter -->
					<select
						bind:value={statusFilter}
						class="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none transition-all focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
					>
						<option value="all">All Status</option>
						<option value="active">Active</option>
						<option value="inactive">Inactive</option>
					</select>
			</div>

			<!-- User List -->
			<div class="flex-1 overflow-y-auto p-4">
				<div class="space-y-3">
					{#each filteredUsers as userItem, i}
						<button
							on:click={() => {
								selectUser(userItem);
							}}
							class="w-full rounded-xl border p-4 text-left transition-all duration-300 {selectedUser?._id === userItem._id
								? 'border-cyan-300 bg-gradient-to-r from-cyan-50 to-blue-50'
								: 'border-slate-200 bg-white hover:border-cyan-200 hover:shadow-md'}"
						>
							<div class="flex items-center space-x-3">
								<div
									class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r {getRoleBadgeColor(
										userItem.role
									)} text-white font-bold"
								>
									{userItem.name.charAt(0).toUpperCase()}
								</div>
								<div class="flex-1 min-w-0">
									<div class="flex items-center space-x-2">
										<p class="text-sm font-semibold text-slate-800 truncate">
											{userItem.name}
										</p>
										<span
											class="inline-block rounded-full px-2 py-0.5 text-xs font-medium {getStatusColor(
												userItem.status || 'active'
											)}"
										>
											{userItem.status || 'active'}
										</span>
									</div>
									<p class="text-xs text-slate-500 truncate">{userItem.email}</p>
								</div>
							</div>
							<div class="mt-2 flex items-center justify-between">
								<span
									class="inline-block rounded-full px-2 py-1 text-xs font-medium {userItem.role === 'admin'
										? 'bg-purple-100 text-purple-700'
										: 'bg-blue-100 text-blue-700'}"
								>
									{userItem.role}
								</span>
								<span class="text-xs text-slate-400">
									{new Date(userItem.createdAt).toLocaleDateString()}
								</span>
							</div>
						</button>
					{/each}

					{#if filteredUsers.length === 0}
						<div class="py-12 text-center">
							<p class="text-sm text-slate-500">No users found</p>
						</div>
					{/if}
				</div>
			</div>
		</div>

		<!-- Main Content Area -->
		<div class="flex flex-1 flex-col overflow-y-auto bg-gradient-to-br from-slate-50 to-blue-50">
			<div class="flex-1 p-4 md:p-8 pb-0">
				<!-- Header -->
				<div class="mb-6 md:mb-8 {isLoaded ? 'animate-[fadeInDown_0.6s_ease-out]' : 'opacity-0'}">
					<div class="flex space-y-4 flex-row items-center justify-between md:space-y-0">
						<h1 class="text-2xl md:text-3xl font-bold text-slate-800">User Management</h1>
						<div class="flex items-center justify-between md:justify-start md:space-x-4">
							<button class="rounded-lg p-2 transition-colors hover:bg-white md:block hidden" aria-label="Search">
								<svg
									class="h-6 w-6 text-slate-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
									/>
								</svg>
							</button>
							<button
								class="relative rounded-lg p-2 transition-colors hover:bg-white md:block hidden"
								aria-label="Notifications"
							>
								<svg
									class="h-6 w-6 text-slate-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
									/>
								</svg>
								<span class="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
							</button>
							<div class="flex items-center space-x-2 md:space-x-3 md:border-l border-slate-300 md:pl-4">
								<div class="text-right hidden md:block">
									<p class="text-sm text-slate-500">Administrator</p>
									<p class="text-sm font-semibold text-black">
										{user?.name || 'System Administrator'}
									</p>
								</div>
								<button
									on:click={handleLogout}
									class="rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-3 py-2 md:px-4 text-sm font-medium text-white transition-all duration-300 hover:scale-105"
								>
									Logout
								</button>
							</div>
						</div>
					</div>
				</div>

				<!-- Stats Grid -->
				<div class="mb-6 md:mb-8 grid grid-cols-2 gap-3 md:gap-6 lg:grid-cols-4 {isLoaded ? 'animate-[fadeInUp_0.6s_ease-out_0.1s]' : 'opacity-0'} [animation-fill-mode:both]">
					<!-- Total Users -->
					<div class="rounded-2xl bg-white p-4 md:p-6 shadow-lg">
						<div class="flex items-center justify-between">
							<div>
								<p class="text-xs md:text-sm font-medium text-slate-600">Total Users</p>
								<p class="mt-1 md:mt-2 text-2xl md:text-3xl font-bold text-slate-900">{totalUsers}</p>
							</div>
							<div class="rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 p-2 md:p-3">
								<svg class="h-6 w-6 md:h-8 md:w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
								</svg>
							</div>
						</div>
					</div>

					<!-- Admins -->
					<div class="rounded-2xl bg-white p-4 md:p-6 shadow-lg">
						<div class="flex items-center justify-between">
							<div>
								<p class="text-xs md:text-sm font-medium text-slate-600">Administrators</p>
								<p class="mt-1 md:mt-2 text-2xl md:text-3xl font-bold text-slate-900">{adminCount}</p>
							</div>
							<div class="rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 p-2 md:p-3">
								<svg class="h-6 w-6 md:h-8 md:w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
								</svg>
							</div>
						</div>
					</div>

					<!-- Active Users -->
					<div class="rounded-2xl bg-white p-4 md:p-6 shadow-lg">
						<div class="flex items-center justify-between">
							<div>
								<p class="text-xs md:text-sm font-medium text-slate-600">Active Users</p>
								<p class="mt-1 md:mt-2 text-2xl md:text-3xl font-bold text-slate-900">{activeUsers}</p>
							</div>
							<div class="rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 p-2 md:p-3">
								<svg class="h-6 w-6 md:h-8 md:w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</div>
						</div>
					</div>

					<!-- Inactive Users -->
					<div class="rounded-2xl bg-white p-4 md:p-6 shadow-lg">
						<div class="flex items-center justify-between">
							<div>
								<p class="text-xs md:text-sm font-medium text-slate-600">Inactive Users</p>
								<p class="mt-1 md:mt-2 text-2xl md:text-3xl font-bold text-slate-900">{inactiveUsers}</p>
							</div>
							<div class="rounded-xl bg-gradient-to-r from-slate-500 to-slate-600 p-2 md:p-3">
								<svg class="h-6 w-6 md:h-8 md:w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
								</svg>
							</div>
						</div>
					</div>
				</div>

				<!-- User Detail Card or Empty State -->
				{#if !selectedUser}
					<div class="rounded-2xl bg-white p-8 md:p-12 shadow-lg text-center {isLoaded ? 'animate-[fadeInUp_0.6s_ease-out_0.2s]' : 'opacity-0'} [animation-fill-mode:both]">
						<svg class="mx-auto mb-4 md:mb-6 h-16 w-16 md:h-24 md:w-24 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
						</svg>
						<h3 class="mb-2 text-xl md:text-2xl font-bold text-slate-800">No User Selected</h3>
						<p class="text-sm md:text-base text-slate-600">Select a user from the list to view details and manage permissions</p>
					</div>
				{:else}
					<div class="rounded-2xl bg-white p-4 md:p-8 shadow-lg {isLoaded ? 'animate-[fadeInUp_0.6s_ease-out_0.2s]' : 'opacity-0'} [animation-fill-mode:both]">
						<!-- User Header -->
						<div class="mb-6 md:mb-8 flex flex-col md:flex-row md:items-start md:justify-between space-y-4 md:space-y-0 border-b border-slate-200 pb-4 md:pb-6">
							<div class="flex items-center space-x-3 md:space-x-4">
								<div
									class="flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-2xl bg-gradient-to-r {getRoleBadgeColor(
										selectedUser.role
									)} text-2xl md:text-3xl font-bold text-white shadow-lg"
								>
									{selectedUser.name.charAt(0).toUpperCase()}
								</div>
								<div>
									<h2 class="text-xl md:text-2xl font-bold text-slate-900">{selectedUser.name}</h2>
									<p class="text-sm md:text-base text-slate-600">{selectedUser.email}</p>
									<div class="mt-2 flex items-center space-x-2">
										<span
											class="inline-block rounded-full px-3 py-1 text-xs font-bold {selectedUser.role === 'admin'
												? 'bg-purple-100 text-purple-700'
												: 'bg-blue-100 text-blue-700'}"
										>
											{selectedUser.role.toUpperCase()}
										</span>
										<span class="inline-block rounded-full px-3 py-1 text-xs font-medium {getStatusColor(selectedUser.status || 'active')}">
											{selectedUser.status || 'active'}
										</span>
									</div>
								</div>
							</div>
							<div class="flex space-x-2">
								<button
									on:click={() => openEditModal(selectedUser)}
									class="flex items-center space-x-1 md:space-x-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-4 md:px-6 py-2 md:py-3 text-sm md:text-base font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105"
								>
									<svg class="h-4 w-4 md:h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
									</svg>
									<span class="hidden md:inline">Edit</span>
								</button>
							<button
								on:click={() => openDeleteConfirm(selectedUser)}
								class="flex items-center justify-center rounded-xl bg-red-500 px-4 md:px-6 py-2 md:py-3 text-sm md:text-base font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-red-600"
								aria-label="Delete user"
							>
								<svg class="h-4 w-4 md:h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
								</svg>
							</button>
						</div>
					</div>						<!-- User Details Grid -->
						<div class="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2">
							<div class="rounded-xl border border-slate-200 bg-slate-50 p-6">
								<h3 class="mb-4 text-lg font-semibold text-slate-900">Account Information</h3>
								<div class="space-y-3">
									<div>
										<p class="text-sm text-slate-500">User ID</p>
										<p class="font-mono text-sm text-slate-900">{selectedUser._id}</p>
									</div>
									<div>
										<p class="text-sm text-slate-500">Created</p>
										<p class="text-sm text-slate-900">{new Date(selectedUser.createdAt).toLocaleString()}</p>
									</div>
									{#if selectedUser.updatedAt}
										<div>
											<p class="text-sm text-slate-500">Last Updated</p>
											<p class="text-sm text-slate-900">{new Date(selectedUser.updatedAt).toLocaleString()}</p>
										</div>
									{/if}
								</div>
							</div>

							<div class="rounded-xl border border-slate-200 bg-slate-50 p-6">
								<h3 class="mb-4 text-lg font-semibold text-slate-900">Permissions</h3>
								<div class="space-y-2">
									{#if selectedUser.role === 'admin'}
										<div class="flex items-center space-x-2 text-green-700">
											<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
											</svg>
											<span class="text-sm">Full System Access</span>
										</div>
										<div class="flex items-center space-x-2 text-green-700">
											<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
											</svg>
											<span class="text-sm">User Management</span>
										</div>
										<div class="flex items-center space-x-2 text-green-700">
											<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
											</svg>
											<span class="text-sm">Scan Management</span>
										</div>
										<div class="flex items-center space-x-2 text-green-700">
											<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
											</svg>
											<span class="text-sm">Reports Access</span>
										</div>
									{:else}
										<div class="flex items-center space-x-2 text-green-700">
											<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
											</svg>
											<span class="text-sm">View Scans</span>
										</div>
										<div class="flex items-center space-x-2 text-green-700">
											<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
											</svg>
											<span class="text-sm">Create Scans</span>
										</div>
										<div class="flex items-center space-x-2 text-slate-400">
											<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
											</svg>
											<span class="text-sm">User Management</span>
										</div>
										<div class="flex items-center space-x-2 text-slate-400">
											<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
											</svg>
											<span class="text-sm">System Settings</span>
										</div>
									{/if}
								</div>
							</div>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>

	<!-- Add User Modal -->
	{#if showAddUserModal}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
			on:click={() => (showAddUserModal = false)}
		>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div
				class="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-2xl"
				on:click|stopPropagation
			>
				<h2 class="mb-4 md:mb-6 text-xl md:text-2xl font-bold text-slate-900">Add New User</h2>

				<form on:submit|preventDefault={addUser} class="space-y-4">
					<div>
						<label for="name" class="mb-2 block text-sm font-medium text-slate-700">Name</label>
						<input
							id="name"
							type="text"
							bind:value={newUserName}
							placeholder="John Doe"
							class="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
							required
						/>
					</div>

					<div>
						<label for="email" class="mb-2 block text-sm font-medium text-slate-700">Email</label>
						<input
							id="email"
							type="email"
							bind:value={newUserEmail}
							placeholder="john@example.com"
							class="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
							required
						/>
					</div>

					<div>
						<label for="password" class="mb-2 block text-sm font-medium text-slate-700"
							>Password</label
						>
						<input
							id="password"
							type="password"
							bind:value={newUserPassword}
							placeholder="••••••••"
							class="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
							required
						/>
					</div>

					<div>
						<label for="role" class="mb-2 block text-sm font-medium text-slate-700">Role</label>
						<select
							id="role"
							bind:value={newUserRole}
							class="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
						>
							<option value="user">User</option>
							<option value="admin">Admin</option>
						</select>
					</div>

					<div class="flex space-x-3 pt-4">
						<button
							type="button"
							on:click={() => (showAddUserModal = false)}
							class="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 font-medium text-slate-700 transition-all hover:bg-slate-50"
						>
							Cancel
						</button>
						<button
							type="submit"
							class="flex-1 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-3 font-medium text-white shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/30"
						>
							Add User
						</button>
					</div>
				</form>
			</div>
		</div>
	{/if}

	<!-- Edit User Modal -->
	{#if showEditUserModal && selectedUser}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
			on:click={() => (showEditUserModal = false)}
		>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div
				class="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-2xl"
				on:click|stopPropagation
			>
				<h2 class="mb-4 md:mb-6 text-xl md:text-2xl font-bold text-slate-900">Edit User</h2>

				<form on:submit|preventDefault={updateUser} class="space-y-4">
					<div>
						<label for="edit-name" class="mb-2 block text-sm font-medium text-slate-700">Name</label>
						<input
							id="edit-name"
							type="text"
							bind:value={editUserName}
							class="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
							required
						/>
					</div>

					<div>
						<label for="edit-email" class="mb-2 block text-sm font-medium text-slate-700"
							>Email</label
						>
						<input
							id="edit-email"
							type="email"
							bind:value={editUserEmail}
							class="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
							required
						/>
					</div>

					<div>
						<label for="edit-role" class="mb-2 block text-sm font-medium text-slate-700">Role</label>
						<select
							id="edit-role"
							bind:value={editUserRole}
							class="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
						>
							<option value="user">User</option>
							<option value="admin">Admin</option>
						</select>
					</div>

					<div class="flex space-x-3 pt-4">
						<button
							type="button"
							on:click={() => (showEditUserModal = false)}
							class="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 font-medium text-slate-700 transition-all hover:bg-slate-50"
						>
							Cancel
						</button>
						<button
							type="submit"
							class="flex-1 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-3 font-medium text-white shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/30"
						>
							Update User
						</button>
					</div>
				</form>
			</div>
		</div>
	{/if}

	<!-- Delete Confirmation Modal -->
	{#if showDeleteConfirm && selectedUser}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
			on:click={() => (showDeleteConfirm = false)}
		>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div
				class="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-2xl"
				on:click|stopPropagation
			>
				<div class="mb-4 md:mb-6 text-center">
					<div
						class="mx-auto mb-3 md:mb-4 flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-full bg-red-100"
					>
						<svg class="h-6 w-6 md:h-8 md:w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
							/>
						</svg>
					</div>
					<h2 class="mb-2 text-xl md:text-2xl font-bold text-slate-900">Delete User</h2>
					<p class="text-sm md:text-base text-slate-600">
						Are you sure you want to delete <strong class="text-slate-900">{selectedUser.name}</strong
						>? This action cannot be undone.
					</p>
				</div>

				<div class="flex space-x-3">
					<button
						on:click={() => (showDeleteConfirm = false)}
						class="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 font-medium text-slate-700 transition-all hover:bg-slate-50"
					>
						Cancel
					</button>
					<button
						on:click={deleteUser}
						class="flex-1 rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-4 py-3 font-medium text-white shadow-lg shadow-red-500/20 transition-all hover:scale-105 hover:shadow-xl hover:shadow-red-500/30"
					>
						Delete
					</button>
				</div>
			</div>
		</div>
	{/if}
{/if}

<style>
	@keyframes slideInRight {
		from {
			opacity: 0;
			transform: translateX(100%);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	@keyframes slideInLeft {
		from {
			opacity: 0;
			transform: translateX(-100%);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

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

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
