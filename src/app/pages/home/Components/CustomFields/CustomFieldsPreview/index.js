import React, { useState, useEffect } from 'react';
import {
  TextField,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Fab,
  IconButton
} from "@material-ui/core";
import { isEmpty } from 'lodash';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import './index.scss';

// Custom Fields Preview
const SingleLine = (props) => {
  const defaultValues = {
    fieldName: 'Single Line',
    initialValue: '',
  };
  const [values, setValues] = useState(defaultValues);
  const handleCustomFieldClick = () => {
    props.onSelect(props.id, 'singleLine', values, setValues);
  };
  useEffect(() => {
    if (!isEmpty(props.values)) {
      setValues(props.values);
    } else {
      setValues(defaultValues);
    }
  }, [props.values]);
  const [isPreview, setIsPreview] = useState(true);
  useEffect(() => setIsPreview(!props.from), [props.from]);
  const handleOnChange = e => {
    if (isPreview)  return;
    setValues({ ...values, initialValue: e.target.value });
    props.onUpdateCustomField(props.tab.key, props.id, props.columnIndex, { ...values, initialValue: e.target.value });
  };
  return (
    <div className={`custom-field-${isPreview ? 'preview' : 'real'}-wrapper`} onClick={handleCustomFieldClick}>
      <TextField
        className={`custom-field-${isPreview ? 'preview' : 'real'}-wrapper__single-line`}
        label={values.fieldName}
        type="text"
        margin="normal"
        value={values.initialValue}
        onChange={handleOnChange}
        //onChange={e => setValues({...values, initialValue: e.target.value})}
      />
      { isPreview &&
        <IconButton aria-label="Delete" size="medium" className="custom-field-preview-wrapper__delete-icon" onClick={props.onDelete}>
          <DeleteIcon fontSize="inherit" />
        </IconButton>
      }
    </div>
  )
};

const MultiLine = (props) => {
  const defaultValues = {
    fieldName: 'Multi Line',
    initialValue: ''
  };
  const [values, setValues] = useState(defaultValues);
  const handleCustomFieldClick = () => {
    props.onSelect(props.id, 'multiLine', values, setValues);
  };
  useEffect(() => {
    if (!isEmpty(props.values)) {
      setValues(props.values);
    } else {
      setValues(defaultValues);
    }
  }, [props.values]);
  const [isPreview, setIsPreview] = useState(true);
  useEffect(() => setIsPreview(!props.from), [props.from]);
  const handleOnChange = e => {
    if (isPreview)  return;
    setValues({ ...values, initialValue: e.target.value });
    props.onUpdateCustomField(props.tab.key, props.id, props.columnIndex, { ...values, initialValue: e.target.value });
  };
  return (
    <div className={`custom-field-${isPreview ? 'preview' : 'real'}-wrapper`} onClick={handleCustomFieldClick}>
      <TextField
        className={`custom-field-${isPreview ? 'preview' : 'real'}-wrapper__multi-line`}
        label={values.fieldName}
        multiline
        rows="4"
        defaultValue={values.initialValue}
        margin="normal"
        value={values.initialValue}
        onChange={handleOnChange}
      />
      { isPreview &&
        <IconButton aria-label="Delete" size="medium" className="custom-field-preview-wrapper__delete-icon" onClick={props.onDelete}>
          <DeleteIcon fontSize="inherit" />
        </IconButton>
      }
    </div>
  )
};

const Date = (props) => {
  const defaultValues = {
    fieldName: 'Date',
    initialValue: '',
  };
  const [values, setValues] = useState(defaultValues);
  const handleCustomFieldClick = () => {
    props.onSelect(props.id, 'date', values, setValues);
  };
  useEffect(() => {
    if (!isEmpty(props.values)) {
      setValues(props.values);
    } else {
      setValues(defaultValues);
    }
  }, [props.values]);
  const [isPreview, setIsPreview] = useState(true);
  useEffect(() => setIsPreview(!props.from), [props.from]);
  const handleOnChange = e => {
    if (isPreview)  return;
    setValues({ ...values, initialValue: e.target.value });
    props.onUpdateCustomField(props.tab.key, props.id, props.columnIndex, { ...values, initialValue: e.target.value });
  };
  return (
    <div className={`custom-field-${isPreview ? 'preview' : 'real'}-wrapper`} onClick={handleCustomFieldClick}>
      <TextField
        className={`custom-field-${isPreview ? 'preview' : 'real'}-wrapper__date`}
        label={values.fieldName}
        type="date"
        defaultValue={values.initialValue}
        value={values.initialValue}
        onChange={handleOnChange}
        InputLabelProps={{
          shrink: true,
        }}
      />
      { isPreview &&
        <IconButton aria-label="Delete" size="medium" className="custom-field-preview-wrapper__delete-icon" onClick={props.onDelete}>
          <DeleteIcon fontSize="inherit" />
        </IconButton>
      }
    </div>
  )
};

