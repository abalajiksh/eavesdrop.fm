import generateListenbrainzBody from '$lib/helpers/generateListenbrainzBody';
import requestIsValid from '$lib/helpers/requestIsValid';
import statusCheck from '$lib/helpers/statusCheck';
import userIsValid from '$lib/helpers/userIsValid';
import type Params from '$lib/typing/params';
import type Payload from '$lib/typing/payload';
import type { RequestHandler } from './$types';

// ListenBrainz API base url.
const LB_BASE_URL = 'https://api.listenbrainz.org/1';

export const POST: RequestHandler = async ({ request, url }) => {
	try {
		// Parse the multipart form data from Plex webhook
		const formData = await request.formData();
		const payloadString = formData.get('payload');
		
		if (!payloadString || typeof payloadString !== 'string') {
			console.error('Invalid payload: missing or not a string');
			return new Response(JSON.stringify({ error: 'Invalid payload' }), { 
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const body: Payload = JSON.parse(payloadString);
		console.log('Received webhook event:', body.event, 'for track:', body.Metadata?.title);

		const params: Params = {
			token: url.searchParams.get('token') ?? '',
			ignore: url.searchParams.get('ignore') ?? '',
			userName: url.searchParams.get('user') ?? ''
		};

		if (!requestIsValid(body, params)) {
			console.log('Request validation failed');
			return new Response(null, { status: 200 });
		}

		// Await the async user validation
		const isValidUser = await userIsValid(params, LB_BASE_URL);
		if (!isValidUser) {
			console.error('User validation failed for token');
			return new Response(null, { status: 200 });
		}

		console.log('Submitting listen to ListenBrainz...');

		try {
			const listenBody = generateListenbrainzBody(body);
			console.log('ListenBrainz payload:', listenBody);

			const lbResponse = await fetch(`${LB_BASE_URL}/submit-listens`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Token ${params.token}`
				},
				body: listenBody
			});

			await statusCheck(lbResponse);
			const result = await lbResponse.json();
			console.log('ListenBrainz response:', result);
		} catch (e) {
			console.error('Failed to submit to ListenBrainz:', e);
			return new Response(null, { status: 200 });
		}

		// Track analytics (optional, fails silently)
		const plausiblePayload = {
			name: 'listen',
			url: 'https://eavesdrop.fm/listen',
			domain: 'eavesdrop.fm'
		};

		try {
			await fetch(`https://plausible.io/api/event`, {
				method: 'POST',
				headers: {
					'user-agent': (request.headers.get('user-agent') ?? '') + (body.Player?.uuid ?? ''),
					'X-Forwarded-For': body.Player?.publicAddress ?? '0.0.0.0',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(plausiblePayload)
			}).then(statusCheck);
		} catch (e) {
			// Analytics failure is non-critical
			console.log('Analytics tracking failed (non-critical):', e);
		}

		return new Response(JSON.stringify({ success: true }), { 
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (e) {
		console.error('Webhook handler error:', e);
		return new Response(JSON.stringify({ error: 'Internal server error' }), { 
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
