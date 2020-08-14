/* eslint-disable no-restricted-imports */
import React, { useState, useEffect } from 'react';
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
  Typography
} from "@material-ui/core";
import {
  withStyles,
  useTheme,
  makeStyles
} from "@material-ui/core/styles";
import SwipeableViews from "react-swipeable-views";
import CloseIcon from "@material-ui/icons/Close";
import CustomFields from '../../Components/CustomFields/CustomFields';

// import './ModalAssetCategories.scss';
import ImageUpload from '../../Components/ImageUpload';
import { postDB, getOneDB, updateDB, postFILE } from '../../../../crud/api';
import ModalYesNo from '../../Components/ModalYesNo';
import Permission from '../components/Permission';


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

const ModalEmployeeProfiles = ({ showModal, setShowModal, reloadTable, id }) => {
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
    categoryPic: '/media/misc/placeholder-image.jpg',
    categoryPicDefault: '/media/misc/placeholder-image.jpg'
  });
  // const [categoryPic, setCategoryPic] 

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleSave = () => {
    const fileExt = getFileExtension(image);
    const body = { ...values, customFieldsTab, isAssetRepository, fileExt };
    if (!id) {
      postDB('employeeProfiles', body)
        .then(data => data.json())
        .then(response => {
          const { _id } = response.response[0];
          saveAndReload('employeeProfiles', _id);
        })
        .catch(error => console.log(error));
    } else {
      updateDB('employeeProfiles/', body, id[0])
        .then(data => data.json())
        .then(response => {
          saveAndReload('employeeProfiles', id);
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
    debugger;
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

  // const test = () => {
  //   var myHeaders = new Headers();
  //   myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYWIzZTg3NjAzOGRjNTZkMDg4NzdjMyIsInR5cGUiOiJkZXZlbG9wZXIiLCJlbWFpbCI6ImFAYS5teCIsImlhdCI6MTU5NzIwNTE3NywiZXhwIjoxNjA1ODQ1MTc3fQ.w29W5N9a9jTilzIJp-5xyD_h7ndq5Mqm937h0ipgCkY");

  //   var formdata = new FormData();
  //   formdata.append("file", image, "User.png");

  //   var requestOptions = {
  //     method: 'POST',
  //     headers: myHeaders,
  //     body: formdata,
  //     redirect: 'follow'
  //   };

  //   fetch("http://localhost:3001/api/v1/upload/aapp2021", requestOptions)
  //     .then(response => response.text())
  //     .then(result => console.log('File succs>>>>>>>', result))
  //     .catch(error => console.log('File error>>>>>>>', error));
  // };

  const handleCloseModal = () => {
    setCustomFieldsTab({});
    setProfilePermissions([]);
    setValues({ 
      name: "",
      categoryPic: '/media/misc/placeholder-image.jpg',
      categoryPicDefault: '/media/misc/placeholder-image.jpg'
    });
    setShowModal(false);
    setValue4(0);
    setIsAssetRepository(false);
  };

  useEffect(() => {
    if(!id || !Array.isArray(id)) {
      return;
    }
      
    getOneDB('employeeProfiles/', id[0])
      .then(response => response.json())
      .then(data => { 
        const { name, depreciation, customFieldsTab, profilePermissions, isAssetRepository } = data.response;
        const obj = { name, depreciation };
        setValues(obj);
        setCustomFieldsTab(customFieldsTab);
        setIsAssetRepository(isAssetRepository);
        setProfilePermissions(profilePermissions);
      })
      .catch(error => console.log(error));
  }, [id]);

  const [customFieldsTab, setCustomFieldsTab] = useState({});

  const modules = [
    {key:'dashboard', name: 'Dashboard'},
    {key:'assets', name: 'Assets'},
    {key:'processes', name: 'Processes'},
    {key:'users', name: 'Users'},
    {key:'employees', name: 'Employees'},
    {key:'locations', name: 'Locations'},
    {key:'reports', name: 'Reports'},
    {key:'settings', name: 'Settings'},
  ];

  const [profilePermissions, setProfilePermissions] = useState({});
  const [isAssetRepository, setIsAssetRepository] = useState(false);

  const handleSetPermissions = (key, checked) => {
    setProfilePermissions(prev => ({ ...prev, [key]: checked }));
  }

  const [image, setImage] = useState(null);

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
          {`${id ? 'Edit' : 'Add' } Employee Profiles`}
          {/* Add/Edit User Profiles */}
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
                  <Tab label="Profile" />
                  {/* <Tab label="Permissions" /> */}
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
                    <ImageUpload setImage={setImage}>
                      Employee Profile Photo
                    </ImageUpload>
                    <div className="profile-tab-wrapper__content">
                      <TextField
                        id="standard-name"
                        label="Name"
                        className={classes.textField}
                        value={values.name}
                        onChange={handleChange("name")}
                        margin="normal"
                      />
                      <FormControlLabel
                        value="start"
                        control={<Switch color="primary" checked={isAssetRepository} onChange={e => setIsAssetRepository(e.target.checked)}/>}
                        label="Asset Repository"
                        labelPlacement="start"
                      />
                    </div>
                  </div>
                </TabContainer4>
                {/* <TabContainer4 dir={theme4.direction}>
                  <div style={{ display:'flex', flexWrap:'wrap', justifyContent: 'space-around', padding: '0 20px' }}>
                    {modules.map((module, index) => {
                      return <Permission
                                originalChecked={profilePermissions}
                                key={module.key}
                                id={module.key}
                                title={module.name}
                                setPermissions={handleSetPermissions}
                              />
                    })}
                  </div>
                </TabContainer4> */}
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

export default ModalEmployeeProfiles;
