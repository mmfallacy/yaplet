import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { dev } from '$app/environment';

import pkg from '$lib/../../package.json' with { type: 'json' };

export const GET: RequestHandler = async function () {
	try {
		return json({
			version: `${pkg.version}${dev ? '-dev' : ''}`
		});
	} catch (err) {
		console.error(err);
		return error(500, `Health check failed!`);
	}
};
