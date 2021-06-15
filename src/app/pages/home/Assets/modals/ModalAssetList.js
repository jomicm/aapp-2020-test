/* eslint-disable no-restricted-imports */
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import SwipeableViews from "react-swipeable-views";
import { isEmpty } from 'lodash';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent
} from '@material-ui/lab';

import {
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  InputAdornment,
  makeStyles,
  Paper,
  Tab,
  Tabs,
  Typography,
  useTheme,
  withStyles,
} from "@material-ui/core";
import TimelineIcon from '@material-ui/icons/Timeline';
import CloseIcon from "@material-ui/icons/Close";

import { actions } from '../../../../store/ducks/general.duck';
import { postDB, getOneDB, updateDB } from '../../../../crud/api';
import BaseFields from '../../Components/BaseFields/BaseFields';
import ImageUpload from '../../Components/ImageUpload';
import { getFileExtension, saveImage, getImageURL, getLocationPath } from '../../utils';
import { CustomFieldsPreview } from '../../constants';
import './ModalAssetList.scss';
import OtherModalTabs from '../components/OtherModalTabs';
import { pick } from 'lodash';
import { executePolicies, executeOnLoadPolicy } from '../../Components/Policies/utils';
import ModalYesNo from '../../Components/ModalYesNo';

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

const DialogTitle5 = withStyles(styles5)(props => {
  const { children, classes, onClose } = props;
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

// Example 5 - Tabs
const useStyles5 = makeStyles({
  root: {
    flexGrow: 1
  }
});

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
  },
}));

