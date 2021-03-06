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
  Grid,
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
import { TabPanel } from '@material-ui/lab';
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
  button: {
    display: 'block',
    marginTop: theme.spacing(2)
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  customField: {
    marginLeft: '15px',
    width: '40%',
    [theme.breakpoints.down('sm')]: {
      marginLeft: '0px',
      marginTop: '0px',
      width: '100%'
    }
  },
  customFieldTitle: {
    display: 'flex',
    flexWrap: 'wrap',
    textAlign: 'justify',
    width: '80px',
    [theme.breakpoints.down('sm')]: {
      marginTop: '20px',
      width: 'auto'
    }
  },
  dense: {
    marginTop: 19
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  formControlLabel: {
    marginLeft: '10px'
  },
  menu: {
    width: 200
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200
  }
}));

const ModalPolicies = ({
  id,
  module,
  reloadTable,
  setPolicies,
  setShowModal,
  showModal,
  baseFields
}) => {
  const dispatch = useDispatch();
  const { showErrorAlert, showCustomAlert, showSavedAlert, showSelectValuesAlert, showUpdatedAlert } = actions;
  const [alignment, setAlignment] = useState('');
  const [customFields, setCustomFields] = useState([]);
  const [selectedCustomFieldTab, setSelectedCustomFieldTab] = useState();
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
  const classes = useStyles();
  const classes4 = useStyles4();
  const [cursorPosition, setCursorPosition] = useState([0, 0]);
  const [editor, setEditor] = useState(EditorState.createEmpty());
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
  const [tab, setTab] = useState(0);
  const [onLoadTab, setOnLoadTab] = useState(0);
  const [users, setUsers] = useState([]);
  const [values, setValues] = useState({
    apiDisabled: false,
    bodyAPI: '',
    messageDisabled: false,
    messageInternal: false,
    messageMail: false,
    messageNotification: '',
    notificationDisabled: false,
    onLoadDisabled: true,
    onLoadFields: {},
    policyName: '',
    selectedAction: '',
    selectedCatalogue: '',
    selectedIcon: '',
    selectedOnLoadCategory: {},
    subjectMessage: '',
    subjectNotification: '',
    token: '',
    tokenEnabled: false,
    tokenOnLoad: '',
    tokenOnLoadEnabled: false,
    urlAPI: '',
    urlOnLoad: ''
  });

  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  const handleCustomFieldInputChange = (customField) => (event) => {
    const text = event.target.value;
    setValues(prev => ({
      ...prev,
      onLoadFields: {
        ...prev.onLoadFields,
        [customField.id]: text
      }
    }));
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

    if (name === 'selectedOnLoadCategory') {
      setOnLoadTab(0);
      const { left, right } = value.rawCF['tab-0'];
      const res = [...left, ...right];
      const onlyTextCustomFields = res.filter((e) => ['singleLine', 'multiLine'].includes(e.content));
      setValues(prev => {
        let inputs = {};
        onlyTextCustomFields.forEach((customField) => {
          if (inputs[customField.id] === null || inputs[customField.id] === undefined) {
            inputs = { ...inputs, [customField.id]: '' };
          }
        });
        return { ...prev, onLoadFields: inputs };
      });
      setSelectedCustomFieldTab(onlyTextCustomFields);
    }

    if (name === 'selectedAction' && values.selectedAction === 'OnLoad' && value !== 'OnLoad') setTab(0);

    if ((value === 'OnLoad' && values.selectedCatalogue.length) || (name === 'selectedCatalogue' && values.selectedAction.length)) {
      getDB('policies')
        .then((res) => res.json())
        .then(({ response }) => {
          const valid = response.find((policy) => policy.module === module && policy.selectedAction === 'OnLoad' && policy.selectedCatalogue === (name === 'selectedCatalogue' ? value : values.selectedCatalogue));
          if (valid) {
            dispatch(
              showCustomAlert(({
                open: true,
                type: 'warning',
                message: `An on load policy that targets ${(name === 'selectedCatalogue' ? value : values.selectedCatalogue)} catalogue already exists. You should be aware what category is selected in that policy in order to avoid on load conflicts.`
              }))
            );
          }
        })
        .catch((error) => console.log(error));
    }

    if (value === 'OnLoad') {
      setTab(3);
      const lastModuleCatalogue = module === 'assets' ? 'categories' : 'references';
      if (values.selectedCatalogue === lastModuleCatalogue) {
        setValues({ ...values, selectedCatalogue: Object.keys(baseFields)[0], [name]: value });
        return;
      }
    };

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

    if (!id) {
      postDB('policies', body)
        .then((data) => data.json())
        .then((response) => {
          const { _id } = response.response[0];
          dispatch(showSavedAlert());
          saveAndReload('policies', _id);
          getDB('policies')
            .then((response) => response.json())
            .then((data) => setPolicies(data.response))
            .catch((error) => console.log(error));
        })
        .catch((error) => dispatch(showErrorAlert()));
    } else {
      updateDB('policies/', body, id[0])
        .then((response) => {
          dispatch(showUpdatedAlert());
          saveAndReload('policies', id[0]);
          getDB('policies')
            .then((response) => response.json())
            .then((data) => setPolicies(data.response))
            .catch((error) => console.log(error));
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
      try {
        const text = values[selectedControl];
        const left = text.substr(0, cursorPosition[0]);
        const right = text.substr(cursorPosition[1], text.length);
        const final = `${left}%{${varId}}${right}`;
        setValues({ ...values, [selectedControl]: final });
      } catch (error) {
        dispatch(showCustomAlert({
          message: 'Please select a field or message body to place variables',
          open: true,
          type: 'warning'
        }));
      }
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
      onLoadDisabled: true,
      onLoadFields: {},
      policyName: '',
      selectedAction: '',
      selectedCatalogue: '',
      selectedIcon: '',
      selectedOnLoadCategory: {},
      subjectMessage: '',
      subjectNotification: '',
      tokenOnLoad: '',
      tokenOnLoadEnabled: false,
      urlAPI: '',
      urlOnLoad: ''
    });
    setMessageFrom([]);
    setMessageTo([]);
    setNotificationFrom([]);
    setNotificationTo([]);
    setEditor(EditorState.createEmpty());
    setTab(0);
    setOnLoadTab(0);
    setSelectedCustomFieldTab();
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
          'onLoadDisabled',
          'onLoadFields',
          'policyName',
          'selectedAction',
          'selectedCatalogue',
          'selectedOnLoadCategory',
          'subjectMessage',
          'subjectNotification',
          'selectedIcon',
          'token',
          'tokenDisabled',
          'tokenEnabled',
          'tokenOnLoad',
          'tokenOnLoadEnabled',
          'urlAPI',
          'urlOnLoad',
        ]);

        obj = !obj.apiDisabled ? { ...obj, apiDisabled: false } : obj;

        obj = !obj.token ? { ...obj, token: '' } : obj;

        obj = !obj.bodyAPI ? { ...obj, bodyAPI: '' } : obj;

        obj = !obj.urlAPI ? { ...obj, urlAPI: '' } : obj;

        if (!obj.tokenEnabled && typeof obj.tokenEnabled !== 'boolean') {
          obj.tokenEnabled = false;
          delete obj.tokenDisabled;
        }

        obj = !obj.onLoadDisabled && typeof obj.onLoadDisabled !== 'boolean' ? { ...obj, onLoadDisabled: true } : obj;

        obj = !obj.onLoadFields ? { ...obj, onLoadFields: {} } : obj;

        obj = !obj.urlOnLoad ? { ...obj, urlOnLoad: '' } : obj;

        obj = !obj.selectedOnLoadCategory ? { ...obj, selectedOnLoadCategory: {} } : obj;

        obj = !obj.tokenEnabled && typeof obj.tokenEnabled !== 'boolean' ? { ...obj, tokenEnabled: false } : obj;

        obj = !obj.tokenOnLoad ? { ...obj, tokenOnLoad: '' } : obj;

        obj = !obj.tokenOnLoadEnabled && typeof obj.tokenOnLoadEnabled !== 'boolean' ? { ...obj, tokenOnLoadEnabled: false } : obj;

        if (Object.entries(obj.selectedOnLoadCategory).length > 0) {
          // update custom fields
          const currentCustomFields = customFields.find(({ id }) => id === obj.selectedOnLoadCategory.id);
          obj = currentCustomFields ? { ...obj, selectedOnLoadCategory: currentCustomFields } : obj;
          const { left, right } = obj.selectedOnLoadCategory.rawCF[`tab-0`];
          const res = [...left, ...right];
          const onlyTextCustomFields = res.filter((e) => ['singleLine', 'multiLine'].includes(e.content));
          setSelectedCustomFieldTab(onlyTextCustomFields);
        }

        if (obj.selectedAction === 'OnLoad') setTab(3);

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
      .catch(error => dispatch(showErrorAlert));
  }, [id]);

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
          return { name: row.name, customFields: filteredCustomFields, rawCF: row.customFieldsTab, id: row._id };
        })
        setCustomFields(rowToObjectsCustom.filter(({ customFields }) => Object.keys(customFields).length));
      })
      .catch(error => dispatch(showErrorAlert()));
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
                              Object.keys(baseFields).map((keyName, index) => {
                                if (values.selectedAction === 'OnLoad' && index === Object.entries(baseFields).length - 1) {
                                  return null;
                                }

                                return (
                                  <MenuItem key={keyName} value={keyName}>
                                    {keyName.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())))}
                                  </MenuItem>
                                );
                              })
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
                                onChange={(_, nextTab) => setTab(nextTab)}
                                value={tab}
                              >
                                <Tab
                                  label='Send Message'
                                  style={{ display: values.selectedAction === 'OnLoad' ? 'none' : null }}
                                />
                                <Tab
                                  label='Send Notification'
                                  style={{ display: values.selectedAction === 'OnLoad' ? 'none' : null }}
                                />
                                <Tab
                                  label='Send API'
                                  style={{ display: values.selectedAction === 'OnLoad' ? 'none' : null }}
                                />
                                {values.selectedAction === 'OnLoad' && (
                                  <Tab
                                    label="On Load"
                                    style={{ display: values.selectedAction === 'OnLoad' ? null : 'none' }}
                                  />
                                )}
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
                                  name="subjectNotification"
                                  onChange={handleChangeName('subjectNotification')}
                                  onClick={setSelectedControlAndIndexes}
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
                                  name="urlAPI"
                                  onChange={handleChangeName('urlAPI')}
                                  onClick={setSelectedControlAndIndexes}
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
                                <FormControlLabel
                                  classes={{
                                    labelPlacementStart: classes.formControlLabel
                                  }}
                                  control={
                                    <Switch
                                      checked={values.tokenEnabled}
                                      color="primary"
                                      onChange={handleChangeCheck('tokenEnabled')}
                                    />
                                  }
                                  label='Web Token'
                                  labelPlacement='start'
                                  value='start'
                                />
                                <TextField
                                  className={classes.textField}
                                  id="Token-TextField"
                                  label="Web Token"
                                  margin="normal"
                                  multiline
                                  onChange={handleChangeName('token')}
                                  style={{ width: '90%', marginLeft: '20px' }}
                                  value={values.token}
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
                                name="bodyAPI"
                                onChange={handleChangeName('bodyAPI')}
                                onClick={setSelectedControlAndIndexes}
                                rows='4'
                                style={{ width: '90%' }}
                                value={values.bodyAPI}
                              />
                            </div>
                          </div>
                        </PortletBody>
                      )}
                      {/* OnLoad Action */}
                      {tab === 3 && values.selectedAction === 'OnLoad' && (
                        <PortletBody>
                          <div className="__container-on-load">
                            <div className="__token-on-load-container">
                              <TextField
                                className={classes.textField}
                                id='onLoad-URL'
                                label='URL'
                                margin='normal'
                                name="urlOnLoad"
                                onChange={handleChangeName('urlOnLoad')}
                                onClick={setSelectedControlAndIndexes}
                                style={{ width: '90%' }}
                                value={values.urlOnLoad}
                              />
                              <FormControlLabel
                                value='start'
                                control={
                                  <Switch
                                    checked={values.onLoadDisabled}
                                    color='primary'
                                    onChange={handleChangeCheck('onLoadDisabled')}
                                  />
                                }
                                label='Disabled'
                                labelPlacement='start'
                              />
                            </div>
                            <div className="__token-on-load-container">
                              <FormControlLabel
                                value='start'
                                classes={{ labelPlacementStart: classes.formControlLabel }}
                                control={
                                  <Switch
                                    checked={values.tokenOnLoadEnabled}
                                    color='primary'
                                    onChange={handleChangeCheck('tokenOnLoadEnabled')}
                                  />
                                }
                                label='Web Token'
                                labelPlacement='start'
                              />
                              <TextField
                                className={classes.textField}
                                id='onLoad-tokenURL'
                                label='Web Token'
                                margin='normal'
                                multiline
                                onChange={handleChangeName('tokenOnLoad')}
                                style={{ width: '80%', marginLeft: '20px' }}
                                value={values.tokenOnLoad}
                              />
                            </div>
                            <FormControl style={{ marginBottom: '20px' }} className={classes.textField}>
                              <InputLabel htmlFor='age-simple'>
                                {module === 'assets' ? 'Category' : 'References'}
                              </InputLabel>
                              <Select
                                onChange={handleOnChangeValue('selectedOnLoadCategory')}
                                renderValue={selected => {
                                  if (values.selectedOnLoadCategory.name) {
                                    return values.selectedOnLoadCategory.name;
                                  }
                                  return '';
                                }}
                                value={values.selectedOnLoadCategory || ''}
                              >
                                {customFields.map((customField, index) => (
                                  <MenuItem key={`${customField.name}-${index}`} value={customField}>
                                    {customField.name.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())))}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              {Object.entries(values.selectedOnLoadCategory).length > 0 && (
                                <Tabs
                                  style={{ marginLeft: '10px' }}
                                  className='builder-tabs'
                                  component='div'
                                  onChange={(_, nextTab) => {
                                    setOnLoadTab(nextTab);
                                    const { left, right } = values.selectedOnLoadCategory.rawCF[`tab-${nextTab}`];
                                    const res = [...left, ...right];
                                    const onlyTextCustomFields = res.filter((e) => ['singleLine', 'multiLine'].includes(e.content));
                                    setValues(prev => {
                                      let inputs = prev.onLoadFields;
                                      onlyTextCustomFields.forEach((customField) => {
                                        if (inputs[customField.id] === null || inputs[customField.id] === undefined) {
                                          inputs = { ...inputs, [customField.id]: '' };
                                        }
                                      });
                                      return { ...prev, onLoadFields: inputs };
                                    });
                                    setSelectedCustomFieldTab(onlyTextCustomFields);
                                  }}
                                  value={onLoadTab}
                                >
                                  {Object.values(values.selectedOnLoadCategory.rawCF || {}).map(({ info: { name } }, index) => (
                                    <Tab key={`Tab-${index}`} label={name} />
                                  ))}
                                </Tabs>
                              )}
                              <Grid
                                container
                                direction="column"
                                style={{ paddingLeft: '10px', paddingRight: '10px' }}
                              >
                                {selectedCustomFieldTab && (
                                  selectedCustomFieldTab?.length ? (
                                    selectedCustomFieldTab.map((customField) => (
                                      <Grid
                                        alignItems="baseline"
                                        container
                                        direction="row"
                                        item
                                        justify="flex-start"
                                        key={customField.id}
                                      >
                                        <h6 className={classes.customFieldTitle}>
                                          {customField.values?.fieldName || customField.content}
                                        </h6>
                                        <TextField
                                          className={classes.customField}
                                          id={`TextField-${customField.id}`}
                                          label='Object Path'
                                          margin='normal'
                                          onChange={handleCustomFieldInputChange(customField)}
                                          value={values.onLoadFields[customField.id] || ''}
                                        />
                                      </Grid>
                                    )))
                                    : <h6 style={{ marginTop: '15px' }}> No Text Custom Fields Found In This Tab </h6>
                                )}
                              </Grid>
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
