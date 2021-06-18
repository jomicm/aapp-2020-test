import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useDispatch } from 'react-redux';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormGroup,
  FormLabel,
  IconButton,
  makeStyles,
  TextField,
  Typography,
  withStyles
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { actions } from '../../../../../store/ducks/general.duck';
import { getDB, getOneDB, updateDB, postDB } from '../../../../../crud/api';

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

const DialogContent5 = withStyles(() => ({
  root: {
    padding: '0px 16px 30px 16px'
  }
}))(DialogContent);

const DialogActions5 = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(1)
  }
}))(DialogActions);


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

export default function ModalGroups({ showModal, setShowModal, reloadTable, id, employeeProfileRows, groups }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { showCustomAlert, showErrorAlert, showSavedAlert, showUpdatedAlert } = actions;
  const [users, setUsers] = useState([]);
  const [removedUsers, setRemovedUsers] = useState([]);
  const [values, setValues] = useState({
    members: [],
    name: ''
  });

  const displayWarningError = (message) => {
    dispatch(showCustomAlert({
      message,
      open: true,
      type: 'warning'
    }));
  };

  const handleSave = () => {
    const { name, members } = values;

    if (!name.length && members.length < 1) {
      displayWarningError('Please fill all the fields.');
      return;
    }

    if (!name.length) {
      displayWarningError('Please name the group');
      return;
    }

    if (members.length < 1) {
      displayWarningError('Not enough members. Please assign at least one user to a group.');
      return;
    }

    let valid = true;

    groups.forEach((group) => {
      if (!id) {
        if (group.name.toLowerCase() === name.toLowerCase()) {
          valid = false;
        }
      } else {
        if (group.id !== id[0] && group.name.toLowerCase() === name.toLowerCase()) {
          valid = false;
        }
      }
    })

    if (!valid) {
      displayWarningError(`A group with the name "${name}" already exists`);
      return;
    }

    const body = { ...values, numberOfMembers: values.members.length };
    
    if (!id) {
      postDB('settingsGroups', body)
        .then((response) => response.json())
        .then((data) => {
          const { response } = data;
          dispatch(showSavedAlert());
          saveAndReload();
          body.members.forEach(({ value: userId }) => {
            const { _id: groupId, name } = response[0];
            const userGroup = { id: groupId, name, numberOfMembers: body.numberOfMembers };
            getOneDB('user/', userId)
              .then((response) => response.json())
              .then((data) => {
                const { response: { groups } } = data;
                const userBody = groups ? [...groups, userGroup] : [userGroup];
                updateDB('user/', { groups: userBody }, userId)
                  .catch((error) => console.log(error));
              })
              .catch((error) => console.log(error));
          });
        })
        .catch((error) => console.log(error))
    } else {
      updateDB('settingsGroups/', body, id[0])
        .then(response => response.json())
        .then((data) => {
          dispatch(showUpdatedAlert());
          saveAndReload();
          body.members.forEach(({ value: userId }) => {
            const { name } = body;
            const userGroup = { id: id[0], name, numberOfMembers: body.numberOfMembers };
            getOneDB('user/', userId)
              .then((response) => response.json())
              .then((data) => {
                const { response: { groups } } = data;
                let userBody = [];
                // Validate if the user already have the actual group in its information
                groups.forEach((group) => {
                  if (group.id !== id[0]) {
                    userBody.push(group);
                  }
                });

                userBody = [...userBody, userGroup];

                updateDB('user/', { groups: userBody }, userId)
                  .catch((error) => console.log(error));
              })
              .catch((error) => console.log(error));
          });
          removedUsers.forEach((userId) => {
            getOneDB('user/', userId)
              .then((response) => response.json())
              .then((data) => {
                const { response: { groups } } = data;
                const userBody = (groups || []).filter(({ id: groupId }) => groupId !== id[0]) || [];
                updateDB('user/', { groups: userBody }, userId)
                  .catch((error) => console.log(error));
              })
              .catch((error) => console.log(error));
          });
        })
        .catch((error) => console.log(error))
    }
    handleCloseModal();
  };

  const saveAndReload = (folderName, id) => {
    reloadTable();
  };

  const handleCloseModal = () => {
    reset();
    setShowModal(false);
  };

  const handleOnChangeValue = (event) => {
    const { target: { value } } = event;
    setValues(prev => ({ ...prev, name: value }));
  };

  const reset = () => {
    setValues({
      name: '',
      members: []
    });
    setRemovedUsers([]);
  };

  const loadInitData = () => {
    getDB('user')
      .then((response) => response.json())
      .then((data) => {
        const usersTemp = data.response.map(({ _id: value, email: label, name, lastName }) => ({ value, label, name, lastName }));
        setUsers(usersTemp);
      })
      .catch((error) => dispatch(showErrorAlert()))
  };

  useEffect(() => {
    if (!id || !Array.isArray(id)) {
      reset();
      loadInitData();
      return;
    }

    getOneDB('settingsGroups/', id[0])
      .then(response => response.json())
      .then(data => {
        if (data.response) {
          const { name, members } = data.response;
          setValues(prev => ({ ...prev, members, name }));
        }
      })
      .catch((error) => console.log(error))
  }, [id, employeeProfileRows]);

  return (
    <div>
      <Dialog
        aria-labelledby="customized-dialog-title"
        onClose={handleCloseModal}
        open={showModal}
      >
        <DialogTitle5
          id="customized-dialog-title"
          onClose={handleCloseModal}
        >
          {`${id ? 'Edit' : 'Add'} Group`}
        </DialogTitle5>
        <DialogContent5 dividers>
          <div className="kt-section__content">
            <div className={classes.textField}>
              <TextField
                id='standard-name'
                label='Group Name'
                margin='normal'
                name='name'
                onChange={handleOnChangeValue}
                value={values.name}
              />
            </div>
            <div style={{ marginTop: '30px' }} className={classes.textField}>
              <FormLabel style={{ marginTop: '0px' }} component="legend"> Members </FormLabel>
              <FormGroup>
                <Select
                  sty
                  classNamePrefix="select"
                  isClearable
                  isMulti
                  menuPlacement="bottom"
                  menuPosition="fixed"
                  name="color"
                  onChange={members => {
                    const membersUpdated = members || [];
                    if (values.members.length > membersUpdated.length) {
                      const userRemoved = values.members.find((member) => !membersUpdated.includes(member));
                      setRemovedUsers(prev => [...prev, userRemoved.value]);
                    } else {
                      const userAssigned = membersUpdated.find((member) => !values.members.includes(member));
                      setRemovedUsers(prev => prev.filter((member) => member !== userAssigned.value));
                    }
                    setValues(prev => ({ ...prev, members: membersUpdated }));
                  }}
                  options={users}
                  value={values.members}
                />
              </FormGroup>
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
}
