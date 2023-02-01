<script lang="ts">
    import type Form from '$lib/Form';
    import type { PageData } from './$types';
    import type { User } from './form/User';
    import UserForm from './form/UserForm.svelte';

    export let data: PageData;

    let successMessage: string | null = null;

    async function onSubmit(form: Form<User, string>) {
        const response = await fetch('/examples/form', {
            method: 'POST',
            body: JSON.stringify(form.getState().values),
            headers: { 'content-type': 'application/json' },
        });
        const json = await response.json();
        if (json?.status === 'success') {
            successMessage = json.message;
        }
    }
</script>

<div class="container">
    {#if successMessage != null}
        <div class="alert alert-success mt-5"><code>{successMessage}</code></div>
    {:else}
        <UserForm values={data.initialValues} {onSubmit} />
    {/if}
</div>