const DateTime = (props) => {
  const defaultValues =  {
    fieldName: 'Date Time',
    initialValue: '',
  };
  const [values, setValues] = useState(defaultValues);
  const handleCustomFieldClick = () => {
    props.onSelect(props.id, 'dateTime', values, setValues);
  };
  useEffect(() => {
    if (!isEmpty(props.values)) {
      setValues(props.values);
    } else {
      setValues(defaultValues);
    }
  }, [props.values]);
  const [isPreview, setIsPreview] = useState(true);
  useEffect(() => setIsPreview(!props.from), [props.from]);
  const handleOnChange = e => {
    if (isPreview)  return;
    setValues({ ...values, initialValue: e.target.value });
    props.onUpdateCustomField(props.tab.key, props.id, props.columnIndex, { ...values, initialValue: e.target.value });
  };
  return (
    <div className={`custom-field-${isPreview ? 'preview' : 'real'}-wrapper`} onClick={handleCustomFieldClick}>
      <TextField
        className={`custom-field-${isPreview ? 'preview' : 'real'}-wrapper__date-time`}
        label={values.fieldName}
        type="datetime-local"
        defaultValue={values.initialValue}
        value={values.initialValue}
        onChange={handleOnChange}
        InputLabelProps={{
          shrink: true,
        }}
      />
      { isPreview &&
        <IconButton aria-label="Delete" size="medium" className="custom-field-preview-wrapper__delete-icon" onClick={props.onDelete}>
          <DeleteIcon fontSize="inherit" />
        </IconButton>
      }
    </div>
  )
};

const DropDown = (props) => {
  const defaultValues = {
    fieldName: 'Drop Down',
    selectedItem: '',
    options: ['Option 1', 'Option 2', 'Option 3']
  };
  const [values, setValues] = useState(defaultValues);
  const handleCustomFieldClick = () => {
    props.onSelect(props.id, 'dropDown', values, setValues);
  };
  useEffect(() => {
    if (!isEmpty(props.values)) {
      setValues(props.values);
    } else {
      setValues(defaultValues);
    }
  }, [props.values]);
  const [isPreview, setIsPreview] = useState(true);
  useEffect(() => setIsPreview(!props.from), [props.from]);
  const handleOnChange = e => {
    if (isPreview)  return;
    setValues({ ...values, selectedItem: e.target.value })
    props.onUpdateCustomField(props.tab.key, props.id, props.columnIndex, { ...values, selectedItem: e.target.value });
  };
  return (
    <div className={`custom-field-${isPreview ? 'preview' : 'real'}-wrapper`} onClick={handleCustomFieldClick}>
      <FormControl className={`custom-field-${isPreview ? 'preview' : 'real'}-wrapper__drop-down`}>
        <InputLabel htmlFor="age-simple">{values.fieldName}</InputLabel>
        <Select
          value={values.selectedItem}
          // onChange={e => setValues({...values, selectedItem: e.target.value})}
          onChange={handleOnChange}
          inputProps={{
            name: 'age',
            id: 'age-simple',
          }}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {values.options.map((opt, ix) => (
            <MenuItem key={`opt-${ix}`} value={ix}>{opt}</MenuItem>
          ))}
        </Select>
      </FormControl>
      { isPreview &&
        <IconButton aria-label="Delete" size="medium" className="custom-field-preview-wrapper__delete-icon" onClick={props.onDelete}>
          <DeleteIcon fontSize="inherit" />
        </IconButton>
      }
    </div>
  )
};

const RadioButtons = (props) => {
  const defaultValues = {
    fieldName: 'Radio Buttons',
    selectedItem: '',
    options: ['Radio 1', 'Radio 2', 'Radio 3']
  };
  const [values, setValues] = useState(defaultValues);
  const handleCustomFieldClick = () => {
    props.onSelect(props.id, 'radioButtons', values, setValues);
  };
  useEffect(() => {
    if (!isEmpty(props.values)) {
      setValues(props.values);
    } else {
      setValues(defaultValues);
    }
  }, [props.values]);
  const [isPreview, setIsPreview] = useState(true);
  useEffect(() => setIsPreview(!props.from), [props.from]);
  const handleOnChange = e => {
    if (isPreview)  return;
    setValues({ ...values, selectedItem: e.target.value });
    props.onUpdateCustomField(props.tab.key, props.id, props.columnIndex, { ...values, selectedItem: e.target.value });
  };
  return (
    <div className={`custom-field-${isPreview ? 'preview' : 'real'}-wrapper`} onClick={handleCustomFieldClick}>
      <FormControl component="fieldset">
        <FormLabel component="legend">{values.fieldName}</FormLabel>
        <RadioGroup
          aria-label="Gender"
          name="gender1"
          value={values.selectedItem}
          // onChange={e => setValues({ ...values, selectedItem: e.target.value })}
          onChange={handleOnChange}
        >
        {values.options.map((opt, ix) => (
          <FormControlLabel value={`rad${ix + 1}`} control={<Radio />} label={opt} />
        ))}
        </RadioGroup>
      </FormControl>
      { isPreview &&
        <IconButton aria-label="Delete" size="medium" className="custom-field-preview-wrapper__delete-icon" onClick={props.onDelete}>
          <DeleteIcon fontSize="inherit" />
        </IconButton>
      }
    </div>
  )
};

