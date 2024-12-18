<script lang="ts" generics="TValues">
    import type { Form } from '$lib/index.js';
    import { fade } from 'svelte/transition';

    interface Props {
        form: Form<TValues, string>;
    }

    let { form }: Props = $props();

    let nbSubmits = $derived(form.runes().nbSubmits$);
    let hasRootErrors = $derived(form.runes().hasRootErrors$);
    let hasSubmitErrors = $derived(form.runes().hasSubmitErrors$);
    let rootErrors = $derived(form.runes().rootErrors$);
    let submitErrors = $derived(form.runes().submitErrors$);
</script>

{#if nbSubmits > 0 && (hasRootErrors || hasSubmitErrors)}
    <div class="alert alert-danger" in:fade|global>
        {rootErrors}
        {submitErrors}
    </div>
{/if}
