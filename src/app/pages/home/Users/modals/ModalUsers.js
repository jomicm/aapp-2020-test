/* eslint-disable no-restricted-imports */
import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Tab,
  Tabs,
  Paper,
  TextField,
  FormControl,
  FormLabel,
  FormGroup
} from "@material-ui/core";
import Select from 'react-select';
import {
  withStyles,
  useTheme,
  makeStyles
} from "@material-ui/core/styles";
import SwipeableViews from "react-swipeable-views";
import CloseIcon from "@material-ui/icons/Close";
import { isEmpty, isNil, falsy } from 'lodash';
import CustomFields from '../../Components/CustomFields/CustomFields';
import FieldValidator from '../../Components/FieldValidator/FieldValidator';

// import './ModalAssetCategories.scss';
import ImageUpload from '../../Components/ImageUpload';
import { postDBEncryptPassword, getOneDB, updateDB } from '../../../../crud/api';
import ModalYesNo from '../../Components/ModalYesNo';
import Permission from '../components/Permission';
import { getFileExtension, saveImage, getImageURL } from '../../utils';
import * as auth from "../../../../store/ducks/auth.duck";
import { modules } from '../../constants';

import {
  SingleLine,
  MultiLine,
  Date,
  DateTime,
  DropDown,
  RadioButtons,
  Checkboxes,
  FileUpload
} from '../../Components/CustomFields/CustomFieldsPreview';

import LocationAssignment from '../components/LocationAssignment';

// Hooks
import { useFieldValidator } from '../../Components/FieldValidator/hooks';

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

