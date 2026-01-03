import { betterAuth } from 'better-auth';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';

export const auth = betterAuth({
	socialProviders: {
		github: {
			clientId: process.env.GITHUB_CLIENT_ID!,
			clientSecret: process.env.GITHUB_CLIENT_SECRET!
		},
		gitlab: {
			clientId: process.env.GITLAB_CLIENT_ID!,
			clientSecret: process.env.GITLAB_CLIENT_SECRET!,
			issuer: process.env.GITLAB_ISSUER || 'https://gitlab.com'
		}
	},
	session: {
		cookieCache: {
			enabled: true,
			maxAge: 7 * 24 * 60 * 60,
			strategy: 'jwe'
		}
	},
	account: {
		storeStateStrategy: 'cookie',
		storeAccountCookie: true
	},
	plugins: [sveltekitCookies(getRequestEvent)]
});
