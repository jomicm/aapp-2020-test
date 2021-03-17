import React, { useEffect, useState } from 'react';
import { EditorState } from 'draft-js';
import SwipeableViews from 'react-swipeable-views';
import { isEmpty, omit } from 'lodash';
import Select from 'react-select';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton
} from '@material-ui/core';
import {
  withStyles,
  useTheme,
  makeStyles
} from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import { postDBEncryptPassword, getDB, getOneDB, updateDB, postDB } from '../../../../crud/api';
import AssetFinder from '../../Components/AssetFinder';

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

const useStyles4 = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 2000
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
    width: 600
  },
  dense: {
    marginTop: 19
  },
  menu: {
    width: 600
  }
}));

const ModalAssetFinder = ({ showModal, setShowModal, reloadTable, id, employeeProfileRows, onAssetFinderSubmit }) => {
  const classes = useStyles();
  const [editor, setEditor] = useState(EditorState.createEmpty());
  const [profileSelected, setProfileSelected] = useState(0);
  const [tableRowsInner, setTableRowsInner] = useState({ rows: [] });
  const [value4, setValue4] = useState(0);
  const [values, setValues] = useState({
    name: '',
    value: ''
  });

  function handleChange4(event, newValue) {
    setValue4(newValue);
  }
  function handleChangeIndex4(index) {
    setValue4(index);
  }

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleSave = () => {
    onAssetFinderSubmit(tableRowsInner);
    handleCloseModal();
  };

  const saveAndReload = (folderName, id) => {
    reloadTable();
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
  }, [id, employeeProfileRows]);

  return (
    <div>
      <Dialog
        onClose={handleCloseModal}
        aria-labelledby='customized-dialog-title'
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
              style={{ minHeight: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}
              className='profile-tab-wrapper'>
              <div style={{ margin: '0px 8px', display: 'flex', flexDirection: 'column' }}>
                <AssetFinder setTableRowsInner={setTableRowsInner} />
              </div>
            </div>
          </div>
        </DialogContent5>
        <DialogActions5>
          <Button onClick={handleSave} color='primary'>
            Add Assets
          </Button>
        </DialogActions5>
      </Dialog>
    </div>
  )
};

export default ModalAssetFinder;
