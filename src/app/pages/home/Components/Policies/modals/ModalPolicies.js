import React, { useState, useEffect } from "react";
// import TicketRequest from "../TicketRequest";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  FormLabel,
  FormGroup,
  TextField,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Select from "react-select";
import { withStyles, useTheme, makeStyles } from "@material-ui/core/styles";
import SwipeableViews from "react-swipeable-views";
import CloseIcon from "@material-ui/icons/Close";
import CustomFields from "../../../Components/CustomFields/CustomFields";
import TreeView from "../../../Components/TreeViewComponent";
import ImageUpload from "../../../Components/ImageUpload";
import {
  postDBEncryptPassword,
  getDB,
  getOneDB,
  updateDB,
  postDB,
} from "../../../../../crud/api";
import ModalYesNo from "../../../Components/ModalYesNo";
import { getFileExtension, saveImage, getImageURL } from "../../../utils";
import {
  SingleLine,
  MultiLine,
  Date,
  DateTime,
  DropDown,
  RadioButtons,
  FileUpload,
  Checkboxes,
} from "../../../Components/CustomFields/CustomFieldsPreview";
import { EditorState } from "draft-js";

const CustomFieldsPreview = (props) => {
  const customFieldsPreviewObj = {
    singleLine: <SingleLine {...props} />,
    multiLine: <MultiLine {...props} />,
    date: <Date {...props} />,
    dateTime: <DateTime {...props} />,
    dropDown: <DropDown {...props} />,
    radioButtons: <RadioButtons {...props} />,
    checkboxes: <Checkboxes {...props} />,
    fileUpload: <FileUpload {...props} />,
  };
  return customFieldsPreviewObj[props.type];
};

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

const DialogContent5 = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(DialogContent);

const DialogActions5 = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(DialogActions);

function TabContainer4({ children, dir }) {
  return (
    <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}
const useStyles4 = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 1000,
  },
}));

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  dense: {
    marginTop: 19,
  },
  menu: {
    width: 200,
  },
}));

const ModalPolicies = ({
  showModal,
  setShowModal,
  reloadTable,
  id,
  employeeProfileRows,
}) => {
  const classes4 = useStyles4();
  const theme4 = useTheme();
  const [value4, setValue4] = useState(0);
  function handleChange4(event, newValue) {
    setValue4(newValue);
  }
  function handleChangeIndex4(index) {
    setValue4(index);
  }

  const classes = useStyles();
  const [editor, setEditor] = useState(EditorState.createEmpty());
  const [profileSelected, setProfileSelected] = useState(0);

  const handleSave = () => {
    const { action, type, name } = values;
    if (!action || !type || !name) {
      alert("Select values before saving...");
      return;
    }
    const body = { ...values };
    if (!id) {
      postDB("policies", body)
        .then((data) => data.json())
        .then((response) => {
          const { _id } = response.response[0];
          saveAndReload("policies", _id);
        })
        .catch((error) => console.log("ERROR", error));
    } else {
      updateDB("policies/", body, id[0])
        .then((response) => {
          saveAndReload("policies", id[0]);
        })
        .catch((error) => console.log(error));
    }
    handleCloseModal();
  };

  const saveAndReload = (folderName, id) => {
    reloadTable();
  };

  const handleCloseModal = () => {
    reset();
    setShowModal(false);
    setValue4(0);
  };
  const reset = () => {
    setValues({
      action: "",
      type: "",
      name: "",
    });
  };

  useEffect(() => {
    if (!id || !Array.isArray(id)) {
      reset();
      return;
    }

    getOneDB("Policies/", id[0])
      .then((response) => response.json())
      .then((data) => {
        const values = data.response;
        setValues(values);
      })
      .catch((error) => console.log(error));
  }, [id, employeeProfileRows]);

  const [values, setValues] = useState({
    action: "",
    type: "",
    name: "",
  });

  return (
    <div>
      <Dialog
        onClose={handleCloseModal}
        aria-labelledby="customized-dialog-title"
        open={showModal}
      >
        <DialogTitle5 id="customized-dialog-title" onClose={handleCloseModal}>
          {`${id ? "Edit" : "Add"} Policies`}
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
              {/* <TicketRequest setValues={setValues} values={values} /> */}
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
export default ModalPolicies;
