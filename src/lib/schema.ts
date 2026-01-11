import { z } from 'zod';

export const MarkdownResponseSchema = z.object({
	data: z.record(z.string(), z.unknown()),
	content: z.string()
});

export const PostSchema = z.object({
	id: z.string(),
	content: z.string(),
	createdAt: z.date(),
	images: z.array(z.string()).optional(),
	footnotes: z.record(z.string(), z.string()),
	tags: z.array(z.string()).optional()
});

export const ThreadSchema = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string(),
	createdAt: z.date(),
	posts: z.array(PostSchema)
});

export const ManifestEntrySchema = z.discriminatedUnion('type', [
	z.object({
		type: z.literal('standalone'),
		id: z.string(),
		createdAt: z.string().datetime()
	}),
	z.object({
		type: z.literal('thread'),
		id: z.string(),
		createdAt: z.string().datetime(),
		posts: z.array(z.string())
	})
]);

export const ManifestSchema = z.array(ManifestEntrySchema);

export const UserSchema = z.object({
	id: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
	email: z.email(),
	emailVerified: z.boolean(),
	name: z.string(),
	image: z.union([z.string(), z.null(), z.undefined()]),
	username: z.string()
});

export const CommentSchema = z.object({
	id: z.string(),
	postId: PostSchema.shape.id,
	userId: UserSchema.shape.id,
	content: z.string(),
	createdAt: z.date()
});
