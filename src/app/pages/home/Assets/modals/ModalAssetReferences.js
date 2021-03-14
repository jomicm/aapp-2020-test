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
  InputAdornment,
} from "@material-ui/core";
import {
  withStyles,
  useTheme,
  makeStyles
} from "@material-ui/core/styles";
import SwipeableViews from "react-swipeable-views";
import CloseIcon from "@material-ui/icons/Close";
import { isEmpty } from 'lodash';

import CustomFields from '../../Components/CustomFields/CustomFields';
import './ModalAssetCategories.scss';
import ImageUpload from '../../Components/ImageUpload';
import { postDB, getOneDB, updateDB } from '../../../../crud/api';
import { getFileExtension, saveImage, getImageURL } from '../../utils';
import './ModalAssetReferences.scss';

import {
  SingleLine,
  MultiLine,
  Date,
  DateTime,
  DropDown,
  RadioButtons,
  Checkboxes,
  FileUpload
} from '../../Components/CustomFields/CustomFieldsPreview';

import BaseFields from '../../Components/BaseFields/BaseFields';

const CustomFieldsPreview = (props) => {
  const customFieldsPreviewObj = {
    singleLine: <SingleLine {...props} />,
    multiLine: <MultiLine {...props} />,
    date: <Date {...props} />,
    dateTime: <DateTime {...props} />,
    dropDown: <DropDown {...props} />,
    radioButtons: <RadioButtons {...props} />,
    checkboxes: <Checkboxes {...props} />,
    fileUpload: <FileUpload {...props} />
  };
  return customFieldsPreviewObj[props.type];
};

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

