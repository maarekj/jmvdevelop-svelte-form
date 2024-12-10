<script lang="ts" generics="TValues, TError extends unknown">
    import { createBubbler } from 'svelte/legacy';

    const bubble = createBubbler();
    import type { Form } from '$lib/index.js';

    interface Props {
        class?: string;
        form: Form<TValues, TError>;
        submittingText?: string;
        text?: string;
    }

    let {
        class: className = 'btn btn-primary',
        form,
        submittingText = 'Loading...',
        text = 'Submit',
    }: Props = $props();

    let isSubmitting = $derived(form.stores().isSubmitting());
</script>

<button type="submit" class={className} onclick={bubble('click')}>
    {$isSubmitting ? submittingText : text}
</button>