const Checkboxes = (props) => {
  const defaultValues = {
    fieldName: 'Checkboxes',
    selectedItem: '',
    options: ['Checkbox 1', 'Checkbox 2', 'Checkbox 3']
  };
  const [values, setValues] = useState(defaultValues);
  const handleCustomFieldClick = () => {
    props.onSelect(props.id, 'checkboxes', values, setValues);
  };
  const handleCheck = (index) => {
    setValues({
      ...values,
      [`check${index}`]: !values[`check${index}`]
    });
    props.onUpdateCustomField(props.tab.key, props.id, props.columnIndex, { ...values, [`check${index}`]: !values[`check${index}`] });
  };
  useEffect(() => {
    if (!isEmpty(props.values)) {
      setValues(props.values);
    } else {
      setValues(defaultValues);
    }
  }, [props.values]);
  const [isPreview, setIsPreview] = useState(true);
  useEffect(() => setIsPreview(!props.from), [props.from]);
  // const handleOnChange = e => {
  //   console.log('isPreview:', isPreview)
  //   if (isPreview)  return;
  //   setValues({ ...values, initialValue: e.target.value });
  // };
  return (
    <div className={`custom-field-${isPreview ? 'preview' : 'real'}-wrapper`} onClick={handleCustomFieldClick}>
      <FormControl component="fieldset">
        <FormLabel component="legend">{values.fieldName}</FormLabel>
        <FormGroup>
          {values.options.map((opt, ix) => (
            <FormControlLabel
              key={`check-${ix}`}
              control={<Checkbox checked={values[`check${ix}`] || false} onChange={() => handleCheck(ix)} value={ix} />}
              label={opt}
            />
          ))}
          {/* <FormControlLabel
            control={<Checkbox checked={values.check2} onChange={() => handleCheck('2')} value="2" />}
            label="Checkbox 2"
          />
          <FormControlLabel
            control={
              <Checkbox checked={values.check3} onChange={() => handleCheck('3')} value="3" />
            }
            label="Checkbox 2"
          /> */}
        </FormGroup>
      </FormControl>
      { isPreview &&
        <IconButton aria-label="Delete" size="medium" className="custom-field-preview-wrapper__delete-icon" onClick={props.onDelete}>
          <DeleteIcon fontSize="inherit" />
        </IconButton>
      }
    </div>
  )
};

const FileUpload = (props) => {
  const defaultValues = {
    fieldName: 'File Upload',
    fileName: ''
  };
  const [values, setValues] = useState(defaultValues);
  const handleCustomFieldClick = () => {
    props.onSelect(props.id, 'fileUpload', values, setValues);
  };
  useEffect(() => {
    if (!isEmpty(props.values)) {
      setValues(props.values);
    } else {
      setValues(defaultValues);
    }
  }, [props.values]);
  const [isPreview, setIsPreview] = useState(true);
  useEffect(() => setIsPreview(!props.from), [props.from]);
  const handleOnChange = e => {
    if (isPreview)  return;
    setValues({ ...values, fileName: e.target.value });
    //props.onUpdateCustomField(props.tab.key, props.id, props.columnIndex, { ...values, fileName: e.target.value });
  };
  return (
    <div className={`custom-field-${isPreview ? 'preview' : 'real'}-wrapper`} onClick={handleCustomFieldClick}>
      <FormControl component="fieldset">
        <FormLabel component="legend">{values.fieldName}</FormLabel>
        <FormGroup>
          <input type="file" name="myImage" value={values.fileName} onChange={handleOnChange}/>
          {/* <a onClick={() => setValues({ ...values, fileName: '' })}>Clear</a> */}
          <a onClick={handleOnChange}>Clear</a>
        </FormGroup>
      </FormControl>
      { isPreview &&
        <IconButton aria-label="Delete" size="medium" className="custom-field-preview-wrapper__delete-icon" onClick={props.onDelete}>
          <DeleteIcon fontSize="inherit" />
        </IconButton>
      }
    </div>
  )
};

