import type { PageServerLoad } from './$types.js';
import { empty, type User } from './form/User.js';

export const load = (() => {
    return {
        initialValues: {
            ...empty,
            lastname: 'Maarek',
            age: 32,
            username: 'maarekj',
        } satisfies User,
    };
}) satisfies PageServerLoad;
