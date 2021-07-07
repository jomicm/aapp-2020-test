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
  TextField,
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
import { omit, pick, uniq } from "lodash";
import SwipeableViews from "react-swipeable-views";
import CloseIcon from "@material-ui/icons/Close";
import { actions } from '../../../../store/ducks/general.duck';
import { postDB, getDB, getOneDB, updateDB, deleteDB, postFILE, getDBComplex, getCountDB } from '../../../../crud/api';
import CircularProgressCustom from '../../Components/CircularProgressCustom';
import CustomFields from '../../Components/CustomFields/CustomFields';
import { CustomFieldsPreview } from '../../constants';
import { getCurrentDateTime, simplePost, getLocationPath, getVariables } from '../../utils';
import AssetFinderPreview from '../../Components/AssetFinderPreview';
import TableComponent2 from '../../Components/TableComponent2';
import { collections } from '../../constants';
import LiveProcessTab from '../components/LiveProcessTab.jsx';
import { transformProcess } from './utils';
import { extractCustomFieldValues } from '../../Reports/reportsHelpers'

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

const GreyTypography = withStyles({
  root: {
    color: "#828282"
  }
})(Typography);


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
const TabContainerCustom = ({ children, dir }) => {
  return (
    <Typography component="div" dir={dir} style={{ paddingTop: 8 * 2 }}>
      {children}
    </Typography>
  );
}
const useStyles4 = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 1000
  },
  subTab: {
    backgroundColor: theme.palette.background.paper,
    width: '80%'
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
    marginRight: '40px',
    width: '200px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  dense: {
    marginTop: 19,
  },
  menu: {
    width: '100%',
    marginRight: '200px'
  },
  secondaryText: {
    color: 'grey'
  },
}));

