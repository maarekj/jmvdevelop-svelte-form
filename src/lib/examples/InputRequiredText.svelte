<script lang="ts" generics="TValues">
    import type { Form, Field } from '$lib/index.js';
    import Input from './Input.svelte';

    function toText(value: string) {
        return value;
    }

    function fromText(str: string) {
        return str;
    }

    interface Props {
        type?: string;
        form: Form<TValues, string>;
        field: Field<TValues, string>;
        class?: string | null;
    }

    let { type = 'text', form, field, class: className = null }: Props = $props();
</script>

<Input {form} {field} {fromText} {toText} {type} class={className} />
