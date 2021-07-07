/* eslint-disable no-restricted-imports */
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { utcToZonedTime } from 'date-fns-tz';
import { isEmpty } from 'lodash';
import { Chip, Tabs, Typography} from '@material-ui/core';
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
import UsersPerStageCell from './components/UsersPerStageCell';
import CustomizedToolTip from '../Components/CustomizedToolTip';
import ModalProcessStages from './modals/ModalProcessStages';
import ModalProcesses from './modals/ModalProcesses';

//DB API methods
import { deleteDB, getDBComplex, getCountDB } from '../../../crud/api';
import ModalYesNo from '../Components/ModalYesNo';
import LiveProcesses from './components/LiveProcesses';

const orderByCorrection = { 
  creator: 'creationUserFullName',
};

const localStorageActiveTabKey = 'builderActiveTab';
const Processes = (props) => {
  const dispatch = useDispatch();
  const { showDeletedAlert, showErrorAlert  } = actions;
  const [tab, setTab] = useState(0);

  const createProcessStageRow = (id, name, custom, notifications, approvals, creator, creationDate, updateDate) => {
    return { id, name, custom, notifications, approvals, creator, creationDate, updateDate };
  };
  const createProcessRow = (id, name, numberOfStages, selectedProcessType, notifications, approvals,  creator, creationDate, updateDate) => {
    return { id, name, numberOfStages, selectedProcessType, notifications, approvals, creator, creationDate, updateDate};
  };

  const processStagesHeadRows = [
    { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
    { id: 'custom', numeric: false, disablePadding: false, label: 'Custom', sortByDisabled: true },
    { id: 'notifications', numeric: false, disablePadding: false, label: 'Notifications', sortByDisabled: true, renderCell: (value) => {
      const users = value.map(({name, lastName, email}) => `${name} ${lastName} (${email})`);
      return (
        <div style={{ display:'table-cell', verticalAlign: 'middle', textAlign:'center', padding: '16px', borderBottom: '1px solid rgba(224, 224, 224, 1)'}}>
          {
            users.length > 0 && (
              <CustomizedToolTip 
                tooltipContent={
                  <ul style={{marginTop: '10px'}}>
                    {
                      users.map((user) => (
                        <li style={{ marginRight: '10px' }}>{user}</li>
                      ))
                    }
                  </ul>
                }
                content = {
                  <Chip
                    label={`Users: ${users.length}`}
                    style={{ backgroundColor: '#8e8e8e', height: '28px' }}
                    color='secondary'
                    onClick={() => {}}
                  />
                }
              />
            )
          }
          {
            users.length === 0 && (
              <il> 
                <Typography style={{ fontSize: '0.875rem' }}>
                  N/A
                </Typography>
              </il>
            )
          }
        </div>
      ) 
    }},
    { id: 'approvals', numeric: false, disablePadding: false, label: 'Approvals', sortByDisabled: true,  renderCell: (value) => {
      const users = value.map(({name, lastName, email}) => `${name} ${lastName} (${email})`);
      return (
        <div style={{ display:'table-cell', verticalAlign: 'middle', textAlign:'center', padding: '16px', borderBottom: '1px solid rgba(224, 224, 224, 1)'}}>
          {
            users.length > 0 && (
              <CustomizedToolTip 
                tooltipContent={
                  <ul style={{marginTop: '10px'}}>
                    {
                      users.map((user) => (
                        <li style={{ marginRight: '10px' }}>{user}</li>
                      ))
                    }
                  </ul>
                }
                content = {
                  <Chip
                    label={`Users: ${users.length}`}
                    style={{ backgroundColor: '#8e8e8e', height: '28px'}}
                    color='secondary'
                    onClick={() => {}}
                  />
                }
              />
            )
          }
          {
            users.length === 0 && (
              <il> 
                <Typography style={{ fontSize: '0.875rem' }}>
                  N/A
                </Typography>
              </il>
            )
          }
        </div>
      ) 
    }},
    { id: 'creator', numeric: false, disablePadding: false, label: 'Creator' },
    { id: 'creationDate', numeric: false, disablePadding: false, label: 'Creation Date' },
    { id: "updateDate", numeric: false, disablePadding: false, label: "Update Date", searchByDisabled: true}
  ];

  const processesHeadRows = [
    { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
    { id: 'numberOfStages', numeric: false, disablePadding: false, label: 'Number of Stages', sortByDisabled: true, renderCell: (value = []) => {
      return (
        <div style={{ display:'table-cell', verticalAlign: 'middle', textAlign:'center', padding: '16px', borderBottom: '1px solid rgba(224, 224, 224, 1)'}}>
          {
            value.length > 0 && (
              <CustomizedToolTip 
                tooltipContent={
                  <ol style={{marginTop: '15px', marginRight: '20px'}}>
                    {
                      value.map(({ name, goBackEnabled, goBackTo }) => (
                        <li style={{ marginTop: '10px' }}>
                            <h6>{` ${name}`}</h6>
                            {
                              goBackEnabled && (
                                <ul style={{ paddingLeft: '5px' }}>
                                  <li style={{ marginBottom: '5px', fontWeight: 'normal', color: '#b2b2b2'}}>
                                    <p>Go Back To: <i>{value.find(({id}) => id === goBackTo)?.name || "Coulnd't found the stage" }</i></p>
                                  </li>
                                </ul>
                              )
                            }
                        </li>
                      ))
                    }
                  </ol>
                }
                content = {
                  <Chip
                    label={`Stages: ${value.length}`}
                    style={{ backgroundColor: '#8e8e8e', height: '28px' }}
                    color='secondary'
                    onClick={() => {}}
                  />
                }
              />
            )
          }
          {
            value.length === 0 && (
              <Chip
                label={`No Stages`}
                style={{ backgroundColor: '#8e8e8e', height: '28px' }}
                color='secondary'
                onClick={() => {}}
              />
            )
          }
        </div>
      ) 
    }},
    { id: 'selectedProcessType', numeric: false, disablePadding: false, label: 'Type'},
    { id: 'notifications', numeric: false, disablePadding: false, label: 'Notifications', searchByDisabled: true, sortByDisabled: true, renderCell: (value) => {
      const users = [].concat(...value.map(({users}) => (users))).length;
      return (
        <UsersPerStageCell number={users} values={value}/>
      ) 
    }},
    { id: 'approvals', numeric: false, disablePadding: false, label: 'Approvals', searchByDisabled: true, sortByDisabled: true, renderCell: (value) => {
      const users = [].concat(...value.map(({users}) => (users))).length;
      return (
        <UsersPerStageCell number={users} values={value}/>
      ) 
    }},
    { id: 'creator', numeric: false, disablePadding: false, label: 'Creator', searchByDisabled: true },
    { id: 'creationDate', numeric: false, disablePadding: false, label: 'Creation Date', searchByDisabled: true },
    { id: "updateDate", numeric: false, disablePadding: false, label: "Update Date", searchByDisabled: true}
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
              const { customFieldsTab, creationUserFullName, creationDate, updateDate, notifications, approvals } = row;
              const isCustom = Object.keys(customFieldsTab).length ? 'True' : 'False';
              const update_date = String(new Date(updateDate)).split('GMT')[0];
              const creation_date = String(new Date(creationDate)).split('GMT')[0];
              return createProcessStageRow(row._id, row.name, isCustom, notifications, approvals, creationUserFullName, creation_date, update_date);
            });
            setControl(prev => ({ ...prev, processStagesRows: rows, processStagesRowsSelected: [] }));
          }
          if (collectionName === 'processes') {
            const rows = data.response.map(row => {
              const update_date = String(new Date(row.updateDate)).split('GMT')[0];
              const creation_date = String(new Date(row.creationDate)).split('GMT')[0];
              const notificationsPerStage = [];
              const approvalsPerStage = [];
              const numberOfStages = [];
              row.processStages.map(({ id, name, notifications, approvals, goBackEnabled, goBackTo }) => {
                notificationsPerStage.push({ name, users: notifications.map(({ name, lastName, email }) => `${name} ${lastName} (${email})`)});
                approvalsPerStage.push(({ name, users: approvals.map(({ name, lastName, email }) => `${name} ${lastName} (${email})`)}));
                numberOfStages.push({ id, name, goBackEnabled, goBackTo });
              });
              return createProcessRow(row._id, row.name, numberOfStages, row.selectedProcessType, notificationsPerStage, approvalsPerStage, row.creationUserFullName, creation_date, update_date);
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
                  onChange={(_, nextTab) => setTab(nextTab)}
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

          {tab === 1 && (
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
                              orderBy: orderByCorrection[orderBy] ? orderByCorrection[orderBy] : orderBy,
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
                              orderBy: orderByCorrection[orderBy] ? orderByCorrection[orderBy] : orderBy,
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

        </Portlet>
      </div>
    </>
  );
};

export default Processes;
