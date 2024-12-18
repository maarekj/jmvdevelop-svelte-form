import {getContext, hasContext, setContext} from 'svelte';

const symbol = Symbol('jmvdevelop-svelte-form inc context');

export class IncrHolder {
    private currentValue: number = 0;

    constructor() {
    }

    incr() {
        this.currentValue++;
        return this.currentValue;
    }
}

export function getIncrHolder(): IncrHolder {
    if (hasContext(symbol)) {
        return getContext(symbol);
    } else {
        throw new Error("IncrHolderContext must be used.");
    }
}

export function setIncrHolder(instance: IncrHolder) {
    setContext(symbol, instance);
}
