/* eslint-disable no-restricted-imports */
import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from "react-redux";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Paper,
  Tab,
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
import { forEach, omit, pick } from "lodash";
import SwipeableViews from "react-swipeable-views";
import CloseIcon from "@material-ui/icons/Close";
import { actions } from '../../../../store/ducks/general.duck';
import { postDB, getDB, getOneDB, updateDB, postFILE, getDBComplex } from '../../../../crud/api';
import CircularProgressCustom from '../../Components/CircularProgressCustom';
import CustomFields from '../../Components/CustomFields/CustomFields';
import { getCurrentDateTime, simplePost } from '../../utils';
import AssetFinderPreview from '../../Components/AssetFinderPreview';
import TableComponent from '../../Components/TableComponent';
import { collections } from '../../constants';
import LiveProcessTab from '../components/LiveProcessTab.jsx';
import { transformProcess } from './utils';

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

const ModalProcessLive = (props) => {
  const { showModal, setShowModal, reloadTable, id, user } = props;
  const dispatch = useDispatch();
  const { showCustomAlert } = actions;
  // Example 4 - Tabs
  const [loading, setLoading] = useState(false);
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
    functions: ['Start Stage', 'Control Stage'],
    //
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

  const checkValidLocations = (processType) => {
    if (['creation', 'movement'].includes(processType)) {
      if (!cartRows.length) {
        alert('First, please add assets');
        return false;
      }

      const locationsSet = cartRows.every((row) => row.locationId);
      const firstLocationId = cartRows[0].locationId;
      const sameLocation = cartRows.every((row) => row.locationId === firstLocationId);

      if (!locationsSet || !sameLocation) {
        alert('In Creation and Movement processes, all assets should have the same location selected');
        return false;
      }

      return true;
    } else {
      return true;
    }
  };

  const checkValidDirectBoss = async (_processData, _stageKeys) => {
    const boss = await getBossInfo();
    if(!boss){
      dispatch(showCustomAlert({
        type: 'warning',
        open: true,
        message: 'Current user should have a boss assigned in order to create the process'
      }));
      return false;
    }
    _stageKeys.map(stageKey => {
      _processData.stages[stageKey].approvals[_processData.stages[stageKey].approvals.findIndex(e => e._id === 'boss')] = {...boss, fulfillDate: '', fulfilled: false, virtualUser: 'boss'};
      _processData.stages[stageKey].notifications[_processData.stages[stageKey].notifications.findIndex(e => e._id === 'boss')] = {...boss, fulfillDate: '', fulfilled: false, virtualUser: 'boss'};
    });
    return true;
  };

  const checkValidLocationManager = async(_cartRows, _processData, _stageKeys) => {
    const {locationId, locationName} = _cartRows[0];
    const manager = await getLocationManagerInfo(locationId);
    if(!manager){
      dispatch(showCustomAlert({
        type: 'warning',
        open: true,
        message: `${locationName} doesn't have a Location Manager`
      }));
      return false;
    }
    _stageKeys.map(stageKey => {
      _processData.stages[stageKey].approvals[_processData.stages[stageKey].approvals.findIndex(e => e._id === 'locationManager')] = {...manager, fulfillDate: '', fulfilled: false, virtualUser: 'locationManager'};
      _processData.stages[stageKey].notifications[_processData.stages[stageKey].notifications.findIndex(e => e._id === 'locationManager')] = {...manager, fulfillDate: '', fulfilled: false, virtualUser: 'locationManager'};
    });

    return true;
  };

  const recursiveFindWitnessByLocation = (allLocations, allWitnesses, currentLocation) => {
    const witness = allWitnesses.find(({location}) => location.locationSelected === currentLocation.id);
    if(witness){
      const { value: _id, label: email, name, lastName } = witness.userSelected;
      return { _id, email, name, lastName };
    }
    else if(!witness && currentLocation.parent !== 'root'){
      currentLocation = allLocations.find(({id}) => currentLocation.parent === id);
      return recursiveFindWitnessByLocation(allLocations, allWitnesses, currentLocation);
    }
    return;
  };

  const recursiveFindSpecialist = (allLocations, allSpecialists, currentLocation, allCategories) => {
    const specialist = allSpecialists.filter(({location, categorySelected}) => location.locationSelected === currentLocation.id && (allCategories.includes(categorySelected.value)));
    if(specialist.length){
      specialist.map(({categorySelected}) => {
        const deleteIndex = allCategories.findIndex((e) => e === categorySelected.value);
        if(deleteIndex !== -1){
          allCategories.splice(deleteIndex, 1);
        }
      });
    }
    if(allCategories.length <= 0 || currentLocation.parent === 'root'){
      return specialist;
    }
    else if(currentLocation.parent !== 'root' && allCategories.length){
      currentLocation = allLocations.find(({id}) => currentLocation.parent === id);
      const otherSpecialists = recursiveFindSpecialist(allLocations, allSpecialists, currentLocation, allCategories);
      return otherSpecialists ? specialist.concat(otherSpecialists) : specialist; 
    }
    return;
  };
  
  const checkValidLocationWitness = async(_cartRows, _processData, _stageKeys) => {
    const {locationId, locationName} = _cartRows[0];
    const allLocations = await getLocations();
    const allWitnesses = await getWitnesses();
    var currentLocation = allLocations.find(({id}) => locationId === id);
    var recursiveResult = await recursiveFindWitnessByLocation(allLocations, allWitnesses, currentLocation);

    if(!recursiveResult){
      dispatch(showCustomAlert({
        type: 'warning',
        open: true,
        message: `Neither "${locationName}" nor any of its parents have a Location Witness`
      }));
      return false;
    }
    
    _stageKeys.map(stageKey => {
      _processData.stages[stageKey].approvals[_processData.stages[stageKey].approvals.findIndex(e => e._id === 'locationWitness')] = {...recursiveResult, fulfillDate: '', fulfilled: false, virtualUser: 'locationWitness'};
      _processData.stages[stageKey].notifications[_processData.stages[stageKey].notifications.findIndex(e => e._id === 'locationWitness')] = {...recursiveResult, fulfillDate: '', fulfilled: false, virtualUser: 'locationWitness'};
    });
    return true;
  };

  const checkValidAssetSpecialist = async(_cartRows, _processData, _stageKeys) => {
    const {locationId, locationName} = _cartRows[0];
    const allLocations = await getLocations();
    const allSpecialists = await getAssetSpecialists();
    var allCategories = _cartRows.map(({selectedProfile}) => selectedProfile.value);
    var currentLocation = allLocations.find(({id}) => locationId === id);
    
    const recursiveResult = await recursiveFindSpecialist(allLocations, allSpecialists, currentLocation, allCategories);

    if(allCategories.length){
      dispatch(showCustomAlert({
        type: 'warning',
        open: true,
        message: `Neither "${locationName}" nor any of its parents have an Asset Specialist for the assets selected`
      }));
      return false;
    }

    _stageKeys.map(stageKey => {
      const approvalIndex = _processData.stages[stageKey].approvals.findIndex(e => e._id === 'assetSpecialist');
      const notificationIndex = _processData.stages[stageKey].notifications.findIndex(e => e._id === 'assetSpecialist');
      if(approvalIndex !== -1){
        _processData.stages[stageKey].approvals.splice(approvalIndex, 1);
        recursiveResult.map(({userSelected}) => {
          const {value:_id, label: email, name, lastName} = userSelected;
          _processData.stages[stageKey].approvals.push({_id, email, name, lastName, fulfillDate: '', fulfilled: false, virtualUser: 'assetSpecialist'});
        });
      }
      if(notificationIndex !== -1){
        _processData.stages[stageKey].notifications.splice(notificationIndex, 1);
        recursiveResult.map(({userSelected}) => {
          const {value:_id, label: email, name, lastName } = userSelected;
          _processData.stages[stageKey].notifications.push({_id, email, name, lastName, fulfillDate: '', fulfilled: false, virtualUser: 'assetSpecialist'});
        });       
      }     
    });
    return true;
  };

  const handleSave = async () => {
    setLoading(true);
    const body = {
      ...values,
      cartRows,
      requestUser: pick(user, ['email', 'id', 'lastName', 'name'])
    };
    if (!id) {
      body.processData = transformProcess(processes, values.selectedProcess);
      const stageKeys = Object.keys(body.processData.stages);
      const allApprovals = stageKeys.map(e => (body.processData.stages[e].approvals)).flat().map(f => (f._id));
      if (allApprovals.includes('boss')) {
        if(! await checkValidDirectBoss(body.processData, stageKeys)){
          return;
        }
      }
      if (!checkValidLocations(body.processData.selectedProcessType)) {
        return;
      }
      if (allApprovals.includes('locationManager')) {
         if(! await checkValidLocationManager(body.cartRows, body.processData, stageKeys)){
          return;
        }
      }
      if (allApprovals.includes('locationWitness')) {
        if(! await checkValidLocationWitness(body.cartRows, body.processData, stageKeys)){
         return;
       }
     }
     if (allApprovals.includes('assetSpecialist')) {
      if(! await checkValidAssetSpecialist(body.cartRows, body.processData, stageKeys)){
       return;
     }
   }
      postDB('processLive', body)
        .then(data => data.json())
        .then(async response => {
          const processLiveResponse = response.response[0];
          const { _id } = processLiveResponse;
          groomProcess(processLiveResponse);
          const { processData: { selectedProcessType } } = processLiveResponse;
          if (selectedProcessType !== 'short') {
            updateDB('processLive/', omit(processLiveResponse, '_id'), _id)
                .then(() => saveAndReload('processLive', processLiveResponse._id))
                .catch(error => console.log(error));
              setAssetsStatus(processLiveResponse, selectedProcessType);
          }
        })
        .catch(error => console.log(error));
    } else {
      const isApprovalComplete = checkApprovalComplete();
      if (!isApprovalComplete) {
        alert('You have to validate all assets');
        return;
      }
      const processData = applyApproval();
      processInfo.processData =  processData;
      groomProcess(processInfo);
      setTimeout(() => {
        updateDB('processLive/', { processData: processInfo.processData }, id[0])
          .then(data => data.json())
          .then(response => {
            const queryExact = [{ key: 'userId', value: user.id }, { key: 'processId', value: id[0] }];
            getDBComplex({ collection: 'processApprovals', queryExact, operator: '$and' })
              .then(response => response.json())
              .then(data => {
                const { _id } = data.response[0];
                const { dateFormatted, timeFormatted } = getCurrentDateTime();
                updateDB('processApprovals/', { fulfilled: true, fulfillDate: `${dateFormatted} ${timeFormatted}` }, _id)
                  .then(data => data.json())
                  .then(response => {
                  })
                  .catch(error => console.log(error));
              })
              .catch(error => console.log('error>', error));
          })
          .catch(error => console.log(error));
      }, 1000);
    }

    handleCloseModal();
  };

  const setAssetsStatus = ({ cartRows = [] }, selectedProcessType) => {
    const status = selectedProcessType === 'maintenance' ? 'maintenance' : 'inProcess';
    cartRows.forEach(({ id }) => {
      updateDB('assets/', { status }, id)
        .catch(error => console.log(error));
    });
  };

  const checkApprovalComplete = () => {
    const totalAssets = processInfo.cartRows.length || 0;
    const validatedAssets = cartRows.filter(({ status }) => status).length;

    return totalAssets === validatedAssets;
  };

  const applyApproval = () => {
    const { dateFormatted, timeFormatted } = getCurrentDateTime();
    const { processData } = processInfo;
    const { currentStage } = processData;
    if (currentStage === 0) {
      return initializeStage(process);
    }
    const currentStageData = getCurrentStageData(currentStage, processData);
    const { approvals } = currentStageData;
    const currentUserApproval = approvals.find(({ _id }) => _id === user.id);
    currentUserApproval.cartRows = cartRows;
    currentUserApproval.fulfilled = true;
    currentUserApproval.fulfillDate = `${dateFormatted} ${timeFormatted}`;

    return processData;
  };

  const groomProcess = (process) => {
    const { processData } = process;
    const { currentStage, totalStages } = processData;
    if (currentStage === 0) {
      const { selectedProcessType } = processData;
      return selectedProcessType === 'short' ? finishProcess(process) : initializeStage(process);
    }
    const currentStageData = getCurrentStageData(currentStage, processData);
    const isStageFulfilled = getIsStageFulfilled(currentStageData);
    if (!isStageFulfilled) {
      return;
    }
    const isLastStage = currentStage === totalStages;
    currentStageData.stageFulfilled = true;
    if (!isLastStage) {
      initializeStage(process);
    } else {
      finishProcess(process);
    }
  };
  const getLocations = () => {
    return getDB('locationsReal/')
      .then(response => response.json())
      .then(data => {
        const filtered = data.response.map(({_id : id, name, parent}) => ({ id, name, parent}))
        return filtered;
      })
      .catch(error => console.log(error));
  };

  const getWitnesses = () => {
    return getDB('settingsWitnesses/')
      .then(response => response.json())
      .then(data => {
        const filtered = data.response.map(({_id : id, location, userSelected}) => ({ id, location, userSelected}));
        return filtered;
      })
      .catch(error => console.log(error));
  };

  const getAssetSpecialists = () => {
    return getDB('settingsAssetSpecialists/')
      .then(response => response.json())
      .then(data => {
        const filtered = data.response.map(({_id : id, location, userSelected, categorySelected}) => ({ id, location, userSelected, categorySelected}));
        return filtered;
      })
      .catch(error => console.log(error));
  };

  const getBossInfo = () => {
    return getOneDB('user/', user?.id)
      .then(response => response.json())
      .then(data => {
        const { selectedBoss = {} } = data.response;
        if(!selectedBoss || Object.keys(selectedBoss).length <= 0){
          return undefined;
        }
        const { value: _id, label: email, name, lastName } = selectedBoss;

        return { _id, email, name, lastName };
      })
      .catch(error => console.log(error));
  };
  
  const getLocationManagerInfo = (locationId) => {
    return getOneDB('locationsReal/', locationId)
      .then(response => response.json())
      .then(data => {
        const { assignedTo = {} } = data.response;
        if(!assignedTo || Object.keys(assignedTo).length <= 0){
          return undefined;
        }
        const { userId: id, email, name, lastName } = assignedTo;

        return { id, email, name, lastName };
      })
      .catch(error => console.log(error));
  };

   const sendMessages = (stageData, requestUser, processId) => {
    // Notifications are simple messages, Approvals are simple messages + ProcessApprovals DB posting
    const { dateFormatted, rawDate: formatDate, timeFormatted } = getCurrentDateTime();
    const { stageId, stageName, notifications: stageNotifications, approvals: stageApprovals } = stageData;
    const { validMessages: { notifications, approvals } } = processes[0];
    const processNotifications = notifications[stageId] || [];
    const processApprovals = approvals[stageId] || [];

    const filteredProcessMessages = (message) => Object.entries(message).map(([userId, val]) => {
      const transformedMessages = val.reduce((acu, cur) => {
        const { checked, id: layoutId, name: layoutName, selectedType: layoutType } = cur;
        const notificationObj = { layoutId, layoutName, layoutType };

        return checked ? [...acu, notificationObj] : acu;
      }, []);

      return { ...transformedMessages[0], userId };
    });
    
    const sendStageMessages = (messages, type) => {
      const isNotification = type === 'notification';
      const messagesType = isNotification ? stageNotifications : stageApprovals;

      messagesType.forEach(async(message) => {        
        const foundMessage = messages.find(({ userId }) => userId === message._id);
        const layoutId = foundMessage ? foundMessage.layoutId : null;
        const fromObj = pick(requestUser, ['email', 'name', 'lastName']);
        const from = [{ _id: requestUser.id, ...fromObj }];
        const html = layoutId ? processLayouts.find(({ id }) => id === layoutId).layout || '' : null;
        const timeStamp = `${dateFormatted} ${timeFormatted}`;
        const subject = isNotification ?
          `New notification from Stage: ${stageName}` :
          `New approval request from Stage: ${stageName}`;
        
        let targetUserInfo = {
          email: message.email,
          id: message._id,
          lastName: message.lastName,
          name: message.name
        };
  
        const messageObj = {
          html,
          formatDate,
          from,
          read: false,
          status: `new`,
          subject,
          timeStamp,
          to: [{
            _id: targetUserInfo.id,
            email: targetUserInfo.email,
            lastName: 'Target LastName TBD',
            name: 'Target Name TBD'
          }]
        };
        if (html) {
          simplePost(collections.messages, messageObj);
        }

        if (isNotification) {
          message.sent = true;
          message.sentDate = timeStamp;
        } else {
          const approvalObj = {
            email: targetUserInfo.email,
            fulfilled: false,
            fulfilledData: '',
            processId,
            userId: targetUserInfo.id
          };
          simplePost(collections.processApprovals, approvalObj);
        }
      });
    };

    const filteredMessages = [
      {
        message: filteredProcessMessages(processNotifications),
        type: 'notification'
      },
      {
        message: filteredProcessMessages(processApprovals),
        type: 'approval'
      }
    ];
    filteredMessages.forEach(({ message, type }) => sendStageMessages(message, type));
  };

  const finishProcess = (process) => {
    const { cartRows, processData } = process;
    const { selectedProcessType } = processData;
    const validAssets = extractValidAssets(cartRows, processData);

    const finishActions = {
      creation: () => {
        validAssets.forEach(({ name, brand, model, locationId: location, id: referenceId }) => {
          const assetObj = {
            name,
            brand,
            model,
            location,
            referenceId,
            status: 'active'
          };
          simplePost('assets', assetObj);
          alert(`${validAssets.length} Assets Created!`)
        });
      },
      decommission: () => {
        validAssets.forEach(({ id }) => {
          updateDB('assets/', { status: 'decommissioned' } , id)
            .then(() => {})
            .catch(error => console.log(error));
        });
        alert(`${validAssets.length} Assets Decommissioned!`)
      },
      movement: () => {
        validAssets.forEach(({ id, locationId: location }) => {
          updateDB('assets/', { location, status: 'active' } , id)
            .then(() => {})
            .catch(error => console.log(error));
        });
        alert(`${validAssets.length} Assets Transferred!`)
      },
      short: () => {
        validAssets.forEach(({ id, locationId: location }) => {
          updateDB('assets/', { location, status: 'active' } , id)
            .then(() => {})
            .catch(error => console.log(error));
        });
        alert(`${validAssets.length} Assets Short Transferred!`)
      },
      maintenance: () => {
        validAssets.forEach(({ id }) => {
          updateDB('assets/', { status: 'active' } , id)
            .then(() => {})
            .catch(error => console.log(error));
        });
        alert(`${validAssets.length} Assets Finished Maintenance!`)
      },
      default: () => {}
    };

    finishActions[selectedProcessType || 'default']();
  };

  const extractValidAssets = (cartRows, { stages }) => {
    const requestedAssetsIds = cartRows.map(({ id }) => id);
    Object.entries(stages).forEach(([key, { approvals }]) => {
      approvals.forEach(({ cartRows }) => {
        cartRows.forEach(({ id, status }) => {
          if (status !== 'Approved' && requestedAssetsIds.includes(id)) {
            const index = requestedAssetsIds.indexOf(id);
            requestedAssetsIds.splice(index, 1);
          }
        });
      });
    });

    return requestedAssetsIds.map((reqId) => cartRows.find(({ id }) => reqId === id));
  };

  const initializeStage = (process) => {
    const { processData, requestUser, _id: processId } = process;
    const nextStage = processData.currentStage + 1;
    processData.currentStage = nextStage;
    const stageData = getCurrentStageData(nextStage, processData);
    sendMessages(stageData, requestUser, processId); // Notifications & Approvals
    stageData.stageInitialized = true;
  };

  const getIsStageFulfilled = (currentStageData) => {
    return !currentStageData.approvals.some(({ fulfilled }) => !fulfilled);
  };

  const getCurrentStageData = (currentStage, processData) => processData.stages[`stage_${currentStage}`] || {};

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
    setCartRows([]);
    setCustomFieldsTab({});
    // setProfilePermissions([]);
    setValues({ 
      selectedProcess: ''
    });
    setTypes([]);
    setShowModal(false);
    setValue4(0);
    setIsAssetReference(null);
    // setIsAssetRepository(false);
  };

  const [processes, setProcesses] = useState([]);
  const [processInfo, setProcessInfo] = useState([]);
  const [processLayouts, setProcessLayouts] = useState([]);

  useEffect(() => {
    getDB('processes')
      .then(response => response.json())
      .then(data => {
        // const processes = data.response.map(({ _id, name, processStages, validMessages }) => ({ id: _id, name, processStages, validMessages }));
        const processes = data.response.map(
          (process) => ({ ...pick(process, ['name', 'processStages', 'validMessages', 'selectedProcessType']), id: process._id })
        );
        setProcesses(processes);
      })
      .catch(error => console.log(error));
    getDB('settingsLayoutsStages')
      .then(response => response.json())
      .then(data => {
        const layouts = data.response.map(({ _id, ...rest }) => ({ id: _id, ...rest }));
        setProcessLayouts(layouts);
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
        // setNotifications(notifications);
        // setApprovals(approvals);
      })
      .catch(error => console.log(error));
    
    getOneDB('processLive/', id[0])
      .then(response => response.json())
      .then(data => {
        setProcessInfo(data.response);
      })
      .catch(error => console.log(error));
  }, [id]);

  const [customFieldsTab, setCustomFieldsTab] = useState({});

  const [image, setImage] = useState(null);
  // const [notifications, setNotifications] = useState([]);
  // const [approvals, setApprovals] = useState([]);
  const [assetsSelected, setAssetsSelected] = useState([]);
  const [cartRows, setCartRows] = useState([]);
  const [isAssetReference, setIsAssetReference] = useState(null);
  // const onChangeNotificationsApprovals = name => (event, values) => {
  //   if (name === 'notifications') {
  //     setNotifications(values);
  //   } else if (name === 'approvals')
  //     setApprovals(values);
  // }
  const onSelectionChange = (selection) => {
    console.log('selection:', selection)
    
    setAssetsSelected(selection.rows || []);
  };
  const onAddAssetToCart = () => {
    // const convertAssets = assetsSelected.map(({ name, brand, model }, ix) => createAssetReferenceCartRow('id' + ix, name, brand, model));
    // setCartRows([ ...cartRows, ...convertAssets ]);
    setCartRows([...cartRows, ...assetsSelected]);
    setAssetsSelected([]);
  };

  const renderTabs = () => {
    const tabs = (children) => (
      <Tabs
        value={value4}
        onChange={handleChange4}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
      >
        {children}
      </Tabs>
    );

    const generateTabs = (tabs) => tabs.map((tab) => <Tab label={tab} />)

    if (!id) {
      return tabs(generateTabs(['General', 'Table']));
    } else {
      return tabs(generateTabs(['Live Process']));
    }
  };

  const renderTabsContent = () => {
    const handleSelectProcessChange = (event) => {
      setValues((prev) => ({ ...prev, selectedProcess: event.target.value }));
      const { selectedProcessType } = processes.find(({ id }) => id === event.target.value);
      setIsAssetReference(selectedProcessType === 'creation' ? true : false);
    };

    if (!id) {
      return (
        <SwipeableViews
          axis={theme4.direction === "rtl" ? "x-reverse" : "x"}
          index={value4}
          onChangeIndex={handleChangeIndex4}
        >
          <TabContainer4 dir={theme4.direction}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <FormControl className={classes.textField}>
                  <InputLabel htmlFor="age-simple">Select Process</InputLabel>
                  <Select
                    onChange={handleSelectProcessChange}
                    value={values.selectedProcess}
                  >
                    {(processes || []).map(({ id, name }, ix) => (
                      <MenuItem key={`opt-name-${ix}`} value={id}>{name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <button type="button" onClick={onAddAssetToCart} className='btn btn-primary btn-elevate kt-login__btn-primary'>
                  <i className="la la-plus" /> Add Assets
                </button>
              </div>
              {isAssetReference !== null &&
                <AssetFinderPreview isAssetReference={isAssetReference} onSelectionChange={onSelectionChange}/>
              }
            </div>
          </TabContainer4>
          <TabContainer4 dir={theme4.direction}>
            {isAssetReference !== null &&
              <AssetFinderPreview
                isAssetReference={isAssetReference}
                isSelectionTable={true}
                onSelectionChange={onSelectionChange}
                rows={cartRows}
                onSetRows={setCartRows}
              />
            }
          </TabContainer4>
        </SwipeableViews>
      );
    } else {
      return (
        <SwipeableViews
          axis={theme4.direction === "rtl" ? "x-reverse" : "x"}
          index={value4}
          onChangeIndex={handleChangeIndex4}
        >
          <TabContainer4 dir={theme4.direction}>
            <LiveProcessTab
              onSelectionChange={onSelectionChange}
              onSetRows={setCartRows}
              processInfo={processInfo}
              rows={cartRows}
            />
          </TabContainer4>
        </SwipeableViews>
      );
    }
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
          {`${id ? 'Edit' : 'Add' } Live Process`}
        </DialogTitle5>
        <DialogContent5 dividers>
          <div className="kt-section__content" style={{margin:'-16px'}}>
            <div className={classes4.root}>
              <Paper className={classes4.root}>
                {renderTabs()}
              </Paper>
              {renderTabsContent()}
            </div>
            <div>
              
            </div>
          </div>
        </DialogContent5>
        <DialogActions5>
          { loading && 
            <CircularProgressCustom size={20} />
          }
          <Button onClick={() => handleSave().then(() => setLoading(false))} color="primary">
            Save changes
          </Button>
        </DialogActions5>
      </Dialog>    
    </div>
  )
};

const test = [{
  brand: "Huawei",
  id: "id0",
  model: "x3",
  name: "Router"
}]

const getColumns = (isAssetReference = true) => {
  const assetReference = [
    { id: "name", numeric: false, disablePadding: false, label: "Name" },
    { id: "brand", numeric: false, disablePadding: false, label: "Brand" },
    { id: "model", numeric: false, disablePadding: false, label: "Model" },
  ];

  if (isAssetReference) {
    return assetReference;
  } else {
    return [
      ...assetReference,
      { id: "assigned", numeric: false, disablePadding: false, label: "Assigned" },
      { id: "id", numeric: false, disablePadding: false, label: "EPC" },
      { id: "sn", numeric: false, disablePadding: false, label: "Serial Number" }
    ]
  }
};

const createAssetCartRow = (id, name, brand, model, assigned, epc, sn) => {
  return { id, name, brand, model, assigned, epc, sn };
};

const createAssetReferenceCartRow = (id, name, brand, model) => {
  return { id, name, brand, model };
};

const processesHeadRows = [
  { id: "name", numeric: false, disablePadding: false, label: "Name" },
  { id: "numberOfStages", numeric: false, disablePadding: false, label: "Number of Stages" },
  { id: "creator", numeric: false, disablePadding: false, label: "Creator" },
  { id: "creation_date", numeric: false, disablePadding: false, label: "Creation Date" }
];

const mapStateToProps = ({ auth: { user } }) => ({ user });

export default connect(mapStateToProps)(ModalProcessLive);
