import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import ImageMarker from 'react-image-marker';
import SwipeableViews from 'react-swipeable-views';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputLabel,
  makeStyles,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
  useTheme,
  withStyles
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import RoomIcon from '@material-ui/icons/Room';
import CloseIcon from '@material-ui/icons/Close';
import { actions } from '../../../../store/ducks/general.duck';
import {  
  PortletBody,
  PortletHeader,
  PortletHeaderToolbar
} from '../../../../partials/content/Portlet';
import { getOneDB, postDB, updateDB } from '../../../../crud/api';
import { CustomFieldsPreview } from '../../constants';
import { getFileExtension, getImageURL, saveImage, verifyCustomFields } from '../../utils';
import { executePolicies, executeOnLoadPolicy } from '../../Components/Policies/utils';
import { usePolicies } from '../../Components/Policies/hooks';
import GoogleMaps from '../../Components/GoogleMaps';
import ImageUpload from '../../Components/ImageUpload';
import './ModalLocationList.scss';

const localStorageActiveTabKey = 'builderActiveTab';

const DialogActions5 = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(1)
  }
}))(DialogActions);

const DialogContent5 = withStyles(theme => ({
  root: {
    padding: theme.spacing(2)
  }
}))(DialogContent);

const DialogTitle5 = withStyles(styles5)(props => {
  const { children, classes, onClose } = props;
  return (
    <DialogTitle
      disableTypography
      className={classes.root}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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

const styles5 = theme => ({
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

const TabContainer4 = ({ children, dir }) => {
  return (
    <Typography component='div' dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
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
  },
  button: {
    margin: theme.spacing(1)
  },
  leftIcon: {
    marginRight: theme.spacing(1)
  },
  rightIcon: {
    marginLeft: theme.spacing(1)
  },
  iconSmall: {
    fontSize: 20
  }
}));

const useStyles4 = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    minWidth: 1000
  }
}));

