import React from 'react';
import {
  Avatar,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
  Typography
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import {
  deleteDB,
} from '../../../../crud/api';
import './Snapshot.scss';

const useStyles = makeStyles(theme => ({
  root: {
    width: '60%',
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

const Snapshot = ({
  dateTime,
  id,
  img,
  lastName,
  name,
  senderName,
  subject,
  reload
}) => {
  const classes = useStyles();

  const handleDelete = () => {
    deleteDB('messages/', id)
      .then(response => console.log('success', response))
      .catch(error => console.log('Error', error));
    setTimeout(() => {
      reload();
    }, 100);
  };

  return (
    <div className='container-messages-snapshot'>
      <div style={{ width: '90%' }}>
        <List>
          <ListItem className='snapshot-wrapper'>
            <ListItemAvatar>
              <Avatar alt='Remy Sharp' src={img} />
            </ListItemAvatar>
            <ListItemText
              primary={`${name} ${lastName} <${senderName}>`}
              secondary={
                <>
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
                </>
              }
            />
          </ListItem>
        </List>
      </div>

      <div className='container-snapshot-delete-icon'>
        <IconButton onClick={handleDelete}>
          <DeleteIcon className='snapshot-delete-icon' />
        </IconButton>
      </div>
      <Divider />
    </div>
  );
};

export default Snapshot;
