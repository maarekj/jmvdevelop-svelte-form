<script lang="ts" context="module">
    export type Choice<TValue> = {
        value: TValue;
        key: string;
        label: string;
    };

    export function optionalChoices<TValue>(
        choices: Choice<TValue>[],
        placeholder = '',
        placeholderKey = '__placeholder__',
    ): Choice<TValue | null>[] {
        return [{ value: null, key: placeholderKey, label: placeholder }, ...choices];
    }
</script>

<script lang="ts">
    import type { Form, Field } from '$lib';
    import { cx } from './cx';

    type TValues = $$Generic;
    type TValue = $$Generic;

    export let expanded = false;
    export let form: Form<TValues, string>;
    export let field: Field<TValues, TValue>;

    export let choices: Choice<TValue>[];

    let className: string | null = null;
    export { className as class };

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

        console.log(key, choice);

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

    $: v = form.stores().fieldValue(field);
    $: nbSubmits = form.stores().nbSubmits();
    $: isAlreadyBlur = form.stores().isAlreadyBlur(field);
    $: hasFieldErrors = form.stores().hasFieldErrors(field);
    $: id = form.getFieldId(field);
    $: choice = choices.find((choice) => choice.value == $v);
</script>

{#if expanded == false}
    <select
        {id}
        class={cx('form-select', className)}
        class:is-invalid={($nbSubmits > 0 || $isAlreadyBlur) && $hasFieldErrors}
        value={choice?.key}
        on:focus={onFocus}
        on:blur={onBlur}
        on:input={onSelectInput}
    >
        {#each choices as choice (choice.key)}
            <option value={choice.key}>{choice.label}</option>
        {/each}
    </select>
{:else}
    <div class:is-invalid={($nbSubmits > 0 || $isAlreadyBlur) && $hasFieldErrors}>
        {#each choices as c (c.key)}
            <div class="form-check">
                <input
                    class="form-check-input"
                    type="radio"
                    id="{id}.key-{c.key}"
                    name={id}
                    value={c.key}
                    checked={c.key == choice?.key}
                    on:input={onCheckboxInput}
                    on:focus={onFocus}
                    on:blur={onBlur}
                />
                <label class="form-check-label" for="{id}.key-{c.key}">
                    {c.label}
                </label>
            </div>
        {/each}
    </div>
{/if}
