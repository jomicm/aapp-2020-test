/* eslint-disable no-restricted-imports */
import React, { useState, useEffect } from 'react';
import { Tab, Tabs } from "@material-ui/core";
import { getDB, postDB, getOneDB, updateDB, deleteDB } from '../../../../crud/api';
import {
  Portlet,
  PortletBody,
  PortletHeader,
  PortletHeaderToolbar
} from "../../../../partials/content/Portlet";

// App Components
import TableComponent from '../../Components/TableComponent';
import ModalProcessesLive from '../modals/ModalProcessLive.js';
// import ModalLayoutEmployees from './modals/ModalLayoutEmployees';
// import ModalLayoutStages from './modals/ModalLayoutStages';

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
const createLiveProcessesHeadRows = (id, folio, name, type, date, approvals, status, creator, creation_date) => {
  return { id, folio, name, type, date, approvals, status, creator, creation_date };
};
const stagesLayoutsHeadRows = [
  { id: "name", numeric: false, disablePadding: false, label: "Name" },
  { id: "stage", numeric: false, disablePadding: false, label: "Stage" },
  { id: "type", numeric: false, disablePadding: false, label: "Type" },
  { id: "used", numeric: true, disablePadding: false, label: "Used" },
  { id: "creator", numeric: false, disablePadding: false, label: "Creator" },
  { id: "creation_date", numeric: false, disablePadding: false, label: "Creation Date" }
];
const createLayoutsStageRow = (id, name, stage, type, used, creator, creation_date) => {
  return { id, name, stage, type, used, creator, creation_date };
};
const layoutsHeadRows = [
  { id: "name", numeric: false, disablePadding: false, label: "Name" },
  { id: "used", numeric: true, disablePadding: false, label: "Used" },
  { id: "creator", numeric: false, disablePadding: false, label: "Creator" },
  { id: "creation_date", numeric: false, disablePadding: false, label: "Creation Date" }
];
const createLayoutsEmployeeRow = (id, name, used, creator, creation_date) => {
  return { id, name, used, creator, creation_date };
};
const collections = {
  layoutsEmployees: {
    id: 'idLayoutEmployee',
    modal: 'openLayoutEmployeesModal',
    name: 'settingsLayoutsEmployees'
  },
  layoutsStages: {
    id: 'idLayoutStage',
    modal: 'openLayoutStagesModal',
    name: 'settingsLayoutsStages'
  },
  processLive: {
    id: 'idProcessLive',
    modal: 'openProcessLiveModal',
    name: 'processLive'
  }
};

