<script lang="ts" generics="TValues">
    import type { Form, Field } from '$lib/index.js';
    import parseInt from 'lodash/parseInt.js';
    import Input from './Input.svelte';

    function toText(value: number | null) {
        return value?.toString();
    }

    function fromText(str: string): number | null {
        const value = parseInt(str);
        return isNaN(value) ? null : value;
    }

    interface Props {
        type?: string;
        form: Form<TValues, string>;
        field: Field<TValues, number | null>;
        class?: string | null;
    }

    let { type = 'number', form, field, class: className = null }: Props = $props();
</script>

<Input {form} {field} {fromText} {toText} {type} class={className} />
