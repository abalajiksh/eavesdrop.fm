import generateListenbrainzBody from '$lib/helpers/generateListenbrainzBody';
import requestIsValid from '$lib/helpers/requestIsValid';
import statusCheck from '$lib/helpers/statusCheck';
import userIsValid from '$lib/helpers/userIsValid';
import type Params from '$lib/typing/params';
import type Payload from '$lib/typing/payload';
import type { RequestHandler } from './$types';

// ListenBrainz API base url.
const LB_BASE_URL = 'https://api.listenbrainz.org/1';

// Simple health check endpoint
export const GET: RequestHandler = async () => {
	return new Response(
		JSON.stringify({
			status: 'ok',
			service: 'eavesdrop.fm webhook endpoint',
			version: '2.0.0',
			message: 'Webhook endpoint is ready'
		}),
		{
			status: 200,
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*'
			}
		}
	);
};

export const POST: RequestHandler = async ({ request, url }) => {
	const startTime = Date.now();
	
	try {
		console.log('========== New Webhook Request ==========');
		console.log('Request URL:', url.toString());
		console.log('Request headers:', Object.fromEntries(request.headers));
		
		// Parse the multipart form data from Plex webhook
		const formData = await request.formData();
		const payloadString = formData.get('payload');
		
		if (!payloadString || typeof payloadString !== 'string') {
			console.error('❌ Invalid payload: missing or not a string');
			return new Response(JSON.stringify({ error: 'Invalid payload' }), { 
				status: 400,
				headers: { 
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*'
				}
			});
		}

		const body: Payload = JSON.parse(payloadString);
		console.log('📩 Received webhook event:', body.event);
		console.log('🎵 Track:', body.Metadata?.title, 'by', body.Metadata?.grandparentTitle || body.Metadata?.originalTitle);
		console.log('👤 Plex user:', body.Account?.title);

		const params: Params = {
			token: url.searchParams.get('token') ?? '',
			ignore: url.searchParams.get('ignore') ?? '',
			userName: url.searchParams.get('user') ?? ''
		};

		console.log('🔑 Token received:', params.token ? `${params.token.substring(0, 8)}...` : 'NONE');
		console.log('👤 Username from URL:', params.userName);

		if (!requestIsValid(body, params)) {
			console.log('⚠️  Request validation failed');
			console.log('  - Event type:', body.event);
			console.log('  - Metadata type:', body.Metadata?.type);
			console.log('  - Plex username:', body.Account?.title);
			console.log('  - Expected username:', params.userName);
			return new Response(JSON.stringify({ status: 'ignored', reason: 'validation_failed' }), { 
				status: 200,
				headers: { 
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*'
				}
			});
		}

		console.log('✅ Request validation passed');

		// Await the async user validation
		console.log('🔐 Validating ListenBrainz token...');
		const isValidUser = await userIsValid(params, LB_BASE_URL);
		if (!isValidUser) {
			console.error('❌ User validation failed - token may be invalid or user mismatch');
			return new Response(JSON.stringify({ status: 'error', reason: 'invalid_token' }), { 
				status: 200,
				headers: { 
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*'
				}
			});
		}

		console.log('✅ User validation passed');
		console.log('📤 Submitting listen to ListenBrainz...');

		try {
			const listenBody = generateListenbrainzBody(body);
			console.log('📋 ListenBrainz payload:', listenBody);

			const lbResponse = await fetch(`${LB_BASE_URL}/submit-listens`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Token ${params.token}`
				},
				body: listenBody
			});

			const statusCode = lbResponse.status;
			const responseText = await lbResponse.text();
			
			console.log('📥 ListenBrainz response status:', statusCode);
			console.log('📥 ListenBrainz response:', responseText);

			if (!lbResponse.ok) {
				console.error('❌ ListenBrainz API returned error:', statusCode, responseText);
				return new Response(JSON.stringify({ 
					status: 'error', 
					reason: 'listenbrainz_api_error',
					details: responseText
				}), { 
					status: 200,
					headers: { 
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': '*'
					}
				});
			}

			const result = JSON.parse(responseText);
			console.log('✅ Successfully submitted to ListenBrainz:', result);
		} catch (e) {
			console.error('❌ Failed to submit to ListenBrainz:', e);
			return new Response(JSON.stringify({ 
				status: 'error', 
				reason: 'submission_failed',
				error: String(e)
			}), { 
				status: 200,
				headers: { 
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*'
				}
			});
		}

		const duration = Date.now() - startTime;
		console.log(`⏱️  Total processing time: ${duration}ms`);
		console.log('========================================');

		return new Response(JSON.stringify({ 
			status: 'success',
			message: 'Listen submitted successfully',
			processing_time_ms: duration
		}), { 
			status: 200,
			headers: { 
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*'
			}
		});
	} catch (e) {
		console.error('❌ Webhook handler error:', e);
		console.error('Stack trace:', e instanceof Error ? e.stack : 'N/A');
		return new Response(JSON.stringify({ 
			status: 'error', 
			reason: 'internal_error',
			error: String(e)
		}), { 
			status: 500,
			headers: { 
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*'
			}
		});
	}
};
