<script lang="ts">
    import type { Form, Field } from '$lib';
    import Input from './Input.svelte';

    export let type = 'text';

    type TValues = $$Generic;
    type TValue = string;

    export let form: Form<TValues, string>;
    export let field: Field<TValues, TValue>;

    function toText(value: string) {
        return value;
    }

    function fromText(str: string) {
        return str;
    }

    let className: string | null = null;
    export { className as class };
</script>

<Input {form} {field} {fromText} {toText} {type} class={className} />
