import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  Checkbox,
  Fab,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  IconButton,
  InputAdornment, 
  InputLabel,
  MenuItem,
  makeStyles,
  Radio,
  RadioGroup,
  Select,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import {
  ContentState,
  convertToRaw,
  EditorState,
} from 'draft-js';
import { v4 as uuidv4 } from 'uuid';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { Editor } from 'react-draft-wysiwyg';
import { isEmpty } from 'lodash';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import EmailOutlinedIcon from '@material-ui/icons/EmailOutlined';
import LinkIcon from '@material-ui/icons/Link';
import HelpIcon from '@material-ui/icons/Help';

import { postFILE } from '../../../../../crud/api';
import ImageUpload from '../../../Components/ImageUpload';
import { getFileExtension, saveImage, getImageURL } from '../../../utils';
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
    if (isPreview)  return;
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
    fileName: '', 
    fileId: uuidv4().split('-').pop(),
    fileExt: ''
  };
  const [values, setValues] = useState(defaultValues);
  const handleCustomFieldClick = () => {
    props.onSelect(props.id, 'fileUpload', values, setValues);
  };
  useEffect(() => {
    if (!isEmpty(props.values)) {      
      if(!props.values.fileName){
        const newValues = {...props.values, fileId: uuidv4().split('-').pop()};
        setValues(newValues);
      } else {
        setValues(props.values);
      }
    } else {
      setValues(defaultValues);
    }
  }, [props.values]);

  const [isPreview, setIsPreview] = useState(true);
  useEffect(() => setIsPreview(!props.from), [props.from]);
  const handleOnChange = e => {
    if (isPreview)  return;
    const fileExt = e.target.files[0].type.split('/')[1];
    setValues({ ...values, fileName: e.target.files[0].name, fileExt });
    postFILE('customFields', values.fileId, e.target.files[0]);
    props.onUpdateCustomField(props.tab.key, props.id, props.columnIndex, { ...values, fileName: e.target.files[0].name, fileExt});
  };
  return (
    <div className={`custom-field-${isPreview ? 'preview' : 'real'}-wrapper`} onClick={handleCustomFieldClick}>
      <div style={{ display:'flex', flexDirection: 'column'}}>
        <h4 className="image-upload-wrapper__picture-title" style={{marginBottom: '10px'}}>{values.fieldName}</h4>
        <div style={{ display:'flex', alignItems:'center'}}>
          <Button
            variant="contained"
            color="secondary"
            style={{width: '10px'}}
            onClick={() => setValues({...values, fileName: '', file: '', })}
          >
            <DeleteIcon />
          </Button>
          <input type="file" name="myImage" title="" style={{marginLeft: '10px',color:'transparent', width:'90px'}} onChange={handleOnChange}/>
        </div>
          <Button
            variant="contained"
            style={{marginTop: '10px'}}
            disableElevation
            disabled={!values.fileName}
            href={values.fileId && values.fileExt ? getImageURL(values.fileId, 'customFields', values.fileExt) : null}
          >
            {values.fileName || 'First choose a File '}
          </Button>  
      </div>
      { isPreview &&
        <IconButton aria-label="Delete" size="medium" className="custom-field-preview-wrapper__delete-icon" onClick={props.onDelete}>
          <DeleteIcon fontSize="inherit" />
        </IconButton>
      }
    </div>
  )
};

const Currency = (props) => {
  const defaultValues = {
    fieldName: 'Currency',
    initialValue: 0,
  };
  const [values, setValues] = useState(defaultValues);
  const handleCustomFieldClick = () => {
    props.onSelect(props.id, 'currency', values, setValues);
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
      <div className={'error-wrapper'}>
        <TextField
          className={`custom-field-${isPreview ? 'preview' : 'real'}-wrapper__single-line`}
          label={values.fieldName}
          type="number"
          margin="normal"
          style={{
            width: '100%'
          }}
          InputProps={{
            startAdornment: <InputAdornment position="start"> $ </InputAdornment>
          }}
          inputProps={{
            min: 0,
          }}
          value={values.initialValue}
          onChange={handleOnChange}
        />
        <span style={{ display: 'flex', justifyContent: 'start', color: 'red' }}>
          {values.initialValue >= 0 ? null : "Currency can't be negative"}
        </span>
      </div>
      { isPreview &&
        <IconButton aria-label="Delete" size="medium" className="custom-field-preview-wrapper__delete-icon" onClick={props.onDelete}>
          <DeleteIcon fontSize="inherit" />
        </IconButton>
      }
    </div>
  )
};

