import React, { useState, useEffect, useRef } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import NotificationImportantIcon from '@material-ui/icons/NotificationImportant';
import NotificationsIcon from '@material-ui/icons/Notifications';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import NotificationsOffIcon from '@material-ui/icons/NotificationsOff';
import NotificationsPausedIcon from '@material-ui/icons/NotificationsPaused';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
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
  Typography
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { withStyles, useTheme, makeStyles } from '@material-ui/core/styles';
import { pick } from 'lodash';
import {
  EditorState,
  ContentState,
  convertToRaw,
  convertFromHTML,
  Modifier
} from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import SwipeableViews from 'react-swipeable-views';
import {
  Portlet,
  PortletBody,
  PortletFooter,
  PortletHeader,
  PortletHeaderToolbar
} from '../../../../../a../../../app/partials/content/Portlet';
import {
  postDBEncryptPassword,
  getDB,
  getOneDB,
  updateDB,
  postDB
} from '../../../../../crud/api';
import CustomFields from '../../../Components/CustomFields/CustomFields';
import TreeView from '../../../Components/TreeViewComponent';
import ImageUpload from '../../../Components/ImageUpload';
import ModalYesNo from '../../../Components/ModalYesNo';
import { getFileExtension, saveImage, getImageURL } from '../../../utils';
import {
  SingleLine,
  MultiLine,
  Date,
  DateTime,
  DropDown,
  RadioButtons,
  FileUpload,
  Checkboxes
} from '../../../Components/CustomFields/CustomFieldsPreview';
import BaseFieldAccordion from '../components/BaseFieldsAccordion';
import CustomFieldAccordion from '../components/CustomFieldsAccordion';
import './ModalPolicies.scss';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { Formik } from 'formik';

const localStorageActiveTabKey = 'builderActiveTab';

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

const DialogContent5 = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(DialogContent);

const DialogActions5 = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1)
  },
}))(DialogActions);

const TabContainer4 = ({ children, dir }) => {
  return (
    <Typography component='div' dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
};
const useStyles4 = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    minWidth: 1000
  }
}));

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

