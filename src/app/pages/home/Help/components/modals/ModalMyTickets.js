import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  withStyles,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { useDispatch } from 'react-redux';
import { actions } from '../../../../../store/ducks/general.duck';
import {
  getOneDB,
  updateDB,
  postDB,
} from "../../../../../crud/api";
import TicketRequest from "../TicketRequest";

const styles5 = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
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

const DialogActions5 = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(DialogActions);

const ModalMyTickets = ({
  showModal,
  setShowModal,
  reloadTable,
  id,
  employeeProfileRows,
}) => {
  const dispatch = useDispatch();
  const { showErrorAlert, showSavedAlert, showSelectValuesAlert, showUpdatedAlert } = actions;

  const handleSave = () => {
    const { subject, message, selectedType, peaceOfMind } = values;
    if (!subject || !message || !selectedType || !peaceOfMind) {
      dispatch(showSelectValuesAlert());
      return;
    }
    const body = { ...values };
    if (!id) {
      postDB("tickets", body)
        .then((data) => data.json())
        .then((response) => {
          dispatch(showSavedAlert());
          const { _id } = response.response[0];
          saveAndReload("tickets", _id);
        })
        .catch((error) => dispatch(showErrorAlert()));
    } else {
      updateDB("tickets/", body, id[0])
        .then((response) => {
          dispatch(showUpdatedAlert());
          saveAndReload("tickets", id[0]);
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
      message: "",
      peaceOfMind: 100,
      selectedType: 0,
      subject: "",
    });
  };

  useEffect(() => {
    if (!id || !Array.isArray(id)) {
      reset();
      return;
    }

    getOneDB("tickets/", id[0])
      .then((response) => response.json())
      .then((data) => {
        console.log(data.response);
        const values = data.response;
        setValues(values);
      })
      .catch(error => dispatch(showErrorAlert()));
  }, [id, employeeProfileRows]);

  const [values, setValues] = useState({
    message: "",
    peaceOfMind: 100,
    selectedType: 0,
    subject: "Hola",
  });

  return (
    <div>
      <Dialog
        onClose={handleCloseModal}
        aria-labelledby="customized-dialog-title"
        open={showModal}
      >
        <DialogTitle5 id="customized-dialog-title" onClose={handleCloseModal}>
          {`${id ? "Edit" : "Add"} Tickets`}
        </DialogTitle5>
        <DialogContent dividers>
          <div className="kt-section__content">
            <div
              style={{
                width: "400px",
                minHeight: "300px",
              }}
              className="profile-tab-wrapper"
            >
              <TicketRequest setValues={setValues} values={values} />
            </div>
          </div>
        </DialogContent>
        <DialogActions5>
          <Button onClick={handleSave} color="primary">
            Save changes
          </Button>
        </DialogActions5>
      </Dialog>
    </div>
  );
};
export default ModalMyTickets;