const Percentage = (props) => {
  const defaultValues = {
    fieldName: 'Percentage',
    initialValue: 0,
  };
  const [values, setValues] = useState(defaultValues);
  const handleCustomFieldClick = () => {
    props.onSelect(props.id, 'percentage', values, setValues);
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
      <div className={'error-wrapper'}>
        <TextField
          className={`custom-field-${isPreview ? 'preview' : 'real'}-wrapper__single-line`}
          label={values.fieldName}
          type="number"
          margin="normal"
          style={{
            width: '100%'
          }}
          InputProps={{
            startAdornment: <InputAdornment position="start"> % </InputAdornment>
          }}
          inputProps={{
            min: 0,
            max: 100,
          }}
          value={values.initialValue}
          onChange={handleOnChange}
        />
        <span style={{ display: 'flex', justifyContent: 'start', color: 'red' }}>
            {values.initialValue >= 0 && values.initialValue <= 100 ? null : 'Please select a valid percentage between 0% and 100%'}
        </span>
      </div>
      { isPreview &&
        <IconButton aria-label="Delete" size="medium" className="custom-field-preview-wrapper__delete-icon" onClick={props.onDelete}>
          <DeleteIcon fontSize="inherit" />
        </IconButton>
      }
    </div>
  )
};

const Email = (props) => {
  const defaultValues = {
    fieldName: 'Email',
    initialValue: '',
  };
  const [values, setValues] = useState(defaultValues);
  const handleCustomFieldClick = () => {
    props.onSelect(props.id, 'email', values, setValues);
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
      <div className={'error-wrapper'}>
      <TextField
        className={`custom-field-${isPreview ? 'preview' : 'real'}-wrapper__single-line`}
        label={values.fieldName}
        type="text"
        margin="normal"
        value={values.initialValue}
        onChange={handleOnChange}
        InputProps={{
          startAdornment:
            <InputAdornment position="start">
              <EmailOutlinedIcon style={{ fill: 'grey' }} />
            </InputAdornment>
        }}
      />
      <span style={{ display: 'flex', justifyContent: 'start', color: 'red' }}>
            {/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.initialValue) || !values.initialValue ? null : 'Please enter a valid email'}
        </span>
      </div>
      { isPreview &&
        <IconButton aria-label="Delete" size="medium" className="custom-field-preview-wrapper__delete-icon" onClick={props.onDelete}>
          <DeleteIcon fontSize="inherit" />
        </IconButton>
      }
    </div>
  )
};

const Decimal = (props) => {
  const defaultValues = {
    fieldName: 'Decimal',
    initialValue: 0,
  };
  const [values, setValues] = useState(defaultValues);
  const handleCustomFieldClick = () => {
    props.onSelect(props.id, 'decimal', values, setValues);
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
      <div className={'error-wrapper'}>
        <TextField
          className={`custom-field-${isPreview ? 'preview' : 'real'}-wrapper__single-line`}
          label={values.fieldName}
          type="number"
          margin="normal"
          style={{
            width: '100%'
          }}
          inputProps={{
            step: '0.01',
            placeholder: '0.00'
          }}
          value={values.initialValue}
          onChange={handleOnChange}
        />
      </div>
      { isPreview &&
        <IconButton aria-label="Delete" size="medium" className="custom-field-preview-wrapper__delete-icon" onClick={props.onDelete}>
          <DeleteIcon fontSize="inherit" />
        </IconButton>
      }
    </div>
  )
};

