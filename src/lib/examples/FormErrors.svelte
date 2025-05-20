<script lang="ts" generics="TValues">
    import { type Form, FormRunes } from '$lib/index.js';
    import { fade } from 'svelte/transition';

    interface Props {
        form: Form<TValues, string>;
    }

    let { form }: Props = $props();

    const runes = new FormRunes(() => form);
</script>

{#if runes.nbSubmits > 0 && (runes.hasRootErrors || runes.hasSubmitErrors)}
    <div class="alert alert-danger" in:fade|global>
        {runes.rootErrors}
        {runes.submitErrors}
    </div>
{/if}
