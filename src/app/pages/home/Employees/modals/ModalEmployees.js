import React, { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import SwipeableViews from 'react-swipeable-views';
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
  Paper
} from '@material-ui/core';
import { withStyles, useTheme, makeStyles } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { useDispatch } from 'react-redux';
import { actions } from '../../../../store/ducks/general.duck';
import { executePolicies, executeOnLoadPolicy } from '../../Components/Policies/utils';
import BaseFields from '../../Components/BaseFields/BaseFields';
import { CustomFieldsPreview } from '../../constants';
import ImageUpload from '../../Components/ImageUpload'
import { getFileExtension, saveImage, getImageURL } from '../../utils';
import {
  getOneDB,
  updateDB,
  postDB,
  getDB
} from '../../../../crud/api';
import AssetTable from '../components/AssetTable';
import ModalAssignmentReport from './ModalAssignmentReport';

const styles5 = (theme) => ({
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

const DialogContent5 = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2)
  }
}))(DialogContent);

const DialogActions5 = withStyles((theme) => ({
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
const useStyles4 = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 1000
  }
}));

const useStyles = makeStyles((theme) => ({
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

const collections = {
  messages: {
    id: 'idMessages',
    name: 'messages'
  },
};

const ModalEmployees = ({
  id,
  employeeProfileRows,
  policies,
  reloadTable,
  showModal,
  setShowModal,
  userLocations
}) => {
  const dispatch = useDispatch();
  const { showCustomAlert, showFillFieldsAlert, showErrorAlert, showSavedAlert, showUpdatedAlert } = actions;

  /* Assets */

  const [assetsBeforeSaving, setAssetsBeforeSaving] = useState([]);
  const [assetsToDelete, setAssetsToDelete] = useState([]);

  /* General */

  const classes = useStyles();
  const classes4 = useStyles4();
  const [showModalReports, setShowModalReports] = useState(false);
  const [customFieldsTab, setCustomFieldsTab] = useState({});
  const [htmlPreview, setHtmlPreview] = useState([])
  const [employeeProfilesFiltered, setEmployeeProfilesFiltered] = useState([]);
  const [idUserProfile, setIdUserProfile] = useState('');
  const [image, setImage] = useState(null);
  const [layoutOptions, setLayoutOptions] = useState([]);
  const [layoutSelected, setLayoutSelected] = useState(0);
  const [locationsTable, setLocationsTable] = useState([]);
  const [profilePermissions, setProfilePermissions] = useState({});
  const [profileSelected, setProfileSelected] = useState(0);
  const [tabs, setTabs] = useState([]);
  const theme4 = useTheme();
  const [value4, setValue4] = useState(0);
  const [values, setValues] = useState({
    categoryPic: '/media/misc/placeholder-image.jpg',
    categoryPicDefault: '/media/misc/placeholder-image.jpg',
    email: '',
    isDisableUserProfile: false,
    lastName: '',
    name: '',
    selectedUserProfile: null
  });
  const [responsibilityLayout, setResponsabilityLayout] = useState({
    added: {},
    initial: {},
    removed: {}
  });

  const [formValidation, setFormValidation] = useState({
    enabled: false,
    isValidForm: {}
  });
  const [customFieldsPathResponse, setCustomFieldsPathResponse] = useState();

  const handleAssignmentsOnSaving = (id) => {
    assetsToDelete.map(asset => {
      updateDB('assets/', { assigned: null }, asset.id)
        .then((response) => { })
        .catch(error => dispatch(showErrorAlert()));
    });
    assetsBeforeSaving.map(asset => {
      updateDB('assets/', { assigned: id }, asset.id)
        .then(response => { })
        .catch(error => dispatch(showErrorAlert()));
    });
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

  const onChangeEmployeeProfile = (e) => {
    if (!e) {
      setCustomFieldsTab({});
      setProfilePermissions({});
      setTabs([]);
      return;
    }
    setProfileSelected(e);
    getOneDB('employeeProfiles/', e.value)
      .then((response) => response.json())
      .then((data) => {
        const { customFieldsTab, profilePermissions } = data.response;
        const tabs = Object.keys(customFieldsTab).map((key) => ({
          key,
          info: customFieldsTab[key].info,
          content: [customFieldsTab[key].left, customFieldsTab[key].right]
        }));
        tabs.sort((a, b) => a.key.split('-').pop() - b.key.split('-').pop());
        setCustomFieldsTab(customFieldsTab);
        setProfilePermissions(profilePermissions);
        setTabs(tabs);
        setIdUserProfile(e.value);
      })
      .catch(error => dispatch(showErrorAlert()));
  };

  const baseFieldsLocalProps = {
    employeeProfile: {
      componentProps: {
        isClearable: true,
        isDisabled: values.isDisableUserProfile,
        onChange: onChangeEmployeeProfile,
        options: employeeProfilesFiltered,
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
    responsibilityLayout: {
      style: {
        marginTop: '15px'
      },
      componentProps: {
        isClearable: true,
        onChange: (layout) => {
          if (layout) {
            if (responsibilityLayout.initial?.value !== layout?.value && id) {
              setResponsabilityLayout(prev => ({ ...prev, added: layout, removed: prev.initial || {} }));
            } else if (!id) {
              setResponsabilityLayout(prev => ({ ...prev, added: layout }));
            } else {
              setResponsabilityLayout(prev => ({ ...prev, added: {}, removed: {} }));
            }
          } else {
            setResponsabilityLayout(prev => ({ ...prev, added: {}, removed: prev.initial }));
          }

          setLayoutSelected(layout);
        },
        options: layoutOptions,
        value: layoutSelected,
      }
    }
  };

  const handleCloseModal = () => {
    setCustomFieldsTab({});
    setProfilePermissions([]);
    setTabs([]);
    setProfileSelected(null);
    setValues({
      categoryPic: '/media/misc/placeholder-image.jpg',
      categoryPicDefault: '/media/misc/placeholder-image.jpg',
      email: '',
      isDisableUserProfile: false,
      lastName: '',
      name: '',
      password: '',
      selectedUserProfile: null
    });
    setShowModal(false);
    setValue4(0);
    setLayoutSelected(null);
    setAssetsBeforeSaving([]);
    setAssetsToDelete([]);
    setFormValidation({
      enabled: false,
      isValidForm: false
    });
    setResponsabilityLayout({
      added: {},
      initial: {},
      removed: {}
    });
  };

  const handleOnAssetFinderSubmit = (filteredRows) => {
    filteredRows.rows.map((rowTR) => {
      if (!assetsBeforeSaving.find((row) => row.id === rowTR.id)) {
        getOneDB('assets/', rowTR.id)
          .then(response => response.json())
          .then(data => {
            const res = data.response;
            if (!data.response.parent) {
              setAssetsBeforeSaving(prev => [
                ...prev,
                {
                  id: res._id,
                  name: res.name,
                  brand: res.brand,
                  model: res.model,
                  assigned: false,
                  EPC: res.EPC,
                  serial: res.serial,
                }
              ]);
              return;
            }

            dispatch(showErrorAlert());
          })
          .catch(error => { })
      }
    });
  };

  const handleOnDeleteAssetAssigned = (id) => {
    const restRows = assetsBeforeSaving.filter(row => {
      if (row.id !== id) {
        return row;
      }
      setAssetsToDelete(prev => [...prev, row]);
    });
    setAssetsBeforeSaving(restRows);
  };

  const handleSave = () => {
    setFormValidation({ ...formValidation, enabled: true });
    if (!isEmpty(formValidation.isValidForm)) {
      dispatch(showFillFieldsAlert());
      return;
    }

    const fileExt = getFileExtension(image);
    const body = {
      ...values,
      customFieldsTab,
      profilePermissions,
      locationsTable,
      layoutSelected,
      fileExt,
      assetsAssigned: assetsBeforeSaving
    };

    if (!id) {
      body.idUserProfile = idUserProfile;
      postDB('employees', body)
        .then((data) => data.json())
        .then((response) => {
          dispatch(showSavedAlert());
          const { _id } = response.response[0];
          saveAndReload('employees', _id);
          executePolicies('OnAdd', 'employees', 'list', policies);
          handleAssignmentsOnSaving(_id);
          
          if (Object.entries(responsibilityLayout.added || {}).length) {
            getOneDB('settingsLayoutsEmployees/', responsibilityLayout.added.value)
            .then((response) => response.json())
            .then((data) => {
              const { used } = data.response;
              const value = (typeof used === 'number' ? used : 0) + 1;
              updateDB('settingsLayoutsEmployees/', { used: value }, responsibilityLayout.added.value)
                .catch((error) => console.log(error));
            })
            .catch((error) => console.log(error));
          }
        })
        .catch((error) => dispatch(showErrorAlert()));
    } else {
      updateDB('employees/', body, id[0])
        .then((response) => {
          dispatch(showUpdatedAlert());
          saveAndReload('employees', id[0]);
          handleAssignmentsOnSaving(id[0]);
          executePolicies('OnEdit', 'employees', 'list', policies);

          if (Object.entries(responsibilityLayout.added || {}).length) {
            getOneDB('settingsLayoutsEmployees/', responsibilityLayout.added.value)
            .then((response) => response.json())
            .then((data) => {
              const { used } = data.response;
              const value = (typeof used === 'number' ? used : 0) + 1;
              updateDB('settingsLayoutsEmployees/', { used: value }, responsibilityLayout.added.value)
                .catch((error) => console.log(error));
            })
            .catch((error) => console.log(error));
          }

          if (Object.entries(responsibilityLayout.removed || {}).length) {
            getOneDB('settingsLayoutsEmployees/', responsibilityLayout.removed.value)
            .then((response) => response.json())
            .then((data) => {
              const { used } = data.response;
              const value = (typeof used === 'number' ? used : 1) - 1;
              updateDB('settingsLayoutsEmployees/', { used: value }, responsibilityLayout.removed.value)
                .catch((error) => console.log(error));
            })
            .catch((error) => console.log(error));
          }
        })
        .catch(error => dispatch(showErrorAlert()));
    }
    handleCloseModal();
  };

  const handleUpdateCustomFields = (tab, id, colIndex, CFValues) => {
    const colValue = ['left', 'right'];
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

  useEffect(() => {
    getDB('settingsLayoutsEmployees')
      .then((response) => response.json())
      .then((data) => {
        const layoutOptions = data.response.map(
          ({ _id: value, name: label }) => ({ value, label })
        );
        const employeeLayoutSelected = data.response.filter(({ _id }) => _id === layoutSelected.value);
        setHtmlPreview(employeeLayoutSelected);
        setLayoutOptions(layoutOptions);
      })
      .catch((error) => console.log('error>', error));
  }, [layoutSelected]);

  useEffect(() => {
    const userProfiles = employeeProfileRows.map((profile, ix) => ({
      value: profile.id,
      label: profile.name
    }));
    setEmployeeProfilesFiltered(userProfiles);

    if (!id || !Array.isArray(id)) {
      return;
    }

    getOneDB('employees/', id[0])
      .then((response) => response.json())
      .then(async (data) => {
        console.log(data.response);
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
          assetsAssigned = []
        } = data.response;
        const onLoadResponse = await executeOnLoadPolicy(idUserProfile, 'employees', 'list', policies);
        setCustomFieldsPathResponse(onLoadResponse);
        setCustomFieldsTab(customFieldsTab);
        setProfilePermissions(profilePermissions);
        setResponsabilityLayout(prev => ({ ...prev, initial: typeof layoutSelected === 'object' ? layoutSelected : {} }));
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
          imageURL: getImageURL(id, 'employees', fileExt)
        });
        setAssetsBeforeSaving(assetsAssigned);
        const tabs = Object.keys(customFieldsTab).map((key) => ({
          key,
          info: customFieldsTab[key].info,
          content: [customFieldsTab[key].left, customFieldsTab[key].right]
        }));
        tabs.sort((a, b) => a.key.split('-').pop() - b.key.split('-').pop());
        setCustomFieldsTab(customFieldsTab);
        setTabs(tabs);
      })
      .catch(error => dispatch(showErrorAlert()));
  }, [id, employeeProfileRows]);

  const openModalAssignmentReport = () => {
    if (!layoutSelected) {
      dispatch(
        showCustomAlert({
          open: true,
          message: 'Please select a Responsibility Layout first',
          type: 'warning'
        })
      );
    } else {
      setShowModalReports(true);
    }
  };


  return (
    <div style={{ width: '1000px' }}>
      <ModalAssignmentReport
        assetRows={assetsBeforeSaving}
        htmlPreview={htmlPreview}
        layoutSelected={layoutSelected}
        setShowModal={setShowModalReports}
        showModal={showModalReports}
        values={values}
      />
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
                      <BaseFields
                        catalogue={'employees'}
                        collection={'employees'}
                        formState={[formValidation, setFormValidation]}
                        localProps={baseFieldsLocalProps}
                        values={values}
                      />
                    </div>
                  </div>
                </TabContainer4>
                <TabContainer4 dir={theme4.direction}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      color='primary'
                      onClick={openModalAssignmentReport}
                      size='large'
                      style={{ marginBottom: '20px' }}
                      variant='contained'
                    >
                      Generate Report
                    </Button>
                  </div>
                  <div className='profile-tab-wrapper'>
                    <AssetTable
                      assetRows={assetsBeforeSaving}
                      onAssetFinderSubmit={handleOnAssetFinderSubmit}
                      onDeleteAssetAssigned={handleOnDeleteAssetAssigned}
                      userLocations={userLocations}
                    />
                  </div>
                </TabContainer4>
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
                                customFieldsPathResponse={customFieldsPathResponse}
                                data={tab.content[colIndex]}
                                from='form'
                                id={customField.id}
                                onClick={() => dispatch(
                                  showCustomAlert({
                                    open: true,
                                    message: customField.content,
                                    type: 'info'
                                  })
                                )}
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
  );
};

export default ModalEmployees;
