import debounce from 'lodash/debounce.js';
import type { AsyncValidator } from './Form.js';
import type { Form } from './Form.js';
import type { Action, Field } from './Types.js';

export function createDebouncedValidator<TFormValues, TValue>(
    form: Form<TFormValues, string>,
    field: Field<TFormValues, TValue>,
    timeout: number,
    validator: (state: Field<TFormValues, TValue>) => Promise<Action<TFormValues, string>>,
): AsyncValidator<TFormValues> {
    const fn = debounce(async () => {
        form.dispatch(form.actions().asyncValidateFieldStart(field));

        try {
            form.dispatch(await validator(field));
        } catch (e) {
            if (typeof e == 'string') {
                form.dispatch(form.actions().addFieldAsyncError(field, e));
            } else {
                form.dispatch(form.actions().addFieldAsyncError(field, 'unknown error.'));
            }
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
