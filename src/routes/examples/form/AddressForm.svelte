<script lang="ts">
    import type Form from '$lib/Form';
    import { type Fields, countryChoices } from './Address';
    import FieldErrors from '$lib/components/FieldErrors.svelte';
    import InputRequiredText from '$lib/components//InputRequiredText.svelte';
    import InputText from '$lib/components//InputText.svelte';
    import Row from '$lib/components/Row.svelte';
    import Choice, { optionalChoices } from '$lib/components/Choice.svelte';

    type TValues = $$Generic;

    export let form: Form<TValues, string>;
    export let fields: Fields<TValues>;
    export let label: string;
</script>

<div class="modal position-static d-block">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">{label}</h5>
            </div>
            <div class="modal-body">
                <div class="form">
                    <Row {form} field={fields.street} label="Street" let:field>
                        <InputRequiredText {form} {field} />
                    </Row>
                    <Row {form} field={fields.city} label="City" let:field>
                        <InputRequiredText {form} {field} />
                    </Row>
                    <Row {form} field={fields.country} label="Country" let:field>
                        <Choice {form} {field} choices={optionalChoices(countryChoices)} />
                    </Row>
                    <Row {form} field={fields.zipcode} label="Zipcode" let:field>
                        <InputText {form} {field} />
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
