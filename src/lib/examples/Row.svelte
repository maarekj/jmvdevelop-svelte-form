<script lang="ts" generics="TValues, TValue extends unknown">
    import { type Form, type Field } from '$lib/index.js';
    import { fade } from 'svelte/transition';
    import FieldErrors from './FieldErrors.svelte';
    import type { Snippet } from 'svelte';
    import { getPrefixId } from '$lib/PrefixIdContext.js';
    import { FieldRunes } from '$lib/FieldRunes.svelte.js';

    interface Props {
        form: Form<TValues, string>;
        field: Field<TValues, TValue>;
        label: string;
        id?: string | null;
        class?: string | null;
        children?: Snippet<[{ field: Field<TValues, TValue> }]>;
    }

    let { form, field, label, class: className = null, id: propId = null, children }: Props = $props();

    let id = $derived(propId != null ? propId : `${getPrefixId()}-${field.getKey()}`);

    const fieldRunes = new FieldRunes(
        () => form,
        () => field,
    );
</script>

<div class={className}>
    <label class="form-label" for={id}> {label}</label>
    {@render children?.({ field })}
    {#if fieldRunes.isAsyncValidating}
        <div in:fade|global class="invalid-feedback d-block text-warning-emphasis">validating...</div>
    {/if}
    <FieldErrors {form} {field} />
</div>
