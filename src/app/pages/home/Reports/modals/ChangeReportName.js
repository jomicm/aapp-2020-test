import React, { useState } from 'react'
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    TextField,
    Typography
  } from '@material-ui/core';
  import CloseIcon from '@material-ui/icons/Close';
  import { withStyles, useTheme, makeStyles } from '@material-ui/core/styles';
  import {
    PortletBody,
  } from '../../../../../app/partials/content/Portlet';
  import './ModalReportsSaved.scss';

  const DialogContent5 = withStyles((theme) => ({
    root: {
      padding: theme.spacing(2),
      height: '120px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }))(DialogContent);

  const DialogTitle5 = withStyles(styles5)(({ children, classes, onClose }) => {
    return (
      <DialogTitle 
        disableTypography 
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '500px' }}
        >
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

  const styles5 = (theme) => ({
    root: {
      margin: 0,
      padding: theme.spacing(2),
      border: '10px solid red'
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500]
    }
  });

  const DialogActions5 = withStyles((theme) => ({
    root: {
      margin: 0,
      padding: theme.spacing(1)
    }
  }))(DialogActions);

  const useStyles = makeStyles((theme) => ({
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
    },
    button: {
      display: 'block',
      marginTop: theme.spacing(2)
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120
    }
  }));

const ChangeReportName = ({
    reset,
    saveData,
    setShowModal,
    showModal
    }) => {

    const [renameReport, setRenameReport] = useState('');

    const handleChangeName = (e) => {
        const { value } = e.target;
        setRenameReport(value);
    }

    const handleCloseModal = () => {
      reset();
      setShowModal(false);
      };

    const handleSave = () => {
      debugger
        if (renameReport.trim() === '') {
            alert('Please enter a valid name...');
          } else {
            saveData(renameReport);
            handleCloseModal();
          }
    }

    return (
        <div style={{ width: '100px' }}>
      <Dialog
        aria-labelledby='customized-dialog-title'
        onClose={handleCloseModal}
        open={showModal}
      >
        <DialogTitle5 id='customized-dialog-title' onClose={handleCloseModal}>
          Change Report Name
        </DialogTitle5>
        <DialogContent5 dividers>
          <PortletBody>
              <TextField
                onChange={handleChangeName}
                placeholder='New name'
                style={{ width: '200px' }}
              />
          </PortletBody>
        </DialogContent5>
        <DialogActions5>
          <Button color='primary' onClick={handleSave}>
            Save changes
          </Button>
        </DialogActions5>
      </Dialog>
    </div>
    )
}

export default ChangeReportName;
