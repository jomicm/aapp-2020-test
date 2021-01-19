import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import Preview from "./Preview";
import "./MessageInformation.scss";

const useStyles = makeStyles(theme => ({
  card: {
    width: '100%',
    height: '100%'
    // maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  avatar: {
    width: 60,
    height: 60,

  },
  subject: {
    fontSize: 30,
  },
  dateTime: {
    fontSize: 15,
  },
  preview: {
    fontSize: 20,
  },
}));

const MessageInformation = ({ dateTime, img, senderName, subject, preview }) => {

  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardHeader
        // avatar={
        //   <Avatar alt='img' aria-label="Recipe" className={classes.avatar} src={img} />
        // }
        avatar={<img className='message-information-img' src={img} />}
        title={
          <Typography 
            variant="body2" 
            color="textSecondary" 
            className={classes.subject} 
            component="h2"
            > 
            {subject}
          </Typography>
         }
        subheader={
          <Typography 
            variant="body2" 
            color="textSecondary" 
            className={classes.dateTime} 
            component="div"
            > 
            {dateTime}
          </Typography>
         }
      />
      <Divider />
      <CardContent>
        <Typography className={classes.preview} variant="body2" color="textSecondary" component="p">
          <Preview preview={preview}/>
        </Typography>
      </CardContent>
    </Card>
  );
};

export default MessageInformation;
