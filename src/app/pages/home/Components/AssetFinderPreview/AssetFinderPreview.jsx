/* eslint-disable no-restricted-imports */
import React, { useEffect, useState } from 'react';
import { omit } from "lodash";
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
  Typography,
  Tooltip
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import DoneIcon from '@material-ui/icons/Done';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import { getDBComplex } from '../../../../crud/api';
import { getImageURL, getLocationPath } from '../../utils';
import LocationsTreeView from '../LocationsTreeView/LocationsTreeView';
import Table from './Table';
import AssetEdition from './AssetEditon';
import AssetPreviewBox from './AssetPreviewBox';
import { ThumbDown } from '@material-ui/icons';

const AssetFinder = ({
  isAssetReference = false,
  isSelectionTable = false,
  showSearchBar = true,
  onSelectionChange = () => {},
  rows = [],
  onSetRows = () => {},
  isPreviewTable = false,
  processType = 'default',
  processInfo,
  updateAssetValues = () => {},
  showAssetEdition = () => {},
  isLinkedToProcess = false,
}) => {
  const classes = useStyles();
  const collection = isAssetReference ? 'references' : 'assets';
  const [selectedRows, setSelectedRows] = useState([]); 
  const [selectedAsset, setSelectedAsset] = useState(defaultAsset);
  const [searchText, setSearchText] = useState('');
  const [assetRows, setAssetRows] = useState(rows);

  useEffect(() => {
    if(rows === assetRows || !rows.length || !rows) {
      return;
    }
    setAssetRows(rows);
  }, [rows])

  const handleChangeValues = (values) => {
    const newValues = omit(values, ['id']);
    const idsToChange = selectedRows.map(({id}) => id);
    const temporalCartRows = [...assetRows];

    const newCartRows = temporalCartRows.map((asset) => {
      if(idsToChange.includes(asset.id)){
        return {...asset, ...newValues};
      }
      return asset;
    })
    setAssetRows(newCartRows);
  }
  
  const handleOnSearchClick = () => {
    if(!searchText.length){
      return;
    }
    const queryLike = ['name', 'brand', 'model'].map(key => ({ key, value: searchText }));
    // queryLike.push({ key: 'status', value: 'active' });
    const condition = !isAssetReference ? [{"status" : "active"}] : null;

    getDBComplex({ collection, queryLike, condition})
      .then(response => response.json())
      .then( async data => {
        const rows = await Promise.all(data.response.map( async row => {
          const { name, brand, model, _id: id, sn = 'sn', fileExt,customFieldsTab } = row;
          const assigned = !!row.assigned;
          if( isAssetReference ){
            const {selectedProfile} = row;
            return { 
              name, 
              brand,
              model,
              id,
              sn,
              assigned,
              fileExt,
              selectedProfile,
              customFieldsTab,
              serial: '',
              notes: '',
              quantity: 0,
              purchase_date: '',
              purchase_price: 0,
              price: 0,
              location: '',
          };
          }
          const locationPath = await getLocationPath(row.location);
          const history = row.history || [];
          return { name, brand, model, id, sn, assigned, fileExt, originalLocation: locationPath, history,};
        }));
        setAssetRows(rows);
      })
      .catch(error => console.log(error));
  };

  const isAssetEdition = () => {
    return processInfo?.processData?.stages[`stage_${processInfo.processData.currentStage}`]?.isAssetEdition
  }

  const handleSelectionChange = (selection) => {
    onSelectionChange(selection);
    if (selection.rows.length) {
      setSelectedRows(selection.rows);
      const {id, fileExt } = selection.rows.slice(-1)[0];
      const picUrl = fileExt ? getImageURL(id, collection, fileExt) : defaultAsset.picUrl;
      setSelectedAsset({...selection.rows.slice(-1)[0], picUrl});
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
            {
              processType === 'creation' && !isLinkedToProcess ? (
                <Table columns={[...getColumns(isAssetReference), locationColumn]} rows={rows} setTableRowsInner={handleSelectionChange} />
              ) : processType === 'creation' && isLinkedToProcess ? (
                <Table columns={[...getColumns(isAssetReference), originalLocationColumn]} rows={rows} setTableRowsInner={handleSelectionChange} />
              ) : processType === 'decommission' || processType === 'maintenance' ? (
                <Table columns={[...getColumns(isAssetReference), originalLocationColumn]} rows={rows} setTableRowsInner={handleSelectionChange} />
              ) : processType === 'movement' || processType === 'short' ? (
                <Table columns={[...getColumns(isAssetReference), originalLocationColumn, locationColumn]} rows={rows} setTableRowsInner={handleSelectionChange} />
              ) : (
                <Table columns={[...getColumns(isAssetReference)]} rows={rows} setTableRowsInner={handleSelectionChange} /> 
              )
            }
            <div style={{ width: '350px', marginLeft: '15px' }} >
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} >
                  <Typography>Preview</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <AssetPreviewBox selectedAsset={selectedAsset} />
                </AccordionDetails>
              </Accordion>
              {
                processType === 'creation' &&
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} >
                    <div style={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                      <Typography>Asset Edition</Typography>
                      <Tooltip title='Apply Changes'>
                        <IconButton onClick={() => updateAssetValues(assetRows)} className={classes.iconButton} aria-label="search" size='small'>
                          <DoneIcon />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </AccordionSummary>
                  <AccordionDetails>
                    <AssetEdition assetEditionValues={selectedAsset} setAssetEditionValues={(values) => handleChangeValues(values)} />
                  </AccordionDetails>
                </Accordion>
              }
              {
                !isLinkedToProcess &&
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} >
                    <Typography>Set Location</Typography>
                  </AccordionSummary>
                  <AccordionDetails style={{ overflow: 'hidden', height: '275px' }}>
                    <LocationsTreeView onTreeElementClick={handleTreeElement} />
                  </AccordionDetails>
                </Accordion>
              }
            </div>
          </div>
        </div>
      );
    } else if (isPreviewTable) {
      return (
        <div style={{ display: 'flex' }}>
          {
              processType === 'creation' ? (
                <Table columns={[...getColumns(isAssetReference), locationColumn, ...processColumns]} rows={rows} setTableRowsInner={handleSelectionChange} />
              ) : processType === 'decommission' || processType === 'maintenance' ? (
                <Table columns={[...getColumns(isAssetReference), originalLocationColumn, ...processColumns]} rows={rows} setTableRowsInner={handleSelectionChange} />
              ) : processType === 'movement' || processType === 'short' ? (
                <Table columns={[...getColumns(isAssetReference), originalLocationColumn, locationColumn, ...processColumns]} rows={rows} setTableRowsInner={handleSelectionChange} />
              ) : (
                <Table columns={[...getColumns(isAssetReference), ...processColumns]} rows={rows} setTableRowsInner={handleSelectionChange} /> 
              )
            }
          <Card style={{ width: '350px', marginLeft: '15px' }}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} >
                  <Typography>Preview</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <AssetPreviewBox selectedAsset={selectedAsset} />
                </AccordionDetails>
              </Accordion>
              {
                processType === 'creation' && isAssetEdition() && showAssetEdition() &&
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} >
                    <div style={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                      <Typography>Asset Edition</Typography>
                      <Tooltip title='Apply Changes'>
                        <IconButton onClick={() => updateAssetValues(assetRows)} className={classes.iconButton} aria-label="search" size='small'>
                          <DoneIcon />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </AccordionSummary>
                  <AccordionDetails>
                    <AssetEdition assetEditionValues={selectedAsset} setAssetEditionValues={(values) => handleChangeValues(values)}/>
                  </AccordionDetails>
                </Accordion>
              }
          </Card>
        </div>
      );
    } else {
      return (
        <div style={{ display: 'flex' }}>
          {
            isAssetReference ? (
              <Table columns={[...getColumns(isAssetReference)]} rows={assetRows} setTableRowsInner={handleSelectionChange} />
            ) : (
              <Table columns={[...getColumns(isAssetReference), originalLocationColumn]} rows={assetRows} setTableRowsInner={handleSelectionChange} />
            )
          }
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
      { field: 'id', headerName: 'EPC', width: 200 },
      { field: 'sn', headerName: 'Serial Number', width: 200 }
    ]
  }
}; 

const locationColumn = { field: 'locationName', headerName: 'Final Location', width: 200 };
const originalLocationColumn = { field: 'originalLocation', headerName: 'Original Location', width: 500 };

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
