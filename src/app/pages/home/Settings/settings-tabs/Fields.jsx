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
import { getDB, postDB, getOneDB, updateDB } from '../../../../crud/api';
import { getFirstDocCollection } from '../../utils';
import SaveButton from '../settings-tabs/components/SaveButton';
import { useStyles } from './styles';

const Fields = props => {
  const classes = useStyles();
  const [values, setValues] = useState({
    languages: [{ id: 'en', name: 'English' }, { id: 'es', name: 'Español' }],
    modules: [
      { index: 0, id: 'user', name: 'Users' },
      { index: 1, id: 'employees', name: 'Employees' },
      { index: 2, id: 'locations', name: 'Locations' },
      { index: 3, id: 'categories', name: 'Categories' },
      { index: 4, id: 'references', name: 'References' },
      { index: 5, id: 'assets', name: 'Assets' },
      { index: 6, id: 'processes', name: 'Processes' },
    ],
    selectedLanguage: '',
    selectedModule: '',
    captions: {
      user: {
        userProfile: { id: 'userProfile', name: 'User Profile', caption: '', mandatory: false },
        name: { id: 'name', name: 'Name', caption: '', mandatory: false },
        lastName: { id: 'lastName', name: 'Last Name', caption: '', mandatory: false },
        email: { id: 'email', name: 'Email', caption: '', mandatory: false },
        password: { id: 'password', name: 'Password', caption: '', mandatory: false },
        boss: { id: 'boss', name: 'Boss', caption: '', mandatory: false },
        groups: { id: 'groups', name: 'Groups', caption: '', mandatory: false }
      },
      employees: {
        employeeProfile: { id: 'employeeProfile', name: 'Employee Profile', caption: '', mandatory: false },
        name: { id: 'name', name: 'Name', caption: '', mandatory: false },
        lastName: { id: 'lastName', name: 'Last Name', caption: '', mandatory: false },
        email: { id: 'email', name: 'Email', caption: '', mandatory: false },
        responsibilityLayout: { id: 'responsibilityLayout', name: 'Responsibility Layout', caption: '', mandatory: false }
      },
      locations: {
        selectedLevel: { id: 'selectedLevel', name: 'Selected Level', caption: '', mandatory: false },
        name: { id: 'name', name: 'Name', caption: '', mandatory: false }
      },
      categories: {
        name: { id: 'name', name: 'Name', caption: '', mandatory: false },
        depreciation: { id: 'depreciation', name: 'Depreciation', caption: '', mandatory: false }
      },
      references: {
        category: { id: 'category', name: 'Category', caption: '', mandatory: false },
        name: { id: 'name', name: 'Name', caption: '', mandatory: false },
        brand: { id: 'brand', name: 'Brand', caption: '', mandatory: false },
        model: { id: 'model', name: 'Model', caption: '', mandatory: false },
        price: { id: 'price', name: 'Price', caption: '', mandatory: false },
        depreciation: { id: 'depreciation', name: 'Depreciation', caption: '', mandatory: false }
      },
      assets: {
        name: { id: 'name', name: 'Name', caption: '', mandatory: false },
        brand: { id: 'brand', name: 'Brand', caption: '', mandatory: false },
        model: { id: 'model', name: 'Model', caption: '', mandatory: false },
        category: { id: 'category', name: 'Category', caption: '', mandatory: false },
        status: { id: 'status', name: 'Status', caption: '', mandatory: false },
        serialNumber: { id: 'serialNumber', name: 'Serial Number', caption: '', mandatory: false },
        responsible: { id: 'responsible', name: 'Responsible', caption: '', mandatory: false },
        notes: { id: 'notes', name: 'Notes', caption: '', mandatory: false },
        quantity: { id: 'quantity', name: 'Quantity', caption: '', mandatory: false },
        purchaseDate: { id: 'purchaseDate', name: 'Purchase Date', caption: '', mandatory: false },
        purchasePrice: { id: 'purchasePrice', name: 'Purchase Price', caption: '', mandatory: false },
        price: { id: 'price', name: 'Price', caption: '', mandatory: false },
        totalPrice: { id: 'totalPrice', name: 'Total Price', caption: '', mandatory: false },
        EPC: { id: 'EPC', name: 'EPC', caption: '', mandatory: false },
        locations: { id: 'locations', name: 'Locations', caption: '', mandatory: false },
        creator: { id: 'creator', name: 'Creator', caption: '', mandatory: false },
        creationDate: { id: 'creationDate', name: 'Creation Date', caption: '', mandatory: false },
        labelingUser: { id: 'labelingUser', name: 'Labeling User', caption: '', mandatory: false },
        labelingDate: { id: 'labelingDate', name: 'Labeling Date', caption: '', mandatory: false }
      },
      processes: {
        name: { id: 'name', name: 'Name', caption: '', mandatory: false },
        allStages: { id: 'allStages', name: 'All Stages', caption: '', mandatory: false },
        processFlow: { id: 'processFlow', name: 'Process Flow', caption: '', mandatory: false },
        goBack: { id: 'goBack', name: 'Go Back', caption: '', mandatory: false },
        toStage: { id: 'toStage', name: 'To Stage', caption: '', mandatory: false },
        notificationUsers: { id: 'notificationUsers', name: 'Notification Users', caption: '', mandatory: false }
      }
    }
  });
  const [selectedModule, setSelectedModule] = useState('');
  const fields = [
    { id: 'languages', name: 'Language', selected: 'selectedLanguage' },
    { id: 'modules', name: 'Modules', selected: 'selectedModule' }
  ];
  const handleChange = name => event => {
    if (name === 'selectedModule') {
      setSelectedModule(values.modules[event.target.value].id);
    }
    setValues({ ...values, [name]: event.target.value });
  };
  const handleUpdateCaptionLists = (selectedModule, id) => event => {
    const captions = values.captions;
    captions[selectedModule][id].caption = event.target.value;
    setValues(prev => ({ ...prev, captions }));
  };
  const handleUpdateCaptionListsCheck = (selectedModule, id) => event => {
    const captions = values.captions;
    captions[selectedModule][id].mandatory = event.target.checked;
    setValues(prev => ({ ...prev, captions }));
  };
  const handleSave = () => {
    const body = { ...values };
    getFirstDocCollection('settingsFields')
      .then(id => {
        if (!id) {
          postDB('settingsFields', body)
            .then(data => data.json())
            .then(response => {
            })
            .catch(error => console.log(error));
        } else {
          updateDB('settingsFields/', body, id)
            .then(response => {
            })
            .catch(error => console.log(error));
        }
      })
      .catch(ex => {});
  };

  const loadInitData = (collectionName = 'settingsFields') => {
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
    <>
      <div style={{textAlign: 'end', marginBottom: '15px'}}>
        <SaveButton handleOnClick={handleSave}/>
      </div>
      <div style={{ display: 'flex' }}>
        <div className="profile-tab-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '50%', justifyContent: 'flex-start' }}>
          {fields.map(({id, name, selected}, ix) => (
            <FormControl key={`caption-field-${ix}`} className={classes.textField}>
              <InputLabel>{name}</InputLabel>
              <Select
                value={values[selected]}
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
              {(Object.keys(values.captions[selectedModule] || {}) || []).map((key, ix) => {
                const { id, name, caption, mandatory } = values.captions[selectedModule][key] || {};
                return (
                  <ListItem style={{ marginBottom: '20px' }}>
                    <ListItemIcon>
                      <TextFields />
                    </ListItemIcon>
                    <ListItemText primary={name || 'Field Name'} />
                    <TextField
                      label={'Custom Caption'}
                      style={{width: '200px', margin: '-20px 50px 0 50px'}}
                      value={caption}
                      onChange={handleUpdateCaptionLists(selectedModule, id)}
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
