<script lang="ts">
    import type Form from '$lib/Form';
    import { fade } from 'svelte/transition';

    type TValues = $$Generic;

    export let form: Form<TValues, string>;

    $: nbSubmits = form.stores().nbSubmits();
    $: hasRootErrors = form.stores().hasRootErrors();
    $: hasSubmitErrors = form.stores().hasSubmitErrors();
    $: rootErrors = form.stores().rootErrors();
    $: submitErrors = form.stores().submitErrors();
</script>

{#if $nbSubmits > 0 && ($hasRootErrors || $hasSubmitErrors)}
    <div class="alert alert-danger" in:fade>
        {$rootErrors}
        {$submitErrors}
    </div>
{/if}
