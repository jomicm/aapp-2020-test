/* eslint-disable no-restricted-imports */
import React, { useState, useEffect } from 'react';
import { utcToZonedTime } from 'date-fns-tz';
import { connect, useDispatch } from "react-redux";
import { Tabs } from '@material-ui/core';
import { actions } from '../../../store/ducks/general.duck';
import {
  Portlet,
  PortletBody,
  PortletHeader,
  PortletHeaderToolbar
} from '../../../partials/content/Portlet';
import * as general from "../../../store/ducks/general.duck";
// AApp Components
import TableComponent2 from '../Components/TableComponent2';
import { TabsTitles } from '../Components/Translations/tabsTitles';
import { executePolicies } from '../Components/Policies/utils';
import { usePolicies } from '../Components/Policies/hooks';
import ModalUserProfiles from './modals/ModalUserProfiles';
import ModalUsers from './modals/ModalUsers';

//DB API methods
import { deleteDB, getDBComplex, getCountDB, getDB } from '../../../crud/api';
import ModalYesNo from '../Components/ModalYesNo';
import Policies from '../Components/Policies/Policies';
import { allBaseFields } from '../constants';

function Users({ globalSearch, setGeneralSearch }) {
  const dispatch = useDispatch();
  const { showDeletedAlert, showErrorAlert } = actions;
  const [tab, setTab] = useState(0);

  const { policies, setPolicies } = usePolicies();

  const policiesBaseFields = {
    list: allBaseFields.userList,
    references: allBaseFields.userReferences
  };

  const createUserProfilesRow = (id, name, creator, creation_date) => {
    return { id, name, creator, creation_date };
  };

  const userProfilesHeadRows = [
    { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
    { id: 'creator', numeric: false, disablePadding: false, label: 'Creator', searchByDisabled: true },
    { id: 'creation_date', numeric: false, disablePadding: false, label: 'Creation Date', searchByDisabled: true }
  ];

  const createUserRow = (id, name, lastName, email, designation, manager, creator, creation_date) => {
    return { id, name, lastName, email, designation, manager, creator, creation_date };
  };

  const usersHeadRows = [
    { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
    { id: 'lastName', numeric: true, disablePadding: false, label: 'Last Name' },
    { id: 'email', numeric: true, disablePadding: false, label: 'Email' },
    { id: 'designation', numeric: true, disablePadding: false, label: 'Designation', searchByDisabled: true },
    { id: 'manager', numeric: true, disablePadding: false, label: 'Manager', searchByDisabled: true },
    { id: 'creator', numeric: false, disablePadding: false, label: 'Creator', searchByDisabled: true },
    { id: 'creation_date', numeric: false, disablePadding: false, label: 'Creation Date', searchByDisabled: true }
  ];

  const [tableControl, setTableControl] = useState({
    userProfiles: {
      collection: 'userProfiles',
      total: 0,
      page: 0,
      rowsPerPage: 5,
      orderBy: 'name',
      order: 1,
      search: '',
      searchBy: '',
    },
    user: {
      collection: 'user',
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

  const loadUsersData = (collectionNames = ['user', 'userProfiles']) => {
    collectionNames = !Array.isArray(collectionNames) ? [collectionNames] : collectionNames;
    collectionNames.forEach(collectionName => {
      let queryLike = '';
      if (collectionName === 'userProfiles') {
        queryLike = tableControl.userProfiles.searchBy ? (
          [{ key: tableControl.userProfiles.searchBy, value: tableControl.userProfiles.search }]
        ) : (
          ['name'].map(key => ({ key, value: tableControl.userProfiles.search }))
        )
      }
      if (collectionName === 'user') {
        queryLike = tableControl.user.searchBy ? (
          [{ key: tableControl.user.searchBy, value: tableControl.user.search }]
        ) : (
          ['name', 'lastName', 'email'].map(key => ({ key, value: tableControl.user.search }))
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
          if (collectionName === 'userProfiles') {
            const rows = data.response.map(row => {
              const date = utcToZonedTime(row.creationDate).toLocaleString();
              return createUserProfilesRow(row._id, row.name, row.creationUserFullName, date);
            });
            setControl(prev => ({ ...prev, userProfilesRows: rows, userProfilesRowsSelected: [] }));
          }
          if (collectionName === 'user') {
            const rows = data.response.map(row => {
              const date = utcToZonedTime(row.creationDate).toLocaleString();
              return createUserRow(row._id, row.name, row.lastName, row.email, row.designation, row.manager, row.creationUserFullName, date);
            });
            setControl(prev => ({ ...prev, usersRows: rows, usersRowsSelected: [] }));
          }
        })
        .catch(error => console.log('error>', error));
    });
  };


  useEffect(() => {
    loadUsersData('user');
  }, [tableControl.user.page, tableControl.user.rowsPerPage, tableControl.user.order, tableControl.user.orderBy, tableControl.user.search, tableControl.user.locationsFilter]);

  useEffect(() => {
    loadUsersData('userProfiles');
  }, [tableControl.userProfiles.page, tableControl.userProfiles.rowsPerPage, tableControl.userProfiles.order, tableControl.userProfiles.orderBy, tableControl.userProfiles.search]);

  const tabIntToText = ['user', 'userProfiles'];

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
    idUserProfile: null,
    openUserProfilesModal: false,
    userProfilesRows: [],
    userProfilesRowsSelected: [],

    idUser: null,
    openUsersModal: false,
    usersRows: [],
    usersRowsSelected: [],
  });

  const [referencesSelectedId, setReferencesSelectedId] = useState(null);
  const [selectReferenceConfirmation, setSelectReferenceConfirmation] = useState(false);

  const collections = {
    userProfiles: {
      id: 'idUserProfile',
      modal: 'openUserProfilesModal',
      name: 'userProfiles'
    },
    users: {
      id: 'idUser',
      modal: 'openUsersModal',
      name: 'user'
    },
  };

  const tableActions = (collectionName) => {
    const collection = collections[collectionName];
    return {
      onAdd() {
        console.log('MAIN ON ADD>> ', referencesSelectedId);
        setControl({ ...control, [collection.id]: null, [collection.modal]: true })
      },
      onEdit(id) {
        console.log('onEdit:', id, collection, collection.id)
        setControl({ ...control, [collection.id]: id, [collection.modal]: true })
      },
      onDelete(id) {
        if (!id || !Array.isArray(id)) return;
        getDB('policies')
          .then((response) => response.json())
          .then((data) => {
            id.forEach(_id => {
              deleteDB(`${collection.name}/`, _id)
                .then(_ => {
                  dispatch(showDeletedAlert());
                  const currentCollection = collection.name === 'user' ? 'list' : 'references';
                  executePolicies('OnDelete', 'user', currentCollection, data.response);
                  loadUsersData(collection.name)
                })
                .catch(_ => dispatch(showErrorAlert()));
            });
          })
          .catch((_) => dispatch(showErrorAlert()));

      },
      onSelect(id) {
        if (collectionName === 'userProfiles') {
          setReferencesSelectedId(id);
        }
      }
    }
  };

  return (
    <>
      <ModalYesNo
        showModal={selectReferenceConfirmation}
        onOK={() => setSelectReferenceConfirmation(false)}
        onCancel={() => setSelectReferenceConfirmation(false)}
        title={'Add New User'}
        message={'Please first select a Reference from the next tab'}
      />
      <div className='kt-form kt-form--label-right'>
        <Portlet>
          <PortletHeader
            toolbar={
              <PortletHeaderToolbar>
                <Tabs
                  component='div'
                  className='builder-tabs'
                  value={tab}
                  onChange={(_, nextTab) => setTab(nextTab)}
                >
                  {TabsTitles('users')}
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
                      This section will integrate <code>Users List</code>
                    </span>
                    <ModalUsers
                      policies={policies}
                      showModal={control.openUsersModal}
                      setShowModal={(onOff) => setControl({ ...control, openUsersModal: onOff })}
                      reloadTable={() => loadUsersData('user')}
                      id={control.idUser}
                      userProfileRows={control.userProfilesRows}
                    />
                    <div className='kt-separator kt-separator--dashed' />
                    <div className='kt-section__content'>
                      <TableComponent2
                        controlValues={tableControl.user}
                        headRows={usersHeadRows}
                        onAdd={tableActions('users').onAdd}
                        onDelete={tableActions('users').onDelete}
                        onEdit={tableActions('users').onEdit}
                        onSelect={tableActions('users').onSelect}
                        paginationControl={({ rowsPerPage, page }) =>
                          setTableControl(prev => ({
                            ...prev,
                            user: {
                              ...prev.user,
                              rowsPerPage: rowsPerPage,
                              page: page,
                            }
                          }))
                        }
                        rows={control.usersRows}
                        searchControl={({ value, field }) => {
                          setTableControl(prev => ({
                            ...prev,
                            user: {
                              ...prev.user,
                              search: value,
                              searchBy: field,
                            }
                          }))
                        }}
                        sortByControl={({ orderBy, order }) => {
                          setTableControl(prev => ({
                            ...prev,
                            user: {
                              ...prev.user,
                              orderBy: orderBy,
                              order: order,
                            }
                          }))
                        }}
                        title={'Users List'}
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
                    <ModalUserProfiles
                      policies={policies}
                      showModal={control.openUserProfilesModal}
                      setShowModal={(onOff) => setControl({ ...control, openUserProfilesModal: onOff })}
                      reloadTable={() => loadUsersData('userProfiles')}
                      id={control.idUserProfile}
                    />
                    <div className='kt-separator kt-separator--dashed' />
                    <div className='kt-section__content'>
                      <TableComponent2
                        controlValues={tableControl.userProfiles}
                        headRows={userProfilesHeadRows}
                        onAdd={tableActions('userProfiles').onAdd}
                        onDelete={tableActions('userProfiles').onDelete}
                        onEdit={tableActions('userProfiles').onEdit}
                        onSelect={tableActions('userProfiles').onSelect}
                        paginationControl={({ rowsPerPage, page }) =>
                          setTableControl(prev => ({
                            ...prev,
                            userProfiles: {
                              ...prev.userProfiles,
                              rowsPerPage: rowsPerPage,
                              page: page,
                            }
                          }))
                        }
                        rows={control.userProfilesRows}
                        searchControl={({ value, field }) => {
                          setTableControl(prev => ({
                            ...prev,
                            userProfiles: {
                              ...prev.userProfiles,
                              search: value,
                              searchBy: field,
                            }
                          }))
                        }}
                        sortByControl={({ orderBy, order }) => {
                          setTableControl(prev => ({
                            ...prev,
                            userProfiles: {
                              ...prev.userProfiles,
                              orderBy: orderBy,
                              order: order,
                            }
                          }))
                        }}
                        title={'Users Profiles List'}
                        tileView
                      />
                    </div>
                  </div>
                </div>
              </div>
            </PortletBody>
          )}

          {tab === 2 && <Policies setPolicies={setPolicies} module="user" baseFields={policiesBaseFields} />}
        </Portlet>
      </div>
    </>
  );
}

const mapStateToProps = ({ general: { globalSearch } }) => ({
  globalSearch
});
export default connect(mapStateToProps, general.actions)(Users);
