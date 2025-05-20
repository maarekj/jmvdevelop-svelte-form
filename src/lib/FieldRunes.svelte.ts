import {
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
} from './selectors.js';

import type { Field, FormState } from './Types.js';
import type { Form } from './Form.js';
import { type MaybeGetter, extract } from 'runed';

export class FieldRunes<Values, Value, E> {
    private readonly form: Form<Values, E>;
    readonly field: Field<Values, Value>;
    readonly key: string;

    #formState: FormState<Values, E>;
    readonly formValues: Values;
    readonly isDirty: boolean;
    readonly isAlreadyBlur: boolean;
    readonly hasFocus: boolean;
    readonly isBlur: boolean;
    readonly isAsyncValidating: boolean;
    readonly hasErrors: boolean;
    readonly errors: readonly E[];
    readonly hasAnyErrors: boolean;
    readonly hasAsyncErrors: boolean;
    readonly asyncErrors: readonly E[];

    constructor(
        readonly formProp: MaybeGetter<Form<Values, E>>,
        private readonly fieldProp: MaybeGetter<Field<Values, Value>>,
    ) {
        this.form = $derived(extract(formProp));
        this.field = $derived(extract(fieldProp));

        this.#formState = $state.raw(extract(formProp).getState());
        this.key = $derived(this.field.getKey());

        this.formValues = $derived(this.formState.values);
        this.isDirty = $derived(fieldIsDirty(this.formState, this.key));
        this.isAlreadyBlur = $derived(fieldIsAlreadyBlur(this.formState, this.key));
        this.hasFocus = $derived(fieldHasFocus(this.formState, this.key));
        this.isBlur = $derived(fieldIsBlur(this.formState, this.key));
        this.isAsyncValidating = $derived(fieldIsAsyncValidating(this.formState, this.key));
        this.hasErrors = $derived(fieldHasErrors(this.formState, this.key));
        this.errors = $derived(getFieldErrors(this.formState, this.key));
        this.hasAnyErrors = $derived(fieldHasAnyErrors(this.formState, this.key));
        this.hasAsyncErrors = $derived(fieldHasAsyncErrors(this.formState, this.key));
        this.asyncErrors = $derived(getFieldAsyncErrors(this.formState, this.key));

        $effect(() => {
            const off = this.form.addReadonlyListener((state) => {
                this.#formState = state;
            });

            return () => off();
        });
    }

    get formState() {
        return this.#formState;
    }

    get value() {
        const field = $derived(extract(this.fieldProp));

        return field.getValue(this.formValues);
    }

    set value(v: Value) {
        this.form.dispatch(this.form.actions().changeValue(v, this.field));
    }

    changeValue(v: Value) {
        this.value = v;
    }

    focus() {
        this.form.dispatch(this.form.actions().focus(this.field));
    }

    blur() {
        this.form.dispatch(this.form.actions().blur(this.field));
    }
}
