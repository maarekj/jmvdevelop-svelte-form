<script lang="ts">
    import type { Form } from '$lib/index.js';
    import type { PageData } from './$types.js';
    import type { User } from './form/User.js';
    import UserForm from './form/UserForm.svelte';
    import * as z from 'zod';

    interface Props {
        data: PageData;
    }

    let { data }: Props = $props();

    let successMessage: string | null = $state(null);

    async function onSubmit(form: Form<User, string>) {
        const response = await fetch('/examples/form', {
            method: 'POST',
            body: JSON.stringify(form.getState().values),
            headers: { 'content-type': 'application/json' },
        });

        const json = z
            .object({
                status: z.string(),
                message: z.string(),
            })
            .parse(await response.json());

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
