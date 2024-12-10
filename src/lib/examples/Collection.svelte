<script lang="ts" generics="TValues, TValue">
    import { preventDefault } from 'svelte/legacy';
    import type { Snippet } from 'svelte';

    import type { Form, Field } from '$lib/index.js';
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

    let nbSubmits = $derived(form.stores().nbSubmits());
    let isAlreadyBlur = $derived(form.stores().isAlreadyBlur(field));
    let hasFieldErrors = $derived(form.stores().hasFieldErrors(field));
    let list = $derived(form.stores().fieldValue(field));
    let count = $derived($list.length);

    function onAddClick() {
        form.dispatch(form.actions().listPushItem(empty, field));
    }

    function onRemoveClick(index: number) {
        return (_event: Event) => {
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
                    <div class="form" class:is-invalid={($nbSubmits > 0 || $isAlreadyBlur) && $hasFieldErrors}>
                        {#each range(0, count) as index (index)}
                            {@const removeClick = onRemoveClick(index)}
                            <div class="d-flex gap-2">
                                <div class={itemClass}>
                                    {@render item?.({ index, onRemoveClick: removeClick })}
                                </div>
                                <button class={removeBtnClass} onclick={preventDefault(removeClick)}>- Delete</button>
                            </div>
                        {/each}
                    </div>
                {/if}
                <FieldErrors {form} {field} />
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" onclick={preventDefault(onAddClick)}>+ Add</button>
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