const LiveProcesses = (props) => {
  const [control, setControl] = useState({
    idLayoutEmployee: null,
    openLayoutEmployeesModal: false,
    layoutEmployeesRows: [],
    layoutEmployeesRowsSelected: [],
    //
    idLayoutStage: null,
    openLayoutStagesModal: false,
    layoutStagesRows: [],
    layoutStagesRowsSelected: [],
    //
    idProcessLive: null,
    openProcessLiveModal: false,
    processLiveRows: [],
    ProcessLiveRowsSelected: [],
  });
  const [tab, setTab] = useState(0);
  const tableActions = (collectionName) => {
    const collection = collections[collectionName];
    return {
      onAdd() {
        // console.log('MAIN ON ADD>> ', referencesSelectedId);
        setControl({ ...control, [collection.id]: null, [collection.modal]: true })
      },
      onEdit(id) {
        // console.log('onEdit:', id, collection, collection.id)
        setControl({ ...control, [collection.id]: id, [collection.modal]: true })
      },
      onDelete(id) {
        if (!id || !Array.isArray(id)) return;
        id.forEach(_id => {
          deleteDB(`${collection.name}/`, _id)
            .then(response => loadLayoutsData('processLive'))
            .catch(error => console.log('Error', error));
        });
      },
      onSelect(id) {
        if (collectionName === 'references') {
          // setReferencesSelectedId(id);
        }
      }
    }
  };
  const loadLayoutsData = (collectionNames = ['processLive']) => {
    collectionNames =  !Array.isArray(collectionNames) ? [collectionNames] : collectionNames;
    collectionNames.forEach(collectionName => {
      getDB(collectionName)
      .then(response => response.json())
      .then(data => {
        debugger
        const rows = data.response.map(row => {
          const { _id: id, processData: { name, processStages } } = row;
          return createLiveProcessesHeadRows(id, id.slice(-6), name, 'Type', '12/12/12', 'Approvals', processStages.length, 'Admin', '11/03/2020');
          // return { id, folio, name, type, date, approvals, status, creator, creation_date };
          // return createLayoutsEmployeeRow(row._id, row.name, 99, 'Admin', '11/03/2020');
        });
        setControl(prev => ({ ...prev, processLiveRows: rows, ProcessLiveRowsSelected: [] }));
      })
      .catch(error => console.log('error>', error));
    });
  };

  useEffect(() => {
    loadLayoutsData();
  }, []);

  return (
    <div>
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
                }}
              >
                <Tab label="My Requests" />
                <Tab label="Notifications" />
                <Tab label="Approvals" />
              </Tabs>
            </PortletHeaderToolbar>
          }
        />
        {/* Employees Layout */}
        {tab === 0 && (
          <PortletBody>
            <div className="kt-section kt-margin-t-0">
              <div className="kt-section__body">
                <div className="kt-section">
                  <ModalProcessesLive
                    showModal={control.openProcessLiveModal}
                    setShowModal={(onOff) => setControl({ ...control, openProcessLiveModal: onOff })}
                    reloadTable={() => loadLayoutsData('processLive')}
                    id={control.idProcessLive}
                    // employeeProfileRows={[]}
                  />
                  <div className="kt-section__content">
                    <TableComponent
                      title={'My Processes Requests'}
                      headRows={liveProcessesHeadRows}
                      rows={control.processLiveRows}
                      // rows={[]}
                      onEdit={tableActions('processLive').onEdit}
                      onAdd={tableActions('processLive').onAdd}
                      onDelete={tableActions('processLive').onDelete}
                      onSelect={tableActions('processLive').onSelect}
                    />
                  </div>
                </div>
              </div>
            </div>
          </PortletBody>
        )}
        {/* Process Stages Layouts */}
        {tab === 1 && (
          <PortletBody>
            <div className="kt-section kt-margin-t-0">
              <div className="kt-section__body">
                <div className="kt-section">
                  <div className="kt-section">
                    {/* <ModalLayoutStages
                      showModal={control.openLayoutStagesModal}
                      setShowModal={(onOff) => setControl({ ...control, openLayoutStagesModal: onOff })}
                      reloadTable={() => loadLayoutsData('settingsLayoutsStages')}
                      id={control.idLayoutStage}
                      // employeeProfileRows={[]}
                    /> */}
                    <div className="kt-section__content">
                      <TableComponent
                        title={'Process Notifications'}
                        headRows={stagesLayoutsHeadRows}
                        rows={control.layoutStagesRows}
                        onEdit={tableActions('layoutsStages').onEdit}
                        onAdd={tableActions('layoutsStages').onAdd}
                        onDelete={tableActions('layoutsStages').onDelete}
                        onSelect={tableActions('layoutsStages').onSelect}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </PortletBody>
        )}
        {/* Locations templates regarding assets */}
        {tab === 2 && (
          <PortletBody>
            <div className="kt-section kt-margin-t-0">
              <div className="kt-section__body">
                <div className="kt-section">
                  {/* <ModalLayoutStages
                    showModal={control.openLayoutStagesModal}
                    setShowModal={(onOff) => setControl({ ...control, openLayoutStagesModal: onOff })}
                    reloadTable={() => loadLayoutsData('settingsLayoutsStages')}
                    id={control.idLayoutStage}
                    // employeeProfileRows={[]}
                  /> */}
                  <div className="kt-section__content">
                    <TableComponent
                      title={'Process Approvals'}
                      headRows={stagesLayoutsHeadRows}
                      rows={control.layoutStagesRows}
                      onEdit={tableActions('layoutsStages').onEdit}
                      onAdd={tableActions('layoutsStages').onAdd}
                      onDelete={tableActions('layoutsStages').onDelete}
                      onSelect={tableActions('layoutsStages').onSelect}
                    />
                  </div>
                </div>
              </div>
            </div>
          </PortletBody>
        )}
      </Portlet>
    </div>
  );
}

export default LiveProcesses;
