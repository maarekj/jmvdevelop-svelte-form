<script lang="ts" generics="TValues, TValue">
    import { type Form, type Field, FormRunes } from '$lib/index.js';
    import { cx } from './cx.js';
    import defaultTo from 'lodash/defaultTo.js';
    import { getPrefixId } from '$lib/PrefixIdContext.js';
    import { FieldRunes } from '$lib/FieldRunes.svelte.js';

    interface Props {
        type?: string;
        form: Form<TValues, string>;
        field: Field<TValues, TValue>;
        toText: (value: TValue) => string | null | undefined;
        fromText: (string: string) => TValue;
        class?: string | null;
    }

    let { type = 'text', form, field, toText, fromText, class: className = null }: Props = $props();

    const runes = new FormRunes(() => form);
    const fieldRunes = new FieldRunes(
        () => form,
        () => field,
    );

    function onInput(event: Event) {
        const target = event.target as HTMLInputElement;
        const v = defaultTo(target.value, '');

        fieldRunes.changeValue(fromText(v));
    }

    function onBlur(event: Event) {
        event.preventDefault();
        fieldRunes.blur();
    }

    function onFocus(event: Event) {
        event.preventDefault();
        fieldRunes.focus();
    }
</script>

<input
    id={`${getPrefixId()}-${fieldRunes.key}`}
    {type}
    class={cx('form-control', className)}
    class:is-invalid={(runes.nbSubmits > 0 || fieldRunes.isAlreadyBlur) && fieldRunes.hasAnyErrors}
    value={defaultTo(toText(fieldRunes.value), '')}
    onfocus={onFocus}
    onblur={onBlur}
    oninput={onInput}
/>
