import React, { useState } from 'react';
import {
  Paper,
  InputBase,
  IconButton,
  makeStyles
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { getDBComplex } from '../../../../crud/api';
import Table from '../../Components/AssetFinder/Table';

const AssetFinder = ({ setTableRowsInner = () => { }, userLocations }) => {
  const classes = useStyles();
  const [assetRows, setAssetRows] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOnSearchClick = (e) => {
    const { target: { value } } = e;
    setSearchText(value);
    setLoading(true);
    const queryLike = ['name', 'brand', 'model', 'EPC', 'serial'].map(key => ({ key, value: searchText || '' }));
    const condition = [{ "location": { "$in": userLocations } }];
    getDBComplex({ collection: 'assets', queryLike, condition })
      .then(response => response.json())
      .then(data => {
        const rows = data.response.map(row => {
          const { name, brand, model, EPC, _id: id, serial } = row;
          const parent = !!row.parent;
          return { id, name, brand, model, parent, EPC, serial };
        });
        setAssetRows(rows);
      })
      .catch(error => console.log(error))
      .finally(() => setLoading(false));
  };

  return (
    <div>
      <Paper className={classes.root}>
        <InputBase
          value={searchText}
          onChange={handleOnSearchClick}
          className={classes.input}
          placeholder='Search Assets'
          inputProps={{ 'aria-label': 'search google maps' }}
        />
        <IconButton className={classes.iconButton} aria-label='search'>
          <SearchIcon />
        </IconButton>
      </Paper>
      <Table columns={getColumns()} rows={assetRows} setTableRowsInner={setTableRowsInner} loading={loading} />
    </div>
  );
};

const getColumns = (isAssetReference = false) => {
  const assetReference = [
    { field: 'name', headerName: 'Name', width: 130 },
    { field: 'brand', headerName: 'Brand', width: 130 },
    { field: 'model', headerName: 'Model', width: 130 },
  ];

  if (isAssetReference) {
    return assetReference;
  } else {
    return [
      ...assetReference,
      { field: 'parent', headerName: 'Parent', width: 130 },
      { field: 'EPC', headerName: 'EPC', width: 200 },
      { field: 'serial', headerName: 'Serial Number', width: 200 }
    ];
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
