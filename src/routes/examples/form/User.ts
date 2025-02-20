import trim from 'lodash/trim.js';
import defaultTo from 'lodash/defaultTo.js';
import {Form, createRoot, createListItem, createProperties, createDebouncedValidator} from '$lib/index.js';
import type {Field, FormState, TypeToFields} from '$lib/index.js';
import * as address from './Address.js';
import type {Choice} from '$lib/examples/utils.js';

type Gender = 'm' | 'f';
export const genderChoices: Choice<Gender>[] = [
    {value: 'f', key: 'f', label: 'female'},
    {value: 'm', key: 'm', label: 'male'},
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

export function createForm(initialValues: Partial<User> = empty): [Form<User, string>, Fields<User>] {
    const fields = createFields<User>(createRoot<User>());
    const form = new Form<User, string>({initialValues: {...empty, ...initialValues}});

    const {addFieldError, addFieldAsyncError, clearFieldAsyncError} = form.actions();

    form.addAsyncValidator(
        createDebouncedValidator(form, fields.username, 500, async () => {
            await delay(1000);
            return (state: FormState<User, string>) => {
                state = clearFieldAsyncError(fields.username)(state);
                const username = fields.username.getValue(state.values);
                if (username === 'maarekj') {
                    state = addFieldAsyncError(fields.username, 'Username already existed.')(state);
                }

                return state;
            };
        }, (error: unknown) => {
            return typeof error === 'string' ? error : "Unknown error";
        }),
    );

    form.addValidator((state) => {
        if (trim(defaultTo(state.values.lastname, '')) == '') {
            state = addFieldError(fields.lastname, 'Ne doit pas être vide.')(state);
        }

        if (trim(defaultTo(state.values.firstname, '')) == '') {
            state = addFieldError(fields.firstname, 'Ne doit pas être vide.')(state);
        }

        if (trim(defaultTo(state.values.username, '')) == '') {
            state = addFieldError(fields.username, 'Ne doit pas être vide.')(state);
        }

        const age = defaultTo(state.values.age, null);
        if (age == null) {
            state = addFieldError(fields.age, 'Ne doit pas être vide.')(state);
        } else if (age < 18) {
            state = addFieldError(fields.age, 'Vous devez être majeur.')(state);
        }

        state = state.values.addresses.reduce((state, _value, index) => {
            return address.validate(form, fields.addresses.item(index), state);
        }, state);

        if (state.values.addresses.length == 0) {
            state = addFieldError(fields.addresses.self, 'Vous devez avoir au moins une adresse.')(state);
        }

        return state;
    });

    return [form, fields];
}