const ModalAssetList = ({ assets, showModal, setShowModal, referencesSelectedId, reloadTable, id, policies, userLocations }) => {
  const dispatch = useDispatch();
  const { showCustomAlert, showErrorAlert, showFillFieldsAlert, showSavedAlert, showUpdatedAlert } = actions;

  // Other Tab
  const [assetLocation, setAssetLocation] = useState('');
  const [locationReal, setLocationReal] = useState('');
  const [layoutMarker, setLayoutMarker] = useState();
  const [mapMarker, setMapMarker] = useState();
  const [assetsBeforeSaving, setAssetsBeforeSaving] = useState([]);
  const [assetsToDelete, setAssetsToDelete] = useState([]);
  const [showAssignedConfirmation, setShowAssignedConfirmation] = useState(false);
  const [assetsAssigned, setAssetsAssigned] = useState([]);
  const [confirmationText, setConfirmationText] = useState('');

  // Example 4 - Tabs
  const classes4 = useStyles4();
  const theme4 = useTheme();
  const [value4, setValue4] = useState(0);
  function handleChange4(event, newValue) {
    setValue4(newValue);
  }
  const handleChangeIndex4 = (index) => setValue4(index);
  // Example 5 - Tabs
  const classes5 = useStyles5();
  const [value5, setValue5] = useState(0);
  const [openHistory, setOpenHistory] = useState(false);
  const [customFieldsPathResponse, setCustomFieldsPathResponse] = useState();
  const [referenceImage, setReferenceImage] = useState('');

  const createAssetRow = (id, name, brand, model, parent, EPC, serial) => {
    return { id, name, brand, model, parent, EPC, serial };
  };

  function handleChange5(event, newValue) {
    setValue5(newValue);
  }

  const handleChange = name => event => {
    if (name === 'price' || name === 'purchase_price') {
      setValues({ ...values, [name]: Number(event.target.value) });
    }
    else {
      setValues({ ...values, [name]: event.target.value });
    }
  };

  const handleChildrenOnSaving = (parentId) => {
    assetsToDelete.map(asset => {
      updateDB('assets/', { parent: null }, asset.id)
        .then((response) => { })
        .catch(error => {
          dispatch(showErrorAlert())
        });
    });
    assetsBeforeSaving.map(asset => {
      updateDB('assets/', { parent: parentId }, asset.id)
        .then(response => { })
        .catch(error => {
          dispatch(showErrorAlert())
        });
    });
  };

  const handleOnAssetFinderSubmit = (filteredRows) => {
    let assetsAlreadyAssigned = [];
    filteredRows.rows.map((rowTR) => {
      if (!assetsBeforeSaving.find((row) => row.id === rowTR.id)) {
        getOneDB('assets/', rowTR.id)
          .then(response => response.json())
          .then(data => {
            const { response } = data;
            const { _id, name, brand, model, parent, serial, EPC } = response;
            if (!parent) {
              setAssetsBeforeSaving(prev => [
                ...prev,
                createAssetRow(_id, name, brand, model, null, serial, EPC)
              ]);
            } else {
              const obj = createAssetRow(_id, name, brand, model, parent, serial, EPC);
              assetsAlreadyAssigned.push(obj);
            }
          })
          .catch(error => { })
          .finally(() => {
            if (assetsAlreadyAssigned.length) {
              setAssetsAssigned(assetsAlreadyAssigned);
              setShowAssignedConfirmation(true);
              const text = assetsAlreadyAssigned.map(({ name }) => (
                <span> {name} <br /> </span>
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
          message: 'Asset already assigned to this asset',
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
      if (!row.parentId) {
        setAssetsToDelete(prev => [...prev, row]);
      }
    });
    setAssetsBeforeSaving(restRows);
  };

  const [formValidation, setFormValidation] = useState({
    enabled: false,
    isValidForm: {}
  });

  // Example 1 - TextField
  const classes = useStyles();
  const [values, setValues] = useState({
    name: '',
    brand: '',
    model: '',
    category: '',
    status: '',
    serial: '',
    responsible: '',
    notes: '',
    quantity: 0,
    purchase_date: '',
    purchase_price: 0,
    price: 0,
    total_price: 0,
    EPC: '',
    location: '',
    locationPath: '',
    creator: '',
    creationDate: '',
    labeling_user: '',
    labeling_date: ''
  });
  const [customFieldsTab, setCustomFieldsTab] = useState({});
  const [tabs, setTabs] = useState([]);

  const baseFieldsLocalProps = {
    name: {
      componentProps: {
        onChange: handleChange('name'),
        value: values.name,
        inputProps: {
          readOnly: true,
        }
      }
    },
    brand: {
      componentProps: {
        onChange: handleChange('brand'),
        value: values.brand,
        inputProps: {
          readOnly: true,
        }
      }
    },
    model: {
      componentProps: {
        onChange: handleChange('model'),
        value: values.model,
        inputProps: {
          readOnly: true,
        }
      }
    },
    category: {
      componentProps: {
        onChange: handleChange('category'),
        value: values.category?.label,
        inputProps: {
          readOnly: true,
        }
      }
    },
    status: {
      componentProps: {
        onChange: handleChange('status'),
        value: values.status,
        inputProps: {
          readOnly: true,
        }
      }
    },
    serialNumber: {
      componentProps: {
        onChange: handleChange('serial'),
        value: values.serial,
      }
    },
    parent: {
      componentProps: {
        onChange: handleChange('parent'),
        value: values.parent,
        inputProps: {
          readOnly: true,
          shrink: true
        }
      }
    },
    responsible: {
      componentProps: {
        onChange: handleChange('responsible'),
        value: values.assignedTo,
        inputProps: {
          readOnly: true,
          shrink: true
        }
      }
    },
    notes: {
      componentProps: {
        onChange: handleChange('notes'),
        value: values.notes,
        multiline: true,
        rows: 4
      }
    },
    quantity: {
      componentProps: {
        onChange: handleChange('quantity'),
        value: values.quantity,
        type: "number",
        inputProps: {
          readOnly: true,
        }
      }
    },
    purchaseDate: {
      componentProps: {
        onChange: handleChange('purchase_date'),
        value: values.purchase_date,
        type: "date",
        InputLabelProps: {
          shrink: true
        }
      }
    },
    purchasePrice: {
      ownValidFn: () => !!values.purchase_price || values.purchase_price === 0,
      componentProps: {
        onChange: handleChange('purchase_price'),
        value: values.purchase_price,
        type: "number",
        InputProps: {
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }
      }
    },
    price: {
      ownValidFn: () => !!values.price || values.price === 0,
      componentProps: {
        onChange: handleChange('price'),
        value: values.price,
        type: "number",
        InputProps: {
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }
      }
    },
    totalPrice: {
      componentProps: {
        onChange: handleChange('total_price'),
        value: values.total_price,
        type: "number",
        InputProps: {
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
          readOnly: true,
        }
      }
    },
    EPC: {
      componentProps: {
        onChange: handleChange('EPC'),
        value: values.EPC,
        inputProps: {
          readOnly: true,
        }
      }
    },
    location: {
      componentProps: {
        onChange: handleChange('location'),
        value: values.location,
        hidden: true,
        inputProps: {
          readOnly: true,
        }
      }
    },
    locationPath: {
      componentProps: {
        onChange: handleChange('locationPath'),
        values: values.locationPath,
        multine: true,
        inputProps: {
          readOnly: true,
        }
      }
    },
    creator: {
      componentProps: {
        onChange: handleChange('creator'),
        value: values.creator,
        inputProps: {
          readOnly: true,
        }
      }
    },
    creationDate: {
      componentProps: {
        onChange: handleChange('creationDate'),
        value: values.creationDate,
        inputProps: {
          readOnly: true,
        }
      }
    },
    labelingUser: {
      componentProps: {
        onChange: handleChange('labeling_user'),
        value: values.creation_date,
        inputProps: {
          readOnly: true,
        }
      }
    },
    labelingDate: {
      componentProps: {
        onChange: handleChange('labeling_date'),
        value: values.creation_date,
        inputProps: {
          readOnly: true,
        }
      }
    },
  };

  const handleLoadCustomFields = (profile) => {
    if (!profile || !profile.id) return;
    getOneDB('categories/', profile.id)
      .then(response => response.json())
      .then(data => {
        const { customFieldsTab, depreciation } = data.response;
        const tabs = Object.keys(customFieldsTab).map(key => ({ key, info: customFieldsTab[key].info, content: [customFieldsTab[key].left, customFieldsTab[key].right] }));
        tabs.sort((a, b) => a.key.split('-').pop() - b.key.split('-').pop());

        setCustomFieldsTab(customFieldsTab);
        setValues(prev => ({ ...prev, depreciation }));
        setTabs(tabs);
      })
      .catch(error => {
        dispatch(showErrorAlert())
      });
  };

  const handleSave = () => {
    setFormValidation({ ...formValidation, enabled: true });
    if (!isEmpty(formValidation.isValidForm)) {
      dispatch(showFillFieldsAlert());
      return;
    }

    const fileExt = getFileExtension(image);

    let reassignedAssets = [];
    assetsBeforeSaving.forEach(({ parent, id: assetId }) => {
      const index = reassignedAssets.findIndex((element) => element.parentId === parent);
      if (index !== - 1) {
        reassignedAssets[index].assets = [...reassignedAssets[index].assets, assetId];
      } else if (parent) {
        reassignedAssets.push({ parentId: parent, assets: [assetId] });
      }
    });

    if (reassignedAssets.length) {
      reassignedAssets.forEach(({ assets, parentId }) => {
        getOneDB('assets/', parentId)
          .then((response) => response.json())
          .then((data) => {
            const { response: { children } } = data;
            const newChildren = children.filter(({ id: assetId }) => !assets.includes(assetId));
            updateDB('assets/', { children: newChildren }, parentId)
              .catch((error) => console.log(error));
          })
          .catch((error) => console.log(error));
      })
    }

    const parseAssetsAssigned = assetsBeforeSaving.map(({ id, name, brand, model, EPC, serial }) => ({ id, name, brand, model, EPC, serial }));

    const body = {
      ...values,
      customFieldsTab,
      fileExt,
      layoutCoords: layoutMarker ? layoutMarker : null,
      mapCoords: mapMarker ? mapMarker : null,
      children: parseAssetsAssigned,
    };

    if (!id) {
      body.referenceId = referencesSelectedId;
      postDB('assets', body)
        .then(data => data.json())
        .then(response => {
          dispatch(showSavedAlert());
          const { _id } = response.response[0];
          handleChildrenOnSaving(_id);
          saveAndReload('assets', _id);
          executePolicies('OnAdd', 'assets', 'list', policies);
        })
        .catch(error => {
          dispatch(showErrorAlert())
        });
    } else {
      updateDB('assets/', body, id[0])
        .then(response => response.json())
        .then((data) => {
          dispatch(showUpdatedAlert());
          handleChildrenOnSaving(id[0]);
          saveAndReload('assets', id[0]);
          executePolicies('OnEdit', 'assets', 'list', policies);

          const { response: { value: { assigned } } } = data;

          if (assigned) {
            if (assigned.length) {
              getOneDB('employees', assigned)
                .then((response) => response.json())
                .then((data) => {
                  const { response: { assetsAssigned } } = data;
                  let newAssetsAssigned = [];
                  assetsAssigned.forEach(({ id: assetId, name, brand, model, assigned, EPC, serial }) => {
                    if (assetId === id[0]) {
                      newAssetsAssigned.push({ id: assetId, name: body.name, brand, model, assigned, EPC, serial: body.serial });
                    } else {
                      newAssetsAssigned.push({ assetId, name, brand, model, assigned, EPC, serial });
                    }
                  });
                  updateDB('employees/', { assetsAssigned: newAssetsAssigned }, assigned)
                    .catch((error) => console.log(error));
                })
                .catch((error) => console.log(error));
            }
          }
        })
        .catch(error => {
          console.log(error);
          dispatch(showErrorAlert())
        });
    }
    handleCloseModal();
  };

  const [image, setImage] = useState(null);
  const saveAndReload = (folderName, id) => {
    saveImage(image, folderName, id);
    reloadTable();
  };

  const handleCloseModal = () => {
    setCustomFieldsTab({});
    setValues({
      name: '',
      brand: '',
      model: '',
      category: '',
      status: '',
      serial: '',
      responsible: '',
      notes: '',
      quantity: 0,
      purchase_date: '',
      purchase_price: 0,
      price: 0,
      total_price: 0,
      EPC: '',
      location: '',
      locationPath: '',
      creator: '',
      creation_date: '',
      labeling_user: '',
      labeling_date: '',
      assignedTo: ''
    });
    setShowModal(false);
    setValue4(0);
    setTabs([]);
    setFormValidation({
      enabled: false,
      isValidForm: false
    });
    setMapMarker([]);
    setLayoutMarker([]);
    setLocationReal([]);
    setAssetLocation([]);
    setAssetsBeforeSaving([]);
    setAssetsToDelete([]);
    setAssetsAssigned([]);
    setReferenceImage('');
    setShowAssignedConfirmation(false);
    setConfirmationText('');
  };

  useEffect(() => {
    if (assetLocation.length) {
      getOneDB('locationsReal/', assetLocation)
        .then(response => response.json())
        .then(data => setLocationReal(data.response))
        .catch(error => console.log(`Error: ${error}`))
    }
  }, [assetLocation, id]);

  useEffect(() => {
    if (!showModal) return;

    if (referencesSelectedId) {
      getOneDB('references/', referencesSelectedId)
        .then(response => response.json())
        .then(data => {
          const { name, brand, model, customFieldsTab, fileExt } = data.response;
          setValues({
            ...values,
            name,
            brand,
            model
          });
          const tabs = Object.keys(customFieldsTab).map(key => ({ key, info: customFieldsTab[key].info, content: [customFieldsTab[key].left, customFieldsTab[key].right] }));
          tabs.sort((a, b) => a.key.split('-').pop() - b.key.split('-').pop());
          setCustomFieldsTab(customFieldsTab);
          setTabs(tabs);
          setReferenceImage(getImageURL(referencesSelectedId, 'references', fileExt));
        })
        .catch(error => {
          dispatch(showErrorAlert())
        });
    }

    if (!id || !Array.isArray(id)) return;
    getOneDB('assets/', id[0])
      .then(response => response.json())
      .then(async (data) => {
        const { name, brand, model, category, referenceId, status, serial, responsible, notes, quantity, purchase_date, purchase_price, price, total_price, EPC, location, creationUserFullName, creationDate, labeling_user, labeling_date, customFieldsTab, fileExt, assigned, layoutCoords, mapCoords, children, history, parent } = data.response;
        const date = String(new Date(creationDate)).split('GMT')[0];
        const locationPath = await getLocationPath(location);
        const assignedParent = assets.find(({ id }) => id === parent);
        const assignedParentText = assignedParent ? `${assignedParent.name || 'No Name'}, ${assignedParent.brand || 'No Brand'}, ${ assignedParent.model ||'No Model'}, ${ assignedParent.serial ||'No Serial Number'}, ${ assignedParent.EPC ? `(${assignedParent.EPC})` : 'No EPC'}` : 'No Parent Assigned';
        executePolicies('OnLoad', 'assets', 'list', policies);
        setAssetLocation(location);
        setLayoutMarker(layoutCoords) //* null if not specified
        setMapMarker(mapCoords) //* null if not specified
        setAssetsBeforeSaving(children ? children : []) //* null if not specified

        getOneDB('references/', referenceId)
          .then((response) => response.json())
          .then(async (data) => {
            const { selectedProfile: { value, label } } = data.response;
            const onLoadResponse = await executeOnLoadPolicy(value, 'assets', 'list', policies);
            setCustomFieldsPathResponse(onLoadResponse);
            setValues(prev => ({ ...prev, category: { value, label } }));
            setReferenceImage(getImageURL(referenceId, 'references', data.response.fileExt));
          })
          .catch((error) => showCustomAlert(({
            type: 'error',
            message: error,
            open: true
          })));

        if (assigned) {
          getOneDB('employees/', assigned)
            .then(response => response.json())
            .then(data => {
              const nameRes = data.response.name;
              const lastName = data.response.lasName;
              const email = data.response.email;
              const assignedTo = `${nameRes ? nameRes : ''} ${lastName ? lastName : ''} ${email ? `<${email}>` : '<No Email>'}`;
              setValues({
                ...values,
                name,
                brand,
                model,
                category,
                status,
                serial,
                responsible,
                notes,
                quantity,
                parent: assignedParentText,
                purchase_date,
                purchase_price,
                price,
                total_price: purchase_price + price,
                EPC,
                location,
                locationPath,
                creator: creationUserFullName,
                creationDate: date,
                labeling_user,
                labeling_date,
                history,
                imageURL: getImageURL(id, 'assets', fileExt),
                assignedTo
              });
            })
            .catch(error => {
              dispatch(showErrorAlert())
            });
        }
        else {
          setValues({
            ...values,
            name,
            brand,
            model,
            category,
            status,
            serial,
            responsible,
            notes,
            quantity,
            parent: assignedParentText,
            purchase_date,
            purchase_price,
            price,
            total_price,
            EPC,
            location,
            locationPath,
            creator: creationUserFullName,
            creationDate: date,
            labeling_user,
            labeling_date,
            history,
            imageURL: getImageURL(id, 'assets', fileExt),
            assignedTo: 'No Employee Assigned'
          });
        }
        if (customFieldsTab) {
          const tabs = Object.keys(customFieldsTab).map(key => ({ key, info: customFieldsTab[key].info, content: [customFieldsTab[key].left, customFieldsTab[key].right] }));
          tabs.sort((a, b) => a.key.split('-').pop() - b.key.split('-').pop());
          setCustomFieldsTab(customFieldsTab);
          setTabs(tabs);
        }
      })
      .catch(error => {
        dispatch(showErrorAlert())
      });
  }, [showModal]);

  useEffect(() => {
    setValues(prev => ({ ...prev, total_price: prev.purchase_price + prev.price }));
  }, [values.purchase_price, values.price])

  // Function to update customFields
  const handleUpdateCustomFields = (tab, id, colIndex, CFValues) => {
    const colValue = ['left', 'right'];
    const customFieldsTabTmp = { ...customFieldsTab };

    const field = customFieldsTabTmp[tab][colValue[colIndex]]
      .find(cf => cf.id === id);
    field.values = CFValues;
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
          const parseReassignedRows = assetsAssigned.map(({ id, name, brand, model, parent, EPC, serial }) => ({ ...createAssetRow(id, name, brand, model, parent, EPC, serial) }));
          setAssetsBeforeSaving(prev => [...prev, ...parseReassignedRows]);
          setShowAssignedConfirmation(false);
          setAssetsAssigned([]);
        }}
        showModal={showAssignedConfirmation}
        title="Assets already have a parent assigned. Do you want to reassign them to this asset?"
      />
      <Dialog onClose={() => setOpenHistory(false)} aria-labelledby="simple-dialog-title" open={openHistory}>
        <DialogTitle id="simple-dialog-title">History</DialogTitle>
        {
          !values || !values.history && (
            <div style={{ padding: '10px', margin: '10px' }}>
              <Typography>This Asset has no History</Typography>
            </div>
          )
        }
        {
          <Timeline >
            {
              values?.history?.map(({ processName, processType, date, label }) => (
                <TimelineItem>
                  <TimelineOppositeContent>
                    <Typography>{processName}</Typography>
                    <Typography color="textSecondary">{processType}</Typography>
                    <Typography color="textSecondary">{date}</Typography>
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography>{label}</Typography>
                  </TimelineContent>
                </TimelineItem>
              ))
            }
          </Timeline>
        }
      </Dialog>
      <Dialog
        onClose={handleCloseModal}
        aria-labelledby="customized-dialog-title"
        open={showModal}
      >
        <DialogTitle5
          id="customized-dialog-title"
          onClose={handleCloseModal}
        >
          {`${id ? 'Edit' : 'Add'} Asset`}
        </DialogTitle5>
        <DialogContent5 dividers>
          <div className="kt-section__content" style={{ margin: '-16px' }}>
            <div className={classes4.root}>
              <Paper className={classes4.root}>
                <Tabs
                  value={value4}
                  onChange={handleChange4}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="fullWidth"
                >
                  <Tab label="Asset" />
                  <Tab label="More" />
                  {tabs.map((tab, index) => (
                    <Tab key={`tab-reference-${index}`} label={tab.info.name} />
                  ))}
                </Tabs>
              </Paper>
              <SwipeableViews
                axis={theme4.direction === "rtl" ? "x-reverse" : "x"}
                index={value4}
                onChangeIndex={handleChangeIndex4}
              >
                <TabContainer4 dir={theme4.direction}>
                  <div className="profile-tab-wrapper">
                    <div className="profile-tab-wrapper__content-left">
                      <ImageUpload setImage={setImage} image={values.imageURL}>
                        Asset Photo
                      </ImageUpload>
                      <Button
                        variant="contained"
                        color="default"
                        className={classes.button}
                        startIcon={<TimelineIcon />}
                        style={{
                          marginTop: '20px',
                          marginBottom: '40px',
                          width: '60%',
                          alignSelf: 'center',
                        }}
                        onClick={() => setOpenHistory(true)}
                      >
                        History
                      </Button>
                      <ImageUpload disabled image={referenceImage} showDeleteButton={false} showButton={false}>
                        Reference Photo
                      </ImageUpload>
                    </div>
                    <div className="profile-tab-wrapper__content-left">
                      <BaseFields
                        catalogue={'assets1'}
                        collection={'assets'}
                        formState={[formValidation, setFormValidation]}
                        localProps={baseFieldsLocalProps}
                        values={values}
                      />
                    </div>
                    <div className="profile-tab-wrapper__content-left">
                      <BaseFields
                        catalogue={'assets2'}
                        collection={'assets'}
                        formState={[formValidation, setFormValidation]}
                        localProps={baseFieldsLocalProps}
                        values={values}
                      />
                    </div>
                  </div>
                </TabContainer4>
                <TabContainer4 dir={theme4.direction}>
                  <OtherModalTabs
                    key={locationReal ? locationReal : 'other-modal-tabs'}
                    locationReal={locationReal}
                    layoutMarker={layoutMarker}
                    setLayoutMarker={setLayoutMarker}
                    mapMarker={mapMarker}
                    setMapMarker={setMapMarker}
                    assetRows={assetsBeforeSaving}
                    onAssetFinderSubmit={handleOnAssetFinderSubmit}
                    onDeleteAssetAssigned={handleOnDeleteAssetAssigned}
                    userLocations={userLocations}
                  />
                </TabContainer4>
                {tabs.map(tab => (
                  <TabContainer4 dir={theme4.direction}>
                    <div className="modal-asset-reference">
                      {Array(tab.content[1].length === 0 ? 1 : 2).fill(0).map((col, colIndex) => (
                        <div className="modal-asset-reference__list-field" >
                          {tab.content[colIndex].map(customField => (
                            <CustomFieldsPreview
                              columnIndex={colIndex}
                              customFieldsPathResponse={customFieldsPathResponse}
                              data={tab.content[colIndex]}
                              from="form"
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
          <Button onClick={handleSave} color="primary">
            Save changes
          </Button>
        </DialogActions5>
      </Dialog>
    </div>
  )
};

export default ModalAssetList;
