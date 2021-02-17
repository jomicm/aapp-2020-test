/* eslint-disable no-restricted-imports */
import React, { useState, useEffect } from 'react';
import MUIDataTable from "mui-datatables";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { getDB, deleteDB } from '../../../crud/api';
import { formatCollection } from './reportsHelpers';

const modules = [
  { index: 0, id: 'user', name: 'Users' },
  { index: 1, id: 'employees', name: 'Employees' },
  { index: 2, id: 'locations', name: 'Locations' },
  { index: 3, id: 'categories', name: 'Categories' },
  { index: 4, id: 'references', name: 'References' },
  { index: 5, id: 'assets', name: 'Assets' },
  { index: 6, id: 'depreciation', name: 'Depreciation' },
];
const savedReport = [
  { id: 'saved1', name: 'Saved 1' },
  { id: 'saved2', name: 'Saved 2' },
  { id: 'saved3', name: 'Saved 3' },
  { id: 'saved4', name: 'Saved 4' },
  { id: 'saved5', name: 'Saved 5' },
];

// --
const columns = [
  {
    name: "Name",
    options: {
      filter: true,
      setCellProps: () => ({style: {whiteSpace:'nowrap'}})
    }
  },
  {
    name: "Title",
    options: {
      filter: true,
      setCellProps: () => ({style: {whiteSpace:'nowrap'}})
    }
  },
  {
    name: "Location",
    options: {
      filter: false,
      setCellProps: () => ({style: {whiteSpace:'nowrap'}})
    }
  },
  {
    name: "Age",
    options: {
      filter: true,
    }
  },
  {
    name: "Salary",
    options: {
      filter: true,
      sort: false
    }
  },
  {
    name: "Salary1",
    options: {
      filter: true,
      sort: false
    }
  },
  {
    name: "Salary2",
    options: {
      filter: true,
      sort: false
    }
  },
  {
    name: "Phone Number",
    options: {
      filter: true,
      sort: false,
      setCellProps: () => ({style: {whiteSpace:'nowrap'}})
    }
  },
];

const data = [
  ["Gabby George", "Business Analyst", "Minneapolis", 30, "$100,000", "$100,000", "$100,000", "555-5555"],
  ["Aiden Lloyd", "Business Consultant", "Dallas",  55, "$200,000", "$200,000", "$200,000", ""],
  ["Jaden Collins", "Attorney", "Santa Ana", 27, "$500,000", "$500,000", "$500,000", "555-5555"],
  ["Franky Rees", "Business Analyst", "St. Petersburg", 22, "$50,000", "$50,000", "$50,000", "555-5555"],
  ["Aaren Rose", "Business Consultant", "Toledo", 28, "$75,000", "$75,000", "$75,000", "555-5555"],
  ["Blake Duncan", "Business Management Analyst", "San Diego", 65, "$94,000", "$94,000", "$94,000", "555-3333"],
  ["Frankie Parry", "Agency Legal Counsel", "Jacksonville", 71, "$210,000", "$210,000", "$210,000", "555-5555"],
  ["Lane Wilson", "Commercial Specialist", "Omaha", 19, "$65,000", "$65,000", "$65,000", "555-5555"],
  ["Robin Duncan", "Business Analyst", "Los Angeles", 20, "$77,000", "$77,000", "$77,000", "555-3333"],
  ["Mel Brooks", "Business Consultant", "Oklahoma City", 37, "$135,000", "$135,000", "$135,000", "555-5555"],
  ["Harper White", "Attorney", "Pittsburgh", 52, "$420,000", "$420,000", "$420,000", "555-5555"],
  ["Kris Humphrey", "Agency Legal Counsel", "Laredo", 30, "$150,000", "$150,000", "$150,000", "555-5555"],
  ["Frankie Long", "Industrial Analyst", "Austin", 31, "$170,000", "$170,000", "$170,000", ""],
  ["Brynn Robbins", "Business Analyst", "Norfolk", 22, "$90,000", "$90,000", "$90,000", "555-0000"],
  ["Justice Mann", "Business Consultant", "Chicago", 24, "$133,000", "$133,000", "$133,000", "555-5555"],
  ["Addison Navarro", "Business Management Analyst", "New York", 50, "$295,000", "$295,000", "$295,000", "555-5555"],
  ["Jesse Welch", "Agency Legal Counsel", "Seattle", 28, "$200,000", "$200,000", "$200,000", "555-5555"],
  ["Eli Mejia", "Commercial Specialist", "Long Beach", 65, "$400,000", "$400,000", "$400,000", "555-5555"],
  ["Gene Leblanc", "Industrial Analyst", "Hartford", 34, "$110,000", "$110,000", "$110,000", "555-5555"],
  ["Danny Leon", "Computer Scientist", "Newark", 60, "$220,000", "$220,000", "$220,000", "555-5555"],
  ["Lane Lee", "Corporate Counselor", "Cincinnati", 52, "$180,000", "$180,000", "$180,000", "555-5555"],
  ["Jesse Hall", "Business Analyst", "Baltimore", 44, "$99,000", "$99,000", "$99,000", "555-5555"],
  ["Danni Hudson", "Agency Legal Counsel", "Tampa", 37, "$90,000", "$90,000", "$90,000", "555-5555"],
  ["Terry Macdonald", "Commercial Specialist", "Miami", 39, "$140,000", "$140,000", "$140,000", "555-5555"],
  ["Justice Mccarthy", "Attorney", "Tucson", 26, "$330,000", "$330,000", "$330,000", "555-5555"],
  ["Silver Carey", "Computer Scientist", "Memphis", 47, "$250,000", "$250,000", "$250,000", "555-5555"],
  ["Franky Miles", "Industrial Analyst", "Buffalo", 49, "$190,000", "$190,000", "$190,000", "555-5555"],
  ["Glen Nixon", "Corporate Counselor", "Arlington", 44, "$80,000", "$80,000", "$80,000", "555-5555"],
  ["Gabby Strickland", "Business Process Consultant", "Scottsdale", 26, "$45,000", "$45,000", "$45,000", "555-5555"],
  ["Mason Ray", "Computer Scientist", "San Francisco", 39, "$142,000", "$142,000", "$142,000", "555-5555"]
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
  tableBodyHeight: '400px',
};
// --
const dataTableDefault = { header: [], tableRows: [], title: '' };

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  }
}));

