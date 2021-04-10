import React from 'react';
import { Dropdown, ButtonGroup } from 'react-bootstrap';
import PropTypes from 'prop-types';

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

  const handleStatus = (newStatus) => {
    const body = { "status": newStatus };
    updateDB('messages/', body, id)
      .then(_ => loadMessages())
      .catch(error => console.log('Error', error));
  }

  return (
    <div style={{ position: 'absolute', right: '20px' }}>
      <Dropdown as={ButtonGroup} drop="left">
        <Dropdown.Toggle as={SnapshotToggle}>
          <IconButton>
            <ExpandMoreIcon fontSize="small" />
          </IconButton>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => (
            trash ? handleStatus("deleted") : handleStatus("trash")
          )}>
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
              <Dropdown.Item onClick={() => handleStatus("new")}>
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
  );
}

SnapshotDropdown.propTypes = {
  trash: PropTypes.bool.isRequired,
  loadMessages: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};
