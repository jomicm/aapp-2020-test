/* eslint-disable no-restricted-imports */
import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Tab, 
  AppBar, 
  Tabs, 
  Paper,
  TextField,
  Checkbox,
  FormControlLabel,
  Switch,
  InputLabel
} from "@material-ui/core";
import {
  withStyles,
  useTheme,
  makeStyles
} from "@material-ui/core/styles";
import SwipeableViews from "react-swipeable-views";
import CloseIcon from "@material-ui/icons/Close";
// import CustomFields from '../../Components/CustomFields/CustomFields';

import {
  SingleLine,
  MultiLine,
  Date,
  DateTime,
  DropDown,
  RadioButtons,
  Checkboxes,
  FileUpload
} from '../../Components/CustomFields/CustomFieldsPreview';

import './ModalLocationList.scss';

import { postDB, getOneDB, updateDB } from '../../../../crud/api';
import { Label } from 'reactstrap';

const CustomFieldsPreview = (props) => {
  const customFieldsPreviewObj = {
    singleLine: <SingleLine { ...props } />,
    multiLine: <MultiLine { ...props } />,
    date: <Date { ...props } />,
    dateTime: <DateTime { ...props } />,
    dropDown: <DropDown { ...props } />,
    radioButtons: <RadioButtons { ...props } />,
    checkboxes: <Checkboxes { ...props } />,
    fileUpload: <FileUpload { ...props } />
  };
  return customFieldsPreviewObj[props.type];
};

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

