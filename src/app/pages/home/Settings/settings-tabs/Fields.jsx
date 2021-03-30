/* eslint-disable no-restricted-imports */
import React, { useEffect, useState } from 'react';
import { omit, isEmpty } from 'lodash';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
  Switch,
  TextField
} from "@material-ui/core";
import TextFields from '@material-ui/icons/TextFields';
import { useDispatch } from 'react-redux';
import { actions } from '../../../../store/ducks/general.duck';
import { getDB, postDB, getOneDB, updateDB } from '../../../../crud/api';
import { getFirstDocCollection } from '../../utils';
import SaveButton from '../settings-tabs/components/SaveButton';
import { useStyles } from './styles';
import { defaultValues, settings } from './constants'

const Fields = props => {
  const dispatch = useDispatch();
  const { showErrorAlert, showSavedAlert, showUpdatedAlert } = actions;
  const classes = useStyles();
  const [values, setValues] = useState(defaultValues);
  const [selectedModule, setSelectedModule] = useState('');
  const handleChange = name => event => {
    if (name === 'selectedModule') {
      setSelectedModule(values.modules[event.target.value].id);
    }
    setValues({ ...values, [name]: event.target.value });
  };
  const handleUpdateCaptionLists = (selectedModule, id) => event => {
    const fields = values.fields;
    fields[selectedModule][id].caption = event.target.value;
    setValues(prev => ({ ...prev, fields }));
  };
  const handleUpdateRegExLists = (selectedModule, id) => event => {
    const fields = values.fields;
    fields[selectedModule][id].regex = event.target.value;
    setValues(prev => ({ ...prev, fields }));
  };
  const handleUpdateCaptionListsCheck = (selectedModule, id) => event => {
    const fields = values.fields;
    fields[selectedModule][id].mandatory = event.target.checked;
    setValues(prev => ({ ...prev, fields }));
  };
  const handleSave = () => {
    const body = { ...values };
    getFirstDocCollection('settingsFields')
      .then(id => {
        if (!id) {
          postDB('settingsFields', body)
            .then(data => data.json())
            .then(response => {
              dispatch(showSavedAlert());
            })
            .catch(error => {
              dispatch(showErrorAlert());
            });
        } else {
          updateDB('settingsFields/', body, id)
            .then(response => {
              dispatch(showUpdatedAlert());
            })
            .catch(error => {
              dispatch(showErrorAlert());
            });
        }
      })
      .catch(ex => {
        dispatch(showErrorAlert());
      });
  };

  const loadInitData = (collectionName = 'settingsFields') => {
    getDB(collectionName)
    .then(response => response.json())
    .then(data => {
      const _values = data.response[0] || {};
      if (!isEmpty(_values)) {
        setValues(omit(_values, '_id'));
      }
    })
    .catch(error => console.log('error>', error));
  };

  useEffect(() => {
    loadInitData();
  }, []);

  return (
    <>
      <div style={{textAlign: 'end', marginBottom: '15px'}}>
        <SaveButton handleOnClick={handleSave}/>
      </div>
      <div style={{ display: 'flex' }}>
        <div className="profile-tab-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '50%', justifyContent: 'flex-start' }}>
          {settings.map(({id, name, selected}, ix) => (
            <FormControl key={`caption-field-${ix}`} className={classes.textField}>
              <InputLabel>{name}</InputLabel>
              <Select
                // value={values[selected]}
                onChange={handleChange(selected)}
                style={{ marginBottom: '20px' }}
              >
                {(values[id] || []).map((opt, ix) => (
                  <MenuItem key={`opt-${ix}`} value={ix}>{opt.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          ))}
        </div>
        <div className="profile-tab-wrapper__content">
            <List dense={false} subheader={<ListSubheader>Select custom captions for fields and set if they should be mandatory</ListSubheader>} className={classes.root}>
              {(Object.keys(values.fields[selectedModule] || {}) || []).map((key, ix) => {
                const { id, name, caption, mandatory, regex } = values.fields[selectedModule][key] || {};
                return (
                  <ListItem style={{ marginBottom: '20px' }}>
                    <ListItemIcon>
                      <TextFields />
                    </ListItemIcon>
                    <ListItemText style={{width: '150px'}} primary={name || 'Field Name'} />
                    <TextField
                      label={'Custom Caption'}
                      style={{width: '150px', margin: '-20px 50px 0 20px'}}
                      value={caption}
                      onChange={handleUpdateCaptionLists(selectedModule, id)}
                      margin="normal"
                    />
                    <TextField
                      label={'RegEx'}
                      style={{width: '200px', margin: '-20px 50px 0 0px'}}
                      value={regex}
                      onChange={handleUpdateRegExLists(selectedModule, id)}
                      margin="normal"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        onChange={handleUpdateCaptionListsCheck(selectedModule, id)}
                        checked={mandatory}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
            </List>
          </div>
      </div>
    </>
  );
}

export default Fields;
