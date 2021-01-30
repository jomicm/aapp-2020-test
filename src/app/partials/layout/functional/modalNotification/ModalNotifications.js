import React, {useState} from 'react';
import {
  AppBar, 
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Modal,
  Paper,
  Switch,
  Tab, 
  Tabs,
  TextField,
  Typography,
} from '@material-ui/core';
import {
  withStyles,
  useTheme,
  makeStyles
} from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';

const getModalStyle = () => {
  const top = 50;
  const left = 50;
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const styles5 = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2)
  },
  closeButton: {
    color: theme.palette.grey[500],
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1)
  }
});

const DialogTitle5 = withStyles(styles5)(props => {
  const { children, classes, onClose } = props;
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

const DialogContent5 = withStyles(theme => ({
  root: {
    padding: theme.spacing(2)
  }
}))(DialogContent);

const ModalNotifications = ({ subject, message, formatDate, openModal, showModal, setShowModal, from }) => {

  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };
  
  const body = (
    <div>
      <p id='simple-modal-description'>
        <h5> From: </h5>
        {from}
      </p>
      <p id='simple-modal-description'>
        <h5> Subject: </h5>
        {subject}
      </p>
      <p id='simple-modal-description'>
        <h5> Message: </h5>
        {message}
      </p>
      <p id='simple-modal-description'>
      <h5> Date Sent: </h5>
        {`${formatDate.slice(8,10)}-${formatDate.slice(5,7)}-${formatDate.slice(0,4)}`}
      </p>
    </div>
  );

  return (
    <div>
        <Dialog
          aria-describedby='simple-modal-description'
          aria-labelledby='simple-modal-title'
          fullWidth={false}
          maxWidth={'sm'}
          open={showModal}
        >
          <DialogTitle5
          id='customized-dialog-title'
          onClose={handleClose}
          >
            Notification Preview
          </DialogTitle5>
          <DialogContent5 dividers style={{maxWidth:'500px', maxHeight:'500px', minWidth:'260px', minHeight:'270px'}}>
            {body}
          </DialogContent5>
        </Dialog>
    </div>
  );
}

export default ModalNotifications;
