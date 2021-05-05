import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { pick } from 'lodash';
import {
  ContentState,
  convertToRaw,
  EditorState,
  Modifier
} from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  FormControl,
  FormControlLabel,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
  withStyles,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import {
  PortletBody,
  PortletHeader,
  PortletHeaderToolbar
} from '../../../../../a../../../app/partials/content/Portlet';
import { actions } from '../../../../../store/ducks/general.duck';
import {
  getDB,
  getDBComplex,
  getOneDB,
  updateDB,
  postDB
} from '../../../../../crud/api';
import BaseFieldAccordion from '../components/BaseFieldsAccordion';
import CustomFieldAccordion from '../components/CustomFieldsAccordion';
import { extractCustomFieldId } from '../../../Reports/reportsHelpers';
import './ModalPolicies.scss';

const localStorageActiveTabKey = 'builderActiveTab';

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
  showModal,
  baseFields
}) => {
  const dispatch = useDispatch();
  const { showErrorAlert, showCustomAlert, showSavedAlert, showSelectValuesAlert, showUpdatedAlert } = actions;
  const [alignment, setAlignment] = useState('');
  const [customFields, setCustomFields] = useState([]);
  const actionsReader = [
    { value: 'OnAdd', label: 'On Add' },
    { value: 'OnEdit', label: 'On Edit' },
    { value: 'OnDelete', label: 'On Delete' },
    { value: 'OnLoad', label: 'On Load' }
  ];
  const modules = [
    { id: 'user', name: 'Users', custom: 'userProfiles' },
    { id: 'employees', name: 'Employees', custom: 'employeeProfiles' },
    { id: 'locations', name: 'Locations', custom: 'locations' },
    { id: 'categories', name: 'Categories', custom: 'categories' },
    { id: 'references', name: 'References', custom: 'categories' },
    { id: 'assets', name: 'Assets', custom: 'categories' },
    { id: 'depreciation', name: 'Depreciation', custom: '' },
    { id: 'processes', name: 'Processes', custom: '' },
    { id: 'inventories', name: 'Inventories', custom: '' }
  ];
  const activeTab = localStorage.getItem(localStorageActiveTabKey);
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
  const [selectedControl, setSelectedControl] = useState(null);
  const [tab, setTab] = useState(activeTab ? +activeTab : 0);
  const [users, setUsers] = useState([]);
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
    token: '',
    tokenDisabled: true,
    urlAPI: ''
  });

  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
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
  };

  const handleOnChangeValue = (name) => (event) => {
    const { target: { value } } = event;
    setValues({ ...values, [name]: value });
  };

  const handleBodyAPI = () => {
    let jsonBodyAPI = '';

    try {
      jsonBodyAPI = JSON.parse(values.bodyAPI);

      if (typeof jsonBodyAPI !== 'object') {
        jsonBodyAPI = JSON.parse('{}');
      }

    } catch (error) {
      jsonBodyAPI = JSON.parse('{}');
    }

    return jsonBodyAPI
  }

  const handleSave = () => {
    const { selectedAction, selectedCatalogue } = values;
    if (!selectedAction || !selectedCatalogue) {
      dispatch(showSelectValuesAlert());
      return;
    }
    const layout = draftToHtml(convertToRaw(editor.getCurrentContent()));
    const jsonBodyAPI = handleBodyAPI();

    const body = {
      ...values,
      bodyAPI: JSON.stringify(jsonBodyAPI, null, 2),
      messageFrom,
      messageTo,
      layout,
      notificationFrom,
      notificationTo,
      module
    };

    console.log(body);

    if (!id) {
      postDB('policies', body)
        .then((data) => data.json())
        .then((response) => {
          const { _id } = response.response[0];
          dispatch(showSavedAlert());
          saveAndReload('policies', _id);
        })
        .catch((error) => dispatch(showErrorAlert()));
    } else {
      updateDB('policies/', body, id[0])
        .then((response) => {
          dispatch(showUpdatedAlert());
          saveAndReload('policies', id[0]);
        })
        .catch(error => dispatch(showErrorAlert()));
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
      const text = values[selectedControl];

      if (!text) {
        dispatch(showCustomAlert({
          type: 'warning',
          message: 'Please focus the message body to insert a field',
          open: true
        }));

        return;
      }

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

  useEffect(() => {
    getDB('user')
      .then((response) => response.json())
      .then((data) => {
        const users = data.response.map(({ _id, email, lastName, name }) => ({ _id, email, lastName, name }));
        setUsers(users);
      })
      .catch(error => dispatch(showErrorAlert()));

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
        let obj = pick(data.response, [
          'apiDisabled',
          'bodyAPI',
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
          'urlAPI',
          'token',
          'tokenDisabled'
        ]);

        console.log(obj);
        
        obj = !obj.token && obj.tokenDisabled === undefined ? { ...obj, token: '', tokenDisabled: true } : obj;

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
      .catch(error => dispatch(showErrorAlert()));
  }, [id, employeeProfileRows]);

  useEffect(() => {
    const collection = modules.filter(({ id }) => id === module)[0];
    getDBComplex({
      collection: collection?.custom,
      customQuery: JSON.stringify({ "customFieldsTab": { "$ne": {} } })
    })
      .then(response => response.json())
      .then(data => {
        const { response } = data;
        //Get just the CustomFields
        let customFieldNames = {};
        const rowToObjectsCustom = response.map(row => {
          let filteredCustomFields = {};
          const { customFieldsTab } = row;
          Object.values(customFieldsTab || {}).forEach(tab => {
            const allCustomFields = [...tab.left, ...tab.right];
            allCustomFields.map(field => {
              filteredCustomFields = { ...filteredCustomFields, ...extractCustomFieldId(field) };
            });
          });
          const filtered = { [row.name]: filteredCustomFields };
          customFieldNames = { ...customFieldNames, filtered };
          return { name: row.name, customFields: filteredCustomFields };
        })
        setCustomFields(rowToObjectsCustom.filter(({ customFields }) => Object.keys(customFields).length));
      })
      .catch(error => console.log('error>', error));
  }, [module]);

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
                            {actionsReader.map(({ value, label }) => (
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
                            {
                              Object.keys(baseFields).map((keyName) => (
                                <MenuItem key={keyName} value={keyName}>
                                  {keyName.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())))}
                                </MenuItem>
                              ))
                            }
                          </Select>
                        </FormControl>
                      </div>
                      <div className='__container-policies-base-custom-fields'>
                        <div className='__container-baseandcustom-panel'>
                          <div className='__container-basefield'>
                            <h4>Base Fields</h4>
                            <BaseFieldAccordion
                              data={baseFields}
                              onElementClick={insertVariable}
                            />
                          </div>
                          <div className='__container-customfield'>
                            <h4>Custom Fields</h4>
                            <CustomFieldAccordion
                              customFieldKey={['references']}
                              data={customFields}
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
                            <div className='__container-post'>
                              <div className='token_textField'>
                                <TextField
                                  className={classes.textField}
                                  id='standard-url'
                                  label='URL'
                                  margin='normal'
                                  onChange={handleChangeName('urlAPI')}
                                  style={{ width: '90%' }}
                                  value={values.urlAPI}
                                />
                                <FormControlLabel
                                  value='start'
                                  control={
                                    <Switch
                                      checked={values.apiDisabled}
                                      color='primary'
                                      onChange={handleChangeCheck('apiDisabled')}
                                    />
                                  }
                                  label='Disabled'
                                  labelPlacement='start'
                                />
                              </div>
                            </div>
                            <div className='__container-post'>
                              <div className='token_textField'>
                                <TextField
                                  className={classes.textField}
                                  id="Token-TextField"
                                  label="Web Token"
                                  margin="normal"
                                  onChange={handleChangeName('token')}
                                  style={{ width: '90%' }}
                                  value={values.token}
                                />
                                <FormControlLabel
                                  value='start'
                                  control={
                                    <Switch
                                      checked={values.tokenDisabled}
                                      color="primary"
                                      onChange={handleChangeCheck('tokenDisabled')}
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
                                style={{ width: '90%' }}
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
