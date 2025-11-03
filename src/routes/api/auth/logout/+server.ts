import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async () => {
	return json(
		{
			success: true,
			message: 'Logged out successfully'
		},
		{
			status: 200,
			headers: {
				'Set-Cookie': 'token=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0'
			}
		}
	);
};
