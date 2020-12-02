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
import SwipeableViews from "react-swipeable-views";

import CloseIcon from "@material-ui/icons/Close";
import CustomFields from '../../Components/CustomFields/CustomFields';
import Widgets from '@material-ui/icons/Widgets';
import AccountTree from '@material-ui/icons/AccountTree';
import SearchIcon from '@material-ui/icons/Search';

import TableComponent from '../../Components/TableComponent';

// import './ModalAssetCategories.scss';
import ImageUpload from '../../Components/ImageUpload';
import { postDBEncryptPassword, getOneDB, updateDB, postDB } from '../../../../crud/api';
import ModalYesNo from '../../Components/ModalYesNo';
import Permission from '../components/Permission';

import {
  SingleLine,
  MultiLine,
  Date,
  DateTime,
  DropDown,
  RadioButtons,
  Checkboxes,
  FileUpload
} from '../../Components/CustomFields/CustomFieldsPreview';

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

const CustomFieldsPreview = (props) => {
  const customFieldsPreviewObj = {
    singleLine: <SingleLine { ...props } />,
    multiLine: <MultiLine { ...props } />,
    date: <Date { ...props } />,
    dateTime: <DateTime { ...props } />,
    dropDown: <DropDown { ...props } />,
    radioButtons: <RadioButtons { ...props } />,
    checkboxes: <Checkboxes { ...props } />,
    fileUpload: <FileUpload { ...props } />
  };
  return customFieldsPreviewObj[props.type];
};

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
  const classes = useStyles();
  const [values, setValues] = useState({
    name: "",
    lastName: '',
    email: '',
    isDisableUserProfile: false,
    selectedUserProfile: null,
    categoryPic: '/media/misc/placeholder-image.jpg',
    categoryPicDefault: '/media/misc/placeholder-image.jpg',
    //
    goBackEnabled: false,
    layoutMessageName: ''
  });
  const [profileSelected, setProfileSelected] = useState(0);
  const [layoutSelected, setLayoutSelected] = useState(0);
  const originalStages = [
    {
      id: 'stage1',
      name: 'qwerty'
    },
    {
      id: 'stage2',
      name: 'azerty'
    },
    {
      id: 'stage3',
      name: 'morse'
    },
    {
      id: 'stage4',
      name: 'earth'
    },
    {
      id: 'stage5',
      name: 'commission'
    },
  ];
  const [stages, setStages] = useState(originalStages);
  const [searchStage, setSearchStage] = useState('');
  const [processStages, setProcessStages] = useState([])
  
  const handleSearchStage = event => {
    const searchStageVal = event.target.value;
    setSearchStage(searchStageVal);
    if (!searchStageVal) {
      setStages(originalStages);
      // setStages(stages);
      return;
    }
    // const filteredStages = originalStages.filter(st => st.name.toLowerCase().includes(searchStageVal.toLowerCase()));
    const filteredStages = stages.filter(st => st.name.toLowerCase().includes(searchStageVal.toLowerCase()));
    setStages(filteredStages);
  };

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleChangeCheck = name => event => {
    setValues({ ...values, [name]: event.target.checked });
  };

  const handleSave = () => {
    const body = { ...values, customFieldsTab, profilePermissions, locationsTable, layoutSelected };
    if (!id) {
      body.idUserProfile = idUserProfile;
      postDB('employees', body)
        .then(response => {
          console.log('response:', response)
          reloadTable();
        })
        .catch(error => console.log(error));
    } else {
      updateDB('employees/', body, id[0])
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
      name: "",
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
  };

  const [employeeProfilesFiltered, setEmployeeProfilesFiltered] = useState([]);

  useEffect(() => {
    // const userProfiles = employeeProfileRows.map((profile, ix) => ({ value: profile.id, label: profile.name }));
    // setEmployeeProfilesFiltered(userProfiles);
    // if(!id || !Array.isArray(id)) {
    //   return;
    // }

    // getOneDB('employees/', id[0])
    //   .then(response => response.json())
    //   .then(data => { 
    //     const { name, lastName, email, customFieldsTab, profilePermissions, idUserProfile, locationsTable, layoutSelected } = data.response;
    //     setCustomFieldsTab(customFieldsTab);
    //     setProfilePermissions(profilePermissions);
    //     setLayoutSelected(layoutSelected)
    //     setProfileSelected(employeeProfilesFiltered.filter(profile => profile.value === idUserProfile));
    //     setLocationsTable(locationsTable || []);
    //     setValues({ 
    //       ...values,
    //       name,
    //       lastName,
    //       email,
    //       isDisableUserProfile: true,
    //     });
    //     //
    //     const tabs = Object.keys(customFieldsTab).map(key => ({ key, info: customFieldsTab[key].info, content: [customFieldsTab[key].left, customFieldsTab[key].right] }));
    //     tabs.sort((a, b) => a.key.split('-').pop() - b.key.split('-').pop());
    //     setCustomFieldsTab(customFieldsTab);
    //     setTabs(tabs);
    //   })
    //   .catch(error => console.log(error));
  }, [id, employeeProfileRows]);

  const [customFieldsTab, setCustomFieldsTab] = useState({});
  const [profilePermissions, setProfilePermissions] = useState({});
  const [tabs, setTabs] = useState([]);
  const [locationsTable, setLocationsTable] = useState([]);


  const modules = [
    { key:'dashboard', name: 'Dashboard' },
    { key:'assets', name: 'Assets' },
    { key:'processes', name: 'Processes' },
    { key:'users', name: 'Users' },
    { key:'employees', name: 'Employees' },
    { key:'locations', name: 'Locations' },
    { key:'reports', name: 'Reports' },
    { key:'settings', name: 'Settings' },
  ];

  const handleSetPermissions = (key, checked) => {
    setProfilePermissions(prev => ({ ...prev, [key]: checked }));
  }

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

  const [value, setValue] = React.useState(0);

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  //
  const [messagesTabIndex, setMessagesTabIndex] = useState(0);
  const [layoutMessageTabIndex, setLayoutMessageTabIndex] = useState(0);

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
                  <Tab label="Layout Messages" />
                  <Tab label="Layout Document" />
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
                        className={classes.root}
                        value={values.name}
                        onChange={handleChange("name")}
                        margin="normal"
                      />
                      <List
                        style={{width: '100%'}}
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
                              <MenuItem value="">
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
                                      // value={age}
                                      onChange={handleChange}
                                    >
                                      <MenuItem value="">
                                        <em>None</em>
                                      </MenuItem>
                                      <MenuItem value={10}>User 1</MenuItem>
                                      <MenuItem value={20}>User 2</MenuItem>
                                      <MenuItem value={30}>User 3</MenuItem>
                                    </Select>
                                  </FormControl>
                                  <List
                                    dense
                                    className={classes.root}
                                    style={{ marginTop: '15px' }}
                                    subheader={<ListSubheader component="div">Notification Messages:</ListSubheader>}
                                  >
                                    {[0, 1, 2, 3].map((value) => {
                                      const labelId = `checkbox-list-secondary-label-${value}`;
                                      return (
                                        <ListItem key={value} button>
                                          <ListItemText id={labelId} primary={`Notification ${value + 1}`} />
                                          <ListItemSecondaryAction>
                                            <Checkbox
                                              edge="end"
                                              // onChange={handleToggle(value)}
                                              // checked={checked.indexOf(value) !== -1}
                                              inputProps={{ 'aria-labelledby': labelId }}
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
                                      // value={age}
                                      onChange={handleChange}
                                    >
                                      <MenuItem value="">
                                        <em>None</em>
                                      </MenuItem>
                                      <MenuItem value={10}>User 1</MenuItem>
                                      <MenuItem value={20}>User 2</MenuItem>
                                      <MenuItem value={30}>User 3</MenuItem>
                                    </Select>
                                  </FormControl>
                                  <List
                                    dense
                                    className={classes.root}
                                    style={{ marginTop: '15px' }}
                                    subheader={<ListSubheader component="div">Approval Messages:</ListSubheader>}
                                  >
                                    {[0, 1, 2, 3].map((value) => {
                                      const labelId = `checkbox-list-secondary-label-${value}`;
                                      return (
                                        <ListItem key={value} button>
                                          <ListItemText id={labelId} primary={`Approval ${value + 1}`} />
                                          <ListItemSecondaryAction>
                                            <Checkbox
                                              edge="end"
                                              // onChange={handleToggle(value)}
                                              // checked={checked.indexOf(value) !== -1}
                                              inputProps={{ 'aria-labelledby': labelId }}
                                            />
                                          </ListItemSecondaryAction>
                                        </ListItem>
                                      );
                                    })}
                                  </List>
                                </div>
                              </TabContainer4>

                              {/* <TabPanel value={value} index={0} dir={'x'}>
                                <div style={{ marginTop: '0px', display: 'flex', flexDirection: 'column' }}>
                                  <FormControl>
                                    <InputLabel>Notification Users:</InputLabel>
                                    <Select
                                      // value={age}
                                      onChange={handleChange}
                                    >
                                      <MenuItem value="">
                                        <em>None</em>
                                      </MenuItem>
                                      <MenuItem value={10}>User 1</MenuItem>
                                      <MenuItem value={20}>User 2</MenuItem>
                                      <MenuItem value={30}>User 3</MenuItem>
                                    </Select>
                                  </FormControl>
                                  <List
                                    dense
                                    className={classes.root}
                                    style={{ marginTop: '15px' }}
                                    subheader={<ListSubheader component="div">Notification Messages:</ListSubheader>}
                                  >
                                    {[0, 1, 2, 3].map((value) => {
                                      const labelId = `checkbox-list-secondary-label-${value}`;
                                      return (
                                        <ListItem key={value} button>
                                          <ListItemText id={labelId} primary={`Notification ${value + 1}`} />
                                          <ListItemSecondaryAction>
                                            <Checkbox
                                              edge="end"
                                              // onChange={handleToggle(value)}
                                              // checked={checked.indexOf(value) !== -1}
                                              inputProps={{ 'aria-labelledby': labelId }}
                                            />
                                          </ListItemSecondaryAction>
                                        </ListItem>
                                      );
                                    })}
                                  </List>
                                </div>
                              </TabPanel>
                              <TabPanel value={value} index={1} dir={'x'}>
                                <div style={{ marginTop: '0px', display: 'flex', flexDirection: 'column' }}>
                                    <FormControl>
                                      <InputLabel>Notification Users:</InputLabel>
                                      <Select
                                        // value={age}
                                        onChange={handleChange}
                                      >
                                        <MenuItem value="">
                                          <em>None</em>
                                        </MenuItem>
                                        <MenuItem value={10}>User 1</MenuItem>
                                        <MenuItem value={20}>User 2</MenuItem>
                                        <MenuItem value={30}>User 3</MenuItem>
                                      </Select>
                                    </FormControl>
                                    <List
                                      dense
                                      className={classes.root}
                                      style={{ marginTop: '15px' }}
                                      subheader={<ListSubheader component="div">Notification Messages:</ListSubheader>}
                                    >
                                      {[0, 1, 2, 3].map((value) => {
                                        const labelId = `checkbox-list-secondary-label-${value}`;
                                        return (
                                          <ListItem key={value} button>
                                            <ListItemText id={labelId} primary={`Notification ${value + 1}`} />
                                            <ListItemSecondaryAction>
                                              <Checkbox
                                                edge="end"
                                                // onChange={handleToggle(value)}
                                                // checked={checked.indexOf(value) !== -1}
                                                inputProps={{ 'aria-labelledby': labelId }}
                                              />
                                            </ListItemSecondaryAction>
                                          </ListItem>
                                        );
                                      })}
                                    </List>
                                  </div>
                              </TabPanel> */}
                            </SwipeableViews>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabContainer4>
                <TabContainer4>
                <div className="profile-tab-wrapper">
                  <div style={{ minHeight: '400px', width: '28%', alignItems: 'flex-start' }} className="profile-tab-wrapper__content">
                    <List
                      style={{width: '90%'}}
                      component="nav"
                      className={classes.root}
                      aria-labelledby="nested-list-subheader"
                      subheader={
                        <TextField
                          style={{ maxWidth: '90%' }}
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
                          // onClick={() => handleStageClick(stage)}
                        >
                          <ListItemIcon>
                            <AccountTree />
                          </ListItemIcon>
                          <ListItemText primary={stage.name} />
                        </ListItem>  
                      ))}
                    </List>
                  </div>
                  <div style={{ minHeight: '400px', width: '77%', alignItems: 'flex-start' }} className="profile-tab-wrapper__content">
                    <Tabs
                      value={layoutMessageTabIndex}
                      onChange={(_, newValue) => setLayoutMessageTabIndex(newValue)}
                      indicatorColor="primary"
                      textColor="primary"
                      variant="fullWidth"
                    >
                      <Tab label="Table" />
                      <Tab label="Layout" />
                    </Tabs>
                    <SwipeableViews
                      axis={theme4.direction === "rtl" ? "x-reverse" : "x"}
                      index={layoutMessageTabIndex}
                      onChangeIndex={index => setLayoutMessageTabIndex(index)}
                    >
                      <TabContainer4 dir={theme4.direction}>
                        <TableComponent
                          style={{ padding: '0px' }}
                          title={'Layout Messages List'}
                          headRows={messagesHeadRows}
                          rows={[]}
                          // rows={control.processRows}
                          // onEdit={tableActions('processes').onEdit}
                          // onAdd={tableActions('processes').onAdd}
                          // onDelete={tableActions('processes').onDelete}
                          // onSelect={tableActions('processes').onSelect}
                        />
                      </TabContainer4>
                      <TabContainer4>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <TextField
                            id="standard-name"
                            label="Layout Message Name"
                            className={classes.textField}
                            value={values.layoutMessageName}
                            onChange={handleChange("layoutMessageName")}
                            margin="normal"
                          />
                          <FormControl
                            className={classes.textField}
                          >
                            <InputLabel>Type:</InputLabel>
                            <Select
                              // value={age}
                              onChange={handleChange}
                            >
                              <MenuItem value={10}>Message</MenuItem>
                              <MenuItem value={20}>Notification</MenuItem>
                            </Select>
                          </FormControl>
                          <div style={{ marginTop: '20px' }}>
                            <Editor
                              // editorState={editorState}
                              toolbarClassName="toolbarClassName"
                              wrapperClassName="wrapperClassName"
                              editorClassName="editorClassName"
                              // onEditorStateChange={this.onEditorStateChange}
                            />
                          </div>
                        </div>
                      </TabContainer4>
                    </SwipeableViews>
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

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default ModalProcesses;
