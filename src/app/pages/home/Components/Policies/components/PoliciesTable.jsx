import React, { useState, useEffect } from 'react';
import { utcToZonedTime } from 'date-fns-tz';
import {
  PortletBody,
} from '../../../../../partials/content/Portlet';
import { deleteDB, getDBComplex, getCountDB } from '../../../../../crud/api';
import TableComponent2 from '../../TableComponent2';
import ModalPolicies from '../modals/ModalPolicies';

const policiesHeadRows = [
  { id: 'name', numeric: false, disablePadding: false, label: 'Name', searchByDisabled: false },
  { id: 'target', numeric: false, disablePadding: false, label: 'Target', searchByDisabled: false },
  { id: 'action', numeric: false, disablePadding: false, label: 'Action', searchByDisabled: false },
  { id: 'type', numeric: false, disablePadding: false, label: 'Type', searchByDisabled: true },
  { id: 'creator', numeric: false, disablePadding: false, label: 'Creator', searchByDisabled: true },
  { id: 'creationDate', numeric: false, disablePadding: false, label: 'Creation Date', searchByDisabled: true }
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

const PoliciesTable = ({ module, baseFields }) => {
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
            .then((response) => loadPoliciesData(collection.name))
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

  const [tableControl, setTableControl] = useState({
    policies: {
      collection: 'employees',
      total: 0,
      page: 0,
      rowsPerPage: 5,
      orderBy: 'policyName',
      order: 1,
      search: '',
      searchBy: '',
    }
  });

  const loadPoliciesData = (collectionNames = ['policies']) => {
    collectionNames = !Array.isArray(collectionNames) ? [collectionNames] : collectionNames;
    collectionNames.forEach(collectionName => {
      let queryLike = '';
      let searchByFiltered = tableControl.policies.searchBy;
      switch (tableControl.policies.searchBy) {
        case "name":
          searchByFiltered = 'policyName'
          break;
        case "target":
          searchByFiltered = 'selectedCatalogue'
          break;
        case "action":
          searchByFiltered = 'selectedAction'
          break;
        default:
          searchByFiltered = searchByFiltered
          break;
      }
      if (collectionName === 'policies') {
        queryLike = tableControl.policies.searchBy ? (
          [{ key: searchByFiltered, value: tableControl.policies.search }]
        ) : (
          ['policyName', 'selectedCatalogue', 'selectedAction'].map(key => ({ key, value: tableControl.policies.search }))
        )
      }
      getCountDB({
        collection: collectionName,
        queryLike: tableControl[collectionName].search ? queryLike : null,
        condition: { "module": { "$eq": module } }
      })
        .then(response => response.json())
        .then(data => {
          setTableControl(prev => ({
            ...prev,
            [collectionName]: {
              ...prev[collectionName],
              total: data.response.count
            }
          }))
        });

      getDBComplex({
        collection: collectionName,
        limit: tableControl[collectionName].rowsPerPage,
        skip: tableControl[collectionName].rowsPerPage * tableControl[collectionName].page,
        sort: [{ key: tableControl[collectionName].orderBy, value: tableControl[collectionName].order }],
        queryLike: tableControl[collectionName].search ? queryLike : null,
        condition: { "module": { "$eq": module } }
      })
        .then(response => response.json())
        .then(data => {
          if (collectionName === 'policies') {
            const rows = data.response.map((row) => {
              const {
                _id,
                apiDisabled,
                messageDisabled,
                notificationDisabled,
                policyName,
                selectedAction,
                selectedCatalogue,
                creationUserFullName,
                creationDate,
              } = row;
              const date = utcToZonedTime(creationDate).toLocaleString();
              const typeString = getTypeString(
                messageDisabled,
                notificationDisabled,
                apiDisabled
              );
              return createPoliciesRow(
                _id,
                policyName,
                selectedCatalogue,
                selectedAction,
                typeString,
                creationUserFullName,
                date
              );
            });
            setControl((prev) => ({
              ...prev,
              policiesRows: rows,
              policiesRowsSelected: []
            }));
          }
        })
        .catch(error => console.log('error>', error));
    });
  };

  useEffect(() => {
    loadPoliciesData();
  }, []);

  useEffect(() => {
    loadPoliciesData('policies');
  }, [tableControl.policies.page, tableControl.policies.rowsPerPage, tableControl.policies.order, tableControl.policies.orderBy, tableControl.policies.search, tableControl.policies.searchBy, tableControl.policies.locationsFilter]);

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
              baseFields={baseFields}
              reloadTable={() => loadPoliciesData('policies')}
              setShowModal={(onOff) =>
                setControl({ ...control, openPoliciesModal: onOff })
              }
              showModal={control.openPoliciesModal}
            />
            <div className='kt-separator kt-separator--dashed' />
            <div className='kt-section__content'>
              <TableComponent2
                controlValues={tableControl.policies}
                headRows={policiesHeadRows}
                onAdd={tableActions('policies').onAdd}
                onDelete={tableActions('policies').onDelete}
                onEdit={tableActions('policies').onEdit}
                onSelect={tableActions('policies').onSelect}
                paginationControl={({ rowsPerPage, page }) =>
                  setTableControl(prev => ({
                    ...prev,
                    policies: {
                      ...prev.policies,
                      rowsPerPage: rowsPerPage,
                      page: page,
                    }
                  }))
                }
                rows={control.policiesRows}
                searchControl={({ value, field }) => {
                  setTableControl(prev => ({
                    ...prev,
                    policies: {
                      ...prev.policies,
                      search: value,
                      searchBy: field,
                    }
                  }))
                }}
                sortByControl={({ orderBy, order }) => {
                  var correctOrderBy = orderBy;
                  switch (orderBy) {
                    case "name":
                      correctOrderBy = 'policyName'
                      break;
                    case "target":
                      correctOrderBy = 'selectedCatalogue'
                      break;
                    case "action":
                      correctOrderBy = 'selectedAction'
                      break;
                    default:
                      correctOrderBy = orderBy
                      break;
                  }
                  setTableControl(prev => ({
                    ...prev,
                    policies: {
                      ...prev.policies,
                      orderBy: correctOrderBy,
                      order: order,
                    }
                  }))
                }}
                title={'Policies List'}
                tileView
              />
            </div>
          </div>
        </div>
      </div>
    </PortletBody>
  );
};

export default PoliciesTable;
