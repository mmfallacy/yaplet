import { building } from '$app/environment';
import { env } from '$env/dynamic/private';
import assert from 'node:assert/strict';

export const GITHUB_CLIENT_ID = env.GITHUB_CLIENT_ID ?? '';
export const GITHUB_CLIENT_SECRET = env.GITHUB_CLIENT_SECRET ?? '';
export const GITLAB_CLIENT_ID = env.GITLAB_CLIENT_ID ?? '';
export const GITLAB_CLIENT_SECRET = env.GITLAB_CLIENT_SECRET ?? '';
export const GITLAB_ISSUER = env.GITLAB_ISSUER ?? 'https://gitlab.com';

export const GITHUB_PAT = env.GITHUB_PAT ?? '';
export const CONTENT_BASE_URL = env.CONTENT_BASE_URL ?? '';
export const CONTENT_REF = env.CONTENT_REF ?? '';

function isUndefined<T>(val: T | undefined) {
	return typeof val === 'undefined';
}

if (!building) {
	assert(!isUndefined(env.GITHUB_CLIENT_ID));
	assert(!isUndefined(env.GITHUB_CLIENT_SECRET));
	assert(!isUndefined(env.GITLAB_CLIENT_ID));
	assert(!isUndefined(env.GITLAB_CLIENT_SECRET));
	assert(!isUndefined(env.GITLAB_ISSUER));

	assert(!isUndefined(env.GITHUB_PAT));
	assert(!isUndefined(env.CONTENT_BASE_URL));
	assert(!isUndefined(env.CONTENT_REF));
}
