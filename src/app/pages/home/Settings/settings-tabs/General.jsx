/* eslint-disable no-restricted-imports */
import React, { useEffect, useState } from 'react';
import { omit, isEmpty } from 'lodash';
import { connect } from "react-redux";
import { metronic } from "../../../../../_metronic";
import { getDB, postDB, updateDB } from '../../../../crud/api';
import { getFirstDocCollection } from '../../utils';
import { languages } from '../../constants';
import SaveButton from '../settings-tabs/components/SaveButton';

import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField
} from "@material-ui/core";
import { useStyles } from './styles';

const General = props => {
  const classes = useStyles();
  const [values, setValues] = useState({
    languages: languages,
    currencies: [{ id: 'usd', name: 'American Dollar' }, { id: 'mxn', name: 'Mexican Peso' }],
    inactivity: [{ id: 'in0', name: 'Do nothing' }, { id: 'in1', name: 'Logout' }],
    selectedLanguage: props.lang,
    selectedCurrency: 1,
    selectedInactivity: 0,
    inactivityPeriod: 60000
  });
  const fields = [
    { id: 'languages', name: 'Language', selected: 'selectedLanguage' },
    { id: 'currencies', name: 'Currency', selected: 'selectedCurrency' },
    { id: 'inactivity', name: 'Inactivity', selected: 'selectedInactivity' }
  ];
  const handleChange = name => event => {
    setValues({ ...values, [name]: name === 'inactivityPeriod' ? Number(event.target.value * 60000) : event.target.value });
  };
  const handleSave = () => {
    const body = { ...values };
    getFirstDocCollection('settingsGeneral')
      .then(id => {
        if (!id) {
          postDB('settingsGeneral', body)
            .then(data => data.json())
            .then(response => {
              // saveImages(imagesInfo);
              window.location.reload();
            })
            .catch(error => console.log(error));
        } else {
          updateDB('settingsGeneral/', body, id)
            .then(response => {
              // saveImages(imagesInfo);
              // saveAndReload('settingsDesign', 'logoLogin');
              window.location.reload();
            })
            .catch(error => console.log(error));
        }
      })
      .catch(ex => { });
  };

  const loadProcessesData = (collectionName = 'settingsGeneral') => {
    getDB(collectionName)
      .then(response => response.json())
      .then(data => {
        const _values = data.response[0] || {};
        if (!isEmpty(_values)) {
          setValues(omit(_values, '_id'));
        };
      })
      .catch(error => console.log('error>', error));
  };

  useEffect(() => {
    loadProcessesData();
  }, []);

  return (
    <div>
      <div style={{ textAlign: 'end', marginBottom: '15px' }}>
        <SaveButton handleOnClick={handleSave} />
      </div>
      {fields.map(({ id, name, selected }, ix) => (
        <FormControl key={`base-field-${ix}`} className={classes.textField}>
          <InputLabel htmlFor="age-simple">{name}</InputLabel>
          <Select
            value={values[selected]}
            onChange={handleChange(selected)}
          >
            {(values[id] || []).map((opt, ix) => (
              <MenuItem key={`opt-${ix}`} value={ix}>{opt.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      ))}
      {
        values.selectedInactivity === 1 && (
          <FormControl className={classes.textField}>
            <TextField
              type='number'
              label='Minutes idle before Logout'
              onChange={handleChange('inactivityPeriod')}
              value={Math.trunc(values.inactivityPeriod / 60000)}
              inputProps={{
                min: 1
              }}
            />
          </FormControl>
        )
      }
    </div>
  );
}

const mapStateToProps = ({ i18n }) => ({ lang: i18n.lang });
export default connect(
  mapStateToProps,
  metronic.i18n.actions
)(General);
