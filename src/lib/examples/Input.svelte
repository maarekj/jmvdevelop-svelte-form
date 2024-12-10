<script lang="ts" generics="TValues, TValue">
    import { preventDefault } from 'svelte/legacy';

    import type { Form, Field } from '$lib/index.js';
    import { cx } from './cx.js';
    import defaultTo from 'lodash/defaultTo.js';

    interface Props {
        type?: string;
        form: Form<TValues, string>;
        field: Field<TValues, TValue>;
        toText: (value: TValue) => string | null | undefined;
        fromText: (string: string) => TValue;
        class?: string | null;
    }

    let { type = 'text', form, field, toText, fromText, class: className = null }: Props = $props();

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

    let v = $derived(form.stores().fieldValue(field));
    let nbSubmits = $derived(form.stores().nbSubmits());
    let isAlreadyBlur = $derived(form.stores().isAlreadyBlur(field));
    let hasAnyErrors = $derived(form.stores().hasFieldAnyErrors(field));
    let id = $derived(form.getFieldId(field));
    let valueText = $derived(defaultTo(toText($v), ''));
</script>

<input
    {id}
    {type}
    class={cx('form-control', className)}
    class:is-invalid={($nbSubmits > 0 || $isAlreadyBlur) && $hasAnyErrors}
    value={valueText}
    onfocus={preventDefault(onFocus)}
    onblur={preventDefault(onBlur)}
    oninput={onInput}
/>