const URL = (props) => {
  const defaultValues = {
    fieldName: 'URL',
    initialValue: '',
  };
  const [values, setValues] = useState(defaultValues);
  const handleCustomFieldClick = () => {
    props.onSelect(props.id, 'url', values, setValues);
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
      <div className={'error-wrapper'}>
      <TextField
        className={`custom-field-${isPreview ? 'preview' : 'real'}-wrapper__single-line`}
        label={values.fieldName}
        type="text"
        margin="normal"
        value={values.initialValue}
        onChange={handleOnChange}
        InputProps={{
          startAdornment:
            <InputAdornment position="start">
              <LinkIcon style={{ fill: 'grey' }} />
            </InputAdornment>
        }}
      />
      <span style={{ display: 'flex', justifyContent: 'start', color: 'red' }}>
            {/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/.test(values.initialValue) || !values.initialValue ? null : 'Please enter a valid URL'}
        </span>
      </div>
      { isPreview &&
        <IconButton aria-label="Delete" size="medium" className="custom-field-preview-wrapper__delete-icon" onClick={props.onDelete}>
          <DeleteIcon fontSize="inherit" />
        </IconButton>
      }
    </div>
  )
};

const Image = (props) => {
  const defaultValues = {
    fieldName: 'Image Upload',
    initialValue: '',
    fileName: uuidv4().split('-').pop(),
  };
  const [values, setValues] = useState(defaultValues);
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const handleCustomFieldClick = () => {
    props.onSelect(props.id, 'imageUpload', values, setValues);
  };

  useEffect(() => {
    if (!isEmpty(props.values)) {      
      if(!props.values.fileName){
        const newValues = {...props.values, fileName: uuidv4().split('-').pop()};
        setValues(newValues);
      } else {
        setValues(props.values);
      }
    } else {
      setValues(defaultValues);
    }
  }, [props.values]);

  useEffect(() => {
    setTimeout(() => {
      setImageURL(getImageURL(values.fileName, 'customFields', values.initialValue));
    }, 1000);
  }, [values]);

  const isFirstRun = useRef(true);
  
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    saveImage(image, 'customFields', values.fileName);
    const fileExt = getFileExtension(image);
    setValues({ ...values, initialValue: fileExt });
    props.onUpdateCustomField(props.tab.key, props.id, props.columnIndex, { ...values, initialValue: fileExt });
  }, [image]);

  const [isPreview, setIsPreview] = useState(true);
  useEffect(() => setIsPreview(!props.from), [props.from]);

  return (
    <div className={`custom-field-${isPreview ? 'preview' : 'real'}-wrapper`} onClick={handleCustomFieldClick}>
        <ImageUpload setImage={setImage} image={imageURL} disabled={isPreview}>
          {values.fieldName}
        </ImageUpload>
      { isPreview &&
        <IconButton aria-label="Delete" size="medium" className="custom-field-preview-wrapper__delete-icon" onClick={props.onDelete}>
          <DeleteIcon fontSize="inherit" />
        </IconButton>
      }
    </div>
  )
};