const TabGeneral = () => {
  const classes = useStyles();
  const [values, setValues] = useState({});
  const [reportIndex, setReportIndex] = useState(null);
  const [dataTable, setDataTable] = useState(dataTableDefault);

  const handleChange = name => event => {
    const value = event.target.value;
    setValues(prev => ({ ...prev, [name]: value }));
    switch (name) {
      case 'selectReport':
        setReportIndex(event.target.value);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (reportIndex === null || reportIndex ==='') {
      setDataTable(dataTableDefault);
      return;
    }
    const collection = modules.find(mod => mod.index === reportIndex);
    if (!collection) {
      setDataTable(dataTableDefault);
      return;
    }
    getDB(collection.id)
      .then(response => response.json())
      .then(data => {
        const { response } = data;
        const dataTable = formatCollection(collection.id ,response);
        setDataTable({ ...dataTable, title: collection.name });
      })
      .catch(error => console.log('error>', error));
  }, [reportIndex]);

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h2>Generate Reports</h2>
        <Button variant="contained" size="large" color="primary" className={classes.button}> Save </Button>
      </div>
      <div name="Head Part" style={{ marginTop:'30px', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
        <FormControl style={{width: '200px'}}>
          <InputLabel htmlFor="age-simple">Select Report</InputLabel>
          <Select
            value={values.selectedProfile}
            onChange={handleChange('selectReport')}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {modules.map((opt, ix) => (
              <MenuItem key={`opt-${ix}`} value={ix}>{opt.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl style={{width: '200px'}}>
          <TextField
            // className={`custom-field-${isPreview ? 'preview' : 'real'}-wrapper__date`}
            label="Start Date"
            type="date"
            defaultValue={values.initialValue}
            value={values.initialValue}
            onChange={handleChange('startDate')}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </FormControl>
        <FormControl style={{width: '200px'}}>
          <TextField
            // className={`custom-field-${isPreview ? 'preview' : 'real'}-wrapper__date`}
            label="End Date"
            type="date"
            defaultValue={values.initialValue}
            value={values.initialValue}
            onChange={handleChange('startDate')}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </FormControl>
        <FormControl style={{width: '200px'}}>
          <InputLabel htmlFor="age-simple">Generated Saved</InputLabel>
          <Select
            value={values.selectedProfile}
            // onChange={e => setValues({...values, selectedProfile: e.target.value})}
            onChange={handleChange('selectedProfile')}
            inputProps={{
              name: 'age',
              id: 'age-simple',
            }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {savedReport.map((opt, ix) => (
              <MenuItem key={`opt-${ix}`} value={ix}>{opt.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div>
      <h3 style={{marginTop: '40px'}}>Table</h3>
        <MUIDataTable
          title={dataTable.title}
          data={dataTable.tableRows}
          columns={dataTable.header}
          options={options}
        />
      </div>
    </div>
  )
}

export default TabGeneral
