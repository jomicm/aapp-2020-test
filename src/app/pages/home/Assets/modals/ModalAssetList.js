/* eslint-disable no-restricted-imports */
import React, { useState, useEffect } from 'react';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent
} from '@material-ui/lab';

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  InputAdornment,
  Tab,
  Tabs,
  Typography,
  Paper,
} from "@material-ui/core";

import {
  withStyles,
  useTheme,
  makeStyles
} from "@material-ui/core/styles";
import TimelineIcon from '@material-ui/icons/Timeline';
import SwipeableViews from "react-swipeable-views";
import CloseIcon from "@material-ui/icons/Close";
import { isEmpty } from 'lodash';

import { postDB, getOneDB, updateDB } from '../../../../crud/api';
import CustomFields from '../../Components/CustomFields/CustomFields';
import BaseFields from '../../Components/BaseFields/BaseFields';
import ImageUpload from '../../Components/ImageUpload';
import { getFileExtension, saveImage, getImageURL } from '../../utils';
import './ModalAssetList.scss';

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

const CustomFieldsPreview = (props) => {
  const customFieldsPreviewObj = {
    singleLine: <SingleLine {...props} />,
    multiLine: <MultiLine {...props} />,
    date: <Date {...props} />,
    dateTime: <DateTime {...props} />,
    dropDown: <DropDown {...props} />,
    radioButtons: <RadioButtons {...props} />,
    checkboxes: <Checkboxes {...props} />,
    fileUpload: <FileUpload {...props} />
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

const ModalAssetList = ({ showModal, setShowModal, referencesSelectedId, reloadTable, id }) => {
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
  // Example 5 - Tabs
  const classes5 = useStyles5();
  const [value5, setValue5] = useState(0);
  const [openHistory, setOpenHistory] = useState(false);

  function handleChange5(event, newValue) {
    setValue5(newValue);
  }

  const handleChange = name => event => {
    if (name === 'price' || name === 'purchase_price') {
      setValues({ ...values, [name]: Number(event.target.value) });
    }
    else {
      setValues({ ...values, [name]: event.target.value });
    }
  };


  const [formValidation, setFormValidation] = useState({
    enabled: false,
    isValidForm: {}
  });

  // Example 1 - TextField
  const classes = useStyles();
  const [values, setValues] = useState({
    name: '',
    brand: '',
    model: '',
    category: '',
    status: '',
    serial: '',
    responsible: '',
    notes: '',
    quantity: '',
    purchase_date: '',
    purchase_price: 0,
    price: 0,
    total_price: 0,
    EPC: '',
    location: '',
    creator: '',
    creation_date: '',
    labeling_user: '',
    labeling_date: ''
  });
  const [customFieldsTab, setCustomFieldsTab] = useState({});
  const [tabs, setTabs] = useState([]);

  const baseFieldsLocalProps = {
    name: {
      componentProps: {
        onChange: handleChange('name'),
        value: values.name,
        inputProps: {
          readOnly: true,
        }
      }
    },
    brand: {
      componentProps: {
        onChange: handleChange('brand'),
        value: values.brand,
        inputProps: {
          readOnly: true,
        }
      }
    },
    model: {
      componentProps: {
        onChange: handleChange('model'),
        value: values.model,
        inputProps: {
          readOnly: true,
        }
      }
    },
    category: {
      style: {
        marginTop: '15px'
      },
      componentProps: {
        onChange: handleChange('category'),
        value: values.category,
        inputProps: {
          readOnly: true,
        }
      }
    },
    status: {
      componentProps: {
        onChange: handleChange('status'),
        value: values.status,
        inputProps: {
          readOnly: true,
        }
      }
    },
    serialNumber: {
      componentProps: {
        onChange: handleChange('serial'),
        value: values.serial,
      }
    },
    responsible: {
      componentProps: {
        onChange: handleChange('responsible'),
        value: values.assignedTo,
        inputProps: {
          readOnly: true,
          shrink: true
        }
      }
    },
    notes: {
      componentProps: {
        onChange: handleChange('notes'),
        value: values.notes,
        multiline: true,
        rows: 4
      }
    },
    quantity: {
      componentProps: {
        onChange: handleChange('quantity'),
        value: values.quantity,
        type: "number",
        inputProps: {
          readOnly: true,
        }
      }
    },
    purchaseDate: {
      componentProps: {
        onChange: handleChange('purchase_date'),
        value: values.purchase_date,
        type: "date",
        InputLabelProps: {
          shrink: true
        }
      }
    },
    purchasePrice: {
      ownValidFn: () => !!values.purchase_price || values.purchase_price === 0,
      componentProps: {
        onChange: handleChange('purchase_price'),
        value: values.purchase_price,
        type: "number",
        InputProps: {
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }
      }
    },
    price: {
      ownValidFn: () => !!values.price || values.price === 0,
      componentProps: {
        onChange: handleChange('price'),
        value: values.price,
        type: "number",
        InputProps: {
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }
      }
    },
    totalPrice: {
      componentProps: {
        onChange: handleChange('total_price'),
        value: values.total_price,
        type: "number",
        InputProps: {
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
          readOnly: true,
        }
      }
    },
    EPC: {
      componentProps: {
        onChange: handleChange('EPC'),
        value: values.EPC,
        inputProps: {
          readOnly: true,
        }
      }
    },
    location: {
      componentProps: {
        onChange: handleChange('location'),
        value: values.location,
        inputProps: {
          readOnly: true,
        }
      }
    },
    creator: {
      componentProps: {
        onChange: handleChange('creator'),
        value: values.creator,
        inputProps: {
          readOnly: true,
        }
      }
    },
    creationDate: {
      componentProps: {
        onChange: handleChange('creation_date'),
        value: values.creation_date,
        inputProps: {
          readOnly: true,
        }
      }
    },
    labelingUser: {
      componentProps: {
        onChange: handleChange('labeling_user'),
        value: values.creation_date,
        inputProps: {
          readOnly: true,
        }
      }
    },
    labelingDate: {
      componentProps: {
        onChange: handleChange('labeling_date'),
        value: values.creation_date,
        inputProps: {
          readOnly: true,
        }
      }
    },
  };

  const handleLoadCustomFields = (profile) => {
    if (!profile || !profile.id) return;
    console.log('id:', id)
    getOneDB('categories/', profile.id)
      .then(response => response.json())
      .then(data => {
        console.log(data.response);
        const { customFieldsTab, depreciation } = data.response;
        console.log('customFieldsTab:', customFieldsTab)
        const tabs = Object.keys(customFieldsTab).map(key => ({ key, info: customFieldsTab[key].info, content: [customFieldsTab[key].left, customFieldsTab[key].right] }));
        tabs.sort((a, b) => a.key.split('-').pop() - b.key.split('-').pop());

        console.log('tabs:', tabs)
        setCustomFieldsTab(customFieldsTab);
        setValues(prev => ({ ...prev, depreciation }));
        setTabs(tabs);
      })
      .catch(error => console.log(error));
  };

  const handleSave = () => {
    setFormValidation({ ...formValidation, enabled: true });
    if (!isEmpty(formValidation.isValidForm)) {
      alert('Please fill out missing fields')
      return;
    }

    const fileExt = getFileExtension(image);
    const body = { ...values, customFieldsTab, fileExt };
    console.log('body:', body)
    // console.log('isNew:', isNew)
    if (!id) {
      body.referenceId = referencesSelectedId;
      postDB('assets', body)
        .then(data => data.json())
        .then(response => {
          const { _id } = response.response[0];
          saveAndReload('assets', _id);
        })
        .catch(error => console.log(error));
    } else {
      updateDB('assets/', body, id[0])
        .then(response => {
          saveAndReload('assets', id[0]);
        })
        .catch(error => console.log(error));
    }
    handleCloseModal();
  };

  const [image, setImage] = useState(null);
  const saveAndReload = (folderName, id) => {
    saveImage(image, folderName, id);
    reloadTable();
  };

  const handleCloseModal = () => {
    console.log('HANDLE CLOSE MODAL!')
    setCustomFieldsTab({});
    setValues({
      name: '',
      brand: '',
      model: '',
      category: '',
      status: '',
      serial: '',
      responsible: '',
      notes: '',
      quantity: '',
      purchase_date: '',
      purchase_price: '',
      price: '',
      total_price: '',
      EPC: '',
      location: '',
      creator: '',
      creation_date: '',
      labeling_user: '',
      labeling_date: '',
      assignedTo: ''
    });
    setShowModal(false);
    setValue4(0);
    setTabs([]);
    setFormValidation({
      enabled: false,
      isValidForm: false
    });
  };

  useEffect(() => {
    if (!showModal) return;
    console.log('referencesSelectedId:', referencesSelectedId)

    if (referencesSelectedId) {
      getOneDB('references/', referencesSelectedId)
        .then(response => response.json())
        .then(data => {
          const { name, brand, model, customFieldsTab } = data.response;
          setValues({
            ...values,
            name,
            brand,
            model
          });
          const tabs = Object.keys(customFieldsTab).map(key => ({ key, info: customFieldsTab[key].info, content: [customFieldsTab[key].left, customFieldsTab[key].right] }));
          tabs.sort((a, b) => a.key.split('-').pop() - b.key.split('-').pop());
          setCustomFieldsTab(customFieldsTab);
          setTabs(tabs);
        })
        .catch(error => console.log(error));
    }

    // const profiles = categoryRows.map(cat => ({ id: cat.id, name: cat.name }));
    // console.log('profiles:', profiles)
    // setValues(prev => ({ ...prev, profiles }));
    if (!id || !Array.isArray(id)) return;

    getOneDB('assets/', id[0])
      .then(response => response.json())
      .then(data => {
        console.log(data.response);
        const { name, brand, model, category, status, serial, responsible, notes, quantity, purchase_date, purchase_price, price, total_price, EPC, location, creator, creation_date, labeling_user, labeling_date, customFieldsTab, fileExt, assigned } = data.response;
        if (assigned) {
          getOneDB('employees/', assigned)
            .then(response => response.json())
            .then(data => {
              const nameRes = data.response.name;
              const lastName = data.response.lasName;
              setValues({
                ...values,
                name,
                brand,
                model,
                category,
                status,
                serial,
                responsible,
                notes,
                quantity,
                purchase_date,
                purchase_price,
                price,
                total_price: purchase_price + price,
                EPC,
                location,
                creator,
                creation_date,
                labeling_user,
                labeling_date,
                imageURL: getImageURL(id, 'assets', fileExt),
                assignedTo: `${nameRes ? nameRes : ''} ${lastName ? lastName : ''}`,
              });
            })
            .catch(error => console.log(error));
        }
        else {
          setValues({
            ...values,
            name,
            brand,
            model,
            category,
            status,
            serial,
            responsible,
            notes,
            quantity,
            purchase_date,
            purchase_price,
            price,
            total_price,
            EPC,
            location,
            creator,
            creation_date,
            labeling_user,
            labeling_date,
            imageURL: getImageURL(id, 'assets', fileExt),
          });
        }
        const tabs = Object.keys(customFieldsTab).map(key => ({ key, info: customFieldsTab[key].info, content: [customFieldsTab[key].left, customFieldsTab[key].right] }));
        tabs.sort((a, b) => a.key.split('-').pop() - b.key.split('-').pop());
        setCustomFieldsTab(customFieldsTab);
        setTabs(tabs);
      })
      .catch(error => console.log(error));
  }, [showModal]);

  useEffect(() => {
    setFormValidation({ ...formValidation, enabled: true });
  }, [values])

  useEffect(() => {
    setValues(prev => ({ ...prev, total_price: prev.purchase_price + prev.price }));
  }, [values.purchase_price, values.price])

  // Function to update customFields
  const handleUpdateCustomFields = (tab, id, colIndex, CFValues) => {
    const colValue = ['left', 'right'];
    console.log('Looking for you', tab, id, colIndex, values);
    const customFieldsTabTmp = { ...customFieldsTab };

    const field = customFieldsTabTmp[tab][colValue[colIndex]]
      .find(cf => cf.id === id);
    field.values = CFValues;
  };

  return (
    <div style={{ width: '1000px' }}>
      <Dialog onClose={() => setOpenHistory(false)} aria-labelledby="simple-dialog-title" open={openHistory}>
        <DialogTitle id="simple-dialog-title">History</DialogTitle>
        <Timeline >
          <TimelineItem>
            <TimelineOppositeContent>
              <Typography color="textSecondary">03/08/2017</Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Typography>Down for maintenance</Typography>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineOppositeContent>
              <Typography color="textSecondary">21/03/2018</Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Typography>Asigned to a new user</Typography>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineOppositeContent>
              <Typography color="textSecondary">12/12/2019</Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Typography>Location was changed</Typography>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineOppositeContent>
              <Typography color="textSecondary">26/02/2020</Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Typography>Asset was Deleted</Typography>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </Dialog>
      <Dialog
        onClose={handleCloseModal}
        aria-labelledby="customized-dialog-title"
        open={showModal}
      >
        <DialogTitle5
          id="customized-dialog-title"
          onClose={handleCloseModal}
        >
          {`${id ? 'Edit' : 'Add'} Asset`}
        </DialogTitle5>
        <DialogContent5 dividers>
          <div className="kt-section__content" style={{ margin: '-16px' }}>
            <div className={classes4.root}>
              <Paper className={classes4.root}>
                <Tabs
                  value={value4}
                  onChange={handleChange4}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="fullWidth"
                >
                  <Tab label="Asset" />
                  {tabs.map((tab, index) => (
                    <Tab key={`tab-reference-${index}`} label={tab.info.name} />
                  ))}
                </Tabs>
              </Paper>
              <SwipeableViews
                axis={theme4.direction === "rtl" ? "x-reverse" : "x"}
                index={value4}
                onChangeIndex={handleChangeIndex4}
              >
                <TabContainer4 dir={theme4.direction}>
                  <div className="profile-tab-wrapper">
                    <div className="profile-tab-wrapper__content-left">
                      <ImageUpload setImage={setImage} image={values.imageURL}>
                        Asset Photo
                      </ImageUpload>
                      <Button
                        variant="contained"
                        color="default"
                        className={classes.button}
                        startIcon={<TimelineIcon />}
                        style={{
                          marginTop: '20px',
                          width: '60%',
                          alignSelf: 'center',
                        }}
                        onClick={() => setOpenHistory(true)}
                      >
                        History
                      </Button>
                    </div>
                    <div className="profile-tab-wrapper__content-left">
                      <BaseFields
                        catalogue={'assets1'}
                        collection={'assets'}
                        formState={[formValidation, setFormValidation]}
                        localProps={baseFieldsLocalProps}
                        values={values}
                      />
                    </div>
                    <div className="profile-tab-wrapper__content-left">
                      <BaseFields
                        catalogue={'assets2'}
                        collection={'assets'}
                        formState={[formValidation, setFormValidation]}
                        localProps={baseFieldsLocalProps}
                        values={values}
                      />
                    </div>
                  </div>
                </TabContainer4>
                {tabs.map(tab => (
                  <TabContainer4 dir={theme4.direction}>
                    <div className="modal-asset-reference">
                      {Array(tab.content[1].length === 0 ? 1 : 2).fill(0).map((col, colIndex) => (
                        <div className="modal-asset-reference__list-field" >
                          {tab.content[colIndex].map(customField => (
                            <CustomFieldsPreview
                              id={customField.id}
                              type={customField.content}
                              values={customField.values}
                              onDelete={() => { }}
                              onSelect={() => { }}
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

export default ModalAssetList;