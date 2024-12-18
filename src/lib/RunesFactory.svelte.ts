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
import type {Form} from './Form.js';
import type {Field, FormState} from './Types.js';
import {ReactiveValue} from './ReactiveValue.js';

export class RunesFactory<Values, E> {
    #formState: ReactiveValue<FormState<Values, E>>;

    constructor(private readonly form: Form<Values, E>) {
        this.#formState = new ReactiveValue(() => {
            return form.getState();
        }, (update) => {
            return this.form.addReadonlyListener(() => update());
        });
    }

    get formState$() {
        return this.#formState.current;
    }

    isDirty$<Value>(field: Field<Values, Value> | undefined = undefined): boolean {
        const v = $derived.by(() => {
            if (field !== undefined) {
                return fieldIsDirty(this.formState$, field.getKey());
            } else {
                return formIsDirty(this.formState$);
            }
        });

        return v;
    }

    isAlreadyBlur$<Value>(field: Field<Values, Value> | undefined = undefined): boolean {
        const v = $derived.by(() => {
            if (field !== undefined) {
                return fieldIsAlreadyBlur(this.formState$, field.getKey());
            } else {
                return formIsAlreadyBlur(this.formState$);
            }
        });

        return v;
    }

    fieldHasFocus$<Value>(field: Field<Values, Value>): boolean {
        const v = $derived(fieldHasFocus(this.formState$, field.getKey()));
        return v;
    }

    fieldIsBlur$<Value>(field: Field<Values, Value>): boolean {
        const v = $derived(fieldIsBlur(this.formState$, field.getKey()));
        return v;
    }

    isAsyncValidating$<Value>(field: Field<Values, Value> | undefined = undefined): boolean {
        const v = $derived.by(() => {
            if (field !== undefined) {
                return fieldIsAsyncValidating(this.formState$, field.getKey());
            } else {
                return formIsAsyncValidating(this.formState$);
            }
        });

        return v;
    }

    get hasRootErrors$(): boolean {
        const v = $derived(formHasRootErrors(this.formState$));
        return v;
    }

    get rootErrors$(): E[] {
        const v = $derived(this.formState$.rootErrors);
        return v;
    }

    get hasSubmitErrors$(): boolean {
        const v = $derived(formHasSubmitErrors(this.formState$));
        return v;
    }

    get submitErrors$(): E[] {
        const v = $derived(this.formState$.submitErrors);
        return v;
    }

    hasFieldErrors$<Value>(field: Field<Values, Value> | undefined = undefined): boolean {
        const v = $derived.by(() => {
            if (field !== undefined) {
                return fieldHasErrors(this.formState$, field.getKey());
            } else {
                return formHasFieldErrors(this.formState$);
            }
        });
        return v;
    }

    fieldErrors$<Value>(field: Field<Values, Value>): E[] {
        const v = $derived(getFieldErrors(this.formState$, field.getKey()));
        return v;
    }

    hasFieldAnyErrors$<Value>(field: Field<Values, Value>): boolean {
        const v = $derived(fieldHasAnyErrors(this.formState$, field.getKey()));
        return v;
    }

    hasFieldAsyncErrors$<Value>(field: Field<Values, Value>): boolean {
        const v = $derived(fieldHasAsyncErrors(this.formState$, field.getKey()));
        return v;
    }

    fieldAsyncErrors$<Value>(field: Field<Values, Value>): E[] {
        const v = $derived(getFieldAsyncErrors(this.formState$, field.getKey()));
        return v;
    }

    get hasErrors$(): boolean {
        const v = $derived(formHasErrors(this.formState$));
        return v;
    }

    get isSubmitting$(): boolean {
        const v = $derived(isSubmitting(this.formState$));
        return v;
    }

    get nbSubmits$(): number {
        const v = $derived(getNbSubmits(this.formState$));
        return v;
    }

    get isSubmitSuccess$(): boolean {
        const v = $derived(isSubmitSuccess(this.formState$));
        return v;
    }

    get formValues$(): Values {
        const v = $derived(this.formState$.values);

        return v;
    }

    get formInitialValues$(): Values {
        const v = $derived(this.formState$.initialValues);
        return v;
    }

    fieldValue$<Value>(field: Field<Values, Value>): Value {
        const v = $derived(field.getValue(this.formState$.values));
        return v;
    }
}
