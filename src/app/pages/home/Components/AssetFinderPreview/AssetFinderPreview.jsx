/* eslint-disable no-restricted-imports */
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Chip,
  Card,
  CardContent,
  IconButton,
  InputBase,
  Typography
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import { getDBComplex } from '../../../../crud/api';
import { getImageURL } from '../../utils';
import LocationsTreeView from '../LocationsTreeView/LocationsTreeView';
import Table from './Table';
import AssetPreviewBox from './AssetPreviewBox';
import { ThumbDown } from '@material-ui/icons';

const AssetFinder = ({
  isAssetReference = false,
  isSelectionTable = false,
  showSearchBar = true,
  onSelectionChange = () => {},
  rows = [],
  onSetRows = () => {},
  isPreviewTable = false
}) => {
  const collection = isAssetReference ? 'references' : 'assets';
  const classes = useStyles();
  const [searchText, setSearchText] = useState('');
  const [assetRows, setAssetRows] = useState(rows);
  const [selectedRows, setSelectedRows] = useState([]); 
  const [selectedAsset, setSelectedAsset] = useState(defaultAsset);

  const handleOnSearchClick = () => {
    const queryLike = ['name', 'brand', 'model'].map(key => ({ key, value: searchText }));
    // queryLike.push({ key: 'status', value: 'active' });

    getDBComplex({ collection, queryLike })
      .then(response => response.json())
      .then(data => {
        const rows = data.response.map(row => {
          const { name, brand, model, _id: id, sn = 'sn', fileExt } = row;
          const assigned = !!row.assigned;
          if(isAssetReference){
            const {selectedProfile} = row;
            return { name, brand, model, id, sn, assigned, fileExt, selectedProfile };
          }
          return { name, brand, model, id, sn, assigned, fileExt };
        });
        setAssetRows(rows);
      })
      .catch(error => console.log(error));
  };

  const handleSelectionChange = (selection) => {
    onSelectionChange(selection);
    if (selection.rows.length) {
      setSelectedRows(selection.rows);
      const { brand, model, name, id, fileExt } = selection.rows.slice(-1)[0];
      const picUrl = fileExt ? getImageURL(id, collection, fileExt) : defaultAsset.picUrl;
      setSelectedAsset({ brand, model, name, picUrl });
    } else {
      setSelectedRows([]);
      setSelectedAsset(defaultAsset);
    }
  };

  const renderContent = () => {
    const handleTreeElement = (id, profileLevel, parent, name) => {
      if (profileLevel < 0) {
        return;
      }
      const cartRows = rows.map((row) => {
        if (selectedRows.find((asset) => asset.id === row.id)) {
          return { ...row, locationName: name, locationId: id };
        } else {
          return row;
        }
      });
      onSetRows(cartRows);
    };

    const handleRemoveElement = () => {
      const cartRows = rows.reduce((acu, cur) => {
        if (!selectedRows.find((asset) => asset.id === cur.id)) {
          return [...acu, cur];
        } else {
          return acu;
        }
      }, []);
      onSetRows(cartRows);
    };
    if (isSelectionTable) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <button type="button" style={{ width: '200px', alignSelf: 'flex-end', marginBottom: '15px' }} onClick={handleRemoveElement} className='btn btn-secondary btn-elevate kt-login__btn-secondary'>
            <i className="la la-trash" /> Remove Assets
          </button>
          <div style={{ display: 'flex' }}>
            <Table columns={[...getColumns(isAssetReference), locationColumn]} rows={rows} setTableRowsInner={handleSelectionChange} />
            <div style={{ width: '350px', marginLeft: '15px' }} >
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} >
                  <Typography>Preview</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <AssetPreviewBox selectedAsset={selectedAsset} />
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} >
                  <Typography>Set Location</Typography>
                </AccordionSummary>
                <AccordionDetails style={{ overflow: 'hidden', height: '275px' }}>
                  <LocationsTreeView onTreeElementClick={handleTreeElement} />
                </AccordionDetails>
              </Accordion>
            </div>
          </div>
        </div>
      );
    } else if (isPreviewTable) {
      return (
        <div style={{ display: 'flex' }}>
          <Table columns={[...getColumns(isAssetReference), ...processColumns]} rows={rows} setTableRowsInner={handleSelectionChange} />
          <Card style={{ width: '350px', marginLeft: '15px' }}>
            <CardContent style={{ display: 'flex', flexDirection: 'column', minHeight: '400px' }}>
              <AssetPreviewBox selectedAsset={selectedAsset} />
            </CardContent>
          </Card>
        </div>
      );
    } else {
      return (
        <div style={{ display: 'flex' }}>
          <Table columns={getColumns(isAssetReference)} rows={assetRows} setTableRowsInner={handleSelectionChange} />
          <Card style={{ width: '350px', marginLeft: '15px' }}>
            <CardContent style={{ display: 'flex', flexDirection: 'column', minHeight: '400px' }}>
              <AssetPreviewBox selectedAsset={selectedAsset} />
            </CardContent>
          </Card>
        </div>
      );
    }
  };

  return (
    <div>
      {(!isSelectionTable && showSearchBar) && (
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
      )}
      {renderContent()}
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

const locationColumn = { field: 'locationName', headerName: 'Location', width: 130 };

const processColumns = [
  {
    field: 'status',
    headerName: 'Status',
    width: 130,
    renderCell: (params) => {
      const { value } = params;

      return value ? (
        <Chip
          icon={ value.toLowerCase() === 'rejected' ? <ThumbDownIcon /> : <ThumbUpIcon />}
          label={params.value}
          style={{ backgroundColor: value.toLowerCase() === 'rejected' ? '#DC2424' : '#1A9550' }}
          // clickable
          color='secondary'
        />
      ) : null;
    }
  },
  { field: 'message', headerName: 'Message', width: 130 },
];

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

const defaultAsset = {
  id: '',
  brand: '',
  model: '',
  name: '',
  picUrl: 'https://icon-library.com/images/photo-placeholder-icon/photo-placeholder-icon-6.jpg'
};

export default AssetFinder;
