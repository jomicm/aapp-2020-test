/* eslint-disable no-restricted-imports */
import React, { useState, useEffect } from 'react';
import { utcToZonedTime } from 'date-fns-tz';
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
import ModalLayoutEmployees from './modals/ModalLayoutEmployees';
import ModalLayoutStages from './modals/ModalLayoutStages';

const stagesLayoutsHeadRows = [
  { id: "name", numeric: false, disablePadding: false, label: "Name" },
  { id: "stage", numeric: false, disablePadding: false, label: "Stage" },
  { id: "type", numeric: false, disablePadding: false, label: "Type" },
  { id: "used", numeric: true, disablePadding: false, label: "Used" },
  { id: "creator", numeric: false, disablePadding: false, label: "Creator" },
  { id: "creationDate", numeric: false, disablePadding: false, label: "Creation Date" },
  { id: "updateDate", numeric: false, disablePadding: false, label: "Update Date" }
];
const createLayoutsStageRow = (id, name, stage, type, used, creator, creation_date) => {
  return { id, name, stage, type, used, creator, creation_date };
};
const layoutsHeadRows = [
  { id: "name", numeric: false, disablePadding: false, label: "Name" },
  { id: "used", numeric: true, disablePadding: false, label: "Used" },
  { id: "creator", numeric: false, disablePadding: false, label: "Creator" },
  { id: "creationDate", numeric: false, disablePadding: false, label: "Creation Date" },
  { id: "updateDate", numeric: false, disablePadding: false, label: "Update Date" }
];
const createLayoutsEmployeeRow = (id, name, used, creator, creationDate, updateDate) => {
  return { id, name, used, creator, creationDate, updateDate };
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
  }
};

const LayoutsPresets = props => {
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

        if (collection.name === 'settingsLayoutsEmployees') {
          getDB('employees')
            .then((response) => response.json())
            .then((data) => {
              const employees = data.response.map(({ _id, layoutSelected }) => {
                if (layoutSelected && typeof layoutSelected === 'object') {
                  if (id.includes(layoutSelected.value)) {
                    return _id;
                  }
                }
              }) || [];
              console.log(employees);
              employees.forEach(({ employeeId }) => {
                updateDB('employees/', { layoutSelected: null }, employeeId)
                  .catch((error) => console.log(error));
              });
            })
            .catch((error) => console.log(error));
        }

        id.forEach(_id => {
          deleteDB(`${collection.name}/`, _id)
            .then(response => loadLayoutsData('settingsLayoutsEmployees'))
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
  const loadLayoutsData = (collectionNames = ['settingsLayoutsEmployees', 'settingsLayoutsStages']) => {
    collectionNames =  !Array.isArray(collectionNames) ? [collectionNames] : collectionNames;
    collectionNames.forEach(collectionName => {
      getDB(collectionName)
      .then(response => response.json())
      .then(data => {
        if (collectionName === 'settingsLayoutsEmployees') {
          const rows = data.response.map(row => {
            const date = String(new Date(row.creationDate)).split('GMT')[0];
            const uptDate = String(new Date(row.updateDate)).split('GMT')[0];
            console.log(row);
            return createLayoutsEmployeeRow(row._id, row.name, row.used, row.creationUserFullName, date, uptDate);
          });
          setControl(prev => ({ ...prev, layoutEmployeesRows: rows, layoutEmployeesRowsSelected: [] }));
        }
        if (collectionName === 'settingsLayoutsStages') {
          const rows = data.response.map(row => {
            const date = String(new Date(row.creationDate)).split('GMT')[0];
            const uptDate = String(new Date(row.updateDate)).split('GMT')[0];
            return createLayoutsStageRow(row._id, row.name, row.stageName, 99, row.creationUserFullName, date, uptDate);
          });
          setControl(prev => ({ ...prev, layoutStagesRows: rows, layoutStagesRowsSelected: [] }));
        }
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
                <Tab label="Employees" />
                <Tab label="Stage Layouts" />
                {/* <Tab label="Assets in Locations" /> */}
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
                  <ModalLayoutEmployees
                    showModal={control.openLayoutEmployeesModal}
                    setShowModal={(onOff) => setControl({ ...control, openLayoutEmployeesModal: onOff })}
                    reloadTable={() => loadLayoutsData('settingsLayoutsEmployees')}
                    id={control.idLayoutEmployee}
                    employeeProfileRows={[]}
                  />
                  <div className="kt-section__content">
                    <TableComponent
                      title={'Employee List'}
                      headRows={layoutsHeadRows}
                      rows={control.layoutEmployeesRows}
                      onEdit={tableActions('layoutsEmployees').onEdit}
                      onAdd={tableActions('layoutsEmployees').onAdd}
                      onDelete={tableActions('layoutsEmployees').onDelete}
                      onSelect={tableActions('layoutsEmployees').onSelect}
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
                    <ModalLayoutStages
                      showModal={control.openLayoutStagesModal}
                      setShowModal={(onOff) => setControl({ ...control, openLayoutStagesModal: onOff })}
                      reloadTable={() => loadLayoutsData('settingsLayoutsStages')}
                      id={control.idLayoutStage}
                      // employeeProfileRows={[]}
                    />
                    <div className="kt-section__content">
                      <TableComponent
                        title={'Stage Layouts List'}
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
                  <h1>Assets in Locations</h1>    
                </div>
              </div>
            </div>
          </PortletBody>
        )}
      </Portlet>
    </div>
  );
}

export default LayoutsPresets;
