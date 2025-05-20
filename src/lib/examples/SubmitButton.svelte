<script lang="ts" generics="TValues, TError extends unknown">
    import { type Form, FormRunes } from '$lib/index.js';

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

    const runes = new FormRunes(() => form);
</script>

<button type="submit" class={className} {onclick}>
    {runes.isSubmitting ? submittingText : text}
</button>
