import React from 'react';
import PropTypes from 'prop-types';

import {
  makeStyles,
  Grid,
  Typography,
  Avatar,
} from '@material-ui/core';

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

export default function MessageSnapshot({ message }) {
  const classes = useStyles();
  const {
    img,
    subject,
    timeStamp,
    from,
    read,
  } = message;

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
              {
                from[0].name ? `${from[0].name} ${from[0].lastName}` : from[0].email
              }
            </Typography>
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

MessageSnapshot.propTypes = {
  message: PropTypes.shape.isRequired,
};
