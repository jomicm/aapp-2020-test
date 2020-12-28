/* eslint-disable no-restricted-imports */
import React, { useMemo, useState, useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Formik, setNestedObjectValues } from "formik";
import { get, merge, isEmpty } from "lodash";
import { FormHelperText, Switch, Tab, Tabs, Styles } from "@material-ui/core";
import clsx from "clsx";
import { metronic, initLayoutConfig, LayoutConfig } from "../../../../_metronic";
import {
  Portlet,
  PortletBody,
  PortletFooter,
  PortletHeader,
  PortletHeaderToolbar
} from "../../../partials/content/Portlet";
import { CodeBlock } from "../../../partials/content/CodeExample";
import Notice from "../../../partials/content/Notice";

import CodeExample from '../../../partials/content/CodeExample';

import {
  makeStyles,
  lighten,
  withStyles,
  useTheme
} from "@material-ui/core/styles";
import {
  Checkbox,
  Card,
  CardHeader,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Divider,
} from "@material-ui/core";

// AApp Components
import TableComponent from '../Components/TableComponent';
import ModalProcessStages from './modals/ModalProcessStages';
import Autocomplete from '../Components/Inputs/Autocomplete';
import ModalProcesses from './modals/ModalProcesses';

import TreeView from '../Components/TreeViewComponent';
// import GoogleMaps from '../Components/GoogleMaps';
// import './Assets.scss';

//Icons
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from '@material-ui/icons/Delete';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';


//DB API methods
import { getDB, deleteDB } from '../../../crud/api';
import ModalYesNo from '../Components/ModalYesNo';


