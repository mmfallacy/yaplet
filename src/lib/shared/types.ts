import {
	CommentSchema,
	ManifestEntrySchema,
	ManifestSchema,
	MarkdownResponseSchema,
	PostSchema,
	ThreadSchema,
	UserSchema
} from '$lib/shared/schema';
import { z } from 'zod';

export type MarkdownResponse = z.infer<typeof MarkdownResponseSchema>;

export type Post = z.infer<typeof PostSchema>;

export type Thread = z.infer<typeof ThreadSchema>;

export type Manifest = z.infer<typeof ManifestSchema>;
export type ManifestEntry = z.infer<typeof ManifestEntrySchema>;

export type UserSchema = z.infer<typeof UserSchema>;

export type Comment = z.infer<typeof CommentSchema>;

export type Result<T, E extends Error> =
	| {
			ok: true;
			value: T;
	  }
	| {
			ok: false;
			error: E;
	  };
