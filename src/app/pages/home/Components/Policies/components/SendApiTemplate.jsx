import React from 'react';
import {
  FormControlLabel,
  makeStyles,
  Switch,
  TextField,
} from '@material-ui/core';
import { PortletBody } from '../../../../../a../../../app/partials/content/Portlet';
import '../modals/ModalPolicies.scss';

const useStyles = makeStyles((theme) => ({
  formControlLabel: {
    marginLeft: '10px'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200
  }
}));

export default function SendApiTemplate({
  urlOnChange, urlFieldName, urlValue,
  disabled, disabledOnChange,
  tokenEnabled, tokenEnabledOnChange,
  tokenValue, tokenOnChange,
  bodyFieldName, bodyOnChange, bodyValue,
  setSelectedControlAndIndexes
}) {
  const classes = useStyles();
  return (
    <PortletBody>
      <div className='__container-send-api'>
        <div className='__container-post'>
          <div className='token_textField'>
            <TextField
              className={classes.textField}
              id='standard-url'
              label='URL'
              margin='normal'
              name={urlFieldName}
              onChange={(event) => (urlOnChange)(event)}
              onClick={setSelectedControlAndIndexes}
              style={{ width: '90%' }}
              value={urlValue}
            />
            <FormControlLabel
              value='start'
              control={
                <Switch
                  checked={disabled}
                  color='primary'
                  onChange={(event) => (disabledOnChange)(event)}
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
                  checked={tokenEnabled}
                  color="primary"
                  onChange={(event) => (tokenEnabledOnChange)(event)}
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
              onChange={(event) => (tokenOnChange)(event)}
              style={{ width: '90%', marginLeft: '20px' }}
              value={tokenValue}
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
            name={bodyFieldName}
            onChange={(event) => (bodyOnChange)(event)}
            onClick={setSelectedControlAndIndexes}
            rows='4'
            style={{ width: '90%' }}
            value={bodyValue}
          />
        </div>
      </div>
    </PortletBody>
  )
}
