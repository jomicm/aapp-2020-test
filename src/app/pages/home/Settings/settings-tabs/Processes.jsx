/* eslint-disable no-restricted-imports */
import React, { useEffect, useState } from 'react';
import { omit, isEmpty } from 'lodash';
import { useDispatch } from 'react-redux';
import {
  TextField,
  IconButton,
  FormControlLabel,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  ListItemAvatar,
  Avatar
} from "@material-ui/core";
import AddCircle from '@material-ui/icons/AddCircle';
import Notification from '@material-ui/icons/NotificationImportant';
import DeleteIcon from '@material-ui/icons/Delete';
import { ColorPicker } from 'material-ui-color';
import { actions } from '../../../../store/ducks/general.duck';
import { getDB, postDB, getOneDB, updateDB } from '../../../../crud/api';
import { getFirstDocCollection } from '../../utils';
import SaveButton from '../settings-tabs/components/SaveButton';

const Processes = props => {
  const dispatch = useDispatch();
  const { showCustomAlert, showErrorAlert, showSavedAlert, showUpdatedAlert } = actions;
  const [values, setValues] = useState({ alerts: [] });
  const [color, setColor] = useState('');
  const [days, setDays] = useState(0);
  const handleChangeColor = async newValue => {
    setColor(newValue);
  };
  const handleAddAlert = () => {
    if (!color || !days || days < 1) {
      dispatch(
        showCustomAlert({
          open: true,
          message: 'Days and/or color have invalid values',
          type: 'warning'
        })
      );
      return;
    }
    const found = (values.alerts || []).find(x => x.days == days);
    if (found) {
      dispatch(
        showCustomAlert({
          open: true,
          message: 'There is already an existing alert for those days',
          type: 'warning'
        })
      );
      return;
    }
    const newAlert = { days, color: `#${color.hex}` };
    const alerts = values.alerts || [];
    alerts.push(newAlert);
    setValues(prev => ({ ...prev, alerts }));
    setColor('');
    setDays(0);
  };
  const handleDeleteAlert = (days) => {
    const alerts = (values.alerts || []).filter(x => Number(x.days) !== Number(days));
    setValues(prev => ({ ...prev, alerts }));
  };
  const handleSave = () => {
    const body = { ...values };
    getFirstDocCollection('settingsProcesses')
      .then(id => {
        if (!id) {
          postDB('settingsProcesses', body)
            .then(data => data.json())
            .then(response => {
              dispatch(showSavedAlert());
            })
            .catch(error => {
              console.log(error)
              dispatch(showErrorAlert());
            });
        } else {
          updateDB('settingsProcesses/', body, id)
            .then(response => {
              dispatch(showUpdatedAlert());
            })
            .catch(error => {
              console.log(error)
              dispatch(showErrorAlert());
            });
        }
      })
      .catch(ex => {
        dispatch(showErrorAlert());
      });
  };
  const loadInitData = (collectionName = 'settingsProcesses') => {
    getDB(collectionName)
    .then(response => response.json())
    .then(data => {
      const _values = data.response[0] || {};
      console.log('_values:', _values)
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
    <div>
      <div style={{textAlign: 'end', marginBottom: '15px'}}>
        <SaveButton handleOnClick={handleSave}/>
      </div>
      <div style={{ display: 'flex' }}>
        <div className="profile-tab-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '50%', justifyContent: 'flex-start' }}>
          <h3>Color Alerts</h3>
          <div style={{ display: 'flex', marginTop: '20px' }}>
            <h5>After</h5>
            <TextField
              label={'days'}
              style={{width: '200px', margin: '-25px 0 0 30px'}}
              type={'number'}
              value={days}
              onChange={e => setDays(e.target.value)}
              margin="normal"
            />
            <IconButton onClick={handleAddAlert} edge="end" style={{margin: '-15px 0 0 5px'}}>
              <AddCircle />
            </IconButton>
          </div>
          <FormControlLabel
            style={{ marginTop: '20px', marginLeft: '-50px' }}
            value="2"
            control={(
                <ColorPicker value={color} onChange={handleChangeColor} disableAlpha/>
            )}
            label="Alert Color"
            labelPlacement="start"
          />
        </div>
        <div className="profile-tab-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '50%', justifyContent: 'flex-start' }}>
          <List dense={false} style={{ marginTop: '25px' }}>
            {((values.alerts || []).sort((a, b) =>  a.days - b.days) || []).map(({ days, color }, ix) => (
              <ListItem>
                <ListItemAvatar>
                  <Avatar style={{ backgroundColor: color }}>
                    <Notification />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={<strong>{`Days: ${days}`}</strong>}
                  secondary={`Color: ${color}`}
                />
                <ListItemSecondaryAction>
                  <IconButton onClick={() => handleDeleteAlert(days)} edge="end" aria-label="Delete">
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </div>
      </div>
    </div>
  );
}

export default Processes;
