/* eslint-disable no-restricted-imports */
import React, { useMemo, useState, useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Formik, setNestedObjectValues } from 'formik';
import { get, merge } from 'lodash';
import { FormHelperText, Switch, Tab, Tabs, Styles } from '@material-ui/core';
import clsx from 'clsx';
import {
  metronic,
  initLayoutConfig,
  LayoutConfig,
} from '../../../../_metronic';
import {
  Portlet,
  PortletBody,
  PortletFooter,
  PortletHeader,
  PortletHeaderToolbar,
} from '../../../partials/content/Portlet';
import { CodeBlock } from '../../../partials/content/CodeExample';
import Notice from '../../../partials/content/Notice';
import CodeExample from '../../../partials/content/CodeExample';
import {
  makeStyles,
  lighten,
  withStyles,
  useTheme,
} from '@material-ui/core/styles';
import {
  Checkbox,
  Card,
  CardHeader,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Divider,
} from '@material-ui/core';

// AApp Components
import TableComponent from '../Components/TableComponent';
import ModalEmployeeProfiles from './modals/ModalEmployeeProfiles';
import Autocomplete from '../Components/Inputs/Autocomplete';
import ModalEmployees from './modals/ModalEmployees';
import TreeView from '../Components/TreeViewComponent';
// import GoogleMaps from '../Components/GoogleMaps';
// import './Assets.scss';
//Icons
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';

//DB API methods
import { getDB, deleteDB } from '../../../crud/api';
import ModalYesNo from '../Components/ModalYesNo';
import Policies from '../Components/Policies/Policies';

const localStorageActiveTabKey = 'builderActiveTab';
export default function Employees() {
  const activeTab = localStorage.getItem(localStorageActiveTabKey);
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
      label: 'Creation Date',
    },
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
      creation_date,
    };
  };

  const employeesHeadRows = [
    { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
    {
      id: 'lastName',
      numeric: true,
      disablePadding: false,
      label: 'Last Name',
    },
    { id: 'email', numeric: true, disablePadding: false, label: 'Email' },
    { id: 'creator', numeric: false, disablePadding: false, label: 'Creator' },
    {
      id: 'creation_date',
      numeric: false,
      disablePadding: false,
      label: 'Creation Date',
    },
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
              return createUserProfilesRow(
                row._id,
                row.name,
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
              return createEmployeeRow(
                row._id,
                row.name,
                row.lastName,
                row.email,
                row.designation,
                row.manager,
                'Admin',
                '11/03/2020'
              );
            });
            setControl((prev) => ({
              ...prev,
              usersRows: rows,
              usersRowsSelected: [],
            }));
          }
        })
        .catch((error) => console.log('error>', error));
    });
  };

  const [policies, setPolicies] = useState(['']);

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
    idEmployeeProfile: null,
    openEmployeeProfilesModal: false,
    employeeProfilesRows: [],
    employeeProfilesRowsSelected: [],
    idUser: null,
    openUsersModal: false,
    usersRows: [],
    usersRowsSelected: [],
  });

  const [referencesSelectedId, setReferencesSelectedId] = useState(null);
  const [
    selectReferenceConfirmation,
    setSelectReferenceConfirmation,
  ] = useState(false);

  const collections = {
    employeeProfiles: {
      id: 'idEmployeeProfile',
      modal: 'openEmployeeProfilesModal',
      name: 'employeeProfiles',
    },
    employees: {
      id: 'idEmployee',
      modal: 'openEmployeesModal',
      name: 'employees',
    },
  };

  const tableActions = (collectionName) => {
    const collection = collections[collectionName];
    return {
      onAdd() {
        console.log('MAIN ON ADD>> ', referencesSelectedId);
        setControl({
          ...control,
          [collection.id]: null,
          [collection.modal]: true,
        });
      },
      onEdit(id) {
        console.log('onEdit:', id, collection, collection.id);
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
      },
    };
  };

  const executePolicies = (catalogueName) => {
    const filteredPolicies = policies.filter(
      (policy) => policy.selectedAction === catalogueName
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
        showModal={selectReferenceConfirmation}
        onOK={() => setSelectReferenceConfirmation(false)}
        onCancel={() => setSelectReferenceConfirmation(false)}
        title={'Add New Asset'}
        message={'Please first select a Reference from the next tab'}
      />
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          enableLoadingPreview();
          updateLayoutConfig(values);
        }}
        onReset={() => {
          enableLoadingReset();
          updateLayoutConfig(initLayoutConfig);
        }}
      >
        {({ values, handleReset, handleSubmit, handleChange, handleBlur }) => (
          <div className='kt-form kt-form--label-right'>
            <Portlet>
              <PortletHeader
                toolbar={
                  <PortletHeaderToolbar>
                    <Tabs
                      component='div'
                      className='builder-tabs'
                      value={tab}
                      onChange={(_, nextTab) => {
                        setTab(nextTab);
                        localStorage.setItem(localStorageActiveTabKey, nextTab);
                      }}
                    >
                      <Tab label='List' />
                      <Tab label='References' />
                      <Tab label='Policies' />
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
                          showModal={control.openEmployeesModal}
                          setShowModal={(onOff) =>
                            setControl({
                              ...control,
                              openEmployeesModal: onOff,
                            })
                          }
                          reloadTable={() => loadEmployeesData('employees')}
                          id={control.idEmployee}
                          employeeProfileRows={control.employeeProfilesRows}
                        />
                        <div className='kt-separator kt-separator--dashed' />
                        <div className='kt-section__content'>
                          <TableComponent
                            title={'Employee List'}
                            headRows={employeesHeadRows}
                            rows={control.usersRows}
                            onEdit={tableActions('employees').onEdit}
                            onAdd={tableActions('employees').onAdd}
                            onDelete={tableActions('employees').onDelete}
                            onSelect={tableActions('employees').onSelect}
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
                          showModal={control.openEmployeeProfilesModal}
                          setShowModal={(onOff) =>
                            setControl({
                              ...control,
                              openEmployeeProfilesModal: onOff,
                            })
                          }
                          reloadTable={() =>
                            loadEmployeesData('employeeProfiles')
                          }
                          id={control.idEmployeeProfile}
                        />
                        <div className='kt-separator kt-separator--dashed' />
                        <div className='kt-section__content'>
                          <TableComponent
                            title={'Employee Profiles'}
                            headRows={employeeProfilesHeadRows}
                            rows={control.employeeProfilesRows}
                            onAdd={tableActions('employeeProfiles').onAdd}
                            onDelete={tableActions('employeeProfiles').onDelete}
                            onEdit={tableActions('employeeProfiles').onEdit}
                            onSelect={tableActions('employeeProfiles').onSelect}
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
