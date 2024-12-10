import { json, type RequestHandler } from '@sveltejs/kit';
import * as z from 'zod';

const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
type Literal = z.infer<typeof literalSchema>;
type Json = Literal | { [key: string]: Json } | Json[];
const zJson: z.ZodType<Json> = z.lazy(() => z.union([literalSchema, z.array(zJson), z.record(zJson)]));

export const POST = (async ({ request }) => {
    const values = zJson.parse(await request.json());

    await new Promise((resolve) => setTimeout(resolve, 1000));

    return json({
        status: 'success',
        message: JSON.stringify(values),
    });
}) satisfies RequestHandler;
