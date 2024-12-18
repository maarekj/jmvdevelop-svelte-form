import {
    formIsAlreadyBlur,
    formHasRootErrors,
    formHasFieldErrors,
    formHasSubmitErrors,
    formHasErrors,
    isSubmitting,
    isSubmitSuccess,
    getNbSubmits,
    formIsDirty,
    fieldIsBlur,
    fieldHasFocus,
    fieldIsDirty,
    fieldIsAlreadyBlur,
    fieldHasErrors,
    getFieldErrors,
    fieldHasAnyErrors,
    fieldHasAsyncErrors,
    getFieldAsyncErrors,
    fieldIsAsyncValidating,
    formIsAsyncValidating,
} from './selectors.js';
import type { Form } from './Form.js';
import { readable, type Readable } from 'svelte/store';
import type { Field, FormState } from './Types.js';

export class StoreFactory<Values, E> {
    constructor(private form: Form<Values, E>) {}

    custom<T>(callback: (state: FormState<Values, E>) => T): Readable<T> {
        let oldSelected = callback(this.form.getState());
        return readable(oldSelected, (set) => {
            return this.form.addReadonlyListener((state) => {
                const newSelected = callback(state);
                if (oldSelected != newSelected) {
                    oldSelected = newSelected;
                    set(newSelected);
                }
            });
        });
    }

    isDirty<Value>(field: Field<Values, Value> | undefined = undefined): Readable<boolean> {
        return this.custom((state) => {
            if (field !== undefined) {
                return fieldIsDirty(state, field.getKey());
            } else {
                return formIsDirty(state);
            }
        });
    }

    isAlreadyBlur<Value>(field: Field<Values, Value> | undefined = undefined): Readable<boolean> {
        return this.custom((state) => {
            if (field !== undefined) {
                return fieldIsAlreadyBlur(state, field.getKey());
            } else {
                return formIsAlreadyBlur(state);
            }
        });
    }

    fieldHasFocus<Value>(field: Field<Values, Value>): Readable<boolean> {
        return this.custom((state) => fieldHasFocus(state, field.getKey()));
    }

    fieldIsBlur<Value>(field: Field<Values, Value>): Readable<boolean> {
        return this.custom((state) => fieldIsBlur(state, field.getKey()));
    }

    isAsyncValidating<Value>(field: Field<Values, Value> | undefined = undefined): Readable<boolean> {
        return this.custom((state) => {
            if (field !== undefined) {
                return fieldIsAsyncValidating(state, field.getKey());
            } else {
                return formIsAsyncValidating(state);
            }
        });
    }

    hasRootErrors(): Readable<boolean> {
        return this.custom(formHasRootErrors);
    }

    rootErrors(): Readable<E[]> {
        return this.custom((state) => state.rootErrors);
    }

    hasSubmitErrors(): Readable<boolean> {
        return this.custom(formHasSubmitErrors);
    }

    submitErrors(): Readable<E[]> {
        return this.custom((state) => state.submitErrors);
    }

    hasFieldErrors<Value>(field: Field<Values, Value> | undefined = undefined): Readable<boolean> {
        return this.custom((state) => {
            if (field !== undefined) {
                return fieldHasErrors(state, field.getKey());
            } else {
                return formHasFieldErrors(state);
            }
        });
    }

    fieldErrors<Value>(field: Field<Values, Value>): Readable<E[]> {
        return this.custom((state) => {
            return getFieldErrors(state, field.getKey());
        });
    }

    hasFieldAnyErrors<Value>(field: Field<Values, Value>): Readable<boolean> {
        return this.custom((state) => fieldHasAnyErrors(state, field.getKey()));
    }

    hasFieldAsyncErrors<Value>(field: Field<Values, Value>): Readable<boolean> {
        return this.custom((state) => fieldHasAsyncErrors(state, field.getKey()));
    }

    fieldAsyncErrors<Value>(field: Field<Values, Value>): Readable<E[]> {
        return this.custom((state) => getFieldAsyncErrors(state, field.getKey()));
    }

    hasErrors(): Readable<boolean> {
        return this.custom(formHasErrors);
    }

    isSubmitting(): Readable<boolean> {
        return this.custom(isSubmitting);
    }

    nbSubmits(): Readable<number> {
        return this.custom(getNbSubmits);
    }

    isSubmitSuccess(): Readable<boolean> {
        return this.custom(isSubmitSuccess);
    }

    formValues(): Readable<Values> {
        return this.custom((state) => state.values);
    }

    formInitialValues(): Readable<Values> {
        return this.custom((state) => state.initialValues);
    }

    fieldValue<Value>(field: Field<Values, Value>): Readable<Value> {
        return this.custom((state) => {
            return field.getValue(state.values);
        });
    }
}
