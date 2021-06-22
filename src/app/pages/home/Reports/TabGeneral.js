import React, { useEffect, useState } from 'react';
import { uniq, uniqBy } from 'lodash';
import { differenceInDays } from 'date-fns';
import {
  Button,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from "@material-ui/core";
import Notification from '@material-ui/icons/NotificationImportant';
import { makeStyles } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { connect, useDispatch } from 'react-redux';
import { utcToZonedTime } from 'date-fns-tz';
import { actions } from '../../../store/ducks/general.duck';
import { postDB, getCountDB, getDBComplex, getOneDB, getDB } from '../../../crud/api';
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
  { index: 7, id: 'processLive', name: 'Processes', custom: '' },
  { index: 8, id: 'inventories', name: 'Inventories', custom: '' }
];

const specificFilters = {
  processLive: [
    {
      id: "folios",
      label: "Folios"
    },
    {
      id: "processName",
      label: "Process Name"
    },
    {
      id: "selectedProcessType",
      label: "Process Type"
    },
    {
      id: "processStatus",
      label: "Process Status"
    },
    {
      id: "stage",
      label: "Stage"
    },
    {
      id: "creationUserId",
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

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1)
  },
  filterTitles: {
    marginBottom: '0px',
    fontSize: 16
  }
}));

