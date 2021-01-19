import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import{
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

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    minWidth: 390,
    maxWidth: 390,
    backgroundColor: theme.palette.background.paper
  },
  inline: {
    display: 'inline'
  }
}));

const Snapshot = ({ subject, description, img, senderName, dateTime }) => {
  const classes = useStyles();

  return (
    <div className='container-messages-snapshot'>
      <List className={classes.root}>
        <ListItem alignItems='flex-start' className='snapshot-wrapper'>
          <ListItemAvatar>
            <Avatar alt='Remy Sharp' src={img} />
          </ListItemAvatar>
          <ListItemText
            primary={subject}
            secondary={
              <React.Fragment>
                <Typography
                  className={classes.inline}
                  color='textPrimary'
                  component='span'
                  variant='body2'
                >
                  {senderName}
                </Typography>
                {`- ${description}`}
              </React.Fragment>
            }
          />
        </ListItem>
        <Divider component='li' variant='inset' />
      </List>
      <div className='container-snapshot-delete-icon'>
        <DeleteIcon className='snapshot-delete-icon' onClick={() => alert('Deleted')} />
      </div>
    </div>
  );
};

export default Snapshot;
