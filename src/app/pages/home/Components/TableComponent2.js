/* eslint-disable no-restricted-imports */
import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import {
  makeStyles,
  lighten,
  withStyles,
  useTheme,
  fade
} from '@material-ui/core/styles';
import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  Toolbar,
  Typography,
  Tooltip,
  IconButton,
  TableSortLabel,
  TablePagination,
  Switch,
  FormControlLabel,
  TableFooter,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputBase,
  Popover,
  Popper,
  TextField,
  Grid,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
} from '@material-ui/core';

import { getDB } from '../../../crud/api';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import AccountTreeRoundedIcon from '@material-ui/icons/AccountTreeRounded';
import ViewModuleRoundedIcon from '@material-ui/icons/ViewModuleRounded';
import ListRoundedIcon from '@material-ui/icons/ListRounded';
import ViewColumnRoundedIcon from '@material-ui/icons/ViewColumnRounded';
import SearchIcon from '@material-ui/icons/Search';

import TileView from '../Components/TileView';
import ModalYesNo from '../Components/ModalYesNo';
import TreeView from '../Components/TreeViewComponent';

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
    width: '200px',
    border: '1px #ffffff00 solid',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchIcon: {
    position: 'relative',
    marginRight: '1px',
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
    width: '100px',
    padding: '5px 10px',
    outline: 'none',
    border: 'none',
    backgroundColor: '#fafafa',
    '&:hover': {
      backgroundColor: '#F5F5F5',
    },
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
  const { headRows, rows = [], onAdd, onSelect, style = {}, noEdit = false, paginationControl, controlValues, sortByControl, searchControl } = props;
  const [selected, setSelected] = useState([]);
  const [selectedId, setSelectedId] = useState([]);
  const [dense, setDense] = useState(false);
  const [order, setOrder] = useState(controlValues.order === 1 ? 'asc' : 'desc');
  const [orderBy, setOrderBy] = useState(controlValues.orderBy);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const classes = useStyles();
  const isSelected = name => selected.indexOf(name) !== -1;
  const [page, setPage] = useState(0);
  const [columnPicker, setColumnPicker] = useState(columnPickerControl(headRows));
  const [openColumnSelector, setOpenColumnSelector] = useState(false);
  const [anchorEl, setAnchorEl] = useState();
  const [windowCoords, setWindowCoords] = useState({ left: 0, top: 0 });
  const [findColumn, setFindColumn] = useState('');
  const [locationsTree, setLocationsTree] = useState({});
  const [filteredRows, setFilteredRows] = useState(rows);

  useEffect(() => {
    if (!paginationControl) return;
    paginationControl({ rowsPerPage, page });
  }, [rowsPerPage, page])

  useEffect(() => {
    sortByControl({ orderBy: orderBy, order: order === 'asc' ? 1 : -1 });
  }, [order, orderBy])

  useEffect(() => {
    setColumnPicker(columnPickerControl(headRows))
  }, [headRows])

  useEffect(() => {
    loadLocationsData();
    setFilteredRows(rows);
    console.log('rows:', filteredRows )
  }, [rows]);

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
        locations = data.response.map(res => ({ ...res, id: res._id }));
        const homeLocations = data.response.filter(loc => loc.profileLevel === 0);
        const children = constructLocationTreeRecursive(homeLocations);
        locationsTreeData.children = children;
        setLocationsTree(locationsTreeData);
      })
  }

  const constructLocationTreeRecursive = (locs) => {
    if (!locs || !Array.isArray(locs) || !locs.length) return [];
    let res = [];
    locs.forEach((location) => {
      const locObj = (({ _id: id, name, profileLevel, parent }) => ({ id, name, profileLevel, parent }))(location);
      const children = locations.filter(loc => loc.parent === locObj.id);
      locObj.children = constructLocationTreeRecursive(children);
      res.push(locObj);
    });
    return res;
  };

  const selectLocation = (locationId, level, parent, locationName, children) => {
    let res = [];
    let allchildren = locationsChildren(children, res)
    allchildren.push(locationId)
    let filtered = rows.filter((row) => allchildren.includes(row.location))
    console.log('filtered: ', filtered)
    setFilteredRows(filtered);
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
      searchControl({ value: event.target.value, field: field })
    }
  }

  const EnhancedTableToolbar = props => {
    const classes = useToolbarStyles();
    const { selected, onAdd, noEdit } = props;
    const numSelected = selected.length;

    const onDelete = () => {
      props.onDelete();
    }

    useEffect(() => {
      if (!props.onSelect) return;
      const selectedIdToSend = numSelected === 1 ? selectedId[0] : null;
      props.onSelect(selectedIdToSend);
    }, [numSelected]);

    const HeaderTools = () => {
      if (numSelected > 0) {
        return (
          <div style={{ display: 'flex' }}>
            { numSelected === 1 && !noEdit &&
              <Tooltip title='Edit'>
                <IconButton aria-label='Edit' onClick={props.onEdit}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
            }
            <Tooltip title='Delete'>
              <IconButton aria-label='Delete' onClick={onDelete}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </div>
        )
      }
      return (
        <React.Fragment>
          <div className={classes.search} key='SearchDiv' aria-label='Search Box'>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <input
              key='SearchField'
              autoFocus={controlValues.searchBy === null}
              onChange={event => handleInputChange(event, null)}
              placeholder='Search...'
              value={controlValues.searchBy ? null : controlValues.search}
              className={classes.inputInput}
            />
          </div>
          <Tooltip title='Table View'>
            <IconButton onClick={showTableView} aria-label='Table View'>
              <ListRoundedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title='Tile View'>
            <IconButton onClick={showTileView} aria-label='Tile view'>
              <ViewModuleRoundedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title='Tree View'>
            <IconButton onClick={showTreeView} aria-label='Tree view'>
              <AccountTreeRoundedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title='Column Picker'>
            <IconButton onClick={recordButtonPosition} aria-label='Column Picker'>
              <ViewColumnRoundedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title='Add'>
            <IconButton onClick={onAdd} aria-label='Add'>
              <AddIcon />
            </IconButton>
          </Tooltip>
        </React.Fragment>
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
              <Typography variant='h6' id='tableTitle'>
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
    const isDesc = orderBy === property && order === 'desc';
    setOrder(isDesc ? 'asc' : 'desc');
    setOrderBy(property);
  }

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = filteredRows.map(n => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }

  const handleClick = (event, name, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [], newSelectedId = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
      newSelectedId = newSelectedId.concat(selectedId, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
      newSelectedId = newSelectedId.concat(selectedId.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
      newSelectedId = newSelectedId.concat(selectedId.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
      newSelectedId = newSelectedId.concat(
        selectedId.slice(0, selectedIndex),
        selectedId.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
    setSelectedId(newSelectedId);
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
  }

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
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
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{ 'aria-label': 'Select all desserts' }}
            />
          </TableCell>
          {columnPicker.filter((column) => column.visible).map(row => (
            <TableCell
              key={row.id}
              align={'left'}
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
              <input
                autoFocus={row.id === controlValues.searchBy}
                placeholder={`Search by...`}
                value={row.id === controlValues.searchBy ? controlValues.search : null}
                onChange={(event) => handleInputChange(event, row.id)}
                className={classes.inputSearchBy}
              />
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
    setFilteredRows(rows);
    setViewControl({ table: true, tile: false, tree: false, });
  };
  const showTileView = () => {
    setFilteredRows(rows);
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
        className={classes.popover}
        aria-label='Column Picker Selector'
        anchorEl={anchorEl}
        keepMounted
        onClose={() => setOpenColumnSelector(false)}
        open={openColumnSelector}
        anchorPosition={{ left, top }}
        anchorReference="anchorPosition"
      >
        <div className={classes.grid}>
          <Typography color='inherit' variant='subtitle1'> Find Column </Typography>
          <TextField
            value={findColumn}
            onChange={(event) => setFindColumn(event.target.value)}
            label={'Find Column...'}
          />
          <Typography color='inherit' variant='subtitle1' style={{ marginTop: '10px' }}> Columns </Typography>
          <List className={classes.list}>
            {
              columnPicker.filter((column) => column.label.match(regex)).map(({ label, id, visible }, index) => {
                return (
                  <ListItem>
                    <ListItemText key={id} primary={label} className={classes.listItemText} />
                    <ListItemSecondaryAction>
                      <Switch
                        edge='end'
                        onChange={(event) => {
                          const array = [...columnPicker];
                          array[index].visible = event.target.checked;
                          setColumnPicker(array);
                        }}
                        checked={visible}
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
        showModal={openYesNoModal}
        onOK={onDelete}
        onCancel={() => setOpenYesNoModal(false)}
        title={'Remove Element'}
        message={'Are you sure you want to remove this element?'}
      />
      {renderColumnPicker()}
      <Paper className={classes.paper}>
        <EnhancedTableToolbar
          title={props.title}
          selected={selected}
          onAdd={onAdd}
          onEdit={onEdit}
          onDelete={() => setOpenYesNoModal(true)}
          onSelect={onSelect}
          noEdit={noEdit}
        />
        <div className={classes.tableWrapper}>
          <Table
            className={classes.table}
            aria-labelledby='tableTitle'
            size={dense ? 'small' : 'medium'}
          >
            {
              (viewControl.table || viewControl.tree) && (
                <React.Fragment>
                  <Grid container>
                    {
                      viewControl.tree && (
                        <Grid item sm={12} md={2} lg={2}>
                          <TreeView data={locationsTree} onClick={selectLocation} />
                        </Grid>
                      )
                    }
                    <Grid item sm={12} md={12} lg={viewControl.tree ? 10 : 12} >
                      <EnhancedTableHead
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                        rowCount={filteredRows.length}
                        noEdit={noEdit}
                      />
                      <TableBody>
                        {
                          filteredRows.map((row, index) => {
                            const isItemSelected = isSelected(row.id);
                            const labelId = `enhanced-table-checkbox-\${index}`;
                            return (
                              <TableRow
                                hover
                                onClick={event => handleClick(event, row.name, row.id)}
                                role='checkbox'
                                aria-checked={isItemSelected}
                                tabIndex={-1}
                                key={`key-row-${row.id}`}
                                selected={isItemSelected}
                              >
                                <TableCell padding='checkbox'>
                                  <Checkbox
                                    checked={isItemSelected}
                                    inputProps={{ 'aria-labelledby': labelId }}
                                  />
                                </TableCell>

                                {columnPicker.filter((column) => column.visible).map((header, ix) =>
                                  <TableCell
                                    key={`cell-row${index}-${ix}`}
                                    component='th'
                                    padding={'default'}
                                    scope='row'
                                    align={'left'}
                                  >
                                    {row[header.id]}
                                  </TableCell>
                                )}
                              </TableRow>
                            );
                          })}
                        {/* {emptyRows > 0 && (
                      <TableRow style={{ height: 49 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )} */}
                      </TableBody>
                    </Grid>
                  </Grid>
                </React.Fragment>
              )
            }
            {
              viewControl.tile && (
                <TableBody>
                  <TileView
                    showTileView={true}
                    tiles={filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                    collection='categories'
                    onEdit={props.onEdit}
                    onDelete={props.onDelete}
                    onReload={props.onReload}
                  />
                </TableBody>
              )
            }
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={controlValues.total}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page'
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page'
          }}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
};

export default TableComponentTile;