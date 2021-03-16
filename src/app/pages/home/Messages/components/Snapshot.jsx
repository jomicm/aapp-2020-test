import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
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
    minWidth: 390,
    maxWidth: 390,
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

  console.log('Deleted', id)

  const handleDelete = () => {
    
  console.log('Deleted CONSOLE LOG', id)
    deleteDB('messages/', id)
      .then(response => console.log('success', response))
      .catch(error => console.log('Error', error));
  }

  return (
    <>
      <div className='container-messages-snapshot'>
        <div>
          <List>
            <ListItem className='snapshot-wrapper'>
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
            </ListItem>
          </List>
        </div>
        <div className='container-snapshot-delete-icon' onClick={handleDelete}>
          <DeleteIcon className='snapshot-delete-icon' />
        </div>
        <Divider />
      </div>
    </>
  );
};

export default Snapshot;
