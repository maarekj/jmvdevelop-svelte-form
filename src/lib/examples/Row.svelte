<script lang="ts" generics="TValues, TValue extends unknown">
    import type {Form, Field} from '$lib/index.js';
    import {fade} from 'svelte/transition';
    import FieldErrors from './FieldErrors.svelte';
    import type {Snippet} from 'svelte';
    import {getPrefixId} from "$lib/PrefixIdContext.js";

    interface Props {
        form: Form<TValues, string>;
        field: Field<TValues, TValue>;
        label: string;
        id?: string;
        class?: string | null;
        children?: Snippet<[{ field: Field<TValues, TValue> }]>;
    }

    let {form, field, label, class: className = null, children}: Props = $props();

    let id = $derived(`${getPrefixId()}-${field.getKey()}`);

    let isAsyncValidating = $derived(form.runes().isAsyncValidating$(field));
</script>

<div class={className}>
    <label class={'form-label'} for={id}> {label}</label>
    {@render children?.({field})}
    {#if isAsyncValidating}
        <div in:fade|global class="invalid-feedback d-block text-warning-emphasis">validating...</div>
    {/if}
    <FieldErrors {form} {field} />
</div>
