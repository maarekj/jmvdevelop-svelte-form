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
    formIsAsyncValidating,
} from './selectors.js';
import type { Form } from './Form.js';
import type { Action, FormState } from './Types.js';
import { type MaybeGetter, extract } from 'runed';

export class FormRunes<Values, E> {
    readonly formState: FormState<Values, E>;
    readonly form: Form<Values, E>;
    readonly formValues: Values;
    readonly hasErrors: boolean;
    readonly isSubmitting: boolean;
    readonly nbSubmits: number;
    readonly isSubmitSuccess: boolean;
    readonly formInitialValues: Values;
    readonly hasRootErrors: boolean;
    readonly rootErrors: readonly E[];
    readonly hasSubmitErrors: boolean;
    readonly submitErrors: readonly E[];
    readonly isDirty: boolean;
    readonly isAlreadyBlur: boolean;
    readonly isAsyncValidating: boolean;
    readonly hasFieldErrors: boolean;

    constructor(formProp: MaybeGetter<Form<Values, E>>) {
        this.form = $derived(extract(formProp));

        let formState = $state.raw(extract(formProp).getState());
        this.formState = $derived(formState);
        this.formValues = $derived(formState.values);
        this.hasErrors = $derived(formHasErrors(formState));
        this.isSubmitting = $derived(isSubmitting(formState));
        this.nbSubmits = $derived(getNbSubmits(formState));
        this.isSubmitSuccess = $derived(isSubmitSuccess(formState));
        this.formInitialValues = $derived(formState.initialValues);
        this.hasRootErrors = $derived(formHasRootErrors(formState));
        this.rootErrors = $derived(formState.rootErrors);
        this.hasSubmitErrors = $derived(formHasSubmitErrors(formState));
        this.submitErrors = $derived(formState.submitErrors);
        this.isDirty = $derived(formIsDirty(formState));
        this.isAlreadyBlur = $derived(formIsAlreadyBlur(formState));
        this.isAsyncValidating = $derived(formIsAsyncValidating(formState));
        this.hasFieldErrors = $derived(formHasFieldErrors(formState));

        $effect(() => {
            const off = this.form.addReadonlyListener((state) => {
                formState = state;
            });

            return () => off();
        });
    }

    dispatch(action: Action<Values, E>) {
        this.form.dispatch(action);
    }
}
