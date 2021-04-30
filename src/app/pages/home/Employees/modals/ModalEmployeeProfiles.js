/* eslint-disable no-restricted-imports */
import React, { useState, useEffect } from 'react';
import { isEmpty } from 'lodash';
import SwipeableViews from 'react-swipeable-views';
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
  Tabs,
  Typography
} from '@material-ui/core';
import {
  withStyles,
  useTheme,
  makeStyles
} from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import { useDispatch } from 'react-redux';
import { actions } from '../../../../store/ducks/general.duck';
import { getDB, postDB, getOneDB, updateDB } from '../../../../crud/api';
import BaseFields from '../../Components/BaseFields/BaseFields';
import CustomFields from '../../Components/CustomFields/CustomFields';
import ImageUpload from '../../Components/ImageUpload';
import { getFileExtension, saveImage, getImageURL } from '../../utils';
import { executePolicies } from '../../Components/Policies/utils';
import { usePolicies } from '../../Components/Policies/hooks';

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

const DialogTitle5 = withStyles(styles5)(({ children, classes, onClose }) => {
  return (
    <DialogTitle disableTypography className={classes.root}>
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

function TabContainer4({ children, dir }) {
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
  }
}));

const ModalEmployeeProfiles = ({ showModal, setShowModal, reloadTable, id }) => {
  const dispatch = useDispatch();
  const { showFillFieldsAlert, showErrorAlert, showSavedAlert, showUpdatedAlert } = actions;
  const classes4 = useStyles4();
  const theme4 = useTheme();
  const [value4, setValue4] = useState(0);
  const policies = usePolicies();

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

  const classes = useStyles();
  const [values, setValues] = useState({
    name: '',
    categoryPic: '/media/misc/placeholder-image.jpg',
    categoryPicDefault: '/media/misc/placeholder-image.jpg',
    imageURL: '',
  });

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const baseFieldsLocalProps = {
    name: {
      componentProps: {
        onChange: handleChange('name')
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
    const body = { ...values, customFieldsTab, isAssetRepository, fileExt };
    if (!id) {
      postDB('employeeProfiles', body)
        .then(data => data.json())
        .then(response => {
          dispatch(showSavedAlert());
          const { _id } = response.response[0];
          saveAndReload('employeeProfiles', _id);
          executePolicies('OnAdd', 'employees', 'references', policies);
        })
        .catch(error => dispatch(showErrorAlert()));
    } else {
      updateDB('employeeProfiles/', body, id[0])
        .then(data => data.json())
        .then(response => {
          dispatch(showUpdatedAlert());
          executePolicies('OnEdit', 'employees', 'references', policies);
          saveAndReload('employeeProfiles', id[0]);
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
    setProfilePermissions([]);
    setValues({
      name: '',
      categoryPic: '/media/misc/placeholder-image.jpg',
      categoryPicDefault: '/media/misc/placeholder-image.jpg',
      imageURL: '',
    });
    setShowModal(false);
    setValue4(0);
    setIsAssetRepository(false);
    setFormValidation({
      enabled: false,
      isValidForm: false
    });
  };

  useEffect(() => {
    if (!id || !Array.isArray(id)) {
      return;
    }

    getOneDB('employeeProfiles/', id[0])
      .then(response => response.json())
      .then(data => {
        const { _id, name, depreciation, customFieldsTab, profilePermissions, isAssetRepository, fileExt } = data.response;
        const imageURL = getImageURL(id, 'employeeProfiles', fileExt);
        const obj = { name, depreciation, imageURL };
        setValues(obj);
        executePolicies('OnLoad', 'employees', 'references', policies);
        setCustomFieldsTab(customFieldsTab);
        setIsAssetRepository(isAssetRepository);
        setProfilePermissions(profilePermissions);
      })
      .catch(error => dispatch(showErrorAlert()));
  }, [id]);


  const [customFieldsTab, setCustomFieldsTab] = useState({});

  const modules = [
    { key: 'dashboard', name: 'Dashboard' },
    { key: 'assets', name: 'Assets' },
    { key: 'processes', name: 'Processes' },
    { key: 'users', name: 'Users' },
    { key: 'employees', name: 'Employees' },
    { key: 'locations', name: 'Locations' },
    { key: 'reports', name: 'Reports' },
    { key: 'settings', name: 'Settings' }
  ];

  const [profilePermissions, setProfilePermissions] = useState({});
  const [isAssetRepository, setIsAssetRepository] = useState(false);

  const handleSetPermissions = (key, checked) => {
    setProfilePermissions(prev => ({ ...prev, [key]: checked }));
  }

  return (
    <div style={{ width: '1000px' }}>
      <Dialog
        onClose={handleCloseModal}
        aria-labelledby='customized-dialog-title'
        open={showModal}
      >
        <DialogTitle5
          id='customized-dialog-title'
          onClose={handleCloseModal}
        >
          {`${id ? 'Edit' : 'Add'} Employee Profiles`}
        </DialogTitle5>
        <DialogContent5 dividers>
          <div className='kt-section__content' style={{ margin: '-16px' }}>
            <div className={classes4.root}>
              <Paper className={classes4.root}>
                <Tabs
                  value={value4}
                  onChange={handleChange4}
                  indicatorColor='primary'
                  textColor='primary'
                  variant='fullWidth'
                >
                  <Tab label='Profile' />
                  <Tab label='Custom Fields' />
                </Tabs>
              </Paper>
              <SwipeableViews
                axis={theme4.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={value4}
                onChangeIndex={handleChangeIndex4}
              >
                <TabContainer4 dir={theme4.direction}>
                  <div className='profile-tab-wrapper'>
                    <ImageUpload setImage={setImage} image={values.imageURL}>
                      Employee Profile Photo
                    </ImageUpload>
                    <div className='profile-tab-wrapper__content'>
                      <BaseFields
                        catalogue={'employeeReferences'}
                        collection={'employeeReferences'}
                        formState={[formValidation, setFormValidation]}
                        localProps={baseFieldsLocalProps}
                        values={values}
                      />
                      <FormControlLabel
                        value='start'
                        control={<Switch color='primary' checked={isAssetRepository} onChange={e => setIsAssetRepository(e.target.checked)} />}
                        label='Asset Repository'
                        labelPlacement='start'
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
          <Button onClick={handleSave} color='primary'>
            Save changes
          </Button>
        </DialogActions5>
      </Dialog>
    </div>
  )
};

export default ModalEmployeeProfiles;
