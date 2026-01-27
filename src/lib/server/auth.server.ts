import { betterAuth, type BetterAuthOptions } from 'better-auth';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';
import { Env } from '$lib/env';
import { customSession } from 'better-auth/plugins';

const {
	GITHUB_CLIENT_SECRET,
	GITLAB_CLIENT_SECRET,
	GITLAB_CLIENT_ID,
	GITHUB_CLIENT_ID,
	GITLAB_ISSUER
} = Env;

const options = {
	socialProviders: {
		github: {
			clientId: GITHUB_CLIENT_ID,
			clientSecret: GITHUB_CLIENT_SECRET,
			async mapProfileToUser(profile) {
				return {
					username: profile.login
				};
			},
			overrideUserInfoOnSignIn: true
		},
		gitlab: {
			clientId: GITLAB_CLIENT_ID,
			clientSecret: GITLAB_CLIENT_SECRET,
			issuer: GITLAB_ISSUER || 'https://gitlab.com',
			async mapProfileToUser(profile) {
				return {
					username: profile.username
				};
			}
		}
	},
	plugins: [sveltekitCookies(getRequestEvent)],
	user: {
		additionalFields: {
			username: {
				type: 'string',
				required: true
			}
		}
	}
} satisfies BetterAuthOptions;

export const auth = betterAuth({
	...options,
	plugins: [
		...(options.plugins ?? []),
		customSession(async function ({ user, session }) {
			return {
				user,
				session
			};
		}, options)
	]
});
