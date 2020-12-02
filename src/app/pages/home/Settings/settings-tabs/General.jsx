/* eslint-disable no-restricted-imports */
import React, { useEffect, useState } from 'react';
import { omit, isEmpty } from 'lodash';
import { getDB, postDB, getOneDB, updateDB } from '../../../../crud/api';
import SaveButton from '../settings-tabs/components/SaveButton';
import { getFileExtension, saveImage, getImageURL, getFirstDocCollection } from '../../utils';

import {
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@material-ui/core";
import { useStyles } from './styles';

const General = props => {
  const classes = useStyles();
  const [values, setValues] = useState({
    languages: [{ id: 'en', name: 'English' }, { id: 'es', name: 'Español' }],
    currencies: [{ id: 'usd', name: 'American Dollar' }, { id: 'mxn', name: 'Mexican Peso' }],
    inactivity: [{ id: 'in0', name: 'Do nothing' }, { id: 'in1', name: 'Logout (10 min)' }],
    selectedLanguage: '',
    selectedCurrency: '',
    selectedInactivity: ''
  });
  const fields = [
    { id: 'languages', name: 'Language', selected: 'selectedLanguage' },
    { id: 'currencies', name: 'Currency', selected: 'selectedCurrency' },
    { id: 'inactivity', name: 'Inactivity', selected: 'selectedInactivity' }
  ];
  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
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
            })
            .catch(error => console.log(error));
        } else {
          updateDB('settingsGeneral/', body, id)
            .then(response => {
              // saveImages(imagesInfo);
              // saveAndReload('settingsDesign', 'logoLogin');
            })
            .catch(error => console.log(error));
        }
      })
      .catch(ex => {});
  };

  const loadProcessesData = (collectionName = 'settingsGeneral') => {
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
    loadProcessesData();
  }, []);

  return (
    <div>
      <div style={{textAlign: 'end', marginBottom: '15px'}}>
        <SaveButton handleOnClick={handleSave}/>
      </div>
      {fields.map(({id, name, selected}, ix) => (
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
    </div>
  );
}

export default General;
