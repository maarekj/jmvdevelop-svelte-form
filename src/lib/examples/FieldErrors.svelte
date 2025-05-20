<script lang="ts" generics="TValues, TValue = unknown">
    import { type Form, type Field, FormRunes, FieldRunes } from '$lib/index.js';
    import { fade } from 'svelte/transition';

    interface Props {
        form: Form<TValues, string>;
        field: Field<TValues, TValue>;
    }

    let { form, field }: Props = $props();

    const runes = new FormRunes(() => form);
    const fieldRunes = new FieldRunes(
        () => form,
        () => field,
    );
</script>

{#if (runes.nbSubmits > 0 || fieldRunes.isAlreadyBlur) && fieldRunes.errors.length != 0}
    <div class="d-block invalid-feedback" in:fade|global>
        {fieldRunes.errors}
    </div>
{/if}
{#if fieldRunes.asyncErrors.length != 0}
    <div class="d-block invalid-feedback" in:fade|global>
        {fieldRunes.asyncErrors}
    </div>
{/if}
