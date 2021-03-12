import React, { useEffect, useMemo, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Formik, setNestedObjectValues } from 'formik';
import { get, merge } from 'lodash';
import { FormHelperText, Styles, Switch, Tab, Tabs } from '@material-ui/core';
import {
  initLayoutConfig,
  LayoutConfig,
  metronic
} from '../../../../_metronic';
import {
  Portlet,
  PortletBody,
  PortletFooter,
  PortletHeader,
  PortletHeaderToolbar
} from '../../../partials/content/Portlet';
import { getDB, deleteDB } from '../../../crud/api';
import { TabsTitles } from '../Components/Translations/tabsTitles';
import ModalYesNo from '../Components/ModalYesNo';
import Policies from '../Components/Policies/Policies';
import TableComponent from '../Components/TableComponent';
import ModalEmployees from './modals/ModalEmployees';
import ModalEmployeeProfiles from './modals/ModalEmployeeProfiles';

const localStorageActiveTabKey = 'builderActiveTab';

const Employees = () => {
  const activeTab = localStorage.getItem(localStorageActiveTabKey);
  const [employeeLayoutSelected, setEmployeeLayoutSelected] = useState({});
  const [policies, setPolicies] = useState(['']);
  const [referencesSelectedId, setReferencesSelectedId] = useState(null);
  const [
    selectReferenceConfirmation,
    setSelectReferenceConfirmation
  ] = useState(false);
  const [tab, setTab] = useState(activeTab ? +activeTab : 0);
  const dispatch = useDispatch();
  const { layoutConfig } = useSelector(
    ({ builder }) => ({ layoutConfig: builder.layoutConfig }),
    shallowEqual
  );
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [loadingButtonPreviewStyle, setLoadingButtonPreviewStyle] = useState({
    paddingRight: '2.5rem',
  });
  const [loadingReset, setLoadingReset] = useState(false);
  const [loadingButtonResetStyle, setLoadingButtonResetStyle] = useState({
    paddingRight: '2.5rem',
  });

  const enableLoadingPreview = () => {
    setLoadingPreview(true);
    setLoadingButtonPreviewStyle({ paddingRight: '3.5rem' });
  };
  const enableLoadingReset = () => {
    setLoadingReset(true);
    setLoadingButtonResetStyle({ paddingRight: '3.5rem' });
  };
  const updateLayoutConfig = (_config) => {
    dispatch(metronic.builder.actions.setLayoutConfigs(_config));
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const initialValues = useMemo(
    () =>
      merge(
        LayoutConfig,
        layoutConfig
      ),
    [layoutConfig]
  );

  const createUserProfilesRow = (id, name, creator, creation_date) => {
    return { id, name, creator, creation_date };
  };

  const employeeProfilesHeadRows = [
    { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
    { id: 'creator', numeric: false, disablePadding: false, label: 'Creator' },
    {
      id: 'creation_date',
      numeric: false,
      disablePadding: false,
      label: 'Creation Date'
    }
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
    { id: 'creator', numeric: false, disablePadding: false, label: 'Creator' },
    { id: 'creation_date', numeric: false, disablePadding: false, label: 'Creation Date' }
  ];

  const loadEmployeesData = (
    collectionNames = ['employees', 'employeeProfiles']
  ) => {
    collectionNames = !Array.isArray(collectionNames)
      ? [collectionNames]
      : collectionNames;
    collectionNames.forEach((collectionName) => {
      getDB(collectionName)
        .then((response) => response.json())
        .then((data) => {
          if (collectionName === 'employeeProfiles') {
            const rows = data.response.map((row) => {
              const { _id, name } = row;
              return createUserProfilesRow(
                _id,
                name,
                'Admin',
                '11/03/2020'
              );
            });
            setControl((prev) => ({
              ...prev,
              employeeProfilesRows: rows,
              employeeProfilesRowsSelected: [],
            }));
          }
          if (collectionName === 'employees') {
            const rows = data.response.map((row) => {
              const { _id, name, lastName, email, designation, manager } = row;
              return createEmployeeRow(
                _id,
                name,
                lastName,
                email,
                designation,
                manager,
                'Admin',
                '11/03/2020'
              );
            });
            setControl((prev) => ({
              ...prev,
              usersRows: rows,
              usersRowsSelected: []
            }));
          }
        })
        .catch((error) => console.log('error>', error));
    });
  };

  useEffect(() => {
    getDB('policies')
      .then((response) => response.json())
      .then((data) => {
        setPolicies(data.response);
      })
      .catch((error) => console.log('error>', error));
    loadEmployeesData();
  }, []);

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
              loadEmployeesData('employeeProfiles');
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
      ({ policyName, selectedAction, selectedCatalogue }) =>
        alert(
          `Policy <${policyName}> with action <${selectedAction}> of type <${selectedCatalogue}> will be executed`
        )
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
      <Formik
        initialValues={initialValues}
        onReset={() => {
          enableLoadingReset();
          updateLayoutConfig(initLayoutConfig);
        }}
        onSubmit={(values) => {
          enableLoadingPreview();
          updateLayoutConfig(values);
        }}
      >
        {({ values, handleReset, handleSubmit, handleChange, handleBlur }) => (
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
                              openEmployeesModal: onOff
                            })
                          }
                          showModal={control.openEmployeesModal}
                        />
                        <div className='kt-separator kt-separator--dashed' />
                        <div className='kt-section__content'>
                          <TableComponent
                            headRows={employeesHeadRows}
                            onAdd={tableActions('employees').onAdd}
                            onDelete={tableActions('employees').onDelete}
                            onEdit={tableActions('employees').onEdit}
                            onSelect={tableActions('employees').onSelect}
                            rows={control.usersRows}
                            title={'Employee List'}
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
                          <TableComponent
                            headRows={employeeProfilesHeadRows}
                            onAdd={tableActions('employeeProfiles').onAdd}
                            onEdit={tableActions('employeeProfiles').onEdit}
                            onDelete={tableActions('employeeProfiles').onDelete}
                            onSelect={tableActions('employeeProfiles').onSelect}
                            rows={control.employeeProfilesRows}
                            title={'Employee Profiles'}
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
        )}
      </Formik>
    </>
  );
}
export default Employees;
