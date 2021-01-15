/* eslint-disable no-restricted-imports */
import React, { useMemo, useState, useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";
import { get, merge } from "lodash";
import { FormHelperText, Switch, Tab, Tabs, Styles } from "@material-ui/core";
import clsx from "clsx";
import { metronic, initLayoutConfig, LayoutConfig } from "../../../../_metronic";
import {
  Portlet,
  PortletBody,
  PortletFooter,
  PortletHeader,
  PortletHeaderToolbar
} from "../../../partials/content/Portlet";
import { CodeBlock } from "../../../partials/content/CodeExample";
import Notice from "../../../partials/content/Notice";

import CodeExample from '../../../partials/content/CodeExample';

import {
  makeStyles,
  lighten,
  withStyles,
  useTheme
} from "@material-ui/core/styles";
import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  Toolbar,
  Typography,
  Tooltip,
  IconButton,
  TableSortLabel,
  TablePagination,
  // Switch,
  FormControlLabel,
  TableFooter,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputLabel,
  Select,
  Menu,
  MenuItem,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormGroup,
} from "@material-ui/core";

// AApp Components
import TableComponent from '../Components/TableComponent';
import ModalLocationProfiles from './modals/ModalLocationProfiles';
import ModalLocationList from './modals/ModalLocationList';
import TreeView from '../Components/TreeViewComponent';
import GoogleMaps from '../Components/GoogleMaps';
import './Locations.scss';

//Icons
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from '@material-ui/icons/Delete';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';


//Custom Fields Preview
import {
  SingleLine,
  MultiLine,
  Date,
  DateTime,
  DropDown,
  RadioButtons,
  Checkboxes,
  FileUpload,
  SingleLineSettings,
  MultiLineSettings,
  DateSettings,
  DateTimeSettings,
  DropDownSettings,
  RadioButtonsSettings,
  CheckboxesSettings,
  FileUploadSettings
} from '../Components/CustomFields/CustomFieldsPreview';
import ModalYesNo from '../Components/ModalYesNo';
import SwipeableViews from "react-swipeable-views";
// import { Map, GoogleApiWrapper } from 'google-maps-react';
// import { postDB } from '../../../crud/api';
import { getDB, deleteDB } from '../../../crud/api';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import RemoveIcon from '@material-ui/icons/Remove';

//Tabs translation
import { useIntl } from "react-intl";
const TabsConfig = {
  tabs:[
    {
      title: "List",
      translate: "TABS.LOCATIONS.LIST"
    },
    {
      title: "Profiles",
      translate: "TABS.LOCATIONS.PROFILES"
    },
    {
      title: "Policies",
      translate: "TABS.LOCATIONS.POLICIES"
    },
    {
      title:"Settings",
      translate:"TABS.LOCATIONS.SETTINGS"
    }
  ]
};

const localStorageActiveTabKey = "builderActiveTab";

const Divider = () => <div style={{width: '100%', height: '3px', backgroundColor: 'black'}}></div>;

const locationsTreeData = {
  id: 'root',
  name: 'Locations',
  profileLevel: -1,
  parent: null
};

