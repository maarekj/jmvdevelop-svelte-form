import trim from 'lodash/trim';
import defaultTo from 'lodash/defaultTo';
import Form from '$lib/Form';
import { createRoot, createListItem, createProperties } from '$lib/Field';
import type { Field, FormState, TypeToFields } from '$lib/Types';
import * as address from './Address';
import type { Choice } from '$lib/components/Choice.svelte';
import { createDebouncedValidator } from '$lib/AsyncValidatorUtils';

type Gender = 'm' | 'f';
export const genderChoices: Choice<Gender>[] = [
    { value: 'f', key: 'f', label: 'female' },
    { value: 'm', key: 'm', label: 'male' },
];

export type User = {
    username: string | null;
    lastname: string | null;
    firstname: string | null;
    gender: Gender | null;
    age: number | null;
    tags: string[];
    addresses: address.Address[];
};

type Fields<TFormValues> = TypeToFields<
    TFormValues,
    User,
    keyof User,
    {
        tags: {
            self: Field<TFormValues, string[]>;
            item: (index: number) => Field<TFormValues, string>;
        };
        addresses: {
            self: Field<TFormValues, address.Address[]>;
            item: (index: number) => address.Fields<TFormValues>;
        };
    }
>;

export const empty: User = {
    username: null,
    lastname: null,
    firstname: null,
    gender: null,
    age: null,
    tags: [],
    addresses: [],
};

export function createFields<TValues>(self: Field<TValues, User>): Fields<TValues> {
    const properties = createProperties(self, [
        'username',
        'lastname',
        'firstname',
        'gender',
        'age',
        'tags',
        'addresses',
    ] as const);
    return {
        self,
        ...properties,
        tags: {
            self: properties.tags,
            item: (index: number) => createListItem(index, properties.tags, ''),
        },
        addresses: {
            self: properties.addresses,
            item: (index: number) => address.createFields(createListItem(index, properties.addresses, address.empty)),
        },
    };
}

function delay(timeout: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, timeout);
    });
}

export function createForm(id: string, initialValues: Partial<User> = empty): [Form<User, string>, Fields<User>] {
    const fields = createFields<User>(createRoot<User>());
    const form = new Form<User, string>({ initialValues: { ...empty, ...initialValues } }, id);

    const { addError, addAsyncError, clearFieldAsyncError } = form.actions();

    form.addAsyncValidator(
        createDebouncedValidator(form, fields.username, 500, async () => {
            await delay(1000);
            return (state: FormState<User, string>) => {
                state = clearFieldAsyncError(fields.username)(state);
                const username = fields.username.getValue(state.values);
                if (username === 'maarekj') {
                    state = addAsyncError(fields.username, 'Username already existed.')(state);
                }

                return state;
            };
        }),
    );

    form.addValidator((state) => {
        if (trim(defaultTo(state.values.lastname, '')) == '') {
            state = addError(fields.lastname, 'Ne doit pas être vide.')(state);
        }

        if (trim(defaultTo(state.values.firstname, '')) == '') {
            state = addError(fields.firstname, 'Ne doit pas être vide.')(state);
        }

        if (trim(defaultTo(state.values.username, '')) == '') {
            state = addError(fields.username, 'Ne doit pas être vide.')(state);
        }

        const age = defaultTo(state.values.age, null);
        if (age == null) {
            state = addError(fields.age, 'Ne doit pas être vide.')(state);
        } else if (age < 18) {
            state = addError(fields.age, 'Vous devez être majeur.')(state);
        }

        state = state.values.addresses.reduce((state, _value, index) => {
            return address.validate(form, fields.addresses.item(index), state);
        }, state);

        if (state.values.addresses.length == 0) {
            state = addError(fields.addresses.self, 'Vous devez avoir au moins une adresse.')(state);
        }

        return state;
    });

    return [form, fields];
}
