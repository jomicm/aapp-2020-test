import React, { Fragment } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';

import {
  makeStyles,
  Grid,
  Typography,
  Avatar,
} from '@material-ui/core';

import { deleteDB } from '../../../../crud/api';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flex: 1,
    '&:hover': {
      backgroundColor: '#F5F5F5',
      cursor: 'pointer',
    },
  },
  snapshot: {
    flex: 1,
    alignItems: 'center',
  },
  snapshotInfo: {
    flex: 1,
    padding: '0px 20px 0px 10px',
    alignItems: 'flex-start',
    alignContent: 'center',
  },
  blueBar: {
    display: 'flex',
    alignSelf: 'center',
    marginRight: '5px',
    backgroundColor: '#5867DD',
    width: '5px',
    height: '90%',
    borderRadius: '2px',
  },
}));

export default function MessageSnapshot({ message, loadMessages }) {
  const classes = useStyles();
  const {
    _id,
    img,
    subject,
    timeStamp,
    from,
    read,
  } = message;

  const handleDelete = () => {
    deleteDB('messages/', _id)
      .then(response => console.log('success', response))
      .catch(error => console.log('Error', error));
    setTimeout(() => {
      loadMessages();
    }, 100);
  };

  return (
    <div className={classes.root}>
      <div
        style={{
          marginRight: read ? '10px' : null,
        }}
        className={!read ? classes.blueBar : ''}
      />
      <Grid
        className={classes.snapshot}
        container
        item
        direction="row"
      >
        <Avatar alt="User image" src={img} />
        <Grid className={classes.snapshotInfo}>
          <Grid
            style={{ flex: 1 }}
            container
            item
            direction="row"
            alignItems="center"
            justify="space-between"
          >
            <Typography style={{ fontWeight: 'bold' }} variant="subtitle2">
              {`${from[0].name} ${from[0].lastName}`}
            </Typography>
            <DropdownButton
              id={`dropdown-snapshot-${_id}`}
              size="md"
              drop="left"
              title=""
            >
              <Dropdown.Item onClick={handleDelete}>
                <Grid
                  style={{ flex: 1 }}
                  container
                  item
                  direction="row"
                  alignItems="center"
                >
                  <DeleteIcon style={{ marginRight: '10px' }} />
                  <Typography>
                    To trash
                </Typography>
                </Grid>
              </Dropdown.Item>
            </DropdownButton>
          </Grid>
          <Typography variant="body2">
            {subject}
          </Typography>
          <Grid style={{ flex: 1 }} container item direction="row" justify="space-between">
            <Typography variant="caption">
              {from[0].email}
            </Typography>
            <Typography variant="caption">
              {timeStamp}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
