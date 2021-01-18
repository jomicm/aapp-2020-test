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
  FormGroup,
} from '@material-ui/core';
import Select from 'react-select';
import { withStyles, useTheme, makeStyles } from '@material-ui/core/styles';
import SwipeableViews from 'react-swipeable-views';
import CloseIcon from '@material-ui/icons/Close';
import CustomFields from '../../Components/CustomFields/CustomFields';

// import './ModalAssetCategories.scss';
import ImageUpload from '../../Components/ImageUpload';
import {
  postDBEncryptPassword,
  getOneDB,
  updateDB,
  postDB,
  getDB,
} from '../../../../crud/api';
import ModalYesNo from '../../Components/ModalYesNo';
import Permission from '../components/Permission';
import AssetTable from '../components/AssetTable';
import { getFileExtension, saveImage, getImageURL } from '../../utils';

import {
  SingleLine,
  MultiLine,
  Date,
  DateTime,
  DropDown,
  RadioButtons,
  Checkboxes,
  FileUpload,
} from '../../Components/CustomFields/CustomFieldsPreview';

const CustomFieldsPreview = (props) => {
  const customFieldsPreviewObj = {
    singleLine: <SingleLine {...props} />,
    multiLine: <MultiLine {...props} />,
    date: <Date {...props} />,
    dateTime: <DateTime {...props} />,
    dropDown: <DropDown {...props} />,
    radioButtons: <RadioButtons {...props} />,
    checkboxes: <Checkboxes {...props} />,
    fileUpload: <FileUpload {...props} />,
  };
  return customFieldsPreviewObj[props.type];
};

// Example 5 - Modal
const styles5 = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle5 = withStyles(styles5)(({ children, classes, onClose }) => {
  return (
    <DialogTitle disableTypography className={classes.root}>
      <Typography variant='h6'>{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label='Close'
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
});

const DialogContent5 = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(DialogContent);

const DialogActions5 = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(DialogActions);

// Example 4 - Tabs
function TabContainer4({ children, dir }) {
  return (
    <Typography component='div' dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}
const useStyles4 = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 1000,
  },
}));

// Example 1 - TextField
const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  dense: {
    marginTop: 19,
  },
  menu: {
    width: 200,
  },
}));

