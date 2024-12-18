<script lang="ts">
    import {setPrefixId} from "./PrefixIdContext.js";
    import type {Snippet} from 'svelte';
    import {getIncrHolder} from "$lib/index.js";

    let {prefixId, children}: { prefixId?: string | null | undefined; children: Snippet<[string]> } =
        $props();

    let incContext = getIncrHolder();
    let effectivePrefixId = $derived(prefixId ?? `form-${incContext.incr()}`)

    setPrefixId(() => effectivePrefixId);
</script>

{@render children(effectivePrefixId)}
