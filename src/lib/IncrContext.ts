import {getContext, hasContext, setContext} from 'svelte';

const symbol = Symbol('jmvdevelop-svelte-form inc context');

export class IncrContext {
    private currentValue: number = 0;

    constructor() {
    }

    incr() {
        this.currentValue++;
        return this.currentValue;
    }
}

export function getIncrContext(): IncrContext {
    if (hasContext(symbol)) {
        return getContext(symbol);
    } else {
        throw new Error("IncrContext must be used.");
    }
}

export function setIncrContext(instance: IncrContext) {
    setContext(symbol, instance);
}