const localStorageActiveTabKey = "builderActiveTab";
export default function Processes() {

  const activeTab = localStorage.getItem(localStorageActiveTabKey);
  const [tab, setTab] = useState(activeTab ? +activeTab : 0);
  const dispatch = useDispatch();
  const { layoutConfig } = useSelector(
    ({ builder }) => ({ layoutConfig: builder.layoutConfig }),
    shallowEqual
  );
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [loadingButtonPreviewStyle, setLoadingButtonPreviewStyle] = useState({
    paddingRight: "2.5rem"
  });
  const [loadingReset, setLoadingReset] = useState(false);
  const [loadingButtonResetStyle, setLoadingButtonResetStyle] = useState({
    paddingRight: "2.5rem"
  });

  const enableLoadingPreview = () => {
    setLoadingPreview(true);
    setLoadingButtonPreviewStyle({ paddingRight: "3.5rem" });
  };
  const enableLoadingReset = () => {
    setLoadingReset(true);
    setLoadingButtonResetStyle({ paddingRight: "3.5rem" });
  };
  const updateLayoutConfig = _config => {
    dispatch(metronic.builder.actions.setLayoutConfigs(_config));
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const initialValues = useMemo(
    () =>
      merge(
        // Fulfill changeable fields.
        LayoutConfig,
        layoutConfig
      ),
    [layoutConfig]
  );

  const createProcessStageRow = (id, name, fn, type, custom, notification, creator, creation_date) => {
    return { id, name, function: fn, type, custom, notification, creator, creation_date };
  };
  const createProcessRow = (id, name, numberOfStages, creator, creation_date) => {
    return { id, name, numberOfStages, creator, creation_date };
  };
  // const createUserProfilesRow = (id, name, creator, creation_date) => {
  //   return { id, name, creator, creation_date };
  // };

  // const employeeProfilesHeadRows = [
  //   // { id: "id", numeric: true, disablePadding: false, label: "ID" },
  //   { id: "name", numeric: false, disablePadding: false, label: "Name" },
  //   { id: "creator", numeric: false, disablePadding: false, label: "Creator" },
  //   { id: "creation_date", numeric: false, disablePadding: false, label: "Creation Date" }
  // ];

  const processStagesHeadRows = [
    { id: "name", numeric: false, disablePadding: false, label: "Name" },
    { id: "function", numeric: false, disablePadding: false, label: "Function" },
    { id: "type", numeric: false, disablePadding: false, label: "Type" },
    { id: "custom", numeric: false, disablePadding: false, label: "Custom" },
    { id: "notification", numeric: false, disablePadding: false, label: "Notification" },
    { id: "creator", numeric: false, disablePadding: false, label: "Creator" },
    { id: "creation_date", numeric: false, disablePadding: false, label: "Creation Date" }
  ];

  const liveProcessesHeadRows = [
    { id: "folio", numeric: false, disablePadding: false, label: "Folio" },
    { id: "name", numeric: false, disablePadding: false, label: "Name" },
    { id: "type", numeric: false, disablePadding: false, label: "Type" },
    { id: "date", numeric: false, disablePadding: false, label: "Date" },
    { id: "approvals", numeric: false, disablePadding: false, label: "Approvals" },
    { id: "status", numeric: false, disablePadding: false, label: "Status" },
    { id: "creator", numeric: false, disablePadding: false, label: "Creator" },
    { id: "creation_date", numeric: false, disablePadding: false, label: "Creation Date" }
  ];
 
  const createEmployeeRow = (id, name, lastName, email, designation, manager, creator, creation_date) => {
    return { id, name, lastName, email, designation, manager, creator, creation_date };
  };

  const processesHeadRows = [
    { id: "name", numeric: false, disablePadding: false, label: "Name" },
    { id: "numberOfStages", numeric: false, disablePadding: false, label: "Number of Stages" },
    { id: "creator", numeric: false, disablePadding: false, label: "Creator" },
    { id: "creation_date", numeric: false, disablePadding: false, label: "Creation Date" }
  ];

  const loadProcessesData = (collectionNames = ['processStages', 'processes']) => {
    // console.log('lets reload')
    collectionNames =  !Array.isArray(collectionNames) ? [collectionNames] : collectionNames;
    collectionNames.forEach(collectionName => {
      getDB(collectionName)
      .then(response => response.json())
      .then(data => {
        if (collectionName === 'processStages') {
          // console.log('User Profiles id:', data)
          const rows = data.response.map(row => {
            const { functions, selectedFunction, types, selectedType, customFieldTabs } = row;
            const isCustom = String(!isEmpty(customFieldTabs)).toUpperCase();
            return createProcessStageRow(row._id, row.name, functions[selectedFunction], types[selectedType], isCustom, 'FALSE', 'Admin', '11/03/2020');
          });
          setControl(prev => ({ ...prev, processStagesRows: rows, processStagesRowsSelected: [] }));
        }
        if (collectionName === 'processes') {
          const rows = data.response.map(row => {
            return createProcessRow(row._id, row.name, row.processStages.length || 'N/A', 'Admin', '11/03/2020');
          });
          setControl(prev => ({ ...prev, processRows: rows, processRowsSelected: [] }));
         }
        }
      )
      .catch(error => console.log('error>', error));
    });
  };

  useEffect(() => {
    loadProcessesData();
  }, []);

  const [control, setControl] = useState({
    idProcessStage: null,
    openProcessStagesModal: false,
    processStagesRows: [],
    processStagesRowsSelected: [],
    //
    idProcess: null,
    openProcessModal: false,
    processRows: [],
    processRowsSelected: []
  });

  const [referencesSelectedId, setReferencesSelectedId] = useState(null);
  const [selectReferenceConfirmation, setSelectReferenceConfirmation] = useState(false);
  const collections = {
    processStages: {
      id: 'idProcessStage',
      modal: 'openProcessStagesModal',
      name: 'processStages'
    },
    processes: {
      id: 'idProcess',
      modal: 'openProcessModal',
      name: 'processes'
    }
  };

  const tableActions = (collectionName) => {
    // return;
    const collection = collections[collectionName];
    return {
      onAdd() {
        console.log('MAIN ON ADD>> ', referencesSelectedId);
        setControl({ ...control, [collection.id]: null, [collection.modal]: true })
      },
      onEdit(id) {
        console.log('onEdit:', id, collection, collection.id)
        setControl({ ...control, [collection.id]: id, [collection.modal]: true })
      },
      onDelete(id) {
        if (!id || !Array.isArray(id)) return;
        id.forEach(_id => {
          deleteDB(`${collection.name}/`, _id)
            .then(response => loadProcessesData('processStages'))
            .catch(error => console.log('Error', error));
        });
        loadProcessesData(collection.name);
      },
      onSelect(id) {
        if (collectionName === 'references') {
          setReferencesSelectedId(id);
        }
      }
    }
  };

  return (
    <>
      <ModalYesNo
        showModal={selectReferenceConfirmation}
        onOK={() => setSelectReferenceConfirmation(false)}
        onCancel={() => setSelectReferenceConfirmation(false)}
        title={'Add New Asset'}
        message={'Please first select a Reference from the next tab'}
      />
      <Formik
        initialValues={initialValues}
        onSubmit={values => {
          enableLoadingPreview();
          updateLayoutConfig(values);
        }}
        onReset={() => {
          enableLoadingReset();
          updateLayoutConfig(initLayoutConfig);
        }}
      >
        {({ values, handleReset, handleSubmit, handleChange, handleBlur }) => (
          <div className="kt-form kt-form--label-right">
            <Portlet>
              <PortletHeader
                toolbar={
                  <PortletHeaderToolbar>
                    <Tabs
                      component="div"
                      className="builder-tabs"
                      value={tab}
                      onChange={(_, nextTab) => {
                        setTab(nextTab);
                        localStorage.setItem(localStorageActiveTabKey, nextTab);
                      }}
                    >
                      <Tab label="List" />
                      <Tab label="Stages" />
                      <Tab label="Live" />
                    </Tabs>
                  </PortletHeaderToolbar>
                }
              />

              {tab === 0 && (
                <PortletBody>
                  <div className="kt-section kt-margin-t-0">
                    <div className="kt-section__body">
                      <div className="kt-section">
                          <span className="kt-section__sub">
                            This section will integrate <code>Processes List</code>
                          </span>
                          <ModalProcesses
                            showModal={control.openProcessModal}
                            setShowModal={(onOff) => setControl({ ...control, openProcessModal: onOff })}
                            reloadTable={() => loadProcessesData('processes')}
                            id={control.idProcess}
                            // employeeProfileRows={control.employeeProfilesRows}
                            // employeeProfileRows={control.employeeProfilesRows}
                            // categoryRows={control.usersRows}
                            // referencesSelectedId={ referencesSelectedId}
                          />
                          <div className="kt-separator kt-separator--dashed"/>
                          <div className="kt-section__content">
                            <TableComponent
                              title={'Processes List'}
                              headRows={processesHeadRows}
                              rows={control.processRows}
                              onEdit={tableActions('processes').onEdit}
                              onAdd={tableActions('processes').onAdd}
                              onDelete={tableActions('processes').onDelete}
                              onSelect={tableActions('processes').onSelect}
                            />
                          </div>
                        </div>
                    </div>
                  </div>
                </PortletBody>
              )}

              {tab === 1 && (
                <PortletBody>
                  <div className="kt-section kt-margin-t-0">
                    <div className="kt-section__body">
                      <div className="kt-section">
                          <span className="kt-section__sub">
                            This section will integrate <code>Processes Stages List</code>
                          </span>
                            <ModalProcessStages
                              showModal={control.openProcessStagesModal}
                              setShowModal={(onOff) => setControl({ ...control, openProcessStagesModal: onOff })}
                              reloadTable={() => loadProcessesData('processStages')}
                              id={control.idProcessStage}
                              // categoryRows={control.categoryRows}
                            />
                            <div className="kt-separator kt-separator--dashed"/>
                            <div className="kt-section__content">
                              <TableComponent
                                title={'Process Stages'}
                                headRows={processStagesHeadRows}
                                rows={control.processStagesRows}
                                onAdd={tableActions('processStages').onAdd}
                                onDelete={tableActions('processStages').onDelete}
                                onEdit={tableActions('processStages').onEdit}
                                onSelect={tableActions('processStages').onSelect}
                              />
                            </div>
                        </div>
                    </div>
                  </div>
                </PortletBody>
              )}

              {tab === 2 && (
                <PortletBody>
                  <div className="kt-section kt-margin-t-0">
                    <div className="kt-section__body">
                      <div className="kt-section">
                          <span className="kt-section__sub">
                            This section will integrate <code>Live Processes</code>
                          </span>
                          <div className="kt-separator kt-separator--dashed"/>
                          <div className="kt-section__content">
                              <TableComponent
                                title={'Live Processes'}
                                headRows={liveProcessesHeadRows}
                                rows={control.employeeProfilesRows}
                                onAdd={tableActions('employeeProfiles').onAdd}
                                onDelete={tableActions('employeeProfiles').onDelete}
                                onEdit={tableActions('employeeProfiles').onEdit}
                                onSelect={tableActions('employeeProfiles').onSelect}
                              />
                            </div>
                        </div>
                    </div>
                  </div>
                </PortletBody>
              )}

              <PortletFooter>
                <div className="kt-padding-30 text-center">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    style={loadingButtonPreviewStyle}
                    className={`btn btn-primary btn-elevate kt-login__btn-primary ${clsx(
                      {
                        "kt-spinner kt-spinner--right kt-spinner--md kt-spinner--light": loadingPreview
                      }
                    )}`}
                  >
                    <i className="la la-eye" /> Preview
                  </button>{" "}
                  <button
                    type="button"
                    onClick={handleReset}
                    style={loadingButtonResetStyle}
                    className={`btn btn-secondary btn-elevate kt-login__btn-primary ${clsx(
                      {
                        "kt-spinner kt-spinner--right kt-spinner--md kt-spinner--dark": loadingReset
                      }
                    )}`}
                  >
                    <i className="la la-recycle" /> Reset
                  </button>
                </div>
              </PortletFooter>
            </Portlet>

          </div>
        )}
      </Formik>
    </>
  );
}
