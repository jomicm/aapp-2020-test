import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from "@material-ui/icons/Delete";
import "./Snapshot.scss";

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    minWidth: 390,
    maxWidth: 390,
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
  },
}));

const Snapshot = ({ subject, description, img, senderName, dateTime }) => {
  const classes = useStyles();

  return (
    <div className='container-messages-snapshot'>
      <List className={classes.root}>
        <ListItem alignItems="flex-start" className='snapshot-wrapper'>
          <ListItemAvatar>
            <Avatar alt="Remy Sharp" src={img} />
          </ListItemAvatar>
          <ListItemText
            primary={subject}
            secondary={
              <React.Fragment>
                <Typography
                  component="span"
                  variant="body2"
                  className={classes.inline}
                  color="textPrimary"
                >
                  {senderName}
                </Typography>
                {`- ${description}`}
              </React.Fragment>
            }
          />
        </ListItem>
        <Divider variant="inset" component="li" />
      </List>
      <div className='container-snapshot-delete-icon'>
        <DeleteIcon className='snapshot-delete-icon' onClick={() => alert('Deleted')} />
      </div>
    </div>
  );
};

export default Snapshot;
