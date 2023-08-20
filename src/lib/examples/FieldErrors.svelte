<script lang="ts">
    import type { Form, Field } from '$lib';
    import { fade } from 'svelte/transition';

    type TValues = $$Generic;
    type TValue = $$Generic<unknown>;

    export let form: Form<TValues, string>;
    export let field: Field<TValues, TValue>;

    $: nbSubmits = form.stores().nbSubmits();
    $: isAlreadyBlur = form.stores().isAlreadyBlur(field);
    $: fieldErrors = form.stores().fieldErrors(field);
    $: fieldAsyncErrors = form.stores().fieldAsyncErrors(field);
</script>

{#if ($nbSubmits > 0 || $isAlreadyBlur) && $fieldErrors.length != 0}
    <div class="d-block invalid-feedback" in:fade>
        {$fieldErrors}
    </div>
{/if}
{#if $fieldAsyncErrors.length != 0}
    <div class="d-block invalid-feedback" in:fade>
        {$fieldAsyncErrors}
    </div>
{/if}
