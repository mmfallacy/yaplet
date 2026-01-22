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
import { ServiceResultStatus as Status } from '$lib/shared/const';
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

type ServiceResultSuccess<T> = {
	status: typeof Status.SUCCESS;
} & Extract<Result<T, never>, { ok: true }>;

type ServiceResultError<E extends Error> = {
	status: typeof Status.ERROR;
} & Extract<Result<never, E>, { ok: false }>;

type ServiceResultNotModified<T> = {
	status: typeof Status.NOT_MODIFIED;
	// Temporarily add success-specific fields for incremental refactoring
} & Extract<Result<T, never>, { ok: true }>;

export type ServiceResult<T, E extends Error> =
	| ServiceResultSuccess<T>
	| ServiceResultError<E>
	| ServiceResultNotModified<T>;
