<script lang="ts">
    import {setPrefixId} from "./PrefixIdContext.js";
    import type {Snippet} from 'svelte';
    import {getIncrContext} from "$lib/IncrContext.js";

    let {prefixId, children}: { prefixId?: string | null | undefined; children: Snippet<[string]> } =
        $props();

    let incContext = getIncrContext();
    let effectivePrefixId = $derived(prefixId ?? `form-${incContext.incr()}`)

    setPrefixId(() => effectivePrefixId);
</script>

{@render children(effectivePrefixId)}