const DecisionBox = (props) => {
  const defaultValues = {
    fieldName: 'Decision Box',
    selectedItem: '',
    options: ['Switch 1', 'Switch 2', 'Switch 3']
  };
  const [values, setValues] = useState(defaultValues);
  const handleCustomFieldClick = () => {
    props.onSelect(props.id, 'decisionBox', values, setValues);
  };
  const handleCheck = (index) => {
    if (isPreview)  return;
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
  return (
    <div className={`custom-field-${isPreview ? 'preview' : 'real'}-wrapper`} onClick={handleCustomFieldClick}>
      <FormControl component="fieldset">
        <FormLabel component="legend">{values.fieldName}</FormLabel>
        <FormGroup>
          {values.options.map((opt, ix) => (
            <FormControlLabel
              key={`check-${ix}`}
              control={<Switch checked={values[`check${ix}`] || false} onChange={() => handleCheck(ix)} value={ix} />}
              label={opt}
            />
          ))}
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

const RichText = (props) => {
  const defaultValues = {
    fieldName: 'Rich Text',
    initialValue: '',
  };
  const [values, setValues] = useState(defaultValues);
  const [editor, setEditor] = useState(EditorState.createEmpty());
  const handleCustomFieldClick = () => {
    props.onSelect(props.id, 'richText', values, setValues);
  };
  useEffect(() => {
    if (!isEmpty(props.values)) {
      setValues(props.values);
      const contentBlock = htmlToDraft(props.values.initialValue);
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      setEditor(EditorState.createWithContent(contentState));
    } else {
      setValues(defaultValues);
    }
  }, [props.values]);

  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    const html = draftToHtml(convertToRaw(editor.getCurrentContent()));
    setValues(prev => ({ ...prev, initialValue: html}));
    if(typeof props.onUpdateCustomField === 'function'){
      props.onUpdateCustomField(props.tab.key, props.id, props.columnIndex, { ...values, initialValue: html });
    }
  }, [editor])

  const [isPreview, setIsPreview] = useState(true);
  useEffect(() => setIsPreview(!props.from), [props.from]);
  
  return (
    <div className={`custom-field-${isPreview ? 'preview' : 'real'}-wrapper`} onClick={handleCustomFieldClick}>
      <div className='editor-general-container'>
        <FormLabel component="legend">{values.fieldName}</FormLabel>
        <Editor
          editorClassName='editorClassName'
          editorState={editor}
          onEditorStateChange={(ed) => setEditor(ed)}
          toolbarClassName='toolbarClassName'
          wrapperClassName='editor-wrapper'
        />
      </div>
      { isPreview &&
        <IconButton aria-label="Delete" size="medium" className="custom-field-preview-wrapper__delete-icon" onClick={props.onDelete}>
          <DeleteIcon fontSize="inherit" />
        </IconButton>
      }
    </div>
  )
};

const Formula = (props) => {
  const useStyles = makeStyles({
    typography: {
      whiteSpace: 'pre-line',
    }
  });
  const defaultValues = {
    fieldName: 'Numeric Formula',
    initialValue: '',
  };
  const helpMessage = "To add any other CustomField to the Formula just insert its id as a variable, for example: \n 2 + Custom_Field_id";
  const [values, setValues] = useState(defaultValues);
  const [isPreview, setIsPreview] = useState(true);
  const [formulaResult, setFormulaResult] = useState('Error');
  const [readableFormula, setReadableFormula] = useState(values.initialValue);

  const handleCustomFieldClick = () => {
    props.onSelect(props.id, 'formula', values, setValues);
  };
  const handleOnChange = e => {
    if (isPreview)  return;
    setValues({ ...values, initialValue: e.target.value });
    props.onUpdateCustomField(props.tab.key, props.id, props.columnIndex, { ...values, initialValue: e.target.value });
  };

  const showResult = (rawExpression) => {
    let readable = [];
    const expression = rawExpression.replace(/\s/g, '').replace(/(?:,| |\+|-|\*|\|\/|\(|\))+/g, (e) => `,${e},` ).split(',');
    const toEval = expression.map((e) => {
      var element = props.data.find((pos) => pos.id === e);
      if(element){
        element.values.fieldName ? readable.push(element.values.fieldName) : readable.push(element.content)
      } else {
        readable.push(e);
      }
      return element ? element.values.initialValue || 0 : e;
    });
    let result = "Error: There might be something wrong with the formula or the field's id";
    try {
      result = eval(toEval.join(''));
    } catch (error) {}
    return [result, readable.join(' ')];
  };

  useEffect(() => {
    const result = showResult(values.initialValue);
    setFormulaResult(result[0]);
    setReadableFormula(result[1]);
  }, [values.initialValue]);

  useEffect(() => {
    if (!isEmpty(props.values)) {
      setValues(props.values);
    } else {
      setValues(defaultValues);
    }
  }, [props.values]);
  useEffect(() => setIsPreview(!props.from), [props.from]);

  const classes = useStyles();
  return (
    <div className={`custom-field-${isPreview ? 'preview' : 'real'}-wrapper`} onClick={handleCustomFieldClick}>
      <TextField
        className={`custom-field-${isPreview ? 'preview' : 'real'}-wrapper__single-line`}
        label={values.fieldName}
        type="text"
        margin="normal"
        value={isPreview ? values.initialValue : formulaResult}
        InputProps={{
          startAdornment:
          <Tooltip arrow title={<Typography className={classes.typography}>{readableFormula}</Typography>} className='custom-field-help-tooltip'>
            <InputAdornment position="start">
              F(x)
            </InputAdornment>
          </Tooltip>
        }}
        onChange={handleOnChange}
      />
      { isPreview &&(
        <>
        <Tooltip arrow title={<Typography className={classes.typography}>{helpMessage}</Typography>} className='custom-field-help-tooltip'>
          <HelpIcon className='custom-field-help-tooltip__icon'/>
        </Tooltip>
        <IconButton aria-label="Delete" size="medium" className="custom-field-preview-wrapper__delete-icon" onClick={props.onDelete}>
          <DeleteIcon fontSize="inherit" />
        </IconButton>
        </>
      )}
    </div>
  )
};

const DateFormula = (props) => {
  const useStyles = makeStyles({
    typography: {
      whiteSpace: 'pre-line',
    }
  });
  const defaultValues = {
    fieldName: 'Date Formula',
    initialValue: '',
  };
  const helpMessage = "To add any other CustomField to the Formula just insert its id as a variable, for example: \n 2 + Custom_Field_id"  
  const [values, setValues] = useState(defaultValues);
  const [isPreview, setIsPreview] = useState(true);
  const [formulaResult, setFormulaResult] = useState('Error');
  const [readableFormula, setReadableFormula] = useState(values.initialValue);

  const handleCustomFieldClick = () => {
    props.onSelect(props.id, 'dateFormula', values, setValues);
  };
  const handleOnChange = e => {
    if (isPreview)  return;
    setValues({ ...values, initialValue: e.target.value });
    props.onUpdateCustomField(props.tab.key, props.id, props.columnIndex, { ...values, initialValue: e.target.value });
  };

  const showResult = (rawExpression) => {
    let readable = [];
    const expression = rawExpression.replace(/\s/g, '').replace(/(?:,| |\+|-|\*|\/|\(|\))+/g, (e) => `,${e},` ).split(',');
    const toEval = expression.map((e) => {
      var element = props.data.find((pos) => pos.id === e);
      if(element){
        element.values.fieldName ? readable.push(element.values.fieldName) : readable.push(element.content)
      } else {
        readable.push(e);
      }
      return element ? element.values.initialValue || 0 : e;
    });
    let result = "Error: There might be something wrong with the formula or the field's id";
    try {
      result = eval(toEval.join(''));
    } catch (error) {}
    return [result, readable.join(' ')]
  };

  useEffect(() => {
    const result = showResult(values.initialValue);
    setFormulaResult(result[0]);
    setReadableFormula(result[1]);
  }, [values.initialValue]);

  useEffect(() => {
    if (!isEmpty(props.values)) {
      setValues(props.values);
    } else {
      setValues(defaultValues);
    }
  }, [props.values]);
  useEffect(() => setIsPreview(!props.from), [props.from]);

  const classes = useStyles();
  return (
    <div className={`custom-field-${isPreview ? 'preview' : 'real'}-wrapper`} onClick={handleCustomFieldClick}>
      <TextField
        className={`custom-field-${isPreview ? 'preview' : 'real'}-wrapper__single-line`}
        label={values.fieldName}
        type="text"
        margin="normal"
        value={isPreview ? values.initialValue : formulaResult}
        InputProps={{
          startAdornment:
          <Tooltip arrow title={<Typography className={classes.typography}>{readableFormula}</Typography>} className='custom-field-help-tooltip'>
            <InputAdornment position="start">
              F(x)
            </InputAdornment>
          </Tooltip>
        }}
        onChange={handleOnChange}
      />
      { isPreview &&(
        <>
        <Tooltip arrow title={<Typography className={classes.typography}>{helpMessage}</Typography>} className='custom-field-help-tooltip'>
          <HelpIcon className='custom-field-help-tooltip__icon'/>
        </Tooltip>
        <IconButton aria-label="Delete" size="medium" className="custom-field-preview-wrapper__delete-icon" onClick={props.onDelete}>
          <DeleteIcon fontSize="inherit" />
        </IconButton>
        </>
      )}
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
        <div className="custom-field-settings-wrapper__field-id-wrapper">
          <Typography className="custom-field-settings-wrapper__field-id" >
            Id: {props.id}
          </Typography>
        </div>
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
        <div className="custom-field-settings-wrapper__field-id-wrapper">
          <Typography className="custom-field-settings-wrapper__field-id" >
            Id: {props.id}
          </Typography>
        </div>
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
        <div className="custom-field-settings-wrapper__field-id-wrapper">
          <Typography className="custom-field-settings-wrapper__field-id" >
            Id: {props.id}
          </Typography>
        </div>
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

const CurrencySettings = (props) => {
  const defaultValues = {
    fieldName: 'Currency',
    initialValue: '',
    mandatory: false,
  };
  const [values, setValues] = useState(defaultValues);

  const handleOnChange = name => e => {
    let newValue = e.target.value;
    if (newValue === 'mandatory') newValue = !values.mandatory;
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
        <div className="custom-field-settings-wrapper__field-id-wrapper">
          <Typography className="custom-field-settings-wrapper__field-id" >
            Id: {props.id}
          </Typography>
        </div>
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

const PercentageSettings = (props) => {
  const defaultValues = {
    fieldName: 'Percentage',
    initialValue: '',
    mandatory: false,
  };
  const [values, setValues] = useState(defaultValues);

  const handleOnChange = name => e => {
    let newValue = e.target.value;
    if (newValue === 'mandatory') newValue = !values.mandatory;
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
        <div className="custom-field-settings-wrapper__field-id-wrapper">
          <Typography className="custom-field-settings-wrapper__field-id" >
            Id: {props.id}
          </Typography>
        </div>
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

const EmailSettings = (props) => {
  const defaultValues = {
    fieldName: 'Email',
    initialValue: '',
    mandatory: false,
  };
  const [values, setValues] = useState(defaultValues);

  const handleOnChange = name => e => {
    let newValue = e.target.value;
    if (newValue === 'mandatory') newValue = !values.mandatory;
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

const DecimalSettings = (props) => {
  const defaultValues = {
    fieldName: 'Decimal',
    initialValue: '0.00',
    mandatory: false,
  };
  const [values, setValues] = useState(defaultValues);

  const handleOnChange = name => e => {
    let newValue = e.target.value;
    if (newValue === 'mandatory') newValue = !values.mandatory;
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
        <div className="custom-field-settings-wrapper__field-id-wrapper">
          <Typography className="custom-field-settings-wrapper__field-id" >
            Id: {props.id}
          </Typography>
        </div>
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

const URLSettings = (props) => {
  const defaultValues = {
    fieldName: 'URL',
    initialValue: '',
    mandatory: false,
  };
  const [values, setValues] = useState(defaultValues);

  const handleOnChange = name => e => {
    let newValue = e.target.value;
    if (newValue === 'mandatory') newValue = !values.mandatory;
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

const ImageSettings = (props) => {
  const defaultValues = {
    fieldName: 'Image Upload',
    mandatory: false,
  };
  const [values, setValues] = useState(defaultValues);

  const handleOnChange = name => e => {
    let newValue = e.target.value;
    if (newValue === 'mandatory') newValue = !values.mandatory;
    setValues({
      ...values,
      [name]: newValue
    });
    if (name === 'fieldName') {
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

const DecisionBoxSettings = (props) => {
  const defaultValues = {
    fieldName: 'Decision Box',
    newOption: '',
    options: ['Switch 1', 'Switch 2', 'Switch 3'],
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

const RichTextSettings = (props) => {
  const defaultValues = {
    fieldName: 'Rich Text',
    mandatory: false,
  };
  const [values, setValues] = useState(defaultValues);

  const handleOnChange = name => e => {
    let newValue = e.target.value;
    if (newValue === 'mandatory') newValue = !values.mandatory;
    setValues({
      ...values,
      [name]: newValue
    });
    if (name === 'fieldName') {
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

const FormulaSettings = (props) => {
  const defaultValues = {
    fieldName: 'Numeric Formula',
    initialValue: '',
    mandatory: false,
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

const DateFormulaSettings = (props) => {
  const defaultValues = {
    fieldName: 'Date Formula',
    initialValue: '',
    mandatory: false,
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
  Currency,
  Percentage,
  Email,
  Decimal,
  URL,
  Image,
  DecisionBox,
  RichText,
  Formula,
  DateFormula,
  SingleLineSettings,
  MultiLineSettings,
  DateSettings,
  DateTimeSettings,
  DropDownSettings,
  RadioButtonsSettings,
  CheckboxesSettings,
  FileUploadSettings,
  CurrencySettings,
  PercentageSettings,
  EmailSettings,
  DecimalSettings,
  URLSettings,
  ImageSettings,
  DecisionBoxSettings,
  RichTextSettings,
  FormulaSettings,
  DateFormulaSettings,
  SingleLineIntegrated
};
