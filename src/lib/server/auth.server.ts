import { betterAuth } from 'better-auth';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';
import {
	GITHUB_CLIENT_SECRET,
	GITLAB_CLIENT_SECRET,
	GITLAB_CLIENT_ID,
	GITHUB_CLIENT_ID,
	GITLAB_ISSUER
} from '$env/static/private';

export const auth = betterAuth({
	socialProviders: {
		github: {
			clientId: GITHUB_CLIENT_ID,
			clientSecret: GITHUB_CLIENT_SECRET
		},
		gitlab: {
			clientId: GITLAB_CLIENT_ID,
			clientSecret: GITLAB_CLIENT_SECRET,
			issuer: GITLAB_ISSUER || 'https://gitlab.com'
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
