import React, { useEffect, useState } from 'react';
import {
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from "@material-ui/core";
import { makeStyles } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { connect, useDispatch } from 'react-redux';
import { actions } from '../../../store/ducks/general.duck';
import { postDB, getCountDB, getDBComplex } from '../../../crud/api';
import TableReportsGeneral from '../Components/TableReportsGeneral';
import CircularProgressCustom from '../Components/CircularProgressCustom';
import {
  convertRowsToDataTableObjects,
  extractCustomField,
  extractGeneralField,
  formatData,
  getGeneralFieldsHeaders,
  normalizeRows
} from './reportsHelpers';
import ChangeReportName from './modals/ChangeReportName';

const { Parser, transforms: { unwind } } = require('json2csv');
const dataTableDefault = { header: [], tableRows: [], title: '', headerObject: [] };

const modules = [
  { index: 0, id: 'user', name: 'Users', custom: 'userProfiles' },
  { index: 1, id: 'employees', name: 'Employees', custom: 'employeeProfiles' },
  { index: 2, id: 'locations', name: 'Locations', custom: 'locations' },
  { index: 3, id: 'categories', name: 'Categories', custom: 'categories' },
  { index: 4, id: 'references', name: 'References', custom: 'categories' },
  { index: 5, id: 'assets', name: 'Assets', custom: 'categories' },
  { index: 6, id: 'depreciation', name: 'Depreciation', custom: '' },
  { index: 7, id: 'processes', name: 'Processes', custom: '' },
  { index: 8, id: 'inventories', name: 'Inventories', custom: '' }
];

const specificFilters = {
  processes: [
    {
      id: "folios",
      label: "Folios"
    },
    {
      id: "processes",
      label: "Processes"
    },
    {
      id: "stage",
      label: "Stage"
    },
    {
      id: "creationUser",
      label: "Creation User"
    },
    {
      id: "approvalUser",
      label: "Approval User"
    },
  ],
  inventories: [
    {
      id: "inventoryUser",
      label: "Inventory User"
    },
    {
      id: "idSession",
      label: "ID Session"
    },
  ]
};

//The following Variable is temporal, it should be replaced later when the Processes Module is finished.
const specificFiltersOptions = {
  processes: {
    folios: [{ label: "3345" }, { label: "123" }, { label: "25899" }],
    processes: [{ label: "Creation" }, { label: "Maintenance" }],
    stage: [{ label: "1" }, { label: "3" }, { label: "last" }],
    creationUser: [{ label: "Joe Doe" }, { label: "John Smith" }],
    approvalUser: [{ label: "Joe Doe" }, { label: "John Smith" }],
  },
  inventories: {
    inventoryUser: [{ label: "Joe Doe" }, { label: "John Smith" }],
    idSession: [{ label: "3345" }, { label: "123" }, { label: "25899" }],
  }
}


const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1)
  },
  filterTitles: {
    marginBottom: '0px',
    fontSize: 16
  }
}));

