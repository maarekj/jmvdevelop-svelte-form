<script lang="ts">
    import { type Form, formHasErrors } from '$lib';

    let className = 'btn btn-primary';
    export { className as class };

    type TValues = $$Generic;

    export let form: Form<TValues, string>;
    const actions = form.actions();

    export let onSubmit: (form: Form<TValues, string>) => Promise<unknown> = async () => {};

    async function innerOnSubmit(_event: SubmitEvent) {
        form.dispatch(actions.startSubmit);
        form.dispatch(actions.clearSubmitErrors);
        if (formHasErrors(form.getState())) {
            form.dispatch(actions.stopSubmit);
        } else {
            try {
                await onSubmit(form);
                form.dispatch(actions.submitSuccess);
                form.dispatch(actions.stopSubmit);
            } catch (error) {
                if (typeof error === 'string') {
                    form.dispatch(actions.addSubmitError(error));
                }
                form.dispatch(actions.stopSubmit);
            }
        }
    }
</script>

<form class={className} on:submit|preventDefault={innerOnSubmit}>
    <slot />
</form>
