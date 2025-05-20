import debounce from 'lodash/debounce.js';
import type { AsyncValidator } from './Form.js';
import type { Form } from './Form.js';
import type { Action, Field } from './Types.js';

export function createDebouncedValidator<TFormValues, TValue, TError>(
    form: Form<TFormValues, TError>,
    field: Field<TFormValues, TValue>,
    timeout: number,
    validator: (state: Field<TFormValues, TValue>) => Promise<Action<TFormValues, TError>>,
    unknownError: (err: unknown) => TError,
): AsyncValidator<TFormValues> {
    const fn = debounce(async () => {
        form.dispatch(form.actions().asyncValidateFieldStart(field));

        try {
            form.dispatch(await validator(field));
        } catch (err) {
            form.dispatch(form.actions().addFieldAsyncError(field, unknownError(err)));
        } finally {
            form.dispatch(form.actions().asyncValidateFieldStop(field));
        }
    }, timeout);

    return async (fields) => {
        if (fields.includes(field)) {
            await fn();
        }
    };
}
