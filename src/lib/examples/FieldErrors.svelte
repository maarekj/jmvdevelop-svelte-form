<script lang="ts" generics="TValues, TValue = unknown">
    import type { Form, Field } from '$lib/index.js';
    import { fade } from 'svelte/transition';

    interface Props {
        form: Form<TValues, string>;
        field: Field<TValues, TValue>;
    }

    let { form, field }: Props = $props();

    let nbSubmits = $derived(form.runes().nbSubmits$);
    let isAlreadyBlur = $derived(form.runes().isAlreadyBlur$(field));
    let fieldErrors = $derived(form.runes().fieldErrors$(field));
    let fieldAsyncErrors = $derived(form.runes().fieldAsyncErrors$(field));
</script>

{#if (nbSubmits > 0 || isAlreadyBlur) && fieldErrors.length != 0}
    <div class="d-block invalid-feedback" in:fade|global>
        {fieldErrors}
    </div>
{/if}
{#if fieldAsyncErrors.length != 0}
    <div class="d-block invalid-feedback" in:fade|global>
        {fieldAsyncErrors}
    </div>
{/if}
