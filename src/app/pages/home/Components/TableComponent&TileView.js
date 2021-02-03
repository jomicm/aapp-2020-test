/* eslint-disable no-restricted-imports */
import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import {
  makeStyles,
  lighten,
  withStyles,
  useTheme
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
  DialogActions
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
  headerIcons: {

  }
}));

const TableComponentTile = props => {
  const { headRows, rows = [], onAdd, onSelect, style = {}, noEdit = false } = props;
  const [selected, setSelected] = useState([]);
  const [selectedId, setSelectedId] = useState([]);
  const [dense, setDense] = useState(false);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const classes = useStyles();
  const isSelected = name => selected.indexOf(name) !== -1;
  const [page, setPage] = useState(0);

  // const createRow = (id, level, name, creator, creation_date) => {
  //   return { id, level, name, creator, creation_date };
  // };

  // const headRows = [
  //   { id: 'id', numeric: false, disablePadding: true, label: 'ID' },
  //   { id: 'level', numeric: true, disablePadding: false, label: 'Level' },
  //   { id: 'name', numeric: true, disablePadding: false, label: 'Description' },
  //   { id: 'creator', numeric: true, disablePadding: false, label: 'Creator' },
  //   { id: 'creation_date', numeric: true, disablePadding: false, label: 'Creation Date' }
  // ];

  // const rows = [
  //   createRow('1', '0', 'Region', 'Admin', '11/03/2020'),
  //   createRow('2', '1', 'City', 'Admin', '11/03/2020'),
  //   createRow('3', '2', 'Office', 'Admin', '11/03/2020'),
  // ];

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
        <div className={classes.headerIcons}>
          <Tooltip title='Table View'>
            <IconButton onClick={showTableView} aria-label='Filter list'>
              <ListRoundedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title='Tile View'>
            <IconButton onClick={showTileView} aria-label='Filter list'>
              <ViewModuleRoundedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title='Tree View'>
            <IconButton onClick={showTreeView} aria-label='Filter list'>
              <AccountTreeRoundedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title='Add'>
            <IconButton onClick={onAdd} aria-label='Filter list'>
              <AddIcon />
            </IconButton>
          </Tooltip>
        </div>
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

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

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

  function stableSort(array, cmp) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = cmp(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
  }

  function getSorting(order, orderBy) {
    return order === 'desc'
      ? (a, b) => desc(a, b, orderBy)
      : (a, b) => -desc(a, b, orderBy);
  }

  function desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
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
          {headRows.map(row => (
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


  return (
    <div className={classes.root} style={{ padding: '0px' }}>
      <ModalYesNo
        showModal={openYesNoModal}
        onOK={onDelete}
        onCancel={() => setOpenYesNoModal(false)}
        title={'Remove Element'}
        message={'Are you sure you want to remove this element?'}
      />
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
                    {stableSort(rows, getSorting(order, orderBy))
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row, index) => {
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
                            //key={headRows[0].id}
                            selected={isItemSelected}
                          >
                            <TableCell padding='checkbox'>
                              <Checkbox
                                checked={isItemSelected}
                                inputProps={{ 'aria-labelledby': labelId }}
                              />
                            </TableCell>

                            {headRows.map((header, ix) =>
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
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 49 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
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
          count={rows.length}
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
      {/* <FormControlLabel
        control={
          <Switch checked={dense} onChange={handleChangeDense} />
        }
        label='Dense padding'
      /> */}
    </div>
  );
};

export default TableComponentTile;