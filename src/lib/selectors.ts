import reduce from 'lodash/reduce.js';
import type { FormState, MetaField, MetaFields } from './Types.js';

export const emptyField = {
    focus: false,
    dirty: false,
    alreadyBlur: false,
    errors: [],
    asyncErrors: [],
    asyncValidating: 0,
};

export function mapFields<V, E>(state: FormState<V, E>, f: (fields: MetaFields<E>) => MetaFields<E>): FormState<V, E> {
    const fields = f(state.fields);
    if (fields == state.fields) {
        return state;
    }
    return { ...state, fields: fields };
}

export function mapField<V, E>(state: FormState<V, E>, f: (field: MetaField<E>) => MetaField<E>, key: string) {
    return mapFields(state, (fields) => {
        const field = fields[key] ?? emptyField;
        const newField = f(field);
        if (field == newField) {
            return fields;
        }

        return { ...fields, [key]: newField };
    });
}

export function getField<V, E>(state: FormState<V, E>, key: string): MetaField<E> {
    return state.fields[key] ?? emptyField;
}

export function fieldHasFocus<V, E>(state: FormState<V, E>, key: string): boolean {
    return getField(state, key).focus;
}

export function fieldIsBlur<V, E>(state: FormState<V, E>, key: string): boolean {
    return !getField(state, key).focus;
}

export function fieldIsAlreadyBlur<V, E>(state: FormState<V, E>, key: string): boolean {
    return getField(state, key).alreadyBlur;
}

export function fieldIsDirty<V, E>(state: FormState<V, E>, key: string): boolean {
    return getField(state, key).dirty;
}

export function fieldIsAsyncValidating<V, E>(state: FormState<V, E>, key: string): boolean {
    return Math.ceil(getField(state, key).asyncValidating) > 0;
}

export function formIsAsyncValidating<V, E>(state: FormState<V, E>): boolean {
    return reduce(
        state.fields,
        (acc, field) => {
            return acc || Math.ceil(field.asyncValidating) > 0;
        },
        false,
    );
}

export function fieldHasAsyncErrors<V, E>(state: FormState<V, E>, key: string): boolean {
    return getField(state, key).asyncErrors.length > 0;
}

export function getFieldAsyncErrors<V, E>(state: FormState<V, E>, key: string): E[] {
    return getField(state, key).asyncErrors;
}

export function fieldHasErrors<V, E>(state: FormState<V, E>, key: string): boolean {
    return getField(state, key).errors.length > 0;
}

export function getFieldErrors<V, E>(state: FormState<V, E>, key: string): E[] {
    return getField(state, key).errors;
}

export function fieldHasAnyErrors<V, E>(state: FormState<V, E>, key: string): boolean {
    return fieldHasAsyncErrors(state, key) || fieldHasErrors(state, key);
}

export function formIsDirty<V, E>(state: FormState<V, E>): boolean {
    return reduce(
        state.fields,
        (acc, field) => {
            return acc || field.dirty;
        },
        false,
    );
}

export function formIsAlreadyBlur<V, E>(state: FormState<V, E>): boolean {
    return reduce(
        state.fields,
        (acc, field) => {
            return acc || field.alreadyBlur;
        },
        false,
    );
}

export function formHasFieldErrors<V, E>(state: FormState<V, E>): boolean {
    return reduce(
        state.fields,
        (acc, field) => {
            return acc || field.errors.length > 0 || field.asyncErrors.length > 0;
        },
        false,
    );
}

export function formHasRootErrors<V, E>(state: FormState<V, E>): boolean {
    return state.rootErrors.length > 0;
}

export function formHasSubmitErrors<V, E>(state: FormState<V, E>): boolean {
    return state.submitErrors.length > 0;
}

export function formHasErrors<V, E>(state: FormState<V, E>): boolean {
    return formHasRootErrors(state) || formHasSubmitErrors(state) || formHasFieldErrors(state);
}

export function submitSuccess<V, E>(state: FormState<V, E>): FormState<V, E> {
    return state.submitSuccess === true ? state : { ...state, submitSuccess: true };
}

export function isSubmitSuccess<V, E>(state: FormState<V, E>): boolean {
    return state.submitSuccess;
}

export function isSubmitting<V, E>(state: FormState<V, E>): boolean {
    return state.submitting;
}

export function getNbSubmits<V, E>(state: FormState<V, E>): number {
    return state.nbSubmits;
}
