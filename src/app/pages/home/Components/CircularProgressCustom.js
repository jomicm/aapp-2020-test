import React from 'react';
import { makeStyles, CircularProgress } from '@material-ui/core';

// Inspired by the former Facebook spinners.
const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    alignItems: 'center',
    display: 'flex',
  },
  bottom: {
    color: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
  },
  top: {
    color: '#1a90ff',
    animationDuration: '550ms',
    position: 'absolute',
    left: 0,
  },
  circle: {
    strokeLinecap: 'round',
  },
}));

const CircularProgressCustom = (props) => {
  const classes = useStyles();
  const { size } = props;
  return (
    <div className={classes.root}>
      <CircularProgress
        variant="determinate"
        className={classes.bottom}
        size={size}
        thickness={4}
        {...props}
        value={100}
      />
      <CircularProgress
        variant="indeterminate"
        disableShrink
        className={classes.top}
        classes={{
          circle: classes.circle,
        }}
        size={size}
        thickness={4}
        {...props}
      />
    </div>
  );
}

export default CircularProgressCustom;