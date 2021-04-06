/* eslint-disable no-restricted-imports */
import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const FormOneField = ({ open = false, title, message, fieldName, onOk, onCancel }) => {
  const [textValue, setTextValue] = useState('');

  const handleAccept = () => {
    if (!textValue) {
      return;
    }
    onOk(textValue);
  };

  return (
    <div>
      <Dialog open={open} onClose={onCancel} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{message}</DialogContentText>
          <TextField
            autoFocus
            margin='dense'
            id='name'
            label={fieldName}
            type='text'
            value={textValue}
            onChange={e => setTextValue(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAccept} color="primary">
            Accept
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FormOneField;
