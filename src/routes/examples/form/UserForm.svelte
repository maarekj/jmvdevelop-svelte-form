<script lang="ts">
    import nuidg from 'locally-unique-id-generator';
    import InputInt from '$lib/components/InputInt.svelte';
    import InputText from '$lib/components/InputText.svelte';
    import Row from '$lib/components/Row.svelte';
    import { type User, createForm, genderChoices } from './User';
    import * as address from './Address';
    import AddressForm from './AddressForm.svelte';
    import FormErrors from '$lib/components/FormErrors.svelte';
    import SubmitButton from '$lib/components/SubmitButton.svelte';
    import HtmlForm from '$lib/components/HtmlForm.svelte';
    import type Form from '$lib/Form';
    import Collection from '$lib/components/Collection.svelte';
    import Choice, { optionalChoices } from '$lib/components/Choice.svelte';
    import InputRequiredText from '$lib/components/InputRequiredText.svelte';

    export let values: User;

    const [form, fields] = createForm(nuidg(), values);

    export let onSubmit: (form: Form<User, string>) => Promise<unknown> = async () => {};

    const formValues = form.stores().formValues();
    $: values = $formValues;
</script>

<div class="modal position-static d-block">
    <div class="modal-dialog">
        <HtmlForm {form} class="modal-content" {onSubmit}>
            <div class="modal-header">
                <h5 class="modal-title">User</h5>
            </div>
            <div class="modal-body">
                <div class="form">
                    <Row {form} field={fields.lastname} label="Lastname" let:field>
                        <InputText {form} {field} />
                    </Row>
                    <Row {form} field={fields.firstname} label="Firstname" let:field>
                        <InputText {form} {field} />
                    </Row>
                    <Row {form} field={fields.username} label="Username" let:field>
                        <InputText {form} {field} />
                    </Row>
                    <Row {form} field={fields.age} label="Age" let:field>
                        <InputInt {form} {field} />
                    </Row>
                    <Row {form} field={fields.gender} label="Gender" let:field>
                        <Choice {form} {field} choices={optionalChoices(genderChoices, 'Not defined')} expanded />
                    </Row>
                    <Collection {form} field={fields.tags.self} empty={''} label="Tags">
                        <div slot="placeholder">Not yet tags.</div>
                        <svelte:fragment slot="item" let:index>
                            <Row {form} field={fields.tags.item(index)} label="Tag {index}" let:field>
                                <InputRequiredText {form} {field} />
                            </Row>
                        </svelte:fragment>
                    </Collection>

                    <Collection
                        {form}
                        field={fields.addresses.self}
                        empty={address.empty}
                        label="Addresses"
                        removeBtnClass="btn btn-light align-self-center"
                    >
                        <div slot="placeholder">Not yet address.</div>
                        <svelte:fragment slot="item" let:index>
                            <AddressForm {form} fields={fields.addresses.item(index)} label="Address {index}" />
                        </svelte:fragment>
                    </Collection>

                    <FormErrors {form} />
                </div>
            </div>

            <div class="modal-footer">
                <SubmitButton {form} />
            </div>
        </HtmlForm>
    </div>
</div>

<style>
    .form {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }
</style>