// Custom Fields Settings
const SingleLineSettings = (props) => {
  const defaultValues = {
    fieldName: 'Single Line',
    initialValue: '',
    maxLength: 255,
    mandatory: false,
    repeated: false,
  };
  const [values, setValues] = useState(defaultValues);

  const handleOnChange = name => e => {
    let newValue = e.target.value;
    if (newValue === 'mandatory') newValue = !values.mandatory;
    if (newValue === 'repeated') newValue = !values.repeated;
    setValues({
      ...values,
      [name]: newValue
    });
    if (name === 'fieldName' || name === 'initialValue') {
      props.setValues({
        ...props.values,
        [name]: newValue
      })
    }
    props.onUpdate(props.id, { ...values, [name]: newValue });
  };

  useEffect(() => {
    if (!isEmpty(props.selfValues)) {
      setValues(props.selfValues);
    } else {
      setValues(defaultValues);
    }
  }, [props.selfValues]);

  return (
    <div className="custom-field-settings-wrapper">
      <div className="custom-field-settings-wrapper__left-content">
        <TextField
          className="custom-field-settings-wrapper__field-name"
          label="Field Name"
          value={values.fieldName}
          onChange={handleOnChange('fieldName')}
          type="text"
          margin="normal"
        />
        <TextField
          className="custom-field-settings-wrapper__initial-value"
          label="Initial Value"
          value={values.initialValue}
          onChange={handleOnChange('initialValue')}
          type="text"
          margin="normal"
        />
        <TextField
          className="custom-field-settings-wrapper__max-length"
          label="Max Length"
          value={values.maxLength}
          onChange={handleOnChange('maxLength')}
          type="number"
          margin="normal"
        />
      </div>
      <FormControl component="fieldset" className="custom-field-settings-wrapper__right-content">
        <FormLabel component="legend">Validations</FormLabel>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox checked={values.mandatory} onChange={handleOnChange('mandatory')} value="mandatory" />}
            label="Mandatory"
          />
          <FormControlLabel
            control={<Checkbox checked={values.repeated} onChange={handleOnChange('repeated')} value="repeated" />}
            label="No Repeated Values"
          />
        </FormGroup>
      </FormControl>
    </div>
  );
};

const MultiLineSettings = (props) => {
  const defaultValues = {
    fieldName: 'Multi Line',
    mandatory: false,
  };
  const [values, setValues] = useState(defaultValues);
  const handleOnChange = name => e => {
    let newValue = e.target.value;
    if (newValue === 'mandatory') newValue = !values.mandatory;
    setValues({
      ...values,
      [name]: newValue
    })
    if (name === 'fieldName') {
      props.setValues({
        ...props.values,
        [name]: newValue
      })
    }
    props.onUpdate(props.id, { ...values, [name]: newValue });
  }
  useEffect(() => {
    if (!isEmpty(props.selfValues)) {
      setValues(props.selfValues);
    } else {
      setValues(defaultValues);
    }
  }, [props.selfValues]);
  return (
    <div className="custom-field-settings-wrapper">
      <div className="custom-field-settings-wrapper__left-content">
        <TextField
          className="custom-field-settings-wrapper__field-name"
          label="Field Name"
          value={values.fieldName}
          onChange={handleOnChange('fieldName')}
          type="text"
          margin="normal"
        />
      </div>
      <FormControl component="fieldset" className="custom-field-settings-wrapper__right-content">
        <FormLabel component="legend">Validations</FormLabel>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox checked={values.mandatory} onChange={handleOnChange('mandatory')} value="mandatory" />}
            label="Mandatory"
          />
        </FormGroup>
      </FormControl>
    </div>
  );
};

const DateSettings = (props) => {
  const defaultValues = {
    fieldName: 'Date',
    initialValue: '',
    mandatory: false,
    repeated: false,
  };
  const [values, setValues] = useState(defaultValues);
  const handleOnChange = name => e => {
    let newValue = e.target.value;
    if (newValue === 'mandatory') newValue = !values.mandatory;
    if (newValue === 'repeated') newValue = !values.repeated;
    setValues({
      ...values,
      [name]: newValue
    })
    if (name === 'fieldName' || name === 'initialValue') {
      props.setValues({
        ...props.values,
        [name]: newValue
      })
    }
    props.onUpdate(props.id, { ...values, [name]: newValue });
  }
  useEffect(() => {
    if (!isEmpty(props.selfValues)) {
      setValues(props.selfValues);
    } else {
      setValues(defaultValues);
    }
  }, [props.selfValues]);
  return (
    <div className="custom-field-settings-wrapper">
      <div className="custom-field-settings-wrapper__left-content">
        <TextField
          className="custom-field-settings-wrapper__field-name"
          label="Field Name"
          value={values.fieldName}
          onChange={handleOnChange('fieldName')}
          type="text"
          margin="normal"
        />
        <TextField
          className="custom-field-settings-wrapper__initial-value"
          label="Initial Value"
          type="date"
          value={values.initialValue}
          onChange={handleOnChange('initialValue')}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </div>
      <FormControl component="fieldset" className="custom-field-settings-wrapper__right-content">
        <FormLabel component="legend">Validations</FormLabel>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox checked={values.mandatory} onChange={handleOnChange('mandatory')} value="mandatory" />}
            label="Mandatory"
          />
          <FormControlLabel
            control={<Checkbox checked={values.repeated} onChange={handleOnChange('repeated')} value="repeated" />}
            label="No Repeated Values"
          />
        </FormGroup>
      </FormControl>
    </div>
  );
};

