import lodashKeys from 'lodash/keys';
import type { Field, FormState, Action } from './Types';
import type Form from './Form';
import { emptyField, mapField, mapFields } from './selectors';

export default class ActionFactory<TValues, TError> {
    constructor(private form: Form<TValues, TError>) {}

    focus<TValue>(field: Field<TValues, TValue>): Action<TValues, TError> {
        return (state) => {
            state = mapField(
                state,
                (field) => (field.focus == true ? field : { ...field, focus: true }),
                field.getKey(),
            );
            return state;
        };
    }

    blur<TValue>(field: Field<TValues, TValue>): Action<TValues, TError> {
        return (state) => {
            return mapField(
                state,
                (field) =>
                    field.focus == false && field.alreadyBlur === true
                        ? field
                        : { ...field, focus: false, alreadyBlur: true },
                field.getKey(),
            );
        };
    }

    startSubmit: Action<TValues, TError> = (state) => {
        return { ...state, submitting: true, nbSubmits: state.nbSubmits + 1 };
    };

    stopSubmit: Action<TValues, TError> = (state) => {
        return state.submitting === false ? state : { ...state, submitting: false };
    };

    submitSuccess: Action<TValues, TError> = (state) => {
        return state.submitSuccess === true ? state : { ...state, submitSuccess: true };
    };

    clearRootErrors: Action<TValues, TError> = (state) => {
        return state.rootErrors.length === 0 ? state : { ...state, rootErrors: [] };
    };

    clearSubmitErrors: Action<TValues, TError> = (state) => {
        return state.submitErrors.length === 0 ? state : { ...state, submitErrors: [] };
    };

    clearFieldAsyncError<TValue>(field: Field<TValues, TValue>): Action<TValues, TError> {
        return (state) => {
            return mapField(
                state,
                (field) => {
                    return field.asyncErrors.length == 0 ? field : { ...field, asyncErrors: [] };
                },
                field.getKey(),
            );
        };
    }

    clearAllFieldsErrors: Action<TValues, TError> = (state) => {
        return mapFields(state, (fields) => {
            const keys = lodashKeys(fields);

            return keys.reduce((fields, key) => {
                const field = fields[key] ?? emptyField;
                if (field.errors.length === 0) {
                    return fields;
                } else {
                    return { ...fields, [key]: { ...field, errors: [] } };
                }
            }, fields);
        });
    };

    addError<Value>(field: Field<TValues, Value>, error: TError): Action<TValues, TError> {
        return (state: FormState<TValues, TError>) => {
            return mapField(state, (field) => ({ ...field, errors: [...field.errors, error] }), field.getKey());
        };
    }

    addAsyncError<Value>(field: Field<TValues, Value>, error: TError): Action<TValues, TError> {
        return (state: FormState<TValues, TError>) => {
            return mapField(
                state,
                (field) => ({ ...field, asyncErrors: [...field.asyncErrors, error] }),
                field.getKey(),
            );
        };
    }

    clearErrors(field: Field<TValues, unknown>): Action<TValues, TError> {
        return (state: FormState<TValues, TError>) => {
            return mapField(
                state,
                (field) => (field.errors.length === 0 ? field : { ...field, errors: [] }),
                field.getKey(),
            );
        };
    }

    addRootError(error: TError): Action<TValues, TError> {
        return (state) => {
            return { ...state, rootErrors: [...state.rootErrors, error] };
        };
    }

    addSubmitError(error: TError): Action<TValues, TError> {
        return (state) => {
            return { ...state, submitErrors: [...state.submitErrors, error] };
        };
    }

    changeValues(values: TValues, fields: Field<TValues, unknown>[]): Action<TValues, TError> {
        return (state: FormState<TValues, TError>) => {
            if (state.values === values) {
                return state;
            }

            let prevState = state;

            state = { ...state, values: values };
            state = fields.reduce((state, field) => {
                return mapField(
                    state,
                    (field) => (field.dirty === true ? field : { ...field, dirty: true }),
                    field.getKey(),
                );
            }, state);

            for (const hook of this.form.getOnChangeValues()) {
                state = hook(fields, prevState, state);
                prevState = state;
            }

            state = this.clearRootErrors(state);
            state = this.clearAllFieldsErrors(state);

            for (const validator of this.form.getValidators()) {
                state = validator(state);
            }

            for (const validator of this.form.getAsyncValidators()) {
                validator(fields);
            }

            return state;
        };
    }

    changeValue<TValue>(value: TValue, field: Field<TValues, TValue>): Action<TValues, TError> {
        return (state: FormState<TValues, TError>) => {
            const oldValue = field.getValue(state.values);
            if (oldValue === value) {
                return state;
            }

            return this.changeValues(field.setValue(value, state.values), [field as Field<TValues, unknown>])(state);
        };
    }

    listPushItem<TValue>(value: TValue, field: Field<TValues, TValue[]>): Action<TValues, TError> {
        return (state: FormState<TValues, TError>) => {
            let list = field.getValue(state.values);
            list = [...list, value];
            return this.changeValue(list, field)(state);
        };
    }

    listRemoveItem<TValue>(index: number, field: Field<TValues, TValue[]>): Action<TValues, TError> {
        return (state: FormState<TValues, TError>) => {
            let list = field.getValue(state.values);
            list = list.filter((_v, i) => i != index);

            return this.changeValue(list, field)(state);
        };
    }

    asyncValidateFieldStart<TValue>(field: Field<TValues, TValue>): Action<TValues, TError> {
        return (state: FormState<TValues, TError>) => {
            return mapField(
                state,
                (field) => ({ ...field, asyncValidating: field.asyncValidating + 1 }),
                field.getKey(),
            );
        };
    }

    asyncValidateFieldStop<TValue>(field: Field<TValues, TValue>): Action<TValues, TError> {
        return (state: FormState<TValues, TError>) => {
            return mapField(
                state,
                (field) => ({ ...field, asyncValidating: field.asyncValidating - 1 }),
                field.getKey(),
            );
        };
    }
}
