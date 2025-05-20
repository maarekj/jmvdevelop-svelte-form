<script lang="ts">
    import type { Snippet } from 'svelte';
    import { IncrHolder, setIncrHolder } from '$lib/index.js';

    let { children }: { children: Snippet<[IncrHolder]> } = $props();

    let instance = new IncrHolder();
    setIncrHolder(instance);
</script>

{@render children(instance)}
