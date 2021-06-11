import React, { useEffect, useState } from 'react';
import { omit } from 'lodash';

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  withStyles,
} from '@material-ui/core';

import { getOneDB } from '../../../../crud/api';
import CloseIcon from '@material-ui/icons/Close';
import AssetFinder from '../components/AssetFinder';

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

export default function ModalAssetFinder({
 showModal, setShowModal, onAssetFinderSubmit, id, userLocations
}) {

  /* States */

  const [tableRowsInner, setTableRowsInner] = useState({ rows: [] });
  const [value4, setValue4] = useState(0);
  const [values, setValues] = useState({
    name: '',
    value: ''
  });

  const handleSave = () => {
    onAssetFinderSubmit(tableRowsInner);
    handleCloseModal();
  };

  const handleCloseModal = () => {
    reset();
    setShowModal(false);
    setValue4(0);
    setTableRowsInner({ rows: [] });
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
      return;
    }

    getOneDB('settingsConstants/', id[0])
      .then(response => response.json())
      .then(data => {
        const values = omit(data.response, '_id');
        setValues(values);
      })
      .catch(error => console.log(error));
  }, [id]);

  return (
    <div>
      <Dialog
        aria-labelledby='customized-dialog-title'
        onClose={handleCloseModal}
        open={showModal}
      >
        <DialogTitle5
          id='customized-dialog-title'
          onClose={handleCloseModal}
        >
          {'Assign Asset'}
        </DialogTitle5>
        <DialogContent5 dividers>
          <div className='kt-section__content'>
            <div
              className='profile-tab-wrapper'
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', minHeight: '100px' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', margin: '0px 8px' }}>
                <AssetFinder setTableRowsInner={setTableRowsInner} userLocations={userLocations} />
              </div>
            </div>
          </div>
        </DialogContent5>
        <DialogActions5>
          <Button color='primary' onClick={handleSave}>
            Add Assets
          </Button>
        </DialogActions5>
      </Dialog>
    </div>
  )
}
