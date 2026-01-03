import type { Post } from './types';

export function parseFrontmatter(content: string): {
	data: Record<string, unknown>;
	content: string;
} {
	const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
	const match = content.match(frontmatterRegex);

	if (!match) {
		return { data: {}, content: content.trim() };
	}

	const [, frontmatterStr, body] = match;
	const data: Record<string, unknown> = {};

	const lines = frontmatterStr.split('\n');
	let currentKey = '';
	let currentArray: string[] = [];
	let inArray = false;
	let inFootnoteObject = false;
	let footnoteKey = '';
	let footnoteValue = '';
	let inFootnoteValue = false;

	for (const line of lines) {
		const trimmed = line.trim();
		if (!trimmed) continue;

		if (inFootnoteValue) {
			if (trimmed === '') {
				inFootnoteValue = false;
				if (currentKey && footnoteKey) {
					(data[currentKey] as Record<string, string>)[footnoteKey] = footnoteValue.trim();
				}
				footnoteKey = '';
				footnoteValue = '';
				continue;
			}
			footnoteValue += line + '\n';
			continue;
		}

		if (trimmed.startsWith('- ')) {
			if (inArray) {
				currentArray.push(
					trimmed
						.slice(2)
						.trim()
						.replace(/^["']|["']$/g, '')
				);
			}
			continue;
		}

		if (inArray && currentKey) {
			data[currentKey] = currentArray;
			inArray = false;
			currentArray = [];
		}

		const colonIndex = trimmed.indexOf(':');
		if (colonIndex > 0) {
			const key = trimmed.slice(0, colonIndex).trim();
			const value = trimmed.slice(colonIndex + 1).trim();

			if (key === 'footnotes') {
				currentKey = key;
				inFootnoteObject = true;
				data[key] = {};
				continue;
			}

			if (inFootnoteObject && !inArray) {
				if (value === '' || value === '[]') {
					if (value === '[]') {
						data[key] = {};
					}
					inFootnoteObject = false;
				} else {
					footnoteKey = key;
					footnoteValue = value.replace(/^["']|["']$/g, '') + '\n';
					inFootnoteValue = true;
				}
				continue;
			}

			if (value === '' || value === '[]') {
				currentKey = key;
				inArray = true;
				currentArray = [];
				if (value === '[]') {
					data[key] = [];
					inArray = false;
				}
			} else if (value.startsWith('[') && value.endsWith(']')) {
				const inner = value.slice(1, -1);
				const items = inner
					.split(',')
					.map((s) => s.trim().replace(/^["']|["']$/g, ''))
					.filter((s) => s !== '');
				data[key] = items;
			} else {
				let parsedValue: unknown = value.replace(/^["']|["']$/g, '');
				if (!isNaN(Number(parsedValue)) && parsedValue !== '') {
					parsedValue = Number(parsedValue);
				}
				data[key] = parsedValue;
			}
		}
	}

	if (inFootnoteValue && footnoteKey && currentKey) {
		(data[currentKey] as Record<string, string>)[footnoteKey] = footnoteValue.trim();
	}

	if (inArray && currentKey) {
		data[currentKey] = currentArray;
	}

	return { data, content: body.trim() };
}

export async function fetchMarkdownFile(path: string): Promise<string> {
	const response = await fetch(path);
	if (!response.ok) throw new Error(`Failed to fetch ${path}`);
	return response.text();
}

export async function parseMarkdownPost(
	content: string,
	threadId: string | null = null
): Promise<Post> {
	const { data, content: body } = parseFrontmatter(content);
	return {
		id: data.id as string,
		content: body.trim(),
		createdAt: data.createdAt as string,
		threadId,
		images: (data.images as string[]) || [],
		likes: (data.likes as number) || 0,
		footnotes: data.footnotes as Record<string, string> | undefined,
		tags: (data.tags as string[]) || []
	};
}
