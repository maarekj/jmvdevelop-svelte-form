<script lang="ts" generics="TValues">
    import type { Form, Field } from '$lib/index.js';
    import defaultTo from 'lodash/defaultTo.js';
    import Input from './Input.svelte';

    function toText(value: string | null): string {
        return defaultTo(value, '');
    }

    function fromText(str: string): string | null {
        return str;
    }

    interface Props {
        type?: string;
        form: Form<TValues, string>;
        field: Field<TValues, string | null>;
        class?: string | null;
    }

    let { type = 'text', form, field, class: className = null }: Props = $props();
</script>

<Input {form} {field} {fromText} {toText} {type} class={className} />
