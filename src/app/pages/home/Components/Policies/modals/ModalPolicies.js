import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { pick } from 'lodash';
import {
  ContentState,
  convertToRaw,
  EditorState,
  Modifier
} from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import NotificationImportantIcon from '@material-ui/icons/NotificationImportant';
import NotificationsIcon from '@material-ui/icons/Notifications';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import NotificationsOffIcon from '@material-ui/icons/NotificationsOff';
import NotificationsPausedIcon from '@material-ui/icons/NotificationsPaused';
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
import MessageTemplate from '../components/MessageTemplate';
import NotificationTemplate from '../components/NotificationTemplate';
import SendApiTemplate from '../components/SendApiTemplate';
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
    { value: 'OnLoad', label: 'On Load' },
    { value: 'OnField', label: 'On Field' }
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
  const rules = [
    { value: 'ruleOne', label: 'Rule 1' },
    { value: 'ruleTwo', label: 'Rule 2' },
    { value: 'ruleThree', label: 'Rule 3' }
  ];
  const classes = useStyles();
  const classes4 = useStyles4();
  const [cursorPosition, setCursorPosition] = useState([0, 0]);
  const [editor, setEditor] = useState(EditorState.createEmpty());
  const [onFieldEditor, setOnFieldEditor] = useState(EditorState.createEmpty());
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
  const [onFieldTab, setOnFieldTab] = useState(0);
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
    ruleOne: {},
    ruleThree: {},
    ruleTwo: {},
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

  const handleRuleOneChanges = (name) => (event) => {
    const value = event.target.value;
    setValues(prev => ({ ...prev, ruleOne: { ...prev.ruleOne, [name]: value } }));
  };

  const handleRuleOneChecks = (name) => (event) => {
    const value = event.target.checked;
    setValues(prev => ({ ...prev, ruleOne: { ...prev.ruleOne, [name]: value } }));
  };

  const handleRuleField = (rule) => (event) => {
    const text = event.target.value;
    setValues(prev => ({ ...prev, [rule]: { ...prev[rule], field: text } }));
  };

  const handleRuleValue = (rule) => (event) => {
    const text = event.target.value;
    setValues(prev => ({ ...prev, [rule]: { ...prev[rule], value: text } }));
  };

  const handleClickIcon = (selectedIcon) => {
    setValues({ ...values, selectedIcon });
  };

  const handleOnFieldClickIcon = (onFieldSelectedIcon) => {
    setValues({ ...values, onFieldSelectedIcon });
  };

  const handleCloseModal = () => {
    reset();
    setShowModal(false);
  };

  const displayOtherTabs = ['OnLoad', 'OnField'];

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

    if (name === 'selectedAction' && displayOtherTabs.includes(values.selectedAction) && !displayOtherTabs.includes(value)) {
      setTab(0);
    }

    if ((value === 'OnLoad' && values.selectedCatalogue.length) || (name === 'selectedCatalogue' && values.selectedAction === 'OnLoad')) {
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

    if (value === 'OnField') {
      setTab(4);
      setOnFieldTab(0);
    }

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

  const verifyOnField = () => {
    if (values.selectedAction === 'OnField') {
      if (!values.selectedRule) {
        dispatch(showCustomAlert({
          message: 'Please select a rule',
          open: true,
          type: 'warning'
        }));
        return false;
      }
      if (['ruleOne', 'ruleTwo'].includes(values.selectedRule)) {
        if (!values[values.selectedRule].field || !values[values.selectedRule].value) {
          dispatch(showCustomAlert({
            message: 'Please fill all the fields',
            open: true,
            type: 'warning'
          }));
          return false;
        }
      } else {
        if (!values.ruleThree.numberOfDays || !values.ruleThree.timesRepeated) {
          dispatch(showCustomAlert({
            message: 'Please fill all the fields',
            open: true,
            type: 'warning'
          }));
          return false;
        }
      }
    }

    return true;
  };

  const handleSave = () => {
    const { selectedAction, selectedCatalogue } = values;
    if (!selectedAction || !selectedCatalogue) {
      dispatch(showSelectValuesAlert());
      return;
    }

    if (!verifyOnField()) {
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
    } else if (selectedControl === 'onFieldHtmlMessage') {
      const contentState = Modifier.replaceText(
        onFieldEditor.getCurrentContent(),
        onFieldEditor.getSelection(),
        `%{${varId}}`,
        onFieldEditor.getCurrentInlineStyle()
      );
      setOnFieldEditor(EditorState.push(onFieldEditor, contentState, 'insert-characters'));
    } else if (rules.map(({ value }) => value).includes(selectedControl)) {
      if (selectedControl === 'ruleTwo') {
        let selectedCustomField;
        customFields.forEach(({ rawCF }) => {
          Object.entries(rawCF || {}).forEach((tab) => {
            const values = [...tab[1].left, ...tab[1].right];
            const found = values.find(({ id }) => id === varId);
            console.log(found)
            if (found) {
              selectedCustomField = found;
            }
          });
        });
        if (selectedCustomField?.content !== 'date') {
          dispatch(showCustomAlert({
            message: 'Please select a field of type date',
            open: true,
            type: 'warning'
          }));
          return;
        }
      }

      const text = values[selectedControl].field || '';
      const left = text.substr(0, cursorPosition[0]);
      const right = text.substr(cursorPosition[1], text.length);
      const final = `${left}%{${varId}}${right}`;
      setValues(prev => ({ ...prev, [selectedControl]: { ...prev[selectedControl], field: final } }));
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

  const onChangeOnFieldFromTo = (name, section) => (event, values) => {
    if (name === 'From') {
      if (section === 'messages') setValues(prev => ({ ...prev, onFieldMessageFrom: values }));
      if (section === 'notifications') setValues(prev => ({ ...prev, onFieldNotificationFrom: values }));
    } else {
      if (section === 'messages') setValues(prev => ({ ...prev, onFieldMessageTo: values }));
      if (section === 'notifications') setValues(prev => ({ ...prev, onFieldNotificationTo: values }));
    }
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
      ruleOne: {},
      ruleThree: {},
      ruleTwo: {},
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
    setOnFieldEditor(EditorState.createEmpty());
    setTab(0);
    setOnLoadTab(0);
    setOnFieldTab(0);
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
          'OnFieldApiDisabled',
          'onFieldBodyAPI',
          'onFieldEditor',
          'onFieldSelectedIcon',
          'onFieldMessageDisabled',
          'onFieldMessageFrom',
          'onFieldMessageInternal',
          'onFieldMessageMail',
          'onFieldMessageNotification',
          'onFieldMessageSubject',
          'onFieldMessageTo',
          'onFieldNotificationDisabled',
          'onFieldNotificationFrom',
          'onFieldNotificationSubject',
          'onFieldNotificationTo',
          'onFieldToken',
          'onFieldTokenEnabled',
          'onFieldUrlAPI',
          'onLoadDisabled',
          'onLoadFields',
          'policyName',
          'ruleOne',
          'ruleTwo',
          'ruleThree',
          'selectedAction',
          'selectedCatalogue',
          'selectedIcon',
          'subjectMessage',
          'subjectNotification',
          'selectedOnLoadCategory',
          'selectedRule',
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

        obj = !obj.ruleOne ? { ...obj, ruleOne: {} } : obj;

        obj = !obj.ruleTwo ? { ...obj, ruleTwo: {} } : obj;

        obj = !obj.ruleThree ? { ...obj, ruleThree: {} } : obj;

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
        setOnFieldEditor(EditorState.createWithContent(contentState));
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
                            {values.selectedCatalogue ? (
                              <BaseFieldAccordion
                                data={{ [values.selectedCatalogue]: baseFields[values.selectedCatalogue] }}
                                onElementClick={insertVariable}
                              />
                            ) : (
                              <div className="__base-fields-accordion__no-info"> Please select a catalogue </div>
                            )}
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
                                  style={{ display: displayOtherTabs.includes(values.selectedAction) ? 'none' : null }}
                                />
                                <Tab
                                  label='Send Notification'
                                  style={{ display: displayOtherTabs.includes(values.selectedAction) ? 'none' : null }}
                                />
                                <Tab
                                  label='Send API'
                                  style={{ display: displayOtherTabs.includes(values.selectedAction) ? 'none' : null }}
                                />
                                <Tab
                                  label="On Load"
                                  style={{ display: values.selectedAction !== 'OnLoad' ? 'none' : null }}
                                />
                                <Tab
                                  label="Rules"
                                  style={{ display: values.selectedAction !== 'OnField' ? 'none' : null }}
                                />
                                <Tab
                                  label="Result"
                                  style={{ display: values.selectedAction !== 'OnField' ? 'none' : null }}
                                />
                              </Tabs>
                            </PortletHeaderToolbar>
                          }
                        />
                      </div>
                      {/* Send Messages */}
                      {tab === 0 && (
                        <MessageTemplate
                          disablesOnChange={handleChangeCheck('messageDisabled')}
                          disabledValue={values.messageDisabled}
                          editor={editor}
                          editorStateChange={setEditor}
                          fromOnChange={onChangeMessageFromTo('From')}
                          fromOptions={users}
                          fromValue={messageFrom}
                          internalOnChange={handleChangeCheck('messageInternal')}
                          internalValue={values.messageInternal}
                          key="send-message"
                          mailOnChange={handleChangeCheck('messageMail')}
                          mailValue={values.messageMail}
                          setSelectedControl={() => setSelectedControl('htmlMessage')}
                          subjectName="subjectMessage"
                          subjectOnChange={handleChangeName('subjectMessage')}
                          subjectOnClick={setSelectedControlAndIndexes}
                          subjectValue={values.subjectMessage}
                          toOnChange={onChangeMessageFromTo('To')}
                          toOptions={users}
                          toValue={messageTo}
                        />
                      )}
                      {/* Send Notification */}
                      {tab === 1 && (
                        <NotificationTemplate
                          alignment={alignment}
                          disabledValue={values.notificationDisabled}
                          disablesOnChange={handleChangeCheck('notificationDisabled')}
                          handleAlignment={handleAlignment}
                          handleClickIcon={handleClickIcon}
                          key="send-notification"
                          messageOnChange={handleChangeName('messageNotification')}
                          messageValue={values.messageNotification}
                          notificationFromOnChange={onChangeNotificationFromTo('From')}
                          notificationFromOptions={users}
                          notificationFromValue={notificationFrom}
                          notificationToOnChange={onChangeNotificationFromTo('To')}
                          notificationToOptions={users}
                          notificationToValue={notificationTo}
                          selectedIcon={values.selectedIcon}
                          subjectNotificationName="subjectNotification"
                          subjectNotificationOnChange={handleChangeName('subjectNotification')}
                          subjectNotificationOnClick={setSelectedControlAndIndexes}
                          subjectNotificationValue={values.subjectNotification}
                          setSelectedControl={() => setSelectedControl('messageNotification')}
                        />
                      )}
                      {/* Send API */}
                      {tab === 2 && (
                        <SendApiTemplate
                          bodyFieldName="bodyAPI"
                          bodyOnChange={handleChangeName('bodyAPI')}
                          bodyValue={values.bodyAPI}
                          disabled={values.apiDisabled}
                          disabledOnChange={handleChangeCheck('apiDisabled')}
                          key="send-api"
                          setSelectedControlAndIndexes={setSelectedControlAndIndexes}
                          tokenEnabled={values.tokenEnabled}
                          tokenEnabledOnChange={handleChangeCheck('tokenEnabled')}
                          tokenOnChange={handleChangeName('token')}
                          tokenValue={values.token}
                          urlFieldName="urlAPI"
                          urlOnChange={handleChangeName('urlAPI')}
                          urlValue={values.urlAPI}
                        />
                      )}
                      {/* OnLoad Action */}
                      {tab === 3 && (
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
                      {tab === 4 && (
                        <>
                          <FormControl style={{ margin: '15px 0px 20px 20px' }} className={classes.textField}>
                            <InputLabel htmlFor='age-simple'>Selected rule</InputLabel>
                            <Select
                              onChange={handleOnChangeValue('selectedRule')}
                              value={values.selectedRule}
                            >
                              {rules.map(({ value, label }) => (
                                <MenuItem key={value} value={value}>
                                  {label}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          {values.selectedRule === 'ruleOne' && (
                            <div style={{ alignItems: 'flex-end', display: 'flex', flexDirection: 'row', paddingRight: '60px' }}>
                              <div className="__rules" style={{ marginLeft: '20px' }}>
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
                                  <Typography style={{ fontSize: '1.2rem', marginRight: '8px' }}>No. of days:</Typography>
                                  <TextField
                                    className={classes.textField}
                                    id='standard-rule-one-number-of-days'
                                    margin='normal'
                                    onChange={handleRuleOneChanges('numberOfDays')}
                                    style={{ width: '60px', marginBottom: '0px' }}
                                    type="number"
                                    value={values.ruleOne?.numberOfDays}
                                  />
                                </div>
                                <div style={{ marginBottom: '15px' }} />
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
                                  <Typography style={{ fontSize: '1.2rem', marginRight: '8px' }}>Repeat</Typography>
                                  <TextField
                                    className={classes.textField}
                                    id='standard-rule-one-times-repeated'
                                    margin='normal'
                                    onChange={handleRuleOneChanges('timesRepeated')}
                                    style={{ width: '60px', marginBottom: '0px' }}
                                    type="number"
                                    value={values.ruleOne?.timesRepeated}
                                  />
                                  <Typography style={{ fontSize: '1.2rem', marginLeft: '8px' }}>times</Typography>
                                </div>
                                <div style={{ marginBottom: '15px' }} />
                              </div>
                              <Grid container direction="column">
                                <FormControlLabel
                                  control={
                                    <Switch
                                      color='primary'
                                      checked={values.ruleOne.isInfinite || false}
                                      onChange={handleRuleOneChecks('isInfinite')}
                                    />
                                  }
                                  label='Infinite'
                                  labelPlacement='start'
                                  style={{ marginRight: '0px' }}
                                  value='start'
                                />
                                <FormControlLabel
                                  control={
                                    <Switch
                                      color='primary'
                                      checked={values.ruleOne.includeOriginalDate || false}
                                      onChange={handleRuleOneChecks('includeOriginalDate')}
                                    />
                                  }
                                  label='Include Original Date'
                                  labelPlacement='start'
                                  style={{ marginRight: '0px' }}
                                  value='start'
                                />
                              </Grid>
                            </div>
                          )}
                          {values.selectedRule === 'ruleTwo' && (
                            <div className="__rules" style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                              <TextField
                                className={classes.textField}
                                id='standard-rule-two-field'
                                margin='normal'
                                onClick={() => setSelectedControl('ruleTwo')}
                                onChange={handleRuleField('ruleTwo')}
                                style={{ width: '120px', marginBottom: '0px' }}
                                value={values.ruleTwo?.field}
                              />
                              <Typography style={{ fontSize: '1.2rem', marginLeft: '8px', marginRight: '8px' }}>is equal to:</Typography>
                              <TextField
                                className={classes.textField}
                                id='standard-rule-two-value'
                                margin='normal'
                                onChange={handleRuleValue('ruleThree')}
                                style={{ width: '120px', marginBottom: '0px' }}
                                type="date"
                                value={values.rulwTwo?.value}
                              />
                            </div>
                          )}
                          {values.selectedRule === 'ruleThree' && (
                            <div className="__rules" style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                              <TextField
                                className={classes.textField}
                                id='standard-rule-three-field'
                                margin='normal'
                                onClick={() => setSelectedControl('ruleThree')}
                                onChange={handleRuleField('ruleThree')}
                                style={{ width: '120px', marginBottom: '0px' }}
                                value={values.ruleThree?.field}
                              />
                              <Typography style={{ fontSize: '1.2rem', marginLeft: '8px', marginRight: '8px' }}>is equal to:</Typography>
                              <TextField
                                className={classes.textField}
                                id='standard-rule-three-value'
                                margin='normal'
                                onChange={handleRuleValue('ruleThree')}
                                style={{ width: '120px', marginBottom: '0px' }}
                                value={values.ruleThree?.value}
                              />
                            </div>
                          )}
                        </>
                      )}
                      {tab === 5 && (
                        <div style={{ marginLeft: '20px', marginBottom: '10px' }}>
                          <Tabs
                            className='builder-tabs'
                            component='div'
                            onChange={(_, nextTab) => setOnFieldTab(nextTab)}
                            value={onFieldTab}
                          >
                            <Tab label='Send Message' />
                            <Tab label="Send Notification" />
                            <Tab label="Send API" />
                          </Tabs>
                          {onFieldTab === 0 && (
                            <MessageTemplate
                              disablesOnChange={handleChangeCheck('onFieldMessageDisabled')}
                              disabledValue={values.onFieldMessageDisabled}
                              editor={onFieldEditor}
                              editorStateChange={setOnFieldEditor}
                              fromOnChange={onChangeOnFieldFromTo('From', 'messages')}
                              fromOptions={users}
                              fromValue={values.onFieldMessageFrom || []}
                              internalOnChange={handleChangeCheck('onFieldMessageInternal')}
                              internalValue={values.onFieldMessageInternal}
                              key="onField-message"
                              mailOnChange={handleChangeCheck('onFieldMessageMail')}
                              mailValue={values.onFieldMessageMail}
                              setSelectedControl={() => setSelectedControl('onFieldHtmlMessage')}
                              subjectName="onFieldMessageSubject"
                              subjectOnChange={handleChangeName('onFieldMessageSubject')}
                              subjectOnClick={setSelectedControlAndIndexes}
                              subjectValue={values.onFieldMessageSubject}
                              toOnChange={onChangeOnFieldFromTo('To', 'messages')}
                              toOptions={users}
                              toValue={values.onFieldMessageTo || []}
                            />
                          )}
                          {onFieldTab === 1 && (
                            <NotificationTemplate
                              alignment={alignment}
                              disabledValue={values.onFieldNotificationDisabled || false}
                              disablesOnChange={handleChangeCheck('onFieldNotificationDisabled')}
                              handleAlignment={handleAlignment}
                              handleClickIcon={handleOnFieldClickIcon}
                              key="onField-notification"
                              messageOnChange={handleChangeName('onFieldMessageNotification')}
                              messageValue={values.onFieldMessageNotification}
                              notificationFromOnChange={onChangeOnFieldFromTo('From', 'notifications')}
                              notificationFromOptions={users}
                              notificationFromValue={values.onFieldNotificationFrom || []}
                              notificationToOnChange={onChangeOnFieldFromTo('To', 'notifications')}
                              notificationToOptions={users}
                              notificationToValue={values.onFieldNotificationTo || []}
                              selectedIcon={values.onFieldSelectedIcon}
                              subjectNotificationName="onFieldNotificationSubject"
                              subjectNotificationOnChange={handleChangeName('onFieldNotificationSubject')}
                              subjectNotificationOnClick={setSelectedControlAndIndexes}
                              subjectNotificationValue={values.onFieldNotificationSubject}
                              setSelectedControl={() => setSelectedControl('onFieldMessageNotification')}
                            />
                          )}
                          {onFieldTab === 2 && (
                            <SendApiTemplate
                              bodyFieldName="onFieldBodyAPI"
                              bodyOnChange={handleChangeName('onFieldBodyAPI')}
                              bodyValue={values.onFieldBodyAPI || ''}
                              disabled={values.OnFieldApiDisabled || false}
                              disabledOnChange={handleChangeCheck('OnFieldApiDisabled')}
                              key="onField-api"
                              setSelectedControlAndIndexes={setSelectedControlAndIndexes}
                              tokenEnabled={values.onFieldTokenEnabled || false}
                              tokenEnabledOnChange={handleChangeCheck('onFieldTokenEnabled')}
                              tokenOnChange={handleChangeName('onFieldToken')}
                              tokenValue={values.onFieldToken}
                              urlFieldName="onFieldUrlAPI"
                              urlOnChange={handleChangeName('onFieldUrlAPI')}
                              urlValue={values.onFieldUrlAPI}
                            />
                          )}
                        </div>
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
