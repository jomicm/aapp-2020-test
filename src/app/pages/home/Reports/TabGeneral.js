import React, { useEffect, useState } from 'react';
import MUIDataTable from "mui-datatables";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from "@material-ui/core";
import { makeStyles } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { actions } from '../../../store/ducks/general.duck';
import { getDB, deleteDB, updateDB, postDB, getOneDB, getCountDB, getDBComplex } from '../../../crud/api';
import TableReportsGeneral from '../Components/TableReportsGeneral';
import { formatData } from './reportsHelpers';
import ChangeReportName from './modals/ChangeReportName';

const dataTableDefault = { header: [], tableRows: [], title: '', headerObject: [] };

const modules = [
  { index: 0, id: 'user', name: 'Users' },
  { index: 1, id: 'employees', name: 'Employees' },
  { index: 2, id: 'locations', name: 'Locations' },
  { index: 3, id: 'categories', name: 'Categories' },
  { index: 4, id: 'references', name: 'References' },
  { index: 5, id: 'assets', name: 'Assets' },
  { index: 6, id: 'depreciation', name: 'Depreciation' }
];

const options = {
  draggableColumns: {
    enabled: true
  },
  filter: true,
  filterType: 'multiselect',
  fixedHeader: true,
  fixedSelectColumn: true,
  responsive: 'standard',
  selectableRows: 'single',
  selectableRowsHideCheckboxes: true,
  tableBodyHeight: '400px'
};

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1)
  }
}));

