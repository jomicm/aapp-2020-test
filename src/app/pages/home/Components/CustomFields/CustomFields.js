/* eslint-disable no-restricted-imports */
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import SwipeableViews from "react-swipeable-views";
import { isEmpty } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Tab,
  Tabs,
  Paper,
  TextField,
  FormControlLabel,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  Tooltip
} from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import EmailOutlinedIcon from '@material-ui/icons/EmailOutlined';
import TextFormatIcon from '@material-ui/icons/TextFormat';
import SubjectIcon from '@material-ui/icons/Subject';
import TodayIcon from '@material-ui/icons/Today';
import ScheduleIcon from '@material-ui/icons/Schedule';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import CheckBoxOutlinedIcon from '@material-ui/icons/CheckBoxOutlined';
import AttachFileOutlinedIcon from '@material-ui/icons/AttachFileOutlined';
import AttachMoneyOutlinedIcon from '@material-ui/icons/AttachMoneyOutlined';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import ImageIcon from '@material-ui/icons/Image';
import LinkIcon from '@material-ui/icons/Link';
import EditAttributesIcon from '@material-ui/icons/EditAttributes';

import { actions } from '../../../../store/ducks/general.duck';
import {
  SingleLineSettings,
  MultiLineSettings,
  DateSettings,
  DateTimeSettings,
  DropDownSettings,
  RadioButtonsSettings,
  CheckboxesSettings,
  FileUploadSettings,
  CurrencySettings,
  PercentageSettings,
  EmailSettings,
  DecimalSettings,
  URLSettings,
  ImageSettings,
  DecisionBoxSettings,
  RichTextSettings,
  FormulaSettings,
  DateFormulaSettings,
} from './CustomFieldsPreview';
import DragDropArea from './DragDropArea';
import './CustomFields.scss';

const useStylesAccordion = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  deleteButton: {
    margin: '15px'
  }
}));

// Example 4 - Tabs
function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

const CustomFieldsSettings = (props) => {
  const { idSelectedCustomField: id, values, setValues, selfValues } = props.settings;
  const cfProps = {
    id,
    values,
    setValues,
    selfValues,
    onUpdate: props.updateCustomFieldProps
  }
  const customFieldsSettingsObj = {
    singleLine: <SingleLineSettings {...cfProps} />,
    multiLine: <MultiLineSettings {...cfProps} />,
    date: <DateSettings {...cfProps} />,
    dateTime: <DateTimeSettings {...cfProps} />,
    dropDown: <DropDownSettings {...cfProps} />,
    radioButtons: <RadioButtonsSettings {...cfProps} />,
    checkboxes: <CheckboxesSettings {...cfProps} />,
    fileUpload: <FileUploadSettings {...cfProps} />,
    currency: <CurrencySettings {...cfProps} />,
    percentage: <PercentageSettings {...cfProps} />,
    email: <EmailSettings {...cfProps} />,
    decimal: <DecimalSettings {...cfProps} />,
    url: <URLSettings {...cfProps} />,
    imageUpload: <ImageSettings {...cfProps} />,
    decisionBox: <DecisionBoxSettings {...cfProps} />,
    richText: <RichTextSettings {...cfProps} />,
    formula: <FormulaSettings {...cfProps} />,
    dateFormula: <DateFormulaSettings {...cfProps} />,
  };
  return customFieldsSettingsObj[props.settings.selectedCustomField] || 'There are no Custom Fields selected';
};


