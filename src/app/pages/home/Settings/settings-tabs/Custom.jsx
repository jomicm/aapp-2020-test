/* eslint-disable no-restricted-imports */
import React, { useState, useEffect } from 'react';
import { getDB, postDB, getOneDB, updateDB, deleteDB } from '../../../../crud/api';
import TableComponent from '../../Components/TableComponent';
import ModalLists from './modals/ModalLists';
import ModalConstants from './modals/ModalConstants';
import { useStyles } from './styles';

const listsHeadRows = [
  { id: "name", numeric: false, disablePadding: false, label: "Name" },
  { id: "elements", numeric: true, disablePadding: false, label: "Elements" },
  { id: "creator", numeric: false, disablePadding: false, label: "Creator" },
  { id: "creation_date", numeric: false, disablePadding: false, label: "Creation Date" }
];
const createListRow = (id, name, elements, creator, creation_date) => {
  return { id, name, elements, creator, creation_date };
};

const constantsHeadRows = [
  { id: "name", numeric: false, disablePadding: false, label: "Name" },
  { id: "value", numeric: true, disablePadding: false, label: "Value" },
  { id: "creator", numeric: false, disablePadding: false, label: "Creator" },
  { id: "creation_date", numeric: false, disablePadding: false, label: "Creation Date" }
];
const createConstantRow = (id, name, value, creator, creation_date) => {
  return { id, name, value, creator, creation_date };
};

const collections = {
  settingsLists: {
    id: 'idList',
    modal: 'openListModal',
    name: 'settingsLists'
  },
  settingsConstants: {
    id: 'idConstant',
    modal: 'openConstantModal',
    name: 'settingsConstants'
  }
};

const Custom = props => {
  const [control, setControl] = useState({
    idList: null,
    openListModal: false,
    listRows: [],
    listRowsSelected: [],
    //
    idConstant: null,
    openConstantModal: false,
    constantRows: [],
    constantRowsSelected: [],
  });
  const tableActions = (collectionName) => {
    const collection = collections[collectionName];
    return {
      onAdd() {
        setControl({ ...control, [collection.id]: null, [collection.modal]: true })
      },
      onEdit(id) {
        setControl({ ...control, [collection.id]: id, [collection.modal]: true })
      },
      onDelete(id) {
        if (!id || !Array.isArray(id)) return;
        id.forEach(_id => {
          deleteDB(`${collection.name}/`, _id)
            .then(response => loadInitData(collection.name))
            .catch(error => console.log('Error', error));
        });
      }
    }
  };
  const loadInitData = (collectionNames = ['settingsLists', 'settingsConstants']) => {
      collectionNames =  !Array.isArray(collectionNames) ? [collectionNames] : collectionNames;
      collectionNames.forEach(collectionName => {
        getDB(collectionName)
        .then(response => response.json())
        .then(data => {
          if (collectionName === 'settingsLists') {
            const rows = data.response.map(row => {
              const { _id, name, options } = row;
              return createListRow(_id, name, options.length, 'Admin', '11/03/2020');
            });
            setControl(prev => ({ ...prev, listRows: rows, listRowsSelected: [] }));
          } else if (collectionName === 'settingsConstants') {
            const rows = data.response.map(row => {
              const { _id, name, value } = row;
              return createConstantRow(_id, name, value, 'Admin', '11/03/2020');
            });
            setControl(prev => ({ ...prev, constantRows: rows, constantRowsSelected: [] }));
          }
        })
        .catch(error => console.log('error>', error));
      });
  };
  useEffect(() => {
    loadInitData();
  }, []);

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '50%', height: '500px', paddingRight: '20px' }}>
        <ModalLists
          showModal={control.openListModal}
          setShowModal={(onOff) => setControl({ ...control, openListModal: onOff })}
          reloadTable={() => loadInitData('settingsLists')}
          id={control.idList}
        />
        <TableComponent
          title={'List Management'}
          headRows={listsHeadRows}
          rows={control.listRows}
          onEdit={tableActions('settingsLists').onEdit}
          onAdd={tableActions('settingsLists').onAdd}
          onDelete={tableActions('settingsLists').onDelete}
          onSelect={tableActions('settingsLists').onSelect}
        />
      </div>
      <div style={{ width: '50%', height: '500px', paddingLeft: '20px' }}>
        <ModalConstants
          showModal={control.openConstantModal}
          setShowModal={(onOff) => setControl({ ...control, openConstantModal: onOff })}
          reloadTable={() => loadInitData('settingsConstants')}
          id={control.idConstant}
        />
        <TableComponent
          title={'Constants Management'}
          headRows={constantsHeadRows}
          rows={control.constantRows}
          onEdit={tableActions('settingsConstants').onEdit}
          onAdd={tableActions('settingsConstants').onAdd}
          onDelete={tableActions('settingsConstants').onDelete}
          onSelect={tableActions('settingsConstants').onSelect}
        />
      </div>
    </div>
  );
}

export default Custom;
