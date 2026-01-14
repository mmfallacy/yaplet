import z from 'zod';

export const GhContentResponseSchema = z.object({
	name: z.string(),
	path: z.string(),
	sha: z.string(),
	size: z.int(),
	type: z.literal('file'),
	content: z.string(),
	encoding: z.literal('base64')
});

export type GhContentResponse = z.infer<typeof GhContentResponseSchema>;
