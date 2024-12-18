<script lang="ts" generics="TValues, TValue">
    import type { Form, Field } from '$lib/index.js';
    import { cx } from './cx.js';
    import defaultTo from 'lodash/defaultTo.js';
    import {getPrefixId} from "$lib/PrefixIdContext.js";

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

    function onBlur(event: Event) {
        event.preventDefault();
        form.dispatch(form.actions().blur(field));
    }

    function onFocus(event: Event) {
        event.preventDefault();
        form.dispatch(form.actions().focus(field));
    }

    let v = $derived(form.runes().fieldValue$(field));
    let nbSubmits = $derived(form.runes().nbSubmits$);
    let isAlreadyBlur = $derived(form.runes().isAlreadyBlur$(field));
    let hasAnyErrors = $derived(form.runes().hasFieldAnyErrors$(field));
    let id = $derived(`${getPrefixId()}-${field.getKey()}`);
    let valueText = $derived(defaultTo(toText(v), ''));
</script>

<input
    {id}
    {type}
    class={cx('form-control', className)}
    class:is-invalid={(nbSubmits > 0 || isAlreadyBlur) && hasAnyErrors}
    value={valueText}
    onfocus={onFocus}
    onblur={onBlur}
    oninput={onInput}
/>
