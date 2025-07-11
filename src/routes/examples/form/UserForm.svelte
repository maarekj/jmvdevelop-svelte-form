<script lang="ts">
    import { type Form, FormRunes } from '$lib/index.js';
    import InputInt from '$lib/examples/InputInt.svelte';
    import InputText from '$lib/examples/InputText.svelte';
    import Row from '$lib/examples/Row.svelte';
    import { type User, createForm, genderChoices } from './User.js';
    import * as address from './Address.js';
    import AddressForm from './AddressForm.svelte';
    import FormErrors from '$lib/examples/FormErrors.svelte';
    import SubmitButton from '$lib/examples/SubmitButton.svelte';
    import HtmlForm from '$lib/examples/HtmlForm.svelte';
    import Collection from '$lib/examples/Collection.svelte';
    import Choice from '$lib/examples/Choice.svelte';
    import { optionalChoices } from '$lib/examples/utils.js';
    import InputRequiredText from '$lib/examples/InputRequiredText.svelte';

    interface Props {
        initialValues: User;
        onSubmit?: (form: Form<User, string>) => Promise<unknown>;
    }

    let { initialValues, onSubmit = async () => {} }: Props = $props();

    let [form, fields] = createForm(initialValues);

    let hidden = $state(false);

    const runes = new FormRunes(() => form);
</script>

<pre>
    {JSON.stringify(runes.formValues)}
</pre>

<button class="btn btn-light" onclick={() => (hidden = !hidden)}>Toggle the form</button>

{#if !hidden}
    <div class="modal position-static d-block">
        <div class="modal-dialog">
            <HtmlForm {form} prefixId="user-form" class="modal-content" {onSubmit}>
                <div class="modal-header">
                    <h5 class="modal-title">User</h5>
                </div>
                <div class="modal-body">
                    <div class="form">
                        <Row {form} field={fields.lastname} label="Lastname">
                            {#snippet children({ field })}
                                <InputText {form} {field} />
                            {/snippet}
                        </Row>
                        <Row {form} field={fields.firstname} label="Firstname">
                            {#snippet children({ field })}
                                <InputText {form} {field} />
                            {/snippet}
                        </Row>
                        <Row {form} field={fields.username} label="Username">
                            {#snippet children({ field })}
                                <InputText {form} {field} />
                            {/snippet}
                        </Row>
                        <Row {form} field={fields.age} label="Age">
                            {#snippet children({ field })}
                                <InputInt {form} {field} />
                            {/snippet}
                        </Row>
                        <Row {form} field={fields.gender} label="Gender">
                            {#snippet children({ field })}
                                <Choice
                                    {form}
                                    {field}
                                    choices={optionalChoices(genderChoices, 'Not defined')}
                                    expanded
                                />
                            {/snippet}
                        </Row>
                        <Collection {form} field={fields.tags.self} empty="" label="Tags">
                            {#snippet placeholder()}
                                <div>Not yet tags.</div>
                            {/snippet}
                            {#snippet item({ index }: { index: number })}
                                <Row {form} field={fields.tags.item(index)} label="Tag {index}">
                                    {#snippet children({ field })}
                                        <InputRequiredText {form} {field} />
                                    {/snippet}
                                </Row>
                            {/snippet}
                        </Collection>

                        <Collection
                            {form}
                            field={fields.addresses.self}
                            empty={address.empty}
                            label="Addresses"
                            removeBtnClass="btn btn-light align-self-center"
                        >
                            {#snippet placeholder()}
                                <div>Not yet address.</div>
                            {/snippet}
                            {#snippet item({ index }: { index: number })}
                                <AddressForm {form} fields={fields.addresses.item(index)} label="Address {index}" />
                            {/snippet}
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
{/if}

<style>
    .form {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }
</style>
