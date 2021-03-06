import React, { useEffect, useState } from 'react';
import { omit } from 'lodash';
import './FieldValidator.scss';

const FieldValidator = ({
  children,
  fieldName,
  isValid,
  formValidationState,
  // fieldsToValidate,
  validationError='Field cannot be blank',
  // values,
  // validationId
}) => {
  // debugger
  const [formValidation, setFormValidation] = formValidationState;
  const { enabled } = formValidation;
  const [isError, setIsError] = useState(false);
  // const localValue = !values[fieldName] && fieldsToValidate.includes(fieldName);
  // const localValue = !values[validationId] && fieldsToValidate.includes(fieldName);
  // const localValue = !values[validationId] && isValid;

  useEffect(() => {
    debugger
    setIsError(enabled ? !isValid : false);
    // setIsError(isValid);
    // setIsError(enabled ? localValue : false);
    setFormValidation(prev => {
      const isValidForm = {
        ...(!isValid ? { ...prev.isValidForm, [fieldName] : 1 } : 
        // ...(localValue ? { ...prev.isValidForm, [fieldName] : 1 } : 
          omit(prev.isValidForm, fieldName))
      };
      return { ...prev, isValidForm };
    });
  }, [isValid, fieldName, enabled, setFormValidation]);

  return (
    <div className='field-validator'>
      {children}
      {isError && (
        <span className='field-validator_error'>
          {validationError}
        </span>
      )}
    </div>
  )
}

export default FieldValidator;
