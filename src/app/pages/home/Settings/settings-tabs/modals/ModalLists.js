/* eslint-disable no-restricted-imports */
import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  FormLabel,
  FormGroup,
  TextField,
  InputLabel,
  FormControl,
  MenuItem,
  Checkbox,
  Fab
} from "@material-ui/core";
import { isEmpty, omit } from 'lodash';
import Select from 'react-select';
import {
  withStyles,
  useTheme,
  makeStyles
} from "@material-ui/core/styles";
import { useDispatch } from 'react-redux';
import { actions } from '../../../../../store/ducks/general.duck';
import SwipeableViews from "react-swipeable-views";
import CloseIcon from "@material-ui/icons/Close";
import CustomFields from '../../../Components/CustomFields/CustomFields';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TreeView from '../../../Components/TreeViewComponent';

// import './ModalAssetCategories.scss';
import ImageUpload from '../../../Components/ImageUpload';
import { postDBEncryptPassword, getDB, getOneDB, updateDB, postDB } from '../../../../../crud/api';
import ModalYesNo from '../../../Components/ModalYesNo';
import Permission from '../../components/Permission';
import { getFileExtension, saveImage, getImageURL } from '../../../utils';

import {
  SingleLine,
  MultiLine,
  Date,
  DateTime,
  DropDown,
  RadioButtons,
  Checkboxes,
  FileUpload
} from '../../../Components/CustomFields/CustomFieldsPreview';
import { EditorState } from 'draft-js';

import LocationAssignment from '../../components/LocationAssignment';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';

const CustomFieldsPreview = (props) => {
  const customFieldsPreviewObj = {
    singleLine: <SingleLine { ...props } />,
    multiLine: <MultiLine { ...props } />,
    date: <Date { ...props } />,
    dateTime: <DateTime { ...props } />,
    dropDown: <DropDown { ...props } />,
    radioButtons: <RadioButtons { ...props } />,
    checkboxes: <Checkboxes { ...props } />,
    fileUpload: <FileUpload { ...props } />
  };
  return customFieldsPreviewObj[props.type];
};

// Example 5 - Modal
const styles5 = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2)
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
});

const DialogTitle5 = withStyles(styles5)(({ children, classes, onClose }) => {
  return (
    <DialogTitle disableTypography className={classes.root}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="Close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
});

const DialogContent5 = withStyles(theme => ({
  root: {
    padding: theme.spacing(2)
  }
}))(DialogContent);

const DialogActions5 = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(1)
  }
}))(DialogActions);

// Example 4 - Tabs
function TabContainer4({ children, dir }) {
  return (
    <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}
const useStyles4 = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 2000
  }
}));

// Example 1 - TextField
const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 600
  },
  dense: {
    marginTop: 19
  },
  menu: {
    width: 600
  }
}));

