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
  AppBar, 
  Tabs, 
  Paper,
  TextField,
  Checkbox,
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
import CustomFields from '../../Components/CustomFields/CustomFields';

import './ModalAssetCategories.scss';
import ImageUpload from '../../Components/ImageUpload';
import { postDB, getOneDB, updateDB } from '../../../../crud/api';
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

const ModalAssetCategories = ({ showModal, setShowModal, reloadTable, id }) => {
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
    depreciation: 0,
    categoryPic: '/media/misc/placeholder-image.jpg',
    categoryPicDefault: '/media/misc/placeholder-image.jpg'
  });
  // const [categoryPic, setCategoryPic] 

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleSave = () => {
    const fileExt = getFileExtension(image);
    const body = { ...values, customFieldsTab, fileExt };
    console.log('isNew:', isNew)
    if (isNew) {
      postDB('categories', body)
        .then(data => data.json())
        .then(response => {
          const { _id } = response.response[0];
          saveAndReload('categories', _id);
        })
        .catch(error => console.log(error));
    } else {
      updateDB('categories/', body, id[0])
        .then(response => {
          saveAndReload('categories', id[0]);
        })
        .catch(error => console.log(error));
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
    setValues({ 
      name: "",
      depreciation: 0,
      categoryPic: '/media/misc/placeholder-image.jpg',
      categoryPicDefault: '/media/misc/placeholder-image.jpg'
    });
    setShowModal(false);
    setValue4(0);
  };

  useEffect(() => {
    if(!id || !Array.isArray(id)) {
      setIsNew(true);
      return;
    }
      
    getOneDB('categories/', id[0])
      .then(response => response.json())
      .then(data => { 
        console.log(data.response);
        const { name, depreciation, customFieldsTab, fileExt } = data.response;
        const imageURL = getImageURL(id, 'categories', fileExt);
        const obj = { name, depreciation, imageURL };
        console.log('obj:', obj)
        setValues(obj);
        setCustomFieldsTab(customFieldsTab);
        console.log('customFieldsTab:', customFieldsTab)
        setIsNew(false);
      })
      .catch(error => console.log(error));
  }, [id]);

  const [customFieldsTab, setCustomFieldsTab] = useState({});
  const [isNew, setIsNew] = useState(true);

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
          {`${id ? 'Edit' : 'Add' } Asset Categories`}
          {/* Add/Edit Asset Categories */}
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
                      <TextField
                        id="standard-name"
                        label="Name"
                        className={classes.textField}
                        value={values.name}
                        onChange={handleChange("name")}
                        margin="normal"
                      />
                      <TextField
                        id="standard-number"
                        label="Depreciation"
                        value={values.depreciation}
                        onChange={handleChange("depreciation")}
                        type="number"
                        className={classes.textField}
                        margin="normal"
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
