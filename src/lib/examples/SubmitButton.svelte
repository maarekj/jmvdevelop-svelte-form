<script lang="ts">
    import type { Form } from '$lib';
    let className = 'btn btn-primary';
    export { className as class };

    type TValues = $$Generic;
    type TError = $$Generic<unknown>;

    export let form: Form<TValues, TError>;

    export let submittingText = 'Loading...';
    export let text = 'Submit';

    $: isSubmitting = form.stores().isSubmitting();
</script>

<button type="submit" class={className} on:click>
    {$isSubmitting ? submittingText : text}
</button>