const DateTimeSettings = (props) => {
  const defaultValues = {
    fieldName: 'Date Time',
    initialValue: '',
    mandatory: false,
    repeated: false,
  };
  const [values, setValues] = useState(defaultValues);
  const handleOnChange = name => e => {
    let newValue = e.target.value;
    if (newValue === 'mandatory') newValue = !values.mandatory;
    if (newValue === 'repeated') newValue = !values.repeated;
    setValues({
      ...values,
      [name]: newValue
    })
    if (name === 'fieldName' || name === 'initialValue') {
      props.setValues({
        ...props.values,
        [name]: newValue
      })
    }
    props.onUpdate(props.id, { ...values, [name]: newValue });
  }
  useEffect(() => {
    if (!isEmpty(props.selfValues)) {
      setValues(props.selfValues);
    } else {
      setValues(defaultValues);
    }
  }, [props.selfValues]);
  return (
    <div className="custom-field-settings-wrapper">
      <div className="custom-field-settings-wrapper__left-content">
        <TextField
          className="custom-field-settings-wrapper__field-name"
          label="Field Name"
          value={values.fieldName}
          onChange={handleOnChange('fieldName')}
          type="text"
          margin="normal"
        />
        <TextField
          className="custom-field-settings-wrapper__initial-value"
          label="Initial Value"
          type="datetime-local"
          value={values.initialValue}
          onChange={handleOnChange('initialValue')}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </div>
      <FormControl component="fieldset" className="custom-field-settings-wrapper__right-content">
        <FormLabel component="legend">Validations</FormLabel>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox checked={values.mandatory} onChange={handleOnChange('mandatory')} value="mandatory" />}
            label="Mandatory"
          />
          <FormControlLabel
            control={<Checkbox checked={values.repeated} onChange={handleOnChange('repeated')} value="repeated" />}
            label="No Repeated Values"
          />
        </FormGroup>
      </FormControl>
    </div>
  );
};

