/* eslint-disable no-restricted-imports */
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';

import Table from './Table';
import { postDBEncryptPassword, getDB, getOneDB, updateDB, postDB, getDBComplex } from '../../../../crud/api';

const AssetFinder = ({ setTableRowsInner }) => {
  const classes = useStyles();
  const [searchText, setSearchText] = useState('');
  const [assetRows, setAssetRows] = useState([]);
  const handleOnSearchClick = () => {
    const queryLike = ['name', 'brand', 'model'].map(key => ({ key, value: searchText }))
    getDBComplex({ collection: 'assets', queryLike })
      .then(response => response.json())
      .then(data => {
        const rows = data.response.map(row => {
          debugger
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
      <Paper className={classes.root}>
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
      <Table columns={getColumns()} rows={assetRows} setTableRowsInner={setTableRowsInner} />
    </div>
  );
};

const getColumns = (isAssetReference = false) => {
  const assetReference = [
    { field: 'name', headerName: 'Name', width: 130 },
    { field: 'brand', headerName: 'Brand', width: 130 },
    { field: 'model', headerName: 'Model', width: 130 },
    { field: 'assigned', headerName: 'Assigned', width: 90 }
  ];

  if (isAssetReference) {
    return assetReference;
  } else {
    return [
      ...assetReference,
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
