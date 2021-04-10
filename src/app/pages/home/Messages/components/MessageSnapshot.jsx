import React from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, ButtonGroup } from 'react-bootstrap';

import {
  makeStyles,
  Grid,
  Typography,
  Avatar,
  IconButton,
} from '@material-ui/core';

import { updateDB, deleteDB } from '../../../../crud/api';
import SnapshotToggle from './SnapshotToggle';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import DeleteIcon from '@material-ui/icons/Delete';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flex: 1,
    '&:hover': {
      backgroundColor: '#F5F5F5',
      cursor: 'pointer',
    },
    alignItems: 'center',
    borderRadius: '10px',
  },
  snapshot: {
    flex: 1,
    alignItems: 'flex-start',
    flexDirection: 'column',
    padding: '10px 5px',
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  },
  avatar: {
    [theme.breakpoints.down('sm')]: {
      marginLeft: '8px',
      marginBottom: '5px',
      width: '30px',
      height: '30px',
    },
  },
  snapshotInfo: {
    flex: 1,
    width: '100%',
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
  text: {
    color: 'black',
  },
}));

export default function MessageSnapshot({ message, loadMessages, controlPage, trash = false }) {
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
    const body = { "status": "deleted" };
    updateDB('messages/', body, _id)
      .then(response => {
        console.log(response);
        loadMessages();
      })
      .catch(error => console.log('Error', error));
  };

  const moveToTrash = () => {
    const body = { "status": "trash" };
    updateDB('messages/', body, _id)
      .then(response => {
        console.log(response);
        loadMessages();
      })
      .catch(error => console.log('Error', error));
  };

  const backToMain = () => {
    const body = { "status": "new" };
    updateDB('messages/', body, _id)
      .then(response => {
        console.log(response);
        loadMessages();
      })
      .catch(error => console.log('Error', error));
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
      >
        <Avatar className={classes.avatar} alt="User image" src={img} />
        <Grid className={classes.snapshotInfo}>
          <Grid
            style={{ flex: 1 }}
            container
            item
            direction="row"
            alignItems="center"
            justify="space-between"
          >
            <Typography className={classes.text} style={{ fontWeight: 'bold' }} variant="subtitle2">
              {`${from[0].name} ${from[0].lastName}`}
            </Typography>
            <Dropdown as={ButtonGroup} drop="left">
              <Dropdown.Toggle as={SnapshotToggle}>
                <Link
                  to={`/messages?id=${message._id}&page=${controlPage}`}
                >
                  <IconButton style={{ padding: '5px' }}>
                    <ExpandMoreIcon fontSize="small" />
                  </IconButton>
                </Link>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={ trash ? handleDelete : moveToTrash }>
                  <Grid
                    style={{ flex: 1 }}
                    container
                    item
                    direction="row"
                    alignItems="center"
                  >
                    <DeleteIcon style={{ marginRight: '10px' }} color="black" />
                    <Typography>
                      { trash ? 'Delete message' : 'Move to trash' }
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
          </Grid>
          <Grid style={{ flex: 1 }} item>
            <Typography
              style={{
                width: '80%',
              }}
              className={classes.text}
              variant="body2"
            >
              {subject}
            </Typography>
          </Grid>
          <Grid style={{ flex: 1 }} container item direction="row" justify="space-between">
            <Typography className={classes.text} variant="caption">
              {from[0].email}
            </Typography>
            <Typography className={classes.text} variant="caption">
              {timeStamp}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
