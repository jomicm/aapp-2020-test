import React from 'react';
import{
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  makeStyles,
  Typography
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import "./Snapshot.scss";
import {
  postDBEncryptPassword,
  deleteDB,
  getOneDB,
  updateDB,
  postDB,
  getDB
} from '../../../../crud/api';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    // minWidth: 390,
    // maxWidth: 390,
    backgroundColor: theme.palette.background.paper
  },
  subject: {
    display: 'block'
  },
  To: {
    display: 'block',
    fontWeight: 'bold'
  }
}));

const Snapshot = ({ id, lastName, name, subject, description, img, senderName, dateTime, to }) => {

  const classes = useStyles();

  return (
    <div className='container-messages-snapshot'>
      <List className={classes.root}>
        <ListItem alignItems='flex-start' className='snapshot-wrapper'>
          <ListItemAvatar>
            <Avatar alt='Remy Sharp' src={img} />
          </ListItemAvatar>
          <ListItemText
            primary={`${name} ${lastName} <${senderName}>`}
            secondary={
              <React.Fragment>
                <Typography
                  className={classes.subject}
                  color='textPrimary'
                  component='div'
                  variant='body2'
                >
                  {subject}
                </Typography>
                <Typography
                  className={classes.To}
                  color='textPrimary'
                  component='div'
                  variant='body2'
                >
                  {`${dateTime}`}
                </Typography>
              </React.Fragment>
            }
          />
          <ListItemSecondaryAction>
            <DeleteIcon className='snapshot-delete-icon' onClick={() => alert('Deleted')} />
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    </div>
  );
};

export default Snapshot;
