/* eslint-disable no-restricted-imports */
import React, { useMemo, useState, useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";
import { merge, isEmpty } from "lodash";
import { Tabs } from "@material-ui/core";
import { metronic, initLayoutConfig, LayoutConfig } from "../../../../_metronic";
import {
  Portlet,
  PortletBody,
  PortletHeader,
  PortletHeaderToolbar
} from "../../../partials/content/Portlet";

// AApp Components
import { TabsTitles } from '../Components/Translations/tabsTitles';
//DB API methods
import { getDB, deleteDB } from '../../../crud/api';
import ModalYesNo from '../Components/ModalYesNo';

// Settings Tabs
import {
  General,
  Design,
  LayoutsPresets,
  Fields,
  Custom,
  Users,
  Processes
} from './settings-tabs';

export default function Settings() {
  const [tab, setTab] = useState(0);
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

  const loadProcessesData = (collectionNames = ['processStages']) => {
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
        // if (collectionName === 'employees') {
        //   const rows = data.response.map(row => {
        //     return createEmployeeRow(row._id, row.name, row.lastName, row.email, row.designation, row.manager, 'Admin', '11/03/2020');
        //   });
        //   setControl(prev => ({ ...prev, usersRows: rows, usersRowsSelected: [] }));
        //  }
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
    processRowsSelected: [],
    //
    idUser: null,
    openUsersModal: false,
    usersRows: [],
    usersRowsSelected: [],
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
      id: 'idProcesses',
      modal: 'openProcessModal',
      name: 'processes'
    }
    // employees: {
    //   id: 'idEmployee',
    //   modal: 'openEmployeesModal',
    //   name: 'employees'
    // },
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
                      onChange={(_, nextTab) => setTab(nextTab)}
                    >
                      {TabsTitles('settings')}
                    </Tabs>
                  </PortletHeaderToolbar>
                }
              />
              {/* Settings - General Tab */}
              {tab === 0 && (
                <PortletBody>
                  <div className="kt-section kt-margin-t-0">
                    <div className="kt-section__body">
                      <div className="kt-section">
                        <div className="kt-section__content">
                          <General />
                        </div>
                      </div>
                    </div>
                  </div>
                </PortletBody>
              )}
              {/* Settings - Design Tab */}
              {tab === 1 && (
                <PortletBody>
                  <div className="kt-section kt-margin-t-0">
                    <div className="kt-section__body">
                      <div className="kt-section">
                        <div className="kt-section__content">
                          <Design />
                        </div>
                      </div>
                    </div>
                  </div>
                </PortletBody>
              )}
              {/* Settings - Layouts&Presets Tab */}
              {tab === 2 && (
                <PortletBody>
                  <div className="kt-section kt-margin-t-0">
                    <div className="kt-section__body">
                      <div className="kt-section">
                        <div className="kt-section__content">
                          <LayoutsPresets />
                        </div>
                      </div>
                    </div>
                  </div>
                </PortletBody>
              )}
              {/* Settings - Fields Tab */}
              {tab === 3 && (
                <PortletBody>
                  <div className="kt-section kt-margin-t-0">
                    <div className="kt-section__body">
                      <div className="kt-section">
                        <div className="kt-section__content">
                          <Fields />
                        </div>
                      </div>
                    </div>
                  </div>
                </PortletBody>
              )}
              {/* Settings - Custom Tab */}
              {tab === 4 && (
                <PortletBody>
                  <div className="kt-section kt-margin-t-0">
                    <div className="kt-section__body">
                      <div className="kt-section">
                        <div className="kt-section__content">
                          <Custom />
                        </div>
                      </div>
                    </div>
                  </div>
                </PortletBody>
              )}
              {/* Settings - Users Tab */}
              {tab === 5 && (
                <PortletBody>
                  <div className="kt-section kt-margin-t-0">
                    <div className="kt-section__body">
                      <div className="kt-section">
                        <div className="kt-section__content">
                          <Users />
                        </div>
                      </div>
                    </div>
                  </div>
                </PortletBody>
              )}
              {/* Settings - Processes Tab */}
              {tab === 6 && (
                <PortletBody>
                  <div className="kt-section kt-margin-t-0">
                    <div className="kt-section__body">
                      <div className="kt-section">
                        <div className="kt-section__content">
                          <Processes />
                        </div>
                      </div>
                    </div>
                  </div>
                </PortletBody>
              )}
            </Portlet>
          </div>
        )}
      </Formik>
    </>
  );
}
