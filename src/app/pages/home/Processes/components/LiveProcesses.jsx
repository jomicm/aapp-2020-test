/* eslint-disable no-restricted-imports */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import { differenceInDays, sub } from 'date-fns';
import { Chip, makeStyles, Tab, Tabs, Typography } from "@material-ui/core";
import Notification from '@material-ui/icons/NotificationImportant';
import { getDB, getDBComplex, getCountDB, deleteDB } from '../../../../crud/api';
import {
  Portlet,
  PortletBody,
  PortletHeader,
  PortletHeaderToolbar
} from "../../../../partials/content/Portlet";

// App Components
import TableComponent2 from '../../Components/TableComponent2';
import ModalProcessesLive from '../modals/ModalProcessLive';
import UsersPerStageCell from '../components/UsersPerStageCell';
// import ModalLayoutEmployees from './modals/ModalLayoutEmployees';
// import ModalLayoutStages from './modals/ModalLayoutStages';

const createLiveProcessesHeadRows = (id, folio, name, type, notifications, approvals, status, alert, creator, creation_date, updateDate) => {
  return { id, folio, name, type, notifications, approvals, status, alert, creator, creation_date, updateDate};
};

const useStyles = makeStyles((theme) => ({
  select: {
    width: '200px',
    [theme.breakpoints.down('md')]: {
      width: '70%'
    }
  },
}));

const orderByCorrection = {
  name: 'processData.name',
  type: 'processData.selectedProcessType',
  status: 'processData.processStatus',
  creator: 'creationUserFullName',
  creation_date: 'creationDate',
  alert: 'dueDate'
};

const collections = {
  layoutsEmployees: {
    id: 'idLayoutEmployee',
    modal: 'openLayoutEmployeesModal',
    name: 'settingsLayoutsEmployees'
  },
  layoutsStages: {
    id: 'idLayoutStage',
    modal: 'openLayoutStagesModal',
    name: 'settingsLayoutsStages'
  },
  processLive: {
    id: 'idProcessLive',
    modal: 'openProcessLiveModal',
    name: 'processLive'
  }
};

const overdueFilter = [
  {value: {days: 8}, label: '1 week'},
  {value: {months: 1, days: 1}, label: '1 month'},
  {value: {months: 6, days: 1}, label: '6 months'},
  {value: {months: 6, days: 1}, label: 'more'},
];

const processTypes = [
  { value: 'creation', label: 'Creation' },
  { value: 'movement', label: 'Movement'},
  { value: 'short', label: 'Short Movement' },
  { value: 'decommission', label: 'Decommission' },
  { value: 'maintenance', label: 'Maintenance'}
];

