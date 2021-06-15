/* eslint-disable no-restricted-imports */
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import {
  lighten,
  makeStyles,
  useTheme,
  withStyles
} from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import FilterListIcon from '@material-ui/icons/FilterList';
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Tooltip,
  Typography
} from '@material-ui/core';
import ModalYesNo from '../Components/ModalYesNo';

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
    flex: '1 1 100%'
  },
  actions: {
    color: theme.palette.text.secondary
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
  }
}));

const TableComponent = props => {

  const { 
    headRows, 
    noAdd = false, 
    noEdit = false, 
    onAdd, 
    onSelect, 
    rows = [], 
    showView = false, 
    style = {}
  } = props;
  const [dense, setDense] = useState(false);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState([]);
  const [selectedId, setSelectedId] = useState([]);
  const classes = useStyles();
  const isSelected = name => selected.indexOf(name) !== -1;

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
    const { selected, onAdd, noEdit, noView } = props;
    const numSelected = selected.length;

    const onDelete = () => {
      props.onDelete();
    }

    useEffect(() => {
      if(!props.onSelect) return;
      const selectedIdToSend = numSelected === 1 ? selectedId[0] : null;
      props.onSelect(selectedIdToSend);
    }, [numSelected]);

    const HeaderTools = () => {
      if (numSelected > 0) {
        return (
          <div style={{display:'flex'}}>
            {numSelected === 1 && !noEdit && showView && 
              <Tooltip title='View'>
                <IconButton aria-label='View' onClick={props.onView}>
                  <RemoveRedEye />
                </IconButton>
              </Tooltip>
            }
            {numSelected === 1 && !noEdit &&
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
      } else {
        return (
          <>
          {numSelected === 0 && !noAdd &&
            <Tooltip title='Add'>
              <IconButton aria-label='Filter list' onClick={onAdd}>
                <AddIcon />
              </IconButton>
            </Tooltip>
          }
          </>
        );
      }
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
      numSelected,
      onRequestSort,
      onSelectAllClick,
      order,
      orderBy,
      rowCount
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
          {headRows.map(row => (
            <TableCell
              align={row.numeric ? 'right' : 'left'}
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
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

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

  const onView = () => {
    props.onView(selectedId);
    setSelected([])
    setSelectedId([])
  }

  return (
    <div className={classes.root} style={{ padding: '0px' }}>
      <ModalYesNo
        message={'Are you sure you want to remove this element?'}
        onCancel={() => setOpenYesNoModal(false)}
        onOK={onDelete}
        showModal={openYesNoModal}
        title={'Remove Element'}
      />
      <Paper className={classes.paper}>
        <EnhancedTableToolbar
          noEdit={noEdit}
          onAdd={onAdd}
          onEdit={onEdit}
          onDelete={() => setOpenYesNoModal(true)}
          onSelect={onSelect}
          onView={onView}
          selected={selected}
          title={props.title}
        />
        <div className={classes.tableWrapper}>
          <Table
            aria-labelledby='tableTitle'
            className={classes.table}
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              noEdit={noEdit}
              numSelected={selected.length}
              onRequestSort={handleRequestSort}
              onSelectAllClick={handleSelectAllClick}
              order={order}
              orderBy={orderBy}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-\${index}`;
                  return (
                    <TableRow
                      aria-checked={isItemSelected}
                      hover
                      key={`key-row-${row.id}`}
                      //key={headRows[0].id}
                      onClick={event => handleClick(event, row.name, row.id)}
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

                      {headRows.map((header, ix) =>
                        <TableCell
                          align={!ix ? 'inherit' : 'right'}
                          component='th'
                          key={`cell-row${index}-${ix}`}
                          padding={!ix ? 'none' : 'default'}
                          scope='row'
                          >
                          {row[header.id]}
                        </TableCell>
                      )}
                      
                      {/* 
                      <TableCell component='th' id={labelId} scope='row' padding='none'>
                        {row.id}
                      </TableCell>
                      <TableCell align='right'>{row.level}</TableCell>
                      <TableCell align='right'>{row.name}</TableCell>
                      <TableCell align='right'>{row.creator}</TableCell>
                      <TableCell align='right'>{row.creation_date}</TableCell> */}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          backIconButtonProps={{
            'aria-label': 'Previous Page'
          }}
          component='div'
          count={rows.length}
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
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
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

export default TableComponent;
