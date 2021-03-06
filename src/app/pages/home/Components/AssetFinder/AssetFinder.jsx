import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import { getDBComplex } from '../../../../crud/api';
import Table from './Table';

const AssetFinder = ({ setTableRowsInner = () => { }, userLocations }) => {
  const classes = useStyles();
  const [assetRows, setAssetRows] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOnSearchClick = (e) => {
    const { target: { value } } = e;
    setSearchText(value);
    setLoading(true);
    const queryLike = ['name', 'brand', 'model', 'EPC', 'serial'].map(key => ({ key, value: value || '' }));
    const condition = [{ "location": { "$in": userLocations } }];
    getDBComplex({ collection: 'assets', queryLike, condition })
      .then(response => response.json())
      .then(data => {
        const rows = data.response.map(row => {
          const { name, brand, model, EPC, _id: id, serial } = row;
          const assigned = !!row.assigned;
          return { id, name, brand, model, assigned, EPC, serial };
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
    { field: 'assigned', headerName: 'Assigned', width: 90 }
  ];

  if (isAssetReference) {
    return assetReference;
  } else {
    return [
      ...assetReference,
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
