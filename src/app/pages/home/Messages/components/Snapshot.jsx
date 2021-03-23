import React from 'react';
import {
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
import './Snapshot.scss';
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

const Snapshot = ({ id, lastName, name, subject, description, img, senderName, dateTime, to, onHover }) => {

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
          {
            onHover ? (
              <ListItemSecondaryAction>
                <DeleteIcon className='snapshot-delete-icon' onClick={() => alert('Deleted')} /> 
              </ListItemSecondaryAction>
            ) : null
          }
        </ListItem>
      </List>
    </div>
  );
};

export default Snapshot;
