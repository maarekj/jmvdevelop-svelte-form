<script lang="ts" generics="TValues, TValue">
    import type { Snippet } from 'svelte';

    import { type Form, type Field, FormRunes, FieldRunes } from '$lib/index.js';
    import range from 'lodash/range.js';
    import FieldErrors from './FieldErrors.svelte';

    interface Props {
        label: string;
        form: Form<TValues, string>;
        field: Field<TValues, TValue[]>;
        empty: TValue;
        itemClass?: string;
        removeBtnClass?: string;
        placeholder?: Snippet;
        item?: Snippet<[{ index: number; onRemoveClick: (event: MouseEvent) => void }]>;
    }

    let {
        label,
        form,
        field,
        empty,
        itemClass = 'flex-fill',
        removeBtnClass = 'btn btn-light align-self-end',
        placeholder,
        item,
    }: Props = $props();

    const runes = new FormRunes(() => form);
    const fieldRunes = new FieldRunes(
        () => form,
        () => field,
    );

    let list = $derived(fieldRunes.value);
    let count = $derived(list.length);

    function onAddClick(event: Event) {
        event.preventDefault();
        form.dispatch(form.actions().listPushItem(empty, field));
    }

    function onRemoveClick(index: number) {
        return (event: Event) => {
            event.preventDefault();
            form.dispatch(form.actions().listRemoveIndex(index, field));
        };
    }
</script>

<div class="modal position-static d-block">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">{label}</h5>
            </div>
            <div class="modal-body">
                {#if count == 0}
                    {@render placeholder?.()}
                {:else}
                    <div
                        class="form"
                        class:is-invalid={(runes.nbSubmits > 0 || fieldRunes.isAlreadyBlur) && fieldRunes.hasErrors}
                    >
                        {#each range(0, count) as index (index)}
                            {@const removeClick = onRemoveClick(index)}
                            <div class="d-flex gap-2">
                                <div class={itemClass}>
                                    {@render item?.({ index, onRemoveClick: removeClick })}
                                </div>
                                <button class={removeBtnClass} onclick={removeClick}>- Delete</button>
                            </div>
                        {/each}
                    </div>
                {/if}
                <FieldErrors {form} {field} />
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" onclick={onAddClick}>+ Add</button>
            </div>
        </div>
    </div>
</div>

<style>
    .form {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }
</style>
