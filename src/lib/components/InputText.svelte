<script lang="ts">
    import type Form from '$lib/Form';
    import type { Field } from '$lib/Types';
    import defaultTo from 'lodash/defaultTo';
    import Input from './Input.svelte';

    export let type = 'text';

    type TValues = $$Generic;
    type TValue = string | null;

    export let form: Form<TValues, string>;
    export let field: Field<TValues, TValue>;

    function toText(value: TValue): string {
        return defaultTo(value, '');
    }

    function fromText(str: string): TValue {
        return str;
    }

    let className: string | null = null;
    export { className as class };
</script>

<Input {form} {field} {fromText} {toText} {type} class={className} />
