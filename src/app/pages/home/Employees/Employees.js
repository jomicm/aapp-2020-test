import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";
import { uniq } from 'lodash';
import { utcToZonedTime } from 'date-fns-tz';
import { Tabs } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { actions } from '../../../store/ducks/general.duck';
import {
  Portlet,
  PortletBody,
  PortletHeader,
  PortletHeaderToolbar
} from '../../../partials/content/Portlet';
import { deleteDB, getDBComplex, getCountDB, getDB, getOneDB, updateDB } from '../../../crud/api';
import * as general from "../../../store/ducks/general.duck";
import { executePolicies } from '../Components/Policies/utils';
import TableComponent2 from '../Components/TableComponent2';
import { TabsTitles } from '../Components/Translations/tabsTitles';
import ModalYesNo from '../Components/ModalYesNo';
import Policies from '../Components/Policies/Policies';
import { usePolicies } from '../Components/Policies/hooks';
import ModalEmployees from './modals/ModalEmployees';
import ModalEmployeeProfiles from './modals/ModalEmployeeProfiles';
import { allBaseFields } from '../constants';

const Employees = ({ globalSearch, setGeneralSearch, user }) => {
  const dispatch = useDispatch();
  const { showCustomAlert, showDeletedAlert, showErrorAlert } = actions;
  const [employeeLayoutSelected, setEmployeeLayoutSelected] = useState({});
  const [referencesSelectedId, setReferencesSelectedId] = useState(null);
  const [
    selectReferenceConfirmation,
    setSelectReferenceConfirmation
  ] = useState(false);
  const [tab, setTab] = useState(0);
  const [userLocations, setUserLocations] = useState([]);

  const policiesBaseFields = {
    list: { id: { validationId: 'employeeId', component: 'textField', compLabel: 'ID' }, ...allBaseFields.employees },
    references: { id: { validationId: 'employeeReferenceId', component: 'textField', compLabel: 'ID' }, ...allBaseFields.employeeReferences }
  };

  const { policies, setPolicies } = usePolicies();

  const createUserProfilesRow = (id, name, creator, creationDate, updateDate, fileExt) => {
    return { id, name, creator, creationDate, updateDate, fileExt };
  };

  const employeeProfilesHeadRows = [
    { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
    { id: 'creator', numeric: false, disablePadding: false, label: 'Creator', searchByDisabled: true },
    { id: 'creationDate', numeric: false, disablePadding: false, label: 'Creation Date', searchByDisabled: true },
    { id: 'updateDate', numeric: false, disablePadding: false, label: 'Update Date', searchByDisabled: true }
  ];

  const createEmployeeRow = (
    id,
    name,
    lastName,
    email,
    designation,
    manager,
    creator,
    creationDate,
    updateDate,
    fileExt
  ) => {
    return {
      id,
      name,
      lastName,
      email,
      designation,
      manager,
      creator,
      creationDate,
      updateDate,
      fileExt
    };
  };

  const employeesHeadRows = [
    { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
    { id: 'lastName', numeric: true, disablePadding: false, label: 'Last Name' },
    { id: 'email', numeric: true, disablePadding: false, label: 'Email' },
    { id: 'creator', numeric: false, disablePadding: false, label: 'Creator', searchByDisabled: true },
    { id: 'creationDate', numeric: false, disablePadding: false, label: 'Creation Date', searchByDisabled: true },
    { id: 'updateDate', numeric: false, disablePadding: false, label: 'Update Date', searchByDisabled: true }
  ];

  const [tableControl, setTableControl] = useState({
    employees: {
      collection: 'employees',
      total: 0,
      page: 0,
      rowsPerPage: 5,
      orderBy: 'name',
      order: 1,
      search: '',
      searchBy: '',
    },
    employeeProfiles: {
      collection: 'employeeProfiles',
      total: 0,
      page: 0,
      rowsPerPage: 5,
      orderBy: 'name',
      order: 1,
      search: '',
      searchBy: '',
      locationsFilter: [],
    },
  });

  const locationsRecursive = (data, currentLocation, res) => {
    const children = data.response.filter((e) => e.parent === currentLocation._id);

    if (!children.length) {
      return;
    }

    children.forEach((e) => {
      if (!res.includes(e._id)) {
        res.push(e._id);
      }
    });
    children.forEach((e) => locationsRecursive(data, e, res));
  };

  const loadUserLocations = () => {
    getOneDB('user/', user.id)
      .then((response) => response.json())
      .then((data) => {
        const locationsTable = data.response.locationsTable;
        getDB('locationsReal')
          .then((response) => response.json())
          .then((data) => {
            let res = [];
            locationsTable.forEach((location) => {
              const currentLoc = data.response.find((e) => e._id === location.parent);

              if (!userLocations.includes(currentLoc._id)) {
                res.push(currentLoc._id);
              }

              const children = data.response.filter((e) => e.parent === currentLoc._id);

              if (children.length) {
                children.forEach((e) => res.push(e._id));
                children.forEach((e) => locationsRecursive(data, e, res));
              }
            });
            const resFiltered = uniq(res);
            setUserLocations(resFiltered);
          })
          .catch((error) => dispatch(showErrorAlert()));
      })
      .catch((error) => dispatch(showErrorAlert()));
  };

  const loadEmployeesData = (collectionNames = ['employees', 'employeeProfiles']) => {
    collectionNames = !Array.isArray(collectionNames) ? [collectionNames] : collectionNames;
    collectionNames.forEach(collectionName => {
      let queryLike = '';
      if (collectionName === 'employeeProfiles') {
        queryLike = tableControl.employeeProfiles.searchBy ? (
          [{ key: tableControl.employeeProfiles.searchBy, value: tableControl.employeeProfiles.search }]
        ) : (
          ['name'].map(key => ({ key, value: tableControl.employeeProfiles.search }))
        )
      }
      if (collectionName === 'employees') {
        queryLike = tableControl.employees.searchBy ? (
          [{ key: tableControl.employees.searchBy, value: tableControl.employees.search }]
        ) : (
          ['name', 'lastName', 'email'].map(key => ({ key, value: tableControl.employees.search }))
        )
      }
      getCountDB({
        collection: collectionName,
        queryLike: tableControl[collectionName].search ? queryLike : null
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
        queryLike: tableControl[collectionName].search /* || tableControl['user'].locationsFilter.length */ ? queryLike : null
      })
        .then(response => response.json())
        .then(data => {
          if (collectionName === 'employeeProfiles') {
            const rows = data.response.map((row) => {
              const { _id, name, creationUserFullName, creationDate, updateDate, fileExt } = row;
              const date = String(new Date(creationDate)).split('GMT')[0];
              const uptDate = String(new Date(updateDate)).split('GMT')[0];
              return createUserProfilesRow(
                _id,
                name,
                creationUserFullName,
                date,
                uptDate,
                fileExt
              );
            });
            setControl(prev => ({ ...prev, employeeProfilesRows: rows, employeeProfilesRowsSelected: [] }));
          }
          if (collectionName === 'employees') {
            const rows = data.response.map((row) => {
              const { _id, name, lastName, email, designation, manager, creationUserFullName, creationDate, updateDate, fileExt } = row;
              const date = String(new Date(creationDate)).split('GMT')[0];
              const uptDate = String(new Date(updateDate)).split('GMT')[0];
              return createEmployeeRow(
                _id,
                name,
                lastName,
                email,
                designation,
                manager,
                creationUserFullName,
                date,
                uptDate,
                fileExt
              );
            });
            setControl(prev => ({ ...prev, usersRows: rows, usersRowsSelected: [] }));
          }
        })
        .catch(error => console.log('error>', error));
    });
  };

  useEffect(() => loadUserLocations(), []);

  useEffect(() => {
    loadEmployeesData('employees');
  }, [tableControl.employees.page, tableControl.employees.rowsPerPage, tableControl.employees.order, tableControl.employees.orderBy, tableControl.employees.search, tableControl.employees.locationsFilter]);

  useEffect(() => {
    loadEmployeesData('employeeProfiles');
  }, [tableControl.employeeProfiles.page, tableControl.employeeProfiles.rowsPerPage, tableControl.employeeProfiles.order, tableControl.employeeProfiles.orderBy, tableControl.employeeProfiles.search]);

  const tabIntToText = ['employees', 'employeeProfiles'];

  useEffect(() => {
    if (globalSearch.tabIndex >= 0) {
      setTab(globalSearch.tabIndex);
      setTableControl(prev => ({
        ...prev,
        [tabIntToText[globalSearch.tabIndex]]: {
          ...prev[tabIntToText[globalSearch.tabIndex]],
          search: globalSearch.searchValue,
        }
      }))
      setTimeout(() => {
        setGeneralSearch({});
      }, 800);
    }
  }, [globalSearch.tabIndex, globalSearch.searchValue]);

  const [control, setControl] = useState({
    employeeProfilesRows: [],
    employeeProfilesRowsSelected: [],
    idEmployeeProfile: null,
    idUser: null,
    openEmployeeProfilesModal: false,
    openUsersModal: false,
    usersRows: [],
    usersRowsSelected: []
  });

  const collections = {
    employeeProfiles: {
      id: 'idEmployeeProfile',
      modal: 'openEmployeeProfilesModal',
      name: 'employeeProfiles'
    },
    employees: {
      id: 'idEmployee',
      modal: 'openEmployeesModal',
      name: 'employees'
    }
  };

  const tableActions = (collectionName) => {
    const collection = collections[collectionName];
    return {
      onAdd() {
        setControl({
          ...control,
          [collection.id]: null,
          [collection.modal]: true
        });
      },
      onEdit(id) {
        setControl({
          ...control,
          [collection.id]: id,
          [collection.modal]: true
        });
      },
      onDelete(id) {
        if (!id || !Array.isArray(id)) return;
        getDB('policies')
          .then((response) => response.json())
          .then((data) => {
            const { response } = data;
            id.forEach((_id) => {
              deleteDB(`${collection.name}/`, _id)
                .then((response) => response.json())
                .then((data) => {
                  dispatch(showDeletedAlert());
                  const currentCollection = collection.name === 'employees' ? 'list' : 'references';
                  executePolicies('OnDelete', 'employees', currentCollection, response);
                  loadEmployeesData(collection.name);

                  if (collection.name === 'employees') {
                    const { response: { value: { layoutSelected, assetsAssigned } } } = data;

                    assetsAssigned.forEach(({ id: assetId }) => {
                      updateDB('assets/', { assigned: null, assignedTo: "" }, assetId)
                        .catch((error) => console.log(error));
                    });

                    if (layoutSelected) {
                      getOneDB('settingsLayoutsEmployees/', layoutSelected.value)
                        .then((response) => response.json())
                        .then((data) => {
                          const { used } = data.response;
                          const value = (typeof used === 'number' ? used : 1) - 1;
                          updateDB('settingsLayoutsEmployees/', { used: value }, layoutSelected.value)
                            .catch((error) => console.log(error));
                        })
                        .catch((error) => console.log(error));
                    }
                  }
                })
                .catch((error) => console.log(error));
            });
          })
          .catch((error) => console.log(error));

        loadEmployeesData(collection.name);
      },
      onSelect(id) {
        if (collectionName === 'references') {
          setReferencesSelectedId(id);
        }
      }
    };
  };

  return (
    <>
      <ModalYesNo
        onCancel={() => setSelectReferenceConfirmation(false)}
        onOK={() => setSelectReferenceConfirmation(false)}
        message={'Please first select a Reference from the next tab'}
        showModal={selectReferenceConfirmation}
        title={'Add New Asset'}
      />
      <div className='kt-form kt-form--label-right'>
        <Portlet>
          <PortletHeader
            toolbar={
              <PortletHeaderToolbar>
                <Tabs
                  className='builder-tabs'
                  component='div'
                  onChange={(_, nextTab) => setTab(nextTab)}
                  value={tab}
                >
                  {TabsTitles('employees')}
                </Tabs>
              </PortletHeaderToolbar>
            }
          />

          {tab === 0 && (
            <PortletBody>
              <div className='kt-section kt-margin-t-0'>
                <div className='kt-section__body'>
                  <div className='kt-section'>
                    <span className='kt-section__sub'>
                      This section will integrate{' '}
                      <code>Employees List</code>
                    </span>
                    <ModalEmployees
                      employeeProfileRows={control.employeeProfilesRows}
                      id={control.idEmployee}
                      policies={policies}
                      reloadTable={() => loadEmployeesData('employees')}
                      setShowModal={(onOff) =>
                        setControl({
                          ...control,
                          openEmployeesModal: onOff,
                        })
                      }
                      showModal={control.openEmployeesModal}
                      userLocations={userLocations}
                    />
                    <div className='kt-separator kt-separator--dashed' />
                    <div className='kt-section__content'>
                      <TableComponent2
                        controlValues={tableControl.employees}
                        headRows={employeesHeadRows}
                        onAdd={tableActions('employees').onAdd}
                        onDelete={tableActions('employees').onDelete}
                        onEdit={tableActions('employees').onEdit}
                        onSelect={tableActions('employees').onSelect}
                        paginationControl={({ rowsPerPage, page }) =>
                          setTableControl(prev => ({
                            ...prev,
                            employees: {
                              ...prev.employees,
                              rowsPerPage: rowsPerPage,
                              page: page,
                            }
                          }))
                        }
                        rows={control.usersRows}
                        searchControl={({ value, field }) => {
                          setTableControl(prev => ({
                            ...prev,
                            employees: {
                              ...prev.employees,
                              search: value,
                              searchBy: field,
                            }
                          }))
                        }}
                        sortByControl={({ orderBy, order }) => {
                          setTableControl(prev => ({
                            ...prev,
                            employees: {
                              ...prev.employees,
                              orderBy: orderBy,
                              order: order,
                            }
                          }))
                        }}
                        title={'Employees List'}
                        tileView
                      />
                    </div>
                  </div>
                </div>
              </div>
            </PortletBody>
          )}

          {tab === 1 && (
            <PortletBody>
              <div className='kt-section kt-margin-t-0'>
                <div className='kt-section__body'>
                  <div className='kt-section'>
                    <span className='kt-section__sub'>
                      This section will integrate <code>User Profiles</code>
                    </span>
                    <ModalEmployeeProfiles
                      policies={policies}
                      reloadTable={() =>
                        loadEmployeesData('employeeProfiles')
                      }
                      setShowModal={(onOff) =>
                        setControl({
                          ...control,
                          openEmployeeProfilesModal: onOff,
                        })
                      }
                      showModal={control.openEmployeeProfilesModal}
                      id={control.idEmployeeProfile}
                    />
                    <div className='kt-separator kt-separator--dashed' />
                    <div className='kt-section__content'>
                      <TableComponent2
                        controlValues={tableControl.employeeProfiles}
                        headRows={employeeProfilesHeadRows}
                        onAdd={tableActions('employeeProfiles').onAdd}
                        onDelete={tableActions('employeeProfiles').onDelete}
                        onEdit={tableActions('employeeProfiles').onEdit}
                        onSelect={tableActions('employeeProfiles').onSelect}
                        paginationControl={({ rowsPerPage, page }) =>
                          setTableControl(prev => ({
                            ...prev,
                            employeeProfiles: {
                              ...prev.employeeProfiles,
                              rowsPerPage: rowsPerPage,
                              page: page,
                            }
                          }))
                        }
                        rows={control.employeeProfilesRows}
                        searchControl={({ value, field }) => {
                          setTableControl(prev => ({
                            ...prev,
                            employeeProfiles: {
                              ...prev.employeeProfiles,
                              search: value,
                              searchBy: field,
                            }
                          }))
                        }}
                        sortByControl={({ orderBy, order }) => {
                          setTableControl(prev => ({
                            ...prev,
                            employeeProfiles: {
                              ...prev.employeeProfiles,
                              orderBy: orderBy,
                              order: order,
                            }
                          }))
                        }}
                        title={'EmployeeProfiles List'}
                        tileView
                      />
                    </div>
                  </div>
                </div>
              </div>
            </PortletBody>
          )}

          {tab === 2 && <Policies setPolicies={setPolicies} module='employees' baseFields={policiesBaseFields} />}
        </Portlet>
      </div>
    </>
  );
}

const mapStateToProps = ({ general: { globalSearch }, auth: { user } }) => ({
  globalSearch,
  user
});
export default connect(mapStateToProps, general.actions)(Employees);
