import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";
import { Tabs } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { actions } from '../../../store/ducks/general.duck';
import {
  Portlet,
  PortletBody,
  PortletHeader,
  PortletHeaderToolbar
} from '../../../partials/content/Portlet';
import { deleteDB, getDBComplex, getCountDB } from '../../../crud/api';
import * as general from "../../../store/ducks/general.duck";
import TableComponent2 from '../Components/TableComponent2';
import { TabsTitles } from '../Components/Translations/tabsTitles';
import ModalYesNo from '../Components/ModalYesNo';
import Policies from '../Components/Policies/Policies';
import ModalEmployees from './modals/ModalEmployees';
import ModalEmployeeProfiles from './modals/ModalEmployeeProfiles';

const localStorageActiveTabKey = 'builderActiveTab';

const Employees = ({ globalSearch, setGeneralSearch }) => {
  const dispatch = useDispatch();
  const { setAlertControls } = actions;
  const activeTab = localStorage.getItem(localStorageActiveTabKey);
  const [employeeLayoutSelected, setEmployeeLayoutSelected] = useState({});
  const [policies, setPolicies] = useState(['']);
  const [referencesSelectedId, setReferencesSelectedId] = useState(null);
  const [
    selectReferenceConfirmation,
    setSelectReferenceConfirmation
  ] = useState(false);
  const [tab, setTab] = useState(activeTab ? +activeTab : 0);

  const createUserProfilesRow = (id, name, creator, creation_date) => {
    return { id, name, creator, creation_date };
  };

  const employeeProfilesHeadRows = [
    { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
    { id: 'creator', numeric: false, disablePadding: false, label: 'Creator', searchByDisabled: true },
    { id: 'creation_date', numeric: false, disablePadding: false, label: 'Creation Date', searchByDisabled: true }
  ];

  const createEmployeeRow = (
    id,
    name,
    lastName,
    email,
    designation,
    manager,
    creator,
    creation_date
  ) => {
    return {
      id,
      name,
      lastName,
      email,
      designation,
      manager,
      creator,
      creation_date
    };
  };

  const employeesHeadRows = [
    { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
    { id: 'lastName', numeric: true, disablePadding: false, label: 'Last Name' },
    { id: 'email', numeric: true, disablePadding: false, label: 'Email' },
    { id: 'creator', numeric: false, disablePadding: false, label: 'Creator', searchByDisabled: true },
    { id: 'creation_date', numeric: false, disablePadding: false, label: 'Creation Date', searchByDisabled: true }
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
              const { _id, name, creationUserFullName, creationDate } = row;
              return createUserProfilesRow(
                _id,
                name,
                creationUserFullName,
                creationDate
              );
            });
            setControl(prev => ({ ...prev, employeeProfilesRows: rows, employeeProfilesRowsSelected: [] }));
          }
          if (collectionName === 'employees') {
            const rows = data.response.map((row) => {
              const { _id, name, lastName, email, designation, manager, creationUserFullName, creationDate } = row;
              return createEmployeeRow(
                _id,
                name,
                lastName,
                email,
                designation,
                manager,
                creationUserFullName,
                creationDate
              );
            });
            setControl(prev => ({ ...prev, usersRows: rows, usersRowsSelected: [] }));
          }
        })
        .catch(error => console.log('error>', error));
    });
  };

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
        id.forEach((_id) => {
          deleteDB(`${collection.name}/`, _id)
            .then((response) => {
              executePolicies('OnDelete');
              loadEmployeesData(collection.name);
            })
            .catch((error) => console.log('Error', error));
        });
        loadEmployeesData(collection.name);
      },
      onSelect(id) {
        if (collectionName === 'references') {
          setReferencesSelectedId(id);
        }
      }
    };
  };

  const executePolicies = (catalogueName) => {
    const filteredPolicies = policies.filter(
      ({ selectedAction }) => selectedAction === catalogueName
    );
    filteredPolicies.forEach(
      ({ policyName, selectedAction, selectedCatalogue }) =>{
        dispatch(
          setAlertControls({
            open: true,
            message: `Policy <${policyName}> with action <${selectedAction}> of type <${selectedCatalogue}> will be executed`,
            type: 'info'
          })
        );
      }
    );
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
                  onChange={(_, nextTab) => {
                    setTab(nextTab);
                    localStorage.setItem(localStorageActiveTabKey, nextTab);
                  }}
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
                      reloadTable={() => loadEmployeesData('employees')}
                      setShowModal={(onOff) =>
                        setControl({
                          ...control,
                          openEmployeesModal: onOff,
                        })
                      }
                      showModal={control.openEmployeesModal}
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

          {tab === 2 && <Policies module='employees' />}
        </Portlet>
      </div>
    </>
  );
}

const mapStateToProps = ({ general: { globalSearch } }) => ({
  globalSearch
});
export default connect(mapStateToProps, general.actions)(Employees);