const LiveProcesses = ({ user }) => {
  const classes = useStyles();
  const loggedUserId = user.id;
  const [control, setControl] = useState({
    idLayoutEmployee: null,
    openLayoutEmployeesModal: false,
    layoutEmployeesRows: [],
    layoutEmployeesRowsSelected: [],
    //
    idLayoutStage: null,
    openLayoutStagesModal: false,
    layoutStagesRows: [],
    layoutStagesRowsSelected: [],
    //
    idProcessLive: null,
    openProcessLiveModal: false,
    processLiveRows: [],
    ProcessLiveRowsSelected: [],
    //
    // idProcessApprovalsLive: null,
    // openProcessLiveModal: false,
    processLiveApprovalsFulfilledRows: [],
    ProcessLiveApprovalsFulfilledRowsSelected: [],
    //
    processLiveApprovalsNotFulfilledRows: [],
    ProcessLiveApprovalsNotFulfilledRowsSelected: [],
  });

  const [allAlerts, setAllAlerts] = useState([]);
  const [complementaryValues, setComplementaryValues] = useState({});
  const [processFilters, setProcessFilters] = useState({
    processType: null,
    stage: null,
    overdue: null
  });
  const [tableControl, setTableControl] = useState({
    processLive: {
      collection: 'processes',
      total: 0,
      page: 0,
      rowsPerPage: 5,
      orderBy: 'folio',
      order: 1,
      search: '',
      searchBy: '',
    },
    pendingApprovals: {
      collection: 'processes',
      total: 0,
      page: 0,
      rowsPerPage: 5,
      orderBy: 'folio',
      order: 1,
      search: '',
      searchBy: '',
    },
    fulfilledApprovals: {
      collection: 'processes',
      total: 0,
      page: 0,
      rowsPerPage: 5,
      orderBy: 'folio',
      order: 1,
      search: '',
      searchBy: '',
    }
  });

  const liveProcessesHeadRows = [
    { id: "folio", numeric: false, disablePadding: false, label: "Folio",},
    { id: "name", numeric: false, disablePadding: false, label: "Name", searchBy: 'processData.name'},
    { id: "type", numeric: false, disablePadding: false, label: "Type", searchBy: 'processData.selectedProcessType'},
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
    { id: "status", numeric: false, disablePadding: false, label: "Status", searchBy: 'processData.processStatus'},
    { id: "alert", numeric: false, disablePadding: false, label: "Alert", searchByDisabled: true, searchBy: 'dueDate', renderCell: (value) => {
      const biggerThan = allAlerts.filter((element) => (value*-1) >= Number(element.days)).map(({days}) => days);
      const alertToApply =  Math.max(...biggerThan);
      const alert = allAlerts.find(({days}) => days === alertToApply.toString());
      return (
        <div style={{ display:'table-cell', verticalAlign: 'middle', textAlign:'center', padding: '16px', borderBottom: '1px solid rgba(224, 224, 224, 1)'}}>
          {
            typeof value === "number" && alert && 
            <Chip
              icon={ value ? <Notification/> : null }
              label={value ? `${value*-1} days` : 'No DueDate'}
              style={{ backgroundColor: alert?.color || '#B1B1B1', height: '28px'}}
              color='secondary'
            />
          }
        </div>
      ) 
    }},
    { id: "creator", numeric: false, disablePadding: false, label: "Creator", searchBy: 'creationUserFullName'},
    { id: "creation_date", numeric: false, disablePadding: false, label: "Creation Date", searchByDisabled: true},
    { id: "updateDate", numeric: false, disablePadding: false, label: "Update Date", searchByDisabled: true}
  ];

  const [tab, setTab] = useState(0);
  const tableActions = (collectionName) => {
    const collection = collections[collectionName];
    return {
      onAdd() {
        setControl({ ...control, [collection.id]: null, [collection.modal]: true })
      },
      onEdit(id) {
        setControl({ ...control, [collection.id]: id, [collection.modal]: true })
      },
      onDelete(id) {
        if (!id || !Array.isArray(id)) return;
        id.forEach(_id => {
          deleteDB(`${collection.name}/`, _id)
            .then(response => loadLayoutsData('processLive'))
            .catch(error => console.log('Error', error));
        });
      },
      onSelect(id) {
        if (collectionName === 'references') {
          // setReferencesSelectedId(id);
        }
      }
    }
  };
  const loadLayoutsData = (collectionNames = ['processLive', 'processApprovals']) => {
    collectionNames =  !Array.isArray(collectionNames) ? [collectionNames] : collectionNames;
    collectionNames.forEach(collectionName => {
      if (collectionName === 'processLive') {
        const condition = [{'requestUser.id': loggedUserId }];
        let queryLike = '';

        if (processFilters.processType) {
          condition.push({'processData.selectedProcessType': processFilters.processType.value});
        }
        if (processFilters.stage) {
          condition.push({'selectedProcess': { '$in': complementaryValues.processesWithStage}});
        }
        if (processFilters.overdue) {
          if(processFilters.overdue.label === 'more'){
            condition.push({'dueDate': { '$lte': `${complementaryValues.overdue}`}});
          }
          else {
            condition.push({'dueDate': { '$gte': `${complementaryValues.overdue}`}});
          }
        }

        queryLike = tableControl.processLive.searchBy ? (
          [{ 
            key: liveProcessesHeadRows.find(({id}) => tableControl.processLive.searchBy === id).searchBy || tableControl.processLive.searchBy, 
            value: tableControl.processLive.search 
          }]
        ) : (
          ['processData.name', 'folio', 'selectedProcessType'].map(key => ({ key, value: tableControl.processLive.search }))
        )
     
        getCountDB({
          collection: collectionName,
          queryLike: tableControl[collectionName].search ? queryLike : null,
          condition
        })
          .then(response => response.json())
          .then(data => {
            setTableControl(prev => ({
              ...prev,
              [collectionName]: {
                ...prev[collectionName],
                total: data.response.count
              }
            }));
          });

        getDBComplex({
          collection: collectionName, 
            limit: tableControl[collectionName].rowsPerPage,
            skip: tableControl[collectionName].rowsPerPage * tableControl[collectionName].page,
            sort: [{ key: tableControl[collectionName].orderBy, value: tableControl[collectionName].order}],
            queryLike: tableControl[collectionName].search ? queryLike : null,
            condition
         })
          .then(response => response.json())
          .then(data => {
            const rows = data.response.map(row => {
              const { _id: id, processData: { name, selectedProcessType, processStatus }, creationUserFullName, creationDate, dueDate, updateDate, folio} = row;
              const localDate = String(new Date(creationDate)).split('GMT')[0];
              const update_date = String(new Date(updateDate)).split('GMT')[0];
              const pastDue = differenceInDays(new Date(dueDate), new Date());
              const approvalsPerStage = Object.values(row.processData.stages).map(({stageName, approvals}) => ({name: stageName, users: approvals.map(({name, lastName, fulfilled}) => `${name} ${lastName} (${fulfilled ? 'Fulfilled' : 'Pending'})`) }));
              const notificationsPerStage = Object.values(row.processData.stages).map(({stageName, notifications}) => ({name: stageName, users: notifications.map(({name, lastName, sent}) => `${name} ${lastName} (${sent ? 'Sent' : 'Pending'})`) }));
              return createLiveProcessesHeadRows(id, folio, name, selectedProcessType, notificationsPerStage, approvalsPerStage, processStatus, pastDue, creationUserFullName, localDate, update_date);
            });
            setControl(prev => ({ ...prev, processLiveRows: rows, ProcessLiveRowsSelected: [] }));
          })
          .catch(error => console.log('error>', error));
      }
      if (collectionName === 'processApprovals') {
        const approvals = [
          { fulfilled: true, controlArray: 'processLiveApprovalsFulfilledRows', controlKey: 'fulfilledApprovals'},
          { fulfilled: false, controlArray: 'processLiveApprovalsNotFulfilledRows', controlKey: 'pendingApprovals' }
        ];
        approvals.forEach(({ fulfilled, controlArray, controlKey }) => {
          const queryNotFulfilled = [{ key: 'userId', value: loggedUserId }, { key: 'fulfilled', value: fulfilled }];
          getDBComplex({ collection: collectionName, queryExact: queryNotFulfilled, operator: '$and' })
            .then(response => response.json())
            .then(data => {
              const processLive = data.response.map(({ processId }) => processId);
              const condition = [{ "processLiveId": { "$in": processLive }}];

              if( processFilters.processType){
                condition.push({'processData.selectedProcessType': processFilters.processType.value});
              }
              if (processFilters.stage) {
                condition.push({'selectedProcess': { '$in': complementaryValues.processesWithStage}});
              }
              if (processFilters.overdue) {
                if(processFilters.overdue.label === 'more'){
                  condition.push({'dueDate': { '$lte': `${complementaryValues.overdue}`}});
                }
                else {
                  condition.push({'dueDate': { '$gte': `${complementaryValues.overdue}`}});
                }
              }

              let queryLike = '';
              queryLike = tableControl[controlKey].searchBy ? (
                [{ 
                  key: liveProcessesHeadRows.find(({id}) => tableControl[controlKey].searchBy === id).searchBy || tableControl[controlKey].searchBy , 
                  value: tableControl[controlKey].search 
                }]
              ) : (
                ['processData.name', 'folio', 'selectedProcessType'].map(key => ({ key, value: tableControl[controlKey].search }))
              )
              getCountDB({
                collection: 'processLive',
                queryLike: tableControl[controlKey].search ? queryLike : null,
                condition
              })
                .then(response => response.json())
                .then(data => {
                  setTableControl(prev => ({
                    ...prev,
                    [controlKey]: {
                      ...prev[controlKey],
                      total: data.response.count
                    }
                  }));
                });

              getDBComplex({
                collection: 'processLive', 
                  limit: tableControl[controlKey].rowsPerPage,
                  skip: tableControl[controlKey].rowsPerPage * tableControl[controlKey].page,
                  sort: [{ key: tableControl[controlKey].orderBy, value: tableControl[controlKey].order }],
                  queryLike: tableControl[controlKey].search ? queryLike : null,
                condition
              })
                .then(response => response.json())
                .then(data => {
                    const rows = data.response.map(row => {
                    const { _id: id, processData: { name, selectedProcessType, processStatus },  creationUserFullName, creationDate, updateDate, dueDate, folio} = row;
                    const localDate = String(new Date(creationDate)).split('GMT')[0];
                    const update_date = String(new Date(updateDate)).split('GMT')[0];
                    const pastDue = differenceInDays(new Date(dueDate), new Date());
                    const approvalsPerStage = Object.values(row.processData.stages).map(({stageName, approvals}) => ({name: stageName, users: approvals.map(({name, lastName, fulfilled}) => `${name} ${lastName} (${fulfilled ? 'Fulfilled' : 'Pending'})`) }));
                    const notificationsPerStage = Object.values(row.processData.stages).map(({stageName, notifications}) => ({name: stageName, users: notifications.map(({name, lastName, sent}) => `${name} ${lastName} (${sent ? 'Sent' : 'Pending'})`) }));
                    return createLiveProcessesHeadRows(id, folio, name, selectedProcessType, notificationsPerStage, approvalsPerStage, processStatus, pastDue, creationUserFullName, localDate, update_date);
                  });
                  setControl(prev => ({ ...prev, [controlArray]: rows, ProcessLiveApprovalsRowsSelected: [] }));
                })
                .catch(error => console.log('error>', error));
            })
            .catch(error => console.log('error>', error));
        });
      }
    });
  };

  const handleChangeProcessFilters = (name, value) => {
    setProcessFilters(prev => ({...prev, [name]: value}));
  };

  useEffect(() => {
    getDB('settingsProcesses')
    .then(response => response.json())
    .then(data => {
      setAllAlerts(data.response[0].alerts || []);
    })
    .catch(error => console.log(error));

    const fields = [{ key: '_id', value: 1 }, { key: 'name', value: 1 }];  

    getDBComplex({collection: 'processStages', fields})
      .then(response => response.json())
      .then(data => {
        const processedStagesInfo = data.response.map(({ _id, name }) => ({ value: _id, label: name }));
        setComplementaryValues((prev) => ({...prev, processedStagesInfo}));
      })
    .catch(error => console.log(error));
    loadLayoutsData();
  }, []);

  useEffect(() => {
    if(processFilters.stage){
      const condition = [{ processStages: { $elemMatch: { id: processFilters.stage.value }}}];
      const fields = [{ key: '_id', value: 1 }];
      getDBComplex({collection: 'processes', condition, fields})
      .then(response => response.json())
      .then(data => {
        const processesWithStage = data.response.map(({ _id }) => _id);
        setComplementaryValues((prev) => ({...prev, processesWithStage}));
      })
    .catch(error => console.log(error));
    }
    else {
      setComplementaryValues((prev) => ({...prev, processesWithStage: []}));
    }
  }, [processFilters.stage])

  useEffect(() => {
    if(processFilters.overdue) {
      const fecha = sub(new Date(), processFilters.overdue.value).toISOString();
      setComplementaryValues((prev) => ({...prev, overdue: fecha}))
    }
    else {
      setComplementaryValues((prev) => ({...prev, overdue: ''}))
    }
  }, [processFilters.overdue])

  useEffect(() => {
    loadLayoutsData();
  }, [processFilters.processType, complementaryValues.processesWithStage, complementaryValues.overdue])

  useEffect(() => {
    loadLayoutsData('processLive');
  }, [tableControl.processLive.page, tableControl.processLive.rowsPerPage, tableControl.processLive.order, tableControl.processLive.orderBy, tableControl.processLive.search]);

  useEffect(() => {
    loadLayoutsData('processApprovals');
  }, [tableControl.pendingApprovals.page, tableControl.pendingApprovals.rowsPerPage, tableControl.pendingApprovals.order, tableControl.pendingApprovals.orderBy, tableControl.pendingApprovals.search]);

  useEffect(() => {
    loadLayoutsData('processApprovals');
  }, [tableControl.fulfilledApprovals.page, tableControl.fulfilledApprovals.rowsPerPage, tableControl.fulfilledApprovals.order, tableControl.fulfilledApprovals.orderBy, tableControl.fulfilledApprovals.search]);

  return (
    <div>
      <Portlet>
        <div style={{display: 'flex', justifyContent: 'space-around', alignContent: 'center', padding: '20px'}}>
          <div>
          <Typography style={{margin: '5px'}}>Type:</Typography>
            <Select
              className={classes.select}
              classNamePrefix="select"
              isClearable={true}
              menuPosition="absolute"
              name="KPI"
              onChange={(value) => handleChangeProcessFilters('processType', value)}
              value={processFilters.processType}
              options={processTypes}
            />
          </div>
          <div>
          <Typography style={{margin: '5px'}}>Stage:</Typography>
            <Select
              className={classes.select}
              classNamePrefix="select"
              isClearable={true}
              menuPosition="absolute"
              name="KPI"
              onChange={(value) => handleChangeProcessFilters('stage', value)}
              value={processFilters.stage}
              options={complementaryValues.processedStagesInfo}
            />
          </div> <div>
            <Typography style={{margin: '5px'}}>Overdue:</Typography>
            <Select
              className={classes.select}
              classNamePrefix="select"
              isClearable={true}
              menuPosition="absolute"
              name="KPI"
              onChange={(value) => handleChangeProcessFilters('overdue', value)}
              value={processFilters.overdue}
              options={overdueFilter}
            />
          </div>
        </div>
        <PortletHeader
          toolbar={
            <PortletHeaderToolbar>
              <Tabs
                component="div"
                className="builder-tabs"
                value={tab}
                onChange={(_, nextTab) => {
                  setTab(nextTab);
                }}
              >
                <Tab label="My Requests" />
                <Tab label="Pending Approvals" />
                <Tab label="Fulfilled Approvals" />
              </Tabs>
            </PortletHeaderToolbar>
          }
        />
        {/* Employees Layout */}
        <ModalProcessesLive
          showModal={control.openProcessLiveModal}
          setShowModal={(onOff) => setControl({ ...control, openProcessLiveModal: onOff })}
          reloadTable={() => {
            loadLayoutsData()
          }}
          // reloadTable={() => loadLayoutsData()}
          id={control.idProcessLive}
          // employeeProfileRows={[]}
        />
        {tab === 0 && (
          <PortletBody>
            <div className="kt-section kt-margin-t-0">
              <div className="kt-section__body">
                <div className="kt-section">
                  <div className="kt-section__content">
                     <TableComponent2
                        controlValues={tableControl.processLive}
                        headRows={liveProcessesHeadRows}
                        onAdd={tableActions('processLive').onAdd}
                        onDelete={tableActions('processLive').onDelete}
                        onEdit={tableActions('processLive').onEdit}
                        onSelect={tableActions('processLive').onSelect}
                        paginationControl={({ rowsPerPage, page }) =>
                          setTableControl(prev => ({
                            ...prev,
                            processLive: {
                              ...prev.processLive,
                              rowsPerPage: rowsPerPage,
                              page: page,
                            }
                          }))
                        }
                        rows={control.processLiveRows}
                        searchControl={({ value, field }) => {
                          setTableControl(prev => ({
                            ...prev,
                            processLive: {
                              ...prev.processLive,
                              search: value,
                              searchBy: field,
                            }
                          }))
                        }}
                        sortByControl={({ orderBy, order }) => {
                          setTableControl(prev => ({
                            ...prev,
                            processLive: {
                              ...prev.processLive,
                              orderBy: orderByCorrection[orderBy] ? orderByCorrection[orderBy] : orderBy,
                              order: order,
                            }
                          }))
                        }}
                        title={'My Processes Requests'}
                      />
                  </div>
                </div>
              </div>
            </div>
          </PortletBody>
        )}
        {/* Process Stages Layouts */}
        {tab === 1 && (
          <PortletBody>
            <div className="kt-section kt-margin-t-0">
              <div className="kt-section__body">
                <div className="kt-section">
                  <div className="kt-section__content">
                    <TableComponent2
                        controlValues={tableControl.pendingApprovals}
                        headRows={liveProcessesHeadRows}
                        noAdd
                        noDelete
                        onEdit={tableActions('processLive').onEdit}
                        onSelect={tableActions('processLive').onSelect}
                        paginationControl={({ rowsPerPage, page }) =>
                          setTableControl(prev => ({
                            ...prev,
                            pendingApprovals: {
                              ...prev.pendingApprovals,
                              rowsPerPage: rowsPerPage,
                              page: page,
                            }
                          }))
                        }
                        rows={control.processLiveApprovalsNotFulfilledRows}
                        searchControl={({ value, field }) => {
                          setTableControl(prev => ({
                            ...prev,
                            pendingApprovals: {
                              ...prev.pendingApprovals,
                              search: value,
                              searchBy: field,
                            }
                          }))
                        }}
                        sortByControl={({ orderBy, order }) => {
                          setTableControl(prev => ({
                            ...prev,
                            pendingApprovals: {
                              ...prev.pendingApprovals,
                              orderBy: orderByCorrection[orderBy] ? orderByCorrection[orderBy] : orderBy,
                              order: order,
                            }
                          }))
                        }}
                        title={'Process Pending Approval'}
                      />
                  </div>
                </div>
              </div>
            </div>
          </PortletBody>
        )}
        {/* Locations templates regarding assets */}
        {tab === 2 && (
          <PortletBody>
            <div className="kt-section kt-margin-t-0">
              <div className="kt-section__body">
                <div className="kt-section">
                  <div className="kt-section__content">
                    <TableComponent2
                        controlValues={tableControl.fulfilledApprovals}
                        headRows={liveProcessesHeadRows}
                        noAdd
                        noDelete
                        onEdit={tableActions('processLive').onEdit}
                        onSelect={tableActions('processLive').onSelect}
                        paginationControl={({ rowsPerPage, page }) =>
                          setTableControl(prev => ({
                            ...prev,
                            fulfilledApprovals: {
                              ...prev.fulfilledApprovals,
                              rowsPerPage: rowsPerPage,
                              page: page,
                            }
                          }))
                        }
                        rows={control.processLiveApprovalsFulfilledRows}
                        searchControl={({ value, field }) => {
                          setTableControl(prev => ({
                            ...prev,
                            fulfilledApprovals: {
                              ...prev.fulfilledApprovals,
                              search: value,
                              searchBy: field,
                            }
                          }))
                        }}
                        sortByControl={({ orderBy, order }) => {
                          setTableControl(prev => ({
                            ...prev,
                            fulfilledApprovals: {
                              ...prev.fulfilledApprovals,
                              orderBy: orderByCorrection[orderBy] ? orderByCorrection[orderBy] : orderBy,
                              order: order,
                            }
                          }))
                        }}
                        title={'Process Fulfilled Approval'}
                      />
                  </div>
                </div>
              </div>
            </div>
          </PortletBody>
        )}
      </Portlet>
    </div>
  );
}

const mapStateToProps = ({ auth: { user } }) => ({ user });

export default connect(mapStateToProps)(LiveProcesses);
