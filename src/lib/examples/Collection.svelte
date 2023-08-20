<script lang="ts">
    import type { Form, Field } from '$lib';
    import range from 'lodash/range';
    import FieldErrors from './FieldErrors.svelte';

    type TValues = $$Generic;
    type TValue = $$Generic;

    export let label: string;
    export let form: Form<TValues, string>;
    export let field: Field<TValues, TValue[]>;
    export let empty: TValue;

    export let itemClass = 'flex-fill';
    export let removeBtnClass = 'btn btn-light align-self-end';

    $: nbSubmits = form.stores().nbSubmits();
    $: isAlreadyBlur = form.stores().isAlreadyBlur(field);
    $: hasFieldErrors = form.stores().hasFieldErrors(field);
    $: list = form.stores().fieldValue(field);
    $: count = $list.length;

    function onAddClick() {
        form.dispatch(form.actions().listPushItem(empty, field));
    }

    function onRemoveClick(index: number) {
        return (_event: MouseEvent) => {
            form.dispatch(form.actions().listRemoveItem(index, field));
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
                    <slot name="placeholder" />
                {:else}
                    <div class="form" class:is-invalid={($nbSubmits > 0 || $isAlreadyBlur) && $hasFieldErrors}>
                        {#each range(0, count) as index (index)}
                            {@const removeClick = onRemoveClick(index)}
                            <div class="d-flex gap-2">
                                <div class={itemClass}>
                                    <slot name="item" {index} onRemoveClick={removeClick} />
                                </div>
                                <button class={removeBtnClass} on:click|preventDefault={removeClick}>- Delete</button>
                            </div>
                        {/each}
                    </div>
                {/if}
                <FieldErrors {form} {field} />
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" on:click|preventDefault={onAddClick}>+ Add</button>
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
