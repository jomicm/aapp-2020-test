/* eslint-disable no-restricted-imports */
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import {
  Card,
  CardContent,
  IconButton,
  InputBase,
  Typography
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

import Table from './Table';
import { postDBEncryptPassword, getDB, getOneDB, updateDB, postDB, getDBComplex } from '../../../../crud/api';

const AssetFinder = ({ isAssetReference = false, onSelectionChange = () => {} }) => {
  const classes = useStyles();
  const [searchText, setSearchText] = useState('');
  const [assetRows, setAssetRows] = useState([]);

  const handleOnSearchClick = () => {
    const queryLike = ['name', 'brand', 'model'].map(key => ({ key, value: searchText }))
    const collection = isAssetReference ? 'references' : 'assets';

    getDBComplex({ collection, queryLike })
      .then(response => response.json())
      .then(data => {
        const rows = data.response.map(row => {
          const { name, brand, model, _id: id, sn = 'sn' } = row;
          const assigned = !!row.assigned;
          return { name, brand, model, id, sn, assigned };
        });
        setAssetRows(rows);
      })
      .catch(error => console.log(error));
  };

  return (
    <div>
      <Paper className={classes.root} style={{ marginTop: '10px', width: '100%' }}>
        <InputBase
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          className={classes.input}
          placeholder="Search Assets"
          inputProps={{ 'aria-label': 'search google maps' }}
        />
        <IconButton onClick={handleOnSearchClick} className={classes.iconButton} aria-label="search">
          <SearchIcon />
        </IconButton>
      </Paper>
      <div style={{ display: 'flex' }}>
        <Table columns={getColumns(isAssetReference)} rows={assetRows} setTableRowsInner={onSelectionChange} />
        <Card style={{ width: '350px', marginLeft: '15px' }}>
          <CardContent style={{ display: 'flex', flexDirection: 'column', minHeight: '400px' }}>
            <Typography className={classes.title} color="textPrimary" gutterBottom style={{ textAlign: 'center' }}>
              Preview
            </Typography>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <img style={{ width: '200px', height: '150px', margin: '0 auto'}} src='https://icon-library.com/images/photo-placeholder-icon/photo-placeholder-icon-6.jpg'/>
            </div>
            <Typography className={classes.title} color="textPrimary" gutterBottom style={{ marginTop: '25px' }}>
              Description:
            </Typography>
            <Typography className={classes.title} color="textPrimary" gutterBottom style={{ marginTop: '25px' }}>
              Brand:
            </Typography>
            <Typography className={classes.title} color="textPrimary" gutterBottom style={{ marginTop: '25px' }}>
              Model:
            </Typography>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const getColumns = (isAssetReference) => {
  const assetReference = [
    { field: 'name', headerName: 'Name', width: 130 },
    { field: 'brand', headerName: 'Brand', width: 130 },
    { field: 'model', headerName: 'Model', width: 130 }
  ];

  if (isAssetReference) {
    return assetReference;
  } else {
    return [
      ...assetReference,
      { field: 'assigned', headerName: 'Assigned', width: 90 },
      { field: 'id', headerName: 'EPC', width: 200 },
      { field: 'sn', headerName: 'Serial Number', width: 200 }
    ]
  }
}; 

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 850,
    marginTop: '-30px',
    marginBottom: '30px'
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));

export default AssetFinder;
