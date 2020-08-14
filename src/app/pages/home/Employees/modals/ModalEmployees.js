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
import CustomFields from '../../Components/CustomFields/CustomFields';

// import './ModalAssetCategories.scss';
import ImageUpload from '../../Components/ImageUpload';
import { postDBEncryptPassword, getOneDB, updateDB, postDB } from '../../../../crud/api';
import ModalYesNo from '../../Components/ModalYesNo';
import Permission from '../components/Permission';

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

const ModalEmployees = ({ showModal, setShowModal, reloadTable, id, employeeProfileRows }) => {
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
    isDisableUserProfile: false,
    selectedUserProfile: null,
    categoryPic: '/media/misc/placeholder-image.jpg',
    categoryPicDefault: '/media/misc/placeholder-image.jpg'
  });
  const [profileSelected, setProfileSelected] = useState(0);
  const [layoutSelected, setLayoutSelected] = useState(0);

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleSave = () => {
    const body = { ...values, customFieldsTab, profilePermissions, locationsTable, layoutSelected };
    if (!id) {
      body.idUserProfile = idUserProfile;
      postDB('employees', body)
        .then(response => {
          console.log('response:', response)
          reloadTable();
        })
        .catch(error => console.log(error));
    } else {
      updateDB('employees/', body, id[0])
        .then(response => {
          reloadTable();
        })
        .catch(error => console.log(error));
    }
    handleCloseModal();
  };

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
  };

  const [employeeProfilesFiltered, setEmployeeProfilesFiltered] = useState([]);

  useEffect(() => {
    const userProfiles = employeeProfileRows.map((profile, ix) => ({ value: profile.id, label: profile.name }));
    setEmployeeProfilesFiltered(userProfiles);
    if(!id || !Array.isArray(id)) {
      return;
    }

    getOneDB('employees/', id[0])
      .then(response => response.json())
      .then(data => { 
        const { name, lastName, email, customFieldsTab, profilePermissions, idUserProfile, locationsTable, layoutSelected } = data.response;
        setCustomFieldsTab(customFieldsTab);
        setProfilePermissions(profilePermissions);
        setLayoutSelected(layoutSelected)
        setProfileSelected(employeeProfilesFiltered.filter(profile => profile.value === idUserProfile));
        setLocationsTable(locationsTable || []);
        setValues({ 
          ...values,
          name,
          lastName,
          email,
          isDisableUserProfile: true,
        });
        //
        const tabs = Object.keys(customFieldsTab).map(key => ({ key, info: customFieldsTab[key].info, content: [customFieldsTab[key].left, customFieldsTab[key].right] }));
        tabs.sort((a, b) => a.key.split('-').pop() - b.key.split('-').pop());
        setCustomFieldsTab(customFieldsTab);
        setTabs(tabs);
      })
      .catch(error => console.log(error));
  }, [id, employeeProfileRows]);

  const [customFieldsTab, setCustomFieldsTab] = useState({});
  const [profilePermissions, setProfilePermissions] = useState({});
  const [tabs, setTabs] = useState([]);
  const [locationsTable, setLocationsTable] = useState([]);


  const modules = [
    { key:'dashboard', name: 'Dashboard' },
    { key:'assets', name: 'Assets' },
    { key:'processes', name: 'Processes' },
    { key:'users', name: 'Users' },
    { key:'employees', name: 'Employees' },
    { key:'locations', name: 'Locations' },
    { key:'reports', name: 'Reports' },
    { key:'settings', name: 'Settings' },
  ];

  const handleSetPermissions = (key, checked) => {
    setProfilePermissions(prev => ({ ...prev, [key]: checked }));
  }

  const layoutOpts = [
    { value: 'lay1', label: 'Layout 1' },
    { value: 'lay2', label: 'Layout 2' },
    { value: 'lay3', label: 'Layout 3' },
  ];

  const [idUserProfile, setIdUserProfile] = useState('');
  const onChangeEmployeeProfile = e => {
    if (!e) {
      setCustomFieldsTab({});
      setProfilePermissions({});
      setTabs([]);
      return;
    }
    console.log('onChangeEmployeeProfile>>>', e);
    setProfileSelected(e);
    getOneDB('employeeProfiles/', e.value)
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
          {`${id ? 'Edit' : 'Add' } Employees`}
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
                  <Tab label="Employee" />
                  {/* <Tab label="Permissions" />
                  <Tab label="Locations" /> */}
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
                    <ImageUpload>
                      Employee Profile Photo
                    </ImageUpload>
                    <div className="profile-tab-wrapper__content">
                      <FormControl component="fieldset" className={classes.textField}>
                        <FormLabel component="legend">Employee Profile</FormLabel>
                        <FormGroup>
                          <Select
                            // defaultValue={!id ? null : profileSelected }
                            value={profileSelected}
                            classNamePrefix="select"
                            isClearable={true}
                            name="color"
                            onChange={onChangeEmployeeProfile}
                            options={employeeProfilesFiltered}
                            isDisabled={values.isDisableUserProfile}
                          />
                        </FormGroup>
                      </FormControl>
                      <TextField
                        id="standard-name"
                        label="Name"
                        className={classes.textField}
                        value={values.name}
                        onChange={handleChange("name")}
                        margin="normal"
                      />
                      <TextField
                        id="standard-name"
                        label="Last Name"
                        className={classes.textField}
                        value={values.lastName}
                        onChange={handleChange("lastName")}
                        margin="normal"
                      />
                      <TextField
                        id="standard-name"
                        label="Email"
                        className={classes.textField}
                        value={values.email}
                        onChange={handleChange("email")}
                        margin="normal"
                      />
                      <div className={classes.textField}>
                        <FormLabel style={{marginTop: '25px'}} component="legend">Responsibility Layout</FormLabel>
                        <FormGroup>
                          <Select
                            onChange={e => setLayoutSelected(e)}
                            value={layoutSelected}
                            classNamePrefix="select"
                            isClearable={true}
                            name="color"
                            options={layoutOpts}
                          />
                        </FormGroup>
                      </div>
                    </div>
                  </div>
                </TabContainer4>
                {/* TAB PERMISSIONS */}
                {/* <TabContainer4 dir={theme4.direction}>
                  <div style={{ display:'flex', flexWrap:'wrap', justifyContent: 'space-around', padding: '0 20px' }}>
                    {modules.map((module, index) => {
                      return <Permission
                                originalChecked={profilePermissions}
                                key={module.key}
                                id={module.key}
                                title={module.name}
                                setPermissions={handleSetPermissions}
                              />
                    })}
                  </div>
                </TabContainer4> */}
                {/* TAB LOCATIONS */}
                {/* <TabContainer4 dir={theme4.direction}>
                  <LocationAssignment locationsTable={locationsTable} setLocationsTable={setLocationsTable} />
                </TabContainer4> */}
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

export default ModalEmployees;
