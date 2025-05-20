<script lang="ts" generics="TValues, TValue">
    import { type Form, type Field } from '$lib/index.js';
    import { cx } from './cx.js';
    import type { Choice } from '$lib/examples/utils.js';
    import { getPrefixId } from '$lib/PrefixIdContext.js';
    import { FormRunes } from '$lib/FormRunes.svelte.js';
    import { FieldRunes } from '$lib/FieldRunes.svelte.js';

    interface Props {
        expanded?: boolean;
        form: Form<TValues, string>;
        field: Field<TValues, TValue>;
        choices: readonly Choice<TValue>[];
        class?: string | null;
    }

    let { expanded = false, form, field, choices, class: className = null }: Props = $props();

    const runes = new FormRunes(() => form);
    const fieldRunes = new FieldRunes(
        () => form,
        () => field,
    );

    function onSelectInput(event: Event) {
        const target = event.target as HTMLSelectElement;
        const key = target.value;
        const choice = choices.find((choice) => choice.key == key);

        if (choice != null) {
            fieldRunes.changeValue(choice.value);
        }
    }

    function onCheckboxInput(event: Event) {
        const target = event.target as HTMLInputElement;
        const key = target.value;
        const choice = choices.find((choice) => choice.key == key);

        if (choice != null) {
            fieldRunes.changeValue(choice.value);
        }
    }

    function onBlur() {
        fieldRunes.blur();
    }

    function onFocus() {
        fieldRunes.focus();
    }

    let id = $derived(`${getPrefixId()}-${field.getKey()}`);
    let choice = $derived(choices.find((choice) => choice.value == fieldRunes.value));
</script>

{#if expanded == false}
    <select
        {id}
        class={cx('form-select', className)}
        class:is-invalid={(runes.nbSubmits > 0 || fieldRunes.isAlreadyBlur) && fieldRunes.hasErrors}
        value={choice?.key}
        onfocus={onFocus}
        onblur={onBlur}
        oninput={onSelectInput}
    >
        {#each choices as choice (choice.key)}
            <option value={choice.key}>{choice.label}</option>
        {/each}
    </select>
{:else}
    <div class:is-invalid={(runes.nbSubmits > 0 || fieldRunes.isAlreadyBlur) && fieldRunes.hasErrors}>
        {#each choices as c (c.key)}
            <div class="form-check">
                <input
                    class="form-check-input"
                    type="radio"
                    id="{id}.key-{c.key}"
                    name={id}
                    value={c.key}
                    checked={c.key == choice?.key}
                    oninput={onCheckboxInput}
                    onfocus={onFocus}
                    onblur={onBlur}
                />
                <label class="form-check-label" for="{id}.key-{c.key}">
                    {c.label}
                </label>
            </div>
        {/each}
    </div>
{/if}
