<script lang="ts" generics="TValues">
    import { type Form, formHasErrors } from '$lib/index.js';

    interface Props {
        class?: string;
        form: Form<TValues, string>;
        onSubmit?: (form: Form<TValues, string>) => Promise<unknown>;
        children?: import('svelte').Snippet;
    }

    let { class: className = 'btn btn-primary', form, onSubmit = async () => {}, children }: Props = $props();

    const actions = form.actions();

    async function innerOnSubmit(event: Event) {
        event.preventDefault();
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

<form class={className} onsubmit={innerOnSubmit}>
    {@render children?.()}
</form>
