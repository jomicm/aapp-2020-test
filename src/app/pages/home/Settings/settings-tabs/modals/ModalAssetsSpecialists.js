/* eslint-disable no-restricted-imports */
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useDispatch } from 'react-redux';
import { omit } from "lodash";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  makeStyles,
  FormLabel,
  FormGroup,
  withStyles,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { actions } from '../../../../../store/ducks/general.duck';
import { getLocationPath } from '../../../utils';
import { getDB, getOneDB, updateDB, postDB } from '../../../../../crud/api';
import TreeView from '../../../Components/TreeViewComponent';

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

const ModalAssetsSpecialists = ({ showModal, setShowModal, reloadTable, id, employeeProfileRows, locationsTree }) => {
  const dispatch = useDispatch();
  const { showErrorAlert, showSavedAlert, showSelectValuesAlert, showUpdatedAlert } = actions;
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [treeViewProps, setTreeViewProps] = useState({});
  
  const classes = useStyles();
  const handleSave = () => {
    const { categorySelected, userSelected, location: { locationSelected } } = values;
    if (!categorySelected || !userSelected || !locationSelected) {
      dispatch(showSelectValuesAlert());
      return;
    }
    const body = { ...values };
    console.log(omit(body, ['categories', 'user']));
    if (!id) {
      postDB('settingsAssetSpecialists', omit(body, ['categories', 'user']))
        .then(data => data.json())
        .then(response => {
          dispatch(showSavedAlert());
          const { _id } = response.response[0];
          saveAndReload('settingsAssetSpecialists', _id);
        })
        .catch(error => dispatch(showErrorAlert()));
    } else {
      updateDB('settingsAssetSpecialists/', omit(body, ['categories', 'user']), id[0])
        .then(response => {
          dispatch(showUpdatedAlert());
          saveAndReload('settingsAssetSpecialists', id[0]);
        })
        .catch(error => dispatch(showErrorAlert()));
    }
    handleCloseModal();
  };
  
  const saveAndReload = (folderName, id) => {
    reloadTable();
  };

  const handleCloseModal = () => {
    reset();
    setShowModal(false);
  };
  const reset = () => {
    setValues({ 
      categories: [],
      user: [],
      categorySelected: 0,
      userSelected: 0,
      location: {}
    });
    setTreeViewProps({});
  };

  useEffect(() => {
    if(!id || !Array.isArray(id)) {
      reset();
      loadInitData();
      return;
    }
    
    getOneDB('settingsAssetSpecialists/', id[0])
      .then(response => response.json())
      .then(async (data) => { 
        const { categorySelected, userSelected, location } = data.response;
        const { location: { locationSelected } } = data.response;
        setValues(prev => ({ ...prev, categorySelected, userSelected, location }));
        let path = await getLocationPath(locationSelected, true);

        if (path.length) {
          path.splice(0, 0, 'root');
          path.splice(path.length - 1, 1);
          setTreeViewProps({ expanded: path });
        }
      })
      .catch(error => console.log(error));
  }, [id, employeeProfileRows]);

  const loadInitData = (collectionNames = ['user', 'categories']) => {
    collectionNames =  !Array.isArray(collectionNames) ? [collectionNames] : collectionNames;
    collectionNames.forEach(collectionName => {
      getDB(collectionName)
        .then(response => response.json())
        .then(data => {
          if (collectionName === 'user') {
            const user = data.response.map(({ _id: value, email: label, name, lastName }) => ({ value, label, name, lastName }));
            setUsers(user);
          }
          if (collectionName === 'categories') {
            const categories = data.response.map(({ _id: value, name: label }) => ({ value, label }));
            setCategories(categories);
          }
        })
        .catch(error => console.log('error>', error));
    });
  };

  const [values, setValues] = useState({
    categories: [],
    user: [],
    categorySelected: 0,
    userSelected: 0,
    location: {}
  });

  const handleSetProfileLocationFilter = (locationSelected, _, __, locationName) => {
    if (locationSelected.length !== 24) {
      locationSelected = '';
    }
    setValues(prev => ({ ...prev, location: { locationSelected, locationName } }))
  };

  return (
    <div>
      <Dialog
        onClose={handleCloseModal}
        aria-labelledby="customized-dialog-title"
        open={showModal}
      >
        <DialogTitle5
          id="customized-dialog-title"
          onClose={handleCloseModal}
        >
          {`${id ? 'Edit' : 'Add' } Asset Specialist`}
        </DialogTitle5>
        <DialogContent5 dividers>
          <div className="kt-section__content">
            <div style={{ minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }} className="profile-tab-wrapper">
              <div className={classes.textField}>
                <FormLabel style={{marginTop: '-20px'}} component="legend">Category Finder</FormLabel>
                <FormGroup>
                  <Select
                    onChange={categorySelected => setValues(prev => ({ ...prev, categorySelected }))}
                    value={values.categorySelected}
                    classNamePrefix="select"
                    isClearable={true}
                    name="color"
                    options={categories}
                  />
                </FormGroup>
              </div>
              <div style={{ marginTop: '30px' }} className={classes.textField}>
                <FormLabel style={{marginTop: '0px'}} component="legend">User Finder</FormLabel>
                <FormGroup>
                  <Select
                    onChange={userSelected =>  setValues(prev => ({ ...prev, userSelected }))}
                    value={values.userSelected}
                    classNamePrefix="select"
                    isClearable={true}
                    name="color"
                    options={users}
                  />
                </FormGroup>
              </div>
              <div style={{ margin: '30px 8px' }}>
                <FormLabel style={{marginTop: '0px'}} component="legend">Location Finder</FormLabel>
                <TreeView
                  key="treeview-specialists"
                  customProps={Object.entries(treeViewProps).length ? treeViewProps : null}
                  data={locationsTree}
                  onClick={handleSetProfileLocationFilter}
                  selected={values.location.locationSelected}
                  onNodeToggle={(event, nodes) => setTreeViewProps({ expanded: nodes })}
                />
              </div>
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

export default ModalAssetsSpecialists;
