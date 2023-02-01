import type { Field, ApplyFields } from './Types';

export class RootField<TFormValues> implements Field<TFormValues, TFormValues> {
    getKey(): string {
        return `root`;
    }

    getValue(values: TFormValues): TFormValues {
        return values;
    }

    setValue(value: TFormValues, _values: TFormValues): TFormValues {
        return value;
    }
}

export function createRoot<TFormValues>(): Field<TFormValues, TFormValues> {
    return new RootField();
}

export class DefaultField<TFormValues, TValue> implements Field<TFormValues, NonNullable<TValue>> {
    constructor(private defaultValue: NonNullable<TValue>, private field: Field<TFormValues, TValue>) {}

    getKey(): string {
        return this.field.getKey();
    }
    getValue(values: TFormValues): NonNullable<TValue> {
        const value = this.field.getValue(values);
        return value == null ? this.defaultValue : value;
    }

    setValue(value: NonNullable<TValue>, values: TFormValues): TFormValues {
        return this.field.setValue(value, values);
    }
}

export function createDefault<TFormValues, TValue>(
    defaultValue: NonNullable<TValue>,
    field: Field<TFormValues, TValue>,
): Field<TFormValues, NonNullable<TValue>> {
    return new DefaultField(defaultValue, field);
}

export class PropertyField<TFormValues, TObject extends object, TProperty extends keyof TObject & string>
    implements Field<TFormValues, TObject[TProperty]>
{
    constructor(private self: Field<TFormValues, TObject>, private property: TProperty) {}

    getKey(): string {
        return `${this.self.getKey()}.${this.property}`;
    }

    getValue(values: TFormValues): TObject[TProperty] {
        return this.self.getValue(values)[this.property];
    }

    setValue(value: TObject[TProperty], values: TFormValues): TFormValues {
        let object = this.self.getValue(values);
        object = { ...object, [this.property]: value };

        return this.self.setValue(object, values);
    }
}

export function createProperty<TFormValues, TObject extends object, TProperty extends keyof TObject & string>(
    self: Field<TFormValues, TObject>,
    property: TProperty,
): Field<TFormValues, TObject[TProperty]> {
    return new PropertyField(self, property);
}

export class ListItemField<TFormValues, TListValue> implements Field<TFormValues, TListValue> {
    constructor(
        private self: Field<TFormValues, TListValue[]>,
        private index: number,
        private defaultItem: TListValue,
    ) {}

    getKey(): string {
        return `${this.self.getKey()}[${this.index}]`;
    }

    getValue(values: TFormValues): TListValue {
        const list = this.self.getValue(values);
        const item = list[this.index];
        return item == undefined ? this.defaultItem : item;
    }

    setValue(value: TListValue, values: TFormValues): TFormValues {
        const list = [...this.self.getValue(values)];
        list[this.index] = value;
        return this.self.setValue(list, values);
    }
}

export function createListItem<TFormValues, TListValue>(
    index: number,
    self: Field<TFormValues, TListValue[]>,
    defaultItem: TListValue,
): Field<TFormValues, TListValue> {
    return new ListItemField(self, index, defaultItem);
}

export function createProperties<TFormValues, TObject extends object, TProperties extends keyof TObject & string>(
    self: Field<TFormValues, TObject>,
    properties: readonly TProperties[],
): ApplyFields<TFormValues, TObject, TProperties> {
    const res: Partial<ApplyFields<TFormValues, TObject, TProperties>> = {};

    for (const property of properties) {
        res[property] = createProperty(self, property);
    }

    return res as ApplyFields<TFormValues, TObject, TProperties>;
}
