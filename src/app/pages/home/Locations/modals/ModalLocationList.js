import React, { useState, useEffect } from 'react';
import { Label } from 'reactstrap';
import ImageMarker from 'react-image-marker';
import SwipeableViews from 'react-swipeable-views';
import {
  AppBar,
  Badge,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  InputLabel,
  Paper,
  Switch,
  Tab, 
  Tabs, 
  TextField,
  Typography,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import RoomIcon from '@material-ui/icons/Room';
import {
  makeStyles,
  useTheme,
  withStyles
} from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import {
  Portlet,
  PortletBody,
  PortletFooter,
  PortletHeader,
  PortletHeaderToolbar
} from '../../../../partials/content/Portlet';
import { getOneDB, postDB, updateDB } from '../../../../crud/api';
import {
  Checkboxes,
  Date,
  DateTime,
  DropDown,
  FileUpload,
  MultiLine,
  RadioButtons,
  SingleLine
} from '../../Components/CustomFields/CustomFieldsPreview';
import { getFileExtension, getImageURL, saveImage } from '../../utils';
import GoogleMaps from '../../Components/GoogleMaps';
import ImageUpload from '../../Components/ImageUpload';
import { TabsTitles } from '../../Components/Translations/tabsTitles';
import './ModalLocationList.scss';

const localStorageActiveTabKey = 'builderActiveTab';

const CustomFieldsPreview = (props) => {
  const customFieldsPreviewObj = {
    checkboxes: <Checkboxes { ...props } />,
    date: <Date { ...props } />,
    dateTime: <DateTime { ...props } />,
    dropDown: <DropDown { ...props } />,
    fileUpload: <FileUpload { ...props } />,
    multiLine: <MultiLine { ...props } />,
    radioButtons: <RadioButtons { ...props } />,
    singleLine: <SingleLine { ...props } />
  };
  return customFieldsPreviewObj[props.type];
};

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
      style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
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

// Example 5 - Modal
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

// Example 4 - Tabs
const TabContainer4 = ({ children, dir }) => {
  return (
    <Typography component='div' dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

// Example 1 - TextField
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
    margin: theme.spacing(1),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
  iconSmall: {
    fontSize: 20,
  },
}));

const useStyles4 = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    minWidth: 1000,
  }
}));

// Example 5 - Tabs
const useStyles5 = makeStyles({
  root: {
    flexGrow: 1
  }
});

