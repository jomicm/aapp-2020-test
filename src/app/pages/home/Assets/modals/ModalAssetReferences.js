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
import { useDispatch } from 'react-redux';
import { actions } from '../../../../store/ducks/general.duck';
import './ModalAssetCategories.scss';
import ImageUpload from '../../Components/ImageUpload';
import { postDB, getOneDB, updateDB, getDB } from '../../../../crud/api';
import { getFileExtension, saveImage, getImageURL, verifyCustomFields } from '../../utils';
import { CustomFieldsPreview } from '../../constants';
import './ModalAssetReferences.scss';
import { executePolicies, executeOnLoadPolicy } from '../../Components/Policies/utils';

import BaseFields from '../../Components/BaseFields/BaseFields';

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

const ModalAssetReferences = ({ showModal, setShowModal, reloadTable, id, policies }) => {
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

  const [formValidation, setFormValidation] = useState({
    enabled: false,
    isValidForm: {}
  });

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
  const [customFieldsPathResponse, setCustomFieldsPathResponse] = useState();

  const handleChange = name => event => {
    const value = name === 'selectedProfile' ? event : event.target.value;

    if (name === 'selectedProfile') {
      setValues(prev => ({ ...prev, [name]: value, category: value }));
    } else {
      setValues(prev => ({ ...prev, [name]: value }));
    }
    // Load Custom Fields based on Select Control [Category Selected]
    if (name === 'selectedProfile') {
      handleLoadCustomFields(value.value);
      if (!value) {
        setValues(prev => ({ ...prev, depreciation: 0 }));
        setCustomFieldsTab({});
      }
    }
  };

  const handleLoadCustomFields = (profile) => {
    getOneDB('categories/', profile)
      .then(response => response.json())
      .then(data => {
        const { customFieldsTab, depreciation } = data.response;
        const tabs = Object.keys(customFieldsTab).map(key => ({ key, info: customFieldsTab[key].info, content: [customFieldsTab[key].left, customFieldsTab[key].right] }));
        tabs.sort((a, b) => a.key.split('-').pop() - b.key.split('-').pop());

        setCustomFieldsTab(customFieldsTab);
        setValues(prev => ({ ...prev, depreciation }));
        setTabs(tabs);
      })
      .catch(error => dispatch(showErrorAlert()));
  };

  const handleSave = () => {
    setFormValidation({ ...formValidation, enabled: true });
    if (!isEmpty(formValidation.isValidForm)) {
      dispatch(showFillFieldsAlert());
      return;
    }

    if (!verifyCustomFields(customFieldsTab)) {
      dispatch(showFillFieldsAlert());
      return;
    }

    const fileExt = getFileExtension(image);
    
    const body = { ...values, price: values.price.toString(), customFieldsTab, fileExt };
    body.depreciation = Number(body.depreciation)
    if (!id) {
      postDB('references', body)
        .then(data => data.json())
        .then(response => {
          dispatch(showSavedAlert());
          const { _id } = response.response[0];
          saveAndReload('references', _id);
          executePolicies('OnAdd', 'assets', 'references', policies, response.response[0]);
        })
        .catch(error => dispatch(showErrorAlert()));
    } else {
      updateDB('references/', body, id[0])
        .then(response => response.json())
        .then(data => {
          const { response: { value } } = data;

          dispatch(showUpdatedAlert());
          saveAndReload('references', id[0]);
          executePolicies('OnEdit', 'assets', 'references', policies, value);
        })
        .catch(error => console.log(error));
    }
    handleCloseModal();
  };

  const [image, setImage] = useState(null);
  const saveAndReload = (folderName, id) => {
    console.log(image);
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
        value: Number(values.price),
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
    setImage(null);
  };

  useEffect(() => {
    if (!showModal) return;

    getDB('categories/')
      .then(response => response.json())
      .then(data => {
        const profiles = data.response.map(({_id : value, name: label}) => ({ value, label }))
        setValues(prev => ({ ...prev, profiles }));
      })
      .catch(error => console.log(error));
   
    if (!id || !Array.isArray(id)) return;

    getOneDB('references/', id[0])
      .then(response => response.json())
      .then(async(data) => {
        const { name, brand, model, price, depreciation, customFieldsTab, fileExt, selectedProfile } = data.response;
        const { value } = selectedProfile;
        const onLoadResponse = await executeOnLoadPolicy(value, 'assets', 'references', policies, data.response);
        setCustomFieldsPathResponse(onLoadResponse);
        setValues({
          ...values,
          name,
          brand,
          model,
          price,
          depreciation,
          imageURL: getImageURL(id, 'references', fileExt),
          selectedProfile
        });
        const tabs = Object.keys(customFieldsTab).map(key => ({ key, info: customFieldsTab[key].info, content: [customFieldsTab[key].left, customFieldsTab[key].right] }));
        tabs.sort((a, b) => a.key.split('-').pop() - b.key.split('-').pop());
        setCustomFieldsTab(customFieldsTab);
        setTabs(tabs);
      })
      .catch(error => dispatch(showErrorAlert()));
  }, [showModal]);


  // Function to update customFields
  const handleUpdateCustomFields = (tab, id, colIndex, CFValues) => {
    const colValue = ['left', 'right'];
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
                              columnIndex={colIndex}
                              customFieldsPathResponse={customFieldsPathResponse}
                              data={tab.content[colIndex]}
                              from="form"
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
          <Button onClick={handleSave} color="primary">
            Save changes
          </Button>
        </DialogActions5>
      </Dialog>
    </div>
  )
};



export default ModalAssetReferences;
