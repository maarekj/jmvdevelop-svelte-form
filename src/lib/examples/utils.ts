export type Choice<TValue> = {
    value: TValue;
    key: string;
    label: string;
};

export function optionalChoices<TValue>(
    choices: readonly Choice<TValue>[],
    placeholder = '',
    placeholderKey = '__placeholder__',
): readonly Choice<TValue | null>[] {
    return [{ value: null, key: placeholderKey, label: placeholder }, ...choices];
}
