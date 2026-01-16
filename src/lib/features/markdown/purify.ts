import type { Config, UponSanitizeAttributeHook } from 'dompurify';

export const uponSanitizeAttributeHook: UponSanitizeAttributeHook = function (_, data) {
	if (data.attrName !== 'onclick') return;
	// Only allow stopPropagation for onclicks;
	console.table([data], ['attrName', 'attrValue', 'keepAttr', 'forceKeepAttr']);
	if (!/^event\.stopPropagation\(\);?$/.test(data.attrValue)) data.attrValue = '';
	console.log('ignored');
};

export const DOMPURIFY_CONFIG = {
	ADD_ATTR: ['target', 'rel'],
	FORBID_TAGS: ['script', 'iframe', 'object', 'embed'],
	ALLOWED_TAGS: [
		'u',
		's',
		'del',
		'ins',
		'sub',
		'sup',
		'h1',
		'h2',
		'h3',
		'h4',
		'h5',
		'h6',
		'p',
		'br',
		'hr',
		'strong',
		'em',
		'strong',
		'b',
		'i',
		'code',
		'pre',
		'a',
		'ul',
		'ol',
		'li',
		'blockquote',
		'figure',
		'figcaption',
		'table',
		'thead',
		'tbody',
		'tr',
		'th',
		'td',
		'img',
		'div',
		'span'
	]
} satisfies Config;
