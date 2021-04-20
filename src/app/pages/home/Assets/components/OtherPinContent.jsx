import React from 'react';

import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  title: {
    alignSelf: 'left',
    marginBottom: '20px',
  },
  content: {
    display: 'flex',
    flex: 1,
    width: '100%',
  },
}));

export default function OtherPinContent({ title, children }) {
  const classes = useStyles();
  return (
    <>
      <h4 className={classes.title}>
        {title}
      </h4>
      <div className={classes.content}>
        {children}
      </div>
    </>
  )
}