const TabGeneral = ({ id, savedReports, setId, reloadData, user }) => {
  const dispatch = useDispatch();
  const { showErrorAlert, showSavedAlert, showSelectValuesAlert } = actions;
  const classes = useStyles();
  const [control, setControl] = useState(false);
  const [loading, setLoading] = useState(false);
  const [collectionName, setCollectionName] = useState(null);
  const [dataTable, setDataTable] = useState(dataTableDefault);
  const [values, setValues] = useState({
    selectedReport: '',
    startDate: '',
    endDate: '',
    enabled: false,
    reportName: ''
  });
  const [filtersSelected, setFiltersSelected] = useState({
    customFields: {
      base: [],
      category: [],
      all: [],
      selected: [],
    },
    processes: {
      folios: [],
      processes: [],
      stage: [],
      creationUser: [],
      approvalUser: [],
      daysDelayed: 0,
    },
    inventories: {
      inventoryUser: [],
      idSession: [],
    }
  });

  const permissions = user.profilePermissions.reports || [];

  const loadCustomFields = (selectedReport, customSelected) => {
    if (!customSelected) {
      setFiltersSelected(prev => ({
        ...prev,
        customFields: {
          base: [],
          category: [],
          all: [],
          selected: [],
        },
      }));
    }
    const collection = modules.filter(({ id }) => id === selectedReport)[0];
    if (collection && collection.custom.length) {
      setLoading(true);
      getDBComplex({
        collection: collection?.custom,
        customQuery: JSON.stringify({ "customFieldsTab": { "$ne": {} } })
      })
        .then(response => response.json())
        .then(data => {
          const { response } = data;
          //Get just the CustomFields
          let customFieldNames = {};
          const rowToObjectsCustom = response.map(row => {
            let filteredCustomFields = {};
            const { customFieldsTab } = row;
            Object.values(customFieldsTab || {}).forEach(tab => {
              const allCustomFields = [...tab.left, ...tab.right];
              allCustomFields.map(field => {
                filteredCustomFields = { ...filteredCustomFields, ...extractCustomField(field) };
              });
            });
            customFieldNames = { ...customFieldNames, ...filteredCustomFields };
            return filteredCustomFields;
          })
          const customFieldsSimplified = convertRowsToDataTableObjects(normalizeRows(rowToObjectsCustom, customFieldNames));
          setFiltersSelected(prev => ({
            ...prev,
            customFields: {
              ...prev.customFields,
              all: customFieldsSimplified.headerObject || ["There are no Custom Fields yet"],
              selected: customSelected || [],
            }
          }));
          setLoading(false);
        })
        .catch(error => {
          console.log('error>', error);
          setLoading(false);
        });
    }
  };

  const handleChange = (name) => (event) => {
    const { value } = event.target;
    if (value) {
      setValues({ ...values, [name]: value });
    } else {
      setValues({ ...values, selectedReport: '', startDate: '', endDate: '' });
    }
    if (name === 'selectedReport') {
      loadCustomFields(value);
      setDataTable(dataTableDefault);
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
    savedReports.map(({ _id, endDate, selectedReport, startDate, customFields }) => {
      if (_id === id) {
        setValues({
          ...values,
          selectedReport,
          startDate,
          endDate
        });
        loadCustomFields(selectedReport, customFields)
        setCollectionName(selectedReport);
        loadReportsData(selectedReport);
      }
    })
  }

  const handleClickCollectionName = () => {
    setTableControl({
      collection: '',
      total: 0,
      page: 0,
      rowsPerPage: 5,
      orderBy: 'name',
      order: 1,
      search: '',
      searchBy: '',
    })
    setCollectionName(values.selectedReport);
    loadReportsData(values.selectedReport);
    setId(null);
  }

  const handleSave = (reportName) => {
    const { selectedReport, startDate, endDate } = values;
    if (!selectedReport) {
      dispatch(showSelectValuesAlert());
      return;
    }
    const body = { ...values, reportName, customFields: filtersSelected.customFields.selected }
    postDB('reports', body)
      .then((response) => response.json())
      .then(() => {
        dispatch(showSavedAlert());
      })
      .catch((error) => dispatch(showErrorAlert()));
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

  const handleCSVDownload = () => {
    let queryLike = '';

    if (collectionName) {
      queryLike = tableControl.searchBy ? (
        [{ key: tableControl.searchBy, value: tableControl.search }]
      ) : (
        ['name', 'lastname', 'email', 'model', 'price', 'brand', 'level'].map(key => ({ key, value: tableControl.search }))
      );
      getDBComplex(({
        collection: collectionName,
        queryLike,
        sort: [{ key: tableControl.orderBy, value: tableControl.order }],
      }))
        .then((response) => response.json())
        .then(({ response }) => {
          let headers = [];
          dataTable.headerObject.map(({ label }) => headers.push(label));
          const { rows } = formatData(collectionName, response);
          const jsonToCsvParser = new Parser({
            delimiter: '|',
            transforms: [
              unwind({ paths: headers, blankOut: true })
            ],
            quote: '',
          });
          const csv = jsonToCsvParser.parse(rows);
          console.log(csv);
        })
        .catch((error) => console.log(error));
    }
  };

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
          const baseHeaders = getGeneralFieldsHeaders(collection.id);
          const dataTable = formatData(collection.id, response);
          //Get just the CustomFields
          const baseFieldsHeaders = dataTable.headerObject.filter(e => !filtersSelected.customFields.all.some(custom => custom.id === e.id));
          setFiltersSelected(prev => ({
            ...prev,
            customFields: {
              ...prev.customFields,
              base: baseFieldsHeaders
            }
          }));

          setDataTable({ ...dataTable, headerObject: baseHeaders.concat(filtersSelected.customFields.selected), title: collection.name });
        })
        .catch(error => console.log('error>', error));
    });
  };

  const changeFiltersSelected = (module, filter) => (event, values) => {
    setFiltersSelected(prev => ({
      ...prev,
      [module]: {
        ...prev[module],
        [filter]: values
      }
    }));
  }
  const changeCustomFieldsSelected = (event, values) => {
    setFiltersSelected(prev => ({
      ...prev,
      customFields: {
        ...prev.customFields,
        selected: values
      }
    }));
  }

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
        setReportNameInValues={(reportName) => {
          setValues({ ...values, reportName })
        }}
        showModal={control}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Generate Reports</h2>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          {loading && (
            <div style={{ width: '30px', display: 'flex', justifyContent: 'center', alignContent: 'center', margin: '10px' }}>
              <CircularProgressCustom size={25} />
            </div>
          )}
          <Button
            className={classes.button}
            color="primary"
            onClick={handleClickCollectionName}
            size="large"
            variant="contained"
          >
            Generate Report
          </Button>
          {permissions.includes('add') && (
            <Button
              className={classes.button}
              color="primary"
              onClick={handleChangeReportName}
              size="large"
              variant="contained"
            >
              Save
            </Button>
          )}
        </div>
      </div>
      <div
        name="Head Part"
        style={{ margin: '30px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}
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
      {(filtersSelected.customFields.all.length > 0 || filtersSelected.customFields.selected.length > 0) && (
        <div
          name="SpecificFilter"
          style={{ margin: '30px', display: 'flex', justifyContent: 'flex-start', flexWrap: 'wrap' }}
        >
          <div style={{ display: 'flex', justifyContent: 'flex-start', flexWrap: 'wrap', width: '100%' }}>
            <Autocomplete
              defaultValue={filtersSelected.customFields.selected}
              id='CustomFields'
              getOptionLabel={(option) => option.label}
              multiple
              onChange={changeCustomFieldsSelected}
              options={filtersSelected.customFields.all}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label='Custom Fields'
                  variant='standard'
                  style={{ width: '400px' }}
                />
              )}
              value={filtersSelected.customFields.selected}
            />
          </div>
        </div>
      )}
      { Object.keys(specificFilters).includes(values.selectedReport) && (
        <>
          <div
            name="SpecificFilter"
            style={{ margin: '30px', display: 'flex', justifyContent: 'flex-start', flexWrap: 'wrap' }}
          >
            <Typography className={classes.filterTitles} style={{ marginTop: '0px' }}> {`${modules.map(({ id, name }) => id === values.selectedReport ? name : null).join('')} Specific Filters`} </Typography>
            <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-start', flexWrap: 'wrap', width: '100%' }}>
              {specificFilters[values.selectedReport].map((e) => (
                <Autocomplete
                  className={classes.filters}
                  defaultValue={filtersSelected[values.selectedReport][e.id]}
                  getOptionLabel={(option) => option.label}
                  multiple
                  onChange={changeFiltersSelected(values.selectedReport, e.id)}
                  options={specificFiltersOptions[values.selectedReport][e.id]}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={e.label}
                      variant='standard'
                      style={{ width: '200px', margin: '10px 40px 10px 0px' }}
                    />
                  )}
                  value={filtersSelected[values.selectedReport][e.id]}
                />
              ))}
              {values.selectedReport === 'processes' && (
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                  <Typography style={{ color: 'black' }}> {'Delayed >='} </Typography>
                  <TextField
                    variant="outlined"
                    style={{ width: '60px', marginLeft: '8px', marginRight: '5px' }}
                    type="number"
                    inputProps={{
                      min: 0,
                      style: {
                        padding: '8px'
                      }
                    }}
                    onChange={(event) => {
                      setFiltersSelected(prev => ({
                        ...prev,
                        processes: {
                          ...prev.processes,
                          daysDelayed: event.target.value
                        }
                      }));
                    }}
                    value={filtersSelected[values.selectedReport].daysDelayed}
                  />
                  <Typography style={{ color: 'black' }}> Days </Typography>
                </div>
              )}
            </div>
          </div>
        </>
      )}
      <div>
        <Divider style={{ width: '100%', marginTop: '30px' }} />
        <h3 style={{ marginTop: '20px' }}> Table </h3>
        <TableReportsGeneral
          controlValues={tableControl}
          disableLoading={!!collectionName}
          handleCSVDownload={handleCSVDownload}
          headRows={dataTable.headerObject}
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
          disableActions
          title={dataTable.title}
        />
      </div>
    </div>
  )
}

const mapStateToProps = ({ auth: { user } }) => ({
  user
});
export default connect(mapStateToProps)(TabGeneral);
