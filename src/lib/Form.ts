import type {Field, MetaFields, FormState, ReadonlyListener, Action} from './Types.js';
import {StoreFactory} from './StoreFactory.js';
import {ActionFactory} from './ActionFactory.js';
import {RunesFactory} from './RunesFactory.svelte.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AsyncValidator<TValues> = (fields: Field<TValues, any>[]) => Promise<unknown>;

type OnChangeValueCallback<TValues, TError> = ((
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    keys: Field<TValues, any>[],
    prevState: FormState<TValues, TError>,
    currState: FormState<TValues, TError>,
) => FormState<TValues, TError>)

export class Form<TValues, TError> {
    private _runes: RunesFactory<TValues, TError> | null = null;
    private _stores: StoreFactory<TValues, TError> | null = null;
    private _actions: ActionFactory<TValues, TError> | null = null;
    private initialState: FormState<TValues, TError>;
    private state: FormState<TValues, TError>;
    private listeners: Action<TValues, TError>[];

    private validators: Action<TValues, TError>[];
    private asyncValidators: AsyncValidator<TValues>[];

    private onChangeValue: OnChangeValueCallback<TValues, TError>[];

    constructor(
        opts: {
            initialValues: TValues;
            fields?: MetaFields<TError>;
            rootErrors?: TError[];
            submitErrors?: TError[];
            submitSuccess?: boolean;
            submitting?: boolean;
            nbSubmits?: number;
        },
    ) {
        this.listeners = [];
        this.validators = [];
        this.asyncValidators = [];
        this.onChangeValue = [];
        this.initialState = {
            rootErrors: [],
            submitErrors: [],
            submitSuccess: false,
            nbSubmits: 0,
            submitting: false,
            values: opts.initialValues,
            fields: {},
            ...opts,
        };
        this.state = {...this.initialState};
    }

    removeValidator(validator: Action<TValues, TError>): void {
        this.validators = this.validators.filter((v) => {
            return v !== validator;
        });
    }

    addValidator(validator: Action<TValues, TError>): () => void {
        this.dispatch(validator);
        this.validators = [...this.validators, validator];

        return () => this.removeValidator(validator);
    }

    getValidators(): Action<TValues, TError>[] {
        return this.validators;
    }

    removeAsyncValidator(validator: AsyncValidator<TValues>): void {
        this.asyncValidators = this.asyncValidators.filter((v) => {
            return v !== validator;
        });
    }

    addAsyncValidator(validator: AsyncValidator<TValues>): () => void {
        this.asyncValidators = [...this.asyncValidators, validator];

        return () => this.removeAsyncValidator(validator);
    }

    getAsyncValidators(): AsyncValidator<TValues>[] {
        return this.asyncValidators;
    }

    getOnChangeValues(): ((
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        fields: Field<TValues, any>[],
        prevState: FormState<TValues, TError>,
        currState: FormState<TValues, TError>,
    ) => FormState<TValues, TError>)[] {
        return this.onChangeValue;
    }

    addOnChangeValues(callback: OnChangeValueCallback<TValues, TError>): () => void {
        this.onChangeValue = [...this.onChangeValue, callback];
        return () => this.removeOnChangeValues(callback);
    }

    removeOnChangeValues(callback: OnChangeValueCallback<TValues, TError>): void {
        this.onChangeValue = this.onChangeValue.filter((c) => {
            return c !== callback;
        })
    }

    removeListener(listener: Action<TValues, TError>): void {
        this.listeners = this.listeners.filter((l) => {
            return l !== listener;
        });
    }

    addReadonlyListener(listener: ReadonlyListener<TValues, TError>): () => void {
        const mutableListener: Action<TValues, TError> = (state) => {
            listener(state);
            return state;
        };
        return this.addMutableListener(mutableListener);
    }

    addMutableListener(listener: Action<TValues, TError>): () => void {
        this.listeners = [...this.listeners, listener];
        return () => this.removeListener(listener);
    }

    getInitialState() {
        return this.initialState;
    }

    getState() {
        return this.state;
    }

    dispatch(action: Action<TValues, TError>): void {
        this.state = action(this.state);

        for (const listener of this.listeners) {
            this.state = listener(this.state);
        }
    }

    actions(): ActionFactory<TValues, TError> {
        if (this._actions == null) {
            this._actions = new ActionFactory(this);
        }

        return this._actions;
    }

    stores(): StoreFactory<TValues, TError> {
        if (this._stores == null) {
            this._stores = new StoreFactory(this);
        }

        return this._stores;
    }

    runes(): RunesFactory<TValues, TError> {
        if (this._runes == null) {
            this._runes = new RunesFactory(this);
        }

        return this._runes;
    }
}
