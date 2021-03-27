import React from 'react';
import { connect } from 'react-redux';
import {
  IconButton,
  makeStyles,
  Snackbar,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import CloseIcon from '@material-ui/icons/Close';
import * as general from "../../../store/ducks/general.duck";

export const useStyles = makeStyles(theme => ({
  alert: {
    '& .MuiAlert-icon': {
      fontSize: 30
    }
  },
}));

// Acciones graban estado y selectores lo leen
function CustomizedAlert({ alertControls, setAlertControls, children }) { //open, message, type
  const { open, message, type } = alertControls;
  const classes = useStyles();

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setAlertControls({
      open: false,
      message: message,
      type: type
    });
  };

  const severityFilter = ['success', 'error', 'info', 'warning'];
  return (
    <>
      <Snackbar
        style={{ marginTop: '50px' }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        autoHideDuration={4000}
        open={open}
        onClose={handleClose}
        id='CustomSpinner'
      >
        <Alert
          action={
            <IconButton color='inherit' size='medium' onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          }
          className={classes.alert}
          onClose={handleClose}
          severity={severityFilter.includes(type) ? type : 'info'}
          style={{ fontSize: 16, display: 'flex', alignItems: 'center' }}
        >
          {message}
        </Alert>
      </Snackbar>
      {children}
    </>
  )
}

const mapStateToProps = ({ general: { alertControls } }) => ({
  alertControls
});
export default connect(mapStateToProps, general.actions)(CustomizedAlert);
