import React, { useState, useEffect, useRef } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Select from 'react-select';
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
} from '../../../../../app/partials/content/Portlet';
import {
  postDBEncryptPassword,
  getDB,
  getOneDB,
  updateDB,
  postDB
} from '../../../../crud/api';
// import CustomFields from '../../../Components/CustomFields/CustomFields';
import TreeView from '../../Components/TreeViewComponent';
import ImageUpload from '../../Components/ImageUpload';
import ModalYesNo from '../../Components/ModalYesNo';
import { getFileExtension, saveImage, getImageURL } from '../../utils';
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
// import BaseFieldAccordion from '../components/BaseFieldsAccordion';
// import CustomFieldAccordion from '../components/CustomFieldsAccordion';
import './ModalReportsSaved.scss';
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

const ModalReportsSaved = ({
  employeeProfileRows,
  id,
//   module,
  reloadTable,
  setShowModal,
  showModal
}) => {
  const [alignment, setAlignment] = useState('');
  const activeTab = localStorage.getItem(localStorageActiveTabKey);
  const classes = useStyles();
  const classes4 = useStyles4();
  const [editor, setEditor] = useState(EditorState.createEmpty());
  const [daysToSent, setDaysToSent] = useState([])
  const [reportFrom, setReportFrom] = useState([]);
  const [reportTo, setReportTo] = useState([]);
  const [profileSelected, setProfileSelected] = useState(0);
  const [selectedControl, setSelectedControl] = useState(null);
  const [tab, setTab] = useState(activeTab ? +activeTab : 0);
  const theme4 = useTheme();
  const [users, setUsers] = useState([]);
  const [value4, setValue4] = useState(0);
  const [values, setValues] = useState({
    reportEnabled: false,
    subjectReport: '',
    reportDays: null
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

  const handleCloseModal = () => {
    reset();
    setShowModal(false);
    setValue4(0);
    reloadTable()
  };

  const handleOnChangeValue = (name) => (event) => {
    const { target: { value } } = event;
    setValues({ ...values, [name]: value });
  };

  const handleSave = () => {
    // const { selectedAction, selectedCatalogue } = values;
    // if (!selectedAction || !selectedCatalogue) {
    //   alert('Select values before saving...');
    //   return;
    // }
    const layout = draftToHtml(convertToRaw(editor.getCurrentContent()));
    const body = {
      ...values,
      reportFrom,
      reportTo,
      layout,
      selectedDaysToSent: daysToSent
    //   module
    };
    // if (!id) {
    //   postDB('reports', body)
    //     .then((data) => data.json())
    //     .then((response) => {
    //       const { _id } = response.response[0];
    //       saveAndReload('reports', _id);
    //     })
    //     .catch((error) => console.log('ERROR', error));
    // } else {
      updateDB('reports/', body, id[0])
        .then((response) => {
          saveAndReload('reports', id[0]);
        })
        .catch((error) => console.log(error));
    // }
    handleCloseModal();
  };

  const onChangeReportFromTo = (name) => (event, values) => {
    if (name === 'From') {
      setReportFrom(values);
    } else if (name === 'To') setReportTo(values);
  };

//   const handleOptionsDays = (name) => (event) => {
//     setValues({...values, [name]: })
// }

  const reset = () => {
    setValues({
      reportEnabled: false,
      policyName: '',
      selectedAction: '',
      selectedCatalogue: '',
      selectedIcon: '',
      subjectReport: '',
    });
    setReportFrom([]);
    setReportTo([]);
    setEditor(EditorState.createEmpty());
    setDaysToSent([])
  };

  const saveAndReload = (folderName, id) => {
    reloadTable();
  };

  const setSelectedControlAndIndexes = (event) => {
    const {
      target: { selectionStart, selectionEnd, name },
    } = event;
    setSelectedControl(name);
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

    getOneDB('reports/', id[0])
      .then((response) => response.json())
      .then((data) => {
        const {
          layout,
          reportFrom,
          reportTo,
          selectedDaysToSent
        } = data.response;
        const obj = pick(data.response, [
          'reportEnabled',
          'messageMail',
          'subjectReport',
        ]);
        const contentBlock = htmlToDraft(layout);
        const contentState = ContentState.createFromBlockArray(
          contentBlock.contentBlocks
        );
        setValues(obj);
        setReportFrom(reportFrom);
        setReportTo(reportTo);
        setDaysToSent(selectedDaysToSent)
        setEditor(EditorState.createWithContent(contentState));
      })
      .catch((error) => console.log(error));
  }, [id, employeeProfileRows]);

  // const daysOptions = [
  //   { value: '1', label: '1' },
  //   { value: '2', label: '2' },
  //   { value: '3', label: '3' },
  // ];

// const daysOptions = []
// for (let i = 1 ; i < 32; i++){
//  daysOptions.push({ value: i, label: i})
// }

  const daysOptions = Array(31).fill().map((_, ix) => ({ value: ix + 1, label: ix + 1}))

  console.log('daysToSent: ', daysToSent)

  return (
    <div style={{ width: '1000px' }}>
      <Dialog
        aria-labelledby='customized-dialog-title'
        onClose={handleCloseModal}
        open={showModal}
      >
        <DialogTitle5 id='customized-dialog-title' onClose={handleCloseModal}>
          {`${id ? 'Edit' : 'Add'} Reports`}
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
                                  defaultValue={reportFrom}
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
                                  value={reportFrom}
                                />
                                <Autocomplete
                                  className={classes.textField}
                                  defaultValue={reportTo}
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
                                  value={reportTo}
                                />
                                <TextField
                                  className={classes.textField}
                                  id='standard-subjectReport'
                                  label='Subject'
                                  margin='normal'
                                  name='subjectReport'
                                  onChange={handleChangeName('subjectReport')}
                                  onClick={setSelectedControlAndIndexes}
                                  value={values.subjectReport}
                                />
                              </div>
                              <div className='__container-checkbox-days'>
                                <FormControlLabel
                                  control={
                                    <Switch
                                      checked={values.reportEnabled}
                                      color='primary'
                                      onChange={handleChangeCheck(
                                        'reportEnabled'
                                      )}
                                    />
                                  }
                                  label='Automatic Delivery'
                                  labelPlacement='start'
                                  value='start'
                                />
                                <div className="">
                                  <FormLabel style={{marginTop: '25px'}} component="legend">Days</FormLabel>
                                  <FormGroup className='reports-days'>
                                      <Select
                                        isMulti
                                        classNamePrefix="select"
                                        isClearable={true}
                                        name="days"
                                        onChange={(e) => setDaysToSent(e)}
                                        value={daysToSent}
                                        options={daysOptions}
                                        // options={handleOptionsDays('reportDays')}
                                      />
                                  </FormGroup>
                                </div>
                              </div>
                            </div>
                            <div
                              className='__container-reports-message'
                              onClick={() => setSelectedControl('htmlMessage')}
                            >
                              <FormLabel style={{}} component="legend">Message Body</FormLabel>
                              <Editor
                                editorClassName='editorClassName'
                                editorState={editor}
                                onEditorStateChange={(ed) => setEditor(ed)}
                                toolbarClassName='toolbarClassName'
                                wrapperClassName='wrapperClassName'
                                placeholder='Start wirtting your message here...'
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
          <Button onClick={handleSave} color='primary'>
            Save changes
          </Button>
        </DialogActions5>
      </Dialog>
    </div>
  );
};

export default ModalReportsSaved;
