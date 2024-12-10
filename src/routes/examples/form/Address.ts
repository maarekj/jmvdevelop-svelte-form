import trim from 'lodash/trim.js';
import defaultTo from 'lodash/defaultTo.js';
import { type Form, type Field, type FormState, type TypeToFields, createProperties } from '$lib/index.js';
import type { Choice } from '$lib/examples/utils.js';

type Country = 'fr' | 'us' | 'gb' | 'ci' | 'tg' | 'il';

export const countryChoices: readonly Choice<Country>[] = [
    { value: 'fr', key: 'fr', label: 'France' },
    { value: 'us', key: 'us', label: 'États-unis' },
    { value: 'gb', key: 'gb', label: 'Grande-bretagne' },
    { value: 'ci', key: 'ci', label: "Côte-d'Ivoire" },
    { value: 'tg', key: 'tg', label: 'Togo' },
    { value: 'il', key: 'il', label: 'Israël' },
];

export type Address = {
    street: string;
    country: Country | null;
    city: string;
    zipcode: string | null;
};

export type Fields<TFormValues> = TypeToFields<TFormValues, Address>;

export const empty: Address = { street: '', country: null, city: '', zipcode: null };

export function createFields<TValues>(self: Field<TValues, Address>): Fields<TValues> {
    return {
        self: self,
        ...createProperties(self, ['street', 'country', 'city', 'zipcode'] as const),
    };
}

export function validate<TValues>(
    form: Form<TValues, string>,
    fields: Fields<TValues>,
    state: FormState<TValues, string>,
) {
    const values = fields.self.getValue(state.values);

    if (trim(defaultTo(values.street, '')) == '') {
        state = form.actions().addFieldError(fields.street, 'Ne doit pas être vide.')(state);
    }

    if (trim(defaultTo(values.city, '')) == '') {
        state = form.actions().addFieldError(fields.city, 'Ne doit pas être vide.')(state);
    }

    if (values.country == null) {
        state = form.actions().addFieldError(fields.country, 'Ne doit pas être vide.')(state);
    } else if (values.country == 'fr') {
        state = form.actions().addFieldError(fields.country, 'Impossible de selectionner la France.')(state);
    }

    return state;
}