const TabGeneral = ({ id, savedReports, setId, reloadData, user, userLocations }) => {
  const dispatch = useDispatch();
  const { setGeneralLoading, showErrorAlert, showSavedAlert, showSelectValuesAlert, showCustomAlert } = actions;
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
  const [specificFiltersOptions, setSpecificFiltersOptions] = useState({
    processLive: {
      folios: [],
      processName: [],
      selectedProcessType: [{ id: 'creation', label: "Creation" }, { id: 'maintenance', label: "Maintenance" }, { id: 'decommission', label: "Decommission" }, { id: 'movement', label: "Movement" }, { id: 'short', label: "Short Movement" }],
      processStatus: [{ id: 'approved', label: "Approved" }, { id: 'partiallyApproved', label: "Partially Approved" }, { id: 'rejected', label: "Rejected" }, { id: 'inProcess', label: "In Process" }],
      stage: [],
      creationUserId: [],
      approvalUser: [],
    },
    inventories: {
      inventoryUser: [{ label: "Joe Doe" }, { label: "John Smith" }],
      idSession: [{ label: "3345" }, { label: "123" }, { label: "25899" }],
    }
  });
  const defaultFilterSelected = {
    customFields: {
      base: [],
      category: [],
      all: [],
      selected: [],
    },
    processLive: {
      folios: [],
      processName: [],
      selectedProcessType: [],
      processStatus: [],
      stage: [],
      creationUserId: [],
      approvalUser: [],
      daysDelayed: 0,
    },
    inventories: {
      inventoryUser: [],
      idSession: [],
    }
  };

  const [filtersSelected, setFiltersSelected] = useState(defaultFilterSelected);

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

          if (customSelected) {
            loadReportsData(selectedReport, customSelected);
          }

          setLoading(false);
        })
        .catch(error => {
          console.log('error>', error);
          setLoading(false);
        });
    }
  };

  const loadProcessData = () => {
    //GET Folios 
    getDBComplex({
      collection: 'processLive',
      fields: [{ key: 'creationUserFullName', value: 1 }, { key: 'creationUserId', value: 1 }, { key: 'requestUser', value: 1 }, { key: 'creationDate', value: 1 }, { key: '_id', value: 1 }, { key: 'folio', value: 1 }]
    })
      .then(response => response.json())
      .then(data => {
        const users = uniqBy(data.response.map(({ creationUserId, creationUserFullName, requestUser: { email } }) => ({ id: creationUserId, label: `${creationUserFullName} <${email}>` })), 'id');
        const folios = uniqBy(data.response.map(({ _id, folio }) => ({ id: _id, label: folio })), 'id');
        setSpecificFiltersOptions(prev => ({
          ...prev,
          processLive: {
            ...prev.processLive,
            creationUserId: users || ["There are no creation users yet"],
            folios: folios || ["There are no ProcessLive yet"]
          }
        }));
      })
      .catch(error => console.log('error>', error));

    getDBComplex({
      collection: 'processStages',
      fields: [{ key: 'name', value: 1 }, { key: '_id', value: 1 }]
    })
      .then(response => response.json())
      .then(data => {
        const stages = data.response.map(({ name, _id }) => ({ id: _id, label: name }));
        setSpecificFiltersOptions(prev => ({
          ...prev,
          processLive: {
            ...prev.processLive,
            stage: stages || ["There are no Stages yet"],
          }
        }));
      })
      .catch(error => console.log('error>', error));

    getDBComplex({
      collection: 'processes',
      fields: [{ key: 'name', value: 1 }, { key: '_id', value: 1 }]
    })
      .then(response => response.json())
      .then(data => {
        const processNames = data.response.map(({ name, _id }) => ({ id: _id, label: name }));
        setSpecificFiltersOptions(prev => ({
          ...prev,
          processLive: {
            ...prev.processLive,
            processName: processNames || ["There are no Processes yet"],
          }
        }));
      })
      .catch(error => console.log('error>', error));

    getDBComplex({
      collection: 'processApprovals',
      fields: [{ key: 'userId', value: 1 }, { key: 'creationUserFullName', value: 1 }, { key: 'email', value: 1 }]
    })
      .then(response => response.json())
      .then(data => {
        getDB('user')
          .then((response) => response.json())
          .then((userData) => {
            const processApprovals = uniqBy(data.response.map(({ userId, creationUserFullName, email }) => ({ id: userId, label: `${userData.response.find(({ _id }) => _id === userId)?.name} ${userData.response.find(({ _id }) => _id === userId)?.lastName} <${email}>` })), 'id').filter((e) => e.id && e.label);
            setSpecificFiltersOptions(prev => ({
              ...prev,
              processLive: {
                ...prev.processLive,
                approvalUser: processApprovals || ["There are Approval Users yet"],
              }
            }));
          })
          .catch((error) => console.log(error));

      })
      .catch(error => console.log('error>', error));
  };

  const handleChange = (name) => (event) => {
    const { value } = event.target;
    // console.log(new Date(value).toISOString());
    if (value) {
      setValues({ ...values, [name]: value });
    } else {
      setValues({ ...values, selectedReport: '', startDate: '', endDate: '' });
    }
    if (name === 'selectedReport') {
      setFiltersSelected(defaultFilterSelected);
      setId('');
      if (value === 'processLive') {
        getDB('settingsProcesses')
          .then(response => response.json())
          .then(data => {
            setAllAlerts(data.response[0].alerts || []);
          })
          .catch(error => console.log(error));
        loadProcessData();
      }
      else {
        loadCustomFields(value);
      }
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
    setTableControl(prev => ({ ...prev, page: 0 }));
    handleGenerateReport(value);
    setId(value);
  }

  const handleGenerateReport = (id) => {
    savedReports.map(({ _id, endDate, selectedReport, startDate, customFields, processFilters }) => {
      if (_id === id) {
        setValues({
          ...values,
          selectedReport,
          startDate,
          endDate
        });
        if (selectedReport === 'processLive') {
          setFiltersSelected(prev => ({
            ...prev,
            processLive: processFilters
          }));
        }
        loadCustomFields(selectedReport, customFields || []);
        setCollectionName(selectedReport);
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
    });
    setCollectionName(values.selectedReport);
    loadReportsData(values.selectedReport);
    setId(null);
  }

  const orderByCorrection = {
    processLive: {
      name: 'processData.name',
      type: 'processData.selectedProcessType',
      status: 'processData.processStatus',
      creator: 'creationUserFullName',
      date: 'creationDate',
      alert: 'dueDate',
      stages: 'processData.totalStages'
    }
  };

  const handleSave = (reportName) => {
    const { selectedReport, startDate, endDate } = values;
    if (!selectedReport) {
      dispatch(showSelectValuesAlert());
      return;
    }
    var body;
    if (selectedReport === 'processLive') {
      body = { ...values, reportName, processFilters: filtersSelected.processLive };
    }
    else {
      body = { ...values, reportName, customFields: filtersSelected.customFields.selected };
    }
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

  const [allAlerts, setAllAlerts] = useState([]);
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

  const handleCSVDownload = async () => {
    if (!collectionName) {
      dispatch(showCustomAlert({
        message: 'You should generate a report of any collection in order to execute the download',
        open: true,
        type: 'warning',
      }))
      return;
    }

    dispatch(setGeneralLoading({ active: true }));

    const condition = collectionName === 'processLive' ? await getFiltersProcess() : null;

    getDBComplex(({
      collection: collectionName,
      condition: collectionName === 'processLive' ? condition : collectionName === 'assets' ? [{ "location": { "$in": userLocations } }] : null
    }))
      .then((response) => response.json())
      .then(({ response }) => {
        let csv;
        const { name } = modules.find(({ id }) => id === collectionName);
        let headers = [];
        dataTable.headerObject.map(({ label }) => headers.push(label));
        const { rows } = formatData(collectionName, response);
        const jsonToCsvParser = new Parser({
          delimiter: '|',
          fields: headers,
          transforms: [
            unwind({ paths: headers, blankOut: false })
          ],
          quote: ''
        });

        if (collectionName === 'processLive') {
          const processRows = response.map(({ processData, creationUserFullName, creationDate, updateDate, _id, folio }) => {
            const date = String(new Date(creationDate)).split('GMT')[0];
            const uptDate = String(new Date(updateDate)).split('GMT')[0];
            return ({ folio, name: processData.name, stages: processData.totalStages, type: processData.selectedProcessType, creator: creationUserFullName, date, updateDate: uptDate });
          });
          csv = jsonToCsvParser.parse(processRows);
        } else {
          csv = jsonToCsvParser.parse(rows);
        }

        var a = document.createElement('a');
        a.href = 'data:attachment/csv,' + encodeURI(csv);
        a.target = '_Blank';
        a.download = `${name}_reports.csv`;
        document.body.appendChild(a);
        a.click();
      })
      .catch((error) => dispatch(showCustomAlert({
        message: `Something wrong happened in the download. Please try again later.\n Error: ${error}`,
        open: true,
        type: 'error'
      })))
      .finally(() => dispatch(setGeneralLoading({ active: false })));
  };

  const getFiltersProcess = async () => {
    var result = [];
    var lookById = [];
    const keys = Object.keys(filtersSelected.processLive);
    await Promise.all(keys.map(async (key) => {
      if (!filtersSelected.processLive[key].length) {
        return;
      }
      if (['processName', 'selectedProcessType', 'processStatus'].includes(key)) {
        const extendedKey = 'processData'.concat('.', key !== 'processName' ? key : 'id');
        result.push({ [extendedKey]: { "$in": filtersSelected.processLive[key].map(({ id }) => (id)) } });
      }
      else if (key === 'folios') {
        filtersSelected.processLive[key].map(({ id }) => {
          lookById.push(id);
        });
      }
      else if (key === 'stage' || key === 'approvalUser') {
        const stages = {
          condition: [{ processStages: { $elemMatch: { id: { "$in": filtersSelected.processLive[key].map(({ id }) => (id)) } } } }],
          fields: [{ key: '_id', value: 1 }]
        }
        const approval = {
          condition: [{ userId: { "$in": filtersSelected.processLive[key].map(({ id }) => (id)) } }],
          fields: [{ key: 'processId', value: 1 }]
        }
        const data = await getDBComplex({
          collection: key === 'stage' ? 'processes' : 'processApprovals',
          condition: key === 'stage' ? stages.condition : approval.condition,
          fields: key === 'stage' ? stages.fields : approval.fields,
        })
          .then(response => response.json())
          .then(data => {
            return data.response;
          })
          .catch(error => console.log('error>', error));
        if (key === 'stage') {
          result.push({ "selectedProcess": { "$in": data.map(({ _id }) => (_id)) } });
        }
        else {
          data.map(({ processId }) => {
            lookById.push(processId);
          });
        }
      }
      else {
        result.push({ [key]: { "$in": filtersSelected.processLive[key].map(({ id }) => (id)) } });
      }
    }));
    if (lookById.length) {
      result.push({ "processLiveId": { "$in": lookById } });
    }
    return result.length > 0 ? result : null;
  };

  const loadReportsData = async (collectionNames, customSelected) => {
    if (!collectionNames) return;
    const collection = modules.find(({ id }) => id === collectionNames);
    collectionNames = !Array.isArray(collectionNames) ? [collectionNames] : collectionNames;
    collectionNames.forEach(async collectionName => {
      let queryLike = '';

      if (collectionName) {
        queryLike = tableControl.searchBy ? (
          [{ key: tableControl.searchBy, value: tableControl.search }]
        ) : (
          ['name', 'lastname', 'email', 'model', 'price', 'brand', 'level'].map(key => ({ key, value: tableControl.search }))
        )
      }

      const condition = collectionName === 'processLive' ? await getFiltersProcess() : null;

      getCountDB({
        collection: collectionName,
        queryLike: tableControl.search ? queryLike : null,
        condition: collectionName === 'processLive' ? condition : collectionName === 'assets' ? [{ "location": { "$in": userLocations } }, { "creationDate": { "$gte": [{ "$dateFromString": { "dateString": new Date(values.startDate).toISOString() } }, { "$dateFromString": { "dateString": "$creationDate" } }] } }] : null
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
        sort: collectionName === 'processLive' && !tableControl.order ? [{ key: 'folio', value: 1 }] : [{ key: tableControl.orderBy, value: tableControl.order }],
        queryLike: tableControl.search ? queryLike : null,
        condition: collectionName === 'processLive' ? condition : collectionName === 'assets' ? [{ "location": { "$in": userLocations } }, { "creationDate": { "$gte": [{ "$dateFromString": { "dateString": new Date(values.startDate).toISOString() } }, { "$dateFromString": { "dateString": "$creationDate" } }] } }] : null
      })
        .then(response => response.json())
        .then(data => {
          const { response } = data;
          console.log(response);
          const baseHeaders = getGeneralFieldsHeaders(collection.id);
          if (collectionName === 'processLive') {
            const headerIndexToChange = baseHeaders.findIndex(({ id }) => id === 'dueDate');
            baseHeaders[headerIndexToChange] = {
              ...baseHeaders[headerIndexToChange], renderCell: (value) => {
                const biggerThan = allAlerts.filter((element) => (value * -1) >= Number(element.days)).map(({ days }) => days);
                const alertToApply = Math.max(...biggerThan);
                const alert = allAlerts.find(({ days }) => days === alertToApply.toString());
                return (
                  <div style={{ display: 'table-cell', verticalAlign: 'middle', textAlign: 'center', padding: '16px', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>
                    {
                      typeof value === "number" && alert &&
                      <Chip
                        icon={value ? <Notification /> : null}
                        label={value ? `${value * -1} days` : 'No DueDate'}
                        style={{ backgroundColor: alert?.color || '#B1B1B1', height: '28px' }}
                        color='secondary'
                      />
                    }
                  </div>
                )
              }
            }
          }
          let headers = []
          baseHeaders.concat(customSelected || filtersSelected.customFields.selected).forEach(({ label }) => headers.push(label));
          var dataTable;
          if (collectionName === 'processLive') {
            const processRows = response.map(({ processData, creationUserFullName, creationDate, _id, folio, dueDate }) => {
              const pastDue = differenceInDays(new Date(dueDate), new Date());
              const date = String(new Date(creationDate)).split('GMT')[0];
              return ({ folio, name: processData.name, stages: processData.totalStages, type: processData.selectedProcessType, dueDate: pastDue, creator: creationUserFullName, creationDate: date });
            });
            dataTable = { rows: processRows, headerObject: baseHeaders };
          }
          else {
            dataTable = formatData(collection.id, response);
          }
          //Get just the CustomFields
          const baseFieldsHeaders = dataTable.headerObject.filter(e => !filtersSelected.customFields.all.some(custom => custom.id === e.id));
          setFiltersSelected(prev => ({
            ...prev,
            customFields: {
              ...prev.customFields,
              base: baseFieldsHeaders
            }
          }));
          setDataTable({ ...dataTable, headerObject: baseHeaders.concat(customSelected || filtersSelected.customFields.selected) || [], title: collection.name });
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
      {Object.keys(specificFilters).includes(values.selectedReport) && (
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
              {values.selectedReport === 'processLive' && (
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
                        processLive: {
                          ...prev.processLive,
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
              orderBy: orderByCorrection[collectionName] && orderByCorrection[collectionName][orderBy] ? orderByCorrection[collectionName][orderBy] : orderBy,
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
