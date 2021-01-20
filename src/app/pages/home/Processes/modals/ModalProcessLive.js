/* eslint-disable no-restricted-imports */
import React, { useState, useEffect } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  IconButton,
  Paper,
  Switch,
  Tab,
  TextField,
  Tabs,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@material-ui/core";
import {
  withStyles,
  useTheme,
  makeStyles
} from "@material-ui/core/styles";
import { pick } from "lodash";
import SwipeableViews from "react-swipeable-views";
import CloseIcon from "@material-ui/icons/Close";
import CustomFields from '../../Components/CustomFields/CustomFields';
import { postDB, getDB, getOneDB, updateDB, postFILE } from '../../../../crud/api';
import AssetFinderPreview from '../../Components/AssetFinderPreview';
import TableComponent from '../../Components/TableComponent';

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

const ModalProcessLive = ({ showModal, setShowModal, reloadTable, id }) => {
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
    name: "",
    functions: ['Start Stage', 'Control Stage'],
    //
    selectedProcess: ''
  });
  const [types, setTypes] = useState([]);
  // const [categoryPic, setCategoryPic] 

  const handleChange = name => event => {
    if (name === 'selectedFunction') {
      if (event.target.value === 0) {
        setTypes(['Creation', 'Movement', 'Short Movement', 'Decommission', 'Maintenance']);
      } else if (event.target.value === 1) {
        setTypes(['Approval']);
      }
    }
    setValues({ ...values, [name]: event.target.value });
  };

  const handleChangeCheck = name => event => {
    setValues({ ...values, [name]: event.target.checked });
  };

  const handleSave = () => {
    // const fileExt = getFileExtension(image);
    debugger
    const body = { ...values, cartRows };
    if (!id) {
      postDB('processLive', body)
        .then(data => data.json())
        .then(response => {
          const { _id } = response.response[0];
          saveAndReload('processLive', _id);
        })
        .catch(error => console.log(error));
    } else {
      updateDB('processLive/', body, id[0])
        .then(data => data.json())
        .then(response => {
          saveAndReload('processLive', id[0]);
        })
        .catch(error => console.log(error));
    }

    handleCloseModal();
  };

  const getFileExtension = file => {
    if (!file) return '';
    const { type } = file;
    return type.split('/')[1];
  };

  const saveAndReload = (folderName, id) => {
    saveImage(folderName, id);
    reloadTable();
  };

  const saveImage = (folderName, id) => {
    if (image) {
      postFILE(folderName, id, image)
        .then(response => {
          console.log('FIlE uploaded!', response);
        })
        .catch(error => console.log(error));
    }
  };

  const handleCloseModal = () => {
    setCustomFieldsTab({});
    // setProfilePermissions([]);
    setValues({ 
      selectedProcess: ''
    });
    setTypes([]);
    setShowModal(false);
    setValue4(0);
    setCartRows([]);
    // setIsAssetRepository(false);
  };

  const [processes, setProcesses] = useState([]);

  useEffect(() => {
    getDB('processes')
    .then(response => response.json())
    .then(data => {
      const processes = data.response.map(({ _id, name, processStages }) => ({ id: _id, name, processStages }));
      setProcesses(processes);
    })
    .catch(error => console.log(error));

    if (!id || !Array.isArray(id)) {
      return;
    }
      
    getOneDB('processStages/', id[0])
      .then(response => response.json())
      .then(data => { 
        const { types, customFieldsTab, notifications, approvals } = data.response;
        const obj = pick(data.response, ['name', 'functions', 'selectedFunction', 'selectedType', 'isAssetEdition', 'isUserFilter', 'isCustomLockedStage', 'isSelfApprove', 'isSelfApproveContinue', 'isControlDueDate']);
        setValues(obj);
        setTypes(types)
        setCustomFieldsTab(customFieldsTab);
        setNotifications(notifications);
        setApprovals(approvals);
      })
      .catch(error => console.log(error));
  }, [id]);

  const [customFieldsTab, setCustomFieldsTab] = useState({});

  const [image, setImage] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [approvals, setApprovals] = useState([]);
  const [assetsSelected, setAssetsSelected] = useState([]);
  const [cartRows, setCartRows] = useState([]);
  const onChangeNotificationsApprovals = name => (event, values) => {
    if (name === 'notifications') {
      setNotifications(values);
    } else if (name === 'approvals')
      setApprovals(values);
  }
  const onSelectionChange = (selection) => {
    setAssetsSelected(selection.rows || []);
  };
  const onAddAssetToCart = () => {
    debugger
    const convertAssets = assetsSelected.map(({ name, brand, model }, ix) => createAssetReferenceCartRow('id' + ix, name, brand, model));
    setCartRows([ ...cartRows, ...convertAssets ]);
    setAssetsSelected([]);
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
          {`${id ? 'Edit' : 'Add' } Live Process`}
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
                  <Tab label="General" />
                  <Tab label="Table" />
                </Tabs>
              </Paper>
              <SwipeableViews
                axis={theme4.direction === "rtl" ? "x-reverse" : "x"}
                index={value4}
                onChangeIndex={handleChangeIndex4}
              >
                <TabContainer4 dir={theme4.direction}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <FormControl className={classes.textField}>
                        <InputLabel htmlFor="age-simple">Process</InputLabel>
                        <Select
                          value={values.selectedProcess}
                          // onChange={handleChange('selectedProcess')}
                          onChange={event => setValues(prev => ({ ...prev, selectedProcess: event.target.value }))}
                        >
                          {(processes || []).map((opt, ix) => (
                            <MenuItem key={`opt-name-${ix}`} value={opt.id}>{opt.name}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <button
                        type="button"
                        onClick={onAddAssetToCart}
                        className='btn btn-primary btn-elevate kt-login__btn-primary'
                      >
                        <i className="la la-plus" /> Add Assets
                      </button>
                    </div>
                    <div style={{ alignItems: 'flex-end', paddingTop: '30px' }}>
                      <AssetFinderPreview isAssetReference={true} onSelectionChange={onSelectionChange}/>
                    </div>
                  </div>
                </TabContainer4>
                <TabContainer4 dir={theme4.direction}>
                  <TableComponent
                    title={'Assets Cart'}
                    headRows={getColumns()}
                    rows={cartRows}
                    // rows={test}
                    noEdit={true}
                    // onAdd={tableActions('processStages').onAdd}
                    // onDelete={tableActions('processStages').onDelete}
                    // onEdit={tableActions('processStages').onEdit}
                    // onSelect={tableActions('processStages').onSelect}
                  />
                </TabContainer4>
              </SwipeableViews>
            </div>
            <div>
              
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

const test = [{
  brand: "Huawei",
  id: "id0",
  model: "x3",
  name: "Router"
}]

const getColumns = (isAssetReference = true) => {
  const assetReference = [
    { id: "name", numeric: false, disablePadding: false, label: "Name" },
    { id: "brand", numeric: false, disablePadding: false, label: "Brand" },
    { id: "model", numeric: false, disablePadding: false, label: "Model" },
  ];

  if (isAssetReference) {
    return assetReference;
  } else {
    return [
      ...assetReference,
      { id: "assigned", numeric: false, disablePadding: false, label: "Assigned" },
      { id: "id", numeric: false, disablePadding: false, label: "EPC" },
      { id: "sn", numeric: false, disablePadding: false, label: "Serial Number" }
    ]
  }
};

const createAssetCartRow = (id, name, brand, model, assigned, epc, sn) => {
  return { id, name, brand, model, assigned, epc, sn };
};

const createAssetReferenceCartRow = (id, name, brand, model) => {
  return { id, name, brand, model };
};

const processesHeadRows = [
  { id: "name", numeric: false, disablePadding: false, label: "Name" },
  { id: "numberOfStages", numeric: false, disablePadding: false, label: "Number of Stages" },
  { id: "creator", numeric: false, disablePadding: false, label: "Creator" },
  { id: "creation_date", numeric: false, disablePadding: false, label: "Creation Date" }
];

export default ModalProcessLive;
