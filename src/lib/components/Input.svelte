<script lang="ts">
    import type Form from '$lib/Form';
    import type { Field } from '$lib/Types';
    import cx from './cx';
    import defaultTo from 'lodash/defaultTo';

    export let type = 'text';

    type TValues = $$Generic;
    type TValue = $$Generic;

    export let form: Form<TValues, string>;
    export let field: Field<TValues, TValue>;

    export let toText: (value: TValue) => string | null | undefined;
    export let fromText: (string: string) => TValue;

    let className: string | null = null;
    export { className as class };

    function onInput(event: Event) {
        const target = event.target as HTMLInputElement;
        const v = defaultTo(target.value, '');
        form.dispatch(form.actions().changeValue(fromText(v), field));
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
    $: hasAnyErrors = form.stores().hasFieldAnyErrors(field);
    $: id = form.getFieldId(field);
    $: valueText = defaultTo(toText($v), '');
</script>

<input
    {id}
    {type}
    class={cx('form-control', className)}
    class:is-invalid={($nbSubmits > 0 || $isAlreadyBlur) && $hasAnyErrors}
    value={valueText}
    on:focus|preventDefault={onFocus}
    on:blur|preventDefault={onBlur}
    on:input={onInput}
/>
