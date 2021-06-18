/* eslint-disable no-restricted-imports */
import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import {
  makeStyles,
  lighten,
} from '@material-ui/core/styles';
import {
  Checkbox,
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

import AddIcon from '@material-ui/icons/Add';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import SearchIcon from '@material-ui/icons/Search';
import ViewColumnRoundedIcon from '@material-ui/icons/ViewColumnRounded';
import PrintIcon from '@material-ui/icons/Print';
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';

import { getDB } from '../../../crud/api';
import ModalYesNo from '../Components/ModalYesNo';
import TileView from '../Components/TileView';
import CircularProgressCustom from './CircularProgressCustom';

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

const TableReportsGeneral = props => {
  const {
    controlValues,
    handleCSVDownload,
    headRows,
    locationControl,
    noEdit = false,
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
    disableLoading,
    disableActions
  } = props;
  const classes = useStyles();

  //Selected Rows
  const [selected, setSelected] = useState([]);
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

  useEffect(() => {
    if (!paginationControl) return;
    paginationControl({ rowsPerPage, page });
  }, [rowsPerPage, page]);

  useEffect(() => {
    sortByControl({ orderBy: orderBy, order: order === 'asc' ? 1 : -1 });
  }, [order, orderBy]);

  useEffect(() => {
    setColumnPicker(columnPickerControl(headRows));
  }, [headRows]);

  useEffect(() => {
    if(!disableLoading){
      setLoading(false);
      return;
    }
  }, [])

  //! FIXME
  useEffect(() => {
    if (rows.length > 0 || controlValues.search.length || disableLoading) {
      setLoading(false);
    }
    if (!rows.length && page > 0){
      setPage(page - 1 );
    }
  }, [rows]);

  useEffect(() => {
    setPage(controlValues.page)
  }, [controlValues.page]);

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
    const { selected, onAdd, noEdit } = props;
    const numSelected = selected.length;

    const onDelete = () => {
      props.onDelete();
    }

    useEffect(() => {
      if (!props.onSelect) return;
      const selectedIdToSend = numSelected ? selectedId : null;
      props.onSelect(selectedIdToSend);
    }, [numSelected]);

    const HeaderTools = () => {
      if (numSelected > 0) {
        return (
          <div style={{ display: 'flex' }}>
            { numSelected === 1 && !noEdit && typeof onView === 'function' && !disableActions &&
              <Tooltip title='View'>
                <IconButton aria-label='View' onClick={() => onView(selectedId)}>
                  <RemoveRedEye />
                </IconButton>
              </Tooltip>
            }
            { numSelected === 1 && !noEdit && !disableActions &&
              <Tooltip title='Edit'>
                <IconButton aria-label='Edit' onClick={props.onEdit}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
            }
            { !disableActions &&
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
        <React.Fragment>
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
            />
          </div>
          <Tooltip title='Download CSV'>
            <IconButton aria-label='Download CSV' onClick={handleCSVDownload}>
              <CloudDownloadIcon />
            </IconButton>
          </Tooltip>
          {/* <Tooltip title='Print'>
            <IconButton aria-label='Print' onClick={() => { }}>
              <PrintIcon />
            </IconButton>
          </Tooltip> */}
          <Tooltip title='Column Picker'>
            <IconButton aria-label='Column Picker' onClick={recordButtonPosition}>
              <ViewColumnRoundedIcon />
            </IconButton>
          </Tooltip>
          {
            typeof onAdd == 'function' && (
              <Tooltip title='Add'>
                <IconButton aria-label='Add' onClick={onAdd}>
                  <AddIcon />
                </IconButton>
              </Tooltip>
            )
          }
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
    setLoading(true);
    setPage(newPage);
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
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
          { rows.length > 0 && (
              <TableCell padding='checkbox'>
                <Checkbox
                  checked={numSelected === rowCount}
                  indeterminate={numSelected > 0 && numSelected < rowCount}
                  inputProps={{ 'aria-label': 'Select all desserts' }}
                  onChange={onSelectAllClick}
                />
              </TableCell>
          )}
          { columnPicker.filter((column) => column.visible).map(row => (
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
                    placeholder={`Search by...`}
                    value={row.id === controlValues.searchBy ? controlValues.search : null}
                    disabled={row.searchByDisabled ? true : false}
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
        />
        <div className={classes.tableWrapper}>
          <Table
            aria-labelledby='tableTitle'
            className={classes.table}
          >
            {
              (viewControl.table || viewControl.tree) && (
                <>
                  { loading ? (
                      <div style={{
                        width: '100%',
                        height: 49 * (rowsPerPage + 1),
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
                          { rows.length <= 0 && (
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
                          { rows.map((row, index) => {
                              const isItemSelected = isSelected(row._id);
                              const labelId = `enhanced-table-checkbox-\${index}`;
                              return (
                                <TableRow
                                  aria-checked={isItemSelected}
                                  hover
                                  key={`key-row-${row.id}`}
                                  onClick={event => handleClick(event, row.name, row._id)}
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

                                  {columnPicker.filter((column) => column.visible).map((header, ix) =>
                                    <TableCell
                                      align={'left'}
                                      component={header.renderCell ? () => header.renderCell(row[header.id]) : 'th'}
                                      key={`cell-row${index}-${ix}`}
                                      padding={'default'}
                                      scope='row'
                                    >
                                      {row[header.id]}
                                    </TableCell>
                                  )}
                                </TableRow>
                              );
                            })}
                          {
                            rowsPerPage - rows.length > 0 && (
                              <TableRow style={{ height: 49 * (rowsPerPage - rows.length), width: '100%' }}>
                                <TableCell colSpan={100} />
                              </TableRow>
                            )
                          }
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
        </div>
        <TablePagination
          backIconButtonProps={{
            'aria-label': 'Previous Page'
          }}
          component='div'
          count={controlValues.total}
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

export default TableReportsGeneral;
