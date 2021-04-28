import React, { useMemo, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import ImageMarker from 'react-image-marker';
import SwipeableViews from 'react-swipeable-views';
import { utcToZonedTime } from 'date-fns-tz';
import { merge } from 'lodash';
import { Formik } from 'formik';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Tab, Tabs } from '@material-ui/core';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  IconButton,
  InputLabel,
  makeStyles,
  Menu,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import RemoveIcon from '@material-ui/icons/Remove';
import RoomIcon from '@material-ui/icons/Room';
import { actions } from '../../../store/ducks/general.duck';
import { metronic, initLayoutConfig, LayoutConfig } from '../../../../_metronic';
import {
  Portlet,
  PortletBody,
  PortletHeader,
  PortletHeaderToolbar
} from '../../../partials/content/Portlet';
import * as general from '../../../store/ducks/general.duck';
import { getDB } from '../../../crud/api';
import { deleteDB, getDBComplex, getCountDB } from '../../../crud/api';
import { TabsTitles } from '../Components/Translations/tabsTitles';
import GoogleMaps from '../Components/GoogleMaps';
import TableComponent2 from '../Components/TableComponent2';
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
import Policies from '../Components/Policies/Policies';
import { hosts, getImageURL } from '../utils';
import { allBaseFields } from '../constants';

const { apiHost, localHost } = hosts;

const Divider = () => <div style={{ width: '100%', height: '3px', backgroundColor: 'black' }}></div>;

let locations;

const locationsTreeData = {
  id: 'root',
  name: 'Locations',
  profileLevel: -1,
  parent: null
};

