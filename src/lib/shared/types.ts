import {
	CommentSchema,
	FeedSchema,
	ManifestEntrySchema,
	ManifestSchema,
	MarkdownResponseSchema,
	PostSchema,
	ThreadSchema,
	ThreadWithPreviewSchema,
	UserSchema
} from '$lib/shared/schema';
import { z } from 'zod';

export type MarkdownResponse = z.infer<typeof MarkdownResponseSchema>;

export type Post = z.infer<typeof PostSchema>;

export type Thread = z.infer<typeof ThreadSchema>;
export type ThreadWithPreview = z.infer<typeof ThreadWithPreviewSchema>;

export type Manifest = z.infer<typeof ManifestSchema>;
export type ManifestEntry = z.infer<typeof ManifestEntrySchema>;

export type Feed = z.infer<typeof FeedSchema>;

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

export type ServiceResult<T, E extends Error> =
	| ({
			status: 'success';
	  } & Result<T, never>)
	| ({
			status: 'error';
	  } & Result<never, E>)
	| ({
			status: 'not_modified';
			// Temporarily add success-specific fields for incremental refactoring
	  } & Result<T, never>);
