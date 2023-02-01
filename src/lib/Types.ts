import type { Merge } from 'type-fest';

export type MetaField<E> = Readonly<{
    focus: boolean;
    dirty: boolean;
    alreadyBlur: boolean;
    errors: E[];
    asyncErrors: E[];
    asyncValidating: number;
}>;

export type MetaFields<E> = Readonly<Record<string, MetaField<E>>>;

export type FormState<V, E> = Readonly<{
    fields: MetaFields<E>;
    rootErrors: E[];
    submitErrors: E[];
    submitSuccess: boolean;
    submitting: boolean;
    nbSubmits: number;
    initialValues: V;
    values: V;
}>;

export interface Field<Values, Value> {
    getKey: () => string;
    setValue: (value: Value, values: Values) => Values;
    getValue: (values: Values) => Value;
}

export type ReadonlyListener<V, E> = (state: FormState<V, E>) => void;
export type Action<V, E> = (state: FormState<V, E>) => FormState<V, E>;
export type FieldAction<V, E> = (field: Field<V, unknown>, state: FormState<V, E>) => FormState<V, E>;

export type WithSelfField<TFormValues, Type> = { self: Field<TFormValues, Type> };
export type ApplyFields<TFormValues, Type, Fields extends keyof Type> = {
    [Property in Fields]: Field<TFormValues, Type[Property]>;
};

export type TypeToFields<TFormValues, T, TFields extends keyof T = keyof T, TExtra extends object = object> = Merge<
    Merge<WithSelfField<TFormValues, T>, ApplyFields<TFormValues, T, TFields>>,
    TExtra
>;
