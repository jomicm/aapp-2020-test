import React from 'react';
import { Dropdown, ButtonGroup } from 'react-bootstrap';

import {
  Grid,
  Typography,
  IconButton,
} from '@material-ui/core';

import { updateDB } from '../../../../crud/api';
import SnapshotToggle from './SnapshotToggle';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import DeleteIcon from '@material-ui/icons/Delete';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

export default function SnapshotDropdown({ trash, loadMessages, id }) {

  const handleDelete = () => {
    const body = { "status": "deleted" };
    updateDB('messages/', body, id)
      .then(response => {
        console.log(response);
        loadMessages();
      })
      .catch(error => console.log('Error', error));
  };

  const moveToTrash = () => {
    const body = { "status": "trash" };
    updateDB('messages/', body, id)
      .then(response => {
        console.log(response);
        loadMessages();
      })
      .catch(error => console.log('Error', error));
  };

  const backToMain = () => {
    const body = { "status": "new" };
    updateDB('messages/', body, id)
      .then(response => {
        console.log(response);
        loadMessages();
      })
      .catch(error => console.log('Error', error));
  };

  return (
    <div style={{ position: 'absolute', right: '20px' }}>
      <Dropdown as={ButtonGroup} drop="left">
        <Dropdown.Toggle as={SnapshotToggle}>
          <IconButton>
            <ExpandMoreIcon fontSize="small" />
          </IconButton>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={trash ? handleDelete : moveToTrash}>
            <Grid
              style={{ flex: 1 }}
              container
              item
              direction="row"
              alignItems="center"
            >
              <DeleteIcon style={{ marginRight: '10px' }} color="black" />
              <Typography>
                {trash ? 'Delete message' : 'Move to trash'}
              </Typography>
            </Grid>
          </Dropdown.Item>
          {
            trash && (
              <Dropdown.Item onClick={backToMain}>
                <Grid
                  style={{ flex: 1 }}
                  container
                  item
                  direction="row"
                  alignItems="center"
                >
                  <KeyboardBackspaceIcon style={{ marginRight: '10px' }} color="black" />
                  <Typography>
                    Back to Inbox
                </Typography>
                </Grid>
              </Dropdown.Item>
            )
          }
        </Dropdown.Menu>
      </Dropdown>
    </div>
  )
}