const ModalLists = ({ showModal, setShowModal, reloadTable, id, employeeProfileRows }) => {
  const dispatch = useDispatch();
  const { setAlertControls } = actions;
  // Example 4 - Tabs
  const classes4 = useStyles4();
  const theme4 = useTheme();
  const [value4, setValue4] = useState(0);
  function handleChange4(event, newValue) {
    setValue4(newValue);
  }
  function handleChangeIndex4(index) {
    setValue4(index);
  }

  // Example 1 - TextField
  const classes = useStyles();
  const [editor, setEditor] = useState(EditorState.createEmpty());
  const [profileSelected, setProfileSelected] = useState(0);
  // const [layoutSelected, setLayoutSelected] = useState(0);

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleSave = () => {
    const { name, options } = values;
    if (!name.trim() || !options.length) {
      dispatch(
        setAlertControls({
          open: true,
          message: 'Select values before saving',
          type: 'warning'
        })
      );
      return;
    }
    const body = { ...values };
    if (!id) {
      postDB('settingsLists', body)
        .then(data => data.json())
        .then(response => {
          const { _id } = response.response[0];
          saveAndReload('settingsLists', _id);
        })
        .catch(error => console.log('ERROR', error));
    } else {
      updateDB('settingsLists/', body, id[0])
        .then(response => {
          saveAndReload('settingsLists', id[0]);
        })
        .catch(error => console.log(error));
    }
    handleCloseModal();
  };
  
  const saveAndReload = (folderName, id) => {
    reloadTable();
  };

  const handleCloseModal = () => {
    reset();
    setShowModal(false);
    setValue4(0);
  };
  const reset = () => {
    setValues({ 
      name: '',
      options: []
    });
  };

  useEffect(() => {
    if(!id || !Array.isArray(id)) {
      reset();
      // loadInitData();
      return;
    }
    
    getOneDB('settingsLists/', id[0])
      .then(response => response.json())
      .then(data => { 
        const values = omit(data.response, '_id');
        setValues(values);
      })
      .catch(error => console.log(error));
  }, [id, employeeProfileRows]);

  const [values, setValues] = useState({
    name: '',
    options: []
  });

  return (
    <div>
      <Dialog
        onClose={handleCloseModal}
        aria-labelledby="customized-dialog-title"
        open={showModal}
      >
        <DialogTitle5
          id="customized-dialog-title"
          onClose={handleCloseModal}
        >
          {`${id ? 'Edit' : 'Add' } List`}
        </DialogTitle5>
        <DialogContent5 dividers>
          <div className="kt-section__content">
            <div style={{ minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }} className="profile-tab-wrapper">
              <div style={{ margin: '0px 8px' }}>
                <TextField
                  label={'Name'}
                  style={{marginTop: '-20px', width: '300px'}}
                  value={values.name}
                  onChange={handleChange('name')}
                  margin="normal"
                />
                <ListContent values={values} setValues={setValues} />
              </div>
            </div>
          </div>
        </DialogContent5>
        <DialogActions5>
          <Button onClick={handleSave} color="primary">
            Save changes
          </Button>
        </DialogActions5>
      </Dialog>    
    </div>
  )
};

const ListContent = (props) => {
  const defaultValues = {
    newOption: '',
    options: ['Option 1', 'Option 2', 'Option 3'],
  };
  const [values, setValues] = useState(defaultValues);
  const handleOnChange = name => e => {
    let newValue = e.target.value;
    if (newValue === 'mandatory') newValue = !values.mandatory;
    setValues({
      ...values,
      [name]: newValue
    })
  };
  const handleAddOption = () => {
    if (!values.newOption)  return;
    const options = [values.newOption, ...values.options];
    setValues({ ...values, options, newOption: '' });
    props.setValues(prev => ({ ...prev, options }));
  };
  const handleDeleteOption = (ix) => {
    const options = [...values.options];
    options.splice(ix, 1);
    setValues({ ...values, options });
    props.setValues(prev => ({ ...prev, options }));
  };
  const handleMoveOption = (ix, direction = 'up') => {
    const options = [...values.options];
    const opt = options[ix];
    const offset = direction === 'up' ? -1 : 2;
    options.splice(ix + offset, 0, opt);
    const delFactor = direction === 'up' ? ix + 1 : ix;
    options.splice(delFactor, 1);
    setValues({ ...values, options });
    props.setValues(prev => ({ ...prev, options }));
  };
  useEffect(() => {
    if (!isEmpty(props.values.options)) {
      setValues(prev => ({ ...prev, options: props.values.options }));
    } else {
      setValues(defaultValues);
    }
  }, [props.values.options]);

  return (
    <div className="custom-field-settings-wrapper__options-content">
      <FormLabel component="legend">Elements</FormLabel>
      <div className="custom-field-settings-wrapper__add-option-wrapper">
        <TextField
          className="custom-field-settings-wrapper__add-option"
          label="Add Element"
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
  );
};

export default ModalLists;