const ModalEmployees = ({
  showModal,
  setShowModal,
  reloadTable,
  id,
  employeeProfileRows,
}) => {
  // Example 4 - Tabs
  const [assetRows, setAssetRows] = useState([]);
  const classes = useStyles();
  const classes4 = useStyles4();
  const [customFieldsTab, setCustomFieldsTab] = useState({});
  const [employeeProfilesFiltered, setEmployeeProfilesFiltered] = useState([]);
  const [idUserProfile, setIdUserProfile] = useState('');
  const [image, setImage] = useState(null);
  const [layoutOptions, setLayoutOptions] = useState([]);
  const [layoutSelected, setLayoutSelected] = useState(0);
  const [locationsTable, setLocationsTable] = useState([]);
  const [policies, setPolicies] = useState(['']);
  const [profilePermissions, setProfilePermissions] = useState({});
  const [profileSelected, setProfileSelected] = useState(0);
  const [tabs, setTabs] = useState([]);
  const theme4 = useTheme();
  const [value4, setValue4] = useState(0);
  const [values, setValues] = useState({
    name: '',
    lastName: '',
    email: '',
    isDisableUserProfile: false,
    selectedUserProfile: null,
    categoryPic: '/media/misc/placeholder-image.jpg',
    categoryPicDefault: '/media/misc/placeholder-image.jpg',
  });

  const executePolicies = (catalogueName) => {
    const filteredPolicies = policies.filter(
      (policy) => policy.selectedAction === catalogueName
    );
    filteredPolicies.forEach(
      ({ policyName, selectedAction, selectedCatalogue }) =>
        alert(
          `Policy <${policyName}> with action <${selectedAction}> of type <${selectedCatalogue}> will be executed`
        )
    );
  };

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleChange4 = (event, newValue) => {
    setValue4(newValue);
  };
  const handleChangeIndex4 = (index) => {
    setValue4(index);
  };

  const handleCloseModal = () => {
    setCustomFieldsTab({});
    setProfilePermissions([]);
    setTabs([]);
    setProfileSelected(null);
    setValues({
      name: '',
      lastName: '',
      email: '',
      password: '',
      isDisableUserProfile: false,
      selectedUserProfile: null,
      categoryPic: '/media/misc/placeholder-image.jpg',
      categoryPicDefault: '/media/misc/placeholder-image.jpg',
    });
    setShowModal(false);
    setValue4(0);
    setLayoutOptions([]);
    setLayoutSelected(null);
    setAssetRows([]);
  };

  const handleOnAssetFinderSubmit = (filteredRows) => {
    let validRows = filteredRows.rows.filter((row) => !row.assigned);
    validRows = validRows
      .map((rowTR) => {
        if (!assetRows.find((row) => row.id === rowTR.id)) {
          return rowTR;
        }
      })
      .filter((row) => row);
    setAssetRows([...assetRows, ...validRows]);
  };

  const onChangeEmployeeProfile = (e) => {
    if (!e) {
      setCustomFieldsTab({});
      setProfilePermissions({});
      setTabs([]);
      return;
    }
    console.log('onChangeEmployeeProfile>>>', e);
    setProfileSelected(e);
    getOneDB('employeeProfiles/', e.value)
      .then((response) => response.json())
      .then((data) => {
        console.log(data.response);
        const { customFieldsTab, profilePermissions } = data.response;
        const tabs = Object.keys(customFieldsTab).map((key) => ({
          key,
          info: customFieldsTab[key].info,
          content: [customFieldsTab[key].left, customFieldsTab[key].right],
        }));
        tabs.sort((a, b) => a.key.split('-').pop() - b.key.split('-').pop());
        setCustomFieldsTab(customFieldsTab);
        setProfilePermissions(profilePermissions);
        setTabs(tabs);
        setIdUserProfile(e.value);
      })
      .catch((error) => console.log(error));
  };

  const handleOnDeleteAssetAssigned = (id) => {
    const restRows = assetRows.filter((row) => row.id !== id);
    setAssetRows(restRows);
    updateDB('assets/', { assigned: null }, id)
      .then((response) => {})
      .catch((error) => console.log(error));
  };

  const handleSave = () => {
    const fileExt = getFileExtension(image);
    const body = {
      ...values,
      customFieldsTab,
      profilePermissions,
      locationsTable,
      layoutSelected,
      fileExt,
      assetsAssigned: assetRows,
    };

    if (!id) {
      body.idUserProfile = idUserProfile;
      postDB('employees', body)
        .then((data) => data.json())
        .then((response) => {
          const { _id } = response.response[0];
          saveAndReload('employees', _id);
          executePolicies('OnAdd');
          updateAssignedEmpToAssets(_id);
        })
        .catch((error) => console.log('ERROR', error));
    } else {
      updateDB('employees/', body, id[0])
        .then((response) => {
          saveAndReload('employees', id[0]);
          updateAssignedEmpToAssets(id[0]);
          executePolicies('OnEdit');
        })
        .catch((error) => console.log(error));
    }
    handleCloseModal();
  };

  // Function to update customFields
  const handleUpdateCustomFields = (tab, id, colIndex, CFValues) => {
    const colValue = ['left', 'right'];
    console.log('Looking for you', tab, id, colIndex, values);
    const customFieldsTabTmp = { ...customFieldsTab };

    const field = customFieldsTabTmp[tab][colValue[colIndex]].find(
      (cf) => cf.id === id
    );
    field.values = CFValues;
  };

  const saveAndReload = (folderName, id) => {
    saveImage(image, folderName, id);
    reloadTable();
  };

  const updateAssignedEmpToAssets = (_id) => {
    assetRows.forEach((asset) => {
      getOneDB('assets/', asset.id)
        .then((response) => response.json())
        .then((data) => {
          const body = { ...data.response, assigned: _id };
          updateDB('assets/', { assigned: _id }, asset.id)
            .then((response) => {})
            .catch((error) => console.log(error));
        })
        .catch((error) => console.log(error));
    });
  };

  useEffect(() => {
    const userProfiles = employeeProfileRows.map((profile, ix) => ({
      value: profile.id,
      label: profile.name,
    }));
    setEmployeeProfilesFiltered(userProfiles);

    getDB('settingsLayoutsEmployees')
      .then((response) => response.json())
      .then((data) => {
        const layoutOptions = data.response.map(
          ({ _id: value, name: label }) => ({ value, label })
        );
        setLayoutOptions(layoutOptions);
      })
      .catch((error) => console.log('error>', error));

    getDB('policies')
      .then((response) => response.json())
      .then((data) => {
        setPolicies(data.response);
      })
      .catch((error) => console.log('error>', error));

    if (!id || !Array.isArray(id)) {
      return;
    }

    getOneDB('employees/', id[0])
      .then((response) => response.json())
      .then((data) => {
        const {
          name,
          lastName,
          email,
          customFieldsTab,
          profilePermissions,
          idUserProfile,
          locationsTable,
          layoutSelected,
          fileExt,
          assetsAssigned = [],
        } = data.response;
        executePolicies('OnLoad');
        setCustomFieldsTab(customFieldsTab);
        setProfilePermissions(profilePermissions);
        setLayoutSelected(layoutSelected);
        setProfileSelected(
          employeeProfilesFiltered.filter(
            (profile) => profile.value === idUserProfile
          )
        );
        setLocationsTable(locationsTable || []);
        setValues({
          ...values,
          name,
          lastName,
          email,
          isDisableUserProfile: true,
          imageURL: getImageURL(id, 'employees', fileExt),
        });
        setAssetRows(assetsAssigned);
        //
        const tabs = Object.keys(customFieldsTab).map((key) => ({
          key,
          info: customFieldsTab[key].info,
          content: [customFieldsTab[key].left, customFieldsTab[key].right],
        }));
        tabs.sort((a, b) => a.key.split('-').pop() - b.key.split('-').pop());
        setCustomFieldsTab(customFieldsTab);
        setTabs(tabs);
      })
      .catch((error) => console.log(error));
  }, [id, employeeProfileRows]);

  return (
    <div style={{ width: '1000px' }}>
      <Dialog
        aria-labelledby='customized-dialog-title'
        onClose={handleCloseModal}
        open={showModal}
      >
        <DialogTitle5 id='customized-dialog-title' onClose={handleCloseModal}>
          {`${id ? 'Edit' : 'Add'} Employees`}
        </DialogTitle5>
        <DialogContent5 dividers>
          <div className='kt-section__content' style={{ margin: '-16px' }}>
            <div className={classes4.root}>
              <Paper className={classes4.root}>
                <Tabs
                  indicatorColor='primary'
                  onChange={handleChange4}
                  textColor='primary'
                  variant='fullWidth'
                  value={value4}
                >
                  <Tab label='Employee' />
                  <Tab label='Assignments' />
                  {tabs.map((tab, index) => (
                    <Tab key={`tab-reference-${index}`} label={tab.info.name} />
                  ))}
                </Tabs>
              </Paper>
              <SwipeableViews
                axis={theme4.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={value4}
                onChangeIndex={handleChangeIndex4}
              >
                <TabContainer4 dir={theme4.direction}>
                  <div className='profile-tab-wrapper'>
                    <ImageUpload image={values.imageURL} setImage={setImage}>
                      Employee Profile Photo
                    </ImageUpload>
                    <div className='profile-tab-wrapper__content'>
                      <FormControl
                        component='fieldset'
                        className={classes.textField}
                      >
                        <FormLabel component='legend'>
                          Employee Profile
                        </FormLabel>
                        <FormGroup>
                          <Select
                            // defaultValue={!id ? null : profileSelected }
                            classNamePrefix='select'
                            isClearable={true}
                            isDisabled={values.isDisableUserProfile}
                            name='color'
                            onChange={onChangeEmployeeProfile}
                            options={employeeProfilesFiltered}
                            value={profileSelected}
                          />
                        </FormGroup>
                      </FormControl>
                      <TextField
                        className={classes.textField}
                        id='standard-name'
                        label='Name'
                        margin='normal'
                        onChange={handleChange('name')}
                        value={values.name}
                      />
                      <TextField
                        className={classes.textField}
                        id='standard-name'
                        label='Last Name'
                        margin='normal'
                        onChange={handleChange('lastName')}
                        value={values.lastName}
                      />
                      <TextField
                        className={classes.textField}
                        id='standard-name'
                        label='Email'
                        margin='normal'
                        onChange={handleChange('email')}
                        value={values.email}
                      />
                      <div className={classes.textField}>
                        <FormLabel
                          component='legend'
                          style={{ marginTop: '25px' }}
                        >
                          Responsibility Layout
                        </FormLabel>
                        <FormGroup>
                          <Select
                            classNamePrefix='select'
                            isClearable={true}
                            name='color'
                            onChange={(e) => setLayoutSelected(e)}
                            options={layoutOptions}
                            value={layoutSelected}
                          />
                        </FormGroup>
                      </div>
                    </div>
                  </div>
                </TabContainer4>
                <TabContainer4 dir={theme4.direction}>
                  <div className='profile-tab-wrapper'>
                    <AssetTable
                      assetRows={assetRows}
                      onAssetFinderSubmit={handleOnAssetFinderSubmit}
                      onDeleteAssetAssigned={handleOnDeleteAssetAssigned}
                    />
                  </div>
                </TabContainer4>
                {/* TABS CUSTOM FIELDS */}
                {tabs.map((tab) => (
                  <TabContainer4 dir={theme4.direction}>
                    <div className='modal-asset-reference'>
                      {Array(tab.content[1].length === 0 ? 1 : 2)
                        .fill(0)
                        .map((col, colIndex) => (
                          <div className='modal-asset-reference__list-field'>
                            {tab.content[colIndex].map((customField) => (
                              <CustomFieldsPreview
                                columnIndex={colIndex}
                                from='form'
                                id={customField.id}
                                onClick={() => alert(customField.content)}
                                onDelete={() => {}}
                                onSelect={() => {}}
                                onUpdateCustomField={handleUpdateCustomFields}
                                tab={tab}
                                // customFieldIndex={props.customFieldIndex}
                                type={customField.content}
                                values={customField.values}
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
          <Button onClick={handleSave} color='primary'>
            Save changes
          </Button>
        </DialogActions5>
      </Dialog>
    </div>
  );
};

export default ModalEmployees;
