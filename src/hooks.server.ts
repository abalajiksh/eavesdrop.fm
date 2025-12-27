import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// Disable CSRF protection for webhook endpoint
	if (event.url.pathname === '/webhook') {
		// Skip CSRF check for webhook endpoint
		event.request.headers.delete('origin');
	}

	return await resolve(event);
};
