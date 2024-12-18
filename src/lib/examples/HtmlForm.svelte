<script lang="ts" generics="TValues">
    import {type Form, formHasErrors} from '$lib/index.js';
    import PrefixIdContext from "$lib/PrefixIdContext.svelte";
    import type {Snippet} from "svelte";

    interface Props {
        class?: string;
        prefixId?: string | null | undefined;
        form: Form<TValues, string>;
        onSubmit?: (form: Form<TValues, string>) => Promise<unknown>;
        children?: Snippet<[string]>;
    }

    let {
        class:
            className = 'btn btn-primary',
        form,
        prefixId: formPrefixId,
        children: formChildren,
        onSubmit = async () => {
        },
    }: Props = $props();

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

<PrefixIdContext prefixId={formPrefixId}>
    {#snippet children(prefixId: string)}
        <form id={prefixId} class={className} onsubmit={innerOnSubmit}>
            {@render formChildren?.(prefixId)}
        </form>
    {/snippet}
</PrefixIdContext>