const ModalLocationList = ({ editOrNew, modalId, parent, parentExt, profile, realParent, reload, setParentSelected, setShowModal, showModal }) => {

  const activeTab = localStorage.getItem(localStorageActiveTabKey);
  const classes = useStyles();
  const classes4 = useStyles4();
  const containerStyle = {
    border: '5px dashed green',
    position: 'relative',  
    minWidth: '200px',
    minHeight: '200px'
  }
  const [image, setImage] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [modalCoords, setModalCoords] = useState([{lat: 19.432608, lng:  -99.133209}]);
  const [modalMapZoom, setModalMapZoom] = useState(12);
  const [pinMarker, setPinMarker] = useState([])
  const [profileLabel, setProfileLabel] = useState('');
  const [showImage, setShowImage] = useState(null)
  const style = {
    border: '5px solid blue',
    minWidth: '200px',
    minHeight: '200px'
  }
  const [tab, setTab] = useState(activeTab ? +activeTab : 0);
  const [tabs, setTabs] = useState([]);
  const theme4 = useTheme();
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

  // const CustomMarker = (MarkerComponentProps) => {
  //   return (
  //       <RoomIcon style={{color: 'red'}}/>
  //   )
  // }

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleChange4 =(event, newValue) => {
    setValue4(newValue);
  }

  const handleChangeIndex4 =(index) => {
    setValue4(index);
  }

  const handleCloseModal = () => {
    setImage(null);
    setMapCenter(null)
    setMarkers([]);
    setModalCoords([])
    setModalMapZoom(12)
    setParentSelected('root');
    setShowModal(false);
    setValue4(0);
    setValues({ 
      categoryPic: '/media/misc/placeholder-image.jpg',
      categoryPicDefault: '/media/misc/placeholder-image.jpg',
      name: '', 
      profileId: '', 
      profileLevel: '', 
      profileName: '',
      parent: '', 
      customFieldsTab: {} 
    });
  };

  const handleSave = () => {
    const fileExt = getFileExtension(image);
    // if(modalMapZoom !== null){
    //   body = {
    //     ...values, 
    //     fileExt,
    //     mapInfo: {lat: modalCoords[0].lat, lng: modalCoords[0].lng, zoom: modalMapZoom},
    //     pinMarker: {top: markers[0].top, left: markers[0].left}
    //   };
    // }else{
    //   body = {
    //   ...values, 
    //   fileExt,
    //   mapInfo: null
    // };
  // }
    debugger
    const body = {
          ...values, 
          fileExt,
          mapInfo: modalMapZoom !== null ? {lat: modalCoords[0].lat, lng: modalCoords[0].lng, zoom: modalMapZoom} : null,
          imageInfo: markers.lenght ? {top: markers[0].top, left: markers[0].left} : null
    }
    if (editOrNew === 'new') {
      body.parent = parent;
      postDB('locationsReal', body)
      .then(response => response.json())
      .then(data => {
        const { _id } = data.response;
        saveAndReload('locationsReal', _id);
        reload()
      })
        .catch(error => console.log(error));
      } else {
        body.parent = realParent;
        updateDB('locationsReal/', body, parent)
        .then(response => {
          saveAndReload('locationsReal', parent);
          reload()
        })
        .catch(error => console.log(error));
      }
      setModalMapZoom(modalMapZoom)
      handleCloseModal();
    };

  const handlePinDelete = () => {
    setModalCoords([{}])
    setModalMapZoom(null)
  }
    
    // Function to update customFields
  const handleUpdateCustomFields = (tab, id, colIndex, CFValues) => {
    const colValue = ['left', 'right'];
    const customFieldsTabTmp = { ...values.customFieldsTab };
    const field = customFieldsTabTmp[tab][colValue[colIndex]]
    .find(cf => cf.id === id);
    field.values = CFValues;
  };

  const saveAndReload = (folderName, id) => {
    saveImage(image, folderName, id);
  };

  useEffect(() => {
    if(!profile || !profile.id || editOrNew === 'edit') return;
    getOneDB('locations/', profile.id)
      .then(response => response.json())
      .then(data => { 
        const { _id: profileId, name: profileName, level: profileLevel, customFieldsTab } = data.response;
        setValues({ ...values, name:'', profileName, profileId, profileLevel, customFieldsTab });
        setProfileLabel(profile.name);
        const tabs = Object.keys(customFieldsTab).map(key => ({ key, info: customFieldsTab[key].info, content: [customFieldsTab[key].left, customFieldsTab[key].right] }));
        setTabs(tabs);
        setValue4(0);
      })
      .catch(error => console.log(error));
  }, [profile.id, editOrNew]);

  useEffect(() => {
    if(editOrNew !== 'edit') return;
    getOneDB('locationsReal/', parent)
    .then(response => response.json())
    .then(data => { 
      const { _id, name, imageInfo, profileId, profileLevel, profileName, customFieldsTab, mapInfo, fileExt } = data.response;      
      const imageURL = getImageURL(realParent, 'locationsReal', parentExt);
      setValues({ ...values, name, profileId, profileLevel, profileName, customFieldsTab, imageURL });
      setMarkers(imageInfo !== null ? [{top: imageInfo.top, left: imageInfo.left}] : [])
      setMapCenter({lat: mapInfo.lat, lng: mapInfo.lng})
      setModalCoords([{lat: mapInfo.lat, lng: mapInfo.lng}])
      setModalMapZoom(mapInfo.zoom)
      setProfileLabel(profileName);
      const tabs = Object.keys(customFieldsTab).map(key => ({ key, info: customFieldsTab[key].info, content: [customFieldsTab[key].left, customFieldsTab[key].right] }));
      setTabs(tabs);
      setValue4(0);
    })
    .catch(error => console.log(error));
  }, [editOrNew, parent])

  return (
    <div style={{width:'1000px'}}>
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
          <div className='kt-section__content' style={{margin:'-16px'}}>
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
                  {tabs.map(tab => <Tab label={tab.info.name} />)}
                </Tabs>
              </Paper>
              <SwipeableViews
                axis={theme4.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={value4}
                onChangeIndex={handleChangeIndex4}
                style={{overflowY: 'hidden'}}
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
                          indicatorColor='primary'
                          textColor='primary'
                          variant='fullWidth'
                          component='div'
                          onChange={(_, nextTab) => {
                            setTab(nextTab);
                            localStorage.setItem(localStorageActiveTabKey, nextTab);
                          }}
                          value={tab}
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
                          <GoogleMaps
                            center={mapCenter}
                            coords={modalCoords}
                            edit
                            setCoords={setModalCoords}                
                            setZoom={(newZoom) => setModalMapZoom(newZoom)}
                            styleMap={{marginRight: '20px', width: '95%', height: '63%'}}
                            zoom={modalMapZoom}
                          >
                          </GoogleMaps>
                        </div>
                      </div>
                    </PortletBody>
                  )}
                  {tab === 1 && (
                    <PortletBody style={{display: 'flex', justifyContent: 'center'}}>
                      <div
                        style={{paddingTop: '20px', width: '500px'}}
                      >
                        {/* {/* {values.imageURL && */}
                          <ImageMarker
                            src={values.imageURL}
                            markers={[]}
                            onAddMarker={(marker) => setMarkers([marker])}
                            // markerComponent={(MarkerComponentProps) => CustomMarker(MarkerComponentProps)}
                            markerComponent={() => <RoomIcon style={{color: 'red'}}/>}
                          />
                        }
                      </div>
                    </PortletBody>
                  )}
                  {tab === 2 && (
                    <PortletBody style={{paddingTop: '20px'}}>
                      <div className='profile-tab-wrapper'>
                        <ImageUpload
                          image={values.imageURL}
                          setImage={setImage}
                          >
                           Sketch Layout
                        </ImageUpload>
                      </div>
                    </PortletBody>
                  )}
                </TabContainer4>
                {tabs.map(tab => (
                  <TabContainer4 dir={theme4.direction}>
                  <div className='modal-location'>
                    {Array(tab.content[1].length === 0 ? 1 : 2).fill(0).map((col, colIndex) => (
                      <div className='modal-location__list-field'>
                        {tab.content[colIndex].map(customField => (
                          <CustomFieldsPreview 
                            columnIndex={colIndex}
                          // customFieldIndex={props.customFieldIndex}
                            from='form'
                            id={customField.id}
                            onClick={() => alert(customField.content)}
                            onDelete={() => {}}
                            onSelect={() => {}}
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
