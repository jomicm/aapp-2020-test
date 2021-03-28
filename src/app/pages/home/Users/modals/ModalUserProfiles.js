/* eslint-disable no-restricted-imports */
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import SwipeableViews from "react-swipeable-views";
import { isEmpty } from 'lodash';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  makeStyles,
  Paper,
  Tab,
  Tabs,
  Typography,
  useTheme,
  withStyles,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

import { actions } from '../../../../store/ducks/general.duck';
import { postDB, getOneDB, updateDB } from '../../../../crud/api';
import CustomFields from '../../Components/CustomFields/CustomFields';
import BaseFields from '../../Components/BaseFields/BaseFields';
import ImageUpload from '../../Components/ImageUpload';
import { modules } from '../../constants';
import Permission from '../components/Permission';
import { getFileExtension, saveImage, getImageURL } from '../../utils';

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

const ModalUserProfiles = ({ showModal, setShowModal, reloadTable, id }) => {
  const dispatch = useDispatch();
  const { showErrorAlert, showFillFieldsAlert, showSavedAlert, showUpdatedAlert } = actions;
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
    setFormValidation({ ...formValidation, enabled: true });
    if (!isEmpty(formValidation.isValidForm)) {
      dispatch(showFillFieldsAlert());
      return;
    }

    const fileExt = getFileExtension(image);
    const body = { ...values, customFieldsTab, profilePermissions, fileExt };
    if (!id) {
      postDB('userProfiles', body)
        .then(data => data.json())
        .then(response => {
          dispatch(showSavedAlert());
          const { _id } = response.response[0];
          saveAndReload('userProfiles', _id);
        })
        .catch(error => dispatch(showErrorAlert()));
    } else {
      updateDB('userProfiles/', body, id[0])
        .then(response => {
          dispatch(showUpdatedAlert());
          saveAndReload('userProfiles', id[0]);
        })
        .catch(error => dispatch(showErrorAlert()));
    }
    handleCloseModal();
  };

  const [image, setImage] = useState(null);
  const saveAndReload = (folderName, id) => {
    saveImage(image, folderName, id);
    reloadTable();
  };

  const baseFieldsLocalProps = {
    name: {
      componentProps: {
        onChange: handleChange('name')
      }
    },
  };

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
    setFormValidation({
      enabled: false,
      isValidForm: false
    });
  };

  useEffect(() => {
    if (!id || !Array.isArray(id)) {
      return;
    }

    getOneDB('userProfiles/', id[0])
      .then(response => response.json())
      .then(data => {
        const { name, depreciation, customFieldsTab, profilePermissions, fileExt } = data.response;
        const obj = {
          name,
          depreciation,
          imageURL: getImageURL(id, 'userProfiles', fileExt)
        };
        setValues(obj);
        setCustomFieldsTab(customFieldsTab);
        setProfilePermissions(profilePermissions);
      })
      .catch(error => dispatch(showErrorAlert()));
  }, [id]);


  const [customFieldsTab, setCustomFieldsTab] = useState({});

  
  const [formValidation, setFormValidation] = useState({
    enabled: false,
    isValidForm: {}
  });

  const [profilePermissions, setProfilePermissions] = useState({});

  const handleSetPermissions = (key, checked) => {
    setProfilePermissions(prev => ({ ...prev, [key]: checked }));
  }

  return (
    <div style={{ width: '1000px' }}>
      <Dialog
        onClose={handleCloseModal}
        aria-labelledby="customized-dialog-title"
        open={showModal}
      >
        <DialogTitle5
          id="customized-dialog-title"
          onClose={handleCloseModal}
        >
          {`${id ? 'Edit' : 'Add'} User Profiles`}
          {/* Add/Edit User Profiles */}
        </DialogTitle5>
        <DialogContent5 dividers>
          <div className="kt-section__content" style={{ margin: '-16px' }}>
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
                  <Tab label="Permissions" />
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
                    <ImageUpload setImage={setImage} image={values.imageURL}>
                      User Profile Photo
                    </ImageUpload>
                    <div className="profile-tab-wrapper__content">
                      <BaseFields
                        catalogue={'userReferences'}
                        collection={'userReferences'}
                        formState={[formValidation, setFormValidation]}
                        localProps={baseFieldsLocalProps}
                        values={values}
                      />
                    </div>
                  </div>
                </TabContainer4>
                <TabContainer4 dir={theme4.direction}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', padding: '0 20px' }}>
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
                </TabContainer4>
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

export default ModalUserProfiles;
