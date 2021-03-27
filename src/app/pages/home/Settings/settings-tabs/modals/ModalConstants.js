/* eslint-disable no-restricted-imports */
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { omit } from 'lodash';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  TextField,
  withStyles,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

import { actions } from '../../../../../store/ducks/general.duck';
import { getOneDB, updateDB, postDB } from '../../../../../crud/api';


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

const ModalConstants = ({ showModal, setShowModal, reloadTable, id, employeeProfileRows }) => {
  const dispatch = useDispatch();
  const { setAlertControls } = actions;

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleSave = () => {
    const { name, value } = values;
    if (!name.trim() || !value.trim()) {
      dispatch(
        setAlertControls({
          open: true,
          message: 'Select values before saving',
          type: 'warning'
        })
      );
      return;
    }
    const body = { ...values };
    if (!id) {
      postDB('settingsConstants', body)
        .then(data => data.json())
        .then(response => {
          const { _id } = response.response[0];
          saveAndReload('settingsConstants', _id);
        })
        .catch(error => console.log('ERROR', error));
    } else {
      updateDB('settingsConstants/', body, id[0])
        .then(response => {
          saveAndReload('settingsConstants', id[0]);
        })
        .catch(error => console.log(error));
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
      name: '',
      value: ''
    });
  };

  useEffect(() => {
    if (!id || !Array.isArray(id)) {
      reset();
      // loadInitData();
      return;
    }

    getOneDB('settingsConstants/', id[0])
      .then(response => response.json())
      .then(data => {
        const values = omit(data.response, '_id');
        setValues(values);
      })
      .catch(error => console.log(error));
  }, [id, employeeProfileRows]);

  const [values, setValues] = useState({
    name: '',
    value: ''
  });

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
          {`${id ? 'Edit' : 'Add'} Constant`}
        </DialogTitle5>
        <DialogContent5 dividers>
          <div className="kt-section__content">
            <div style={{ minHeight: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }} className="profile-tab-wrapper">
              <div style={{ margin: '0px 8px', display: 'flex', flexDirection: 'column' }}>
                <TextField
                  label={'Name'}
                  style={{ marginTop: '-20px', width: '300px' }}
                  value={values.name}
                  onChange={handleChange('name')}
                  margin="normal"
                />
                <TextField
                  label={'Value'}
                  style={{ marginTop: '20px', width: '300px' }}
                  value={values.value}
                  onChange={handleChange('value')}
                  margin="normal"
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

export default ModalConstants;
