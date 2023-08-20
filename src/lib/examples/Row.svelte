<script lang="ts">
    import type { Form, Field } from '$lib';
    import { fade } from 'svelte/transition';
    import FieldErrors from './FieldErrors.svelte';

    type TValues = $$Generic;
    type TValue = $$Generic<unknown>;

    export let form: Form<TValues, string>;
    export let field: Field<TValues, TValue>;
    export let label: string;
    export let id: string = form.getFieldId(field);

    let className: string | null = null;
    export { className as class };

    $: isAsyncValidating = form.stores().isAsyncValidating(field);
</script>

<div class={className}>
    <label class={'form-label'} for={id}> {label} </label>
    <slot {field} />
    {#if $isAsyncValidating}
        <div in:fade class="invalid-feedback d-block text-warning-emphasis">validating...</div>
    {/if}
    <FieldErrors {form} {field} />
</div>
