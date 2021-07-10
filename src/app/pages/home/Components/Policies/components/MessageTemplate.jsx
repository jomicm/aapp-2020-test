import React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Editor } from 'react-draft-wysiwyg';
import {
  FormControlLabel,
  makeStyles,
  Switch,
  TextField,
} from '@material-ui/core';
import { PortletBody } from '../../../../../a../../../app/partials/content/Portlet';
import '../modals/ModalPolicies.scss';

const useStyles = makeStyles((theme) => ({
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200
  }
}));

export default function MessageTemplate({
  fromValue, fromOnChange, fromOptions,
  toValue, toOnChange, toOptions,
  subjectValue, subjectOnChange, subjectOnClick, subjectName,
  disablesOnChange, disabledValue, mailOnChange, mailValue, internalOnChange, internalValue,
  setSelectedControl, editor, editorStateChange,
}) {
  const classes = useStyles();
  return (
    <PortletBody>
      <div className='__container-sendmessage-panel'>
        <div className='__container-form-checkbox'>
          <div className='__container-form'>
            <Autocomplete
              className={classes.textField}
              defaultValue={fromValue}
              id='tags-message-from'
              getOptionLabel={(option) => option.email}
              multiple
              onChange={(event, values) => (fromOnChange)(event, values)}
              options={fromOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label='From'
                  variant='standard'
                />
              )}
              value={fromValue}
            />
            <Autocomplete
              className={classes.textField}
              defaultValue={toValue}
              getOptionLabel={(option) => option.email}
              id='tags-message-to'
              multiple
              onChange={(event, values) => (toOnChange)(event, values)}
              options={toOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label='To'
                  variant='standard'
                />
              )}
              value={toValue}
            />
            <TextField
              className={classes.textField}
              id='standard-subjectMessage'
              label='Subject'
              margin='normal'
              name={subjectName}
              onChange={(event) => subjectOnChange(event)}
              onClick={subjectOnClick}
              value={subjectValue}
            />
          </div>
          <div className='__container-checkbox'>
            <FormControlLabel
              control={
                <Switch
                  checked={disabledValue}
                  color='primary'
                  onChange={(event) => (disablesOnChange)(event)}
                />
              }
              label='Disabled'
              labelPlacement='start'
              value='start'
            />
            <FormControlLabel
              control={
                <Switch
                  checked={mailValue}
                  color='primary'
                  onChange={(event) => (mailOnChange)(event)}
                />
              }
              label='Mail'
              labelPlacement='start'
              value='start'
            />
            <FormControlLabel
              control={
                <Switch
                  checked={internalValue}
                  color='primary'
                  onChange={(event) => (internalOnChange)(event)}
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
          onClick={setSelectedControl}
        >
          <Editor
            editorClassName='editorClassName'
            editorState={editor}
            onEditorStateChange={editorStateChange}
            toolbarClassName='toolbarClassName'
            wrapperClassName='wrapperClassName'
          />
        </div>
      </div>
    </PortletBody>
  )
}
