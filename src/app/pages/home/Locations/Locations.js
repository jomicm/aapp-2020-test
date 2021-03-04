import React, { useMemo, useState, useEffect } from 'react';
import clsx from 'clsx';
import ImageMarker from 'react-image-marker';
import SwipeableViews from 'react-swipeable-views';
import { get, merge } from 'lodash';
import { Formik } from 'formik';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { FormHelperText, Switch, Tab, Tabs, Styles } from '@material-ui/core';
import { metronic, initLayoutConfig, LayoutConfig } from '../../../../_metronic';
import {
  Portlet,
  PortletBody,
  PortletFooter,
  PortletHeader,
  PortletHeaderToolbar
} from '../../../partials/content/Portlet';
import CodeExample from '../../../partials/content/CodeExample';
import Notice from '../../../partials/content/Notice';
import { CodeBlock } from '../../../partials/content/CodeExample';
import { getDB, deleteDB } from '../../../crud/api'; 
import {
  Badge,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Toolbar,
  Tooltip,
  Typography
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import DraftsIcon from '@material-ui/icons/Drafts';
import EditIcon from '@material-ui/icons/Edit';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import RemoveIcon from '@material-ui/icons/Remove';
import RoomIcon from '@material-ui/icons/Room';
import SendIcon from '@material-ui/icons/Send';
import StarBorder from '@material-ui/icons/StarBorder';
import {
  lighten,
  makeStyles,
  useTheme,
  withStyles
} from '@material-ui/core/styles';
import { TabsTitles } from '../Components/Translations/tabsTitles';
import GoogleMaps from '../Components/GoogleMaps';
import TableComponent from '../Components/TableComponent';
import TreeView from '../Components/TreeViewComponent';
import ModalLocationList from './modals/ModalLocationList';
import ModalLocationProfiles from './modals/ModalLocationProfiles';
import './Locations.scss';
import {
  Checkboxes,
  CheckboxesSettings,
  Date,
  DateSettings,
  DateTime,
  DateTimeSettings,
  DropDown,
  DropDownSettings,
  FileUpload,
  FileUploadSettings,
  MultiLine,
  MultiLineSettings,
  RadioButtons,
  RadioButtonsSettings,
  SingleLine,
  SingleLineSettings
} from '../Components/CustomFields/CustomFieldsPreview';
import ModalYesNo from '../Components/ModalYesNo';
import { getFileExtension, getImageURL, saveImage } from '../utils';

const Divider = () => <div style={{ width: '100%', height: '3px', backgroundColor: 'black' }}></div>;

let locations;
const localStorageActiveTabKey = 'builderActiveTab';

const locationsTreeData = {
  id: 'root',
  name: 'Locations',
  profileLevel: -1,
  parent: null
};

const Locations = () => {

  const theme4 = useTheme();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [coordinates, setCoordinates] = useState([]);
  const [modalData, setModalData] = useState([])
  const [editOrNew, setEditOrNew] = useState('new');
  const [googleMapsZoom, setGoogleMapsZoom] = useState(6);
  const [id, setId] = useState(null);
  const [imageLayout, setImageLayout] = useState(null);
  const [loadingButtonPreviewStyle, setLoadingButtonPreviewStyle] = useState({
    paddingRight: '2.5rem'
  });
  const [loadingButtonResetStyle, setLoadingButtonResetStyle] = useState({
    paddingRight: '2.5rem'
  });
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [loadingReset, setLoadingReset] = useState(false);
  const [locationsList, setLocationsList] = useState([]);
  const [locationProfileRows, setLocationProfileRows] = useState([]);
  const [locationsTree, setLocationsTree] = useState({});
  const [mapCenter, setMapCenter] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [modalId, setModalId] = useState(null);
  const [parentFileExt, setParentFileExt] = useState(null);
  const [parentSelected, setParentSelected] = useState(null);
  const [profileSelected, setProfileSelected] = useState({});
  const [openListModal, setOpenListModal] = useState(false);
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [openYesNoModal, setOpenYesNoModal] = useState(false);
  const [realParentSelected, setRealParentSelected] = useState(null);
  const [selectedLocationProfileRows, setSelectedLocationProfileRows] = useState([]);
  const [tab, setTab] = useState(activeTab ? +activeTab : 0);
  const [value4, setValue4] = useState(0);
  const { layoutConfig } = useSelector(
    ({ builder }) => ({ layoutConfig: builder.layoutConfig }),
    shallowEqual
  );

  const activeTab = localStorage.getItem(localStorageActiveTabKey);
  const dispatch = useDispatch();
  const initialValues = useMemo(
    () =>
      merge(
        LayoutConfig,
        layoutConfig
      ),
    [layoutConfig]
  );
  const locationActions = {
    openYesNoModal() {
      if (!parentSelected || parentSelected === 'root') return;
      setOpenYesNoModal(true);
    },
    closeYesNoModal() {
      setOpenYesNoModal(false);
    },
    removeLocation() {
      deleteDB('locationsReal/', parentSelected)
      .then((response) => handleLoadLocations())
      .catch((error) => console.log('Error', error));
      setOpenYesNoModal(false);
    },
    openProfilesListBox(e) {
      setEditOrNew('new');
      setAnchorEl(e.currentTarget);
    },
    editLocation() {
      if (!parentSelected || parentSelected === 'root') return;
      setEditOrNew('edit');
      setOpenListModal(true);
    }
  };

  const createLocationProfileRow = (
    id, 
    level, 
    name, 
    creator, 
    creation_date
    ) => {
    return { id, level, name, creator, creation_date };
  };

  const CustomMarker = (MarkerComponentProps) => {
    if (imageLayout !== 'http://localhost:3000/media/misc/placeholder-image.jpg') {
      return (
        <RoomIcon style={{ color: 'red' }}/>
      )
    }else {
      return null;
    }
  }
  
  const enableLoadingPreview = () => {
    setLoadingPreview(true);
    setLoadingButtonPreviewStyle({ paddingRight: '3.5rem' });
  };

  const enableLoadingReset = () => {
    setLoadingReset(true);
    setLoadingButtonResetStyle({ paddingRight: '3.5rem' });
  };

  const updateLayoutConfig = _config => {
    dispatch(metronic.builder.actions.setLayoutConfigs(_config));
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const locHeadRows = [
    { id: 'id', numeric: false, disablePadding: true, label: 'ID' },
    { id: 'level', numeric: true, disablePadding: false, label: 'Level' },
    { id: 'name', numeric: true, disablePadding: false, label: 'Description' },
    { id: 'creator', numeric: true, disablePadding: false, label: 'Creator' },
    { id: 'creation_date', numeric: true, disablePadding: false, label: 'Creation Date' }
  ];

  const locationsHeadRows = [
    { id: 'id', numeric: false, disablePadding: true, label: 'ID' },
    { id: 'level', numeric: true, disablePadding: false, label: 'Level' },
    { id: 'name', numeric: true, disablePadding: false, label: 'Description' },
    { id: 'creator', numeric: true, disablePadding: false, label: 'Creator' },
    { id: 'creation_date', numeric: true, disablePadding: false, label: 'Creation Date' }
  ];

  const locationsRows = [
    createLocationProfileRow('1', '0', 'CDMX', 'Admin', '11/03/2020'),
    createLocationProfileRow('2', '1', 'Monterrey', 'Admin', '11/03/2020'),
    createLocationProfileRow('3', '2', 'Guadalajara', 'Admin', '11/03/2020'),
  ];
  
  const TabContainer4 = ({ children, dir }) => {
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

  const handleChange4 = (event, newValue) => {
    setValue4(newValue);
  }
  const handleChangeIndex4 = (index) => {
    setValue4(index);
  }

  const handleClose = () => {
    setAnchorEl(null);
  }

  const handleOpenLocationListModal = (profile) => {
    handleClose();
    setOpenListModal(true);
    setProfileSelected(profile);
  };

  const onDeleteProfileLocation = (id) => {
    if (!id || !Array.isArray(id)) return;
    id.forEach(_id => {
      deleteDB('locations/', _id)
        .then((response) => console.log('success', response))
        .catch((error) => console.log('Error', error));
    });
    handleLoadLocationProfiles();
  };

  const onEditProfileLocation = (_id) => {
    setId(_id);
    setOpenProfileModal(true);
  };

  const onAddProfileLocation = () => {
    setId(null);
    setOpenProfileModal(true);
  };

  const getImageLayout = (id) => {
    if (id === 'root') { 
      return;
    } else {
      const result = locations.filter((location) =>  location._id === id);
      const image = result.map((coordinate) => coordinate.fileExt);
      if (image[0]) {
        const imageURLLayout = getImageURL(id, 'locationsReal', image[0]);
        setImageLayout(imageURLLayout);
      } else {
        setImageLayout('http://localhost:3000/media/misc/placeholder-image.jpg');
      }
    }
  }

  const getChildren = (id) => {
    if (id === 'root') {
      setCoordinates([]);
    } else { 
      const result = locations.filter((location) =>  location.parent === id);
      const latLng = result.map((coordinate) => coordinate.mapInfo);
      const pinMarker = result.map((pin) => pin.imageInfo).filter((elem) => elem !== null);
      setCoordinates(latLng);
      setMarkers(pinMarker);
    }
  }

  const getSelfCenter = (id) => {
    if (id === 'root') {
      setCoordinates([]);
    } else {
      const result = locations.filter((location) =>  location.id === id);
      const latLngZoom = result.map((coordinate) => coordinate.mapInfo);
      if (latLngZoom[0] === null) {
        setGoogleMapsZoom(6);
      } else {
      setMapCenter({ lat: latLngZoom[0].lat, lng: latLngZoom[0].lng });
      setGoogleMapsZoom(latLngZoom[0].zoom);
      }
    }
  }

  const getParentExt = (idParent) => {
    if (idParent === 'root' || !idParent) return;
    const result = locations.filter((location) =>  location._id === idParent);
    if (result[0].fileExt !== '') {
      const getExt = result[0].fileExt;
      setParentFileExt(getExt);
    } else { 
      return;
    } 
  }

  const constructLocationTreeRecursive = (locs) => {
    if (!locs || !Array.isArray(locs) || !locs.length) return [];
    let res = [];
    locs.forEach((location) => {
      const locObj = (({ 
        _id: id, 
        name, 
        profileLevel, 
        parent, 
        fileExt 
      }) => ({ id, name, profileLevel, parent, fileExt }))(location);
      const children = locations.filter((loc) => loc.parent === locObj.id);
      locObj.children = constructLocationTreeRecursive(children);
      res.push(locObj);
    });
    return res;
  };
  
  const handleLoadLocations = () => {
    setLocationsTree({});
    getDB('locationsReal')
      .then((response) => response.json())
      .then(async (data) => {
        setModalData(data)
        locations = data.response.map((res) => ({ ...res, id: res._id }));
        const homeLocations = data.response.filter((loc) => loc.profileLevel === 0);
        const children = constructLocationTreeRecursive(homeLocations);
        locationsTreeData.children = children;
        setLocationsTree(locationsTreeData);
      })
      .catch((error) => console.log('error>', error));
        const selectedProfileTmp = profileSelected;
        setProfileSelected({});
        setProfileSelected(selectedProfileTmp);
  };
  
  const handleLoadLocationProfiles = () => {
    getDB('locations')
      .then((response) => response.json())
      .then((data) => {
        const profileRows = data.response.map((row) => {
          const { _id, level, name } = row;
          return createLocationProfileRow(_id, level, name, 'Admin', '11/03/2020');
        });
        setLocationProfileRows(profileRows);
        setSelectedLocationProfileRows([]);
      })
      .catch((error) => console.log('error>', error));
  };

  const handleSetProfileLocationFilter = (parent, level, realParent) => {
    const lvl = Number(level) + 1;
    setModalId(parent);
    getChildren(parent);
    getImageLayout(parent);
    getParentExt(realParent);
    getSelfCenter(parent);
    setParentSelected(parent);
    setRealParentSelected(realParent);
    let locationProf = locationProfileRows.filter((row) => row.level == lvl);
    setSelectedLocationProfileRows(locationProf);
  };
  
  useEffect(() => {
    handleLoadLocationProfiles();
    handleLoadLocations();
  }, []);

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
          <div className='kt-form kt-form--label-right'>
            <Portlet>
              <PortletHeader
                toolbar={
                  <PortletHeaderToolbar>
                    <Tabs
                      className='builder-tabs'
                      component='div'
                      onChange={(_, nextTab) => {
                        setTab(nextTab);
                        localStorage.setItem(localStorageActiveTabKey, nextTab);
                      }}
                      value={tab}
                    >
                      {TabsTitles('locations')}
                    </Tabs>
                  </PortletHeaderToolbar>
                }
              />
              {tab === 0 && (
                <PortletBody>
                  <div className='kt-section kt-margin-t-0'>
                    <div className='kt-section__body'>
                      <div className='kt-section'>
                          <span className='kt-section__sub'>
                            This section will integrate <code>Locations Section</code>
                          </span>
                          <ModalLocationList
                            editOrNew={editOrNew}
                            imageLayout={imageLayout}
                            modalId={modalId}
                            dataFromParent={modalData}
                            parent={parentSelected}
                            parentExt={parentFileExt}
                            profile={profileSelected}
                            realParent={realParentSelected}
                            reload={handleLoadLocations}
                            setParentSelected={setParentSelected}
                            setShowModal={setOpenListModal}
                            showModal={openListModal}
                          />
                          <ModalYesNo
                            message={'Are you sure you want to remove this location?'}
                            onCancel={locationActions.closeYesNoModal}
                            onOK={locationActions.removeLocation}
                            showModal={openYesNoModal}
                            title={'Remove Location'}
                          />
                          <div className='kt-separator kt-separator--dashed'/>
                          <div className='kt-section__content'>
                            {/* Insert Tree here */}
                            <div className='locations-list__top'>
                              <div className='locations-list_top-add'>
                                <Menu
                                  anchorEl={anchorEl}
                                  id='simple-menu'
                                  keepMounted
                                  onClose={handleClose}
                                  open={Boolean(anchorEl)}
                                >
                                  { selectedLocationProfileRows.map((locProfile) => (
                                    <MenuItem onClick={() => handleOpenLocationListModal(locProfile)}>{locProfile.name}</MenuItem>
                                  )) }
                                </Menu>
                              </div>
                            </div>
                            <div className='locations-list'>
                              <div className='locations-list__left-content'>
                                <div>
                                  <Tooltip placement='top' title='Add Location'>
                                    <IconButton aria-label='Filter list' onClick={locationActions.openProfilesListBox}>
                                      <AddIcon />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip placement='top' title='Edit Location'>
                                    <IconButton aria-label='Filter list' onClick={locationActions.editLocation}>
                                      <EditIcon />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip placement='top' title='Remove Location'>
                                    <IconButton aria-label='Filter list' onClick={locationActions.openYesNoModal}>
                                      <RemoveIcon />
                                    </IconButton>
                                  </Tooltip>
                                </div>
                                <TreeView data={locationsTree} onClick={handleSetProfileLocationFilter}/>
                              </div>
                              <div className='locations-list__right-content'>
                                <div>
                                  <Paper>
                                    <Tabs
                                      indicatorColor='primary'
                                      onChange={handleChange4}
                                      textColor='primary'
                                      value={value4}
                                      variant='fullWidth'
                                    >
                                      <Tab label='Map View' />
                                      <Tab label='Layout View' />
                                    </Tabs>
                                  </Paper>
                                  <SwipeableViews
                                    axis={'x'}
                                    index={value4}
                                    onChangeIndex={handleChangeIndex4}
                                  >
                                    <TabContainer4 
                                      dir={theme4.direction}
                                    >
                                      <div className='locations-list__map-view'>
                                        <GoogleMaps 
                                          center={mapCenter}
                                          coords={coordinates}
                                          setCoords={({lat, lng}) =>
                                            setCoordinates({ lat, lng })
                                          } 
                                          setZoom={setGoogleMapsZoom}
                                          style={{ width: '100%', height: '500px', position: 'relative' }}
                                          zoom={googleMapsZoom}
                                        />
                                      </div>
                                    </TabContainer4>
                                    <TabContainer4 
                                      dir={theme4.direction}
                                    >
                                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <div style={{ height: '480px', width: '600px' }}>
                                          <ImageMarker
                                            src={imageLayout}
                                            markers={markers}
                                            markerComponent={CustomMarker}
                                          />
                                        </div>
                                      </div>
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
                  <div className='kt-section kt-margin-t-0'>
                    <div className='kt-section__body'>
                      <div className='kt-section'>
                          <span className='kt-section__sub'>
                            This section will integrate <code>Locations/Profile Table</code>
                          </span>
                          <ModalLocationProfiles
                            id={id}
                            reloadTable={handleLoadLocationProfiles}
                            setShowModal={setOpenProfileModal}
                            showModal={openProfileModal}
                          />

                          <div className='kt-separator kt-separator--dashed'/>
                          <div className='kt-section__content'>
                            {/* Insert table here */}
                            <TableComponent
                              headRows={locHeadRows}
                              onAdd={onAddProfileLocation}
                              onEdit={onEditProfileLocation}
                              onDelete={onDeleteProfileLocation}
                              rows={locationProfileRows}
                              title={'Locations Profiles'}
                            />
                          </div>
                        </div>
                    </div>
                  </div>
                </PortletBody>
              )}
              {tab === 2 && (
                <PortletBody>
                  <div className='kt-section kt-margin-t-0'>
                    <div className='kt-section__body'>
                      <div className='kt-section'>
                          <span className='kt-section__sub'>
                            This section will integrate <code>Locations Policies</code>
                          </span>
                          <div className='kt-separator kt-separator--dashed'/>
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
                    <div className='custom-field-preview-wrapper'>
                      <TextField
                        className='custom-field-preview-wrapper__single-line'
                        label='Single Line'
                        margin='normal'
                        type='text'
                        value=''
                      />
                      <DeleteIcon className='custom-field-preview-wrapper__delete-icon'/>
                    </div>
                    {/* Multi Line */}
                    <div className='custom-field-preview-wrapper'>
                      <TextField
                        className='custom-field-preview-wrapper__multi-line'
                        defaultValue=''
                        label='Multiline'
                        margin='normal'
                        multiline
                        rows='4'
                      />
                      <DeleteIcon className='custom-field-preview-wrapper__delete-icon'/>
                    </div>
                    {/* Date */}
                    <div className='custom-field-preview-wrapper'>
                      <TextField
                        className='custom-field-preview-wrapper__date'
                        defaultValue=''
                        InputLabelProps={{
                          shrink: true,
                        }}
                        label='Date'
                        type='date'
                      />
                      <DeleteIcon className='custom-field-preview-wrapper__delete-icon'/>
                    </div>
                    {/* Date Time */}
                    <div className='custom-field-preview-wrapper'>
                      <TextField
                        className='custom-field-preview-wrapper__date-time'
                        defaultValue=''
                        InputLabelProps={{
                          shrink: true,
                        }}
                        label='Date Time'
                        type='datetime-local'
                      />
                      <DeleteIcon className='custom-field-preview-wrapper__delete-icon'/>
                    </div>
                    {/* Drop Down */}
                    <div className='custom-field-preview-wrapper'>
                      <FormControl className='custom-field-preview-wrapper__drop-down'>
                        <InputLabel htmlFor='age-simple'>Drop Down</InputLabel>
                        <Select
                          inputProps={{
                            name: 'age',
                            id: 'age-simple',
                          }}
                          onChange={handleChange}
                          value={values.age}
                        >
                          <MenuItem value=''>
                            <em>None</em>
                          </MenuItem>
                          <MenuItem value={10}>Option 1</MenuItem>
                          <MenuItem value={20}>Option 2</MenuItem>
                          <MenuItem value={30}>Option 3</MenuItem>
                        </Select>
                      </FormControl>
                      <DeleteIcon className='custom-field-preview-wrapper__delete-icon'/>
                    </div>
                    {/* Radio Buttons */}
                    <div className='custom-field-preview-wrapper'>
                      <FormControl component='fieldset'>
                        <FormLabel component='legend'>Radio Buttons</FormLabel>
                        <RadioGroup
                          aria-label='Gender'
                          name='gender1'
                          value='rad2'
                        >
                          <FormControlLabel control={<Radio />} label='Radio 1' value='rad1' />
                          <FormControlLabel control={<Radio />} label='Radio 2' value='rad2' />
                          <FormControlLabel control={<Radio />} label='Radio 3' value='rad3' />
                        </RadioGroup>
                      </FormControl>
                      <DeleteIcon className='custom-field-preview-wrapper__delete-icon'/>
                    </div>
                    {/* Checkboxes */}
                    <div className='custom-field-preview-wrapper'>
                      <FormControl component='fieldset'>
                        <FormLabel component='legend'>Checkboxes</FormLabel>
                        <FormGroup>
                          <FormControlLabel
                            control={<Checkbox checked={true} onChange={handleChange('gilad')} value='gilad' />}
                            label='Checkbox 1'
                          />
                          <FormControlLabel
                            control={<Checkbox checked={false} onChange={handleChange('jason')} value='jason' />}
                            label='Checkbox 2'
                          />
                          <FormControlLabel
                            control={<Checkbox checked={true} onChange={handleChange('antoine')} value='antoine' />}
                            label='Checkbox 2'
                          />
                        </FormGroup>
                      </FormControl>
                      <DeleteIcon className='custom-field-preview-wrapper__delete-icon'/>
                    </div>
                    {/* File Upload */}
                    <div className='custom-field-preview-wrapper'>
                      <FormControl component='fieldset'>
                        <FormLabel component='legend'>File Upload</FormLabel>
                        <FormGroup>
                          <input type='file' name='myImage' />
                        </FormGroup>
                      </FormControl>
                      <DeleteIcon className='custom-field-preview-wrapper__delete-icon'/>
                    </div>
                    <div style={{ width: '500px', height: '2px', backgroundColor: 'black' }} />
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
                  <div className='kt-section kt-margin-t-0'>
                    <div className='kt-section__body'>
                      <div className='kt-section'>
                          <span className='kt-section__sub'>
                            This section will integrate <code>Locations Settings</code>
                          </span>
                          <div className='kt-separator kt-separator--dashed'/>
                        </div>
                    </div>
                  </div>
                </PortletBody>
              )}
              <PortletFooter>
                <div className='kt-padding-30 text-center'>
                  <button
                    className={`btn btn-primary btn-elevate kt-login__btn-primary ${clsx(
                      {
                        'kt-spinner kt-spinner--right kt-spinner--md kt-spinner--light': loadingPreview
                      }
                    )}`}
                    onClick={handleSubmit}
                    style={loadingButtonPreviewStyle}
                    type='button'
                  >
                    <i className='la la-eye' /> Preview
                  </button>
                  <button
                    className={`btn btn-secondary btn-elevate kt-login__btn-primary ${clsx(
                      {
                        'kt-spinner kt-spinner--right kt-spinner--md kt-spinner--dark': loadingReset
                      }
                    )}`}
                    onClick={handleReset}
                    style={loadingButtonResetStyle}
                    type='button'
                  >
                    <i className='la la-recycle' /> Reset
                  </button>
                </div>
              </PortletFooter>
            </Portlet>
          </div>
        )}
      </Formik>
    </>
  );
};

export default Locations;
