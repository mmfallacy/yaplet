export interface Post {
	id: string;
	content: string;
	createdAt: string;
	threadId: string | null;
	images: string[];
	likes: number;
	footnotes?: Record<string, string>;
	tags: string[];
}

export interface Thread {
	id: string;
	title: string;
	description: string;
	createdAt: string;
	posts: string[];
}

export interface PostWithThread extends Post {
	thread?: Thread;
}

export interface Comment {
	id: string;
	postId: string;
	userId: string;
	userName: string;
	userAvatar?: string;
	content: string;
	createdAt: string;
}

export interface User {
	id: string;
	name: string;
	avatar?: string;
	githubUsername?: string;
}

export interface Manifest {
	standalone: string[];
	threads: string[];
}
