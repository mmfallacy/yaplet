import type { Post } from '$lib/shared/types';

/**
 * Footnote pattern: [^(a-Z)(0-9)]
 * \[ - Literal [
 * \^ - Literal &
 * ( [^\]]+ ) - one or more characters not ]
 * \] - Literal closing ]
 */
const FOOTNOTE_PATTERN = /\[\^([^\]]+)\]/g;

function replaceRange(str: string, start: number, end: number, replacement: string) {
	return str.slice(0, start) + replacement + str.slice(end);
}

// content: post content
// footnotes: record<key, footnote value>
// prefix: post_id to be used as footnote href prefix
export function processFootnotes(content: string, footnotes: Post['footnotes'], prefix: string) {
	if (typeof footnotes === 'undefined') return [content, []];

	const keyIndices = new Map();
	let result = content;
	const order: string[] = [];

	let m: RegExpExecArray | null;
	while ((m = FOOTNOTE_PATTERN.exec(result)) != null) {
		const [full, key] = m;

		if (!Object.hasOwn(footnotes, key)) {
			result = replaceRange(
				result,
				m.index,
				m.index + full.length,
				'<sup class="footnote"><a href="#" onclick="event.stopPropagation();">[?]</a></sup>'
			);
			continue;
		}

		if (!keyIndices.has(key)) keyIndices.set(key, keyIndices.size + 1);

		const num = keyIndices.get(key);

		const href = `${prefix}-${key}`;
		const replacement = `<sup class="footnote"><a href="#fn-${href}" onclick="event.stopPropagation();">[${num}]</a></sup>`;

		result = replaceRange(result, m.index, m.index + full.length, replacement);
		order.push(key);
	}

	return [result, order];
}
