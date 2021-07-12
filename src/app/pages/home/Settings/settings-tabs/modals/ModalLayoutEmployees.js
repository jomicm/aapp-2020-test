/* eslint-disable no-restricted-imports */
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  TextField,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails
} from "@material-ui/core";
import {
  withStyles,
  useTheme,
  makeStyles
} from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { getOneDB, updateDB, postDB, getDB } from '../../../../../crud/api';
import { actions } from '../../../../../store/ducks/general.duck';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, ContentState, convertToRaw, Modifier } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

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

const ModalLayoutEmployees = ({ showModal, setShowModal, reloadTable, id, employeeProfileRows }) => {
  const dispatch = useDispatch();
  const { showCustomAlert } = actions;
  // Example 4 - Tabs
  const classes4 = useStyles4();
  const theme4 = useTheme();
  const [value4, setValue4] = useState(0);
  function handleChange4(event, newValue) {
    setValue4(newValue);
  }
  function handleChangeIndex4(index) {
    setValue4(index);
  }

  // Example 1 - TextField
  const classes = useStyles();
  const [values, setValues] = useState({
    name: ""
  });
  const [editor, setEditor] = useState(EditorState.createEmpty());

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleSave = () => {
    if (!values.name) {
      dispatch(showCustomAlert({
        message: 'Please assign a name to the layout',
        open: true,
        type: 'warning'
      }));
      return;
    }
    
    const layout = draftToHtml(convertToRaw(editor.getCurrentContent()));
    const body = { ...values, layout };

    if (!id) {
      postDB('settingsLayoutsEmployees', body)
        .then(data => data.json())
        .then(response => {
          const { _id } = response.response[0];
          saveAndReload('settingsLayoutsEmployees', _id);
        })
        .catch(error => console.log('ERROR', error));
    } else {
      updateDB('settingsLayoutsEmployees/', body, id[0])
        .then(response => {
          saveAndReload('settingsLayoutsEmployees', id[0]);

          getDB('employees')
            .then((response) => response.json())
            .then((data) => {
              const employees = data.response.map(({ _id, layoutSelected }) => {
                if (layoutSelected && typeof layoutSelected === 'object') {
                  if (layoutSelected.value === id[0]) {
                    return _id;
                  }
                }
              }) || [];
              const employeeLayout = { value: id[0], label: body.name };
              employees.forEach(({ employeeId }) => {
                updateDB('employees/', { layoutSelected: employeeLayout }, employeeId)
                  .catch((error) => console.log(error));
              });
            })
            .catch((error) => console.log(error));
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
    setShowModal(false);
    setValue4(0);
    setEditor(EditorState.createEmpty());
  };

  useEffect(() => {
    if(!id || !Array.isArray(id)) {
      return;
    }

    getOneDB('settingsLayoutsEmployees/', id[0])
      .then(response => response.json())
      .then(data => { 
        const { name, layout = '<p></p>' } = data.response;
        setValues({ ...values, name });
        // htmlToDraft
        // setEditor(EditorState.createWithContent(htmlToDraft(layout)));
        const contentBlock = htmlToDraft(layout);
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        setEditor(EditorState.createWithContent(contentState));
      })
      .catch(error => console.log(error));
  }, [id, employeeProfileRows]);


  const layoutEmployeeVariables = [
    {id: 'employeeName', name: 'Employee Name'}, 
    {id: 'employeeAssets', name: 'Employee Assets'}, 
    {id: 'currentDate', name: 'Current Date'}, 
    {id: 'currentTime', name: 'Current Time'}
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
          {`${id ? 'Edit' : 'Add' } Layout for Employees`}
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
                      <Typography className={classes.heading}>Layout Name</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <TextField
                        id="standard-name"
                        label="Name"
                        // className='tab-properties-wrapper__tab-name'
                        value={values.name}
                        onChange={handleChange('name')}
                        margin="normal"
                      />
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
                      <div className='custom-controls-wrapper'>
                        {layoutEmployeeVariables.map((variable, ix) => {
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

export default ModalLayoutEmployees;
