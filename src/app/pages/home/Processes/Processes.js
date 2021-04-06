/* eslint-disable no-restricted-imports */
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { isEmpty } from 'lodash';
import { Tabs } from '@material-ui/core';
import { actions } from '../../../store/ducks/general.duck';
import {
  Portlet,
  PortletBody,
  PortletHeader,
  PortletHeaderToolbar
} from '../../../partials/content/Portlet';

// AApp Components
import { TabsTitles } from '../Components/Translations/tabsTitles';
import TableComponent2 from '../Components/TableComponent2';
import ModalProcessStages from './modals/ModalProcessStages';
import ModalProcesses from './modals/ModalProcesses';

//DB API methods
import { deleteDB, getDBComplex, getCountDB } from '../../../crud/api';
import ModalYesNo from '../Components/ModalYesNo';
import LiveProcesses from './components/LiveProcesses';

const localStorageActiveTabKey = 'builderActiveTab';

const Processes = (props) => {
  const dispatch = useDispatch();
  const { showDeletedAlert, showErrorAlert  } = actions;
  const activeTab = localStorage.getItem(localStorageActiveTabKey);
  const [tab, setTab] = useState(activeTab ? +activeTab : 0);

  const createProcessStageRow = (id, name, fn, type, custom, notification, creator, creation_date) => {
    return { id, name, function: fn, type, custom, notification, creator, creation_date };
  };
  const createProcessRow = (id, name, numberOfStages, creator, creation_date) => {
    return { id, name, numberOfStages, creator, creation_date };
  };

  const processStagesHeadRows = [
    { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
    { id: 'function', numeric: false, disablePadding: false, label: 'Function' },
    { id: 'type', numeric: false, disablePadding: false, label: 'Type' },
    { id: 'custom', numeric: false, disablePadding: false, label: 'Custom' },
    { id: 'notification', numeric: false, disablePadding: false, label: 'Notification' },
    { id: 'creator', numeric: false, disablePadding: false, label: 'Creator' },
    { id: 'creation_date', numeric: false, disablePadding: false, label: 'Creation Date' }
  ];

  const liveProcessesHeadRows = [
    { id: 'folio', numeric: false, disablePadding: false, label: 'Folio' },
    { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
    { id: 'type', numeric: false, disablePadding: false, label: 'Type' },
    { id: 'date', numeric: false, disablePadding: false, label: 'Date' },
    { id: 'approvals', numeric: false, disablePadding: false, label: 'Approvals' },
    { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
    { id: 'creator', numeric: false, disablePadding: false, label: 'Creator', searchByDisabled: true },
    { id: 'creation_date', numeric: false, disablePadding: false, label: 'Creation Date', searchByDisabled: true }
  ];

  const processesHeadRows = [
    { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
    { id: 'numberOfStages', numeric: false, disablePadding: false, label: 'Number of Stages' },
    { id: 'creator', numeric: false, disablePadding: false, label: 'Creator', searchByDisabled: true },
    { id: 'creation_date', numeric: false, disablePadding: false, label: 'Creation Date', searchByDisabled: true }
  ];

  const [tableControl, setTableControl] = useState({
    processStages: {
      collection: 'processStages',
      total: 0,
      page: 0,
      rowsPerPage: 5,
      orderBy: 'name',
      order: 1,
      search: '',
      searchBy: '',
    },
    processes: {
      collection: 'processes',
      total: 0,
      page: 0,
      rowsPerPage: 5,
      orderBy: 'name',
      order: 1,
      search: '',
      searchBy: '',
    },
  });

  const loadProcessData = (collectionNames = ['processStages', 'processes']) => {
    collectionNames = !Array.isArray(collectionNames) ? [collectionNames] : collectionNames;
    collectionNames.forEach(collectionName => {
      let queryLike = '';
      if (collectionName === 'processStages') {
        queryLike = tableControl.processStages.searchBy ? (
          [{ key: tableControl.processStages.searchBy, value: tableControl.processStages.search }]
        ) : (
          ['name', 'functions', 'types'].map(key => ({ key, value: tableControl.processStages.search }))
        )
      }
      if (collectionName === 'processes') {
        queryLike = tableControl.processes.searchBy ? (
          [{ key: tableControl.processes.searchBy, value: tableControl.processes.search }]
        ) : (
          ['name'].map(key => ({ key, value: tableControl.processes.search }))
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
        queryLike: tableControl[collectionName].search ? queryLike : null
      })
        .then(response => response.json())
        .then(data => {
          if (collectionName === 'processStages') {
            const rows = data.response.map(row => {
              const { functions, selectedFunction, types, selectedType, customFieldTabs } = row;
              const isCustom = String(!isEmpty(customFieldTabs)).toUpperCase();
              return createProcessStageRow(row._id, row.name, functions[selectedFunction], types[selectedType], isCustom, 'FALSE', 'Admin', '11/03/2020');
            });
            setControl(prev => ({ ...prev, processStagesRows: rows, processStagesRowsSelected: [] }));
          }
          if (collectionName === 'processes') {
            const rows = data.response.map(row => {
              return createProcessRow(row._id, row.name, row.processStages.length || 'N/A', 'Admin', '11/03/2020');
            });
            setControl(prev => ({ ...prev, processRows: rows, processRowsSelected: [] }));
          }
        })
        .catch(error => console.log('error>', error));
    });
  };

  useEffect(() => {
    loadProcessData();
  }, []);

  useEffect(() => {
    loadProcessData('processes');
  }, [tableControl.processes.page, tableControl.processes.rowsPerPage, tableControl.processes.order, tableControl.processes.orderBy, tableControl.processes.search, tableControl.processes.locationsFilter]);

  useEffect(() => {
    loadProcessData('processStages');
  }, [tableControl.processStages.page, tableControl.processStages.rowsPerPage, tableControl.processStages.order, tableControl.processStages.orderBy, tableControl.processStages.search]);

  const [control, setControl] = useState({
    idProcessStage: null,
    openProcessStagesModal: false,
    processStagesRows: [],
    processStagesRowsSelected: [],
    //
    idProcess: null,
    openProcessModal: false,
    processRows: [],
    processRowsSelected: []
  });

  const [referencesSelectedId, setReferencesSelectedId] = useState(null);
  const [selectReferenceConfirmation, setSelectReferenceConfirmation] = useState(false);
  const collections = {
    processStages: {
      id: 'idProcessStage',
      modal: 'openProcessStagesModal',
      name: 'processStages'
    },
    processes: {
      id: 'idProcess',
      modal: 'openProcessModal',
      name: 'processes'
    }
  };

  const tableActions = (collectionName) => {
    // return;
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
        id.forEach(_id => {
          deleteDB(`${collection.name}/`, _id)
            .then(response => {
              dispatch(showDeletedAlert());
              loadProcessData(collection.name)
            })
            .catch(error => dispatch(showErrorAlert()));
        });
        loadProcessData(collection.name);
      },
      onSelect(id) {
        if (collectionName === 'references') {
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
        title={'Add New Asset'}
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
                  onChange={(_, nextTab) => {
                    setTab(nextTab);
                    localStorage.setItem(localStorageActiveTabKey, nextTab);
                  }}
                >
                  {TabsTitles('processes')}
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
                      This section will integrate <code>Processes List</code>
                    </span>
                    <ModalProcesses
                      showModal={control.openProcessModal}
                      setShowModal={(onOff) => setControl({ ...control, openProcessModal: onOff })}
                      reloadTable={() => loadProcessData('processes')}
                      id={control.idProcess}
                    />
                    <div className='kt-separator kt-separator--dashed' />
                    <div className='kt-section__content'>
                      <TableComponent2
                        controlValues={tableControl.processes}
                        disableSearchBy
                        headRows={processesHeadRows}
                        onAdd={tableActions('processes').onAdd}
                        onDelete={tableActions('processes').onDelete}
                        onEdit={tableActions('processes').onEdit}
                        onSelect={tableActions('processes').onSelect}
                        paginationControl={({ rowsPerPage, page }) =>
                          setTableControl(prev => ({
                            ...prev,
                            processes: {
                              ...prev.processes,
                              rowsPerPage: rowsPerPage,
                              page: page,
                            }
                          }))
                        }
                        rows={control.processRows}
                        searchControl={({ value, field }) => {
                          setTableControl(prev => ({
                            ...prev,
                            processes: {
                              ...prev.processes,
                              search: value,
                              searchBy: field,
                            }
                          }))
                        }}
                        sortByControl={({ orderBy, order }) => {
                          setTableControl(prev => ({
                            ...prev,
                            processes: {
                              ...prev.processes,
                              orderBy: orderBy,
                              order: order,
                            }
                          }))
                        }}
                        title={'Processes List'}
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
                      This section will integrate <code>Processes Stages List</code>
                    </span>
                    <ModalProcessStages
                      showModal={control.openProcessStagesModal}
                      setShowModal={(onOff) => setControl({ ...control, openProcessStagesModal: onOff })}
                      reloadTable={() => loadProcessData('processStages')}
                      id={control.idProcessStage}
                    // categoryRows={control.categoryRows}
                    />
                    <div className='kt-separator kt-separator--dashed' />
                    <div className='kt-section__content'>
                      <TableComponent2
                        controlValues={tableControl.processStages}
                        disableSearchBy
                        headRows={processStagesHeadRows}
                        onAdd={tableActions('processStages').onAdd}
                        onDelete={tableActions('processStages').onDelete}
                        onEdit={tableActions('processStages').onEdit}
                        onSelect={tableActions('processStages').onSelect}
                        paginationControl={({ rowsPerPage, page }) =>
                          setTableControl(prev => ({
                            ...prev,
                            processStages: {
                              ...prev.processStages,
                              rowsPerPage: rowsPerPage,
                              page: page,
                            }
                          }))
                        }
                        rows={control.processStagesRows}
                        searchControl={({ value, field }) => {
                          setTableControl(prev => ({
                            ...prev,
                            processStages: {
                              ...prev.processStages,
                              search: value,
                              searchBy: field,
                            }
                          }))
                        }}
                        sortByControl={({ orderBy, order }) => {
                          setTableControl(prev => ({
                            ...prev,
                            processStages: {
                              ...prev.processStages,
                              orderBy: orderBy,
                              order: order,
                            }
                          }))
                        }}
                        title={'Processes List'}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </PortletBody>
          )}

          {tab === 2 && (
            <PortletBody>
              <div className='kt-section kt-margin-t-0'>
                <div className='kt-section__body'>
                  <div className='kt-section'>
                    <span className='kt-section__sub'>
                      This section will integrate <code>Live Processes</code>
                    </span>
                    <div className='kt-separator kt-separator--dashed' />
                    <div className='kt-section__content'>
                      <LiveProcesses />
                      {/* <TableComponent
                                title={'Live Processes'}
                                headRows={liveProcessesHeadRows}
                                rows={control.employeeProfilesRows}
                                onAdd={tableActions('employeeProfiles').onAdd}
                                onDelete={tableActions('employeeProfiles').onDelete}
                                onEdit={tableActions('employeeProfiles').onEdit}
                                onSelect={tableActions('employeeProfiles').onSelect}
                              /> */}
                    </div>
                  </div>
                </div>
              </div>
            </PortletBody>
          )}
        </Portlet>
      </div>
    </>
  );
};

export default Processes;
