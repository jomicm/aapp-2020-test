import React from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';

const previewFields = [
  { id: 'name', label: 'Description' },
  { id: 'brand', label: 'Brand' },
  { id: 'model', label: 'Model' }
];

const AssetPreviewBox = ({ selectedAsset }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Typography color="textPrimary" gutterBottom style={{ textAlign: 'center' }}>
        Preview
      </Typography>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <img style={{ width: '200px', height: '150px', margin: '0 auto'}} src={selectedAsset.picUrl} alt='' />
      </div>
      {previewFields.map(({ id, label }) => (
        <div>
          <Typography color="textSecondary" gutterBottom style={{ marginTop: '15px' }}>
            {label}
          </Typography>
          <Typography color="textPrimary" >
            {selectedAsset[id]}
          </Typography>
        </div>
      ))}
    </div>
  );
};

export default AssetPreviewBox;