const ModalProcessLive = (props) => {
  const { showModal, setShowModal, reloadTable, id, user } = props;
  const dispatch = useDispatch();
  const { showCustomAlert, showErrorAlert } = actions;
  // Example 4 - Tabs
  const [loading, setLoading] = useState(false);
  const classes4 = useStyles4();
  const theme4 = useTheme();
  const [value4, setValue4] = useState(0);
  const [stageTabSelected, setStageTabSelected] = useState(0);
  const [customTabSelected, setCustomTabSelected] = useState(0);
  const [assetFinderTab, setAssetFinderTab] = useState(0);
  const [locationsAssetRepository, setLocationsAssetRepository] = useState([]);
  const [allLocations, setAllLocations] = useState([]);
  const [allStages, setAllStages] = useState([]);
  const [dueDate, setDueDate] = useState(undefined);
  const [linkToProcess, setLinkToProcess] = useState(undefined);

  function handleChange4(event, newValue) {
    setValue4(newValue);
  }
  const handleChangeStageTab = (event, newValue) => {
    setCustomTabSelected(0);
    setStageTabSelected(newValue);
  }
  const handleChangeCustomFieldTab = (event, newValue) => {
    setCustomTabSelected(newValue);
  }
  const handleChangeAssetFinder = (event, newValue) => {
    setAssetFinderTab(newValue);
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

  const handleUpdateCustomFields = (tab, id, colIndex, CFValues) => {
    if(!Object.keys(customFieldsTab).length){
      return;
    }
    const colValue = ['left', 'right'];
    const customFieldsTabTmp = { ...customFieldsTab };

    const field = customFieldsTabTmp[stageTabSelected][tab][colValue[colIndex]]
      .find(cf => cf.id === id);
    field.values = CFValues;
  };

  const checkValidLocations = (processType) => {
    if(values.linkToProcess){
      return true;
    }
    if (['creation', 'movement', 'short'].includes(processType)) {
      if (!cartRows.length) {
        dispatch(showCustomAlert({
          type: 'warning',
          open: true,
          message: 'First, please add assets'
        }));
        return false;
      }

      const locationsSet = cartRows.every((row) => row.locationId);
      const firstLocationId = cartRows[0].locationId;
      const sameLocation = cartRows.every((row) => row.locationId === firstLocationId);

      if (!locationsSet || !sameLocation) {
        dispatch(showCustomAlert({
          type: 'warning',
          open: true,
          message: 'In Creation and Movement processes, all assets should have the same location selected'
        }));
        return false;
      }
      const {profileId: selectedLocationProfile} = allLocations.find(({id}) => firstLocationId === id);
      const selectedLocationIsAssetRepository = locationsAssetRepository.find(({_id}) => _id === selectedLocationProfile);
      
      if(!selectedLocationIsAssetRepository){
        dispatch(showCustomAlert({
          type: 'warning',
          open: true,
          message: 'In Creation and Movement processes, the location selected should be Asset Repository'
        }));
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

  const checkValidInitiator = async (_processData, _stageKeys) => {
    const {id: _id, name, lastName, email } = user;
    const initiator = { _id, name, lastName, email };
    if(!initiator){
      dispatch(showCustomAlert({
        type: 'warning',
        open: true,
        message: "Couldn't calculate the Process Initiator "
      }));
      return false;
    }
    _stageKeys.map(stageKey => {
      _processData.stages[stageKey].approvals[_processData.stages[stageKey].approvals.findIndex(e => e._id === 'initiator')] = {...initiator, fulfillDate: '', fulfilled: false, virtualUser: 'initiator'};
      _processData.stages[stageKey].notifications[_processData.stages[stageKey].notifications.findIndex(e => e._id === 'initiator')] = {...initiator, fulfillDate: '', fulfilled: false, virtualUser: 'initiator'};
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
    if(loading){
      return
    };
    setLoading(true);
    const body = {
      ...values,
      cartRows,
      requestUser: pick(user, ['email', 'id', 'lastName', 'name']),
      dueDate,
    };
    if (!id) {
      if (processes.find(({id}) => id === values.selectedProcess)?.processStages[0]?.isControlDueDate && !dueDate) {
        dispatch(showCustomAlert({
          type: 'error',
          open: true,
          message: 'To start this process please specify a Due Date.'
        }));
        return;
      }
      body.processData = transformProcess(processes, values.selectedProcess);
      const stageKeys = Object.keys(body.processData.stages);
      const allApprovals = stageKeys.map(e => (body.processData.stages[e].approvals)).flat().map(f => (f._id));
      if (allApprovals.includes('boss')) {
        if(! await checkValidDirectBoss(body.processData, stageKeys)){
          return;
        }
      }
      if (allApprovals.includes('initiator')) {
        if(! await checkValidInitiator(body.processData, stageKeys)){
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
      const biggestFolio =  await getDBComplex({collection: 'processLive', fields: [{key:'folio', value: 1}], sort:[{key:'folio', value: -1}], limit: 1 })
        .then(response => response.json())
        .then(data => {
          const {folio} = data.response[0];
          return Number(folio);
        })
      .catch(error => console.log(error));
      if(!biggestFolio){
        dispatch(showCustomAlert({
          type: 'error',
          open: true,
          message: 'There was an error calculating the Folio, please try again.'
        }));
        return;
      }
      const whiteFolio = [0, 0, 0, 0, 0, 0];
      const prefix = whiteFolio.slice(0, 6 - String(biggestFolio+1).length);
      const newFolio = prefix.join("").concat(String(biggestFolio+1));
      body.processData.processStatus = 'inProcess';
      body.folio = newFolio;
      postDB('processLive', body)
        .then(data => data.json())
        .then(async response => {
          const processLiveResponse = response.response[0];
          setProcessInfo(processLiveResponse);
          const { _id } = processLiveResponse;
          groomProcess(processLiveResponse);
          const { processData: { selectedProcessType } } = processLiveResponse;
          processLiveResponse.processLiveId = _id;
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
        dispatch(showCustomAlert({
          type: 'warning',
          open: true,
          message: 'You have to validate all assets'
        }));
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
                    reloadTable();
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

  const setAssetsStatus = (processLiveResponse, selectedProcessType) => {
    const { cartRows = [] } = processLiveResponse;
    const status = selectedProcessType === 'maintenance' ? 'maintenance' : 'inProcess';
    if(status === 'maintenance'){
      const { dateFormatted, timeFormatted } = getCurrentDateTime();
      cartRows.forEach(({ id, history = []}) => {
        updateDB('assets/', { status, history: [...history, {processId: processLiveResponse._id, processName: processLiveResponse.processData.name, processType: processLiveResponse.processData.selectedProcessType, label: 'Went down for Maintenance', date: `${dateFormatted} ${timeFormatted}`}]}, id)
          .catch(error => console.log(error));
      });
    }
    else {
      cartRows.forEach(({ id }) => {
        updateDB('assets/', { status }, id)
          .catch(error => console.log(error));
      });
    }
  };

  const checkApprovalComplete = () => {
    const totalAssets = processInfo.cartRows?.length || 0;
    const validatedAssets = cartRows.filter(({ status }) => status).length;

    return totalAssets === validatedAssets;
  };

  const applyApproval = () => {
    const { dateFormatted, timeFormatted } = getCurrentDateTime();
    const { processData, requestUser, _id: liveProcessId } = processInfo;
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
    currentStageData.cartRows = cartRows;
    const isLastApproval = !approvals.map(({ fulfilled }) => fulfilled).includes(false);
    if (isLastApproval) {
      sendMessages(currentStageData, requestUser, liveProcessId, processData.id, processInfo, 'end'); // Notifications
    } 

    return processData;
  };

  const groomProcess = (process) => {
    const { processData } = process;
    const { currentStage, totalStages } = processData;
    if (currentStage === 0) {
      const { selectedProcessType } = processData;
      return selectedProcessType === 'short' || processData.stages['stage_1'].isSelfApprove ? finishProcess(process) : initializeStage(process);
    }
    const currentStageData = getCurrentStageData(currentStage, processData);
    const isStageFulfilled = getIsStageFulfilled(currentStageData);
    if (!isStageFulfilled) {
      return;
    }
    const isLastStage = currentStage === totalStages;
    currentStageData.stageFulfilled = true;
    currentStageData.cartRows = cartRows;
    if (!isLastStage) {
      initializeStage(process);
    } else {
      finishProcess(process, (status) => processData.processStatus = status);
    }
    const currentStageDataUpdated = getCurrentStageData(process.processData.currentStage, process.processData)
    if(currentStageDataUpdated.isSelfApproveContinue || currentStageDataUpdated.approvals.length === 0){
      applyApproval();
      groomProcess(process);
    }
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

   const sendMessages = (stageData, requestUser, liveProcessId, processId, localProcessInfo, stageMoment) => {
    // Notifications are simple messages, Approvals are simple messages + ProcessApprovals DB posting
    const { dateFormatted, rawDate: formatDate, timeFormatted } = getCurrentDateTime();
    const { stageId, stageName, notifications: stageNotifications, approvals: stageApprovals } = stageData;
    const thisProcessData = processes.find(({ _id }) => _id === processId); 
    const { validMessages: { notifications, approvals } } = thisProcessData;
    const processNotifications = notifications[stageId] || [];
    const processApprovals = approvals[stageId] || [];
    
    const getVariableValues = {
      stageName: () => {
        return stageName || 'N/A';
      },
      creator: () => {
        const { name, lastName, email} = requestUser;
        return `${name} ${lastName} (${email})` || 'N/A';
      },
      creationDate: () => {
        return localProcessInfo.creationDate?.split('T')[0] || 'N/A';
      },
      approvals: () => {
        const approvalsFormated = stageApprovals.map(({ name, lastName, email}) => `${name} ${lastName} (${email})`);
        return approvalsFormated.length ? approvalsFormated.join(', ') : 'N/A';
      },
      notifications: () => {        
        const notificationsFormated = stageNotifications.map(({ name, lastName, email}) => `${name} ${lastName} (${email})`);
        return notificationsFormated.length ? notificationsFormated.join(', ') : 'N/A';
      }
    };

    const getCustomFieldValues = () => {
      let filteredCustomFields = {};
      Object.values(stageData.customFieldsTab || {}).forEach(tab => {
        const allCustomFields = [...tab.left, ...tab.right];
        allCustomFields.map(field => {
          filteredCustomFields = { ...filteredCustomFields, ...extractCustomFieldValues(field) };
        });
      });

      return filteredCustomFields;
    };

    const formatHTML = (html) => {
      const variables = getVariables(html);
      let offsetVar = 0;
      const allStageCustomFields = getCustomFieldValues();
  
      variables.forEach(({ varName, start, end }) => {
        let htmlArr = html.split('');
        let variableContent;

        if(getVariableValues[varName]){
          variableContent = getVariableValues[varName]();
        }
        else {
          variableContent = allStageCustomFields[varName] || 'N/A';
        }
      
        if (variableContent) {
          htmlArr.splice(start - offsetVar, (end - start) + 1, variableContent);
          offsetVar += varName.length - variableContent.length + 3;
        }
        html = htmlArr.join('');
      });

      return html;
    };

    const filteredProcessMessages = (message) => {
      let filteredMessages = []
      Object.entries(message).map(([userId, val]) => {
        val.reduce((acu, cur) => {
          const { checked, id: layoutId, name: layoutName, sendMessageAt } = cur;
          const notificationObj = { layoutId, layoutName, sendMessageAt };
          if (checked) {
            filteredMessages.push({...notificationObj, userId})
          }
        }, []);
      });
      return filteredMessages;
    }
    
    const sendStageMessages = (messages, type) => {
      const isNotification = type === 'notification';
      const messagesType = isNotification ? stageNotifications : stageApprovals;

      messagesType.forEach(async(message) => {        
        const foundMessages = []
        if (message.virtualUser){
          foundMessages.push(...messages.filter(({ userId }) => userId === message.virtualUser));
        }
        else {
          foundMessages.push(...messages.filter(({ userId }) => userId === message._id))
        }
        const timeStamp = `${dateFormatted} ${timeFormatted}`;
        let targetUserInfo = {
          email: message.email,
          id: message._id,
          lastName: message.lastName,
          name: message.name
        };
        foundMessages.map((foundMessage) => {
          const layoutId = foundMessage ? foundMessage.layoutId : null;
          const fromObj = pick(requestUser, ['email', 'name', 'lastName']);
          const from = [{ _id: requestUser.id, ...fromObj }];
          const thisLayoutInfo = processLayouts.find(({ id }) => id === layoutId) || null;
          const html = thisLayoutInfo ? thisLayoutInfo.layout || '' : null;
          const sendMessageAt =  thisLayoutInfo ? thisLayoutInfo.sendMessageAt || '' : null;
          const newHtml = formatHTML(html); 
          const subject = isNotification ?
            `New notification from Stage: ${stageName}` : 
              stageMoment === 'start' ? 
              `New approval request from Stage: ${stageName}`:
              `The following Stage has been finished: ${stageName}`;
            
    
          const messageObj = {
            html: newHtml,
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
          if (html && sendMessageAt === stageMoment) {
            simplePost(collections.messages, messageObj);
          }
        })

        if (isNotification) {
          message.sent = true;
          message.sentDate = timeStamp;
        } else {
          if(stageMoment === 'start'){
            const approvalObj = {
              email: targetUserInfo.email,
              fulfilled: false,
              fulfilledData: '',
              processId: liveProcessId,
              userId: targetUserInfo.id,
              stageId,
            };
            simplePost(collections.processApprovals, approvalObj);
          }
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

  const inheritCustomFields = (processData, assetCustomFields) => {
    const allCustomFieldsFromStages = [];
    const RightAndLeft = ['right', 'left'];
    Object.keys(processData.stages).map((stageName) => {
      Object.keys(processData.stages[stageName].customFieldsTab).map((tabName) => {
        RightAndLeft.map((side) => {
          if(processData.stages[stageName].customFieldsTab[tabName][side].length)
          processData.stages[stageName].customFieldsTab[tabName][side].map((customField) => allCustomFieldsFromStages.push(customField))
        })
      })
    });
    Object.keys(assetCustomFields).map((tabName) => {
      RightAndLeft.map((side) => {
        assetCustomFields[tabName][side].map((field, ix) => {
            allCustomFieldsFromStages.map((stageField) => {
              if(field.content === stageField.content && field.values.fieldName === stageField.values.fieldName){
                assetCustomFields[tabName][side][ix].values.initialValue = stageField.values.initialValue;
              }
            })
        });
      })
    });
    return assetCustomFields;
  }

  const finishProcess = (process, updateProcessStatus) => {
    const { processData } = process;
    const { selectedProcessType } = processData;
    const selfApprove = processData.stages['stage_1'].isSelfApprove || selectedProcessType === 'short';
    var validAssets = [];
    var validAssetsID = [];
    var invalidAssets = [];
    if(!selfApprove){
      validAssets = extractValidAssets(cartRows, processData);
      validAssetsID = validAssets.map(({id}) => (id)); 
      invalidAssets = cartRows.filter(({id}) => !validAssetsID.includes(id)) || [];
      if(invalidAssets.length <= 0 && validAssets.length > 0){
        updateProcessStatus('approved');
      }
      else if(invalidAssets.length > 0 && validAssets.length <= 0){
        updateProcessStatus('rejected');
      }
      else if(invalidAssets.length > 0 && validAssets.length > 0){
        updateProcessStatus('partiallyApproved');
      }
    }
    
    const assetsToProcess = selfApprove ? cartRows : validAssets;
    const { dateFormatted, timeFormatted } = getCurrentDateTime();

    const finishActions = {
      creation: async () => {
        Promise.all(assetsToProcess.map( async ({ name, brand, model, locationId: location, id: referenceId, history = [], customFieldsTab, serial, notes, quantity, purchase_date, purchase_price, price}) => {
          const locationPath = await getLocationPath(location);
          const customFieldsTabInherited = inheritCustomFields(processData, customFieldsTab);
          const assetObj = {
            name,
            brand,
            model,
            location,
            referenceId,
            status: 'active',
            history: [...history, {processId: process._id, processName: processData.name, processType: processData.selectedProcessType, label: `Asset Created at: ${locationPath}`, date: `${dateFormatted} ${timeFormatted}`}],
            customFieldsTab: customFieldsTabInherited,
            serial, 
            notes, 
            quantity, 
            purchase_date, 
            purchase_price, 
            price            
          };
          return postDB('assets', assetObj);
        }))
        .then(responses => Promise.all(responses.map(response => response.json())))
        .then(data => {
          const assetsCreated = data.map(({response}) => response[0]);
          updateDB('processLive/', { cartRows: assetsCreated}, process._id)
            .then(response => response.json())
            .then(data => {})
            .catch(error => console.log('errorUpdating:', error));
        })
        dispatch(showCustomAlert({
          type: 'info',
          open: true,
          message: `${assetsToProcess.length} Assets Created!`
        }));
      },
      decommission: () => {
        if(invalidAssets.length){
          invalidAssets.forEach(({ id }) => {
            updateDB('assets/', { status: 'active'} , id)
              .then(() => {})
              .catch(error => console.log(error));
          });
        }
        assetsToProcess.forEach(({ id, history = [] }) => {
          updateDB('assets/', { status: 'decommissioned', history: [...history, {processId: process._id, processName: processData.name, processType: processData.selectedProcessType, label: 'Decommissioned', date: `${dateFormatted} ${timeFormatted}`}]} , id)
            .then(() => {})
            .catch(error => console.log(error));
        });
        dispatch(showCustomAlert({
          type: 'info',
          open: true,
          message: `${assetsToProcess.length} Assets Decommissioned!`
        }));
      },
      movement: async () => {
        if(invalidAssets.length){
          invalidAssets.forEach(({ id }) => {
            updateDB('assets/', { status: 'active'} , id)
              .then(() => {})
              .catch(error => console.log(error));
          });
        }
        assetsToProcess.forEach( async ({ id, locationId: location, originalLocation, history = [] }) => {
          const locationPath = await getLocationPath(location);
          updateDB('assets/', { location, status: 'active', history: [...history, {processId: process._id, processName: processData.name, processType: processData.selectedProcessType, label: `Moved from: ${originalLocation} to: ${locationPath}`, date: `${dateFormatted} ${timeFormatted}`}] } , id)
            .then(() => {})
            .catch(error => console.log(error));
        });
        dispatch(showCustomAlert({
          type: 'info',
          open: true,
          message: `${assetsToProcess.length} Assets Transferred!`
        }));
      },
      short: async () => {
        assetsToProcess.forEach( async ({ id, locationId: location, originalLocation, history = [] }) => {
          const locationPath = await getLocationPath(location);
          updateDB('assets/', { location, status: 'active', history: [...history, {processId: process._id, processName: processData.name, processType: processData.selectedProcessType, label: `Moved from: ${originalLocation} to: ${locationPath}`, date: `${dateFormatted} ${timeFormatted}`}] } , id)
            .then(() => {})
            .catch(error => console.log(error));
        });
        dispatch(showCustomAlert({
          type: 'info',
          open: true,
          message: `${assetsToProcess.length} Assets Short Transferred!`
        }));
      },
      maintenance: () => {
        if(invalidAssets.length){
          invalidAssets.forEach(({ id, history }) => {
            updateDB('assets/', { status: 'active', history: [...history, {processId: process._id, processName: processData.name, processType: processData.selectedProcessType, label: 'Maintenance was cancelled', date: `${dateFormatted} ${timeFormatted}`}]} , id)
              .then(() => {})
              .catch(error => console.log(error));
          });
        }
        assetsToProcess.forEach(({ id, history }) => {
          updateDB('assets/', { status: 'active', history: [...history, {processId: process._id, processName: processData.name, processType: processData.selectedProcessType, label: 'Finshed Maintenance', date: `${dateFormatted} ${timeFormatted}`}]} , id)
            .then(() => {})
            .catch(error => console.log(error));
        });
        dispatch(showCustomAlert({
          type: 'info',
          open: true,
          message: `${assetsToProcess.length} Assets Finished Maintenance!`
        }));
      },
      creationLinked: () => {
        if(invalidAssets.length){
          invalidAssets.forEach(({ id }) => {
            updateDB('assets/', { status: 'active'} , id)
              .then(() => {})
              .catch(error => console.log(error));
          });
        }
        Promise.all(assetsToProcess.map((asset) => {
          const assetData = omit(asset, '_id');
          const customFieldsTabInherited = inheritCustomFields(processData, asset.customFieldsTab);
          return updateDB('assets/', {...assetData, customFieldsTab: customFieldsTabInherited, status: 'active', history: [...assetData.history, {processId: process._id, processName: processData.name, processType: processData.selectedProcessType, label: 'Values Were Updated', date: `${dateFormatted} ${timeFormatted}`}]} , asset._id)
        }))
        .then(responses => Promise.all(responses.map(response => response.json())))
        .then(data => {
          const assetsUpdated = assetsToProcess.map((asset) => {
            const customFieldsTabInherited = inheritCustomFields(processData, asset.customFieldsTab);
            return {...asset, customFieldsTab: customFieldsTabInherited, status: 'active', history: [...asset.history, {processId: process._id, processName: processData.name, processType: processData.selectedProcessType, label: 'Values Were Updated', date: `${dateFormatted} ${timeFormatted}`}]};
          })
          updateDB('processLive/', { cartRows: assetsUpdated}, process._id)
            .then(response => response.json())
            .then(data => {})
            .catch(error => console.log('errorUpdating:', error));
        });
        dispatch(showCustomAlert({
          type: 'info',
          open: true,
          message: `${assetsToProcess.length} Assets Modified!`
        }));
      },
      default: () => {}
    };

    finishActions[process.linkToProcess ? ('creationLinked') : (selectedProcessType || 'default')]();
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

    const handleChangeAssetValues = (newCartRows) => {
      setCartRows(newCartRows);
  };

  const stageGoBack = (currentStage) => {
    const { goBackTo } = currentStage;
    var temporalProcessData = {...processInfo.processData};
    var temporalStages = {...processInfo.processData.stages};
    const stagesToReset = [];

    Object.keys(temporalStages).map((stageKey, ix) => {
      if(processInfo.processData.currentStage - 1 >= ix){
        stagesToReset.push(temporalStages[stageKey].stageId);
        if(temporalStages[stageKey].stageId === goBackTo){
          temporalProcessData.currentStage = ix + 1;
        };
        if(Object.keys(temporalStages[stageKey].customFieldsTab).length){
          const thisStageCustomFields = allStages.find(({id}) => id === temporalStages[stageKey].stageId);
          temporalStages[stageKey].customFieldsTab = thisStageCustomFields.customFieldsTab;
        };
        temporalStages[stageKey].stageFulfilled = false;
        temporalStages[stageKey].stageInitialized = temporalStages[stageKey].stageId === goBackTo ? true : false;
        temporalStages[stageKey].approvals.map((object) => {
          object.fulfillDate = "";
          object.fulfilled = false
          delete object.cartRows
        })
      };
    });
     
    const condition = [{'processId': processInfo._id }, { "stageId": { "$in": stagesToReset }}];
    getDBComplex({ collection: 'processApprovals/', condition })
      .then(response => response.json())
      .then(data => {
        const approvalsModified = data.response.map(({_id, stageId}) => {
          if(stageId === goBackTo){
            return updateDB('processApprovals/', { fulfilled: false }, _id)
            .then(() => {})
            .catch(error => console.log(error));
          }
          else {
            return deleteDB('processApprovals/', _id)
              .then((response) => console.log('Deleted', response))
              .catch((error) => console.log("Error", error));
          }
        })
        
        Promise.all(approvalsModified).then(() => {
          reloadTable();
        })
      })
      .catch(error => console.log('error>', error));

    temporalProcessData.stages = temporalStages;

    updateDB('processLive/', { processData: temporalProcessData }, id[0])
      .then(data => data.json())
      .then(response => handleCloseModal())
      .catch(error => showErrorAlert());
  };

  const initializeStage = (process) => {
    const { processData, requestUser, _id: liveProcessId } = process;
    const selfApprove = processData.stages['stage_1'].isSelfApprove;
    const nextStage = processData.currentStage + 1;
    processData.currentStage = selfApprove ? processData.totalStages : nextStage;
    const stageData = getCurrentStageData(nextStage, processData);
    sendMessages(stageData, requestUser, liveProcessId, processData.id, process, 'start'); // Approvals
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
    setStageTabSelected(0);
    setAssetFinderTab(0);
    setCartRows([]);
    setProcessInfo({});
    setCustomFieldsTab({});
    // setProfilePermissions([]);
    setValues({ 
      selectedProcess: ''
    });
    setTypes([]);
    setShowModal(false);
    setValue4(0);
    setIsAssetReference(null);
    setCustomTabs([]);
    // setIsAssetRepository(false);
  };

  const [processes, setProcesses] = useState([]);
  const [processInfo, setProcessInfo] = useState({});
  const [processLayouts, setProcessLayouts] = useState([]);
  const [customFieldsTab, setCustomFieldsTab] = useState([]);
  const [customTabs, setCustomTabs] = useState([]);
  const [userLocations, setUserLocations] = useState([]);
  const [allFolios, setAllFolios] = useState([]);

  const [tableControl, setTableControl] = useState({
    assets: {
      collection: 'assets',
      total: 0,
      page: 0,
      rowsPerPage: 5,
      orderBy: 'name',
      order: 1,
      search: '',
      searchBy: '',
      locationsFilter: [],
    },
  });

  const [control, setControl] = useState({
    idAsset: null,
    openAssetsModal: false,
    openTreeView: false,
    treeViewFiltering: [],
    assetRows: [],
    assetRowsSelected: [],
  });

  const locationsRecursive = (data, currentLocation, res) => {
    const children = data.response.filter((e) => e.parent === currentLocation._id);

    if (!children.length) {
      return;
    }

    children.forEach((e) => {
      if (!res.includes(e._id)) {
        res.push(e._id);
      }
    });
    children.forEach((e) => locationsRecursive(data, e, res));
  };

  const loadUserLocations = () => {
    getOneDB('user/', user?.id)
      .then((response) => response.json())
      .then((data) => {
        const locationsTable = data.response.locationsTable;
        getDB('locationsReal')
          .then((response) => response.json())
          .then((data) => {
            let res = [];
            locationsTable.forEach((location) => {
              const currentLoc = data.response.find((e) => e._id === location.parent);

              if (!userLocations.includes(currentLoc._id)) {
                res.push(currentLoc._id);
              }

              const children = data.response.filter((e) => e.parent === currentLoc._id);

              if (children.length) {
                children.forEach((e) => res.push(e._id));
                children.forEach((e) => locationsRecursive(data, e, res));
              }
            });
            const resFiltered = uniq(res);
              setUserLocations(resFiltered);
          })
          .catch((error) => dispatch(showErrorAlert()));
      })
      .catch((error) => dispatch(showErrorAlert()));
  };

  const createAssetListRow = (id, name, brand, model, category, EPC, serial, originalLocation, history, fileExt) => {
    return { id, name, brand, model, category, EPC, serial, originalLocation, history, fileExt};
  };

  const assetListHeadRows = [
    { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
    { id: 'brand', numeric: true, disablePadding: false, label: 'Brand' },
    { id: 'model', numeric: true, disablePadding: false, label: 'Model' },
    { id: 'assigned', numeric: false, disablePadding: false, label: 'Assigned'},
    { id: 'EPC', numeric: true, disablePadding: false, label: 'EPC' },
    { id: 'serial', numeric: true, disablePadding: false, label: 'Serial Number' },
    { id: 'originalLocation', numeric: true, disablePadding: false, label: 'Original Location' },
  ];

  const loadAssetsData = (collectionNames = ['assets']) => {
    
    collectionNames = !Array.isArray(collectionNames) ? [collectionNames] : collectionNames;
    collectionNames.forEach(collectionName => {
      let queryLike = '';
      if (collectionName === 'assets') {
        if (tableControl.assets.locationsFilter.length) {
          queryLike = tableControl.assets.locationsFilter.map(locationID => ({ key: 'location', value: locationID }))
        }
        else {
          queryLike = tableControl.assets.searchBy ? (
            [{ key: tableControl.assets.searchBy, value: tableControl.assets.search }]
          ) : (
            ['name', 'brand', 'model'].map(key => ({ key, value: tableControl.assets.search }))
          )
        }
      }

      getCountDB({
        collection: collectionName,
        queryLike: tableControl[collectionName].search || tableControl['assets'].locationsFilter.length ? queryLike : null,
        condition: collectionName === 'assets' ? [{ "location": { "$in": userLocations }}] : null
      })
        .then(response => response.json())
        .then(data => {
          setTableControl(prev => ({
            ...prev,
            [collectionName]: {
              ...prev[collectionName],
              total: data.response.count
            }
          }));
        });
      
      getDBComplex({
        collection: collectionName,
        limit: tableControl[collectionName].rowsPerPage,
        skip: tableControl[collectionName].rowsPerPage * tableControl[collectionName].page,
        sort: [{ key: tableControl[collectionName].orderBy, value: tableControl[collectionName].order }],
        queryLike: tableControl[collectionName].search || tableControl['assets'].locationsFilter.length ? queryLike : null,
        condition: collectionName === 'assets' ? [{ "location": { "$in": userLocations }}, {"status" : "active"}] : null
      })
        .then(response => response.json())
        .then(async data => {
          if (collectionName === 'assets') {
            const rows = await Promise.all(data.response.map( async row => {
              const locationPath = await getLocationPath(row.location);
              return createAssetListRow(row._id, row.name, row.brand, row.model, row.assigned, row.EPC, row.serial, locationPath, row.history, row.fileExt);
            }));
            setControl(prev => ({ ...prev, assetRows: rows, assetRowsSelected: [] }));
          }
        })
        .catch(error => dispatch(showErrorAlert()));
    });
  };

  useEffect(() => {
    loadUserLocations();
  }, []);

  useEffect(() => {
    if(values.linkToProcess){
      setIsAssetReference(false);
      getOneDB('processLive/', values.linkToProcess)
      .then(response => response.json())
      .then(data => {
        //Set CustomFields
        const stagesKeys = Object.keys(data.response.processData.stages).filter(e => Number(e.split('_')[1]) <= data.response.processData.currentStage);
        var customtabs = [];
        var allCustomFields = [];
        stagesKeys.map((e, ix) => {
          const { stageName, customFieldsTab } = data.response.processData.stages[e];
          const tabs = Object.keys(data.response.processData.stages[e].customFieldsTab).map(key => ({ key, info: customFieldsTab[key].info, content: [customFieldsTab[key].left, customFieldsTab[key].right] }));
          tabs.sort((a, b) => a.key.split('-').pop() - b.key.split('-').pop());
          
          allCustomFields.push(customFieldsTab);
          customtabs.push({stage: stageName, tabs, index: ix});
        });
        setCustomTabs(customtabs);
        setCustomFieldsTab(allCustomFields);
        //Set CartRows
        Promise.all(data.response.cartRows.map( async (asset) => {
          const locationPath = await getLocationPath(asset.location);
          return ({...asset, originalLocation: locationPath, locationName: locationPath, id: asset._id});
        })).then(data => {
          setCartRows(data);
        })
      })
      .catch(error => console.log(error));
    }
  }, [values.linkToProcess]);
  
  useEffect(() => {
    loadAssetsData('assets');
  }, [userLocations]);

  useEffect(() => {
    loadAssetsData('assets');
  }, [tableControl.assets.page, tableControl.assets.rowsPerPage, tableControl.assets.order, tableControl.assets.orderBy, tableControl.assets.search, tableControl.assets.locationsFilter]);

  useEffect(() => {
    getFolios();
  }, [selectedProcessType])

  useEffect(() => {
    getDB('processes')
      .then(response => response.json())
      .then(data => {
        const processes = data.response.map(
          (process) => ({ ...pick(process, ['name', 'processStages', 'validMessages', 'selectedProcessType', '_id']), id: process._id })
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
        const obj = pick(data.response, ['name', 'functions', 'select edFunction', 'selectedType', 'isAssetEdition', 'isUserFilter', 'isCustomLockedStage', 'isSelfApprove', 'isSelfApproveContinue', 'isControlDueDate']);
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
        const stagesKeys = Object.keys(data.response.processData.stages).filter(e => Number(e.split('_')[1]) <= data.response.processData.currentStage);
        var customtabs = [];
        var allCustomFields = [];
        stagesKeys.map((e, ix) => {
          const { stageName, customFieldsTab } = data.response.processData.stages[e];
          const tabs = Object.keys(data.response.processData.stages[e].customFieldsTab).map(key => ({ key, info: customFieldsTab[key].info, content: [customFieldsTab[key].left, customFieldsTab[key].right] }));
          tabs.sort((a, b) => a.key.split('-').pop() - b.key.split('-').pop());
          
          allCustomFields.push(customFieldsTab);
          customtabs.push({stage: stageName, tabs, index: ix});
        });
        const currentStageIndex = data.response.processData.currentStage;
        if(currentStageIndex -1 <= 0){
          if(data.response.linkToProcess){
            const cartRowsProcessed = data.response.cartRows.map((element) => ({...element, id: element._id}))
            setCartRows(cartRowsProcessed)
          }
          else(
            setCartRows(data.response.cartRows)
          )
        }
        else if(currentStageIndex - 1 > 0){
          setCartRows(getCurrentStageData(currentStageIndex -1 , data.response.processData).cartRows);
        }
        setCustomTabs(customtabs);
        setCustomFieldsTab(allCustomFields);
      })
      .catch(error => console.log(error));
  }, [id]);

  useEffect(() => {
    const queryLike = [{ key: 'isAssetRepository', value: true }];
    const fields = [{ key: '_id', value: 1 }];
      
    getDBComplex({collection: 'locations', queryLike, fields})
      .then(response => response.json())
      .then(data => {
        setLocationsAssetRepository(data.response);
      })
    .catch(error => console.log(error));
    
    getDB('locationsReal/')
      .then(response => response.json())
      .then(data => {
        const filtered = data.response.map(({_id : id, name, parent, profileId}) => ({ id, name, parent, profileId}));
        setAllLocations(filtered);
      })
    .catch(error => console.log(error));

    getDB('processStages')
      .then(response => response.json())
      .then(data => {
        const filtered = data.response.map(({_id : id, customFieldsTab}) => ({ id, customFieldsTab}));
        setAllStages(filtered);
      })
    .catch(error => console.log(error));

  }, []);

  const [image, setImage] = useState(null);
  // const [notifications, setNotifications] = useState([]);
  // const [approvals, setApprovals] = useState([]);
  const [assetsSelected, setAssetsSelected] = useState([]);
  const [cartRows, setCartRows] = useState([]);
  const [isAssetReference, setIsAssetReference] = useState(null);
  const [selectedProcessType, setSelectedProcessType] = useState('');
  // const onChangeNotificationsApprovals = name => (event, values) => {
  //   if (name === 'notifications') {
  //     setNotifications(values);
  //   } else if (name === 'approvals')
  //     setApprovals(values);
  // }
  const onSelectionChange = (selection) => {
    if(!selection){
      return;
    }
    setAssetsSelected(selection.rows || []);
  };
  const onAddAssetToCart = () => {
    // const convertAssets = assetsSelected.map(({ name, brand, model }, ix) => createAssetReferenceCartRow('id' + ix, name, brand, model));
    // setCartRows([ ...cartRows, ...convertAssets ]);
    dispatch(showCustomAlert({
      type: 'info',
      open: true,
      message: `${assetsSelected.length || 'No'} Asset${assetsSelected.length === 1 ? '' : 's'} added`
    }));
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
      return tabs(generateTabs( customTabs.length > 0 ? ['Live Process', 'Custom Fields'] : ['Live Process']));
    }
  };

  const getFolios = () => {
    getDBComplex({
      collection: 'processLive',
      fields: [{key:'processData.name', value: 1}, {key:'_id', value: 1}, {key:'folio', value: 1}],
      sort:[{key:'folio', value: 1}],
      condition:[{ "processData.selectedProcessType": "creation"}]
    })
      .then(response => response.json())
      .then(data => {
        const filteredData = data.response.map(({processData, folio, _id: id}) => ({name: processData.name, folio, id}))
        setAllFolios(filteredData);
      })
    .catch(error => console.log(error));
  };

  const renderTabsContent = () => {
    const handleSelectProcessChange = (event) => {
      setValues((prev) => ({ ...prev, selectedProcess: event.target.value }));
      const { selectedProcessType } = processes.find(({ id }) => id === event.target.value);
      setSelectedProcessType(selectedProcessType);
      setIsAssetReference(selectedProcessType === 'creation' ? true : false);
    };
    const handleSelectProcessToLink = (event) => {
      setValues((prev) => ({ ...prev, linkToProcess: event.target.value }));
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
                <div style={{display: 'flex', alignItems: 'flex-end'}}>
                  <FormControl className={classes.textField} disabled={values.selectedProcess ? true : false }>
                    <div style={{width: '100%', marginRight: '5%'}}>
                      <InputLabel htmlFor="age-simple">Select Process</InputLabel>
                      <Select
                        onChange={handleSelectProcessChange}
                        value={values.selectedProcess}
                        className={classes.menu}
                      >
                        {(processes || []).map(({ id, name, selectedProcessType }, ix) => (
                          <MenuItem key={`opt-name-${ix}`} value={id}>
                                <Typography>
                                  {`${name} `}
                                </Typography>
                                <GreyTypography>
                                  {`. Type: ${selectedProcessType}`}
                                </GreyTypography>
                          </MenuItem>
                        ))}
                      </Select>
                    </div>
                  </FormControl>
                  {
                      values.selectedProcess && processes.find(({id}) => id === values.selectedProcess)?.processStages[0]?.isControlDueDate && (
                          <TextField
                            label={'Due Date'}
                            style={{
                              width: '200px',
                              marginRight: '40px'
                            }}
                            type="date"
                            inputProps={{
                              min: new Date().toISOString().split('T')[0]
                            }}
                            value={dueDate}
                            onChange={(event) => setDueDate(event.target.value)}
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                      )
                    }
                  {
                    values.selectedProcess && processes.find(({id}) => id === values.selectedProcess)?.selectedProcessType === 'creation' && (
                      <div style={{width: '200px', marginRight: '5%'}}>
                        <InputLabel htmlFor="age-simple">Link to Process</InputLabel>
                        <Select
                          onChange={handleSelectProcessToLink}
                          value={values.linkToProcess}
                          className={classes.menu}
                        >
                          {allFolios.map(({ id, name, folio }, ix) => (
                            <MenuItem key={`opt-name-${ix}`} value={id}>
                              <Typography>
                                {`Folio: ${folio}`}
                              </Typography>
                              <GreyTypography>
                                {`. - ${name}`}
                              </GreyTypography>
                            </MenuItem>
                          ))}
                        </Select>
                      </div>
                    )
                  }
                </div>
                <button type="button" onClick={onAddAssetToCart} disabled={values.linkToProcess} className='btn btn-primary btn-elevate kt-login__btn-primary'>
                  <i className="la la-plus" /> Add Assets
                </button>
              </div>
              {
                values.linkToProcess && 
                <div style={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '60px'}}>
                  <Typography variant='h5'>
                    When a process is linked to another, you can't add more assets
                  </Typography>
                </div>
              }
              {isAssetReference !== null && !values.linkToProcess &&
                <div style={{width: '100%'}}>
                  <Paper className={classes4.subTab} style={{width: '100%'}}>
                    <Tabs
                    value={assetFinderTab}
                    onChange={handleChangeAssetFinder}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                  >
                    <Tab label={'Find by Name'} />
                    {
                      !isAssetReference && <Tab label={'Find by Location'} />
                    }
                  </Tabs>
                  </Paper>
                  <SwipeableViews
                  axis={theme4.direction === "rtl" ? "x-reverse" : "x"}
                  index={assetFinderTab}
                  onChangeIndex={handleChangeAssetFinder}
                  >
                    <Typography component="div" dir={theme4.direction} style={{ padding: 8 * 3 }}>
                      <AssetFinderPreview isAssetReference={isAssetReference} onSelectionChange={onSelectionChange}/>
                    </Typography>
                    <Typography component="div" dir={theme4.direction} style={{ padding: 8 * 3 }}>
                      <TableComponent2
                        controlValues={tableControl.assets}
                        disableActions
                        justTreeView
                        userLocations={userLocations}
                        headRows={assetListHeadRows}
                        locationControl={(locations) => {
                          setTableControl(prev => ({
                            ...prev,
                            assets: {
                              ...prev.assets,
                              locationsFilter: locations
                            }
                          }))
                        }}
                        onAdd={() => {}}
                        onDelete={() => {}}
                        onEdit={() => {}}
                        onSelect={(object) => onSelectionChange({rows: object})}
                        paginationControl={({ rowsPerPage, page }) =>
                          setTableControl(prev => ({
                            ...prev,
                            assets: {
                              ...prev.assets,
                              rowsPerPage: rowsPerPage,
                              page: page,
                            }
                          }))
                        }
                        rows={control.assetRows}
                        returnObjectOnSelect
                        selectedObjects = {assetsSelected.rows || []}
                        searchControl={({ value, field }) => {
                          setTableControl(prev => ({
                            ...prev,
                            assets: {
                              ...prev.assets,
                              search: value,
                              searchBy: field,
                            }
                          }))
                        }}
                        sortByControl={({ orderBy, order }) => {
                          setTableControl(prev => ({
                            ...prev,
                            assets: {
                              ...prev.assets,
                              orderBy: orderBy,
                              order: order,
                            }
                          }))
                        }}
                        title={'Assets Filter By Location'}
                        treeView
                      />
                    </Typography>
                  </SwipeableViews>
                </div>
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
                processType={selectedProcessType}
                updateAssetValues={(newCartRows) => handleChangeAssetValues(newCartRows)}
                isLinkedToProcess={!!values.linkToProcess}
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
              goBackLogic = {stageGoBack}
              onSelectionChange={onSelectionChange}
              onSetRows={setCartRows}
              processInfo={processInfo}
              processType={processInfo.processData ? processInfo.processData.selectedProcessType : selectedProcessType}
              rows={cartRows}
              user={user}
              setProcessCartInfo={handleChangeAssetValues}
            />
          </TabContainer4>
          <TabContainerCustom dir={theme4.direction}>
            <Paper className={classes4.root}>
                <Tabs
                  value={stageTabSelected}
                  onChange={handleChangeStageTab}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="fullWidth"
                >
                  {
                    customTabs?.map(({stage, tabs}) => <Tab label={stage} />)
                  }
                </Tabs>
              </Paper>
              <TabContainerCustom dir={theme4.direction}>
                {customTabs[stageTabSelected]?.tabs.length > 0 && (
                  <Paper className={classes4.root}>
                    <Tabs
                      value={customTabSelected}
                      onChange={handleChangeCustomFieldTab}
                      indicatorColor="primary"
                      textColor="primary"
                      variant="fullWidth"
                    >
                      {customTabs[stageTabSelected]?.tabs.map((tab, index) => (
                        <Tab key={`tab-reference-${index}`} label={tab.info.name} />
                      ))}
                    </Tabs>
                  </Paper>
                )}
                <SwipeableViews
                  axis={theme4.direction === "rtl" ? "x-reverse" : "x"}
                  index={customTabSelected}
                  onChangeIndex={handleChangeCustomFieldTab}
                >
                  {customTabs[stageTabSelected]?.tabs.map(tab => (
                    <TabContainer4 dir={theme4.direction}>
                      <div className="modal-asset-reference">
                        {Array(tab.content[1].length === 0 ? 1 : 2).fill(0).map((col, colIndex) => (
                          <div className="modal-asset-reference__list-field" >
                            {tab.content[colIndex].map(customField => (
                              <CustomFieldsPreview
                                id={customField.id}
                                type={customField.content}
                                values={customField.values}
                                onDelete={() => { }}
                                onSelect={() => { }}
                                columnIndex={colIndex}
                                from="form"
                                tab={tab}
                                onUpdateCustomField={handleUpdateCustomFields}
                                // customFieldIndex={props.customFieldIndex}
                                onClick={() => alert(customField.content)}
                                data={tab.content[colIndex]}
                                disabled={customTabs[stageTabSelected].index < processInfo.processData.currentStage - 1 || processInfo.processData.processStatus !== 'inProcess'}
                              />
                            ))}
                          </div>
                        ))}
                      </div>
                    </TabContainer4>
                  ))}
                </SwipeableViews>
              </TabContainerCustom>
          </TabContainerCustom>
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
          <Button onClick={() => handleSave().then(() => setLoading(false)).catch(() => setLoading(false))} color="primary">
            Save changes
          </Button>
        </DialogActions5>
      </Dialog>    
    </div>
  )
};

const mapStateToProps = ({ auth: { user } }) => ({ user });

export default connect(mapStateToProps)(ModalProcessLive);
