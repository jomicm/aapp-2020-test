/* eslint-disable no-restricted-imports */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import SwipeableViews from 'react-swipeable-views';
import { isEmpty } from 'lodash';
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
} from '@material-ui/core';
import {
  withStyles,
  useTheme,
  makeStyles
} from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import { useDispatch } from 'react-redux';
import { actions } from '../../../../store/ducks/general.duck';
import * as auth from '../../../../store/ducks/auth.duck';
import { postDBEncryptPassword, getOneDB, getDB, updateDB } from '../../../../crud/api';
import ImageUpload from '../../Components/ImageUpload';
import { hosts, getFileExtension, saveImage, getImageURL } from '../../utils';
import { modules } from '../../constants';
import { CustomFieldsPreview } from '../../constants';
import BaseFields from '../../Components/BaseFields/BaseFields';
import LocationAssignment from '../components/LocationAssignment';
import Permission from '../components/Permission';

const { apiHost, localHost } = hosts;

const styles5 = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2)
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
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

function TabContainer4({ children, dir }) {
  return (
    <Typography component='div' dir={dir} style={{ padding: 8 * 3 }}>
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

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
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
  const dispatch = useDispatch();
  const { showErrorAlert, showFillFieldsAlert, showSavedAlert, showUpdatedAlert } = actions;
  const classes4 = useStyles4();
  const theme4 = useTheme();
  const [value4, setValue4] = useState(0);
  function handleChange4(event, newValue) {
    setValue4(newValue);
  }
  function handleChangeIndex4(index) {
    setValue4(index);
  }

  const classes = useStyles();
  const [values, setValues] = useState({
    name: '',
    lastName: '',
    email: '',
    password: '',
    users: [],
    selectedBoss: null,
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
      dispatch(showFillFieldsAlert());
      return;
    }

    const fileExt = getFileExtension(image);
    const body = { ...values, customFieldsTab, profilePermissions, locationsTable, fileExt };
    if (!id) {
      body.idUserProfile = idUserProfile;
      postDBEncryptPassword('user', body)
        .then(data => data.json())
        .then(response => {
          dispatch(showSavedAlert());
          const { _id } = response.response[0];
          saveAndReload('user', _id);
        })
        .catch(error => dispatch(showErrorAlert()));
    } else {
      updateDB('user/', body, id[0])
        .then(response => {
          dispatch(showUpdatedAlert());
          saveAndReload('user', id[0]);
          updateCurrentUserPic(id[0], fileExt);
        })
        .catch(error => dispatch(showErrorAlert()));
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
      const defaultPic = `${localHost}/media/misc/placeholder-image.jpg?v=${_v}`;
      const pic = fileExt ?
        `${apiHost}/uploads/user/${editId}.${fileExt}?v=${_v}` :
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
      name: '',
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
    setFormValidation({
      enabled: false,
      isValidForm: false
    });

  };

  const [userProfilesFiltered, setUserProfilesFiltered] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const userProfiles = userProfileRows.map((profile, ix) => ({ value: profile.id, label: profile.name }));
    setUserProfilesFiltered(userProfiles);
    loadInit();
    if (!id || !Array.isArray(id)) {
      return;
    }

    getOneDB('user/', id[0])
      .then(response => response.json())
      .then(data => {
        const { name, lastName, email, customFieldsTab, profilePermissions, idUserProfile, locationsTable, fileExt, selectedBoss } = data.response;
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
          imageURL: getImageURL(id, 'user', fileExt),
          selectedBoss
        });
        const tabs = Object.keys(customFieldsTab).map(key => ({ key, info: customFieldsTab[key].info, content: [customFieldsTab[key].left, customFieldsTab[key].right] }));
        tabs.sort((a, b) => a.key.split('-').pop() - b.key.split('-').pop());
        setCustomFieldsTab(customFieldsTab);
        setTabs(tabs);
      })
      .catch(error => dispatch(showErrorAlert()));
  }, [id, userProfileRows]);


  const loadInit = () => {
    getDB('user')
      .then(response => response.json())
      .then(data => {
        const users = data.response.map(({ _id: value, email: label }) => ({ value, label }));
        setAllUsers(users);
      })
      .catch(error => dispatch(showErrorAlert()));
  };

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
      .catch(error => dispatch(showErrorAlert()));
  };

  // Function to update customFields
  const handleUpdateCustomFields = (tab, id, colIndex, CFValues) => {
    const colValue = ['left', 'right'];
    const customFieldsTabTmp = { ...customFieldsTab };

    const field = customFieldsTabTmp[tab][colValue[colIndex]]
      .find(cf => cf.id === id);
    field.values = CFValues;
  };

  const [formValidation, setFormValidation] = useState({
    enabled: false,
    isValidForm: {}
  });

  useEffect(() => {
    console.log('debug2', profileSelected)
  }, [profileSelected])

  const baseFieldsLocalProps = {
    userProfile: {
      ownValidFn: () => !!idUserProfile,
      componentProps: {
        isClearable: true,
        isDisabled: values.isDisableUserProfile,
        onChange: onChangeUserProfile,
        options: userProfilesFiltered,
        value: profileSelected
      }
    },
    name: {
      componentProps: {
        onChange: handleChange('name')
      }
    },
    lastName: {
      componentProps: {
        onChange: handleChange('lastName')
      }
    },
    email: {
      componentProps: {
        onChange: handleChange('email')
      }
    },
    password: {
      componentProps: {
        onChange: handleChange('password')
      }
    },
    userGroups: {
      componentProps: {
        isClearable: true,
        label: 'Groups',
        options: colourOptions
      }
    },
    boss: {
      componentProps: {
        isClearable: true,
        onChange: (selectedBoss) => setValues(prev => ({ ...prev, selectedBoss })),
        value: values.selectedBoss,
        options: allUsers
      }
    }
  };

  return (
    <div style={{ width: '1000px' }}>
      <Dialog
        onClose={handleCloseModal}
        aria-labelledby='customized-dialog-title'
        open={showModal}
      >
        <DialogTitle5
          id='customized-dialog-title'
          onClose={handleCloseModal}
        >
          {`${id ? 'Edit' : 'Add'} Users`}
        </DialogTitle5>
        <DialogContent5 dividers>
          <div className='kt-section__content' style={{ margin: '-16px' }}>
            <div className={classes4.root}>
              <Paper className={classes4.root}>
                <Tabs
                  value={value4}
                  onChange={handleChange4}
                  indicatorColor='primary'
                  textColor='primary'
                  variant='fullWidth'
                >
                  <Tab label='User' />
                  <Tab label='Permissions' />
                  <Tab label='Locations' />
                  {tabs.map((tab, index) => <Tab key={`tab-reference-${index}`} label={tab.info.name} />)}
                </Tabs>
              </Paper>
              <SwipeableViews
                axis={theme4.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={value4}
                onChangeIndex={handleChangeIndex4}
              >
                <TabContainer4 dir={theme4.direction}>
                  <div className='profile-tab-wrapper'>
                    <ImageUpload setImage={setImage} image={values.imageURL}>
                      User Profile Photo
                    </ImageUpload>
                    <div className='profile-tab-wrapper__content'>
                      <BaseFields
                        catalogue={'userList'}
                        collection={'user'}
                        formState={[formValidation, setFormValidation]}
                        localProps={baseFieldsLocalProps}
                        values={values}
                      />
                    </div>
                  </div>
                </TabContainer4>
                {/* TAB PERMISSIONS */}
                <TabContainer4 dir={theme4.direction}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', padding: '0 20px' }}>
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
                    <div className='modal-asset-reference'>
                      {Array(tab.content[1].length === 0 ? 1 : 2).fill(0).map((col, colIndex) => (
                        <div className='modal-asset-reference__list-field' >
                          {tab.content[colIndex].map(customField => (
                            <CustomFieldsPreview
                              id={customField.id}
                              type={customField.content}
                              values={customField.values}
                              onDelete={() => { }}
                              onSelect={() => { }}
                              columnIndex={colIndex}
                              from='form'
                              tab={tab}
                              onUpdateCustomField={handleUpdateCustomFields}
                              onClick={() => alert(customField.content)}
                              data={tab.content[colIndex]}
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
  )
};

const mapStateToProps = ({ auth: { user } }) => ({
  user
});
export default connect(mapStateToProps, auth.actions)(ModalUsers);
