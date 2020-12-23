import React, { useState, useEffect } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import NotificationImportantIcon from '@material-ui/icons/NotificationImportant';
import NotificationsIcon from '@material-ui/icons/Notifications';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import NotificationsOffIcon from '@material-ui/icons/NotificationsOff';
import NotificationsPausedIcon from '@material-ui/icons/NotificationsPaused';
import {
  Button,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextareaAutosize,
  TextField,
  Typography,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { withStyles, useTheme, makeStyles } from "@material-ui/core/styles";
import { EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import SwipeableViews from "react-swipeable-views";
import {
  postDBEncryptPassword,
  getDB,
  getOneDB,
  updateDB,
  postDB,
} from "../../../../../crud/api";
import CustomFields from "../../../Components/CustomFields/CustomFields";
import TreeView from "../../../Components/TreeViewComponent";
import ImageUpload from "../../../Components/ImageUpload";
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
import BaseFieldAccordion from "../components/BaseFieldsAccordion";
import CustomFieldAccordion from "../components/CustomFieldsAccordion";
import "./ModalPolicies.scss";

const employeesFields = {
  references: {
    baseFields: {
      name: { id: "name", label: "Name" },
    },
    customFields: {
      name: "Receptionist",
      receptionist: {
        ootoDay: { id: "ootoDay", label: "Ooto Day" },
        favoriteOffice: { id: "favoriteOffice", label: "Favorite Office" },
      },
      name2: "emp02",
      emp02: {
        birthday: { id: "birthday", label: "Birthday" },
      },
    },
    nameReferencesBF: "BF - References",
    nameReferencesCF: "CF - References",
  },
  list: {
    baseFields: {
      name: { id: "name", label: "Name" },
      lastName: { id: "lastNname", label: "Last Name" },
      email: { id: "email", label: "Email" },
    },
    nameListBF: "BF - List",
    nameListCF: "CF - List",
  },
};

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
  button: {
    display: "block",
    marginTop: theme.spacing(2),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
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
    subject: "",
    title: "",
    url: "",
    isAssetEdition: false,
  });

  const [value, setValue] = React.useState(0);

  function handleChange(event, newValue) {
    setValue(newValue);
  }

  const [types, setTypes] = useState([]);

  const handleChangeName = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleChangeCheck = (name) => (event) => {
    setValues({ ...values, [name]: event.target.checked });
  };

  const [checkDisable, setCheckDisable] = useState({
    label: "Disable",
    checkedDisableA: false,
    checkedDisableB: false,
    checkedDisableC: false,
  });

  const handleCheckDisable = (event) => {
    setCheckDisable({
      ...checkDisable,
      [event.target.name]: event.target.checked,
    });
  };

  const [action, setAction] = React.useState("");
  const [openAction, setOpenAction] = React.useState(false);

  function handleChangeAction(event) {
    setAction(event.target.value);
  }

  function handleCloseAction() {
    setOpenAction(false);
  }

  function handleOpenAction() {
    setOpenAction(true);
  }

  const [listRef, setListRef] = React.useState("");
  const [openListRef, setOpenListRef] = React.useState(false);

  function handleChangeListRef(event) {
    setListRef(event.target.value);
  }

  function handleCloseListRef() {
    setOpenListRef(false);
  }

  function handleOpenListRef() {
    setOpenListRef(true);
  }
 
  return (
    <div style={{ width: "1000px" }}>
      <Dialog
        onClose={handleCloseModal}
        aria-labelledby="customized-dialog-title"
        open={showModal}
      >
        <DialogTitle5 id="customized-dialog-title" onClose={handleCloseModal}>
          {`${id ? "Edit" : "Add"} Policies`}
        </DialogTitle5>
        <DialogContent5 dividers>
          <div className="kt-section__content" style={{ margin: "-16px" }}>
            <div className={classes4.root}>
              <div className="profile-tab-wrapper">
                <div
                  name="Expansion Panel"
                  style={{ width: "95%", margin: "15px" }}
                >
                  <ExpansionPanel>
                    <ExpansionPanelSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography className={classes.heading}>
                        General
                      </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <div className="__container-general-panel">
                        <FormControl className={classes.textField}>
                          <InputLabel htmlFor="age-simple">Action</InputLabel>
                          <Select
                            open={openAction}
                            onClose={handleCloseAction}
                            onOpen={handleOpenAction}
                            value={action}
                            onChange={handleChangeAction}
                          >
                            <MenuItem value={10}>On Add</MenuItem>
                            <MenuItem value={20}>On Edit</MenuItem>
                            <MenuItem value={30}>On Delete</MenuItem>
                            <MenuItem value={40}>On Load</MenuItem>
                          </Select>
                        </FormControl>
                        <FormControl className={classes.textField}>
                          <InputLabel htmlFor="age-simple">
                            Catalogue
                          </InputLabel>
                          <Select
                            open={openListRef}
                            onClose={handleCloseListRef}
                            onOpen={handleOpenListRef}
                            value={listRef}
                            onChange={handleChangeListRef}
                          >
                            <MenuItem value={50}>List</MenuItem>
                            <MenuItem value={60}>References</MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                  <ExpansionPanel>
                    <ExpansionPanelSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography className={classes.heading}>
                        Base and Custom Fields
                      </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <div className="__container-baseandcustom-panel">
                        <div className="__container-basefield">
                          <h4>Base Fields</h4>
                          <BaseFieldAccordion
                            baseList={employeesFields.list.nameListBF}
                            baseReferences={
                              employeesFields.references.nameReferencesBF
                            }
                            emailList={
                              employeesFields.list.baseFields.email.label
                            }
                            lastNameList={
                              employeesFields.list.baseFields.lastName.label
                            }
                            nameList={
                              employeesFields.list.baseFields.name.label
                            }
                            nameReferences={
                              employeesFields.references.baseFields.name.label
                            }
                          />
                        </div>
                        <div className="__container-customfield">
                          <h4>Custom Fields</h4>
                          <CustomFieldAccordion
                            customFieldBirthday={
                              employeesFields.references.customFields.emp02
                                .birthday.label
                            }
                            customFieldOffice={
                              employeesFields.references.customFields
                                .receptionist.favoriteOffice.label
                            }
                            customFieldOoto={
                              employeesFields.references.customFields
                                .receptionist.ootoDay.label
                            }
                            customReferences={
                              employeesFields.references.nameReferencesCF
                            }
                            nameCustomReceptionist={
                              employeesFields.references.customFields.name
                            }
                            nameCustomEmp={
                              employeesFields.references.customFields.name2
                            }
                          />
                        </div>
                      </div>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                  <ExpansionPanel>
                    <ExpansionPanelSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography className={classes.heading}>
                        Send Message
                      </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <div className="__container-sendmessage-panel">
                        <div className="__container-form-checkbox">
                          <div className="__container-form">
                            <Autocomplete
                              className={classes.textField}
                              multiple
                              id="tags-standard"
                              options={users}
                              getOptionLabel={(option) => option.name}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  variant="standard"
                                  label="From"
                                />
                              )}
                            />
                            <Autocomplete
                              className={classes.textField}
                              multiple
                              id="tags-standard"
                              options={users}
                              getOptionLabel={(option) => option.name}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  variant="standard"
                                  label="To"
                                />
                              )}
                            />
                            <TextField
                              id="standard-name"
                              label="Subject"
                              className={classes.textField}
                              value={values.subject}
                              margin="normal"
                            />
                          </div>
                          <div className="__container-checkbox">
                            <FormControlLabel
                              value="start"
                              control={
                                <Switch
                                  color="primary"
                                  checked={values.isAssetEdition}
                                  onChange={handleChangeCheck("isAssetEdition")}
                                />
                              }
                              label="Disabled"
                              labelPlacement="start"
                            />
                            <FormControlLabel
                              value="start"
                              control={
                                <Switch
                                  color="primary"
                                  checked={values.isAssetEdition}
                                  onChange={handleChangeCheck("isAssetEdition")}
                                />
                              }
                              label="Mail"
                              labelPlacement="start"
                            />
                            <FormControlLabel
                              value="start"
                              control={
                                <Switch
                                  color="primary"
                                  checked={values.isUserFilter}
                                  onChange={handleChangeCheck("isUserFilter")}
                                />
                              }
                              label="Internal"
                              labelPlacement="start"
                            />
                          </div>
                        </div>
                        <div className="__container-message">
                          <Editor
                            // onFocus={e => EditorState.moveFocusToEnd(editor)}
                            // onFocus={e => console.log('>>>>>>>focus', EditorState.moveFocusToEnd(editor))}
                            // onBlur={e => console.log('>>>>>>>blur')}
                            // onBlur={addStar}
                            onClick={(e) => console.log(">>>>>>>click", e)}
                            editorState={editor}
                            toolbarClassName="toolbarClassName"
                            wrapperClassName="wrapperClassName"
                            editorClassName="editorClassName"
                            onEditorStateChange={(ed) => setEditor(ed)}
                          />
                        </div>
                      </div>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                  <ExpansionPanel>
                    <ExpansionPanelSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography className={classes.heading}>
                        Send Notification
                      </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <div className="__container-sendmessage-panel">
                        <div className="__container-form-checkbox">
                          <div className="__container-form">
                            <Autocomplete
                              className={classes.textField}
                              multiple
                              id="tags-standard"
                              options={users}
                              getOptionLabel={(option) => option.name}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  variant="standard"
                                  label="From"
                                />
                              )}
                            />
                            <Autocomplete
                              className={classes.textField}
                              multiple
                              id="tags-standard"
                              options={users}
                              getOptionLabel={(option) => option.name}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  variant="standard"
                                  label="To"
                                />
                              )}
                            />
                            <TextField
                              id="standard-name"
                              label="Title"
                              className={classes.textField}
                              value={values.title}
                              margin="normal"
                            />
                          </div>
                          <div className="__container-checkbox-notification">
                            <FormControlLabel
                              value="start"
                              control={
                                <Switch
                                  color="primary"
                                  checked={values.isAssetEdition}
                                  onChange={handleChangeCheck("isAssetEdition")}
                                />
                              }
                              label="Disabled"
                              labelPlacement="start"
                            />
                            <div className="__container-icons">
                              <Table>
                                <TableBody>
                                  <TableRow>
                                    <TableCell> <NotificationImportantIcon className="icon"/> </TableCell>
                                    <TableCell> <NotificationsIcon className="icon"/> </TableCell>
                                    <TableCell> <NotificationsActiveIcon className="icon"/> </TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell> <NotificationsNoneIcon className="icon"/> </TableCell>
                                    <TableCell> <NotificationsOffIcon className="icon"/> </TableCell>
                                    <TableCell> <NotificationsPausedIcon className="icon"/> </TableCell>
                                  </TableRow>
                                </TableBody> 
                              </Table>
                            </div>
                          </div>
                        </div>
                        <div className="__container-message-multiline">
                          <TextField
                            id="outlined-multiline-static"
                            label="Message"
                            multiline
                            rows="4"
                            className={classes.textField}
                            margin="normal"
                            style={{ width: "100%" }}
                          />
                        </div>
                      </div>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                  <ExpansionPanel>
                    <ExpansionPanelSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography className={classes.heading}>
                        Send API
                      </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <div className="__container-send-api">
                        <div className="__container-url-disabled">
                          <div className="__container-url">
                            <TextField
                              id="standard-name"
                              label="URL"
                              className={classes.textField}
                              value={values.url}
                              margin="normal"
                              style={{ width: "600px" }}
                            />
                          </div>
                          <div className="__container-disabled">
                            <FormControlLabel
                              value="start"
                              control={
                                <Switch
                                  color="primary"
                                  checked={values.isAssetEdition}
                                  onChange={handleChangeCheck("isAssetEdition")}
                                />
                              }
                              label="Disabled"
                              labelPlacement="start"
                            />
                          </div>
                        </div>
                        <div className="__container-post">
                          <TextField
                            id="outlined-multiline-static"
                            label="Body"
                            multiline
                            rows="4"
                            className={classes.textField}
                            margin="normal"
                            style={{ width: "100%" }}
                          />
                        </div>
                      </div>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                </div>
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
  );
};

