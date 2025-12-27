import { browser } from '$app/environment';
import type { User } from '$lib/types/post';

class AuthState {
	user = $state<User | null>(null);
	isLoading = $state(true);
	isAuthenticated = $derived(!!this.user);

	constructor() {
		if (browser) {
			const storedUser = localStorage.getItem('journal_user');
			if (storedUser) {
				try {
					this.user = JSON.parse(storedUser);
				} catch (e) {
					console.error('Failed to parse stored user', e);
				}
			}
			this.isLoading = false;
		}
	}

	async login() {
		// Stub: In a real app, this would redirect to GitHub OAuth
		const mockUser: User = {
			id: 'user-1',
			name: 'Demo User',
			githubUsername: 'demouser',
			avatar: undefined
		};
		this.user = mockUser;
		if (browser) {
			localStorage.setItem('journal_user', JSON.stringify(mockUser));
		}
	}

	logout() {
		this.user = null;
		if (browser) {
			localStorage.removeItem('journal_user');
		}
	}
}

export const auth = new AuthState();
