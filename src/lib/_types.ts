import {
	CommentSchema,
	ManifestSchema,
	MarkdownResponseSchema,
	PostSchema,
	ThreadSchema,
	UserSchema
} from './schema';
import { z } from 'zod';

export type MarkdownResponse = z.infer<typeof MarkdownResponseSchema>;

export type Post = z.infer<typeof PostSchema>;

export type Thread = z.infer<typeof ThreadSchema>;

export type Manifest = z.infer<typeof ManifestSchema>;

export type UserSchema = z.infer<typeof UserSchema>;

export type Comment = z.infer<typeof CommentSchema>;