const DropDownSettings = (props) => {
  const defaultValues = {
    fieldName: 'Drop Down',
    newOption: '',
    options: ['Option 1', 'Option 2', 'Option 3'],
    mandatory: false,
  };
  const [values, setValues] = useState(defaultValues);
  const handleOnChange = name => e => {
    let newValue = e.target.value;
    if (newValue === 'mandatory') newValue = !values.mandatory;
    setValues({
      ...values,
      [name]: newValue
    })
    if (name === 'fieldName' || name === 'options') {
      props.setValues({
        ...props.values,
        [name]: newValue
      })
    }
    props.onUpdate(props.id, { ...values, [name]: newValue });
  };
  const handleAddOption = () => {
    if (!values.newOption)  return;
    const options = [values.newOption, ...values.options];
    setValues({ ...values, options, newOption: '' });
    props.setValues({ ...props.values, fieldName: values.fieldName, options });
    props.onUpdate(props.id, { ...props.values, fieldName: values.fieldName, options });
  };
  const handleDeleteOption = (ix) => {
    const options = [...values.options];
    options.splice(ix, 1);
    setValues({ ...values, options });
    props.setValues({ ...props.values, fieldName: values.fieldName, options });
    props.onUpdate(props.id, { ...props.values, fieldName: values.fieldName, options });
  };
  const handleMoveOption = (ix, direction = 'up') => {
    const options = [...values.options];
    const opt = options[ix];
    const offset = direction === 'up' ? -1 : 2;
    options.splice(ix + offset, 0, opt);
    const delFactor = direction === 'up' ? ix + 1 : ix;
    options.splice(delFactor, 1);
    setValues({ ...values, options });
    props.setValues({ ...props.values, fieldName: values.fieldName, options });
    props.onUpdate(props.id, { ...props.values, fieldName: values.fieldName, options });
  };
  useEffect(() => {
    if (!isEmpty(props.selfValues)) {
      setValues(props.selfValues);
    } else {
      setValues(defaultValues);
    }
  }, [props.selfValues]);
  return (
    <div className="custom-field-settings-wrapper">
      <div component="fieldset" className="custom-field-settings-wrapper__left-content">
        <TextField
          className="custom-field-settings-wrapper__field-name"
          label="Field Name"
          value={values.fieldName}
          onChange={handleOnChange('fieldName')}
          type="text"
          margin="normal"
        />
        <div className="custom-field-settings-wrapper__options-content">
          <FormLabel component="legend">Options</FormLabel>
          <div className="custom-field-settings-wrapper__add-option-wrapper">
            <TextField
              className="custom-field-settings-wrapper__add-option"
              label="Add Option"
              value={values.newOption}
              onChange={handleOnChange('newOption')}
              type="text"
              margin="normal"
            />
            <Fab size="small" color="secondary" aria-label="Add" className="custom-field-preview-wrapper__add-icon" onClick={handleAddOption}>
              <AddIcon />
            </Fab>
          </div>
          <div className="custom-field-settings-wrapper__options-area">
            {values.options.map((opt, ix) => (
              <div className="custom-field-settings-wrapper__options-area__single">
                <span className="custom-field-settings-wrapper__options-area__single__field">{opt}</span>
                <div className="custom-field-settings-wrapper__options-area__single__icons">
                  { (ix !== values.options.length - 1) &&
                    <IconButton aria-label="Down" size="small" className="custom-field-settings-wrapper__options-area__single__icon options-up" onClick={() => handleMoveOption(ix, 'down')}>
                      <ArrowDownwardIcon fontSize="inherit" />
                    </IconButton>
                  }
                  { (ix !== 0) &&
                    <IconButton aria-label="Up" size="small" className="custom-field-settings-wrapper__options-area__single__icon options-down" onClick={() => handleMoveOption(ix, 'up')}>
                      <ArrowUpwardIcon fontSize="inherit" />
                    </IconButton>
                  }
                  <IconButton aria-label="Delete" size="small" className="custom-field-settings-wrapper__options-area__single__icon" onClick={() => handleDeleteOption(ix)}>
                    <DeleteIcon fontSize="inherit" />
                  </IconButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <FormControl component="fieldset" className="custom-field-settings-wrapper__right-content">
        <FormLabel component="legend">Validations</FormLabel>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox checked={values.mandatory} onChange={handleOnChange('mandatory')} value="mandatory" />}
            label="Mandatory"
          />
        </FormGroup>
      </FormControl>
    </div>
  );
};

const RadioButtonsSettings = (props) => {
  const defaultValues = {
    fieldName: 'Radio Buttons',
    newOption: '',
    options: ['Radio 1', 'Radio 2', 'Radio 3'],
    mandatory: false,
  };
  const [values, setValues] = useState(defaultValues);
  const handleOnChange = name => e => {
    let newValue = e.target.value;
    if (newValue === 'mandatory') newValue = !values.mandatory;
    setValues({
      ...values,
      [name]: newValue
    })
    if (name === 'fieldName' || name === 'options') {
      props.setValues({
        ...props.values,
        [name]: newValue
      })
    }
    props.onUpdate(props.id, { ...values, [name]: newValue });
  };
  const handleAddOption = () => {
    if (!values.newOption)  return;
    const options = [values.newOption, ...values.options];
    setValues({ ...values, options, newOption: '' });
    props.setValues({ ...props.values, fieldName: values.fieldName, options });
    props.onUpdate(props.id, { ...props.values, fieldName: values.fieldName, options });
  };
  const handleDeleteOption = (ix) => {
    const options = [...values.options];
    options.splice(ix, 1);
    setValues({ ...values, options });
    props.setValues({ ...props.values, fieldName: values.fieldName, options });
    props.onUpdate(props.id, { ...props.values, fieldName: values.fieldName, options });
  };
  const handleMoveOption = (ix, direction = 'up') => {
    const options = [...values.options];
    const opt = options[ix];
    const offset = direction === 'up' ? -1 : 2;
    options.splice(ix + offset, 0, opt);
    const delFactor = direction === 'up' ? ix + 1 : ix;
    options.splice(delFactor, 1);
    setValues({ ...values, options });
    props.setValues({ ...props.values, fieldName: values.fieldName, options });
    props.onUpdate(props.id, { ...props.values, fieldName: values.fieldName, options });
  };
  useEffect(() => {
    if (!isEmpty(props.selfValues)) {
      setValues(props.selfValues);
    } else {
      setValues(defaultValues);
    }
  }, [props.selfValues]);
  return (
    <div className="custom-field-settings-wrapper">
      <div component="fieldset" className="custom-field-settings-wrapper__left-content">
        <TextField
          className="custom-field-settings-wrapper__field-name"
          label="Field Name"
          value={values.fieldName}
          onChange={handleOnChange('fieldName')}
          type="text"
          margin="normal"
        />
        <div className="custom-field-settings-wrapper__options-content">
          <FormLabel component="legend">Options</FormLabel>
          <div className="custom-field-settings-wrapper__add-option-wrapper">
            <TextField
              className="custom-field-settings-wrapper__add-option"
              label="Add Option"
              value={values.newOption}
              onChange={handleOnChange('newOption')}
              type="text"
              margin="normal"
            />
            <Fab size="small" color="secondary" aria-label="Add" className="custom-field-preview-wrapper__add-icon" onClick={handleAddOption}>
              <AddIcon />
            </Fab>
          </div>
          <div className="custom-field-settings-wrapper__options-area">
            {values.options.map((opt, ix) => (
              <div className="custom-field-settings-wrapper__options-area__single">
                <span className="custom-field-settings-wrapper__options-area__single__field">{opt}</span>
                <div className="custom-field-settings-wrapper__options-area__single__icons">
                  { (ix !== values.options.length - 1) &&
                    <IconButton aria-label="Down" size="small" className="custom-field-settings-wrapper__options-area__single__icon options-up" onClick={() => handleMoveOption(ix, 'down')}>
                      <ArrowDownwardIcon fontSize="inherit" />
                    </IconButton>
                  }
                  { (ix !== 0) &&
                    <IconButton aria-label="Up" size="small" className="custom-field-settings-wrapper__options-area__single__icon options-down" onClick={() => handleMoveOption(ix, 'up')}>
                      <ArrowUpwardIcon fontSize="inherit" />
                    </IconButton>
                  }
                  <IconButton aria-label="Delete" size="small" className="custom-field-settings-wrapper__options-area__single__icon" onClick={() => handleDeleteOption(ix)}>
                    <DeleteIcon fontSize="inherit" />
                  </IconButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <FormControl component="fieldset" className="custom-field-settings-wrapper__right-content">
        <FormLabel component="legend">Validations</FormLabel>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox checked={values.mandatory} onChange={handleOnChange('mandatory')} value="mandatory" />}
            label="Mandatory"
          />
        </FormGroup>
      </FormControl>
    </div>
  );
};

const CheckboxesSettings = (props) => {
  const defaultValues = {
    fieldName: 'Checkboxes',
    newOption: '',
    options: ['Checkbox 1', 'Checkbox 2', 'Checkbox 3'],
    mandatory: false,
  };
  const [values, setValues] = useState(defaultValues);
  const handleOnChange = name => e => {
    let newValue = e.target.value;
    if (newValue === 'mandatory') newValue = !values.mandatory;
    setValues({
      ...values,
      [name]: newValue
    })
    if (name === 'fieldName' || name === 'options') {
      props.setValues({
        ...props.values,
        [name]: newValue
      })
    }
    props.onUpdate(props.id, { ...values, [name]: newValue });
  };
  const handleAddOption = () => {
    if (!values.newOption)  return;
    const options = [values.newOption, ...values.options];
    setValues({ ...values, options, newOption: '' });
    props.setValues({ ...props.values, fieldName: values.fieldName, options });
    props.onUpdate(props.id, { ...props.values, fieldName: values.fieldName, options });
  };
  const handleDeleteOption = (ix) => {
    const options = [...values.options];
    options.splice(ix, 1);
    setValues({ ...values, options });
    props.setValues({ ...props.values, fieldName: values.fieldName, options });
    props.onUpdate(props.id, { ...props.values, fieldName: values.fieldName, options });
  };
  const handleMoveOption = (ix, direction = 'up') => {
    const options = [...values.options];
    const opt = options[ix];
    const offset = direction === 'up' ? -1 : 2;
    options.splice(ix + offset, 0, opt);
    const delFactor = direction === 'up' ? ix + 1 : ix;
    options.splice(delFactor, 1);
    setValues({ ...values, options });
    props.setValues({ ...props.values, fieldName: values.fieldName, options });
    props.onUpdate(props.id, { ...props.values, fieldName: values.fieldName, options });
  };
  useEffect(() => {
    if (!isEmpty(props.selfValues)) {
      setValues(props.selfValues);
    } else {
      setValues(defaultValues);
    }
  }, [props.selfValues]);
  return (
    <div className="custom-field-settings-wrapper">
      <div component="fieldset" className="custom-field-settings-wrapper__left-content">
        <TextField
          className="custom-field-settings-wrapper__field-name"
          label="Field Name"
          value={values.fieldName}
          onChange={handleOnChange('fieldName')}
          type="text"
          margin="normal"
        />
        <div className="custom-field-settings-wrapper__options-content">
          <FormLabel component="legend">Options</FormLabel>
          <div className="custom-field-settings-wrapper__add-option-wrapper">
            <TextField
              className="custom-field-settings-wrapper__add-option"
              label="Add Option"
              value={values.newOption}
              onChange={handleOnChange('newOption')}
              type="text"
              margin="normal"
            />
            <Fab size="small" color="secondary" aria-label="Add" className="custom-field-preview-wrapper__add-icon" onClick={handleAddOption}>
              <AddIcon />
            </Fab>
          </div>
          <div className="custom-field-settings-wrapper__options-area">
            {values.options.map((opt, ix) => (
              <div className="custom-field-settings-wrapper__options-area__single">
                <span className="custom-field-settings-wrapper__options-area__single__field">{opt}</span>
                <div className="custom-field-settings-wrapper__options-area__single__icons">
                  { (ix !== values.options.length - 1) &&
                    <IconButton aria-label="Down" size="small" className="custom-field-settings-wrapper__options-area__single__icon options-up" onClick={() => handleMoveOption(ix, 'down')}>
                      <ArrowDownwardIcon fontSize="inherit" />
                    </IconButton>
                  }
                  { (ix !== 0) &&
                    <IconButton aria-label="Up" size="small" className="custom-field-settings-wrapper__options-area__single__icon options-down" onClick={() => handleMoveOption(ix, 'up')}>
                      <ArrowUpwardIcon fontSize="inherit" />
                    </IconButton>
                  }
                  <IconButton aria-label="Delete" size="small" className="custom-field-settings-wrapper__options-area__single__icon" onClick={() => handleDeleteOption(ix)}>
                    <DeleteIcon fontSize="inherit" />
                  </IconButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <FormControl component="fieldset" className="custom-field-settings-wrapper__right-content">
        <FormLabel component="legend">Validations</FormLabel>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox checked={values.mandatory} onChange={handleOnChange('mandatory')} value="mandatory" />}
            label="Mandatory"
          />
        </FormGroup>
      </FormControl>
    </div>
  );
};

const FileUploadSettings = (props) => {
  const defaultValues = {
    fieldName: 'File Upload',
    mandatory: false,
  };
  const [values, setValues] = useState(defaultValues);
  const handleOnChange = name => e => {
    let newValue = e.target.value;
    if (newValue === 'mandatory') newValue = !values.mandatory;
    setValues({
      ...values,
      [name]: newValue
    })
    if (name === 'fieldName' || name === 'options') {
      props.setValues({
        ...props.values,
        [name]: newValue
      })
    }
    props.onUpdate(props.id, { ...values, [name]: newValue });
  }
  useEffect(() => {
    if (!isEmpty(props.selfValues)) {
      setValues(props.selfValues);
    } else {
      setValues(defaultValues);
    }
  }, [props.selfValues]);
  return (
    <div className="custom-field-settings-wrapper">
      <div className="custom-field-settings-wrapper__left-content">
        <TextField
          className="custom-field-settings-wrapper__field-name"
          label="Field Name"
          value={values.fieldName}
          onChange={handleOnChange('fieldName')}
          type="text"
          margin="normal"
        />
      </div>
      <FormControl component="fieldset" className="custom-field-settings-wrapper__right-content">
        <FormLabel component="legend">Validations</FormLabel>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox checked={values.mandatory} onChange={handleOnChange('mandatory')} value="mandatory" />}
            label="Mandatory"
          />
        </FormGroup>
      </FormControl>
    </div>
  );
};

// Integrated Custom Fields Preview / Settings
const SingleLineIntegrated = (props) => {
  const [values, setValues] = useState({
    fieldName: '',
    initialValue: '',
    maxLength: 255,
    mandatory: false,
    repeated: false,
  });
  const handleCustomFieldClick = (customFieldName) => {
    props.onSelect(customFieldName, values, setValues);
  };
  if (props.preview) {
    return (
      <SingleLine values={values}
        setValues={setValues}
        onDelete={props.onDelete}
        onSelect={() => handleCustomFieldClick('singleLine')}
      />
    )
  }
  return <SingleLineSettings values={values} setValues={setValues}/>
};

export {
  SingleLine,
  MultiLine,
  Date,
  DateTime,
  DropDown,
  RadioButtons,
  Checkboxes,
  FileUpload,
  SingleLineSettings,
  MultiLineSettings,
  DateSettings,
  DateTimeSettings,
  DropDownSettings,
  RadioButtonsSettings,
  CheckboxesSettings,
  FileUploadSettings,
  SingleLineIntegrated
};
