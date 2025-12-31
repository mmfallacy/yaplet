import { invalidateCache } from '$lib/server/github';
import { WEBHOOK_SECRET } from '$env/static/private';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createHmac } from 'crypto';

function verifySignature(payload: string, signature: string | null): boolean {
	if (!signature || !WEBHOOK_SECRET) {
		return false;
	}

	const expectedSignature = createHmac('sha256', WEBHOOK_SECRET).update(payload).digest('hex');

	return signature === expectedSignature || signature === `sha256=${expectedSignature}`;
}

export const POST: RequestHandler = async ({ request }) => {
	const signature = request.headers.get('x-hub-signature-256');
	const body = await request.text();

	if (!verifySignature(body, signature)) {
		return json({ error: 'Invalid signature' }, { status: 401 });
	}

	try {
		const payload = JSON.parse(body);

		if (payload.ref) {
			invalidateCache();
			return json({ success: true, message: 'Cache cleared' });
		}

		return json({ success: false, error: 'No ref in payload' }, { status: 400 });
	} catch (error) {
		return json(
			{ error: error instanceof Error ? error.message : 'Invalid payload' },
			{ status: 400 }
		);
	}
};