const Locations = ({ globalSearch, setGeneralSearch, user }) => {
  const { showCustomAlert, showDeletedAlert, showErrorAlert } = actions;
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
  const [mapCenter, setMapCenter] = useState({ lat: 19.432608, lng: -99.133209 });
  const [markers, setMarkers] = useState([]);
  const [modalId, setModalId] = useState(null);
  const [parentFileExt, setParentFileExt] = useState(null);
  const [parentSelected, setParentSelected] = useState(null);
  const [profileSelected, setProfileSelected] = useState({});
  const [profileSelectedId, setProfileSelectedId] = useState('');
  const [openListModal, setOpenListModal] = useState(false);
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [openYesNoModal, setOpenYesNoModal] = useState(false);
  const [realParentSelected, setRealParentSelected] = useState(null);
  const [selectedLocationProfileRows, setSelectedLocationProfileRows] = useState([]);
  const [tab, setTab] = useState(0);
  const [value4, setValue4] = useState(0);
  const { layoutConfig } = useSelector(
    ({ builder }) => ({ layoutConfig: builder.layoutConfig }),
    shallowEqual
  );

  const policiesBaseFields = {
    list: allBaseFields.locationsList,
    profiles: allBaseFields.locations
  };

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
        .then((response) => {
          dispatch(showDeletedAlert());
          handleLoadLocations();
        })
        .catch((error) => dispatch(showErrorAlert()));
      setOpenYesNoModal(false);
    },
    openProfilesListBox(e) {
      if (!parentSelected) {
        dispatch(
          showCustomAlert({
            open: true,
            message: 'Please select a valid location',
            type: 'warning'
          })
        );
        return;
      }
      setEditOrNew('new');
      setAnchorEl(e.currentTarget);
    },
    editLocation() {
      if (!parentSelected || parentSelected === 'root') {
        dispatch(
          showCustomAlert({
            open: true,
            message: 'Please select a valid location',
            type: 'warning'
          })
        );
        return;
      };
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
    if (imageLayout !== `${localHost}/media/misc/placeholder-image.jpg`) {
      return (
        <RoomIcon style={{ color: 'red' }} />
      )
    } else {
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
    { id: 'level', numeric: true, disablePadding: false, label: 'Level' },
    { id: 'name', numeric: true, disablePadding: false, label: 'Description' },
    { id: 'creator', numeric: true, disablePadding: false, label: 'Creator', searchByDisabled: true },
    { id: 'creation_date', numeric: true, disablePadding: false, label: 'Creation Date', searchByDisabled: true }
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
        .then((response) => {
          dispatch(showDeletedAlert());
          loadLocationsProfilesData();
        })
        .catch((error) => dispatch(showErrorAlert()));
    });
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
      setImageLayout(`${localHost}/media/misc/placeholder-image.jpg`)
    } else {
      const result = locations.filter((location) => location._id === id);
      const image = result.map((coordinate) => coordinate.fileExt);
      if (image[0]) {
        const imageURLLayout = getImageURL(id, 'locationsReal', image[0]);
        setImageLayout(imageURLLayout);
      } else {
        setImageLayout(`${localHost}/media/misc/placeholder-image.jpg`);
      }
    }
  }

  const getChildren = (id) => {
    if (id === 'root') {
      setCoordinates([]);
    } else {
      const result = locations.filter((location) => location.parent === id);
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
      const result = locations.filter((location) => location.id === id);
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
    const result = locations.filter((location) => location._id === idParent);
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

  const [tableControl, setTableControl] = useState({
    locations: {
      collection: 'locations',
      total: 0,
      page: 0,
      rowsPerPage: 5,
      orderBy: 'name',
      order: 1,
      search: '',
      searchBy: '',
    },
  });

  const loadLocationsProfilesData = (collectionNames = ['locations']) => {
    collectionNames = !Array.isArray(collectionNames) ? [collectionNames] : collectionNames;
    collectionNames.forEach(collectionName => {
      let queryLike = '';
      let searchByFiltered = tableControl.locations.searchBy;
      if (tableControl.locations.searchBy && tableControl.locations.searchBy === 'id') {
        searchByFiltered = '_id';
      }
      if (collectionName === 'locations') {
        queryLike = tableControl.locations.searchBy ? (
          [{ key: searchByFiltered, value: tableControl.locations.search }]
        ) : (
          ['level', 'name'].map(key => ({ key, value: tableControl.locations.search }))
        )
      }
      getCountDB({
        collection: collectionName,
        queryLike: tableControl[collectionName].search ? queryLike : null
      })
        .then(response => response.json())
        .then(data => {
          setTableControl(prev => ({
            ...prev,
            [collectionName]: {
              ...prev[collectionName],
              total: data.response.count
            }
          }))
        });

      getDBComplex({
        collection: collectionName,
        limit: tableControl[collectionName].rowsPerPage,
        skip: tableControl[collectionName].rowsPerPage * tableControl[collectionName].page,
        sort: [{ key: tableControl[collectionName].orderBy, value: tableControl[collectionName].order }],
        queryLike: tableControl[collectionName].search ? queryLike : null
      })
        .then(response => response.json())
        .then(data => {
          if (collectionName === 'locations') {
            const profileRows = data.response.map((row) => {
              const { _id, level, name, creationUserFullName, creationDate } = row;
              const date = utcToZonedTime(creationDate).toLocaleString();
              return createLocationProfileRow(_id, level, name, creationUserFullName, date);
            });
            setLocationProfileRows(profileRows);
            setSelectedLocationProfileRows([]);
          }
        })
        .catch(error => console.log('error>', error));
    });
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
    handleLoadLocations();
  }, []);

  useEffect(() => {
    if (anchorEl && !selectedLocationProfileRows.length) {
      dispatch(
        showCustomAlert({
          open: true,
          message: "There aren't more profiles to add",
          type: 'warning'
        })
      );
      setAnchorEl(null);
    }
  }, [anchorEl])

  useEffect(() => {
    loadLocationsProfilesData('locations');
  }, [tableControl.locations.page, tableControl.locations.rowsPerPage, tableControl.locations.order, tableControl.locations.orderBy, tableControl.locations.search, tableControl.locations.locationsFilter]);

  const tabIntToText = ['', 'locations'];

  useEffect(() => {
    if (globalSearch.tabIndex >= 0) {
      setTab(globalSearch.tabIndex);
      setTableControl(prev => ({
        ...prev,
        [tabIntToText[globalSearch.tabIndex]]: {
          ...prev[tabIntToText[globalSearch.tabIndex]],
          search: globalSearch.searchValue,
        }
      }))
      setTimeout(() => {
        setGeneralSearch({});
      }, 800);
    }
  }, [globalSearch.tabIndex, globalSearch.searchValue]);

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
                      onChange={(_, nextTab) => setTab(nextTab)}
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
                        <div className='kt-separator kt-separator--dashed' />
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
                                {selectedLocationProfileRows.map((locProfile) => (
                                  <MenuItem onClick={() => handleOpenLocationListModal(locProfile)}>{locProfile.name}</MenuItem>
                                ))}
                              </Menu>
                            </div>
                          </div>
                          <div className='locations-list'>
                            <div className='locations-list__left-content'>
                              <div>
                                {user.profilePermissions.locations.includes('add') && (
                                  <Tooltip placement='top' title='Add Location'>
                                    <IconButton aria-label='Filter list' onClick={locationActions.openProfilesListBox}>
                                      <AddIcon />
                                    </IconButton>
                                  </Tooltip>                                
                                )}
                                {user.profilePermissions.locations.includes('edit') && (
                                  <Tooltip placement='top' title='Edit Location'>
                                    <IconButton aria-label='Filter list' onClick={locationActions.editLocation}>
                                      <EditIcon />
                                    </IconButton>
                                  </Tooltip>
                                )}
                                {user.profilePermissions.locations.includes('delete') && (
                                  <Tooltip placement='top' title='Remove Location'>
                                    <IconButton aria-label='Filter list' onClick={locationActions.openYesNoModal}>
                                      <RemoveIcon />
                                    </IconButton>
                                  </Tooltip>
                                )}
                              </div>
                              <TreeView data={locationsTree} onClick={handleSetProfileLocationFilter} />
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
                                        setCoords={({ lat, lng }) =>
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
                                          src={imageLayout ? imageLayout : `${localHost}/media/misc/placeholder-image.jpg`}
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
                          reloadTable={loadLocationsProfilesData}
                          setShowModal={setOpenProfileModal}
                          showModal={openProfileModal}
                        />

                        <div className='kt-separator kt-separator--dashed' />
                        <div className='kt-section__content'>
                          <TableComponent2
                            controlValues={tableControl.locations}
                            headRows={locHeadRows}
                            onAdd={onAddProfileLocation}
                            onDelete={onDeleteProfileLocation}
                            onEdit={onEditProfileLocation}
                            onSelect={setProfileSelectedId}
                            paginationControl={({ rowsPerPage, page }) =>
                              setTableControl(prev => ({
                                ...prev,
                                locations: {
                                  ...prev.locations,
                                  rowsPerPage: rowsPerPage,
                                  page: page,
                                }
                              }))
                            }
                            rows={locationProfileRows}
                            searchControl={({ value, field }) => {
                              setTableControl(prev => ({
                                ...prev,
                                locations: {
                                  ...prev.locations,
                                  search: value,
                                  searchBy: field,
                                }
                              }))
                            }}
                            sortByControl={({ orderBy, order }) => {
                              setTableControl(prev => ({
                                ...prev,
                                locations: {
                                  ...prev.locations,
                                  orderBy: orderBy,
                                  order: order,
                                }
                              }))
                            }}
                            title={'Locations Profiles'}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </PortletBody>
              )}
              {tab === 2 && <Policies module="locations" baseFields={policiesBaseFields} />}
              {tab === 3 && (
                <PortletBody>
                  <div className='kt-section kt-margin-t-0'>
                    <div className='kt-section__body'>
                      <div className='kt-section'>
                        <span className='kt-section__sub'>
                          This section will integrate <code>Locations Settings</code>
                        </span>
                        <div className='kt-separator kt-separator--dashed' />
                      </div>
                    </div>
                  </div>
                </PortletBody>
              )}
            </Portlet>
          </div>
        )}
      </Formik>
    </>
  );
};

const mapStateToProps = ({ general: { globalSearch }, auth: { user } }) => ({
  globalSearch,
  user
});
export default connect(mapStateToProps, general.actions)(Locations);
