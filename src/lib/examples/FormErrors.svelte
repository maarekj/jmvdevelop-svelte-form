<script lang="ts" generics="TValues">
    import type { Form } from '$lib/index.js';
    import { fade } from 'svelte/transition';

    interface Props {
        form: Form<TValues, string>;
    }

    let { form }: Props = $props();

    let nbSubmits = $derived(form.stores().nbSubmits());
    let hasRootErrors = $derived(form.stores().hasRootErrors());
    let hasSubmitErrors = $derived(form.stores().hasSubmitErrors());
    let rootErrors = $derived(form.stores().rootErrors());
    let submitErrors = $derived(form.stores().submitErrors());
</script>

{#if $nbSubmits > 0 && ($hasRootErrors || $hasSubmitErrors)}
    <div class="alert alert-danger" in:fade|global>
        {$rootErrors}
        {$submitErrors}
    </div>
{/if}
