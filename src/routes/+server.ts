import generateListenbrainzBody from '$lib/helpers/generateListenbrainzBody';
import requestIsValid from '$lib/helpers/requestIsValid';
import statusCheck from '$lib/helpers/statusCheck';
import userIsValid from '$lib/helpers/userIsValid';
import type Params from '$lib/typing/params';
import type Payload from '$lib/typing/payload';
import type { RequestHandler } from './$types';
import { redirect } from '@sveltejs/kit';

// Redirect root POST requests to /webhook endpoint
export const POST: RequestHandler = async () => {
	throw redirect(307, '/webhook');
};
