/* eslint-disable no-restricted-imports */
import React, { useEffect, useState } from 'react';
import { utcToZonedTime } from 'date-fns-tz';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab
} from "@material-ui/core";
import {
  Portlet,
  PortletBody,
  PortletHeader,
  PortletHeaderToolbar
} from "../../../../partials/content/Portlet";
import { getDB, postDB, getOneDB, updateDB, deleteDB } from '../../../../crud/api';
import { getFirstDocCollection } from '../../utils';
import { useStyles } from './styles';

// App Component
import TableComponent from '../../Components/TableComponent';
import ModalAssetsSpecialists from './modals/ModalAssetsSpecialists';
import ModalWitnesses from './modals/ModalWitnesses';

const witnessesHeadRows = [
  { id: "description", numeric: false, disablePadding: false, label: "Description" },
  { id: "user", numeric: true, disablePadding: false, label: "User" },
  { id: "location", numeric: false, disablePadding: false, label: "Location" },
  { id: "creator", numeric: false, disablePadding: false, label: "Creator" },
  { id: "creation_date", numeric: false, disablePadding: false, label: "Creation Date" }
];
const specialistsHeadRows = [
  { id: "category", numeric: false, disablePadding: false, label: "Category" },
  { id: "user", numeric: true, disablePadding: false, label: "User" },
  { id: "location", numeric: false, disablePadding: false, label: "Location" },
  { id: "creator", numeric: false, disablePadding: false, label: "Creator" },
  { id: "creation_date", numeric: false, disablePadding: false, label: "Creation Date" }
];
const collections = {
  settingsAssetSpecialists: {
    id: 'idAssetSpecialist',
    modal: 'openAssetSpecialistModal',
    name: 'settingsAssetSpecialists'
  },
  settingsWitnesses: {
    id: 'idWitnesses',
    modal: 'openWitnessesModal',
    name: 'settingsWitnesses'
  }
};
const createAssetSpecialistRow = (id, category, user, location, creator, creation_date) => {
  return { id, category, user, location, creator, creation_date };
};
const createWitnessesRow = (id, description, user, location, creator, creation_date) => {
  return { id, description, user, location, creator, creation_date };
};

const Users = props => {
  const classes = useStyles();
  const [control, setControl] = useState({
    idAssetSpecialist: null,
    openAssetSpecialistModal: false,
    assetSpecialistRows: [],
    assetSpecialistRowsSelected: [],
    //
    idWitnesses: null,
    openWitnessesModal: false,
    witnessesRows: [],
    witnessesRowsSelected: [],
  });
  const [tab, setTab] = useState(0);
  const [locationsTree, setLocationsTree] = useState({})
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
            .then(response => loadInitData(collection.name))
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

  let locations;

  const locationsTreeData = {
    id: 'root',
    name: 'Locations',
    profileLevel: -1,
    parent: null
  };

  const constructLocationTreeRecursive = (locs) => {
    if (!locs || !Array.isArray(locs) || !locs.length) return [];
    let res = [];
    locs.forEach((location) => {
      const locObj = (({_id: id, name, profileLevel, parent}) => ({id, name, profileLevel, parent}))(location);
      const children = locations.filter(loc => loc.parent === locObj.id);
      locObj.children = constructLocationTreeRecursive(children);
      res.push(locObj);
    });
    return res;
  };

  const loadInitData = (collectionNames = ['settingsAssetSpecialists', 'settingsWitnesses', 'locationsReal']) => {
    // const loadInitData = (collectionNames = ['settingsAssetSpecialists']) => {
    collectionNames = !Array.isArray(collectionNames) ? [collectionNames] : collectionNames;
    collectionNames.forEach(collectionName => {
      getDB(collectionName)
        .then(response => response.json())
        .then(data => {
          if (collectionName === 'settingsAssetSpecialists') {
            console.log(data.response);
            const rows = data.response.map(row => {
              const { _id, categorySelected: { label: category }, userSelected: { label: user }, location: { locationName } } = row;
              const date = utcToZonedTime(row.creationDate).toLocaleString();
              return createAssetSpecialistRow(_id, category, user, locationName, row.creationUserFullName, date);
            });
            setControl(prev => ({ ...prev, assetSpecialistRows: rows, assetSpecialistRowsSelected: [] }));
          } else if (collectionName === 'settingsWitnesses') {
            const rows = data.response.map(row => {
              const { _id, description, userSelected: { label: user }, location: { locationName } } = row;
              const date = utcToZonedTime(row.creationDate).toLocaleString();
              // return createWitnessesRow(_id, category, user, locationName, 'Admin', '11/03/2020');
              return createWitnessesRow(_id, description, user, locationName, row.creationUserFullName, date);
            });
            setControl(prev => ({ ...prev, witnessesRows: rows, witnessesRowsSelected: [] }));
          } else if (collectionName === 'locationsReal') {
            locations = data.response.map(res => ({ ...res, id: res._id }));
            const homeLocations = data.response.filter(loc => loc.profileLevel === 0);
            const children = constructLocationTreeRecursive(homeLocations);
            locationsTreeData.children = children;
            setLocationsTree(locationsTreeData);
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
    loadInitData();
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
                <Tab label="Asset Specialist" />
                <Tab label="Witnesses" />
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
                  <ModalAssetsSpecialists
                    showModal={control.openAssetSpecialistModal}
                    setShowModal={(onOff) => setControl({ ...control, openAssetSpecialistModal: onOff })}
                    reloadTable={() => loadInitData('settingsAssetSpecialists')}
                    id={control.idAssetSpecialist}
                    employeeProfileRows={[]}
                    locationsTree={locationsTree}
                  />
                  <div className="kt-section__content">
                    <TableComponent
                      title={'Specialists'}
                      headRows={specialistsHeadRows}
                      rows={control.assetSpecialistRows}
                      onEdit={tableActions('settingsAssetSpecialists').onEdit}
                      onAdd={tableActions('settingsAssetSpecialists').onAdd}
                      onDelete={tableActions('settingsAssetSpecialists').onDelete}
                      onSelect={tableActions('settingsAssetSpecialists').onSelect}
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
                  <ModalWitnesses
                    showModal={control.openWitnessesModal}
                    setShowModal={(onOff) => setControl({ ...control, openWitnessesModal: onOff })}
                    reloadTable={() => loadInitData('settingsWitnesses')}
                    id={control.idWitnesses}
                    employeeProfileRows={[]}
                    locationsTree={locationsTree}
                  />
                  <div className="kt-section__content">
                    <TableComponent
                      title={'Witnesses'}
                      headRows={witnessesHeadRows}
                      rows={control.witnessesRows}
                      onEdit={tableActions('settingsWitnesses').onEdit}
                      onAdd={tableActions('settingsWitnesses').onAdd}
                      onDelete={tableActions('settingsWitnesses').onDelete}
                      onSelect={tableActions('settingsWitnesses').onSelect}
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

export default Users;
