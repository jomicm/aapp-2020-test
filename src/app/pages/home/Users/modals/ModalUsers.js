/* eslint-disable no-restricted-imports */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import SwipeableViews from 'react-swipeable-views';
import { forEach, isEmpty, uniq } from 'lodash';
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
import { postDBEncryptPassword, getOneDB, getDB, updateDB, postDB } from '../../../../crud/api';
import ImageUpload from '../../Components/ImageUpload';
import { hosts, getFileExtension, saveImage, getImageURL, verifyCustomFields } from '../../utils';
import { modules } from '../../constants';
import { CustomFieldsPreview } from '../../constants';
import BaseFields from '../../Components/BaseFields/BaseFields';
import LocationAssignment from '../components/LocationAssignment';
import Permission from '../components/Permission';
import { executePolicies, executeOnLoadPolicy } from '../../Components/Policies/utils';
import { usePolicies } from '../../Components/Policies/hooks';
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

const ModalUsers = ({ showModal, setShowModal, reloadTable, id, userProfileRows, user, updateUserPic, policies }) => {
  const dispatch = useDispatch();
  const { showErrorAlert, showFillFieldsAlert, showSavedAlert, showUpdatedAlert } = actions;
  const { fulfillUser } = auth.actions;
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
  const [customFieldsPathResponse, setCustomFieldsPathResponse] = useState();

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleSave = () => {
    setFormValidation({ ...formValidation, enabled: true });
    if (!isEmpty(formValidation.isValidForm)) {
      dispatch(showFillFieldsAlert());
      return;
    }

    if (!verifyCustomFields(customFieldsTab)) {
      dispatch(showFillFieldsAlert());
      return;
    }

    const userGroups = selectedGroups.map(({ value: id, label: name, numberOfMembers }) => {
      if (removedGroups.findIndex(({ value }) => value === id) !== -1) {
        return;
      }

      if (addedGroups.findIndex(({ value }) => value === id) !== -1) {
        return { id, name, numberOfMembers: numberOfMembers + 1 };
      }

      return { id, name, numberOfMembers };
    }) || [];

    const fileExt = getFileExtension(image);
    const body = { ...values, customFieldsTab, profilePermissions, locationsTable, fileExt, groups: userGroups, selectedUserProfile: profileSelected ? profileSelected[0] : null };

    if (!isEmpty(values.selectedBoss)) {
      const { name, lastName } = allUsers.find(({ value }) => value === values.selectedBoss.value);
      values.selectedBoss = { ...values.selectedBoss, name, lastName };
    }

    console.log(body.profilePermissions);

    if (!id) {
      body.idUserProfile = idUserProfile;
      postDBEncryptPassword('user', body)
        .then(data => data.json())
        .then(response => {
          dispatch(showSavedAlert());
          const { _id, email, name, lastName } = response.response[0];
          saveAndReload('user', _id);
          updateLocationsAssignments(locationsTable, { userId: _id, email, name, lastName });
          executePolicies('OnAdd', 'user', 'list', policies);
          getDB('settingsGroups')
            .then((response) => response.json())
            .then((data) => {
              addedGroups.forEach(({ value }) => {
                const groupFounded = data.response.find(({ _id: groupId }) => groupId === value);
                const { _id: groupId, numberOfMembers } = groupFounded;
                const newMember = { value: _id, label: email, name, lastName };
                const members = [...groupFounded.members, newMember];
                updateDB('settingsGroups/', { members, numberOfMembers: numberOfMembers + 1 }, groupId)
                  .catch((error) => console.log(error));
              });
            })
            .catch((error) => dispatch(showErrorAlert()));
        })
        .catch(error => dispatch(showErrorAlert()));
    } else {
      updateDB('user/', body, id[0])
        .then((response) => response.json())
        .then((data) => {
          dispatch(showUpdatedAlert());
          saveAndReload('user', id[0]);
          updateCurrentUserPic(id[0], fileExt);
          updateLocationsAssignments(locationsTable, { userId: id[0], name: body.name, email: body.email, lastName: body.lastName });
          executePolicies('OnEdit', 'user', 'list', policies);
          getDB('settingsGroups')
            .then((response) => response.json())
            .then((data) => {
              const groupsToUpdate = selectedGroups.filter((group) => addedGroups.findIndex(({ value }) => value === group.value) === -1 && removedGroups.findIndex(({ value }) => value === group.value) === -1 );
              const { email, name, lastName } = body;
              addedGroups.forEach(({ value }) => {
                const groupFounded = data.response.find(({ _id: groupId }) => groupId === value);
                const { _id: groupId, numberOfMembers } = groupFounded;
                const newMember = { value: id[0], label: email, name, lastName };
                const members = [...groupFounded.members, newMember];
                updateDB('settingsGroups/', { members, numberOfMembers: numberOfMembers + 1 }, groupId)
                  .catch((error) => console.log(error));
              });
              removedGroups.forEach(({ value }) => {
                const groupFounded = data.response.find(({ _id: groupId }) => groupId === value);
                const { _id: groupId, numberOfMembers } = groupFounded;
                const members = groupFounded.members.filter(({ value: userId }) => userId !== id[0]);
                updateDB('settingsGroups/', { members, numberOfMembers: numberOfMembers - 1 }, groupId)
                  .catch((error) => console.log(error));
              });
              groupsToUpdate.forEach(({ value }) => {
                const groupFounded = data.response.find(({ _id: groupId }) => groupId === value);
                const { _id: groupId } = groupFounded;
                const newMember = { value: id[0], label: email, name, lastName };
                const filteredMembers = groupFounded.members.filter(({ value: userId }) => userId !== id[0]);
                const members = [...filteredMembers, newMember];
                updateDB('settingsGroups/', { members }, groupId)
                  .catch((error) => console.log(error));
              });
            })
            .catch((error) => dispatch(showErrorAlert()));
        })
        .catch(error => dispatch(showErrorAlert()));
    }
  
    handleCloseModal();

    if (id) {;
      if (initialProfilePermissions !== body.profilePermissions && id[0] === user.id) {
        console.log({ ...user, name: body.name, lastName: body.lastName, email: body.email, fullName: `${body.name} ${body.lastName}`, profilePermissions: body.profilePermissions });
        dispatch(fulfillUser({ ...user, name: body.name, lastName: body.lastName, email: body.email, fullName: `${body.name} ${body.lastName}`, profilePermissions: body.profilePermissions }));
        updateCurrentUserPic(id[0], fileExt);
        setTimeout(() => window.location.reload(), 1000);
      } else if (id[0] === user.id) {
        dispatch(fulfillUser({ ...user, name: body.name, lastName: body.lastName, fullname: `${body.name} ${body.lastName}`, email: body.email }));
        updateCurrentUserPic(id[0], fileExt);
      }
    }
  };

  const [image, setImage] = useState(null);
  const saveAndReload = (folderName, id) => {
    saveImage(image, folderName, id);
    reloadTable();
  };
  const updateLocationsAssignments = (locationsTable = [], assignedTo) => {
    (locationsTable).forEach(({ parent: locationId }) => {
      // const assignedTo = { userId: _id, email, name, lastName };
      updateDB('locationsReal/', { assignedTo }, locationId)
        .catch(error => dispatch(showErrorAlert()));
    });
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
    setSelectedGroups([]);
    setRemovedGroups([]);
    setAddedGroups([]);
    setUserInitialGroups([]);
    setInitialProfilePermissions({});
    window.history.replaceState({}, null, `${window.location.origin}/users`);
  };

  const [userProfilesFiltered, setUserProfilesFiltered] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allGroups, setAllGroups] = useState([]);
  const [userInitialGroups, setUserInitialGroups] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [removedGroups, setRemovedGroups] = useState([]);
  const [addedGroups, setAddedGroups] = useState([]);

  useEffect(() => {
    if (!id || !Array.isArray(id)) {
      return;
    }
  }, []);

  useEffect(() => {
    const userProfiles = userProfileRows.map((profile, ix) => ({ value: profile.id, label: profile.name }));
    setUserProfilesFiltered(userProfiles);
    loadInit();
    if (!id || !Array.isArray(id)) {
      return;
    }

    getOneDB('user/', id[0])
      .then(response => response.json())
      .then(async (data) => {
        const { name, lastName, email, customFieldsTab, profilePermissions, idUserProfile, locationsTable, fileExt, selectedBoss } = data.response;
        const onLoadResponse = await executeOnLoadPolicy(idUserProfile, 'user', 'list', policies);
        setCustomFieldsPathResponse(onLoadResponse);
        setCustomFieldsTab(customFieldsTab);
        setProfilePermissions(profilePermissions);
        setInitialProfilePermissions(profilePermissions);
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
        const users = data.response.map(({ _id: value, email: label, name, lastName }) => ({ value, label, name, lastName }));
        setAllUsers(users);

        if (Array.isArray(id)) {
          const { groups } = data.response.find(({ _id }) => _id === id[0]);
          const userGroups = groups.map(({ id: value, name: label, numberOfMembers }) => ({ value, label, numberOfMembers }));
          setSelectedGroups(userGroups);
          setUserInitialGroups(userGroups);
        }
      })
      .catch(error => console.log(error));
    getDB('settingsGroups')
      .then((response) => response.json())
      .then((data) => {
        const { response } = data;
        const groups = response.map(({ _id: value, name: label, numberOfMembers }) => ({ value, label, numberOfMembers }));
        setAllGroups(groups);
      })
      .catch((error) => console.log(error))
  };

  const [customFieldsTab, setCustomFieldsTab] = useState({});
  const [profilePermissions, setProfilePermissions] = useState({});
  const [initialProfilePermissions, setInitialProfilePermissions] = useState({});
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
      setProfileSelected(0);
      setTabs([]);
      return;
    }
    setProfileSelected(e);
    getOneDB('userProfiles/', e.value)
      .then(response => response.json())
      .then(data => {
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

  useEffect(() => console.log(profileSelected), [profileSelected]);

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
        onChange: handleChange('password'),
        hidden: (!id || !Array.isArray(id)) ? false : true
      }
    },
    boss: {
      componentProps: {
        isClearable: true,
        onChange: (selectedBoss) => setValues(prev => ({ ...prev, selectedBoss })),
        value: values.selectedBoss,
        options: allUsers
      }
    },
    userGroups: {
      componentProps: {
        isClearable: true,
        isMulti: true,
        label: 'Groups',
        onChange: (groups) => {
          // Track the removed group
          const groupsUpdated = groups || [];
          if (selectedGroups.length > groupsUpdated.length) {
            const groupRemoved = selectedGroups.find((group) => !groupsUpdated.includes(group));
            if (userInitialGroups.findIndex(({ value }) => groupRemoved.value === value) !== -1) {
              setRemovedGroups(prev => uniq([...prev, groupRemoved]));
            }
          } else {
            const groupAssigned = groupsUpdated.find((group) => !selectedGroups.includes(group));
            setRemovedGroups(prev => prev.filter(({ value }) => value !== groupAssigned.value));

            if (userInitialGroups.findIndex(({ value }) => groupAssigned.value === value) === -1) {
              setAddedGroups(prev => uniq([...prev, groupAssigned]));
            }
          }
          setSelectedGroups(groupsUpdated);
        },
        options: allGroups,
        value: selectedGroups
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
                              columnIndex={colIndex}
                              customFieldsPathResponse={customFieldsPathResponse}
                              data={tab.content[colIndex]}
                              from='form'
                              id={customField.id}
                              onClick={() => alert(customField.content)}
                              onDelete={() => { }}
                              onSelect={() => { }}
                              onUpdateCustomField={handleUpdateCustomFields}
                              tab={tab}
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
  )
};

const mapStateToProps = ({ auth: { user } }) => ({
  user
});
export default connect(mapStateToProps, auth.actions)(ModalUsers);
