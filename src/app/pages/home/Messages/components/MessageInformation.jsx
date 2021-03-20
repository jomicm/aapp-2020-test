import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography
} from '@material-ui/core';
import Preview from './Preview';
import './MessageInformation.scss';

const useStyles = makeStyles(theme => ({
  card: {
    width: '100%',
    height: '100%'
  },
  media: {
    height: 0,
    paddingTop: '56.25%'
  },
  avatar: {
    height: 60,
    width: 60
  },
  subject: {
    fontSize: 30
  },
  dateTime: {
    fontSize: 15
  },
  preview: {
    fontSize: 20
  }
}));

const MessageInformation = ({ dateTime, img, preview, senderName, subject, to }) => {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardHeader
        avatar={<Avatar alt='Remy Sharp' src={img} />}
        title={
          <Typography
            className={classes.subject}
            color='textSecondary'
            component='h2'
            variant='body2'
          >
            {subject}
          </Typography>
        }
        subheader={
          <Typography
            className={classes.dateTime}
            color='textSecondary'
            component='div'
            variant='body2'
          >
            {dateTime}
          </Typography>
        }
      />
      <Divider />
      <CardContent>
        <Typography className={classes.preview} variant='body2' color='p'>
          <div className='container-messages-preview'>
            <Preview preview={preview} />
          </div>
        </Typography>
      </CardContent>
    </Card>
  );
};

export default MessageInformation;
