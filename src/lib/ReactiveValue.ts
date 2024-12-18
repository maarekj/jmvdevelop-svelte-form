import {createSubscriber} from "svelte/reactivity";

export class ReactiveValue<T> {
    private readonly subscribe: () => void;

    constructor(private readonly fn: () => T, onsubscribe: (update: () => void) => (() => void) | void) {
        this.subscribe = createSubscriber(onsubscribe);
    }

    get current() {
        this.subscribe();
        return this.fn();
    }
}