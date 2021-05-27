/* eslint-disable no-restricted-imports */
import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Tab,
  Tabs,
  Paper,
  FormControlLabel,
  Switch
} from "@material-ui/core";
import {
  withStyles,
  useTheme,
  makeStyles
} from "@material-ui/core/styles";
import SwipeableViews from "react-swipeable-views";
import CloseIcon from "@material-ui/icons/Close";
import { isEmpty } from 'lodash';
import { useDispatch } from 'react-redux';
import { actions } from '../../../../store/ducks/general.duck';
import { getOneDB, postDB, updateDB } from '../../../../crud/api';
import { executePolicies } from '../../Components/Policies/utils';
import { usePolicies } from '../../Components/Policies/hooks';
import BaseFields from '../../Components/BaseFields/BaseFields';
import CustomFields from '../../Components/CustomFields/CustomFields'
import ImageUpload from '../../Components/ImageUpload';

import './ModalLocationProfiles.scss';
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

const DialogTitle5 = withStyles(styles5)(props => {
  const { children, classes, onClose } = props;
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

// Example 5 - Tabs
const useStyles5 = makeStyles({
  root: {
    flexGrow: 1
  }
});

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

const ModalLocationProfiles = ({ showModal, setShowModal, reloadTable, id, policies, updateGeneralProfileLocations }) => {
  const dispatch = useDispatch();
  const { showFillFieldsAlert, showErrorAlert, showSavedAlert, showUpdatedAlert } = actions;
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

  // Example 5 - Tabs
  const classes5 = useStyles5();
  const [value5, setValue5] = useState(0);

  function handleChange5(event, newValue) {
    setValue5(newValue);
  }

  // Example 1 - TextField
  const classes = useStyles();
  const [values, setValues] = useState({
    name: "",
    level: 0,
    isAssetRepository: false,
    isLocationControl: false
  });
  const [isNew, setIsNew] = useState(true);
  // const [isAssetRepository, setIsAssetRepository] = useState(false);
  // const [isLocationControl, setIsLocationControl] = useState(false);

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const [formValidation, setFormValidation] = useState({
    enabled: false,
    isValidForm: {}
  });

  const baseFieldsLocalProps = {
    name: {
      componentProps: {
        onChange: handleChange("name")
      }
    },
    selectedLevel: {
      ownValidFn: () => !!values.level || values.level === 0,
      componentProps: {
        onChange: handleChange("level"),
        type: "number",
        value: values.level
      }
    },
  };

  const handleSave = () => {
    setFormValidation({ ...formValidation, enabled: true });
    if (!isEmpty(formValidation.isValidForm)) {
      dispatch(showFillFieldsAlert());
      return;
    }

    const fileExt = getFileExtension(image);
    const body = { ...values, customFieldsTab, fileExt };
    console.log('isNew:', isNew)
    if (isNew) {
      postDB('locations', body)
        .then(data => data.json())
        .then(response => {
          dispatch(showSavedAlert());
          const { _id } = response.response[0];
          saveAndReload('locations', _id);
          executePolicies('OnAdd', 'locations', 'profiles', policies);
          updateGeneralProfileLocations();
        })
        .catch(error => dispatch(showErrorAlert()));
    } else {
      updateDB('locations/', body, id[0])
        .then(response => {
          dispatch(showUpdatedAlert());
          saveAndReload('locations', id[0]);
          executePolicies('OnEdit', 'locations', 'profiles', policies);
          updateGeneralProfileLocations();
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

  const handleCloseModal = () => {
    setCustomFieldsTab({});
    setValues({ name: "", level: 0, isAssetRepository: false, isLocationControl: false });
    setShowModal(false);
    setValue4(0);
    setFormValidation({
      enabled: false,
      isValidForm: false
    });
  };

  const [customFieldsTab, setCustomFieldsTab] = useState({});

  useEffect(() => {
    if (!id || !Array.isArray(id)) {
      setIsNew(true);
      return;
    }

    getOneDB('locations/', id[0])
      .then(response => response.json())
      .then(data => {
        if (data.response) {
          const { name, level, isAssetRepository, isLocationControl, customFieldsTab, fileExt } = data.response;
          const obj = {
            name,
            level,
            isAssetRepository: isAssetRepository || false,
            isLocationControl: isLocationControl || false,
            imageURL: getImageURL(id, 'locations', fileExt)
          };
          executePolicies('OnLoad', 'locations', 'profiles', policies);
          setValues(obj);
          setCustomFieldsTab(customFieldsTab);
          setIsNew(false);
        }
      })
      .catch(error => dispatch(showErrorAlert()));
  }, [id]);


  const addEdit = isNew ? 'Add' : 'Edit';
  return (
    <div style={{ width: '1000px' }}>
      <Dialog
        // onClose={() => setShowModal(false)}
        onClose={handleCloseModal}
        aria-labelledby="customized-dialog-title"
        open={showModal}
      >
        <DialogTitle5
          id="customized-dialog-title"
          onClose={handleCloseModal}
        // onClose={() => setShowModal(false)}
        >
          {`${addEdit} Location Profiles`}
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
                    <div className="profile-tab-wrapper__picture">
                      <ImageUpload setImage={setImage} image={values.imageURL}>
                        Location Profile Photo
                      </ImageUpload>
                    </div>
                    <div className="profile-tab-wrapper__content">
                      <BaseFields
                        catalogue={'locations'}
                        collection={'locations'}
                        formState={[formValidation, setFormValidation]}
                        localProps={baseFieldsLocalProps}
                        values={values}
                      />
                      <FormControlLabel
                        value="start"
                        // control={<Switch color="primary" checked={isAssetRepository} onChange={e => setIsAssetRepository(e.target.checked)}/>}
                        control={<Switch color="primary" checked={values.isAssetRepository} onChange={e => setValues({ ...values, isAssetRepository: e.target.checked })} />}
                        label="Asset Repository"
                        labelPlacement="start"
                      />
                      <FormControlLabel
                        value="start"
                        // control={<Switch color="primary" checked={isLocationControl} onChange={e => setIsLocationControl(e.target.checked)}/>}
                        control={<Switch color="primary" checked={values.isLocationControl} onChange={e => setValues({ ...values, isLocationControl: e.target.checked })} />}
                        label="Location Control"
                        labelPlacement="start"
                      />
                    </div>
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



export default ModalLocationProfiles;
