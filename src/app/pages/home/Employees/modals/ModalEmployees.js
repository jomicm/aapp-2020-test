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
import { executePolicies, executeOnLoadPolicy, executeOnFieldPolicy } from '../../Components/Policies/utils';
import BaseFields from '../../Components/BaseFields/BaseFields';
import { CustomFieldsPreview } from '../../constants';
import ImageUpload from '../../Components/ImageUpload'
import { getFileExtension, saveImage, getImageURL, verifyCustomFields, verifyRepeatedValues } from '../../utils';
import {
  getDB,
  getOneDB,
  postDB,
  updateDB
} from '../../../../crud/api';
import AssetTable from '../components/AssetTable';
import ModalYesNo from '../../Components/ModalYesNo'
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
  reloadProfiles,
  showModal,
  setShowModal,
  userLocations
}) => {
  const dispatch = useDispatch();
  const { showCustomAlert, showFillFieldsAlert, showErrorAlert, showSavedAlert, showUpdatedAlert } = actions;

  /* Assets */

  const [assetsBeforeSaving, setAssetsBeforeSaving] = useState([]);
  const [assetsToDelete, setAssetsToDelete] = useState([]);
  const [showAssignedConfirmation, setShowAssignedConfirmation] = useState(false);
  const [assetsAssigned, setAssetsAssigned] = useState([]);
  const [confirmationText, setConfirmationText] = useState('');

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
    employee_id: '',
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
      updateDB('assets/', { assigned: null, assignedTo: "" }, asset.id)
        .then((response) => { })
        .catch(error => dispatch(showErrorAlert()));
    });
    assetsBeforeSaving.map(asset => {
      updateDB('assets/', { assigned: id, assignedTo: `${values.name} ${values.lastName} <${values.email}>` }, asset.id)
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
      setValues(prev => ({ ...prev, employeeProfile: e }));
      setCustomFieldsTab({});
      setProfilePermissions({});
      setProfileSelected(e);
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
        setValues(prev => ({ ...prev, employeeProfile: e }));
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
    employee_id: {
      componentProps: {
        onChange: handleChange('employee_id')
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
          
          setValues(prev => ({ ...prev, layoutSelected: layout }));
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
      employee_id: '',
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
    setAssetsAssigned([]);
    setFormValidation({
      enabled: false,
      isValidForm: false
    });
    setResponsabilityLayout({
      added: {},
      initial: {},
      removed: {}
    });
    setShowAssignedConfirmation(false);
    setConfirmationText('');
  };

  const createAssetRow = (id, name, brand, model, assigned, EPC, serial) => {
    return { id, name, brand, model, assigned, EPC, serial };
  };

  const handleOnAssetFinderSubmit = (filteredRows) => {
    let assetsAlreadyAssigned = [];
    filteredRows.rows.map((rowTR) => {
      if (!assetsBeforeSaving.find((row) => row.id === rowTR.id)) {
        getOneDB('assets/', rowTR.id)
          .then(response => response.json())
          .then(data => {
            const { response } = data;
            if (!response.assigned) {
              setAssetsBeforeSaving(prev => [
                ...prev,
                createAssetRow(response._id, response.name, response.brand, response.model, false, response.EPC, response.serial)
              ]);
              return;
            }

            const obj = createAssetRow(response._id, response.name, response.brand, response.model, false, response.EPC, response.serial);

            assetsAlreadyAssigned.push({
              ...obj,
              employeeId: response.assigned,
              employeeName: response.assignedTo
            });
          })
          .catch(error => console.log(error))
          .finally(() => {
            if (assetsAlreadyAssigned.length) {
              setAssetsAssigned(assetsAlreadyAssigned);
              setShowAssignedConfirmation(true);
              const text = assetsAlreadyAssigned.map(({ name, employeeName }) => (
                <span> {name} - {employeeName || 'No Employee Name Founded'} <br /> </span>
              ));
              setConfirmationText((
                <>
                  {text}
                </>
              ))
            }
          });
      } else {
        dispatch(showCustomAlert({
          message: 'Asset already assigned to this employee',
          open: true,
          type: 'warning'
        }));
      }
    });
  };

  const handleOnDeleteAssetAssigned = (id) => {
    const restRows = assetsBeforeSaving.filter(row => {
      if (!id.includes(row.id)) {
        return row;
      }
      if (!row.employeeId) {
        setAssetsToDelete(prev => [...prev, row]);
      }
    });
    setAssetsBeforeSaving(restRows);
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

    const fileExt = getFileExtension(image);

    let reassignedAssets = [];

    assetsBeforeSaving.forEach(({ employeeId, id: assetId }) => {
      const index = reassignedAssets.findIndex((element) => element.employeeId === employeeId);
      if (index !== - 1) {
        reassignedAssets[index].assets = [...reassignedAssets[index].assets, assetId];
      } else if (employeeId) {
        reassignedAssets.push({ employeeId, assets: [assetId] });
      }
    });

    if (reassignedAssets.length) {
      reassignedAssets.forEach(({ assets, employeeId }) => {
        getOneDB('employees/', employeeId)
          .then((response) => response.json())
          .then((data) => {
            const { response: { assetsAssigned } } = data;
            const newAssetsAssigned = assetsAssigned.filter(({ id: assetId }) => !assets.includes(assetId));
            updateDB('employees/', { assetsAssigned: newAssetsAssigned }, employeeId)
              .catch((error) => console.log(error));
          })
          .catch((error) => console.log(error));
      })
    }

    const parseAssetsAssigned = assetsBeforeSaving.map(({ id, name, brand, model, assigned, EPC, serial }) => createAssetRow(id, name, brand, model, assigned, EPC, serial));

    const body = {
      ...values,
      customFieldsTab,
      profilePermissions,
      locationsTable,
      layoutSelected,
      fileExt,
      assetsAssigned: parseAssetsAssigned
    };

    if (!id) {
      body.idUserProfile = idUserProfile;
      postDB('employees', body)
        .then((data) => data.json())
        .then((response) => {
          dispatch(showSavedAlert());
          const { _id } = response.response[0];
          saveAndReload('employees', _id);
          executePolicies('OnAdd', 'employees', 'list', policies, response.response[0]);
          executeOnFieldPolicy('OnAdd', 'employees', 'list', policies, response.response[0]);
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
        .then((response) => response.json())
        .then(data => {
          const { response: { value } } = data;

          dispatch(showUpdatedAlert());
          saveAndReload('employees', id[0]);
          handleAssignmentsOnSaving(id[0]);
          executePolicies('OnEdit', 'employees', 'list', policies, body);
          executeOnFieldPolicy('OnEdit', 'employees', 'list', policies, body, value);

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
    reloadProfiles();
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
        const {
          name,
          lastName,
          email,
          employee_id,
          customFieldsTab,
          profilePermissions,
          idUserProfile,
          locationsTable,
          layoutSelected,
          fileExt,
          assetsAssigned = []
        } = data.response;
        const onLoadResponse = await executeOnLoadPolicy(idUserProfile, 'employees', 'list', policies, data.response);
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
          layoutSelected,
          email,
          employee_id: employee_id || '',
          isDisableUserProfile: true,
          imageURL: getImageURL(id, 'employees', fileExt),
          employeeProfile: employeeProfilesFiltered.filter((profile) => profile.value === idUserProfile)
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
      <ModalYesNo
        message={confirmationText}
        onCancel={() => {
          setShowAssignedConfirmation(false);
          setAssetsAssigned([]);
        }}
        onOK={() => {
          const parseReassignedRows = assetsAssigned.map(({ id, name, brand, model, assigned, EPC, serial, employeeId }) => ({ ...createAssetRow(id, name, brand, model, assigned, EPC, serial), employeeId }));
          setAssetsBeforeSaving(prev => [...prev, ...parseReassignedRows]);
          setShowAssignedConfirmation(false);
          setAssetsAssigned([]);
        }}
        showModal={showAssignedConfirmation}
        title="Assets already assigned. Do you want to reassign them to you?"
      />
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
