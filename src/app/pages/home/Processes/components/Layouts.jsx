/* eslint-disable no-restricted-imports */
import React, { useState } from 'react';
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  TextField,
  Typography
} from "@material-ui/core";
import {
  withStyles,
  useTheme,
  makeStyles
} from "@material-ui/core/styles";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

// Editor
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, ContentState, convertToRaw, convertFromHTML, Modifier } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

const stageVariables = [
  {id: 'stageName', name: 'Stage Name'}, 
  {id: 'creationDate', name: 'Creation Date'}, 
  {id: 'creator', name: 'Creator'}, 
  {id: 'approvals', name: 'Approvals'},
  {id: 'notifications', name: 'Notifications'}
];

const Layouts = () => {
  const classes = useStyles();
  const [editor, setEditor] = useState(EditorState.createEmpty());
  const [values, setValues] = useState({
    layoutName: ''
  });

  const handleChange = name => event => {
    setValues(prev => ({ ...prev, [name]: event.target.value }));
  };

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
    <div name="Expansion Panel" style={{ width: '95%', margin: '15px' }}>
      {/* Custom Controls */}
      <ExpansionPanel>
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
            value={values.layoutName}
            onChange={handleChange('layoutName')}
            margin="normal"
          />
        </ExpansionPanelDetails>
      </ExpansionPanel>
      {/* Tab Properties */}
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography className={classes.heading}>Layout Variable</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <div className='custom-controls-wrapper'>
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
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      {/* Field Properties */}
      <ExpansionPanel>
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
                // onClick={e => console.log('>>>>>>>click', e)}
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
  )
};

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

export default Layouts;
