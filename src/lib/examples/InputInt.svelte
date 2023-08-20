<script lang="ts">
    import type { Form, Field } from '$lib';
    import parseInt from 'lodash/parseInt';
    import Input from './Input.svelte';

    export let type = 'number';

    type TValues = $$Generic;
    type TValue = number | null;

    export let form: Form<TValues, string>;
    export let field: Field<TValues, TValue>;

    function toText(value: TValue) {
        return value?.toString();
    }

    function fromText(str: string): TValue {
        const value = parseInt(str);
        return isNaN(value) ? null : value;
    }

    let className: string | null = null;
    export { className as class };
</script>

<Input {form} {field} {fromText} {toText} {type} class={className} />
