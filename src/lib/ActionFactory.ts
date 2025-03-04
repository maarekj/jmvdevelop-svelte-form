import lodashKeys from 'lodash/keys.js';
import type { Field, FormState, Action } from './Types.js';
import type { Form } from './Form.js';
import { emptyField, mapField, mapFields } from './selectors.js';

export class ActionFactory<TValues, TError> {
    constructor(private form: Form<TValues, TError>) {}

    focus = <TValue>(field: Field<TValues, TValue>): Action<TValues, TError> => {
        return (state) => {
            state = mapField(
                state,
                (field) => (field.focus == true ? field : { ...field, focus: true }),
                field.getKey(),
            );
            return state;
        };
    };

    blur = <TValue>(field: Field<TValues, TValue>): Action<TValues, TError> => {
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
    };

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

    clearFieldAsyncError = <TValue>(field: Field<TValues, TValue>): Action<TValues, TError> => {
        return (state) => {
            return mapField(
                state,
                (field) => {
                    return field.asyncErrors.length == 0 ? field : { ...field, asyncErrors: [] };
                },
                field.getKey(),
            );
        };
    };

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

    addFieldError = <Value>(field: Field<TValues, Value>, error: TError): Action<TValues, TError> => {
        return (state: FormState<TValues, TError>) => {
            return mapField(state, (field) => ({ ...field, errors: [...field.errors, error] }), field.getKey());
        };
    };

    addFieldAsyncError = <Value>(field: Field<TValues, Value>, error: TError): Action<TValues, TError> => {
        return (state: FormState<TValues, TError>) => {
            return mapField(
                state,
                (field) => ({ ...field, asyncErrors: [...field.asyncErrors, error] }),
                field.getKey(),
            );
        };
    };

    clearFieldErrors = <TValue>(field: Field<TValues, TValue>): Action<TValues, TError> => {
        return (state: FormState<TValues, TError>) => {
            return mapField(
                state,
                (field) => (field.errors.length === 0 ? field : { ...field, errors: [] }),
                field.getKey(),
            );
        };
    };

    addRootError = (error: TError): Action<TValues, TError> => {
        return (state) => {
            return { ...state, rootErrors: [...state.rootErrors, error] };
        };
    };

    addSubmitError = (error: TError): Action<TValues, TError> => {
        return (state) => {
            return { ...state, submitErrors: [...state.submitErrors, error] };
        };
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    changeValues = (values: TValues, fields: Field<TValues, any>[]): Action<TValues, TError> => {
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
                validator(fields).catch(console.error);
            }

            return state;
        };
    };

    changeValue = <TValue>(value: TValue, field: Field<TValues, TValue>): Action<TValues, TError> => {
        return (state: FormState<TValues, TError>) => {
            const oldValue = field.getValue(state.values);
            if (oldValue === value) {
                return state;
            }

            return this.changeValues(field.setValue(value, state.values), [field])(state);
        };
    };

    updateValue = <TValue>(
        updater: (value: TValue) => TValue,
        field: Field<TValues, TValue>,
    ): Action<TValues, TError> => {
        return (state: FormState<TValues, TError>) => {
            const newValue = updater(field.getValue(state.values));
            return this.changeValue(newValue, field)(state);
        };
    };

    listPushItem = <TValue>(value: TValue, field: Field<TValues, TValue[]>): Action<TValues, TError> => {
        return this.updateValue((list) => {
            return [...list, value];
        }, field);
    };

    listRemoveIndex = <TValue>(index: number, field: Field<TValues, TValue[]>): Action<TValues, TError> => {
        return this.updateValue((list) => {
            return list.filter((_v, i) => i != index);
        }, field);
    };

    listRemoveByPredicate = <TValue>(
        predicate: (value: TValue, index: number) => boolean,
        field: Field<TValues, TValue[]>,
    ): Action<TValues, TError> => {
        return this.updateValue((list) => {
            return list.filter((v, index) => !predicate(v, index));
        }, field);
    };

    asyncValidateFieldStart = <TValue>(field: Field<TValues, TValue>): Action<TValues, TError> => {
        return (state: FormState<TValues, TError>) => {
            return mapField(
                state,
                (field) => ({ ...field, asyncValidating: field.asyncValidating + 1 }),
                field.getKey(),
            );
        };
    };

    asyncValidateFieldStop = <TValue>(field: Field<TValues, TValue>): Action<TValues, TError> => {
        return (state: FormState<TValues, TError>) => {
            return mapField(
                state,
                (field) => ({ ...field, asyncValidating: field.asyncValidating - 1 }),
                field.getKey(),
            );
        };
    };
}
