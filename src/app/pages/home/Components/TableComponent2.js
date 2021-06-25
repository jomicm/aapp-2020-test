/* eslint-disable no-restricted-imports */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import clsx from 'clsx';
import {
  makeStyles,
  lighten,
} from '@material-ui/core/styles';
import {
  Checkbox,
  Chip,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Popover,
  Switch,
  Table,
  TableBody,
  TableCell,
  TextField,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Tooltip,
  Typography,
} from '@material-ui/core';

import AccountTreeRoundedIcon from '@material-ui/icons/AccountTreeRounded';
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ListRoundedIcon from '@material-ui/icons/ListRounded';
import SearchIcon from '@material-ui/icons/Search';
import ViewColumnRoundedIcon from '@material-ui/icons/ViewColumnRounded';
import ViewModuleRoundedIcon from '@material-ui/icons/ViewModuleRounded';
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';

import { getDB } from '../../../crud/api';
import ModalYesNo from './ModalYesNo';
import TileView from './TileView';
import TreeView from './TreeViewComponent';
import CircularProgressCustom from './CircularProgressCustom';
import { collections } from '../constants';

const useToolbarStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1)
  },
  highlight:
    theme.palette.type === 'light'
      ? {
        color: theme.palette.secondary.main,
        backgroundColor: lighten(theme.palette.secondary.light, 0.85)
      }
      : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark
      },
  spacer: {
    flex: '1 1 10%'
  },
  actions: {
    color: theme.palette.text.secondary,
    display: 'flex',
  },
  title: {
    flex: '0 0 auto'
  },
  search: {
    backgroundColor: '#fafafa',
    '&:hover': {
      backgroundColor: '#F5F5F5',
    },
    marginRight: '10px',
    width: '230px',
    border: '1px #ffffff00 solid',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchIcon: {
    position: 'relative',
    marginRight: '1px',
    marginLeft: '5px'
  },
  inputInput: {
    border: 'none',
    outline: 'none',
    backgroundColor: '#FFFFFF00'
  }
}));

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3)
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2)
  },
  table: {
    minWidth: 750
  },
  tableWrapper: {
    overflowX: 'auto'
  },
  inputSearchBy: {
    marginTop: '16px',
    width: '100%',
    padding: '5px 10px',
    borderRadius: '12px',
    outline: 'none',
    border: 'none',
    backgroundColor: '#fafafa',
    '&:hover': {
      backgroundColor: '#F5F5F5',
    },
  },
  inputSearchByDisabled: {
    marginTop: '16px',
    width: '100%',
    height: '35px'
  },
  popover: {
    width: '800px',
  },
  grid: {
    padding: '20px'
  },
  listItemText: {
    marginRight: '20px',
  },
  list: {
    maxHeight: '450px',
    minHeight: '200px',
    minWidth: '120px',
  }
}));


const columnPickerControl = (headRows) => headRows.map((column) => ({ ...column, visible: true }));

