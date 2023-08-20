import debounce from 'lodash/debounce';
import type { AsyncValidator } from './Form';
import type { Form } from './Form';
import type { Action, Field } from './Types';

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
                form.dispatch(form.actions().addAsyncError(field, e));
            } else {
                form.dispatch(form.actions().addAsyncError(field, 'unknown error.'));
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
