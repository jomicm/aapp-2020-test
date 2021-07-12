/* eslint-disable no-restricted-imports */
import React, { useState, useEffect } from 'react';
import { useDispatch } from "react-redux";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  TextField,
  FormControl,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  List,
  InputLabel,
  MenuItem,
  Select
} from "@material-ui/core";
import {
  withStyles,
  makeStyles
} from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { TreeItem, TreeView } from "@material-ui/lab";

import { actions } from '../../../../../store/ducks/general.duck';
import { getDB, getOneDB, updateDB, postDB } from '../../../../../crud/api';

import { Editor } from 'react-draft-wysiwyg';
import { EditorState, ContentState, convertToRaw, convertFromHTML, Modifier } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import './ModalLayoutStages.scss'

// Example 5 - Modal
const styles5 = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2)
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
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

const DialogContent5 = withStyles(theme => ({
  root: {
    padding: theme.spacing(2)
  }
}))(DialogContent);

const DialogActions5 = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(1)
  }
}))(DialogActions);

// Example 4 - Tabs
function TabContainer4({ children, dir }) {
  return (
    <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}
const useStyles4 = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 1000
  }
}));

// Example 1 - TextField
const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
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
  }
}));

const ModalLayoutStages = ({ showModal, setShowModal, reloadTable, id, employeeProfileRows }) => {
  const dispatch = useDispatch();
  const { showCustomAlert } = actions;
  // Example 4 - Tabs
  const classes4 = useStyles4();
    // Example 1 - TextField
  const classes = useStyles();
  const [values, setValues] = useState({
    name: ""
  });
  const [editor, setEditor] = useState(EditorState.createEmpty());
  const [stages, setStages] = useState([]);
  const [stageCustomFields, setStageCustomFields] = useState([]);

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleSave = () => {
    if(!values.name){
      dispatch(showCustomAlert({
        type: 'warning',
        open: true,
        message: `Please add a name`
      }));
      return;
    }
    if(!values.selectedStage){
      dispatch(showCustomAlert({
        type: 'warning',
        open: true,
        message: `Please select a stage`
      }));
      return;
    }
    if(!values.sendMessageAt){
      dispatch(showCustomAlert({
        type: 'warning',
        open: true,
        message: `Please select when to send the message`
      }));
      return;
    }
    const layout = draftToHtml(convertToRaw(editor.getCurrentContent()));    
    const body = { ...values, layout };

    if (!id) {
      postDB('settingsLayoutsStages', body)
        .then(data => data.json())
        .then(response => {
          const { _id } = response.response[0];
          saveAndReload('settingsLayoutsStages', _id);
        })
        .catch(error => console.log('ERROR', error));
    } else {
      updateDB('settingsLayoutsStages/', body, id[0])
        .then(response => {
          saveAndReload('settingsLayoutsStages', id[0]);
        })
        .catch(error => console.log(error));
    }
    handleCloseModal();
  };
  
  const saveAndReload = (folderName, id) => {
    reloadTable();
  };

  const handleCloseModal = () => {
    setValues({ 
      name: ""
    });
    setStageCustomFields([]);
    setShowModal(false);
    setEditor(EditorState.createEmpty());
    setStages([]);
  };

  useEffect(() => {
    if(!id || !Array.isArray(id)) {
      return;
    }

    getOneDB('settingsLayoutsStages/', id[0])
      .then(response => response.json())
      .then(data => { 
        const { name, selectedType, selectedStage, layout = '<p></p>',  sendMessageAt, stageName } = data.response;
        setValues({ ...values, name, selectedType, selectedStage, sendMessageAt, stageName });
        // htmlToDraft
        // setEditor(EditorState.createWithContent(htmlToDraft(layout)));
        const contentBlock = htmlToDraft(layout);
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        setEditor(EditorState.createWithContent(contentState));
      })
      .catch(error => console.log(error));
  }, [id, employeeProfileRows]);

  useEffect(() => {
    getDB('processStages')
    .then(response => response.json())
    .then(data => {
      const stages = data.response.map(({ _id, name }) => ({ id: _id, name }));
      setStages(stages);
    })
    .catch(error => console.log(error));
  }, [showModal])
  
  useEffect(() => {
    if (values.selectedStage) {
      getOneDB('processStages/', values.selectedStage)
      .then(response => response.json())
      .then(data => { 
        const allCustomFields = []
        Object.values(data.response.customFieldsTab || {}).forEach(tab => {
          const localCustomFields = [...tab.left, ...tab.right];
          allCustomFields.push(...localCustomFields);
        });
        setStageCustomFields(allCustomFields);
        setValues({ ...values, stageName: data.response.name });
      })
      .catch(error => console.log(error));
    }
    else {
      setStageCustomFields([]);
    }
  }, [values.selectedStage])

  const stageVariables = [
    {id: 'stageName', name: 'Stage Name'}, 
    {id: 'creationDate', name: 'Process Creation Date'}, 
    {id: 'creator', name: 'Creator'}, 
    {id: 'approvals', name: 'Approvals'},
    {id: 'notifications', name: 'Notifications'}
  ];

  const insertVariable = (varId) => {
    const contentState = Modifier.replaceText(
      editor.getCurrentContent(),
      editor.getSelection(),
      `%{${varId}}`,
      editor.getCurrentInlineStyle(),
    );
    setEditor(EditorState.push(editor, contentState, 'insert-characters'))
  };
  
  return (
    <div style={{width:'1000px'}}>
      <Dialog
        onClose={handleCloseModal}
        aria-labelledby="customized-dialog-title"
        open={showModal}
      >
        <DialogTitle5
          id="customized-dialog-title"
          onClose={handleCloseModal}
        >
          {`${id ? 'Edit' : 'Add' } Layout for Process Stages`}
        </DialogTitle5>
        <DialogContent5 dividers>
          <div className="kt-section__content" style={{margin:'-16px'}}>
            <div className={classes4.root}>
              <div className="profile-tab-wrapper">
                <div name="Expansion Panel" style={{ width: '95%', margin: '15px' }}>
                  {/* Custom Controls */}
                  <ExpansionPanel defaultExpanded={true}>
                    <ExpansionPanelSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography className={classes.heading}>Layout Info</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                        <TextField
                          id="standard-name"
                          label="Name"
                          // className='tab-properties-wrapper__tab-name'
                          value={values.name}
                          onChange={handleChange('name')}
                          margin="normal"
                          style={{ marginTop: 'unset', width: '33%', margin: '0 20px' }}
                        />
                        <FormControl
                          className={classes.textField}
                          style={{ width: '33%', margin: '0 20px' }}
                        >
                          <InputLabel>Send:</InputLabel>
                          <Select
                            value={values.sendMessageAt || ''}
                            onChange={handleChange('sendMessageAt')}
                          >
                            <MenuItem value={'end'}>At the end</MenuItem>
                            <MenuItem value={'start'}>At the start</MenuItem>
                          </Select>
                        </FormControl>
                        {/* <FormControl
                          className={classes.textField}
                          style={{ width: '33%', margin: '0 20px' }}
                        >
                          <InputLabel>Type:</InputLabel>
                          <Select
                            value={values.selectedType || ''}
                            onChange={handleChange('selectedType')}
                          >
                            <MenuItem value={'message'}>Message</MenuItem>
                            <MenuItem value={'notification'}>Notification</MenuItem>
                            <MenuItem value={'document'}>Document</MenuItem>
                          </Select>
                        </FormControl> */}
                        <FormControl
                          className={classes.textField}
                          style={{ width: '33%', margin: '0 20px' }}
                        >
                          <InputLabel>Stage:</InputLabel>
                          <Select
                            value={values.selectedStage || ''}
                            onChange={handleChange('selectedStage')}
                          >
                            {(stages || []).map(({ id, name }) => (
                              <MenuItem value={id}>{name}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                  {/* Tab Properties */}
                  <ExpansionPanel defaultExpanded={true}>
                    <ExpansionPanelSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel2a-content"
                      id="panel2a-header"
                    >
                      <Typography className={classes.heading}>Layout Variable</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      {/* <div className='custom-controls-wrapper'>
                        {stageVariables.map((variable, ix) => {
                          return (
                            <div
                              key={`custom-control-${ix}`}
                              className='custom-controls-wrapper__element'
                              onClick={() => insertVariable(variable.id)}
                            >
                              <span>{variable.name}</span>
                            </div>
                          )
                        })}
                      </div> */}
                      <div style={{display: 'flex', width: '100%', justifyContent: 'space-evenly', marginBottom: '10px'}}>
                        <div style={{display: 'flex', flexDirection: 'column', width: '200px'}}>
                            <h4>Base Fields: </h4>
                            <TreeView
                              defaultCollapseIcon={<ExpandMoreIcon />}
                              defaultExpandIcon={<ChevronRightIcon />}
                            >
                              <List className='__container-baseandcustom-panel'>
                                {stageVariables.map(({ id, name }, ix) => {
                                  return (
                                    <TreeItem
                                      className="baseform-tree-item"
                                      key={`tree-item-catalogue-${ix}`}
                                      label={name.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())))}
                                      nodeId={id}
                                      style={{ margin: "0 0 10px 0px" }}
                                      onClick={() => insertVariable(id)}
                                    >
                                    </TreeItem>
                                  );
                                })}
                              </List>
                            </TreeView>
                          </div>
                          <div style={{display: 'flex', flexDirection: 'column', width: '200px'}}>
                            <h4>Custom Fields: </h4>
                            {
                              values.sendMessageAt === 'start' || stageCustomFields.length === 0 ? (
                                <div style={{display: 'flex', flexDirection: 'row'}}>
                                  <CloseIcon />
                                  <span>{!values.selectedStage ? 'First select a stage' : values.sendMessageAt === 'start' ? 'Custom fields are edited during the approval' : 'This stage has no custom fields'}</span>
                                </div>
                              ) : (
                                <TreeView
                                  defaultCollapseIcon={<ExpandMoreIcon />}
                                  defaultExpandIcon={<ChevronRightIcon />}
                                >
                                  <List className='__container-baseandcustom-panel'>
                                    {stageCustomFields.map(({ id, values: { fieldName } }, ix) => {
                                      return (
                                        <TreeItem
                                          className="baseform-tree-item"
                                          key={`tree-item-catalogue-${ix}`}
                                          label={fieldName.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())))}
                                          nodeId={id}
                                          style={{ margin: "0 0 10px" }}
                                          onClick={() => insertVariable(id)}
                                        >
                                        </TreeItem>
                                      );
                                    })}
                                  </List>
                                </TreeView>
                              )
                            }
                          </div>
                      </div>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                  {/* Field Properties */}
                  <ExpansionPanel defaultExpanded={true}>
                    <ExpansionPanelSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel3a-content"
                      id="panel3a-header"
                    >
                      <Typography className={classes.heading}>Field Properties</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <div className="field-properties-wrapper">
                        <div style={{ marginTop: '0px', marginBottom: '20px' }}>
                          <Editor
                            onClick={e => console.log('>>>>>>>click', e)}
                            editorState={editor}
                            toolbarClassName="toolbarClassName"
                            wrapperClassName="wrapperClassName"
                            editorClassName="editorClassName"
                            onEditorStateChange={ed => setEditor(ed)}
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
  )
};

export default ModalLayoutStages;
