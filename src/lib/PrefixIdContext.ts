import { getContext, hasContext, setContext } from 'svelte';

const symbol = Symbol('jmvdevelop-svelte-form prefix-id context');

export function getPrefixId(): string {
    if (hasContext(symbol)) {
        return getContext<() => string>(symbol)();
    } else {
        throw new Error('PrefixIdContext must be used.');
    }
}

export function setPrefixId(prefixId: () => string) {
    setContext(symbol, prefixId);
}
