/* eslint-disable no-restricted-imports */
import React from 'react';
import {
  TextField,
  FormLabel,
  FormGroup
} from "@material-ui/core";
import Select from 'react-select';
import { makeStyles } from "@material-ui/core/styles";
import { allBaseFields } from '../../constants'
import FieldValidator from '../../Components/FieldValidator/FieldValidator';
import { useFieldValidator } from '../../Components/FieldValidator/hooks';

const useStyles = makeStyles(theme => ({
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200
  }
}));

const BaseFields = ({ formState, localProps, values, catalogue, collection }) => {
  const [formValidation, setFormValidation] = formState;
  const { fields, fieldsToValidate } = useFieldValidator(collection);
  const classes = useStyles();
  const baseFields = allBaseFields[catalogue] || {};

  const completeBaseFields = Object.entries(baseFields).reduce((acu, cur) => {
    const [key, val] = cur;
    return {
      ...acu,
      [key]: {
        ...val,
        ...(localProps[key] ? localProps[key] : {})
      }
    }
  }, {});

  const baseProps = {
    className: classes.textField,
    margin: 'normal'
  }
  const baseComponents = {
    dropSelect: (props) => {
      return (
        <div className={props.className} style={props.style}>
          <FormLabel component="legend">{props.componentProps.label}</FormLabel>
          <FormGroup>
            <Select {...props.componentProps} />
          </FormGroup>
        </div>
      );},
    textField: (props) => {
      const componentProps = {...props, ...props.componentProps};

      return <TextField {...componentProps} />
    },
  };

  const renderBaseFields = () => Object.entries(completeBaseFields).map(([key, val]) => {
    const { ownValidFn, component, componentProps, validationId, compLabel, style } = val;
    const label = (fields || {})[key]?.caption || compLabel;
    const regEx = (fields || {})[key]?.regex || '';
    const localComponentProps = { ...componentProps, label };
    const props = {...baseProps, value: values[key], componentProps: localComponentProps, style };
    const defaultVoidValidation = !!values[validationId];
    const isValidVoid = !(fieldsToValidate || []).includes(key) ? true :
      (ownValidFn ? ownValidFn() : defaultVoidValidation);
    const isValidRegEx = regEx ? (new RegExp(regEx)).test(values[validationId]) : true;
    if (baseComponents[component]) {
      return (
        <FieldValidator
          formValidationState={[formValidation, setFormValidation]}
          isValidVoid={isValidVoid}
          isValidRegEx={isValidRegEx}
          fieldName={key}
        >
          {(baseComponents[component])(props)}
        </FieldValidator>
      );
    } else {
      return null;
    }
  });

  return (
    <>
      {renderBaseFields()}
    </>
  );
}

export default BaseFields;