const ModalLocationList = ({
  dataFromParent,
  editOrNew,
  imageLayout,
  modalId,
  parent,
  parentExt,
  policies,
  profile,
  realParent,
  reload,
  setParentSelected,
  setShowModal,
  showModal
}) => {
  const dispatch = useDispatch();
  const [image, setImage] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [modalCoords, setModalCoords] = useState([]);
  const [modalMapZoom, setModalMapZoom] = useState(6);
  const [profileLabel, setProfileLabel] = useState('');
  const [tab, setTab] = useState(activeTab ? +activeTab : 0);
  const [tabs, setTabs] = useState([]);
  const theme4 = useTheme();
  const { showCustomAlert, showErrorAlert, showSavedAlert, showUpdatedAlert, showFillFieldsAlert } = actions;
  const [value4, setValue4] = useState(0);
  const [values, setValues] = useState({
    categoryPic: '/media/misc/placeholder-image.jpg',
    categoryPicDefault: '/media/misc/placeholder-image.jpg',
    customFieldsTab: {},
    name: '',
    profileName: '',
    profileId: '',
    profileLevel: '',
    parent: ''
  });
  const [customFieldsPathResponse, setCustomFieldsPathResponse] = useState();

  const defaultCoords = {
    lat: 19.432608,
    lng: -99.133209 
  }
  const activeTab = localStorage.getItem(localStorageActiveTabKey);
  const classes = useStyles();
  const classes4 = useStyles4();

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleChange4 = (event, newValue) => {
    setValue4(newValue);
  }

  const handleChangeIndex4 = (index) => {
    setValue4(index);
  }

  const handleCloseModal = () => {
    setValues({
      categoryPic: '/media/misc/placeholder-image.jpg',
      categoryPicDefault: '/media/misc/placeholder-image.jpg',
      imageURL: '',
      name: '',
      profileId: '',
      profileLevel: '',
      profileName: '',
      parent: '',
      customFieldsTab: {}
    });
    setImage(null);
    setMapCenter(null);
    setMarkers([]);
    setModalCoords([]);
    setModalMapZoom(6);
    setValue4(0);
    setShowModal(false);
  };

  const handleSave = () => {
    if(!values.name){
      dispatch(
        showCustomAlert({
          open: true,
          message: 'Please fill the "Name" field',
          type: 'warning'
        })
      );
      return;
    }

    if (!verifyCustomFields(values.customFieldsTab)) {
      dispatch(showFillFieldsAlert());
      return;
    }

    const fileExt = getFileExtension(image);
    const body = {
      ...values,
      fileExt,
      mapInfo: (Object.keys(modalCoords).length > 0) ? { lat: modalCoords[0].lat, lng: modalCoords[0].lng, zoom: modalMapZoom } : null,
      imageInfo: markers.length ? { top: markers[0].top, left: markers[0].left } : null
    };
    if (editOrNew === 'new') {
      body.parent = parent;
      postDB('locationsReal', body)
        .then((response) => response.json())
        .then((data) => {
          dispatch(showSavedAlert());
          const { _id } = data.response[0];
          saveAndReload('locationsReal', _id);
          executePolicies('OnAdd', 'locations', 'list', policies);
        })
        .catch(error => dispatch(showErrorAlert()));
    } else {
      body.parent = realParent;
      updateDB('locationsReal/', body, parent)
        .then((response) => {
          dispatch(showUpdatedAlert());
          saveAndReload('locationsReal', parent);
          executePolicies('OnEdit', 'locations', 'list', policies);
        })
        .catch(error => dispatch(showErrorAlert()));
    }
    setModalMapZoom(modalMapZoom);
    handleCloseModal();
  };

  const handlePinDelete = () => {
    setModalCoords([{}]);
    setModalMapZoom(null);
  }

  const handleUpdateCustomFields = (tab, id, colIndex, CFValues) => {
    const colValue = ['left', 'right'];
    const customFieldsTabTmp = { ...values.customFieldsTab };
    const field = customFieldsTabTmp[tab][colValue[colIndex]]
      .find((cf) => cf.id === id);
    field.values = CFValues;
  };

  const saveAndReload = (folderName, id) => {
    saveImage(image, folderName, id);
    reload();
  };

  useEffect(() => {
    if (!profile || !profile.id || editOrNew === 'edit' || !showModal) {
      return;
    }
    getOneDB('locations/', profile.id)
      .then((response) => response.json())
      .then((data) => {
        const {
          _id: profileId,
          name: profileName,
          level: profileLevel,
          customFieldsTab
        } = data.response;
        setValues((prev) => ({ ...prev, name: '', profileName, profileId, profileLevel, customFieldsTab }));
        setProfileLabel(profile.name);
        const tabs = Object.keys(customFieldsTab).map((key) => ({
          key,
          info: customFieldsTab[key].info,
          content: [customFieldsTab[key].left, customFieldsTab[key].right]
        }));
        setTabs(tabs);
        setValue4(0);
      })
      .catch(error => dispatch(showErrorAlert()));
    getOneDB('locationsReal/', parent)
      .then((response) => response.json())
      .then((data) => {
        const fileExt = data.response?.fileExt;
        const imageURL = parent !== "root" ? getImageURL(parent, 'locationsReal', fileExt) : '';
        setValues((prev) => ({ ...prev, imageURL }));
      })
      .catch(error => dispatch(showErrorAlert()));
  }, [showModal]);

  useEffect(() => {
    if (editOrNew !== 'edit' || !showModal) {
      return;
    }
    getOneDB('locationsReal/', parent)
      .then((response) => response.json())
      .then(async(data) => {
        const {
          _id,
          customFieldsTab,
          fileExt,
          imageInfo,
          mapInfo,
          name,
          profileId,
          profileLevel,
          profileName
        } = data.response;
        const imageURL = realParent !== "root" ? getImageURL(realParent, 'locationsReal', parentExt) : '';
        const onLoadResponse = await executeOnLoadPolicy(profileId, 'locations', 'list', policies);
        setCustomFieldsPathResponse(onLoadResponse);
        setValues({ ...values, name, profileId, profileLevel, profileName, customFieldsTab, imageURL });
        setMarkers(imageInfo !== null ? mapInfo ? [{ top: imageInfo.top, left: imageInfo.left }] :[] : []);
        setMapCenter(mapInfo ? { lat: mapInfo.lat, lng: mapInfo.lng } : defaultCoords);
        setModalCoords([mapInfo ? { lat: mapInfo.lat, lng: mapInfo.lng }: []]);
        setModalMapZoom(mapInfo ? mapInfo.zoom : 6);
        setProfileLabel(profileName);
        const tabs = Object.keys(customFieldsTab).map((key) => ({
          key,
          info: customFieldsTab[key].info,
          content: [customFieldsTab[key].left, customFieldsTab[key].right]
        }));
        setTabs(tabs);
        setValue4(0);
      })
      .catch(error => dispatch(showErrorAlert()));
  }, [showModal]);

  const MapGoogle = (centerCoords) => (
    <GoogleMaps
      center={centerCoords}
      coords={modalCoords}
      edit
      setCoords={setModalCoords}
      setZoom={setModalMapZoom}
      styleMap={{ marginRight: '20px', width: '95%', height: '63%' }}
      zoom={modalMapZoom}
    />
  );

  return (
    <div style={{ width: '1000px' }}>
      <Dialog
        aria-labelledby='customized-dialog-title'
        onClose={handleCloseModal}
        open={showModal}
      >
        <DialogTitle5
          id='customized-dialog-title'
          onClose={handleCloseModal}
        >
          {`${editOrNew === 'new' ? 'Add' : 'Edit'} Location`}
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
                  <Tab label={profileLabel} />
                  {tabs.map((tab) => <Tab label={tab.info.name} />)}
                </Tabs>
              </Paper>
              <SwipeableViews
                axis={theme4.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={value4}
                onChangeIndex={handleChangeIndex4}
                style={{ overflowY: 'hidden' }}
              >
                <TabContainer4 dir={theme4.direction}>
                  <div className='profile-tab-wrapper'>
                    <div className='profile-tab-wrapper__content'>
                      <InputLabel>{`Selected Level: ${values.profileLevel}`}</InputLabel>
                      <TextField
                        className={classes.textField}
                        id='standard-name'
                        label='Name'
                        margin='normal'
                        onChange={handleChange('name')}
                        value={values.name}
                      />
                    </div>
                  </div>
                  <PortletHeader
                    toolbar={
                      <PortletHeaderToolbar>
                        <Tabs
                          className='builder-tabs'
                          component='div'
                          indicatorColor='primary'
                          onChange={(_, nextTab) => {
                            setTab(nextTab);
                            localStorage.setItem(localStorageActiveTabKey, nextTab);
                          }}
                          textColor='primary'
                          value={tab}
                          variant='fullWidth'
                        >
                          <Tab label='Pin Map' />
                          <Tab label='Pin Layout' />
                          <Tab label='Layout' />
                        </Tabs>
                      </PortletHeaderToolbar>
                    }
                  />
                  {tab === 0 && (
                    <PortletBody>
                      <div className='container-map-delete-modal-location-list'>
                        <div className='container-delete-modal-location-list'>
                          <Button
                            className={classes.button}
                            color='secondary'
                            onClick={() => handlePinDelete()}
                            variant='contained'
                          >
                            Delete PIN
                            <DeleteIcon className={classes.rightIcon} />
                          </Button>
                        </div>
                        <div className='container-map-view-modal-location-list'>
                          {(mapCenter && editOrNew === 'edit') && MapGoogle(mapCenter)}
                          {editOrNew === 'new' && MapGoogle({ lat: 19.432608, lng:  -99.133209 })}
                        </div>
                      </div>
                    </PortletBody>
                  )}
                  {tab === 1 && (
                    <PortletBody style={{ display: 'flex', justifyContent: 'center' }}>
                      <div
                        style={{ paddingTop: '20px', width: '500px' }}
                      >
                        <ImageMarker
                          markerComponent={() => <RoomIcon style={{ color: 'red' }} />}
                          markers={markers}
                          onAddMarker={(marker) => { setMarkers([marker]) }}
                          src={values.imageURL === '' || !values.imageURL ? values.categoryPicDefault : values.imageURL}
                        />
                      </div>
                    </PortletBody>
                  )}
                  {tab === 2 && (
                    <PortletBody style={{ paddingTop: '20px' }}>
                      <div className='profile-tab-wrapper'>
                        <ImageUpload
                          image={editOrNew === 'edit' ? imageLayout : ''}
                          setImage={setImage}
                        >
                          Sketch Layout
                          </ImageUpload>
                      </div>
                    </PortletBody>
                  )}
                </TabContainer4>
                {tabs.map((tab) => (
                  <TabContainer4 dir={theme4.direction}>
                    <div className='modal-location'>
                      {Array(tab.content[1].length === 0 ? 1 : 2).fill(0).map((col, colIndex) => (
                        <div className='modal-location__list-field'>
                          {tab.content[colIndex].map((customField) => (
                            <CustomFieldsPreview
                              columnIndex={colIndex}
                              customFieldsPathResponse={customFieldsPathResponse}
                              data={tab.content[colIndex]}
                              from='form'
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
          <Button onClick={handleSave} color='primary'>
            Save changes
          </Button>
        </DialogActions5>
      </Dialog>
    </div>
  )
};

export default ModalLocationList;
