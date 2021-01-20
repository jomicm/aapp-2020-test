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

// import './ModalAssetCategories.scss';
import ImageUpload from '../../Components/ImageUpload';
import { postDB, getOneDB, updateDB, postFILE } from '../../../../crud/api';
import ModalYesNo from '../../Components/ModalYesNo';
import Permission from '../components/Permission';


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

const ModalProcessStages = ({ showModal, setShowModal, reloadTable, id }) => {
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
    selectedFunction: '',
    selectedType: '',
    //
    isAssetEdition: false,
    isUserFilter: false,
    isCustomLockedStage: false,
    isSelfApprove: false,
    isSelfApproveContinue: false,
    isControlDueDate: false
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
    const body = { ...values, types, customFieldsTab };
    if (!id) {
      postDB('processStages', body)
        .then(data => data.json())
        .then(response => {
          const { _id } = response.response[0];
          saveAndReload('processStages', _id);
        })
        .catch(error => console.log(error));
    } else {
      updateDB('processStages/', body, id[0])
        .then(data => data.json())
        .then(response => {
          saveAndReload('processStages', id[0]);
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
      name: "",
      functions: ['Start Stage', 'Control Stage'],
      //
      selectedFunction: '',
      selectedType: '',
      //
      isAssetEdition: false,
      isUserFilter: false,
      isCustomLockedStage: false,
      isSelfApprove: false,
      isSelfApproveContinue: false,
      isControlDueDate: false
    });
    setTypes([]);
    setShowModal(false);
    setValue4(0);
    // setIsAssetRepository(false);
  };

  useEffect(() => {
    if(!id || !Array.isArray(id)) {
      return;
    }
      
    getOneDB('processStages/', id[0])
      .then(response => response.json())
      .then(data => { 
        
        // const { name, functions, selectedFunction, selectedType, isAssetEdition, isUserFilter, isCustomLockedStage, isSelfApprove, isSelfApproveContinue, isControlDueDate } = data.response;
        const { types, customFieldsTab } = data.response;
        const obj = pick(data.response, ['name', 'functions', 'selectedFunction', 'selectedType', 'isAssetEdition', 'isUserFilter', 'isCustomLockedStage', 'isSelfApprove', 'isSelfApproveContinue', 'isControlDueDate']);
        setValues(obj);
        setTypes(types)
        setCustomFieldsTab(customFieldsTab);
      })
      .catch(error => console.log(error));
  }, [id]);

  const [customFieldsTab, setCustomFieldsTab] = useState({});

  // const modules = [
  //   {key:'dashboard', name: 'Dashboard'},
  //   {key:'assets', name: 'Assets'},
  //   {key:'processes', name: 'Processes'},
  //   {key:'users', name: 'Users'},
  //   {key:'employees', name: 'Employees'},
  //   {key:'locations', name: 'Locations'},
  //   {key:'reports', name: 'Reports'},
  //   {key:'settings', name: 'Settings'}
  // ];

  // const [profilePermissions, setProfilePermissions] = useState({});
  // const [isAssetRepository, setIsAssetRepository] = useState(false);

  // const handleSetPermissions = (key, checked) => {
  //   setProfilePermissions(prev => ({ ...prev, [key]: checked }));
  // }

  const [image, setImage] = useState(null);

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
          {`${id ? 'Edit' : 'Add' } Process Stage`}
          {/* Add/Edit User Profiles */}
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
                  <Tab label="New Stage" />
                  <Tab label="Custom Fields" />
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
                      <TextField
                        id="standard-name"
                        label="Name"
                        className={classes.textField}
                        value={values.name}
                        onChange={handleChange("name")}
                        margin="normal"
                      />
                      <FormControl className={classes.textField}>
                        <InputLabel htmlFor="age-simple">Function</InputLabel>
                        <Select
                          value={values.selectedFunction}
                          onChange={handleChange('selectedFunction')}
                        >
                          {(values.functions || []).map((opt, ix) => (
                            <MenuItem key={`opt-${ix}`} value={ix}>{opt}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl className={classes.textField}>
                        <InputLabel htmlFor="age-simple">Type</InputLabel>
                        <Select
                          value={values.selectedType}
                          onChange={handleChange('selectedType')}
                        >
                          {(types || []).map((opt, ix) => (
                            <MenuItem key={`opt-${ix}`} value={ix}>{opt}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <Autocomplete
                        className={classes.textField}
                        multiple
                        id="tags-standard"
                        options={users}
                        getOptionLabel={(option) => option.name}
                        // defaultValue={[users[13]]}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="standard"
                            label="Notifications"
                            // placeholder="Notifications"
                          />
                        )}
                      />
                      <Autocomplete
                        className={classes.textField}
                        multiple
                        id="tags-standard"
                        options={users}
                        getOptionLabel={(option) => option.name}
                        // defaultValue={[users[13]]}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="standard"
                            label="Approvals"
                            // placeholder="Approvals"
                          />
                        )}
                      />
                    </div>
                    <div className="profile-tab-wrapper__content" style={{ alignItems: 'flex-end', paddingTop: '30px' }}>
                      <FormControlLabel
                        value="start"
                        control={<Switch color="primary" checked={values.isAssetEdition} onChange={handleChangeCheck('isAssetEdition')}/>}
                        label="Asset Edition"
                        labelPlacement="start"
                      />
                      <FormControlLabel
                        value="start"
                        control={<Switch color="primary" checked={values.isUserFilter} onChange={handleChangeCheck('isUserFilter')}/>}
                        label="User Filter"
                        labelPlacement="start"
                      />
                      <FormControlLabel
                        value="start"
                        control={<Switch color="primary" checked={values.isCustomLockedStage} onChange={handleChangeCheck('isCustomLockedStage')}/>}
                        label="Custom Locked Stage"
                        labelPlacement="start"
                      />
                      <FormControlLabel
                        value="start"
                        control={<Switch color="primary" checked={values.isSelfApprove} onChange={handleChangeCheck('isSelfApprove')}/>}
                        label="Self-Approve"
                        labelPlacement="start"
                      />
                      <FormControlLabel
                        value="start"
                        control={<Switch color="primary" checked={values.isSelfApproveContinue} onChange={handleChangeCheck('isSelfApproveContinue')}/>}
                        label="Self-Approve-Continue"
                        labelPlacement="start"
                      />
                      <FormControlLabel
                        value="start"
                        control={<Switch color="primary" checked={values.isControlDueDate} onChange={handleChangeCheck('isControlDueDate')}/>}
                        label="Control Due Date"
                        labelPlacement="start"
                      />
                    </div>
                  </div>
                </TabContainer4>
                {/* <TabContainer4 dir={theme4.direction}>
                  <div style={{ display:'flex', flexWrap:'wrap', justifyContent: 'space-around', padding: '0 20px' }}>
                    {modules.map((module, index) => {
                      return <Permission
                                originalChecked={profilePermissions}
                                key={module.key}
                                id={module.key}
                                title={module.name}
                                setPermissions={handleSetPermissions}
                              />
                    })}
                  </div>
                </TabContainer4> */}
                <TabContainer4 dir={theme4.direction}>
                  <CustomFields 
                    customFieldsTab={customFieldsTab}
                    setCustomFieldsTab={setCustomFieldsTab}
                  />
                </TabContainer4>
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

const users = [
  { name: 'The Shawshank Redemption', year: 1994 },
  { name: 'The Godfather', year: 1972 },
  { name: 'The Godfather: Part II', year: 1974 },
  { name: 'The Dark Knight', year: 2008 },
  { name: '12 Angry Men', year: 1957 },
  { name: "Schindler's List", year: 1993 },
  { name: 'Pulp Fiction', year: 1994 },
  { name: 'The Lord of the Rings: The Return of the King', year: 2003 },
  { name: 'The Good, the Bad and the Ugly', year: 1966 },
  { name: 'Fight Club', year: 1999 },
  { name: 'The Lord of the Rings: The Fellowship of the Ring', year: 2001 },
  { name: 'Star Wars: Episode V - The Empire Strikes Back', year: 1980 },
  { name: 'Forrest Gump', year: 1994 },
  { name: 'Inception', year: 2010 },
  { name: 'The Lord of the Rings: The Two Towers', year: 2002 },
  { name: "One Flew Over the Cuckoo's Nest", year: 1975 },
  { name: 'Goodfellas', year: 1990 },
  { name: 'The Matrix', year: 1999 },
  { name: 'Seven Samurai', year: 1954 },
  { name: 'Star Wars: Episode IV - A New Hope', year: 1977 },
  { name: 'City of God', year: 2002 },
  { name: 'Se7en', year: 1995 },
  { name: 'The Silence of the Lambs', year: 1991 },
  { name: "It's a Wonderful Life", year: 1946 },
  { name: 'Life Is Beautiful', year: 1997 },
  { name: 'The Usual Suspects', year: 1995 },
  { name: 'Léon: The Professional', year: 1994 },
  { name: 'Spirited Away', year: 2001 },
  { name: 'Saving Private Ryan', year: 1998 },
  { name: 'Once Upon a Time in the West', year: 1968 },
  { name: 'American History X', year: 1998 },
  { name: 'Interstellar', year: 2014 },
  { name: 'Casablanca', year: 1942 },
  { name: 'City Lights', year: 1931 },
  { name: 'Psycho', year: 1960 },
  { name: 'The Green Mile', year: 1999 },
  { name: 'The Intouchables', year: 2011 },
  { name: 'Modern Times', year: 1936 },
  { name: 'Raiders of the Lost Ark', year: 1981 },
  { name: 'Rear Window', year: 1954 },
  { name: 'The Pianist', year: 2002 },
  { name: 'The Departed', year: 2006 },
  { name: 'Terminator 2: Judgment Day', year: 1991 },
  { name: 'Back to the Future', year: 1985 },
  { name: 'Whiplash', year: 2014 },
  { name: 'Gladiator', year: 2000 },
  { name: 'Memento', year: 2000 },
  { name: 'The Prestige', year: 2006 },
  { name: 'The Lion King', year: 1994 },
  { name: 'Apocalypse Now', year: 1979 },
  { name: 'Alien', year: 1979 },
  { name: 'Sunset Boulevard', year: 1950 },
  { name: 'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb', year: 1964 },
  { name: 'The Great Dictator', year: 1940 },
  { name: 'Cinema Paradiso', year: 1988 },
  { name: 'The Lives of Others', year: 2006 },
  { name: 'Grave of the Fireflies', year: 1988 },
  { name: 'Paths of Glory', year: 1957 },
  { name: 'Django Unchained', year: 2012 },
  { name: 'The Shining', year: 1980 },
  { name: 'WALL·E', year: 2008 },
  { name: 'American Beauty', year: 1999 },
  { name: 'The Dark Knight Rises', year: 2012 },
  { name: 'Princess Mononoke', year: 1997 },
  { name: 'Aliens', year: 1986 },
  { name: 'Oldboy', year: 2003 },
  { name: 'Once Upon a Time in America', year: 1984 },
  { name: 'Witness for the Prosecution', year: 1957 },
  { name: 'Das Boot', year: 1981 },
  { name: 'Citizen Kane', year: 1941 },
  { name: 'North by Northwest', year: 1959 },
  { name: 'Vertigo', year: 1958 },
  { name: 'Star Wars: Episode VI - Return of the Jedi', year: 1983 },
  { name: 'Reservoir Dogs', year: 1992 },
  { name: 'Braveheart', year: 1995 },
  { name: 'M', year: 1931 },
  { name: 'Requiem for a Dream', year: 2000 },
  { name: 'Amélie', year: 2001 },
  { name: 'A Clockwork Orange', year: 1971 },
  { name: 'Like Stars on Earth', year: 2007 },
  { name: 'Taxi Driver', year: 1976 },
  { name: 'Lawrence of Arabia', year: 1962 },
  { name: 'Double Indemnity', year: 1944 },
  { name: 'Eternal Sunshine of the Spotless Mind', year: 2004 },
  { name: 'Amadeus', year: 1984 },
  { name: 'To Kill a Mockingbird', year: 1962 },
  { name: 'Toy Story 3', year: 2010 },
  { name: 'Logan', year: 2017 },
  { name: 'Full Metal Jacket', year: 1987 },
  { name: 'Dangal', year: 2016 },
  { name: 'The Sting', year: 1973 },
  { name: '2001: A Space Odyssey', year: 1968 },
  { name: "Singin' in the Rain", year: 1952 },
  { name: 'Toy Story', year: 1995 },
  { name: 'Bicycle Thieves', year: 1948 },
  { name: 'The Kid', year: 1921 },
  { name: 'Inglourious Basterds', year: 2009 },
  { name: 'Snatch', year: 2000 },
  { name: '3 Idiots', year: 2009 },
  { name: 'Monty Python and the Holy Grail', year: 1975 },
];

export default ModalProcessStages;