const users = [
  { name: "The Shawshank Redemption", year: 1994 },
  { name: "The Godfather", year: 1972 },
  { name: "The Godfather: Part II", year: 1974 },
  { name: "The Dark Knight", year: 2008 },
  { name: "12 Angry Men", year: 1957 },
  { name: "Schindler's List", year: 1993 },
  { name: "Pulp Fiction", year: 1994 },
  { name: "The Lord of the Rings: The Return of the King", year: 2003 },
  { name: "The Good, the Bad and the Ugly", year: 1966 },
  { name: "Fight Club", year: 1999 },
  { name: "The Lord of the Rings: The Fellowship of the Ring", year: 2001 },
  { name: "Star Wars: Episode V - The Empire Strikes Back", year: 1980 },
  { name: "Forrest Gump", year: 1994 },
  { name: "Inception", year: 2010 },
  { name: "The Lord of the Rings: The Two Towers", year: 2002 },
  { name: "One Flew Over the Cuckoo's Nest", year: 1975 },
  { name: "Goodfellas", year: 1990 },
  { name: "The Matrix", year: 1999 },
  { name: "Seven Samurai", year: 1954 },
  { name: "Star Wars: Episode IV - A New Hope", year: 1977 },
  { name: "City of God", year: 2002 },
  { name: "Se7en", year: 1995 },
  { name: "The Silence of the Lambs", year: 1991 },
  { name: "It's a Wonderful Life", year: 1946 },
  { name: "Life Is Beautiful", year: 1997 },
  { name: "The Usual Suspects", year: 1995 },
  { name: "Léon: The Professional", year: 1994 },
  { name: "Spirited Away", year: 2001 },
  { name: "Saving Private Ryan", year: 1998 },
  { name: "Once Upon a Time in the West", year: 1968 },
  { name: "American History X", year: 1998 },
  { name: "Interstellar", year: 2014 },
  { name: "Casablanca", year: 1942 },
  { name: "City Lights", year: 1931 },
  { name: "Psycho", year: 1960 },
  { name: "The Green Mile", year: 1999 },
  { name: "The Intouchables", year: 2011 },
  { name: "Modern Times", year: 1936 },
  { name: "Raiders of the Lost Ark", year: 1981 },
  { name: "Rear Window", year: 1954 },
  { name: "The Pianist", year: 2002 },
  { name: "The Departed", year: 2006 },
  { name: "Terminator 2: Judgment Day", year: 1991 },
  { name: "Back to the Future", year: 1985 },
  { name: "Whiplash", year: 2014 },
  { name: "Gladiator", year: 2000 },
  { name: "Memento", year: 2000 },
  { name: "The Prestige", year: 2006 },
  { name: "The Lion King", year: 1994 },
  { name: "Apocalypse Now", year: 1979 },
  { name: "Alien", year: 1979 },
  { name: "Sunset Boulevard", year: 1950 },
  {
    name:
      "Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb",
    year: 1964,
  },
  { name: "The Great Dictator", year: 1940 },
  { name: "Cinema Paradiso", year: 1988 },
  { name: "The Lives of Others", year: 2006 },
  { name: "Grave of the Fireflies", year: 1988 },
  { name: "Paths of Glory", year: 1957 },
  { name: "Django Unchained", year: 2012 },
  { name: "The Shining", year: 1980 },
  { name: "WALL·E", year: 2008 },
  { name: "American Beauty", year: 1999 },
  { name: "The Dark Knight Rises", year: 2012 },
  { name: "Princess Mononoke", year: 1997 },
  { name: "Aliens", year: 1986 },
  { name: "Oldboy", year: 2003 },
  { name: "Once Upon a Time in America", year: 1984 },
  { name: "Witness for the Prosecution", year: 1957 },
  { name: "Das Boot", year: 1981 },
  { name: "Citizen Kane", year: 1941 },
  { name: "North by Northwest", year: 1959 },
  { name: "Vertigo", year: 1958 },
  { name: "Star Wars: Episode VI - Return of the Jedi", year: 1983 },
  { name: "Reservoir Dogs", year: 1992 },
  { name: "Braveheart", year: 1995 },
  { name: "M", year: 1931 },
  { name: "Requiem for a Dream", year: 2000 },
  { name: "Amélie", year: 2001 },
  { name: "A Clockwork Orange", year: 1971 },
  { name: "Like Stars on Earth", year: 2007 },
  { name: "Taxi Driver", year: 1976 },
  { name: "Lawrence of Arabia", year: 1962 },
  { name: "Double Indemnity", year: 1944 },
  { name: "Eternal Sunshine of the Spotless Mind", year: 2004 },
  { name: "Amadeus", year: 1984 },
  { name: "To Kill a Mockingbird", year: 1962 },
  { name: "Toy Story 3", year: 2010 },
  { name: "Logan", year: 2017 },
  { name: "Full Metal Jacket", year: 1987 },
  { name: "Dangal", year: 2016 },
  { name: "The Sting", year: 1973 },
  { name: "2001: A Space Odyssey", year: 1968 },
  { name: "Singin' in the Rain", year: 1952 },
  { name: "Toy Story", year: 1995 },
  { name: "Bicycle Thieves", year: 1948 },
  { name: "The Kid", year: 1921 },
  { name: "Inglourious Basterds", year: 2009 },
  { name: "Snatch", year: 2000 },
  { name: "3 Idiots", year: 2009 },
  { name: "Monty Python and the Holy Grail", year: 1975 },
];
export default ModalPolicies;
