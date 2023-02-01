import { json, type RequestHandler } from '@sveltejs/kit';

export const POST = (async ({ request }) => {
    const values = await request.json();

    await new Promise((resolve) => setTimeout(resolve, 1000));

    return json({
        status: 'success',
        message: JSON.stringify(values),
    });
}) satisfies RequestHandler;
