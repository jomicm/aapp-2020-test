/* eslint-disable no-restricted-imports */
import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Checkbox,
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
  FormControlLabel,
  FormLabel,
  FormGroup,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  ListSubheader,
  InputAdornment,
  Select,
  Switch,
  MenuItem,
  InputLabel
} from "@material-ui/core";
// import Select from 'react-select';
import {
  withStyles,
  useTheme,
  makeStyles
} from "@material-ui/core/styles";
import { pick, omit, isEmpty } from "lodash";
import SwipeableViews from "react-swipeable-views";

import CloseIcon from "@material-ui/icons/Close";
import CustomFields from '../../Components/CustomFields/CustomFields';
import Widgets from '@material-ui/icons/Widgets';
import AccountTree from '@material-ui/icons/AccountTree';
import SearchIcon from '@material-ui/icons/Search';

import TableComponent from '../../Components/TableComponent';
// import './ModalAssetCategories.scss';
import ImageUpload from '../../Components/ImageUpload';
import { postDBEncryptPassword, getDB, getOneDB, updateDB, postDB } from '../../../../crud/api';
import ModalYesNo from '../../Components/ModalYesNo';
import { CustomFieldsPreview } from '../../constants';
import Permission from '../components/Permission';


import LocationAssignment from '../components/LocationAssignment';

import styled from "@emotion/styled";
import ProcessFlow from '../components/ProcessFlow';
//
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const messagesHeadRows = [
  { id: "name", numeric: false, disablePadding: false, label: "Name" },
  { id: "type", numeric: false, disablePadding: false, label: "Type" },
  { id: "creator", numeric: false, disablePadding: false, label: "Creator" },
  { id: "creation_date", numeric: false, disablePadding: false, label: "Creation Date" }
];


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

