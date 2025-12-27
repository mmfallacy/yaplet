import { browser } from '$app/environment';

type Theme = 'light' | 'dark';

class ThemeState {
	theme = $state<Theme>('light');

	constructor() {
		if (browser) {
			const stored = localStorage.getItem('theme') as Theme | null;
			if (stored) {
				this.theme = stored;
			} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
				this.theme = 'dark';
			}
			this.applyTheme();
		}
	}

	toggleTheme() {
		this.theme = this.theme === 'dark' ? 'light' : 'dark';
		this.applyTheme();
	}

	setTheme(newTheme: Theme) {
		this.theme = newTheme;
		this.applyTheme();
	}

	private applyTheme() {
		if (!browser) return;
		const root = document.documentElement;
		if (this.theme === 'dark') {
			root.classList.add('dark');
		} else {
			root.classList.remove('dark');
		}
		localStorage.setItem('theme', this.theme);
	}
}

export const theme = new ThemeState();
