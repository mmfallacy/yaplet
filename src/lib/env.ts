import { env } from '$env/dynamic/private';
import { z } from 'zod';

const AuthEnvSchema = z.object({
	GITHUB_CLIENT_SECRET: z.string(),
	GITLAB_CLIENT_SECRET: z.string(),
	GITLAB_CLIENT_ID: z.string(),
	GITHUB_CLIENT_ID: z.string(),
	GITLAB_ISSUER: z.string()
});

const ContentEnvSchema = z.object({
	GITHUB_PAT: z.string(),
	CONTENT_BASE_URL: z.string(),
	CONTENT_REF: z.string()
});

export const Env = {
	...AuthEnvSchema.parse(env),
	...ContentEnvSchema.parse(env)
};
