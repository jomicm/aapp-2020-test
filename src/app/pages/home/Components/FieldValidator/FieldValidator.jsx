import React, { useEffect, useState } from 'react';
import { omit } from 'lodash';
import './FieldValidator.scss';

const errors = {
  regExError: 'Field content is invalid',
  voidError: 'Field cannot be blank'
};

const FieldValidator = ({
  children,
  fieldName,
  formValidationState,
  isValidVoid,
  isValidRegEx
}) => {
  const [formValidation, setFormValidation] = formValidationState;
  const { enabled } = formValidation;
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setIsError(enabled ? (!isValidVoid || !isValidRegEx) : false);
    setFormValidation(prev => {
      const isValidForm = {
        ...(!isValidVoid ? { ...prev.isValidForm, [fieldName] : 1 } : 
          omit(prev.isValidForm, fieldName))
      };
      return { ...prev, isValidForm };
    });
  }, [isValidVoid, fieldName, enabled, setFormValidation]);

  return (
    <div className='field-validator'>
      {children}
      {isError && (
        <span className='field-validator_error'>
          {!isValidVoid ? errors.voidError : !isValidRegEx ? errors.regExError : ''}
        </span>
      )}
    </div>
  );
}

export default FieldValidator;
