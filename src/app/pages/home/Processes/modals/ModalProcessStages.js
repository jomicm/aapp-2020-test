/* eslint-disable no-restricted-imports */
import React, { useState, useEffect } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  IconButton,
  Paper,
  Switch,
  Tab,
  TextField,
  Tabs,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@material-ui/core";
import {
  withStyles,
  useTheme,
  makeStyles
} from "@material-ui/core/styles";
import { pick } from "lodash";
import SwipeableViews from "react-swipeable-views";
import CloseIcon from "@material-ui/icons/Close";
import CustomFields from '../../Components/CustomFields/CustomFields';

// import './ModalAssetCategories.scss';
import ImageUpload from '../../Components/ImageUpload';
import { postDB, getDB, getOneDB, updateDB, postFILE } from '../../../../crud/api';
import ModalYesNo from '../../Components/ModalYesNo';
import Permission from '../components/Permission';
import Layouts from '../components/Layouts';


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

const ModalProcessStages = ({ showModal, setShowModal, reloadTable, id }) => {
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
    functions: ['Start Stage', 'Control Stage'],
    //
    selectedFunction: '',
    selectedType: '',
    //
    isAssetEdition: false,
    isCustomLockedStage: false,
    isSelfApprove: false,
    isSelfApproveContinue: false,
    isControlDueDate: false
  });
  const [types, setTypes] = useState([]);
  // const [categoryPic, setCategoryPic] 

  const handleChange = name => event => {
    if (name === 'selectedFunction') {
      if (event.target.value === 0) {
        setTypes(['Creation', 'Movement', 'Short Movement', 'Decommission', 'Maintenance']);
      } else if (event.target.value === 1) {
        setTypes(['Approval']);
      }
    }
    setValues({ ...values, [name]: event.target.value });
  };

  const handleChangeCheck = name => event => {
    setValues({ ...values, [name]: event.target.checked });
  };

  const handleSave = () => {
    // const fileExt = getFileExtension(image);
    const body = { ...values, types, customFieldsTab, notifications, approvals };
    if (!id) {
      postDB('processStages', body)
        .then(data => data.json())
        .then(response => {
          const { _id } = response.response[0];
          saveAndReload('processStages', _id);
        })
        .catch(error => console.log(error));
    } else {
      updateDB('processStages/', body, id[0])
        .then(data => data.json())
        .then(response => {
          saveAndReload('processStages', id[0]);
        })
        .catch(error => console.log(error));
    }

    handleCloseModal();
  };

  const getFileExtension = file => {
    if (!file) return '';
    const { type } = file;
    return type.split('/')[1];
  };

  const saveAndReload = (folderName, id) => {
    saveImage(folderName, id);
    reloadTable();
  };

  const saveImage = (folderName, id) => {
    if (image) {
      postFILE(folderName, id, image)
        .then(response => {
          console.log('FIlE uploaded!', response);
        })
        .catch(error => console.log(error));
    }
  };

  const handleCloseModal = () => {
    setCustomFieldsTab({});
    // setProfilePermissions([]);
    setValues({ 
      name: "",
      functions: ['Start Stage', 'Control Stage'],
      //
      selectedFunction: '',
      selectedType: '',
      //
      isAssetEdition: false,
      isUserFilter: false,
      isCustomLockedStage: false,
      isSelfApprove: false,
      isSelfApproveContinue: false,
      isControlDueDate: false
    });
    setTypes([]);
    setShowModal(false);
    setValue4(0);
    setNotifications([]);
    setApprovals([]);
    // setIsAssetRepository(false);
  };

  const [users, setUsers] = useState([]);
  const [temporalApprovals, setTemporalApprovals] = useState([]);

  useEffect(() => {
    if((values.isSelfApprove || values.isSelfApproveContinue) && approvals.length){
      setTemporalApprovals(approvals);
      setApprovals([])
    }
    if(!values.isSelfApprove && !values.isSelfApproveContinue){
      setApprovals(temporalApprovals);
    }

  }, [values.isSelfApprove, values.isSelfApproveContinue])

  useEffect(() => {
    getDB('user')
    .then(response => response.json())
    .then(userData => {
      // const users = data.response.map(({ _id, email }) => ({ _id, email }));
      getDB('settingsGroups')
      .then(response => response.json())
      .then(data => {
        // const users = data.response.map(({ _id, email }) => ({ _id, email }));
        const groupUsers = data.response.map(({_id, name, members, numberOfMembers}) => ({
          _id,
          name,
          email: `members: ${numberOfMembers}`,
          lastName: '',
          isUserGroup: true,
          members,
        }));
        const users = userData.response.map((user) => pick(user, ['_id', 'email', 'name', 'lastName']));
        const bossUser = { _id: 'boss', email: 'auto', name: 'Direct', lastName: 'Boss' };
        const locationUser = { _id: 'locationManager', email: 'auto', name: 'Location', lastName: 'Manager' };
        const witnessUser = { _id: 'locationWitness', email: 'auto', name: 'Location', lastName: 'Witness' };
        const asssetSpecialistUser = { _id: 'assetSpecialist', email: 'auto', name: 'Asset', lastName: 'Specialist' };
        const initiator = { _id: 'initiator', email: 'auto', name: 'Process', lastName: 'Initiator' };
        setUsers([bossUser, locationUser, witnessUser, asssetSpecialistUser, initiator, ...groupUsers, ...users]);
      })
      .catch(error => console.log(error))
    })
    .catch(error => console.log(error));

    if (!id || !Array.isArray(id)) {
      return;
    }
      
    getOneDB('processStages/', id[0])
      .then(response => response.json())
      .then(data => { 
        const { types, customFieldsTab, notifications, approvals } = data.response;
        const obj = pick(data.response, ['name', 'functions', 'selectedFunction', 'selectedType', 'isAssetEdition', 'isUserFilter', 'isCustomLockedStage', 'isSelfApprove', 'isSelfApproveContinue', 'isControlDueDate']);
        setValues(obj);
        setTypes(types)
        setCustomFieldsTab(customFieldsTab);
        setNotifications(notifications);
        setApprovals(approvals);
      })
      .catch(error => console.log(error));
  }, [id]);

  const [customFieldsTab, setCustomFieldsTab] = useState({});

  const [image, setImage] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [approvals, setApprovals] = useState([]);
  const onChangeNotificationsApprovals = name => (_, values) => {
    if (name === 'notifications') {
      setNotifications(values);
    } else if (name === 'approvals')
      setApprovals(values);
  }

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
          {`${id ? 'Edit' : 'Add' } Process Stage`}
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
                  <Tab label="New Stage" />
                  <Tab label="Custom Fields" />
                </Tabs>
              </Paper>
              <SwipeableViews
                axis={theme4.direction === "rtl" ? "x-reverse" : "x"}
                index={value4}
                onChangeIndex={handleChangeIndex4}
              >
                <TabContainer4 dir={theme4.direction}>
                  <div className="profile-tab-wrapper">
                    <div className="profile-tab-wrapper__content">
                      <TextField
                        id="standard-name"
                        label="Name"
                        className={classes.textField}
                        value={values.name}
                        onChange={handleChange("name")}
                        margin="normal"
                      />
                      {/* <FormControl className={classes.textField} style={{ marginTop: '10px' }}>
                        <InputLabel htmlFor="age-simple">Function</InputLabel>
                        <Select
                          value={values.selectedFunction}
                          onChange={handleChange('selectedFunction')}
                        >
                          {(values.functions || []).map((opt, ix) => (
                            <MenuItem key={`opt-${ix}`} value={ix}>{opt}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl className={classes.textField} style={{ marginTop: '15px' }}>
                        <InputLabel htmlFor="age-simple">Type</InputLabel>
                        <Select
                          value={values.selectedType}
                          onChange={handleChange('selectedType')}
                        >
                          {(types || []).map((opt, ix) => (
                            <MenuItem key={`opt-${ix}`} value={ix}>{opt}</MenuItem>
                          ))}
                        </Select>
                      </FormControl> */}
                      <Autocomplete
                        style={{ marginTop: '15px' }}
                        className={classes.textField}
                        multiple
                        id="tags-standard"
                        options={users}
                        getOptionLabel={({email, name, lastName}) => `${name} ${lastName} (${email})`}
                        onChange={onChangeNotificationsApprovals('notifications')}
                        defaultValue={notifications}
                        value={notifications}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="standard"
                            label="Notifications"
                            // placeholder="Notifications"
                          />
                        )}
                      />
                      <Autocomplete
                        style={{ marginTop: '15px' }}
                        className={classes.textField}
                        disabled={values.isSelfApprove || values.isSelfApproveContinue}
                        multiple
                        id="tags-standard"
                        options={users}
                        getOptionLabel={({email, name, lastName}) => `${name} ${lastName} (${email})`}
                        onChange={onChangeNotificationsApprovals('approvals')}
                        defaultValue={approvals}
                        value={approvals}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="standard"
                            label="Approvals"
                            // placeholder="Approvals"
                          />
                        )}
                      />
                    </div>
                    <div className="profile-tab-wrapper__content" style={{ alignItems: 'flex-end', paddingTop: '30px' }}>
                      <FormControlLabel
                        value="start"
                        control={<Switch color="primary" checked={values.isAssetEdition} onChange={handleChangeCheck('isAssetEdition')}/>}
                        label="Asset Edition"
                        labelPlacement="start"
                      />
                      <FormControlLabel
                        value="start"
                        control={<Switch color="primary" checked={values.isCustomLockedStage} onChange={handleChangeCheck('isCustomLockedStage')}/>}
                        label="Custom Locked Stage"
                        labelPlacement="start"
                      />
                      <FormControlLabel
                        value="start"
                        control={<Switch color="primary" checked={values.isSelfApprove} onChange={handleChangeCheck('isSelfApprove')}/>}
                        label="Self-Approve"
                        labelPlacement="start"
                      />
                      <FormControlLabel
                        value="start"
                        control={<Switch color="primary" checked={values.isSelfApproveContinue} onChange={handleChangeCheck('isSelfApproveContinue')}/>}
                        label="Self-Approve-Continue"
                        labelPlacement="start"
                      />
                      <FormControlLabel
                        value="start"
                        control={<Switch color="primary" checked={values.isControlDueDate} onChange={handleChangeCheck('isControlDueDate')}/>}
                        label="Control Due Date"
                        labelPlacement="start"
                      />
                    </div>
                  </div>
                </TabContainer4>
                <TabContainer4 dir={theme4.direction}>
                  <CustomFields 
                    customFieldsTab={customFieldsTab}
                    setCustomFieldsTab={setCustomFieldsTab}
                  />
                </TabContainer4>
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

export default ModalProcessStages;