const DialogTitle5 = withStyles(styles5)(props => {
  const { children, classes, onClose } = props;
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

// Example 5 - Tabs
const useStyles5 = makeStyles({
  root: {
    flexGrow: 1
  }
});

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

const ModalLocationProfiles = ({ showModal, setShowModal, profile, parent, setParentSelected, realParent, reload, editOrNew }) => {
  // console.log('profile: <=>>>>>>', profile)
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
    name: '',
    // level: 0,
    profileName: '',
    profileId: '',
    profileLevel: '',
    parent: '',
    customFieldsTab: {}
  });

  const [profileLabel, setProfileLabel] = useState('');

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleSave = () => {
    const body = values;
    if (editOrNew === 'new') {
      body.parent = parent;
      console.log('save body:', body)
      postDB('locationsReal', body)
        .then(response => {
          reload();
        })
        .catch(error => console.log(error));
    } else {
      body.parent = realParent;
      console.log('edit body:', body)
      updateDB('locationsReal/', body, parent)
        .then(response => {
          reload();
        })
        .catch(error => console.log(error));
    }
    handleCloseModal();
  };

  const handleCloseModal = () => {
    // setCustomFieldsTab({});
    setValues({ name: '', profileId: '', profileLevel: '', profileName: '', parent: '', customFieldsTab: {} });
    setShowModal(false);
    setValue4(0);
    setParentSelected('root');
    // setIsNew(false);
  };

  useEffect(() => {
    console.log('USE EFEEEECT NEW>>>>', editOrNew);
    if(!profile || !profile.id || editOrNew === 'edit') return;
    getOneDB('locations/', profile.id)
      .then(response => response.json())
      .then(data => { 
        console.log('RESPONSE NEW>>>>>', data.response);
        const { _id: profileId, name: profileName, level: profileLevel, customFieldsTab } = data.response;
        setValues({ ...values, name:'', profileName, profileId, profileLevel, customFieldsTab });
        console.log('USE EFFECT NEW>>', { ...values, name: '', profileId, profileName, profileLevel, customFieldsTab })
        // const tabs = Object.values(customFieldsTab).map(tab => tab.info);
        // const tabs = Object.values(customFieldsTab).map(tab => ({ info: tab.info, content: [tab.left, tab.right] }));
        const tabs = Object.keys(customFieldsTab).map(key => ({ key, info: customFieldsTab[key].info, content: [customFieldsTab[key].left, customFieldsTab[key].right] }));
        console.log('PROFILE NAMEEE>>>', profile.name);
        setProfileLabel(profile.name);
        setTabs(tabs);
        setValue4(0);
      })
      .catch(error => console.log(error));
  }, [profile.id, editOrNew]);

  useEffect(() => {
    if(editOrNew !== 'edit') return;
    getOneDB('locationsReal/', parent)
    .then(response => response.json())
    .then(data => { 
      console.log('RESPONSE EDIT>>', data.response);
      const { name, profileId, profileLevel, profileName, customFieldsTab } = data.response;
      setValues({ ...values, name, profileId, profileLevel, profileName, customFieldsTab });
      console.log('USE EFFECT EDIT>>', { ...values, profileId, profileLevel, profileName, customFieldsTab })
      setProfileLabel(profileName);
      // const tabs = Object.values(customFieldsTab).map(tab => tab.info);
      // const tabs = Object.values(customFieldsTab).map(tab => ({ info: tab.info, content: [tab.left, tab.right] }));
      const tabs = Object.keys(customFieldsTab).map(key => ({ key, info: customFieldsTab[key].info, content: [customFieldsTab[key].left, customFieldsTab[key].right] }));
      setTabs(tabs);
      setValue4(0);
    })
    .catch(error => console.log(error));
  }, [editOrNew, parent])

  // Function to update customFields
  const handleUpdateCustomFields = (tab, id, colIndex, CFValues) => {
    const colValue = ['left', 'right'];
    console.log('Looking for you', tab, id, colIndex, values);
    const customFieldsTabTmp = { ...values.customFieldsTab };

    const field = customFieldsTabTmp[tab][colValue[colIndex]]
      .find(cf => cf.id === id);
    field.values = CFValues;
  };

  const [tabs, setTabs] = useState([]);

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
          {`${editOrNew === 'new' ? 'Add' : 'Edit'} Location`}
        </DialogTitle5>
        <DialogContent5 dividers>
          <div className="kt-section__content" style={{margin:'-16px'}}>
            <div className={classes4.root}>
              <Paper className={classes4.root}>
                <Tabs
                  value={value4}
                  onChange={handleChange4}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="fullWidth"
                >
                  <Tab label={profileLabel} />
                  {tabs.map(tab => <Tab label={tab.info.name} />)}
                </Tabs>
              </Paper>
              <SwipeableViews
                axis={theme4.direction === "rtl" ? "x-reverse" : "x"}
                index={value4}
                onChangeIndex={handleChangeIndex4}
              >
                <TabContainer4 dir={theme4.direction}>
                  <div className="profile-tab-wrapper">
                    <div className="profile-tab-wrapper__content">
                      <InputLabel>{`Selected Level: ${values.profileLevel}`}</InputLabel>
                      <TextField
                        id="standard-name"
                        label="Name"
                        className={classes.textField}
                        value={values.name}
                        onChange={handleChange("name")}
                        margin="normal"
                      />
                    </div>
                  </div>
                </TabContainer4>
                {tabs.map(tab => (
                  <TabContainer4 dir={theme4.direction}>
                  <div className="modal-location">
                    {Array(tab.content[1].length === 0 ? 1 : 2).fill(0).map((col, colIndex) => (
                      <div className="modal-location__list-field" >
                        {tab.content[colIndex].map(customField => (
                          <CustomFieldsPreview 
                            id={customField.id}
                            type={customField.content}
                            values={customField.values}
                            onDelete={() => {}}
                            onSelect={() => {}}
                            columnIndex={colIndex}
                            from="form"
                            tab={tab}
                            onUpdateCustomField={handleUpdateCustomFields}
                            // customFieldIndex={props.customFieldIndex}
                            onClick={() => alert(customField.content)}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                  </TabContainer4>  
                ))}
              </SwipeableViews>
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



export default ModalLocationProfiles;
