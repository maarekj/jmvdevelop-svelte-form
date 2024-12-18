<script lang="ts">
    import type {Snippet} from 'svelte';
    import {IncrContext, setIncrContext} from "$lib/IncrContext.js";

    let {children}: { children: Snippet<[IncrContext]> } = $props();

    let instance = new IncrContext();
    setIncrContext(instance);
</script>

{@render children(instance)}
