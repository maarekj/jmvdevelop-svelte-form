import type { PageServerLoad } from './$types';
import { empty, type User } from './form/User';

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
