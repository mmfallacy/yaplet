import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

import type { PostWithThread } from './types';

export function filterByDateRange(
	posts: PostWithThread[],
	startDate?: Date,
	endDate?: Date
): PostWithThread[] {
	return posts.filter((post) => {
		const postDate = new Date(post.createdAt);
		if (startDate && postDate < startDate) return false;
		if (endDate && postDate > endDate) return false;
		return true;
	});
}

export function formatDate(dateString: string): string {
	const date = new Date(dateString);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffMins = Math.floor(diffMs / 60000);
	const diffHours = Math.floor(diffMs / 3600000);
	const diffDays = Math.floor(diffMs / 86400000);

	if (diffMins < 1) return 'just now';
	if (diffMins < 60) return `${diffMins}m`;
	if (diffHours < 24) return `${diffHours}h`;
	if (diffDays < 7) return `${diffDays}d`;

	return date.toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
	});
}

export const MAX_CHARS = 400;

export function validateContent(content: string): {
	valid: boolean;
	error?: string;
} {
	if (!content.trim()) {
		return { valid: false, error: 'Content cannot be empty' };
	}
	if (content.length > MAX_CHARS) {
		return { valid: false, error: `Content exceeds ${MAX_CHARS} characters` };
	}
	return { valid: true };
}

export function normalizeMarkdownFilename(filename: string): string {
	if (filename.endsWith('.md')) return filename;
	return `${filename}.md`;
}
