import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { utcToZonedTime } from 'date-fns-tz';
import { actions } from '../../../../store/ducks/general.duck';
import { getDB, deleteDB } from '../../../../crud/api';
import TableComponent from '../../Components/TableComponent';
import ModalGroups from './modals/ModalGroups';

const Groups = ({ permissions }) => {
  const dispatch = useDispatch();
  const { showCustomAlert, showErrorAlert, showSavedAlert, showUpdatedAlert } = actions;
  const [control, setControl] = useState({
    idGroup: null,
    rows: [],
    rowsSelected: [],
    showModal: false
  });

  const headRows = [
    { id: "name", numeric: false, disablePadding: false, label: "Name" },
    { id: "numberOfMembers", numeric: false, disablePadding: false, label: "Number of members" },
    { id: "creator", numeric: false, disablePadding: false, label: "Creator" },
    { id: "creation_date", numeric: false, disablePadding: false, label: "Creation Date" }
  ];

  const createGroupRow = (id, name, numberOfMembers, creator, creation_date) => {
    return { id, name, numberOfMembers, creator, creation_date };
  };

  const tableActions = () => {
    return {
      onAdd() {
        setControl({ ...control, idGroup: null, showModal: true });
      },
      onEdit(id) {
        setControl({ ...control, idGroup: id, showModal: true });
      },
      onDelete(id) {
        if (!id || !Array.isArray(id)) return;
        id.forEach(_id => {
          deleteDB('settingsGroups/', _id)
            .then(response => loadInitData())
            .catch(error => console.log('Error', error));
        });
      },
      onselect(id) { }
    };
  };

  const loadInitData = () => {
    getDB('settingsGroups')
      .then((response) => response.json())
      .then((data) => {
        const rows = data.response.map((row) => {
          const { _id, name, numberOfMembers, creationDate, creationUserFullName } = row;
          const date = utcToZonedTime(creationDate).toLocaleString();
          return createGroupRow(_id, name, numberOfMembers, creationUserFullName, date);
        });
        setControl(prev => ({ ...prev, rows, rowsSelected: [] }));
      })
      .catch((error) => dispatch(showErrorAlert()))
  };

  useEffect(() => {
    loadInitData();
  }, []);

  return (
    <>
      <div className="kt-section__content">
        <ModalGroups
          employeeProfileRows={[]}
          id={control.idGroup}
          groups={control.rows}
          reloadTable={() => loadInitData()}
          setGroups={(newGroups) => setControl({ ...control, rows: newGroups })}
          setShowModal={(onOff) => setControl({ ...control, showModal: onOff })}
          showModal={control.showModal}
        />
        <TableComponent
          headRows={headRows}
          onAdd={tableActions().onAdd}
          onDelete={tableActions().onDelete}
          onEdit={tableActions().onEdit}
          onSelect={tableActions().onSelect}
          rows={control.rows}
          title="Groups"
        />
      </div>
    </>
  )
}

export default Groups;
