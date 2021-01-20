import React, { useState, useEffect } from "react";
import {
  Portlet,
  PortletBody,
  PortletHeader,
  PortletHeaderToolbar
} from "../../../../../partials/content/Portlet";
import {
  getDB,
  postDB,
  getOneDB,
  updateDB,
  deleteDB
} from "../../../../../crud/api";
import TableComponent from "../../TableComponent";
import ModalPolicies from "../modals/ModalPolicies";

const policiesHeadRows = [
  { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
  { id: 'target', numeric: false, disablePadding: false, label: 'Target' },
  { id: 'action', numeric: false, disablePadding: false, label: 'Action' },
  { id: 'type', numeric: false, disablePadding: false, label: 'Type' },
  { id: 'creator', numeric: false, disablePadding: false, label: 'Creator' },
  { id: 'creationDate', numeric: false, disablePadding: false, label: 'Creation Date' }
];

const collections = {
  policies: {
    id: 'idPolicies',
    modal: 'openPoliciesModal',
    name: 'policies'
  },
};

const createPoliciesRow = (
  id,
  name,
  target,
  action,
  type,
  creator,
  creationDate
) => {
  return {
    id,
    name,
    target,
    action,
    type,
    creator,
    creationDate
  };
};

const PoliciesTable = ({ module }) => {
  const [control, setControl] = useState({
    idPolicies: null,
    openPoliciesModal: false,
    policiesRows: [],
    policiesRowsSelected: []
  });

  const tableActions = (collectionName) => {
    const collection = collections[collectionName];
    return {
      onAdd() {
        setControl({
          ...control,
          [collection.id]: null,
          [collection.modal]: true,
        });
      },
      onEdit(id) {
        setControl({
          ...control,
          [collection.id]: id,
          [collection.modal]: true,
        });
      },
      onDelete(id) {
        if (!id || !Array.isArray(id)) return;
        id.forEach((_id) => {
          deleteDB(`${collection.name}/`, _id)
            .then((response) => loadInitData(collection.name))
            .catch((error) => console.log('Error', error));
        });
      },
      onSelect(id) {
        if (collectionName === 'references') {
        }
      },
    };
  };

  const getTypeString = (
    messageDisabled,
    notificationDisabled,
    apiDisabled
  ) => {
    const array = [
      ...(!messageDisabled ? ['Message'] : []),
      ...(!notificationDisabled ? ['Notification'] : []),
      ...(!apiDisabled ? ['API'] : [])
    ];
    return array.join(', ');
  };

  const loadInitData = (collectionNames = ['policies']) => {
    collectionNames = !Array.isArray(collectionNames)
      ? [collectionNames]
      : collectionNames;
    collectionNames.forEach((collectionName) => {
      getDB(collectionName)
        .then((response) => response.json())
        .then((data) => {
          if (collectionName === 'policies') {
            const rows = data.response.map((row) => {
              const {
                _id,
                apiDisabled,
                messageDisabled,
                notificationDisabled,
                policyName,
                selectedAction,
                selectedCatalogue
              } = row;
              const typeString = getTypeString(
                apiDisabled,
                messageDisabled,
                notificationDisabled
              );
              return createPoliciesRow(
                _id,
                policyName,
                selectedCatalogue,
                selectedAction,
                typeString,
                'Admin',
                '12/2/2020'
              );
            });
            setControl((prev) => ({
              ...prev,
              policiesRows: rows,
              policiesRowsSelected: []
            }));
          }
        })
        .catch((error) => console.log('error>', error));
    });
  };

  useEffect(() => {
    loadInitData();
  }, []);

  return (
    <PortletBody>
      <div className='kt-section kt-margin-t-0'>
        <div className='kt-section__body'>
          <div className='kt-section'>
            <span className='kt-section__sub'>
              This section will integrate <code>Policies</code>
            </span>
            <ModalPolicies
              id={control.idPolicies}
              employeeProfileRows={[]}
              module={module}
              reloadTable={() => loadInitData('policies')}
              setShowModal={(onOff) =>
                setControl({ ...control, openPoliciesModal: onOff })
              }
              showModal={control.openPoliciesModal}
            />
            <div className='kt-separator kt-separator--dashed' />
            <div className='kt-section__content'>
              <TableComponent
                headRows={policiesHeadRows}
                onAdd={tableActions('policies').onAdd}
                onEdit={tableActions('policies').onEdit}
                onDelete={tableActions('policies').onDelete}
                onSelect={tableActions('policies').onSelect}
                rows={control.policiesRows}
                title={'Policies'}
              />
            </div>
          </div>
        </div>
      </div>
    </PortletBody>
  );
};

export default PoliciesTable;
