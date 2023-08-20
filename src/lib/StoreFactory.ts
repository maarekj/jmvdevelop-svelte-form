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
    isBlur,
    hasFocus,
    isDirty,
    isAlreadyBlur,
    hasErrors,
    getErrors,
    hasAnyErrors,
    hasAsyncErrors,
    getAsyncErrors,
    isAsyncValidating,
    formIsAsyncValidating,
} from './selectors';
import type { Form } from './Form';
import { readable, type Readable } from 'svelte/store';
import type { Field, FormState } from './Types';

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
                return isDirty(state, field.getKey());
            } else {
                return formIsDirty(state);
            }
        });
    }

    isAlreadyBlur<Value>(field: Field<Values, Value> | undefined = undefined): Readable<boolean> {
        return this.custom((state) => {
            if (field !== undefined) {
                return isAlreadyBlur(state, field.getKey());
            } else {
                return formIsAlreadyBlur(state);
            }
        });
    }

    hasFocus<Value>(field: Field<Values, Value>): Readable<boolean> {
        return this.custom((state) => hasFocus(state, field.getKey()));
    }

    isBlur<Value>(field: Field<Values, Value>): Readable<boolean> {
        return this.custom((state) => isBlur(state, field.getKey()));
    }

    isAsyncValidating<Value>(field: Field<Values, Value> | undefined = undefined): Readable<boolean> {
        return this.custom((state) => {
            if (field !== undefined) {
                return isAsyncValidating(state, field.getKey());
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
                return hasErrors(state, field.getKey());
            } else {
                return formHasFieldErrors(state);
            }
        });
    }

    fieldErrors<Value>(field: Field<Values, Value>): Readable<E[]> {
        return this.custom((state) => {
            return getErrors(state, field.getKey());
        });
    }

    hasFieldAnyErrors<Value>(field: Field<Values, Value>): Readable<boolean> {
        return this.custom((state) => hasAnyErrors(state, field.getKey()));
    }

    hasFieldAsyncErrors<Value>(field: Field<Values, Value>): Readable<boolean> {
        return this.custom((state) => hasAsyncErrors(state, field.getKey()));
    }

    fieldAsyncErrors<Value>(field: Field<Values, Value>): Readable<E[]> {
        return this.custom((state) => getAsyncErrors(state, field.getKey()));
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