export default function Locations() {

  const intl = useIntl();
  const activeTab = localStorage.getItem(localStorageActiveTabKey);
  const [tab, setTab] = useState(activeTab ? +activeTab : 0);
  const dispatch = useDispatch();
  const { layoutConfig } = useSelector(
    ({ builder }) => ({ layoutConfig: builder.layoutConfig }),
    shallowEqual
  );
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [loadingButtonPreviewStyle, setLoadingButtonPreviewStyle] = useState({
    paddingRight: "2.5rem"
  });
  const [loadingReset, setLoadingReset] = useState(false);
  const [loadingButtonResetStyle, setLoadingButtonResetStyle] = useState({
    paddingRight: "2.5rem"
  });

  const enableLoadingPreview = () => {
    setLoadingPreview(true);
    setLoadingButtonPreviewStyle({ paddingRight: "3.5rem" });
  };
  const enableLoadingReset = () => {
    setLoadingReset(true);
    setLoadingButtonResetStyle({ paddingRight: "3.5rem" });
  };
  const updateLayoutConfig = _config => {
    dispatch(metronic.builder.actions.setLayoutConfigs(_config));
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const initialValues = useMemo(
    () =>
      merge(
        // Fulfill changeable fields.
        LayoutConfig,
        layoutConfig
      ),
    [layoutConfig]
  );

  const createLocationProfileRow = (id, level, name, creator, creation_date) => {
    return { id, level, name, creator, creation_date };
  };

  const locHeadRows = [
    { id: "id", numeric: false, disablePadding: true, label: "ID" },
    { id: "level", numeric: true, disablePadding: false, label: "Level" },
    { id: "name", numeric: true, disablePadding: false, label: "Description" },
    { id: "creator", numeric: true, disablePadding: false, label: "Creator" },
    { id: "creation_date", numeric: true, disablePadding: false, label: "Creation Date" }
  ];

  const locationsHeadRows = [
    { id: "id", numeric: false, disablePadding: true, label: "ID" },
    { id: "level", numeric: true, disablePadding: false, label: "Level" },
    { id: "name", numeric: true, disablePadding: false, label: "Description" },
    { id: "creator", numeric: true, disablePadding: false, label: "Creator" },
    { id: "creation_date", numeric: true, disablePadding: false, label: "Creation Date" }
  ];

  const locationsRows = [
    createLocationProfileRow('1', '0', 'CDMX', 'Admin', '11/03/2020'),
    createLocationProfileRow('2', '1', 'Monterrey', 'Admin', '11/03/2020'),
    createLocationProfileRow('3', '2', 'Guadalajara', 'Admin', '11/03/2020'),
  ];
  
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [openListModal, setOpenListModal] = useState(false);
  const [openYesNoModal, setOpenYesNoModal] = useState(false);
  
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
  const theme4 = useTheme();
  const [value4, setValue4] = useState(0);
  function handleChange4(event, newValue) {
    setValue4(newValue);
  }
  function handleChangeIndex4(index) {
    setValue4(index);
  }

  // Mini menu to add new location
  const [anchorEl, setAnchorEl] = React.useState(null);

  function handleClose() {
    setAnchorEl(null);
  }

  const handleOpenLocationListModal = (profile) => {
    handleClose();
    setEditOrNew('new');
    setOpenListModal(true);
    setProfileSelected(profile);
  };

  const [profileSelected, setProfileSelected] = useState({});

  const [locationProfileRows, setLocationProfileRows] = useState([]);
  const [selectedLocationProfileRows, setSelectedLocationProfileRows] = useState([]);
  const [locationsList, setLocationsList] = useState([]);

  const [parentSelected, setParentSelected] = useState(null);
  const [realParentSelected, setRealParentSelected] = useState(null);

  const onDeleteProfileLocation = (id) => {
    if (!id || !Array.isArray(id)) return;
    id.forEach(_id => {
      deleteDB('locations/', _id)
        .then(response => console.log('success', response))
        .catch(error => console.log('Error', error));
    });
    handleLoadLocationProfiles();
    
  };

  const [id, setId] = useState(null);
  const onEditProfileLocation = (_id) => {
    setId(_id);
    setOpenProfileModal(true);
  };
  const onAddProfileLocation = () => {
    setId(null);
    setOpenProfileModal(true);
  };

  const handleSetProfileLocationFilter = (parent, level, realParent) => {
    console.log('level, parent', level, parent)
    const lvl = Number(level) + 1;
    setParentSelected(parent);
    setRealParentSelected(realParent);
    let locationProf = locationProfileRows.filter(row => row.level == lvl);
    setSelectedLocationProfileRows(locationProf);
  };

  const [locationsTree, setLocationsTree] = useState({});

  const constructLocationTreeRecursive = (locs) => {
    if (!locs || !Array.isArray(locs) || !locs.length) return [];
    let res = [];
    locs.forEach((location) => {
      const locObj = (({_id: id, name, profileLevel, parent}) => ({id, name, profileLevel, parent}))(location);
      const children = locations.filter(loc => loc.parent === locObj.id);
      locObj.children = constructLocationTreeRecursive(children);
      res.push(locObj);
    });
    return res;
  };

  const handleLoadLocationProfiles = () => {
    getDB('locations')
      .then(response => response.json())
      .then(data => {
        const profileRows = data.response.map(row => {
          return createLocationProfileRow(row._id, row.level, row.name, 'Admin', '11/03/2020');
        });
        setLocationProfileRows(profileRows);
        setSelectedLocationProfileRows([]);
      })
      .catch(error => console.log('error>', error));
  };

  let locations;
  const handleLoadLocations = () => {
    setLocationsTree({});
    getDB('locationsReal')
      .then(response => response.json())
      .then(async data => {
        locations = data.response.map(res => ({ ...res, id: res._id }));
        const homeLocations = data.response.filter(loc => loc.profileLevel === 0);
        const children = constructLocationTreeRecursive(homeLocations);
        locationsTreeData.children = children;
        console.log('locationsTreeData:', locationsTreeData)
        setLocationsTree(locationsTreeData);
      })
      .catch(error => console.log('error>', error));
    const selectedProfileTmp = profileSelected;
    setProfileSelected({});
    setProfileSelected(selectedProfileTmp);
  };

  useEffect(() => {
    console.log('One time');
    handleLoadLocationProfiles();
    handleLoadLocations();
  }, []);

  const [editOrNew, setEditOrNew] = useState('new');
  const locationActions = {
    openYesNoModal() {
      console.log('INTENT>>>', parentSelected);
      if (!parentSelected || parentSelected === 'root') return;
      setOpenYesNoModal(true);
    },
    closeYesNoModal() {
      setOpenYesNoModal(false);
    },
    removeLocation() {
      deleteDB('locationsReal/', parentSelected)
        .then(response => handleLoadLocations())
        .catch(error => console.log('Error', error));
      setOpenYesNoModal(false);
    },
    openProfilesListBox(e) {
      setAnchorEl(e.currentTarget);
    },
    editLocation() {
      if (!parentSelected || parentSelected === 'root') return;
      setEditOrNew('edit');
      setOpenListModal(true);
    }
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={values => {
          enableLoadingPreview();
          updateLayoutConfig(values);
        }}
        onReset={() => {
          enableLoadingReset();
          updateLayoutConfig(initLayoutConfig);
        }}
      >
        {({ values, handleReset, handleSubmit, handleChange, handleBlur }) => (
          <div className="kt-form kt-form--label-right">
            <Portlet>
              <PortletHeader
                toolbar={
                  <PortletHeaderToolbar>
                    <Tabs
                      component="div"
                      className="builder-tabs"
                      value={tab}
                      onChange={(_, nextTab) => {
                        setTab(nextTab);
                        localStorage.setItem(localStorageActiveTabKey, nextTab);
                      }}
                    >
                      {
                        TabsConfig.tabs.map((e) => {
                          return (
                            <Tab label={
                              !e.translate ? (e.title) : (
                                intl.formatMessage({id:e.translate})
                              )
                            }/>
                          );
                        })
                      }
                      {/* <Tab label="Page" /> */}
                      {/* <Tab label="Aside" />
                      <Tab label="Footer" /> */}
                    </Tabs>
                  </PortletHeaderToolbar>
                }
              />

              {tab === 0 && (
                <PortletBody>
                  <div className="kt-section kt-margin-t-0">
                    <div className="kt-section__body">
                      <div className="kt-section">
                          <span className="kt-section__sub">
                            This section will integrate <code>Locations Section</code>
                          </span>
                          <ModalLocationList
                            showModal={openListModal}
                            setShowModal={setOpenListModal}
                            profile={profileSelected}
                            parent={parentSelected}
                            setParentSelected={setParentSelected}
                            realParent={realParentSelected}
                            reload={handleLoadLocations}
                            editOrNew={editOrNew}
                          />
                          <ModalYesNo
                            showModal={openYesNoModal}
                            onOK={locationActions.removeLocation}
                            onCancel={locationActions.closeYesNoModal}
                            title={'Remove Location'}
                            message={'Are you sure you want to remove this location?'}
                          />
                          <div className="kt-separator kt-separator--dashed"/>
                          <div className="kt-section__content">
                            {/* Insert Tree here */}
                            <div className="locations-list__top">
                              <div className="locations-list_top-add">
                                <Menu
                                  id="simple-menu"
                                  anchorEl={anchorEl}
                                  keepMounted
                                  open={Boolean(anchorEl)}
                                  onClose={handleClose}
                                >
                                  { selectedLocationProfileRows.map(locProfile => (
                                    <MenuItem onClick={() => handleOpenLocationListModal(locProfile)}>{locProfile.name}</MenuItem>
                                  )) }
                                </Menu>
                              </div>
                            </div>
                            <div className="locations-list">
                              <div className="locations-list__left-content">
                                <div>
                                  <Tooltip title="Add Location" placement="top">
                                    <IconButton onClick={locationActions.openProfilesListBox} aria-label="Filter list">
                                      <AddIcon />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Edit Location" placement="top">
                                    <IconButton onClick={locationActions.editLocation} aria-label="Filter list">
                                      <EditIcon />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Remove Location" placement="top">
                                    <IconButton onClick={locationActions.openYesNoModal} aria-label="Filter list">
                                      <RemoveIcon />
                                    </IconButton>
                                  </Tooltip>
                                </div>
                                <TreeView data={locationsTree} onClick={handleSetProfileLocationFilter}/>
                              </div>
                              <div className="locations-list__right-content">
                                <div>
                                  <Paper>
                                    <Tabs
                                      value={value4}
                                      onChange={handleChange4}
                                      indicatorColor="primary"
                                      textColor="primary"
                                      variant="fullWidth"
                                    >
                                      <Tab label="Map View" />
                                      <Tab label="Layout View" />
                                    </Tabs>
                                  </Paper>
                                  <SwipeableViews
                                    axis={"x"}
                                    index={value4}
                                    onChangeIndex={handleChangeIndex4}
                                  >
                                    <TabContainer4 
                                      dir={theme4.direction}
                                    >
                                      <div className="locations-list__map-view">
                                        <GoogleMaps style={{width: '100%', height: '500px', position: 'relative'}}/>
                                      </div>
                                    </TabContainer4>
                                    <TabContainer4 
                                      dir={theme4.direction}
                                    >
                                      <TextField
                                        id="standard-number"
                                        label="Level"
                                        value={values.age}
                                        onChange={handleChange("level")}
                                        type="number"
                                        margin="normal"
                                      />
                                    </TabContainer4>
                                  </SwipeableViews>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                    </div>
                  </div>
                </PortletBody>
              )}

              {tab === 1 && (
                <PortletBody>
                  <div className="kt-section kt-margin-t-0">
                    <div className="kt-section__body">
                      <div className="kt-section">
                          <span className="kt-section__sub">
                            This section will integrate <code>Locations/Profile Table</code>
                          </span>
                          <ModalLocationProfiles
                            showModal={openProfileModal}
                            setShowModal={setOpenProfileModal}
                            reloadTable={handleLoadLocationProfiles}
                            id={id}
                          />

                          <div className="kt-separator kt-separator--dashed"/>
                          <div className="kt-section__content">
                            {/* Insert table here */}
                            <TableComponent
                              title={'Locations Profiles'}
                              headRows={locHeadRows}
                              rows={locationProfileRows}
                              onEdit={onEditProfileLocation}
                              onAdd={onAddProfileLocation}
                              onDelete={onDeleteProfileLocation}
                            />
                          </div>
                        </div>
                    </div>
                  </div>
                </PortletBody>
              )}

              {tab === 2 && (
                <PortletBody>
                  <div className="kt-section kt-margin-t-0">
                    <div className="kt-section__body">
                      <div className="kt-section">
                          <span className="kt-section__sub">
                            This section will integrate <code>Locations Policies</code>
                          </span>
                          <div className="kt-separator kt-separator--dashed"/>
                        </div>
                    </div>
                    {/* Single Line Settings */}
                    <SingleLineSettings />
                    <Divider />
                    {/* Multi Line Settings */}
                    <MultiLineSettings />
                    <Divider />
                    {/* Date Settings */}
                    <DateSettings />
                    <Divider />
                    {/* Date Time Settings */}
                    <DateTimeSettings />
                    <Divider />
                    {/* DropDown Settings */}
                    <DropDownSettings />
                    <Divider />
                    {/* Radio Buttons Settings */}
                    <RadioButtonsSettings />
                    <Divider />
                    {/* Checkboxes Settings */}
                    <CheckboxesSettings />
                    <Divider />
                    {/* FileUpload Settings */}
                    <FileUploadSettings />
                    <Divider />

                    {/* Single Line */}
                    <div className="custom-field-preview-wrapper">
                      <TextField
                        className="custom-field-preview-wrapper__single-line"
                        label="Single Line"
                        value=""
                        type="text"
                        margin="normal"
                      />
                      <DeleteIcon className="custom-field-preview-wrapper__delete-icon"/>
                    </div>
                    {/* Multi Line */}
                    <div className="custom-field-preview-wrapper">
                      <TextField
                        className="custom-field-preview-wrapper__multi-line"
                        label="Multiline"
                        multiline
                        rows="4"
                        defaultValue=""
                        margin="normal"
                      />
                      <DeleteIcon className="custom-field-preview-wrapper__delete-icon"/>
                    </div>
                    {/* Date */}
                    <div className="custom-field-preview-wrapper">
                      <TextField
                        className="custom-field-preview-wrapper__date"
                        label="Date"
                        type="date"
                        defaultValue=""
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      <DeleteIcon className="custom-field-preview-wrapper__delete-icon"/>
                    </div>
                    {/* Date Time */}
                    <div className="custom-field-preview-wrapper">
                      <TextField
                        className="custom-field-preview-wrapper__date-time"
                        label="Date Time"
                        type="datetime-local"
                        defaultValue=""
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      <DeleteIcon className="custom-field-preview-wrapper__delete-icon"/>
                    </div>
                    {/* Drop Down */}
                    <div className="custom-field-preview-wrapper">
                      <FormControl className="custom-field-preview-wrapper__drop-down">
                        <InputLabel htmlFor="age-simple">Drop Down</InputLabel>
                        <Select
                          value={values.age}
                          onChange={handleChange}
                          inputProps={{
                            name: 'age',
                            id: 'age-simple',
                          }}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          <MenuItem value={10}>Option 1</MenuItem>
                          <MenuItem value={20}>Option 2</MenuItem>
                          <MenuItem value={30}>Option 3</MenuItem>
                        </Select>
                      </FormControl>
                      <DeleteIcon className="custom-field-preview-wrapper__delete-icon"/>
                    </div>
                    {/* Radio Buttons */}
                    <div className="custom-field-preview-wrapper">
                      <FormControl component="fieldset">
                        <FormLabel component="legend">Radio Buttons</FormLabel>
                        <RadioGroup
                          aria-label="Gender"
                          name="gender1"
                          value="rad2"
                          onChange={(e) => console.log(e.target.value)}
                        >
                          <FormControlLabel value="rad1" control={<Radio />} label="Radio 1" />
                          <FormControlLabel value="rad2" control={<Radio />} label="Radio 2" />
                          <FormControlLabel value="rad3" control={<Radio />} label="Radio 3" />
                        </RadioGroup>
                      </FormControl>
                      <DeleteIcon className="custom-field-preview-wrapper__delete-icon"/>
                    </div>
                    {/* Checkboxes */}
                    <div className="custom-field-preview-wrapper">
                      <FormControl component="fieldset">
                        <FormLabel component="legend">Checkboxes</FormLabel>
                        <FormGroup>
                          <FormControlLabel
                            control={<Checkbox checked={true} onChange={handleChange('gilad')} value="gilad" />}
                            label="Checkbox 1"
                          />
                          <FormControlLabel
                            control={<Checkbox checked={false} onChange={handleChange('jason')} value="jason" />}
                            label="Checkbox 2"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox checked={true} onChange={handleChange('antoine')} value="antoine" />
                            }
                            label="Checkbox 2"
                          />
                        </FormGroup>
                      </FormControl>
                      <DeleteIcon className="custom-field-preview-wrapper__delete-icon"/>
                    </div>
                    {/* File Upload */}
                    <div className="custom-field-preview-wrapper">
                      <FormControl component="fieldset">
                        <FormLabel component="legend">File Upload</FormLabel>
                        <FormGroup>
                          <input type="file" name="myImage" />
                        </FormGroup>
                      </FormControl>
                      <DeleteIcon className="custom-field-preview-wrapper__delete-icon"/>
                    </div>
                    {/* Divider */}
                    <div style={{width: '500px', height: '2px', backgroundColor: 'black'}} />
                    {/* Custom Fileds Preview Functional */}
                    <SingleLine />
                    <MultiLine />
                    <Date />
                    <DateTime />
                    <DropDown />
                    <RadioButtons />
                    <Checkboxes />
                    <FileUpload />
                  </div>
                </PortletBody>
              )}

              {tab === 3 && (
                <PortletBody>
                  <div className="kt-section kt-margin-t-0">
                    <div className="kt-section__body">
                      <div className="kt-section">
                          <span className="kt-section__sub">
                            This section will integrate <code>Locations Settings</code>
                          </span>
                          <div className="kt-separator kt-separator--dashed"/>
                        </div>
                    </div>
                  </div>
                </PortletBody>
              )}

              <PortletFooter>
                <div className="kt-padding-30 text-center">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    style={loadingButtonPreviewStyle}
                    className={`btn btn-primary btn-elevate kt-login__btn-primary ${clsx(
                      {
                        "kt-spinner kt-spinner--right kt-spinner--md kt-spinner--light": loadingPreview
                      }
                    )}`}
                  >
                    <i className="la la-eye" /> Preview
                  </button>{" "}
                  <button
                    type="button"
                    onClick={handleReset}
                    style={loadingButtonResetStyle}
                    className={`btn btn-secondary btn-elevate kt-login__btn-primary ${clsx(
                      {
                        "kt-spinner kt-spinner--right kt-spinner--md kt-spinner--dark": loadingReset
                      }
                    )}`}
                  >
                    <i className="la la-recycle" /> Reset
                  </button>
                </div>
              </PortletFooter>
            </Portlet>

          </div>
        )}
      </Formik>
    </>
  );
}