const TabGeneral = ({ id, savedReports, setId, reloadData }) => {
  const dispatch = useDispatch();
  const { setAlertControls } = actions;
  const classes = useStyles();
  const [control, setControl] = useState(false);
  const [collectionName, setCollectionName] = useState(null);
  const [dataTable, setDataTable] = useState(dataTableDefault);
  const [values, setValues] = useState({
    selectedReport: '',
    startDate: '',
    endDate: '',
    enabled: false,
    reportName: ''
  });

  const handleChange = (name) => (event) => {
    const { value } = event.target;
    if (value) {
      setValues({ ...values, [name]: value });
    } else {
      setValues({ ...values, selectedReport: '', startDate: '', endDate: '' });
    }
  };

  const handleChangeReportName = () => {
    setControl(true);
  }

  useEffect(() => {
    if (id) {
      handleGenerateReport(id);
    }
  }, [id])

  const handleClickGenerateReport = (e) => {
    const { value } = e.target;
    handleGenerateReport(value);
    setId(value);
  }

  const handleGenerateReport = (id) => {
    savedReports.map(({ _id, endDate, selectedReport, startDate }) => {
      if (_id === id) {
        setValues({
          ...values,
          selectedReport,
          startDate,
          endDate
        })
        setCollectionName(selectedReport);
      }
    })
  }

  const handleClickCollectionName = () => {
    setCollectionName(values.selectedReport);
    setId(null);
  }

  const handleSave = (reportName) => {
    const { selectedReport, startDate, endDate } = values;
    if (!selectedReport) {
      dispatch(
        setAlertControls({
          open: true,
          message: 'Select values before saving...',
          type: 'warning'
        })
      );
      return;
    }
    const body = { ...values, reportName }
    postDB('reports', body)
      .then((data) => data.json())
      .catch((error) => console.log('ERROR', error));
  }

  const reset = () => {
    setValues({ ...values, selectedReport: '', startDate: '', endDate: '' });
    reloadData()
    loadReportsData(collectionName)
  }

  const [tableControl, setTableControl] = useState({
    collection: '',
    total: 0,
    page: 0,
    rowsPerPage: 5,
    orderBy: 'name',
    order: 1,
    search: '',
    searchBy: '',
  });

  const loadReportsData = (collectionNames) => {
    if (!collectionNames) return;
    const collection = modules.find(({ id }) => id === collectionNames);
    collectionNames = !Array.isArray(collectionNames) ? [collectionNames] : collectionNames;
    collectionNames.forEach(collectionName => {
      let queryLike = '';

      if (collectionName) {
        queryLike = tableControl.searchBy ? (
          [{ key: tableControl.searchBy, value: tableControl.search }]
        ) : (
          ['name', 'lastname', 'email', 'model', 'price', 'brand', 'level'].map(key => ({ key, value: tableControl.search }))
        )
      }
      getCountDB({
        collection: collectionName,
        queryLike: tableControl.search ? queryLike : null
      })
        .then(response => response.json())
        .then(data => {
          setTableControl(prev => ({
            ...prev,
            total: data.response.count
          }))
        });

      getDBComplex({
        collection: collectionName,
        limit: tableControl.rowsPerPage,
        skip: tableControl.rowsPerPage * tableControl.page,
        sort: [{ key: tableControl.orderBy, value: tableControl.order }],
        queryLike: tableControl.search ? queryLike : null
      })
        .then(response => response.json())
        .then(data => {
          const { response } = data;
          const dataTable = formatData(collection.id, response);
          setDataTable({ ...dataTable, title: collection.name });
        })
        .catch(error => console.log('error>', error));
    });
  };

  useEffect(() => {
    if (!values.selectedReport) {
      setDataTable(dataTableDefault);
      return;
    }
    const collection = modules.find(({ id }) => id === collectionName);
    if (!collection) {
      setDataTable(dataTableDefault);
      return;
    }
    loadReportsData(collectionName)
  }, [collectionName]);

  useEffect(() => {
    loadReportsData(collectionName);
  }, [tableControl.page, tableControl.rowsPerPage, tableControl.order, tableControl.orderBy, tableControl.search, tableControl.locationsFilter]);

  return (
    <div>
      <ChangeReportName
        reset={reset}
        saveData={handleSave}
        setShowModal={setControl}
        setReportNameInValues={(reportName) => setValues({ ...values, reportName })}
        showModal={control}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Generate Reports</h2>
        <div>
          <Button
            className={classes.button}
            color="primary"
            onClick={handleClickCollectionName}
            size="large"
            variant="contained"
          >
            Generate Report
          </Button>
          <Button
            className={classes.button}
            color="primary"
            onClick={handleChangeReportName}
            size="large"
            variant="contained"
          >
            Save
          </Button>
        </div>
      </div>
      <div
        name="Head Part"
        style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}
      >
        <FormControl style={{ width: '200px' }}>
          <InputLabel htmlFor="age-simple">Select Report</InputLabel>
          <Select
            onChange={handleChange('selectedReport')}
            value={values.selectedReport}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {modules.map(({ id, name }, ix) => (
              <MenuItem key={`opt-${ix}`} value={id}>{name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl style={{ width: '200px' }}>
          <TextField
            defaultValue={values.startDate}
            InputLabelProps={{
              shrink: true,
            }}
            label="Start Date"
            onChange={handleChange('startDate')}
            type="date"
            value={values.startDate}
          />
        </FormControl>
        <FormControl style={{ width: '200px' }}>
          <TextField
            defaultValue={values.endDate}
            InputLabelProps={{
              shrink: true,
            }}
            label="End Date"
            onChange={handleChange('endDate')}
            type="date"
            value={values.endDate}
          />
        </FormControl>
        <FormControl style={{ width: '200px' }}>
          <InputLabel htmlFor="age-simple">Saved Reports</InputLabel>
          <Select
            inputProps={{
              name: 'age',
              id: 'age-simple',
            }}
            onChange={handleClickGenerateReport}
            value={id}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {savedReports.map(({ _id, reportName }, ix) => (
              <MenuItem key={`opt-${ix}`} value={_id}>{reportName}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div>
        <h3 style={{ marginTop: '40px' }}>Table</h3>
        <TableReportsGeneral
          controlValues={tableControl}
          headRows={dataTable.headerObject ? dataTable.headerObject : []}
          onDelete={() => { }}
          onEdit={() => { }}
          onView={() => { }}
          onSelect={() => { }}
          paginationControl={({ rowsPerPage, page }) =>
            setTableControl(prev => ({
              ...prev,
              rowsPerPage: rowsPerPage,
              page: page,
            }))
          }
          rows={dataTable.rows}
          searchControl={({ value, field }) => {
            setTableControl(prev => ({
              ...prev,
              search: value,
              searchBy: field,
            }))
          }}
          sortByControl={({ orderBy, order }) => {
            setTableControl(prev => ({
              ...prev,
              orderBy: orderBy,
              order: order,
            }))
          }}
          disableSearchBy
          title={dataTable.title}
        />
      </div>
    </div>
  )
}

export default TabGeneral;