const ModalAssetReferences = ({ showModal, setShowModal, reloadTable, id, categoryRows }) => {
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

  const [formValidation, setFormValidation] = useState({
    enabled: false,
    isValidForm: {}
  });

  // Example 1 - TextField
  const classes = useStyles();
  const [values, setValues] = useState({
    name: '',
    brand: '',
    model: '',
    price: 0,
    depreciation: 0,
    categoryPic: '/media/misc/placeholder-image.jpg',
    categoryPicDefault: '/media/misc/placeholder-image.jpg',
    selectedProfile: '',
    profiles: [],
    // profilesIds: []
  });
  const [customFieldsTab, setCustomFieldsTab] = useState({});
  const [tabs, setTabs] = useState([]);

  const handleChange = name => event => {
    const value = name === 'selectedProfile' ? event.value : event.target.value;
    setValues(prev => ({ ...prev, [name]: value }));
    // Load Custom Fields based on Select Control [Category Selected]
    if (name === 'selectedProfile') {
      handleLoadCustomFields(values.profiles[value]);
      if (!value) {
        setValues(prev => ({ ...prev, depreciation: 0 }));
        setCustomFieldsTab({});
      }
    }
  };

  const handleLoadCustomFields = (profile) => {
    if (!profile || !profile.id) return;
    console.log('id:', id)
    getOneDB('categories/', profile.id)
      .then(response => response.json())
      .then(data => {
        console.log(data.response);
        const { customFieldsTab, depreciation } = data.response;
        console.log('customFieldsTab:', customFieldsTab)
        const tabs = Object.keys(customFieldsTab).map(key => ({ key, info: customFieldsTab[key].info, content: [customFieldsTab[key].left, customFieldsTab[key].right] }));
        tabs.sort((a, b) => a.key.split('-').pop() - b.key.split('-').pop());

        console.log('tabs:', tabs)
        setCustomFieldsTab(customFieldsTab);
        setValues(prev => ({ ...prev, depreciation }));
        setTabs(tabs);
      })
      .catch(error => console.log(error));
  };

  const handleSave = () => {
    setFormValidation({ ...formValidation, enabled: true });
    if (!isEmpty(formValidation.isValidForm)) {
      alert('Please fill out missing fields')
      return;
    }

    const fileExt = getFileExtension(image);
    const body = { ...values, customFieldsTab, fileExt };
    body.price = Number(body.price)
    body.depreciation = Number(body.depreciation)
    if (!id) {
      postDB('references', body)
        .then(data => data.json())
        .then(response => {
          const { _id } = response.response[0];
          saveAndReload('references', _id);
        })
        .catch(error => console.log(error));
    } else {
      updateDB('references/', body, id[0])
        .then(response => {
          saveAndReload('references', id[0]);
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


  const baseFieldsLocalProps = {
    category: {
      componentProps: {
        onChange: handleChange('selectedProfile'),
        options: values.profiles,
        value: values.selectedProfile
      }
    },
    name: {
      componentProps: {
        onChange: handleChange('name')
      }
    },
    brand: {
      componentProps: {
        onChange: handleChange("brand")
      }
    },
    model: {
      componentProps: {
        onChange: handleChange("model")
      }
    },
    price: {
      ownValidFn: () => !!values.price || values.price === 0,
      componentProps: {
        onChange: handleChange('price'),
        value: values.price,
        type: "number",
        InputProps: {
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }
      }
    },
    depreciation: {
      ownValidFn: () => !!values.depreciation || values.depreciation === 0,
      componentProps: {
        onchange: handleChange("depreciation"),
        type: "number",
        disabled: true
      }
    }
  };

  const handleCloseModal = () => {
    console.log('HANDLE CLOSE MODAL!')
    setCustomFieldsTab({});
    setValues({
      name: '',
      brand: '',
      model: '',
      price: '',
      depreciation: 0,
      categoryPic: '/media/misc/placeholder-image.jpg',
      categoryPicDefault: '/media/misc/placeholder-image.jpg',
      selectedProfile: '',
      profiles: []
    });
    setShowModal(false);
    setValue4(0);
    setTabs([]);
    setFormValidation({
      enabled: false,
      isValidForm: false
    });
  };

  useEffect(() => {
    if (!showModal) return;
    console.log('Use Eff Ref>', id)

    const profiles = categoryRows.map(cat => ({ value: cat.id, label: cat.name }));
    setValues(prev => ({ ...prev, profiles }));
    if (!id || !Array.isArray(id)) return;

    getOneDB('references/', id[0])
      .then(response => response.json())
      .then(data => {
        console.log(data.response);
        const { name, brand, model, price, depreciation, customFieldsTab, fileExt } = data.response;
        setValues({
          ...values,
          name,
          brand,
          model,
          price,
          depreciation,
          imageURL: getImageURL(id, 'references', fileExt)
        });
        const tabs = Object.keys(customFieldsTab).map(key => ({ key, info: customFieldsTab[key].info, content: [customFieldsTab[key].left, customFieldsTab[key].right] }));
        tabs.sort((a, b) => a.key.split('-').pop() - b.key.split('-').pop());
        setCustomFieldsTab(customFieldsTab);
        setTabs(tabs);
      })
      .catch(error => console.log(error));
  }, [showModal]);

  useEffect(() => {
    setFormValidation({ ...formValidation, enabled: true });
  }, [values])

  // Function to update customFields
  const handleUpdateCustomFields = (tab, id, colIndex, CFValues) => {
    const colValue = ['left', 'right'];
    console.log('Looking for you', tab, id, colIndex, values);
    const customFieldsTabTmp = { ...customFieldsTab };

    const field = customFieldsTabTmp[tab][colValue[colIndex]]
      .find(cf => cf.id === id);
    field.values = CFValues;
  };

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
          {`${id ? 'Edit' : 'Add'} Asset References`}
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
                  <Tab label="Reference" />
                  {tabs.map((tab, index) => (
                    <Tab key={`tab-reference-${index}`} label={tab.info.name} />
                  ))}
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
                      Asset Reference Photo
                    </ImageUpload>
                    <div className="profile-tab-wrapper__content">
                      <BaseFields
                        catalogue={'references'}
                        collection={'references'}
                        formState={[formValidation, setFormValidation]}
                        localProps={baseFieldsLocalProps}
                        values={values}
                      />
                    </div>
                  </div>
                </TabContainer4>
                {tabs.map(tab => (
                  <TabContainer4 dir={theme4.direction}>
                    <div className="modal-asset-reference">
                      {Array(tab.content[1].length === 0 ? 1 : 2).fill(0).map((col, colIndex) => (
                        <div className="modal-asset-reference__list-field" >
                          {tab.content[colIndex].map(customField => (
                            <CustomFieldsPreview
                              id={customField.id}
                              type={customField.content}
                              values={customField.values}
                              onDelete={() => { }}
                              onSelect={() => { }}
                              columnIndex={colIndex}
                              from="form"
                              tab={tab}
                              onUpdateCustomField={handleUpdateCustomFields}
                              // customFieldIndex={props.customFieldIndex}
                              onClick={() => alert(customField.content)}
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
          <Button onClick={handleSave} color="primary">
            Save changes
          </Button>
        </DialogActions5>
      </Dialog>
    </div>
  )
};



export default ModalAssetReferences;
