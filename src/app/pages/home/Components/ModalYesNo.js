/* eslint-disable no-restricted-imports */
import React, { useMemo, useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@material-ui/core";

const ModalYesNo = ({showModal, onOK, onCancel, title, message}) => {
  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      maxWidth="xs"
      // onEntering={handleEntering}
      aria-labelledby="confirmation-dialog-title"
      open={showModal}
      // {...other}
    >
      <DialogTitle id="confirmation-dialog-title">{title}</DialogTitle>
      <DialogContent dividers>
        <p>{message}</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary">
          Cancel
        </Button>
        <Button onClick={onOK} color="primary">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalYesNo;