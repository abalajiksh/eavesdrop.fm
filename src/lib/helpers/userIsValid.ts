import type Params from '$lib/typing/params';
import statusCheck from './statusCheck';

const userIsValid = async (params: Params, baseUrl: string): Promise<boolean> => {
	try {
		// check with ListenBrainz that the provided token is valid
		const response = await fetch(`${baseUrl}/validate-token`, {
			headers: {
				Authorization: `Token ${params.token}`
			}
		});

		await statusCheck(response);
		const data = await response.json();

		if (data.valid && data.user_name) {
			// Optionally verify the username matches
			if (params.userName && data.user_name.toLowerCase() !== params.userName.toLowerCase()) {
				console.error('Username mismatch:', data.user_name, 'vs', params.userName);
				return false;
			}
			return true;
		}

		console.error('Invalid token response:', data);
		return false;
	} catch (e) {
		console.error('Token validation error:', e);
		return false;
	}
};

export default userIsValid;
