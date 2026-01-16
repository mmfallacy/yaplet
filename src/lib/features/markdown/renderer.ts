import { MessageCircle } from 'lucide-static';
import { marked } from 'marked';

export const renderer = new marked.Renderer();

renderer.link = function ({ href, title, text }) {
	switch (true) {
		case href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:'):
			return `<a href="${href}" onclick="event.stopPropagation();" title="${title || ''}" target="_blank" class="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors">${text}</a>`;
		default:
			return `<a href="${href}" onclick="event.stopPropagation();" title="${title || ''}" class="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-sm text-primary transition-colors hover:bg-primary/20 [&>svg]:size-3" >
				${MessageCircle}
				${text}
				</a>
					`;
	}
};
renderer.image = () => {
	console.warn('ContentError: Posts cannot contain images');
	return '';
};
