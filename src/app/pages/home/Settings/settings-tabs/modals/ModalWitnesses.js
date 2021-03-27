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
  TextField
} from "@material-ui/core";
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
    width: 1000
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
    width: 200
  },
  dense: {
    marginTop: 19
  },
  menu: {
    width: 200
  }
}));

const ModalWitnesses = ({ showModal, setShowModal, reloadTable, id, employeeProfileRows }) => {
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
    const { description, userSelected, location: { locationSelected } } = values;
    if (!description || !userSelected || !locationSelected) {
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
      postDB('settingsWitnesses', body)
        .then(data => data.json())
        .then(response => {
          const { _id } = response.response[0];
          saveAndReload('settingsWitnesses', _id);
        })
        .catch(error => console.log('ERROR', error));
    } else {
      updateDB('settingsWitnesses/', body, id[0])
        .then(response => {
          saveAndReload('settingsWitnesses', id[0]);
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
      description: '',
      user: [],
      userSelected: 0,
      location: {}
    });
  };

  useEffect(() => {
    if(!id || !Array.isArray(id)) {
      reset();
      loadInitData();
      return;
    }
    
    getOneDB('settingsWitnesses/', id[0])
      .then(response => response.json())
      .then(data => { 
        const values = data.response;
        setValues(values);
      })
      .catch(error => console.log(error));
  }, [id, employeeProfileRows]);

  let locations;
  const [locationsTree, setLocationsTree] = useState({});
  const loadInitData = (collectionNames = ['locationsReal', 'user', 'categories']) => {
    collectionNames =  !Array.isArray(collectionNames) ? [collectionNames] : collectionNames;
    collectionNames.forEach(collectionName => {
      getDB(collectionName)
      .then(response => response.json())
      .then(data => {
        if (collectionName === 'locationsReal') {
          locations = data.response.map(res => ({ ...res, id: res._id }));
          const homeLocations = data.response.filter(loc => loc.profileLevel === 0);
          const children = constructLocationTreeRecursive(homeLocations);
          locationsTreeData.children = children;
          setLocationsTree(locationsTreeData);
        }
        if (collectionName === 'user') {
          const user = data.response.map(({ _id: value, email: label }) => ({ value, label }));
          setValues(prev => ({ ...prev, user }));
        }
        if (collectionName === 'categories') {
          const categories = data.response.map(({ _id: value, name: label }) => ({ value, label }));
          setValues(prev => ({ ...prev, categories }));
        }
      })
      .catch(error => console.log('error>', error));
    });
  };

  const locationsTreeData = {
    id: 'root',
    name: 'Locations',
    profileLevel: -1,
    parent: null
  };
  const constructLocationTreeRecursive = (locs) => {
    if (!locs || !Array.isArray(locs) || !locs.length) return [];
    let res = [];
    locs.forEach((location) => {
      const locObj = (({_id: id, name, profileLevel, parent}) => ({id, name, profileLevel, parent}))(location);
      const children = locations.filter(loc => loc.parent === locObj.id);
      locObj.children = constructLocationTreeRecursive(children);
      res.push(locObj);
    });
    return res;
  };

  const [values, setValues] = useState({
    description: '',
    user: [],
    userSelected: 0,
    location: {}
  });

  const handleSetProfileLocationFilter = (locationSelected, _, __, locationName) => {
    if (locationSelected.length !== 24) {
      locationSelected = '';
    }
    setValues(prev => ({ ...prev, location: { locationSelected, locationName } }))
  };

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
          {`${id ? 'Edit' : 'Add' } Witnesses`}
        </DialogTitle5>
        <DialogContent5 dividers>
          <div className="kt-section__content">
            <div style={{ minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }} className="profile-tab-wrapper">
              <div className={classes.textField}>
                <TextField
                  label={'Description'}
                  style={{marginTop: '-20px', width: '200px'}}
                  value={values.description}
                  onChange={handleChange('description')}
                  margin="normal"
                />
              </div>
              <div style={{ marginTop: '30px' }} className={classes.textField}>
                <FormLabel style={{marginTop: '0px'}} component="legend">User Finder</FormLabel>
                <FormGroup>
                  <Select
                    onChange={userSelected => setValues(prev => ({ ...prev, userSelected }))}
                    value={values.userSelected}
                    classNamePrefix="select"
                    isClearable={true}
                    name="color"
                    options={values.user}
                  />
                </FormGroup>
              </div>
              <div style={{ margin: '30px 8px' }}>
                <FormLabel style={{marginTop: '0px'}} component="legend">Location Finder</FormLabel>
                <TreeView data={locationsTree} onClick={handleSetProfileLocationFilter} />
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

export default ModalWitnesses;