const ModalProcesses = ({ showModal, setShowModal, reloadTable, id, employeeProfileRows }) => {
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
  const mockMessages = {
    notifications: [{name: 'un msg'}, {name: 'dos msg'}, {name: 'tres mng'}],
    approvals: [{name: 'un notif'}, {name: 'dos notif'}, {name: 'tres notif'}],
  };
  const processTypes = [
    { id: 'creation', label: 'Creation' },
    { id: 'movement', label: 'Movement'},
    { id: 'short', label: 'Short Movement' },
    { id: 'decommission', label: 'Decommission' },
    { id: 'maintenance', label: 'Maintenance'}
  ];
  const classes = useStyles();
  const [values, setValues] = useState({
    name: "",
    //
    goBackEnabled: false,
    layoutMessageName: '',
    selectedUserNotification: '',
    selectedUserApprovals: '',
    notificationsForUsers: {},
    selectedProcessType: ''
  });

  const [validMessages, setValidMessages] = useState({
    // notifications: { none: { none: [] } },
    // approvals: { none: { none: [] } },
    notifications: {},
    approvals: {},
    selectedUserNotifications: 'none',
    selectedUserApprovals: 'none',
    selectedStage: ''
  });


  const [profileSelected, setProfileSelected] = useState(0);
  const [layoutSelected, setLayoutSelected] = useState(0);

  const [originalStages, setOriginalStages] = useState([]);
  const [stages, setStages] = useState([]);
  const [searchStage, setSearchStage] = useState('');
  const [processStages, setProcessStages] = useState([]);
  
  const handleSearchStage = event => {
    const searchStageVal = event.target.value;
    setSearchStage(searchStageVal);
    const stagesOrig = getStagesNotUsed();
    if (!searchStageVal) {
      setStages(stagesOrig);
      return;
    }
    const filteredStages = stagesOrig.filter(st => st.name.toLowerCase().includes(searchStageVal.toLowerCase()));
    setStages(filteredStages);
  };

  const getStagesNotUsed = () => {
    return originalStages.reduce((acu, cur) => {
      return processStages.findIndex(pStage => pStage.id === cur.id) < 0 ?
        [...acu, cur] : acu;
    }, []);
  };

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const [usersProcess, setUsersProcess] = useState({
    selectedUserNotification: '',
    selectedUserApproval: '',
    notificationsDisabled: true,
    approvalsDisabled: true
  });
  const handleChangeUserNotifApp = name => event => {
    const { target: { value: selectedUser } } = event;
    if (!selectedUser || !selectedStage) {
      return;
    }
    setUsersProcess(prev => ({
      ...prev,
      [name]: event.target.value,
      notificationsDisabled: false,
      approvalsDisabled: false
    }));
    let typeInfo;

    if (name === 'selectedUserNotification') {
      typeInfo = {
        name: 'notifications',
        user: 'selectedUserNotifications'
      };
    } else if (name === 'selectedUserApproval') {
      typeInfo = {
        name: 'approvals',
        user: 'selectedUserApprovals'
      };
    }
    const tmpMessages = validMessages[typeInfo.name];
    let selectedLayouts = tmpMessages[selectedStage][selectedUser];
    if (!selectedLayouts) {
      selectedLayouts = selectedStageLayout.map(layout => ({ ...layout, checked: false }));
    }
    tmpMessages[selectedStage][selectedUser] = selectedLayouts;
    setValidMessages(prev => ({
      ...prev,
      [typeInfo.user]: selectedUser || 'none',
      [typeInfo.name]: tmpMessages
    }));
  };

  const handleChangeCheck = name => event => {
    setValues({ ...values, [name]: event.target.checked });
  };

  const handleSave = () => {
    const body = { ...values, processStages, usersProcess, validMessages };
    const r = JSON.stringify(body);
    if (!id) {
      body.idUserProfile = idUserProfile;
      postDB('processes', body)
        .then(response => {
          console.log('response:', response)
          reloadTable();
        })
        .catch(error => console.log(error));
    } else {
      updateDB('processes/', body, id[0])
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
      name: '',
      goBackEnabled: false,
      selectedUserNotification: '',
      selectedUserApprovals: ''
    });
    setShowModal(false);
    setValue4(0);
    setProcessStages([]);
    setStages([]);
    setOriginalStages([]);
    setUsersProcess({
      selectedUserNotification: '',
      selectedUserApproval: '',
      notificationsDisabled: true,
      approvalsDisabled: true
    });
    setValidMessages({
      notifications: {},
      approvals: {},
      selectedUserNotifications: '',
      selectedUserApprovals: ''
    });
    setNotifications([]);
    setApprovals([]);
    setSelectedStage('');
  };

  const [employeeProfilesFiltered, setEmployeeProfilesFiltered] = useState([]);
  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [approvals, setApprovals] = useState([]);
  const [stageLayouts, setStageLayouts] = useState([]);
  const [selectedStageLayout, setSelectedStageLayout] = useState([]);

  useEffect(() => {
    if(!id || !Array.isArray(id)) {
      return;
    }

    getOneDB('processes/', id[0])
    .then(response => response.json())
    .then(data => { 
      const { processStages, usersProcess, validMessages } = data.response;
      const values = omit(data.response, '_id');
      // setValues({ name, goBackEnabled });
      setValues(values);
      setProcessStages(processStages);
      setUsersProcess(usersProcess);
      setValidMessages(validMessages);
    })
    .catch(error => console.log(error));
  }, [id]);

  useEffect(() => {
    getDB('processStages')
    .then(response => response.json())
    .then(data => {
      const stages = data.response.map(({ _id, name, notifications, approvals }) => ({ id: _id, name, notifications, approvals }));
      setStages(stages);
      setOriginalStages(stages);
    })
    .catch(error => console.log(error));

    getDB('settingsLayoutsStages')
    .then(response => response.json())
    .then(data => {
      const stageLayoutsData = data.response.map(({ _id, name, selectedStage, selectedType  }) => ({ id: _id, name, selectedStage, selectedType }));
      setStageLayouts(stageLayoutsData);
    })
    .catch(error => console.log(error));
  }, [showModal]);

  const [customFieldsTab, setCustomFieldsTab] = useState({});
  const [profilePermissions, setProfilePermissions] = useState({});
  const [tabs, setTabs] = useState([]);
  const [locationsTable, setLocationsTable] = useState([]);

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

  const handleStageClick = (stage) => {
    if (!processStages.includes(stage)) {
      const localProcessStages = processStages;
      localProcessStages.push(stage);
      setProcessStages(localProcessStages);
    }
    const localStages = stages.filter(st => st.id !== stage.id);
    setStages(localStages);
  };

  const handleRemoveProcessStage = (stage) => {
    const localProcessStages = processStages.filter(st => st.id !== stage.id);
    setProcessStages(localProcessStages);
    if (!stages.includes(stage)) {
      const localStages = stages;
      stages.push(stage);
      setStages(localStages);
    }
  };

  const [value, setValue] = useState(0);

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  //
  const [messagesTabIndex, setMessagesTabIndex] = useState(0);
  const [layoutMessageTabIndex, setLayoutMessageTabIndex] = useState(0);
  const handleToggleChecks = (type, name) => event => {
    const userMap = { notifications: 'selectedUserNotifications', approvals: 'selectedUserApprovals' };
    // let userFiltered = validMessages[type][validMessages[userMap[type]]];
    const user = validMessages[userMap[type]];
    let userFiltered = validMessages[type][selectedStage][user];
    const userFilteredSpecific = userFiltered.filter(msg => msg.name === name)[0];
    userFilteredSpecific.checked = event.target.checked;

    const tmpValidMessages = validMessages[type];
    tmpValidMessages[selectedStage][user] = userFiltered;
    // const finalMessages = { ...validMessages[type], [user]: userFiltered };
    // setValidMessages(prev => ({ ...prev, [type]: finalMessages }));
    setValidMessages(prev => ({ ...prev, [type]: tmpValidMessages }));
  };

  const [selectedStage, setSelectedStage] = useState('');
  const handleStageProcessClick = (id) => {
    const currentStageLayout = stageLayouts.filter(layout => layout.selectedStage === id);
    const selectedStage = originalStages.find(stage => stage.id === id);
    const { notifications, approvals } = selectedStage;
    setNotifications(notifications);
    setApprovals(approvals);
    setSelectedStageLayout(currentStageLayout);
    setSelectedStage(id);
    
    const tmpValidMessages = validMessages;
    if (!validMessages.notifications[id]) {
      tmpValidMessages.notifications[id] = {}; 
    }
    if (!validMessages.approvals[id]) {
      tmpValidMessages.approvals[id] = {}; 
    }
    tmpValidMessages.selectedStage = id;
    tmpValidMessages.selectedUserNotifications = '';
    tmpValidMessages.selectedUserApprovals = '';
    setValidMessages(tmpValidMessages);

    setUsersProcess(prev => ({...prev, selectedUserNotification: '', selectedUserApproval: '' }))
  };

  const notificationsList = selectedStage && validMessages.notifications[selectedStage] ?
    (validMessages.notifications[selectedStage][validMessages.selectedUserNotifications] || []) : [];
  const approvalsList = selectedStage && validMessages.approvals[selectedStage] ?
    (validMessages.approvals[selectedStage][validMessages.selectedUserApprovals] || []) : [];

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
          {`${id ? 'Edit' : 'Add' } Processes`}
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
                  <Tab label="Flow" />
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
                       <FormControl className={classes.textField} style={{ marginTop: '10px' }}>
                        <InputLabel htmlFor="age-simple">Process Type</InputLabel>
                        <Select
                          value={values.selectedProcessType}
                          onChange={handleChange('selectedProcessType')}
                        >
                          {(processTypes || []).map(({ id, label }, ix) => (
                            <MenuItem key={`opt-${ix}`} value={id}>{label}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <List
                        style={{ width: '100%', marginTop: '10px' }}
                        component="nav"
                        className={classes.root}
                        aria-labelledby="nested-list-subheader"
                        subheader={
                          <TextField
                            id="outlined-adornment-password"
                            className={classes.textField}
                            label="All Stages"
                            value={searchStage}
                            onChange={handleSearchStage}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <SearchIcon />
                                </InputAdornment>
                              ),
                            }}
                          />
                        }
                      >
                        {(stages || []).map((stage, ix) => (
                          <ListItem
                            key={`${stage.name}_${stage.name}`}
                            button
                            onClick={() => handleStageClick(stage)}
                          >
                            <ListItemIcon>
                              <AccountTree />
                            </ListItemIcon>
                            <ListItemText primary={stage.name} />
                          </ListItem>  
                        ))}
                      </List>
                    </div>
                    <div style={{ minHeight: '400px' }} className="profile-tab-wrapper__content">
                      <ProcessFlow
                        onClick={handleStageProcessClick}
                        processStages={processStages}
                        setProcessStages={setProcessStages}
                        handleRemoveProcessStage={handleRemoveProcessStage}
                      />
                    </div>
                    <div className="profile-tab-wrapper__content">
                      <Card style={{ width: '250px' }}>
                        <CardContent style={{ display: 'flex', flexDirection: 'column', minHeight: '400px' }}>
                          <Typography className={classes.title} color="textPrimary" gutterBottom>
                            Properties
                          </Typography>
                          <FormControlLabel
                            value="end"
                            control={<Switch color="primary" checked={values.goBackEnabled} onChange={handleChangeCheck('goBackEnabled')} />}
                            label="Go Back"
                            labelPlacement="end"
                          />
                          <FormControl disabled={!values.goBackEnabled} >
                            <InputLabel>To Stage:</InputLabel>
                            <Select
                              // value={age}
                              onChange={handleChange}
                            >
                              <MenuItem value='none'>
                                <em>None</em>
                              </MenuItem>
                              <MenuItem value={10}>Stage 1</MenuItem>
                              <MenuItem value={20}>Stage 2</MenuItem>
                              <MenuItem value={30}>Stage 3</MenuItem>
                            </Select>
                          </FormControl>
                          <div style={{ marginTop: '20px' }}>
                            <AppBar position="static" color="default">
                              <Tabs
                                value={messagesTabIndex}
                                onChange={(_, newValue) => setMessagesTabIndex(newValue)}
                                indicatorColor="primary"
                                textColor="primary"
                                variant="standard"
                                aria-label="full width tabs example"
                              >
                                <Tab style={{ width: '20px' }} label="Notifications" />
                                <Tab label="Approvals" />
                              </Tabs>
                            </AppBar>
                            <SwipeableViews
                              axis={'x'}
                              index={messagesTabIndex}
                              onChangeIndex={(index) => setMessagesTabIndex(index)}
                            >
                              <TabContainer4 dir={theme4.direction}>
                                <div style={{ marginTop: '0px', display: 'flex', flexDirection: 'column' }}>
                                  <FormControl>
                                    <InputLabel>Notification Users:</InputLabel>
                                    <Select
                                      value={usersProcess.selectedUserNotification}
                                      onChange={handleChangeUserNotifApp('selectedUserNotification')}
                                    >
                                      <MenuItem value=''>
                                        <em>None</em>
                                      </MenuItem>
                                      {notifications.map(({ _id, email, name, lastName }) => (
                                        <MenuItem value={_id} name={email}>{`${name} ${lastName} (${email})`}</MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                  <List
                                    dense
                                    className={classes.root}
                                    style={{ marginTop: '15px' }}
                                    subheader={<ListSubheader component="div">Notification Messages:</ListSubheader>}
                                  >
                                    {/* {(selectedStageLayout || []).map(({ name, checked }) => { */}
                                    {/* {(validMessages.notifications[validMessages.selectedUserNotifications] || []).map(({ name, checked }) => { */}
                                    {notificationsList.map(({ name, checked }) => {
                                      const labelId = `checkbox-list-secondary-label-${name}`;
                                      return (
                                        <ListItem key={name} button disabled={usersProcess.notificationsDisabled}>
                                          <ListItemText id={labelId} primary={name} />
                                          <ListItemSecondaryAction>
                                            <Checkbox
                                              edge="end"
                                              checked={checked}
                                              onChange={handleToggleChecks('notifications', name)}
                                              // checked={checked.indexOf(value) !== -1}
                                              // inputProps={{ 'aria-labelledby': labelId }}
                                              // disabled={usersProcess.notificationsDisabled}
                                            />
                                          </ListItemSecondaryAction>
                                        </ListItem>
                                      );
                                    })}
                                  </List>
                                </div>
                              </TabContainer4>
                              <TabContainer4 dir={theme4.direction}>
                                <div style={{ marginTop: '0px', display: 'flex', flexDirection: 'column' }}>
                                  <FormControl>
                                    <InputLabel>Approval Users:</InputLabel>
                                    <Select
                                      value={usersProcess.selectedUserApproval}
                                      onChange={handleChangeUserNotifApp('selectedUserApproval')}
                                    >
                                      <MenuItem value="">
                                        <em>None</em>
                                      </MenuItem>
                                      {approvals.map(({ _id, email, name, lastName }) => (
                                        <MenuItem value={_id} name={email}>{`${name} ${lastName} (${email})`}</MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                  <List
                                    dense
                                    className={classes.root}
                                    style={{ marginTop: '15px' }}
                                    subheader={<ListSubheader component="div">Approval Messages:</ListSubheader>}
                                  >
                                    {/* {(selectedStageLayout || []).map(({ name, checked }) => { */}
                                    {/* {(validMessages.approvals[validMessages.selectedUserApprovals] || []).map(({ name, checked }) => { */}
                                    {(approvalsList).map(({ name, checked }) => {
                                      const labelId = `checkbox-list-secondary-label-approvals-${name}`;
                                      return (
                                        <ListItem key={name} button disabled={usersProcess.approvalsDisabled}>
                                          <ListItemText id={labelId} primary={name} />
                                          <ListItemSecondaryAction>
                                            <Checkbox
                                              edge="end"
                                              checked={checked}
                                              onChange={handleToggleChecks('approvals', name)}
                                              // checked={checked.indexOf(value) !== -1}
                                              // inputProps={{ 'aria-labelledby': labelId }}
                                              // disabled={usersProcess.approvalsDisabled}
                                            />
                                          </ListItemSecondaryAction>
                                        </ListItem>
                                      );
                                    })}
                                  </List>
                                </div>
                              </TabContainer4>
                            </SwipeableViews>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
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

export default ModalProcesses;
