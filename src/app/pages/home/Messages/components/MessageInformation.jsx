import React from 'react';
import PropTypes from 'prop-types';

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

const MessageInformation = ({ headerInfo, preview }) => {
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
          color="primary"
          style={{ fontSize: '20px' }}
          variant="body2"
        >
          <Preview preview={preview} />
        </Typography>
      </CardContent>
    </Card>
  );
}

MessageInformation.propTypes = {
  headerInfo: PropTypes.shape({
    img: PropTypes.string,
    senderName: PropTypes.string,
    subject: PropTypes.string,
    timeStamp: PropTypes.string,
    to: PropTypes.string,
  }).isRequired,
  preview: PropTypes.string.isRequired,
};

export default MessageInformation;
