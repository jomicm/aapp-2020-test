/* eslint-disable no-restricted-imports */
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import SwipeableViews from "react-swipeable-views";
import { isEmpty } from 'lodash';
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
} from "@material-ui/core";
import {
  withStyles,
  useTheme,
  makeStyles
} from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import { actions } from '../../../../store/ducks/general.duck';
import { postDB, getDB, getOneDB, updateDB } from '../../../../crud/api';
import CustomFields from '../../Components/CustomFields/CustomFields';
import BaseFields from '../../Components/BaseFields/BaseFields';
import ImageUpload from '../../Components/ImageUpload';
import { getFileExtension, saveImage, getImageURL } from '../../utils';
import './ModalAssetCategories.scss';
import { executePolicies } from '../../Components/Policies/utils';


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

const ModalAssetCategories = ({ showModal, setShowModal, reloadTable, id }) => {
  const dispatch = useDispatch();
  const { showErrorAlert, showFillFieldsAlert, showSavedAlert, showUpdatedAlert } = actions;
  // Example 4 - Tabs
  const classes4 = useStyles4();
  const theme4 = useTheme();
  const [value4, setValue4] = useState(0);
  const [policies, setPolicies] = useState([]);
  function handleChange4(event, newValue) {
    setValue4(newValue);
  }
  function handleChangeIndex4(index) {
    setValue4(index);
  }

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
        onChange: handleChange('name')
      }
    },
    depreciation: {
      ownValidFn: () => !!values.depreciation || values.depreciation === 0,
      componentProps: {
        onChange: handleChange('depreciation'),
        type: "number"
      }
    },
  };

  // Example 1 - TextField
  const [values, setValues] = useState({
    name: "",
    depreciation: 0,
    categoryPic: '/media/misc/placeholder-image.jpg',
    categoryPicDefault: '/media/misc/placeholder-image.jpg'
  });
  // const [categoryPic, setCategoryPic] 

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
      postDB('categories', body)
        .then(data => data.json())
        .then(response => {
          dispatch(showSavedAlert());
          const { _id } = response.response[0];
          saveAndReload('categories', _id);
          executePolicies('OnAdd', 'assets', 'categories', policies);
        })
        .catch(error => dispatch(showErrorAlert()));
    } else {
      updateDB('categories/', body, id[0])
        .then(response => {
          dispatch(showUpdatedAlert());
          saveAndReload('categories', id[0]);
          executePolicies('OnEdit', 'assets', 'categories', policies);
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
    setImage(null);
    setCustomFieldsTab({});
    setValues({
      name: "",
      depreciation: 0,
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
    getDB('policies')
      .then((response) => response.json())
      .then((data) => {
        setPolicies(data.response);
      })
      .catch((error) => console.log('error>', error));
  }, []);

  useEffect(() => {
    if (!id || !Array.isArray(id)) {
      setIsNew(true);
      return;
    }

    getOneDB('categories/', id[0])
      .then(response => response.json())
      .then(data => {
        console.log(data.response);
        const { name, depreciation, customFieldsTab, fileExt } = data.response;
        executePolicies('OnLoad', 'assets', 'categories', policies);
        const imageURL = getImageURL(id, 'categories', fileExt);
        const obj = { name, depreciation, imageURL };
        console.log('obj:', obj)
        setValues(obj);
        setCustomFieldsTab(customFieldsTab);
        console.log('customFieldsTab:', customFieldsTab)
        setIsNew(false);
      })
      .catch(error => dispatch(showErrorAlert()));
  }, [id]);


  const [customFieldsTab, setCustomFieldsTab] = useState({});
  const [isNew, setIsNew] = useState(true);

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
          {`${id ? 'Edit' : 'Add'} Asset Categories`}
          {/* Add/Edit Asset Categories */}
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
                  <Tab label="Category" />
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
                      Asset Category Photo
                    </ImageUpload>
                    <div className="profile-tab-wrapper__content">
                      <BaseFields
                        catalogue={'categories'}
                        collection={'categories'}
                        formState={[formValidation, setFormValidation]}
                        localProps={baseFieldsLocalProps}
                        values={values}
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



export default ModalAssetCategories;
