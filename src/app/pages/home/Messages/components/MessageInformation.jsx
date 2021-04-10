import React from 'react';
import {
  makeStyles,
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography
} from '@material-ui/core';
import Preview from './Preview';

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    height: '100%',
    [theme.breakpoints.up('md')]: {
      marginLeft: '20px',
      marginBottom: '40px',
    },
    border: '1px solid lightGrey',
  },
}));

export default function MessageInformation({ headerInfo, preview }) {
  const classes = useStyles();
  const {
    timeStamp,
    img,
    senderName,
    subject,
    to,
  } = headerInfo;
  return (
    <Card className={classes.root} elevation={0}>
      <CardHeader
        avatar={<Avatar alt="user image" src={img} />}
        title={
          <Typography variant="h5">
            {subject}
          </Typography>
        }
        subheader={
          <Typography>
            {timeStamp}
          </Typography>
        }
      />
      <Divider />
      <CardContent>
        <Typography
          style={{ fontSize: '20px' }}
          variant="body2"
          color="primary"
        >
          <Preview preview={preview} />
        </Typography>
      </CardContent>
    </Card>
  );
}