function CustomFields(props) {
  const dispatch = useDispatch();
  const { showCustomAlert } = actions;
  const { customFieldsTab, setCustomFieldsTab } = props;

  const [values, setValues] = useState({
    tabLayout: '1',
    newTabName: '',
  });

  const [tabName, setTabName] = useState('');

  const handleChangeValue = async (fieldName, fieldValue) => {
    await setValues({
      ...values,
      [fieldName]: fieldValue
    })
  };

  const handleChange = name => e => {
    if (name === 'tabLayout') {
      const tabsTmp = [...tabs];
      tabsTmp[tabIndex].columns = Number(e.target.value);
      setTabs(tabsTmp);
      setCustomFieldsColumns(Array(Number(e.target.value)).fill(1));
    }

    setValues({
      ...values,
      [name]: e.target.value
    })
  }

  const handleAddNewTab = (add) => {
    setValues({ ...values, newTabName: '' });
    setShowNewTabModal(false);
    if (!add) return;
    setTabs([...tabs, { name: values.newTabName, columns: 1 }]);
  };

  const handleChangeCFTab = (event, newValue) => {
    setTabIndex(newValue);
    setTabName(tabs[newValue].name);
    setCustomFieldsColumns(Array(tabs[newValue].columns).fill(1));
    handleChangeValue('tabLayout', String(tabs[newValue].columns));
  };

  const handleDeleteCFTab = () => {
    const newTabs = tabs.filter(({ name }) => tabName !== name);
    const index = tabs.findIndex(({ name }) => tabName === name);

    if (index < tabs.length - 1) {
      setTabIndex(index);
      setTabName(newTabs[index].name); 
      setCustomFieldsColumns(Array(newTabs[index].columns).fill(1));
      handleChangeValue('tabLayout', String(newTabs[index].columns));
      let data = customFieldsTab;
      console.log(index, customFieldsTab.length);
      const length =  Object.keys(customFieldsTab || []).length;

      for (var i = index; i < length; i++) {
        const oldKey = `tab-${i}`

        if (i + 1 === length) {
          break;
        }

        const nextKey = `tab-${i + 1}`;
        const value = data[nextKey];

        data[oldKey] = value
        delete data[nextKey];
        data = { ...data, [oldKey]: value };
      };
      setCustomFieldsTab(data);
    } else if (!newTabs.length) {
      setTabIndex(0);
      setTabName('');
      setCustomFieldsColumns([1]);
      handleChangeValue('tabLayout', '1');
      setCustomFieldsTab({});
    } else {
      setTabIndex(index - 1);
      setTabName(newTabs[index - 1].name);
      setCustomFieldsColumns(Array(newTabs[index - 1].columns).fill(1));
      handleChangeValue('tabLayout', String(newTabs[index - 1].columns));
      let data = customFieldsTab;
      delete data[`tab-${index}`];
      setCustomFieldsTab(data);
    }

    setTabs(newTabs);
  };

  const [tabIndex, setTabIndex] = useState(0);

  const customControls = [
    [
      { id: 'singleLine', name: 'Single Line', icon: <TextFormatIcon style={{ fill: 'grey' }} /> },
      { id: 'multiLine', name: 'Multi Line', icon: <SubjectIcon style={{ fill: 'grey' }} /> },
      { id: 'date', name: 'Date', icon: <TodayIcon style={{ fill: 'grey' }} /> },
      { id: 'dateTime', name: 'Date Time', icon: <ScheduleIcon style={{ fill: 'grey' }} /> },
    ],
    [
      { id: 'dropDown', name: 'Drop Down', icon: <ArrowDropDownIcon style={{ fill: 'grey' }} /> },
      { id: 'radioButtons', name: 'Radio', icon: <RadioButtonCheckedIcon style={{ fill: 'grey' }} /> },
      { id: 'checkboxes', name: 'Check Box', icon: <CheckBoxOutlinedIcon style={{ fill: 'grey' }} /> },
      { id: 'fileUpload', name: 'File Upload', icon: <AttachFileOutlinedIcon style={{ fill: 'grey' }} /> },
    ],
    [
      { id: 'currency', name: 'Currency', icon: <AttachMoneyOutlinedIcon style={{ fill: 'grey' }} /> },
      { id: 'percentage', name: 'Percentage', icon: <Typography style={{ color: 'grey', fontSize: 18, fontWeight: 'bolder' }}>%</Typography> },
      { id: 'email', name: 'Email', icon: <EmailOutlinedIcon style={{ fill: 'grey' }} /> },
      { id: 'decimal', name: 'Decimal', icon: <Typography style={{ color: 'grey', fontSize: 12, fontWeight: 'bolder' }}>0.00</Typography> },
    ],
    [
      { id: 'richText', name: 'HTML', icon: <TextFieldsIcon style={{ fill: 'grey' }} /> },
      { id: 'imageUpload', name: 'Image Upload', icon: <ImageIcon style={{ fill: 'grey' }} /> },
      { id: 'decisionBox', name: 'Decision Box', icon: <EditAttributesIcon style={{ fill: 'grey' }} /> },
      { id: 'url', name: 'URL', icon: <LinkIcon style={{ fill: 'grey' }} /> },
    ],
    [
      { id: 'formula', name: 'Num Formula', icon: <Typography style={{ color: 'grey', fontSize: 16, fontWeight: 'bolder' }}>f(x)</Typography> },
      //Date Formula will be implemented in another ticket
      // { id: 'dateGormula', name: 'Date Formula', icon: <Typography style={{color: 'grey', fontSize: 16, fontWeight: 'bolder'}}>f(t)</Typography> },
    ],
  ];

  const [tabs, setTabs] = useState([]); // useState([{name:'One', columns:1}]);
  const [showNewTabModal, setShowNewTabModal] = useState(false);
  const [customFieldsColumns, setCustomFieldsColumns] = useState([1]);

  // Custom Control Click
  const handleAddCustomFieldToTab = (customFieldName, fieldName) => {
    if (!tabs.length) {
      dispatch(
        showCustomAlert({
          open: true,
          message: 'First add a Tab',
          type: 'warning'
        })
      );
      return;
    }
    const customFieldsTabTmp = { ...customFieldsTab };
    if (!customFieldsTabTmp[`tab-${tabIndex}`]) {
      customFieldsTabTmp[`tab-${tabIndex}`] = { left: [], right: [], info: tabs[tabIndex] };
    }
    if (['Radio', 'Drop Down', 'Check Box', 'Decision Box'].includes(fieldName)) {
      customFieldsTabTmp[`tab-${tabIndex}`].left.push({ id: uuidv4().split('-').pop(), content: customFieldName, values: { fieldName, options: ['option 1', 'option 2', 'option 3'] } });
    } else {
      customFieldsTabTmp[`tab-${tabIndex}`].left.push({ id: uuidv4().split('-').pop(), content: customFieldName, values: { fieldName, initialValue: '' } });
    }
    setCustomFieldsTab(customFieldsTabTmp);
  };

  function handleChangeIndex4(index) {
    setTabIndex(index);
  }
  const classes = useStylesAccordion();

  const [selectedCustomFieldSettings, setSelectedCustomFieldSettings] = useState({
    idSelectedCustomField: '',
    selectedCustomField: '',
    values: {},
    setValues: null
  });

  // Save the custom field props from the settings CF to the preview CF
  const handleSetCustomFieldProps = (idSelectedCustomField, selectedCustomField, values, setValues) => {
    setSelectedCustomFieldSettings({ idSelectedCustomField, selectedCustomField, values, setValues, selfValues: findValuesByCustomFieldId(idSelectedCustomField) });
  };

  // Add the custom field props to the main object to be saved in DB
  const handleUpdateCustomFieldProps = (id, values) => {
    if (!customFieldsTab[`tab-${tabIndex}`]) return;
    const tab = customFieldsTab[`tab-${tabIndex}`];
    const right = tab.right.find(cf => cf.id === id);
    const left = tab.left.find(cf => cf.id === id);
    const colRightOrLeft = right || left;
    if (!colRightOrLeft) return;
    colRightOrLeft.values = values;
  };

  const findValuesByCustomFieldId = (id) => {
    const customFieldsTabTmp = { ...customFieldsTab[`tab-${tabIndex}`] };
    if (!customFieldsTabTmp) return;
    const right = customFieldsTabTmp.right.find(cf => cf.id === id);
    const left = customFieldsTabTmp.left.find(cf => cf.id === id);
    const colRightOrLeft = right || left;
    if (!colRightOrLeft) return;
    return colRightOrLeft.values;
  };

  // Reset CustomFieldsPreview when tab clicked is different from current
  const handleOnTabClick = (tabIndexClicked) => {
    if (tabIndexClicked !== tabIndex) {
      setSelectedCustomFieldSettings({ idSelectedCustomField: null, selectedCustomField: null, values: null, setValues: null, selfValues: null });
    }
  }

  const handleChangeSelectedTabName = (e) => {
    setTabName(e.target.value);
    const tabsTmp = [...tabs];
    tabsTmp[tabIndex].name = e.target.value;
    setTabs(tabsTmp);
    if (!isEmpty(customFieldsTab)) {
      const customFieldsTabTmp = { ...customFieldsTab };
      customFieldsTabTmp['tab-' + tabIndex].info.name = e.target.value;
      setCustomFieldsTab(customFieldsTabTmp);
    }
  };

  useEffect(() => {
    if (!isEmpty(tabs)) return;
    if (!isEmpty(props.customFieldsTab) && !isLoaded.current) {
      setTabsOnLoad();
    }
  }, [props.customFieldsTab]);

  let isLoaded = useRef(false);

  const setTabsOnLoad = () => {
    let _tabs = Object.keys(props.customFieldsTab)
      .map(key => ({
        ...props.customFieldsTab[key].info,
        key,
        columns: props.customFieldsTab[key].right.length === 0 ? 1 : 2
      })).filter(val => val !== undefined);
    _tabs.sort((a, b) => a.key.split('-').pop() - b.key.split('-').pop());

    if (!_tabs || !Array.isArray(_tabs) || !_tabs.length) return;
    isLoaded.current = true;
    setTabs(_tabs);
    setTabName(_tabs[0].name);
    setCustomFieldsColumns(Array(_tabs[0].columns).fill(1));
    handleChangeValue('tabLayout', String(_tabs[0].columns));
  };

  return (
    <div className="custom-fields-wrapper">
      {/* Accordions Area */}
      <div name="Expansion Panel" className={classes.root}>
        {/* Custom Controls */}
        <ExpansionPanel>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={classes.heading}>Custom Control</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <div className='custom-controls-wrapper'>
              {customControls.map((column) => (
                <div className='custom-controls-column'>
                  {column.map((customField, ix) => (
                    <center>
                      <div key={`custom-control-${ix}`} className='custom-controls-wrapper__element' onClick={() => handleAddCustomFieldToTab(customField.id, customField.name)}>
                        <div className='custom-controls-icon'>
                          {customField.icon || null}
                        </div>
                        <span>{customField.name}</span>
                      </div>
                    </center>
                  ))}
                </div>
              ))}
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        {/* Tab Properties */}
        <ExpansionPanel>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography className={classes.heading}>Tab Properties</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <div className="tab-properties-wrapper">
              <div className='tab-properties-wrapper__tab-name'>
                <div>
                  <TextField
                    id="standard-name"
                    label="Tab Name"
                    value={tabName}
                    onChange={(e) => tabs.length > 0 ? handleChangeSelectedTabName(e) : null}
                    margin="normal"
                  />
                  <span field-validator_error style={{ display: 'flex', justifyContent: 'start', width: '90%', color: 'red', fontSize: 10 }}>
                    {tabs.length > 0 ? null : 'First add a tab'}
                  </span>
                </div>
                {(tabs.length > 0 && typeof tabName === 'string') && (
                  <Button classes={{ root: classes.deleteButton }} onClick={handleDeleteCFTab} color="secondary" variant="contained">
                    Delete Tab
                  </Button>
                )}
              </div>
              <FormControl
                component="fieldset"
                className={classes.formControl}
              >
                <FormLabel component="legend">Select Tab Layout</FormLabel>
                <RadioGroup
                  aria-label="gender"
                  name="gender2"
                  className='tab-properties-wrapper__tab-layout'
                  value={values.tabLayout}
                  onChange={handleChange("tabLayout")}
                >
                  <FormControlLabel
                    value="1"
                    control={<Radio color="primary" />}
                    label="1 Column"
                    labelPlacement="start"
                  />
                  <FormControlLabel
                    value="2"
                    control={<Radio color="primary" />}
                    label="2 Column"
                    labelPlacement="start"
                  />
                </RadioGroup>
              </FormControl>
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        {/* Field Properties */}
        <ExpansionPanel>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3a-content"
            id="panel3a-header"
          >
            <Typography className={classes.heading}>Field Properties</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <div className="field-properties-wrapper">
              <CustomFieldsSettings settings={selectedCustomFieldSettings} updateCustomFieldProps={handleUpdateCustomFieldProps} />
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
      <div className="custom-fields-wrapper__tab-area">
        <div className=''>
          {/* CF Tab Headers */}
          <Paper style={{ display: 'flex', flexDirection: "row", justifyContent: "space-between" }}>
            <Tabs
              value={tabIndex}
              onChange={handleChangeCFTab}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              {tabs.map((tab, ix) => <Tab key={`CFtab-${ix}`} label={tab.name} onClick={() => handleOnTabClick(ix)} />)}
            </Tabs>
            <div className="add-tab" style={{ alignSelf: 'center' }}>
              <div>
                <Tooltip title="Add Tab">
                  <IconButton onClick={() => setShowNewTabModal(true)} aria-label="Add Tab">
                    <AddIcon />
                  </IconButton>
                </Tooltip>
                <Dialog
                  open={showNewTabModal}
                  onClose={() => setShowNewTabModal(false)}
                  aria-labelledby="form-dialog-title"
                >
                  <DialogContent>
                    <TextField
                      autoFocus
                      margin="dense"
                      id="name"
                      label="New Tab Name"
                      type="text"
                      value={values.newTabName}
                      onChange={handleChange("newTabName")}
                      fullWidth
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => handleAddNewTab(false)} color="primary">
                      Cancel
                    </Button>
                    <Button onClick={() => handleAddNewTab(true)} color="primary">
                      OK
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
            </div>
          </Paper>
          {/* CF Tab Containers */}
          <SwipeableViews
            axis="x"
            index={tabIndex}
            onChangeIndex={handleChangeIndex4}
          >
            {tabs.map((tab, ix) => (
              <TabContainer key={`tabContainer-${ix}`}>
                <div className="drag-drop-custom-fields-wrapper">
                  <DragDropArea
                    tabIndex={tabIndex}
                    customFieldsTab={customFieldsTab}
                    setCustomFieldsTab={setCustomFieldsTab}
                    customFieldsColumns={customFieldsColumns}
                    setCustomFieldSettings={handleSetCustomFieldProps}
                  />
                  {/* {customFieldsColumns.map((col, ix) => (
                  ))} */}
                </div>
              </TabContainer>
            ))}
          </SwipeableViews>
        </div>

        <div className="custom-fields-wrapper__tab-area__header">
        </div>
        <div className="custom-fields-wrapper__tab-area__content">

        </div>
      </div>
    </div>
  )
}

export default CustomFields;