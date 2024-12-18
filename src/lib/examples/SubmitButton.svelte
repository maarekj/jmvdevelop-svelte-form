<script lang="ts" generics="TValues, TError extends unknown">
    import type { Form } from '$lib/index.js';

    interface Props {
        class?: string;
        form: Form<TValues, TError>;
        submittingText?: string;
        text?: string;
        onclick?: HTMLButtonElement['onclick'];
    }

    let {
        class: className = 'btn btn-primary',
        form,
        submittingText = 'Loading...',
        text = 'Submit',
        onclick = undefined,
    }: Props = $props();

    let isSubmitting = $derived(form.runes().isSubmitting$);
</script>

<button type="submit" class={className} {onclick}>
    {isSubmitting ? submittingText : text}
</button>
