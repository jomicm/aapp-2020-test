import React from 'react';

import { makeStyles } from '@material-ui/core';

import AssetTable from './AssetTable';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    width: '100%',
  },
}));

export default function OtherModalChildrenTab({ assetRows, onAssetFinderSubmit, onDeleteAssetAssigned }) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AssetTable
        assetRows={assetRows}
        onAssetFinderSubmit={onAssetFinderSubmit}
        onDeleteAssetAssigned={onDeleteAssetAssigned}
      />
    </div>
  )
}