const ModalUsers = ({ showModal, setShowModal, reloadTable, id, userProfileRows, user, updateUserPic }) => {
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
  const [values, setValues] = useState({
    name: "",
    lastName: '',
    email: '',
    password: '',
    isDisableUserProfile: false,
    selectedUserProfile: null,
    categoryPic: '/media/misc/placeholder-image.jpg',
    categoryPicDefault: '/media/misc/placeholder-image.jpg'
  });
  const [profileSelected, setProfileSelected] = useState(0);

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleSave = () => {
    setFormValidation({ ...formValidation, enabled: true });
    if (!isEmpty(formValidation.isValidForm)) {
      alert('Please fill out missing fields')
      return;
    }

    const fileExt = getFileExtension(image);
    const body = { ...values, customFieldsTab, profilePermissions, locationsTable, fileExt };
    if (!id) {
      body.idUserProfile = idUserProfile;
      postDBEncryptPassword('user', body)
        .then(data => data.json())
        .then(response => {
          const { _id } = response.response[0];
          saveAndReload('user', _id);
        })
        .catch(error => console.log(error));
    } else {
      updateDB('user/', body, id[0])
        .then(response => {
          saveAndReload('user', id[0]);
          updateCurrentUserPic(id[0], fileExt);
        })
        .catch(error => {
          console.log(error)
        });
    }
    handleCloseModal();
  };

  const [image, setImage] = useState(null);
  const saveAndReload = (folderName, id) => {
    saveImage(image, folderName, id);
    reloadTable();
  };
  const updateCurrentUserPic = (editId, fileExt) => {
    if (user.id === editId) {
      let _v = getRandomArbitrary(1, 999);
      const defaultPic = `http://localhost:3000/media/misc/placeholder-image.jpg?v=${_v}`;
      const pic = fileExt ?
        `http://159.203.41.87:3001/uploads/user/${editId}.${fileExt}?v=${_v}` :
        defaultPic;
      setTimeout(() => updateUserPic(defaultPic), 250);
      setTimeout(() => updateUserPic(pic), 1000);
    }
  }

  function getRandomArbitrary(min, max) {
    return Math.ceil(Math.random() * (max - min) + min);
  }

  const handleCloseModal = () => {
    setCustomFieldsTab({});
    setProfilePermissions([]);
    setTabs([]);
    setProfileSelected(null);
    setValues({ 
      name: "",
      lastName: '',
      email: '',
      password: '',
      isDisableUserProfile: false,
      selectedUserProfile: null,
      categoryPic: '/media/misc/placeholder-image.jpg',
      categoryPicDefault: '/media/misc/placeholder-image.jpg'
    });
    setShowModal(false);
    setValue4(0);
    //
    setFormValidation({
      enabled: false,
      isValidForm: false
    });
    
  };

  const [userProfilesFiltered, setUserProfilesFiltered] = useState([]);

  useEffect(() => {
    const userProfiles = userProfileRows.map((profile, ix) => ({ value: profile.id, label: profile.name }));
    setUserProfilesFiltered(userProfiles);
    if (!id || !Array.isArray(id)) {
      return;
    }

    getOneDB('user/', id[0])
      .then(response => response.json())
      .then(data => { 
        const { name, lastName, email, customFieldsTab, profilePermissions, idUserProfile, locationsTable, fileExt } = data.response;
        setCustomFieldsTab(customFieldsTab);
        setProfilePermissions(profilePermissions);
        setProfileSelected(userProfilesFiltered.filter(profile => profile.value === idUserProfile));
        setLocationsTable(locationsTable || []);
        setValues({ 
          ...values,
          name,
          lastName,
          email,
          isDisableUserProfile: true,
          imageURL: getImageURL(id, 'user', fileExt)
        });
        //
        const tabs = Object.keys(customFieldsTab).map(key => ({ key, info: customFieldsTab[key].info, content: [customFieldsTab[key].left, customFieldsTab[key].right] }));
        tabs.sort((a, b) => a.key.split('-').pop() - b.key.split('-').pop());
        setCustomFieldsTab(customFieldsTab);
        setTabs(tabs);
      })
      .catch(error => console.log(error));
  }, [id, userProfileRows]);

  const [customFieldsTab, setCustomFieldsTab] = useState({});
  const [profilePermissions, setProfilePermissions] = useState({});
  const [tabs, setTabs] = useState([]);
  const [locationsTable, setLocationsTable] = useState([]);

  const handleSetPermissions = (key, checked) => {
    setProfilePermissions(prev => ({ ...prev, [key]: checked }));
  }

  const colourOptions = [
    { value: 'red', label: 'Red' },
    { value: 'black', label: 'Black' },
    { value: 'white', label: 'White' },
  ];

  const [idUserProfile, setIdUserProfile] = useState('');
  const onChangeUserProfile = e => {
    if (!e) {
      setCustomFieldsTab({});
      setProfilePermissions({});
      setTabs([]);
      return;
    }
    console.log('onChangeUserProfile>>>', e);
    setProfileSelected(e);
    getOneDB('userProfiles/', e.value)
    .then(response => response.json())
    .then(data => { 
      console.log(data.response);
      const { customFieldsTab, profilePermissions } = data.response;
      const tabs = Object.keys(customFieldsTab).map(key => ({ key, info: customFieldsTab[key].info, content: [customFieldsTab[key].left, customFieldsTab[key].right] }));
      tabs.sort((a, b) => a.key.split('-').pop() - b.key.split('-').pop());
      setCustomFieldsTab(customFieldsTab);
      setProfilePermissions(profilePermissions);
      setTabs(tabs);
      setIdUserProfile(e.value);
    })
    .catch(error => console.log(error));
  };

  // Function to update customFields
  const handleUpdateCustomFields = (tab, id, colIndex, CFValues) => {
    const colValue = ['left', 'right'];
    console.log('Looking for you', tab, id, colIndex, values);
    const customFieldsTabTmp = { ...customFieldsTab };

    const field = customFieldsTabTmp[tab][colValue[colIndex]]
      .find(cf => cf.id === id);
    field.values = CFValues;
  };

  const { fields, fieldsToValidate } = useFieldValidator('user');
  const [formValidation, setFormValidation] = useState({
    enabled: false,
    isValidForm: {}
  });

  const getBaseFields = () => {
    const baseFields = [
      { 
        component: 'dropSelect',
        id: 'userProfile',
        ownValidFn: () => !!idUserProfile,
        validationId: 'selectedUserProfile',
        componentProps: {
          isClearable: true,
          isDisabled: values.isDisableUserProfile,
          label: 'Profile Selected',
          onChange: onChangeUserProfile,
          options: userProfilesFiltered,
          value: profileSelected
        }
      },
      { id: 'name', validationId: 'name', component: 'textField', componentProps: { label: 'Name' } },
      { id: 'lastName', validationId: 'lastName', component: 'textField', componentProps: { label: 'Last Name' } },
      { id: 'email', validationId: 'email', component: 'textField', componentProps: { label: 'Email' } },
      { id: 'password', validationId: 'email', component: 'textField', componentProps: { label: 'Password' } },
    ];
    const baseProps = {
      // id: 'standard-name',
      className: classes.textField,
      margin: 'normal'
    }
    const baseComponents = {
      dropSelect: (props) => {
        return (
          <div className={props.className}>
            <FormLabel component="legend">{props.componentProps.label}</FormLabel>
            <FormGroup>
              <Select {...props.componentProps} />
            </FormGroup>
          </div>
        );},
      textField: (props) => {
        const componentProps = {...props, ...props.componentProps};

        return <TextField {...componentProps} />
      }
    };

    return baseFields.map(({ id, ownValidFn, component, componentProps, validationId }) => {
      const label = (fields || {})[id]?.caption || componentProps.label;
      const localComponentProps = { ...componentProps, label };
      const props = {...baseProps, value: values[id], onChange: handleChange(id), componentProps: localComponentProps };
      debugger
      const defaultVoidValidation = !!values[validationId];
      const isValid = (fieldsToValidate || []).includes(id) && (ownValidFn ? ownValidFn() : defaultVoidValidation);

      return (
        <FieldValidator
          formValidationState={[formValidation, setFormValidation]}
          // fieldsToValidate={fieldsToValidate}
          isValid={isValid}
          // validateField={fieldsToValidate).includes(id)}
          fieldName={id}
          // validationId={validationId}
          // values={values}
        >
          {baseComponents[component](props)}
        </FieldValidator>
      );
    });
  };

  return (
    <div style={{width:'1000px'}}>
      <Dialog
        onClose={handleCloseModal}
        aria-labelledby="customized-dialog-title"
        open={showModal}
      >
        <DialogTitle5
          id="customized-dialog-title"
          onClose={handleCloseModal}
        >
          {`${id ? 'Edit' : 'Add' } Users`}
        </DialogTitle5>
        <DialogContent5 dividers>
          <div className="kt-section__content" style={{margin:'-16px'}}>
            <div className={classes4.root}>
              <Paper className={classes4.root}>
                <Tabs
                  value={value4}
                  onChange={handleChange4}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="fullWidth"
                >
                  <Tab label="User" />
                  <Tab label="Permissions" />
                  <Tab label="Locations" />
                  {tabs.map((tab, index) => <Tab key={`tab-reference-${index}`} label={tab.info.name} />)}
                </Tabs>
              </Paper>
              <SwipeableViews
                axis={theme4.direction === "rtl" ? "x-reverse" : "x"}
                index={value4}
                onChangeIndex={handleChangeIndex4}
              >
                <TabContainer4 dir={theme4.direction}>
                  <div className="profile-tab-wrapper">
                    <ImageUpload setImage={setImage} image={values.imageURL}>
                      User Profile Photo
                    </ImageUpload>
                    <div className="profile-tab-wrapper__content">
                      {/* <FormControl component="fieldset" className={classes.textField}>
                        <FormLabel component="legend">User Profile</FormLabel>
                        <FormGroup>
                          <Select
                            // defaultValue={!id ? null : profileSelected }
                            value={profileSelected}
                            classNamePrefix="select"
                            isClearable={true}
                            name="color"
                            onChange={onChangeUserProfile}
                            options={userProfilesFiltered}
                            isDisabled={values.isDisableUserProfile}
                          />
                        </FormGroup>
                      </FormControl> */}

                      {getBaseFields()}
                      <div className={classes.textField}>
                        <FormLabel style={{marginTop: '25px'}} component="legend">Boss</FormLabel>
                        <FormGroup>
                          <Select
                            classNamePrefix="select"
                            isClearable={true}
                            name="color"
                            options={colourOptions}
                          />
                        </FormGroup>
                        <FormLabel style={{marginTop: '25px'}} component="legend">Groups</FormLabel>
                        <FormGroup>
                          <Select
                            isMulti
                            classNamePrefix="select"
                            isClearable={true}
                            name="color"
                            options={colourOptions}
                          />
                        </FormGroup>
                      </div>
                    </div>
                  </div>
                </TabContainer4>
                {/* TAB PERMISSIONS */}
                <TabContainer4 dir={theme4.direction}>
                  <div style={{ display:'flex', flexWrap:'wrap', justifyContent: 'space-around', padding: '0 20px' }}>
                    {modules.map((module, index) => {
                      return (
                        <Permission
                          id={module.key}
                          key={module.key}
                          originalChecked={profilePermissions}
                          setPermissions={handleSetPermissions}
                          title={module.name}
                        />
                      );
                    })}
                  </div>
                </TabContainer4>
                {/* TAB LOCATIONS */}
                <TabContainer4 dir={theme4.direction}>
                  <LocationAssignment locationsTable={locationsTable} setLocationsTable={setLocationsTable} />
                </TabContainer4>
                {/* TABS CUSTOM FIELDS */}
                {tabs.map(tab => (
                  <TabContainer4 dir={theme4.direction}>
                    <div className="modal-asset-reference">
                      {Array(tab.content[1].length === 0 ? 1 : 2).fill(0).map((col, colIndex) => (
                        <div className="modal-asset-reference__list-field" >
                          {tab.content[colIndex].map(customField => (
                            <CustomFieldsPreview 
                              id={customField.id}
                              type={customField.content}
                              values={customField.values}
                              onDelete={() => {}}
                              onSelect={() => {}}
                              columnIndex={colIndex}
                              from="form"
                              tab={tab}
                              onUpdateCustomField={handleUpdateCustomFields}
                              // customFieldIndex={props.customFieldIndex}
                              onClick={() => alert(customField.content)}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  </TabContainer4>
                ))}
              </SwipeableViews>
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

// export default ModalUsers;
const mapStateToProps = ({ auth: { user } }) => ({
  user
});
export default connect(mapStateToProps, auth.actions)(ModalUsers);
