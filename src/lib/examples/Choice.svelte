<script lang="ts" generics="TValues, TValue">
    import type { Form, Field } from '$lib/index.js';
    import { cx } from './cx.js';
    import type { Choice } from '$lib/examples/utils.js';
    import {getPrefixId} from "$lib/PrefixIdContext.js";

    interface Props {
        expanded?: boolean;
        form: Form<TValues, string>;
        field: Field<TValues, TValue>;
        choices: readonly Choice<TValue>[];
        class?: string | null;
    }

    let { expanded = false, form, field, choices, class: className = null }: Props = $props();

    function onSelectInput(event: Event) {
        const target = event.target as HTMLSelectElement;
        const key = target.value;
        const choice = choices.find((choice) => choice.key == key);

        if (choice != null) {
            form.dispatch(form.actions().changeValue(choice.value, field));
        }
    }

    function onCheckboxInput(event: Event) {
        const target = event.target as HTMLInputElement;
        const key = target.value;
        const choice = choices.find((choice) => choice.key == key);

        if (choice != null) {
            form.dispatch(form.actions().changeValue(choice.value, field));
        }
    }

    function onBlur() {
        form.dispatch(form.actions().blur(field));
    }

    function onFocus() {
        form.dispatch(form.actions().focus(field));
    }

    let v = $derived(form.runes().fieldValue$(field));
    let nbSubmits = $derived(form.runes().nbSubmits$);
    let isAlreadyBlur = $derived(form.runes().isAlreadyBlur$(field));
    let hasFieldErrors = $derived(form.runes().hasFieldErrors$(field));
    let id = $derived(`${getPrefixId()}-${field.getKey()}`);
    let choice = $derived(choices.find((choice) => choice.value == v));
</script>

{#if expanded == false}
    <select
        {id}
        class={cx('form-select', className)}
        class:is-invalid={(nbSubmits > 0 || isAlreadyBlur) && hasFieldErrors}
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
    <div class:is-invalid={(nbSubmits > 0 || isAlreadyBlur) && hasFieldErrors}>
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
