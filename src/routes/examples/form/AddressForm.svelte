<script lang="ts" generics="TValues">
    import type { Form } from '$lib/index.js';
    import { type Fields, countryChoices } from './Address.js';
    import FieldErrors from '$lib/examples/FieldErrors.svelte';
    import InputRequiredText from '$lib/examples/InputRequiredText.svelte';
    import InputText from '$lib/examples/InputText.svelte';
    import Row from '$lib/examples/Row.svelte';
    import Choice from '$lib/examples/Choice.svelte';
    import { optionalChoices } from '$lib/examples/utils.js';

    interface Props {
        form: Form<TValues, string>;
        fields: Fields<TValues>;
        label: string;
    }

    let { form, fields, label }: Props = $props();
</script>

<div class="modal position-static d-block">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">{label}</h5>
            </div>
            <div class="modal-body">
                <div class="form">
                    <Row {form} field={fields.street} label="Street">
                        {#snippet children({ field })}
                            <InputRequiredText {form} {field} />
                        {/snippet}
                    </Row>
                    <Row {form} field={fields.city} label="City">
                        {#snippet children({ field })}
                            <InputRequiredText {form} {field} />
                        {/snippet}
                    </Row>
                    <Row {form} field={fields.country} label="Country">
                        {#snippet children({ field })}
                            <Choice {form} {field} choices={optionalChoices(countryChoices)} />
                        {/snippet}
                    </Row>
                    <Row {form} field={fields.zipcode} label="Zipcode">
                        {#snippet children({ field })}
                            <InputText {form} {field} />
                        {/snippet}
                    </Row>

                    <FieldErrors {form} field={fields.self} />
                </div>
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