const TableComponentTile = props => {
  const {
    controlValues,
    headRows,
    locationControl,
    noEdit = false,
    noAdd = false,
    noDelete = false,
    onAdd,
    onSelect,
    paginationControl,
    rows = [],
    searchControl,
    style = {},
    sortByControl,
    treeView = false,
    tileView = false,
    onView,
    disableSearchBy = false,
    user,
    userLocations = [],
    disableActions = false,
    justTreeView = false,
    returnObjectOnSelect = false,
    selectedObjects
  } = props;
  const classes = useStyles();

  //Selected Rows
  const [selected, setSelected] = useState([]);
  const [selectedObject, setSelectedObject] = useState(selectedObjects);
  const [selectedId, setSelectedId] = useState([]);
  const isSelected = name => {
    return selected.indexOf(name) !== -1;
  };

  //ExternalVariables
  const [order, setOrder] = useState(controlValues.order === 1 ? 'asc' : 'desc');
  const [orderBy, setOrderBy] = useState(controlValues.orderBy);
  const [rowsPerPage, setRowsPerPage] = useState(controlValues.rowsPerPage);
  const [page, setPage] = useState(controlValues.page);

  //Column Selector
  const [columnPicker, setColumnPicker] = useState(columnPickerControl(headRows));
  const [openColumnSelector, setOpenColumnSelector] = useState(false);
  const [anchorEl, setAnchorEl] = useState();
  const [windowCoords, setWindowCoords] = useState({ left: 0, top: 0 });

  //Tree View
  const [findColumn, setFindColumn] = useState('');
  const [locationsTree, setLocationsTree] = useState({});

  //Loading
  const [loading, setLoading] = useState(true);

  //Permissions
  const module = collections[controlValues.collection]?.module;
  const permissions = user.profilePermissions[module] || [];

  useEffect(() => {
    if (!paginationControl) return;
    paginationControl({ rowsPerPage, page });
  }, [rowsPerPage, page]);

  useEffect(() => {
    if(returnObjectOnSelect || selectedObject){
      onSelect(selectedObject);
    }
  }, [selectedObject]);

  useEffect(() => {
    sortByControl({ orderBy: orderBy, order: order === 'asc' ? 1 : -1 });
  }, [order, orderBy]);

  useEffect(() => {
    setColumnPicker(columnPickerControl(headRows));
  }, [headRows]);

  useEffect(() => {
    loadLocationsData();
    if (rows.length > 0 || controlValues.search.length) {
      setLoading(false);
    };
    if (!rows.length && page > 0) {
      setPage(page - 1);
    }
  }, [rows]);

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 5000);
    }
  }, [loading]);

  const locationsTreeData = {
    id: 'root',
    name: 'Locations',
    profileLevel: -1,
    parent: null
  };

  let locations;
  const loadLocationsData = () => {
    getDB('locationsReal')
      .then(response => response.json())
      .then(data => {
        let userHomeLocations = [];
        let validChildren = [];
        locations = data.response.map(res => ({ ...res, id: res._id }));
        userLocations.forEach((e) => getUserHomeLocations(data.response, e, userHomeLocations, validChildren));
        const children = constructLocationTreeRecursive(userHomeLocations, validChildren);
        locationsTreeData.children = children;
        setLocationsTree(locationsTreeData);
      });
  };

  const getUserHomeLocations = (data, currentLocation, res, validChildren) => {
    if (!validChildren.includes(currentLocation)) {
      validChildren.push(currentLocation);
    }

    const location = data.find((e) => e._id === currentLocation)

    if (res.includes(location)) {
      return;
    }

    if (location.parent === 'root') {
      res.push(location);
      return;
    }
    getUserHomeLocations(data, location.parent, res, validChildren,);
  };

  const constructLocationTreeRecursive = (locs, validChildren) => {
    if (!locs || !Array.isArray(locs) || !locs.length) return [];
    let res = [];
    locs.forEach((location) => {
      const locObj = (({ _id: id, name, profileLevel, parent }) => ({ id, name, profileLevel, parent }))(location);
      const children = locations.filter(loc => loc.parent === locObj.id && validChildren.includes(loc._id));
      locObj.children = constructLocationTreeRecursive(children, validChildren);
      res.push(locObj);
    });
    return res;
  };

  const selectLocation = (locationId, level, parent, locationName, children) => {
    let res = [];
    let allchildren = locationsChildren(children, res);
    allchildren.push(locationId);
    locationControl(allchildren);
  };

  const locationsChildren = (children, res) => {
    if (!children || !Array.isArray(children) || !children.length) return [];
    children.map((child) => {
      locationsChildren(child.children, res);
      res.push(child.id);
    })
    return res;
  }

  const recordButtonPosition = (event) => {
    setAnchorEl(event.currentTarget);
    setOpenColumnSelector(true);
    setWindowCoords({ left: event.pageX - 60, top: event.pageY + 24 });
  }

  const handleInputChange = (event, field) => {
    if (event) {
      setLoading(true);
      searchControl({ value: event.target.value, field: field });
    }
  }

  const EnhancedTableToolbar = props => {
    const classes = useToolbarStyles();
    const { selected, onAdd, noEdit, noAdd, noDelete } = props;
    const numSelected = selected.length;

    const onDelete = () => {
      props.onDelete();
    }

    useEffect(() => {
      if (!props.onSelect || returnObjectOnSelect) {
        return;
      };
      const selectedIdToSend = numSelected ? selectedId : null;
      props.onSelect(selectedIdToSend);
    }, [numSelected]);

    const HeaderTools = () => {
      if(disableActions){
        return (
          <div></div>
        );
      }
      if (numSelected > 0) {
        return (
          <div style={{ display: 'flex' }}>
            {numSelected === 1 && !noEdit && typeof onView === 'function' &&
              <Tooltip title='View'>
                <IconButton aria-label='View' onClick={() => onView(selectedId)}>
                  <RemoveRedEye />
                </IconButton>
              </Tooltip>
            }
            { numSelected === 1 && !noEdit && permissions.includes('edit') &&
              <Tooltip title='Edit'>
                <IconButton aria-label='Edit' onClick={props.onEdit}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
            }
            {
              permissions.includes('delete') && !noDelete &&
              <Tooltip title='Delete'>
                <IconButton aria-label='Delete' onClick={onDelete}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            }
          </div>
        )
      }
      return (
        <>
          <div aria-label='Search Box' className={classes.search} key='SearchDiv'>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <input
              autoFocus={controlValues.searchBy === null}
              className={classes.inputInput}
              key='SearchField'
              onChange={event => handleInputChange(event, null)}
              placeholder='Search...'
              value={controlValues.searchBy ? null : controlValues.search}
              onSubmit={event => handleInputChange(event, null)}
            />
            {
              (controlValues.search.length > 0 && !controlValues.searchBy) && (
                <div>
                  <IconButton size="small" onClick={() => searchControl({ value: '' })}>
                    <ClearIcon />
                  </IconButton>
                </div>
              )
            }
            {
              (!controlValues.search.length || controlValues.searchBy) && (
                <div style={{ width: '25px' }} />
              )
            }
          </div>
          <Tooltip title='Table View'>
            <IconButton aria-label='Table View' onClick={showTableView}>
              <ListRoundedIcon />
            </IconButton>
          </Tooltip>
          {
            tileView && (
              <Tooltip title='Tile View'>
                <IconButton aria-label='Tile view' onClick={showTileView}>
                  <ViewModuleRoundedIcon />
                </IconButton>
              </Tooltip>
            )
          }
          {
            treeView && (
              <Tooltip title='Tree View'>
                <IconButton aria-label='Tree view' onClick={showTreeView}>
                  <AccountTreeRoundedIcon />
                </IconButton>
              </Tooltip>
            )
          }
          <Tooltip title='Column Picker'>
            <IconButton aria-label='Column Picker' onClick={recordButtonPosition}>
              <ViewColumnRoundedIcon />
            </IconButton>
          </Tooltip>
          {
            typeof onAdd == 'function' && permissions.includes('add') && !noAdd && (
              <Tooltip title='Add'>
                <IconButton aria-label='Add' onClick={onAdd}>
                  <AddIcon />
                </IconButton>
              </Tooltip>
            )
          }
        </>
      );
    }
    return (
      <Toolbar
        className={clsx(classes.root, {
          [classes.highlight]: numSelected > 0
        })}
      >
        <div className={classes.title}>
          {numSelected > 0 ? (
            <Typography color='inherit' variant='subtitle1'>
              {numSelected} selected
            </Typography>
          ) : (
            <Typography variant='h6'>
              {props.title}
            </Typography>
          )}
        </div>
        <div className={classes.spacer} />
        <div className={classes.actions}>
          <HeaderTools />
        </div>
      </Toolbar>
    );
  };

  const handleRequestSort = (event, property) => {
    setLoading(true);
    const isDesc = orderBy === property && order === 'desc';
    setOrder(isDesc ? 'asc' : 'desc');
    setOrderBy(property);
  }

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map(n => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }

  const handleClick = (event, row) => {
    const { id } = row;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [], newSelectedId = [], newSelectedObject = [];
    
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
      newSelectedId = newSelectedId.concat(selectedId, id);
      if(returnObjectOnSelect){
        newSelectedObject = newSelectedObject.concat(selectedObject, row);
      }
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
      newSelectedId = newSelectedId.concat(selectedId.slice(1));
      if(returnObjectOnSelect){
        newSelectedObject = newSelectedObject.concat(selectedObject.slice(1));
      }
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
      newSelectedId = newSelectedId.concat(selectedId.slice(0, -1));
      if(returnObjectOnSelect){
        newSelectedObject = newSelectedObject.concat(selectedObject.slice(0, -1));
      }
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
      newSelectedId = newSelectedId.concat(
        selectedId.slice(0, selectedIndex),
        selectedId.slice(selectedIndex + 1)
      );
      if(returnObjectOnSelect){
        newSelectedObject = newSelectedObject.concat(
          selectedObject.slice(0, selectedIndex),
          selectedObject.slice(selectedIndex + 1)
        );
      }
    }

    if(returnObjectOnSelect){
      setSelectedObject(newSelectedObject);      
    }

    setSelected(newSelected);
    setSelectedId(newSelectedId);
  }

  const handleChangePage = (event, newPage) => {
    setLoading(true);
    setPage(newPage);
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
  }

  const handleKeyDown = (event, id) => {
    if (event.key === 'Enter') {
      handleInputChange(event, id)
    }
  }

  const EnhancedTableHead = (props) => {
    const {
      onSelectAllClick,
      order,
      orderBy,
      numSelected,
      rowCount,
      onRequestSort
    } = props;
    const createSortHandler = property => event => {
      onRequestSort(event, property);
    };

    return (
      <TableHead>
        <TableRow>
          <TableCell padding='checkbox'>
            <Checkbox
              checked={numSelected === rowCount}
              indeterminate={numSelected > 0 && numSelected < rowCount}
              inputProps={{ 'aria-label': 'Select all desserts' }}
              onChange={onSelectAllClick}
            />
          </TableCell>
          {columnPicker.filter((column) => column.visible).map(row => (
            <TableCell
              align={'left'}
              key={row.id}
              padding={row.disablePadding ? 'none' : 'default'}
              sortDirection={orderBy === row.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === row.id}
                direction={order}
                onClick={createSortHandler(row.id)}
              >
                {row.label}
              </TableSortLabel>
              {
                !disableSearchBy && !row.searchByDisabled && (
                  <input
                    autoFocus={row.id === controlValues.searchBy}
                    className={classes.inputSearchBy}
                    onChange={(event) => handleInputChange(event, row.id)}
                    // onKeyDown={(event) => handleKeyDown(event, row.id)}
                    placeholder={`Search by...`}
                    value={row.id === controlValues.searchBy ? controlValues.search : null}
                  />
                )
              }
              {
                !disableSearchBy && row.searchByDisabled && (
                  <div
                    className={classes.inputSearchByDisabled}
                  />
                )
              }
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }
  const [viewControl, setViewControl] = useState({
    table: true,
    tile: false,
    tree: false,
  });

  const showTableView = () => {
    if (typeof locationControl === 'function') {
      locationControl([]);
    }
    setViewControl({ table: true, tile: false, tree: false, });
  };
  const showTileView = () => {
    if (typeof locationControl === 'function') {
      locationControl([]);
    }
    setViewControl({ table: false, tile: true, tree: false, });
  };
  const showTreeView = () => setViewControl({ table: false, tile: false, tree: true, });


  const [openYesNoModal, setOpenYesNoModal] = useState(false);
  const onDelete = () => {
    props.onDelete(selectedId);
    setSelected([]);
    setSelectedId([]);
    setOpenYesNoModal(false);
  };

  const onEdit = () => {
    props.onEdit(selectedId);
    setSelected([]);
    setSelectedId([]);
  };

  const renderColumnPicker = () => {
    const { left, top } = windowCoords;
    const regex = new RegExp(`.*${findColumn}.*`, 'gmi');

    return (
      <Popover
        anchorEl={anchorEl}
        aria-label='Column Picker Selector'
        anchorPosition={{ left, top }}
        anchorReference='anchorPosition'
        className={classes.popover}
        keepMounted
        onClose={() => setOpenColumnSelector(false)}
        open={openColumnSelector}
      >
        <div className={classes.grid}>
          <Typography color='inherit' variant='subtitle1'> Find Column </Typography>
          <TextField
            label={'Find Column...'}
            value={findColumn}
            onChange={(event) => setFindColumn(event.target.value)}
          />
          <Typography color='inherit' style={{ marginTop: '10px' }} variant='subtitle1'> Columns </Typography>
          <List className={classes.list}>
            {
              columnPicker.filter((column) => column.label.match(regex)).map(({ label, id, visible }, index) => {
                return (
                  <ListItem>
                    <ListItemText className={classes.listItemText} key={id} primary={label} />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={visible}
                        edge='end'
                        onChange={(event) => {
                          const array = [...columnPicker];
                          array[index].visible = event.target.checked;
                          setColumnPicker(array);
                        }}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                )
              })
            }
          </List>
        </div>
      </Popover>
    )
  };
  return (
    <div className={classes.root} style={{ padding: '0px' }}>
      <ModalYesNo
        message={'Are you sure you want to remove this element?'}
        onOK={onDelete}
        onCancel={() => setOpenYesNoModal(false)}
        showModal={openYesNoModal}
        title={'Remove Element'}
      />
      {renderColumnPicker()}
      <Paper className={classes.paper}>
        <EnhancedTableToolbar
          noEdit={noEdit}
          onAdd={onAdd}
          onDelete={() => setOpenYesNoModal(true)}
          onEdit={onEdit}
          onSelect={onSelect}
          selected={selected}
          title={props.title}
          noAdd={noAdd}
          noDelete={noDelete}
        />
        <div className={classes.tableWrapper}>
          <Grid container>
            {
              viewControl.tree && (
                <Grid conainer style={{ paddingLeft: '16px' }} item sm={12} md={2} lg={2}>
                  <div style={{overflow: 'auto'}}>
                    <TreeView data={locationsTree} onClick={selectLocation} />
                  </div>
                </Grid>
              )
            }
            {
              justTreeView && (
                <Grid conainer style={{ paddingLeft: '16px' }} item sm={12} md={2} lg={3}>
                  <div style={{overflow: 'auto'}}>
                    <TreeView data={locationsTree} onClick={selectLocation} />
                  </div>
                </Grid>
              )
            }
            <Grid item sm={12} md={12} lg={viewControl.tree ? 10 : justTreeView ? 9 : 12} >
              <Table
                aria-labelledby='tableTitle'
                className={classes.table}
                stickyHeader
              >
                {
                  (viewControl.table || viewControl.tree) && (
                    <>
                      {
                        loading ? (
                          <div style={{
                            width: '100%',
                            height: 49 * (rowsPerPage + 2.5),
                            display: 'flex',
                            justifyContent: 'center',
                            alignContent: 'center'
                          }}>
                            <CircularProgressCustom size={40} />
                          </div>
                        ) : (
                          <>
                            <EnhancedTableHead
                              noEdit={noEdit}
                              numSelected={selected.length}
                              order={order}
                              orderBy={orderBy}
                              onRequestSort={handleRequestSort}
                              onSelectAllClick={handleSelectAllClick}
                              rowCount={rows.length}
                            />
                            <TableBody>
                              {
                                rows.length <= 0 && (
                                  <TableRow
                                    hover
                                    key={`No info`}
                                    role='checkbox'
                                    tabIndex={-1}
                                  >
                                    <TableCell
                                      align={'center'}
                                      component='th'
                                      key={`NoData`}
                                      padding={'default'}
                                      scope='row'
                                      colSpan={100}
                                    >
                                      <Typography variant='h5'>
                                        Sorry, no matching records found
                                    </Typography>
                                    </TableCell>
                                  </TableRow>
                                )
                              }
                              {
                                rows.map((row, index) => {
                                  const isItemSelected = isSelected(row.id);
                                  const labelId = `enhanced-table-checkbox-\${index}`;
                                  return (
                                    <TableRow
                                      aria-checked={isItemSelected}
                                      hover
                                      key={`key-row-${row.id}`}
                                      onClick={event => handleClick(event, row)}
                                      role='checkbox'
                                      selected={isItemSelected}
                                      tabIndex={-1}
                                    >
                                      <TableCell padding='checkbox'>
                                        <Checkbox
                                          checked={isItemSelected}
                                          inputProps={{ 'aria-labelledby': labelId }}
                                        />
                                      </TableCell>

                                      {columnPicker.filter((column) => column.visible).map((header, ix) => {
                                        return(
                                          <TableCell
                                            align={header.renderCell ? 'center' : 'left'}
                                            component={header.renderCell ? () => header.renderCell(row[header.id]) : 'th'}
                                            key={`cell-row${index}-${ix}`}
                                            padding={'default'}
                                            scope='row'
                                          >
                                            {row[header.id]}
                                          </TableCell>
                                        )
                                      })}
                                    </TableRow>
                                  );
                                })}
                            </TableBody>
                          </>
                        )
                      }
                    </>
                  )
                }
                {
                  viewControl.tile && (
                    <TableBody>
                      <TileView
                        collection={controlValues.collection}
                        onDelete={props.onDelete}
                        onEdit={props.onEdit}
                        onReload={props.onReload}
                        showTileView={true}
                        tiles={rows}
                      />
                    </TableBody>
                  )
                }
              </Table>
            </Grid>
          </Grid>
        </div>
        <TablePagination
          backIconButtonProps={{
            'aria-label': 'Previous Page'
          }}
          component='div'
          count={controlValues.total}
          labelDisplayedRows={({ from, to, count }) => {

            if (count === 0) return 'No Pages';

            const currentPage = page + 1;
            const totalPages = Math.floor(count / rowsPerPage) + 1;
            return `Page ${currentPage}/${totalPages}`;
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page'
          }}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          page={page}
          rowsPerPageOptions={[5, 10, 25]}
          rowsPerPage={rowsPerPage}
        />
      </Paper>
    </div>
  );
};

const mapStateToProps = ({ auth: { user } }) => ({
  user
});
export default connect(mapStateToProps)(TableComponentTile);
