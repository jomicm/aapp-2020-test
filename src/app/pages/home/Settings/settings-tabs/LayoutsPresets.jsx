/* eslint-disable no-restricted-imports */
import React, { useState, useEffect } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab
} from "@material-ui/core";
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
  }
};

const LayoutsPresets = props => {
  const [control, setControl] = useState({
    idLayoutEmployee: null,
    openLayoutEmployeesModal: false,
    layoutEmployeesRows: [],
    layoutEmployeesRowsSelected: [],
    //
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
  const loadLayoutsData = (collectionNames = ['settingsLayoutsEmployees']) => {
    // console.log('lets reload')
    collectionNames =  !Array.isArray(collectionNames) ? [collectionNames] : collectionNames;
    collectionNames.forEach(collectionName => {
      getDB(collectionName)
      .then(response => response.json())
      .then(data => {
        if (collectionName === 'settingsLayoutsEmployees') {
          const rows = data.response.map(row => {
            return createLayoutsEmployeeRow(row._id, row.name, 99, 'Admin', '11/03/2020');
          });
          setControl(prev => ({ ...prev, layoutEmployeesRows: rows, layoutEmployeesRowsSelected: [] }));
          // console.log('inside User Profiles', rows)
        }
        // if (collectionName === 'employees') {
        //   const rows = data.response.map(row => {
        //     return createEmployeeRow(row._id, row.name, row.lastName, row.email, row.designation, row.manager, 'Admin', '11/03/2020');
        //   });
        //   setControl(prev => ({ ...prev, usersRows: rows, usersRowsSelected: [] }));
        // }
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
        {/* Locations templates regarding assets */}
        {tab === 1 && (
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
