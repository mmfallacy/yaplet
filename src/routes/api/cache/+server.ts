import { getCacheStats } from '$lib/server/github';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => json(getCacheStats(), { status: 200 });
