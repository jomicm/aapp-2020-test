/* eslint-disable no-restricted-imports */
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
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
  Portal,
  Popper,
  TextField,
  Grid,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
  Menu,
  MenuItem
} from '@material-ui/core';


import TileView from '../Components/TileView';
import ModalYesNo from '../Components/ModalYesNo';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import AccountTreeRoundedIcon from '@material-ui/icons/AccountTreeRounded';
import ViewModuleRoundedIcon from '@material-ui/icons/ViewModuleRounded';
import ListRoundedIcon from '@material-ui/icons/ListRounded';
import ViewColumnRoundedIcon from '@material-ui/icons/ViewColumnRounded';
import SearchIcon from '@material-ui/icons/Search';

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
  },
  popover: {
    width: '800px',
  },
  grid: {
    padding: '20px'
  },
  listItemText:{
    marginRight: '20px',
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
  }
}));

const columnPickerControl = (headRows) => {
  const columns = headRows.map((column) => {
    column.visible = true;
    return column;
  });
  console.log('columns2:', columns);
  return columns;
};

const columnPickerControl2 = (headRows) => headRows.map((column) => ({ ...column, visible: true }));

const TableComponentTile = props => {
  const { headRows, rows = [], onAdd, onSelect, style = {}, noEdit = false, paginationControl, defaultValues, sortByControl, searchControl } = props;
  const [selected, setSelected] = useState([]);
  const [selectedId, setSelectedId] = useState([]);
  const [dense, setDense] = useState(false);
  const [order, setOrder] = useState(defaultValues.order === 1 ? 'asc' : 'desc');
  const [orderBy, setOrderBy] = useState(defaultValues.orderBy);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const classes = useStyles();
  const isSelected = name => selected.indexOf(name) !== -1;
  const [page, setPage] = useState(0);
  const [columnPicker, setColumnPicker] = useState(columnPickerControl2(headRows));
  const [openColumnSelector, setOpenColumnSelector] = useState(false);
  const [anchorEl, setAnchorEl] = useState();
  const [windowCoords, setWindowCoords] = useState({ left: 0, top: 0});
  const [debug, setDebug] = useState(false);

  useEffect(() => {
    if (!paginationControl) return;
    paginationControl({ rowsPerPage, page });
  }, [rowsPerPage, page])

  useEffect(() => {
    sortByControl({ orderBy: orderBy, order: order === 'asc' ? 1 : -1 });
  }, [order, orderBy])

  // useEffect(() => {
  //   setColumnPicker(columnPickerControl(headRows))
  // }, [headRows])
 
  const recordButtonPosition = (event) => {
    setAnchorEl(event.currentTarget);
    setOpenColumnSelector(true);
    setWindowCoords({ left: event.pageX - 60, top: event.pageY + 24 });
  }

  const EnhancedTableToolbar = props => {
    const classes = useToolbarStyles();
    const { selected, onAdd, noEdit } = props;
    const numSelected = selected.length;

    const handleInputChange = (event) => {
      if (event) {
        searchControl(event.target.value)
      }
    }

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
              autoFocus
              onChange={handleInputChange}
              placeholder="Search..."
              value={defaultValues.search}
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

  //const emptyRows = rows.length == 0 ? rowsPerPage : rowsPerPage - Math.min(rowsPerPage, total - page * rowsPerPage);

  function handleRequestSort(event, property) {
    const isDesc = orderBy === property && order === 'desc';
    setOrder(isDesc ? 'asc' : 'desc');
    setOrderBy(property);
  }

  function handleSelectAllClick(event) {
    if (event.target.checked) {
      const newSelecteds = rows.map(n => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }

  function handleClick(event, name, id) {
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

  function handleChangePage(event, newPage) {
    setPage(newPage);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(+event.target.value);
  }

  function handleChangeDense(event) {
    setDense(event.target.checked);
  }


  function EnhancedTableHead(props) {
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
              align={row.numeric ? 'right' : 'left'}
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

  const showTableView = () => setViewControl({ table: true, tile: false, tree: false, });
  const showTileView = () => setViewControl({ table: false, tile: true, tree: false, });
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

    return (
      <Popover
        className={classes.popover}
        aria-label="Column Picker Selector"
        anchorEl={anchorEl}
        keepMounted
        onClose={() => setOpenColumnSelector(false)}
        open={openColumnSelector}
        anchorPosition={{ left, top }}
        anchorReference="anchorPosition"
      >
        <div className={classes.grid}>
          <Typography color='inherit' variant='subtitle1'>Find Column</Typography>
          <TextField />
          <Typography color='inherit' variant='subtitle1' style={{marginTop: '10px'}}>Columns</Typography>
          <List>
            {columnPicker.map(({label, id, visible}, index) => {
              return (
                <ListItem>
                  <ListItemText key={id} primary={label} className={classes.listItemText} />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      onChange={(event) => {
                        const array = [...columnPicker];
                        array[index].visible = event.target.checked;
                        setColumnPicker(array);
                      }}
                      checked={visible}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>
        </div>
      </Popover>
    );
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
              viewControl.table && (
                <React.Fragment>
                  <EnhancedTableHead
                    numSelected={selected.length}
                    order={order}
                    orderBy={orderBy}
                    onSelectAllClick={handleSelectAllClick}
                    onRequestSort={handleRequestSort}
                    rowCount={rows.length}
                    noEdit={noEdit}
                  />
                  <TableBody>
                    {
                      rows.map((row, index) => {
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
                                padding={!ix ? 'none' : 'default'}
                                scope='row'
                                align={!ix ? 'inherit' : 'right'}
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
                </React.Fragment>
              )
            }
            {
              viewControl.tile && (
                <TableBody>
                  <TileView
                    showTileView={true}
                    tiles={rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
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
          count={defaultValues.total}
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