const ModalPolicies = ({
  employeeProfileRows,
  id,
  module,
  reloadTable,
  setShowModal,
  showModal
}) => {
  const [alignment, setAlignment] = useState('');
  const actions = [
    { value: 'OnAdd', label: 'On Add' },
    { value: 'OnEdit', label: 'On Edit' },
    { value: 'OnDelete', label: 'On Delete' },
    { value: 'OnLoad', label: 'On Load' }
  ];
  const activeTab = localStorage.getItem(localStorageActiveTabKey);
  const catalogues = [
    { value: 'list', label: 'List' },
    { value: 'references', label: 'References' }
  ];
  const classes = useStyles();
  const classes4 = useStyles4();
  const [cursorPosition, setCursorPosition] = useState([0, 0]);
  const [editor, setEditor] = useState(EditorState.createEmpty());
  const employeesFields = {
    references: {
      baseFields: {
        name: { id: 'nameReferences', label: 'name' },
        ssn: { id: 'ssn', label: 'Social Service Number' }
      },
      customFields: {
        recepcionist: {
          ootoDay: { id: 'ootoDay', label: 'Ooto Day' },
          favoriteOffice: { id: 'favoriteOffice', label: 'Favorite Office' }
        },
        emp02: {
          birthday: { id: 'birthday', label: 'Birthday' }
        },
        emp03: {
          age: { id: 'age', label: 'Age' }
        }
      },
      name: 'BF - References'
    },
    list: {
      baseFields: {
        name: { id: 'nameList', label: 'name' },
        lastName: { id: 'lastName', label: 'Laste Name' },
        email: { id: 'email', label: 'Email' }
      },
      name: 'BF - List'
    }
  };
  const iconsList = {
    notificationImportantIcon: <NotificationImportantIcon />,
    notificationsIcon: <NotificationsIcon />,
    notificationsActiveIcon: <NotificationsActiveIcon />,
    notificationsNoneIcon: <NotificationsNoneIcon />,
    notificationsOffIcon: <NotificationsOffIcon />,
    notificationsPausedIcon: <NotificationsPausedIcon />
  };
  const [messageFrom, setMessageFrom] = useState([]);
  const [messageTo, setMessageTo] = useState([]);
  const [notificationFrom, setNotificationFrom] = useState([]);
  const [notificationTo, setNotificationTo] = useState([]);
  const [profileSelected, setProfileSelected] = useState(0);
  const [selectedControl, setSelectedControl] = useState(null);
  const [tab, setTab] = useState(activeTab ? +activeTab : 0);
  const theme4 = useTheme();
  const [users, setUsers] = useState([]);
  const [value4, setValue4] = useState(0);
  const [values, setValues] = useState({
    apiDisabled: false,
    bodyAPI: '',
    messageDisabled: false,
    messageInternal: false,
    messageMail: false,
    messageNotification: '',
    notificationDisabled: false,
    policyName: '',
    selectedAction: '',
    selectedCatalogue: '',
    selectedIcon: '',
    subjectMessage: '',
    subjectNotification: '',
    urlAPI: ''
  });

  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  const handleChange4 = (event, newValue) => {
    setValue4(newValue);
  };
  const handleChangeIndex4 = (index) => {
    setValue4(index);
  };

  const handleChangeCheck = (name) => (event) => {
    setValues({ ...values, [name]: event.target.checked });
  };

  const handleChangeName = (name) => (event) => {
    const text = event.target.value;
    setValues({ ...values, [name]: text });

    setSelectedControlAndIndexes(event);
  };

  const handleClickIcon = (selectedIcon) => {
    setValues({ ...values, selectedIcon });
  };

  const handleCloseModal = () => {
    reset();
    setShowModal(false);
    setValue4(0);
  };

  const handleOnChangeValue = (name) => (event) => {
    const { target: { value } } = event;
    setValues({ ...values, [name]: value });
  };

  const handleSave = () => {
    const { selectedAction, selectedCatalogue } = values;
    if (!selectedAction || !selectedCatalogue) {
      alert('Select values before saving...');
      return;
    }
    const layout = draftToHtml(convertToRaw(editor.getCurrentContent()));
    const body = {
      ...values,
      messageFrom,
      messageTo,
      layout,
      notificationFrom,
      notificationTo,
      module
    };
    if (!id) {
      postDB('policies', body)
        .then((data) => data.json())
        .then((response) => {
          const { _id } = response.response[0];
          saveAndReload('policies', _id);
        })
        .catch((error) => console.log('ERROR', error));
    } else {
      updateDB('policies/', body, id[0])
        .then((response) => {
          saveAndReload('policies', id[0]);
        })
        .catch((error) => console.log(error));
    }
    handleCloseModal();
  };

  const insertVariable = (varId) => {
    if (selectedControl === 'htmlMessage') {
      const contentState = Modifier.replaceText(
        editor.getCurrentContent(),
        editor.getSelection(),
        `%{${varId}}`,
        editor.getCurrentInlineStyle()
      );
      setEditor(EditorState.push(editor, contentState, 'insert-characters'));
    } else {
      debugger
      const text = values[selectedControl];
      const left = text.substr(0, cursorPosition[0]);
      const right = text.substr(cursorPosition[1], text.length);
      const final = `${left}%{${varId}}${right}`;
      setValues({ ...values, [selectedControl]: final });
    }
  };

  const onChangeMessageFromTo = (name) => (event, values) => {
    if (name === 'From') {
      setMessageFrom(values);
    } else if (name === 'To') setMessageTo(values);
  };

  const onChangeNotificationFromTo = (name) => (event, values) => {
    if (name === 'From') {
      setNotificationFrom(values);
    } else if (name === 'To') setNotificationTo(values);
  };

  const reset = () => {
    setValues({
      apiDisabled: false,
      bodyAPI: '',
      messageDisabled: false,
      messageInternal: false,
      messageMail: false,
      messageNotification: '',
      notificationDisabled: false,
      policyName: '',
      selectedAction: '',
      selectedCatalogue: '',
      selectedIcon: '',
      subjectMessage: '',
      subjectNotification: '',
      urlAPI: ''
    });
    setMessageFrom([]);
    setMessageTo([]);
    setNotificationFrom([]);
    setNotificationTo([]);
    setEditor(EditorState.createEmpty());
  };

  const saveAndReload = (folderName, id) => {
    reloadTable();
  };

  const setSelectedControlAndIndexes = (event) => {
    const {
      target: { selectionStart, selectionEnd, name },
    } = event;
    setSelectedControl(name);
    setCursorPosition([selectionStart, selectionEnd]);
  };

  console.log('Users: ', users)

  useEffect(() => {
    getDB('user')
      .then((response) => response.json())
      .then((data) => {
        const users = data.response.map(({ _id, email, lastName, name }) => ({ _id, email, lastName, name }));
        setUsers(users);
      })
      .catch((error) => console.log(error));

    if (!id || !Array.isArray(id)) {
      return;
    }

    getOneDB('policies/', id[0])
      .then((response) => response.json())
      .then((data) => {
        const {
          layout,
          messageFrom,
          messageTo,
          notificationFrom,
          notificationTo
        } = data.response;
        const obj = pick(data.response, [
          'apiDisabled',
          'messageDisabled',
          'messageInternal',
          'messageMail',
          'messageNotification',
          'notifiactionDisabled',
          'policyName',
          'selectedAction',
          'selectedCatalogue',
          'subjectMessage',
          'subjectNotification',
          'selectedIcon',
          'urlAPI'
        ]);
        const contentBlock = htmlToDraft(layout);
        const contentState = ContentState.createFromBlockArray(
          contentBlock.contentBlocks
        );
        setValues(obj);
        setMessageFrom(messageFrom);
        setMessageTo(messageTo);
        setEditor(EditorState.createWithContent(contentState));
        setNotificationFrom(notificationFrom);
        setNotificationTo(notificationTo);
      })
      .catch((error) => console.log(error));
  }, [id, employeeProfileRows]);

  return (
    <div style={{ width: '1000px' }}>
      <Dialog
        aria-labelledby='customized-dialog-title'
        onClose={handleCloseModal}
        open={showModal}
      >
        <DialogTitle5 id='customized-dialog-title' onClose={handleCloseModal}>
          {`${id ? 'Edit' : 'Add'} Policies`}
        </DialogTitle5>
        <DialogContent5 dividers>
          <div className='kt-section__content ' style={{ margin: '-16px' }}>
            <div className={classes4.root} style={{ width: '1200px' }}>
              <div className='profile-tab-wrapper' style={{ margin: '0' }}>
                <div
                  name='Expansion Panel'
                  style={{ width: '95%', margin: '15px' }}
                >
                  <div className='__container-policies-tab'>
                    {/* Action and Catalogue */}
                    <div className='__container-policies-general-fields'>
                      <div className='__container-general-panel'>
                        <TextField
                          className={classes.textField}
                          id='standard-subjectMessage'
                          label='Policie Name'
                          margin='normal'
                          name='policyName'
                          onChange={handleChangeName('policyName')}
                          value={values.policyName}
                        />
                        <FormControl className={classes.textField}>
                          <InputLabel htmlFor='age-simple'>Action</InputLabel>
                          <Select
                            onChange={handleOnChangeValue('selectedAction')}
                            value={values.selectedAction}
                          >
                            {actions.map(({ value, label }) => (
                              <MenuItem key={value} value={value}>
                                {label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <FormControl className={classes.textField}>
                          <InputLabel htmlFor='age-simple'>
                            Catalogue
                          </InputLabel>
                          <Select
                            onChange={handleOnChangeValue('selectedCatalogue')}
                            value={values.selectedCatalogue}
                          >
                            {catalogues.map(({ value, label }) => (
                              <MenuItem key={value} value={value}>
                                {label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>
                      <div className='__container-policies-base-custom-fields'>
                        <div className='__container-baseandcustom-panel'>
                          <div className='__container-basefield'>
                            <h4>Base Fields</h4>
                            <BaseFieldAccordion
                              data={employeesFields}
                              onElementClick={insertVariable}
                            />
                          </div>
                          <div className='__container-customfield'>
                            <h4>Custom Fields</h4>
                            <CustomFieldAccordion
                              customFieldKey={['references']}
                              data={employeesFields}
                              onElementClick={insertVariable}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='__container-message-notification-api'>
                      {/* TABS */}
                      <div className='__container-policies-tabs'>
                        <PortletHeader
                          toolbar={
                            <PortletHeaderToolbar>
                              <Tabs
                                className='builder-tabs'
                                component='div'
                                onChange={(_, nextTab) => {
                                  setTab(nextTab);
                                  localStorage.setItem(
                                    localStorageActiveTabKey,
                                    nextTab
                                  );
                                }}
                                value={tab}
                              >
                                <Tab label='Send Message' />
                                <Tab label='Send Notification' />
                                <Tab label='Send API' />
                              </Tabs>
                            </PortletHeaderToolbar>
                          }
                        />
                      </div>
                      {/* Send Messages */}
                      {tab === 0 && (
                        <PortletBody>
                          <div className='__container-sendmessage-panel'>
                            <div className='__container-form-checkbox'>
                              <div className='__container-form'>
                                <Autocomplete
                                  className={classes.textField}
                                  defaultValue={messageFrom}
                                  id='tags-message-from'
                                  getOptionLabel={(option) => option.email}
                                  multiple
                                  onChange={onChangeMessageFromTo('From')}
                                  options={users}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label='From'
                                      variant='standard'
                                    />
                                  )}
                                  value={messageFrom}
                                />
                                <Autocomplete
                                  className={classes.textField}
                                  defaultValue={messageTo}
                                  getOptionLabel={(option) => option.email}
                                  id='tags-message-to'
                                  multiple
                                  onChange={onChangeMessageFromTo('To')}
                                  options={users}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label='To'
                                      variant='standard'
                                    />
                                  )}
                                  value={messageTo}
                                />
                                <TextField
                                  className={classes.textField}
                                  id='standard-subjectMessage'
                                  label='Subject'
                                  margin='normal'
                                  name='subjectMessage'
                                  onChange={handleChangeName('subjectMessage')}
                                  onClick={setSelectedControlAndIndexes}
                                  value={values.subjectMessage}
                                />
                              </div>
                              <div className='__container-checkbox'>
                                <FormControlLabel
                                  control={
                                    <Switch
                                      checked={values.messageDisabled}
                                      color='primary'
                                      onChange={handleChangeCheck(
                                        'messageDisabled'
                                      )}
                                    />
                                  }
                                  label='Disabled'
                                  labelPlacement='start'
                                  value='start'
                                />
                                <FormControlLabel
                                  control={
                                    <Switch
                                      checked={values.messageMail}
                                      color='primary'
                                      onChange={handleChangeCheck(
                                        'messageMail'
                                      )}
                                    />
                                  }
                                  label='Mail'
                                  labelPlacement='start'
                                  value='start'
                                />
                                <FormControlLabel
                                  control={
                                    <Switch
                                      checked={values.messageInternal}
                                      color='primary'
                                      onChange={handleChangeCheck(
                                        'messageInternal'
                                      )}
                                    />
                                  }
                                  label='Internal'
                                  labelPlacement='start'
                                  value='start'
                                />
                              </div>
                            </div>
                            <div
                              className='__container-policies-message'
                              onClick={() => setSelectedControl('htmlMessage')}
                            >
                              <Editor
                                editorClassName='editorClassName'
                                editorState={editor}
                                onEditorStateChange={(ed) => setEditor(ed)}
                                toolbarClassName='toolbarClassName'
                                wrapperClassName='wrapperClassName'
                              />
                            </div>
                          </div>
                        </PortletBody>
                      )}
                      {/* Send Notification */}
                      {tab === 1 && (
                        <PortletBody>
                          <div className='__container-sendnotification-panel'>
                            <div className='__container-form-checkbox'>
                              <div className='__container-form'>
                                <Autocomplete
                                  className={classes.textField}
                                  defaultValue={notificationFrom}
                                  getOptionLabel={(option) => option.email}
                                  id='tags-notification-from'
                                  multiple
                                  onChange={onChangeNotificationFromTo('From')}
                                  options={users}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label='From'
                                      variant='standard'
                                    />
                                  )}
                                  value={notificationFrom}
                                />
                                <Autocomplete
                                  className={classes.textField}
                                  defaultValue={notificationTo}
                                  getOptionLabel={(option) => option.email}
                                  id='tags-notification-to'
                                  multiple
                                  onChange={onChangeNotificationFromTo('To')}
                                  options={users}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      variant='standard'
                                      label='To'
                                    />
                                  )}
                                  value={notificationTo}
                                />
                                <TextField
                                  className={classes.textField}
                                  id='standard-subjectNotification'
                                  label='Subject'
                                  margin='normal'
                                  onChange={handleChangeName(
                                    'subjectNotification'
                                  )}
                                  onClick={() =>
                                    setSelectedControl('subjectNotification')
                                  }
                                  value={values.subjectNotification}
                                />
                              </div>
                              <div className='__container-checkbox-notification'>
                                <FormControlLabel
                                  control={
                                    <Switch
                                      color='primary'
                                      checked={values.notificationDisabled}
                                      onChange={handleChangeCheck(
                                        'notificationDisabled'
                                      )}
                                    />
                                  }
                                  label='Disabled'
                                  labelPlacement='start'
                                  value='start'
                                />
                                <div className='__container-icons'>
                                  <h6 className='iconSelected'>
                                    Icon selected:
                                    {iconsList[values.selectedIcon]}
                                  </h6>
                                  <div className='__box-icons'>
                                    {Object.keys(iconsList).map((key) => (
                                      <ToggleButtonGroup
                                        aria-label='text aligment'
                                        exclusive
                                        onChange={handleAlignment}
                                        value={alignment}
                                      >
                                        <ToggleButton
                                          className='notification-icons'
                                          id={key}
                                          key={key}
                                          onClick={() => handleClickIcon(key)}
                                          value={key}
                                        >
                                          <span
                                            style={{ color: 'black' }}
                                            value={key}
                                          >
                                            {iconsList[key]}
                                          </span>
                                        </ToggleButton>
                                      </ToggleButtonGroup>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className='__container-message-multiline'>
                              <TextField
                                className={classes.textField}
                                id='outlined-multiline-static'
                                label='Message'
                                margin='normal'
                                multiline
                                onChange={handleChangeName(
                                  'messageNotification'
                                )}
                                onClick={() =>
                                  setSelectedControl('messageNotification')
                                }
                                rows='4'
                                style={{ width: '100%' }}
                                value={values.messageNotification}
                              />
                            </div>
                          </div>
                        </PortletBody>
                      )}
                      {/* Send API */}
                      {tab === 2 && (
                        <PortletBody>
                          <div className='__container-send-api'>
                            <div className='__container-url-disabled'>
                              <div className='__container-url'>
                                <TextField
                                  className={classes.textField}
                                  id='standard-url'
                                  label='URL'
                                  margin='normal'
                                  onChange={handleChangeName('urlAPI')}
                                  style={{ width: '600px' }}
                                  value={values.urlAPI}
                                />
                              </div>
                              <div className='__container-disabled'>
                                <FormControlLabel
                                  value='start'
                                  control={
                                    <Switch
                                      checked={values.apiDisabled}
                                      color='primary'
                                      onChange={handleChangeCheck(
                                        'apiDisabled'
                                      )}
                                    />
                                  }
                                  label='Disabled'
                                  labelPlacement='start'
                                />
                              </div>
                            </div>
                            <div className='__container-post'>
                              <TextField
                                className={classes.textField}
                                id='outlined-multiline-static'
                                label='Body'
                                margin='normal'
                                multiline
                                onChange={handleChangeName('bodyAPI')}
                                rows='4'
                                style={{ width: '100%' }}
                                value={values.bodyAPI}
                              />
                            </div>
                          </div>
                        </PortletBody>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent5>
        <DialogActions5>
          <Button onClick={handleSave} color='primary'>
            Save changes
          </Button>
        </DialogActions5>
      </Dialog>
    </div>
  );
};

export default ModalPolicies;
