import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { Editor } from 'react-draft-wysiwyg';
import {
  EditorState,
  ContentState,
  convertToRaw,
  Modifier
} from 'draft-js';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Switch,
  TextField,
  Typography
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles, useTheme, makeStyles } from '@material-ui/core/styles';
import {
  PortletBody
} from '../../../../../app/partials/content/Portlet';
import {
  getDB,
  getOneDB,
  updateDB
} from '../../../../crud/api';
import {
  SingleLine,
  MultiLine,
  Date,
  DateTime,
  DropDown,
  RadioButtons,
  FileUpload,
  Checkboxes
} from '../../Components/CustomFields/CustomFieldsPreview';
import './ModalReportsSaved.scss';

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
    fileUpload: <FileUpload {...props} />
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
    padding: theme.spacing(2)
  }
}))(DialogContent);

const DialogActions5 = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1)
  }
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

const ModalReportsSaved = ({
  data,
  reloadTable,
  setShowModal,
  showModal
}) => {

  const activeTab = localStorage.getItem(localStorageActiveTabKey);
  const classes = useStyles();
  const classes4 = useStyles4();
  const [editor, setEditor] = useState(EditorState.createEmpty());
  const [daysToSent, setDaysToSent] = useState([])
  const [from, setFrom] = useState([]);
  const [selectedControl, setSelectedControl] = useState(null);
  const [to, setTo] = useState([]);
  const [users, setUsers] = useState([]);
  const [value4, setValue4] = useState(0);
  const [values, setValues] = useState({
    enabled: false,
    subject: ''
  });

  const handleChangeCheck = (name) => (event) => {
    setValues({ ...values, [name]: event.target.checked });
  };

  const handleChangeName = (name) => (event) => {
    const text = event.target.value;
    setValues({ ...values, [name]: text });
    setSelectedControlAndIndexes(event);
  };

  const handleCloseModal = () => {
    reset();
    setShowModal(false);
    setValue4(0);
    reloadTable();
  };

  const handleSave = () => {
    const layout = draftToHtml(convertToRaw(editor.getCurrentContent()));
    const body = {
      ...values,
      from,
      to,
      layout,
      selectedDaysToSent: daysToSent
    };
    updateDB('reports/', body, data._id)
      .then((response) => {
        })
      .catch((error) => console.log(error));
    handleCloseModal();
  };

  const onChangeReportFromTo = (name) => (event, values) => {
    if (name === 'From') {
      setFrom(values);
    } else if (name === 'To') { 
      setTo(values)
    };
  };

  const reset = () => {
    setEditor(EditorState.createEmpty());
    setValues({
      enabled: false,
      subject: ''
    });
    setFrom([]);
    setTo([]);
    setDaysToSent([]);
  };

  const setSelectedControlAndIndexes = (event) => {
    const {
      target: { selectionStart, selectionEnd, name }
    } = event;
    setSelectedControl(name);
  };

  useEffect(() => {
    getDB('user')
      .then((response) => response.json())
      .then((data) => {
        const users = data.response.map(({ 
          _id, 
          email, 
          lastName, 
          name 
        }) => ({ _id, email, lastName, name }));
        setUsers(users);
      })
      .catch((error) => console.log(error));

      if (Object.keys(data).length > 0) {
        const { enabled, subject, from, selectedDaysToSent, layout, to } = data
        if (layout) {
          const contentBlock = htmlToDraft(layout);
          const contentState = ContentState.createFromBlockArray(
            contentBlock.contentBlocks
            );
          setEditor(EditorState.createWithContent(contentState));
        } else {
          setEditor(EditorState.createEmpty());
        }
        setValues({ enabled, subject })
        setFrom(from)
        setTo(to)
        setDaysToSent(selectedDaysToSent)
      }
  }, [data]);

  const daysOptions = Array(31).fill().map((_, ix) => ({ value: ix + 1, label: ix + 1}))

  return (
    <div style={{ width: '1000px' }}>
      <Dialog
        aria-labelledby='customized-dialog-title'
        onClose={handleCloseModal}
        open={showModal}
      >
        <DialogTitle5 id='customized-dialog-title' onClose={handleCloseModal}>
          Edit Reports
        </DialogTitle5>
        <DialogContent5 dividers>
          <div className='kt-section__content ' style={{ margin: '-16px' }}>
            <div className={classes4.root} style={{ width: '1200px' }}>
              <div className='profile-tab-wrapper' style={{ margin: '0' }}>
                <div
                  name='Expansion Panel'
                  style={{ width: '95%', margin: '15px' }}
                >
                  <div className='__container-reports'>
                    <div className='__container-reports-modal'>
                        <PortletBody>
                          <div className='__container-reports-panel'>
                            <div className='__container-reports-form-checkbox'>
                              <div className='__container-reports-form'>
                                <Autocomplete
                                  className={classes.textField}
                                  defaultValue={from}
                                  id='tags-report-from'
                                  getOptionLabel={(option) => option.email}
                                  multiple
                                  onChange={onChangeReportFromTo('From')}
                                  options={users}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label='From'
                                      variant='standard'
                                    />
                                  )}
                                  value={from}
                                />
                                <Autocomplete
                                  className={classes.textField}
                                  defaultValue={to}
                                  getOptionLabel={(option) => option.email}
                                  id='tags-report-to'
                                  multiple
                                  onChange={onChangeReportFromTo('To')}
                                  options={users}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label='To'
                                      variant='standard'
                                    />
                                  )}
                                  value={to}
                                />
                                <TextField
                                  className={classes.textField}
                                  id='standard-subject'
                                  label='Subject'
                                  margin='normal'
                                  name='subject'
                                  onChange={handleChangeName('subject')}
                                  onClick={setSelectedControlAndIndexes}
                                  value={values.subject}
                                />
                              </div>
                              <div className='__container-checkbox-days'>
                                <FormControlLabel
                                  control={
                                    <Switch
                                      checked={values.enabled}
                                      color='primary'
                                      onChange={handleChangeCheck(
                                        'enabled'
                                      )}
                                    />
                                  }
                                  label='Automatic Delivery'
                                  labelPlacement='start'
                                  value='start'
                                />
                                <div className="">
                                  <FormLabel style={{ marginTop: '25px' }} component="legend">Days</FormLabel>
                                  <FormGroup className='reports-days'>
                                      <Select
                                        isMulti
                                        classNamePrefix="select"
                                        isClearable={true}
                                        name="days"
                                        onChange={setDaysToSent}
                                        value={daysToSent}
                                        options={daysOptions}
                                      />
                                  </FormGroup>
                                </div>
                              </div>
                            </div>
                            <div
                              className='__container-reports-message'
                              onClick={() => setSelectedControl('htmlMessage')}
                            >
                              <FormLabel style={{ paddingBottom: '15px' }} component="legend">Message Body</FormLabel>
                              <Editor
                                editorClassName='editorClassName'
                                editorState={editor}
                                onEditorStateChange={(ed) => setEditor(ed)}
                                placeholder='Start wirtting your message here...'
                                toolbarClassName='toolbarClassName'
                                wrapperClassName='wrapperClassName'
                              />
                            </div>
                          </div>
                        </PortletBody>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent5>
        <DialogActions5>
          <Button color='primary' onClick={handleSave}>
            Save changes
          </Button>
        </DialogActions5>
      </Dialog>
    </div>
  );
};

export default ModalReportsSaved;
