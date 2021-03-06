import React, { useEffect, useState } from "react";
import { connect, shallowEqual, useSelector } from "react-redux";
import { uniq } from 'lodash';
import { utcToZonedTime } from 'date-fns-tz';
import { Tabs } from "@material-ui/core";
import {
  Portlet,
  PortletBody,
  PortletHeader,
  PortletHeaderToolbar
} from "../../../partials/content/Portlet";
import { deleteDB, getDBComplex, getCountDB, getDB, getOneDB } from '../../../crud/api';
import { TabsTitles } from '../Components/Translations/tabsTitles';
import TableComponent2 from '../Components/TableComponent2';
import ModalYesNo from '../Components/ModalYesNo';
import TabGeneral from './TabGeneral';
import ModalReportsSaved from './modals/ModalReportsSaved'

const Reports = ({ user }) => {
  const [control, setControl] = useState({
    idReports: null,
    openReportsModal: false,
    reportsRows: [],
    reportsRowsSelected: []
  });
  const [data, setData] = useState([]);
  const [dataModal, setDataModal] = useState({});
  const [reportToGenerate, setReportToGenerate] = useState([]);
  const [selectReferenceConfirmation, setSelectReferenceConfirmation] = useState(false);
  const [tab, setTab] = useState(0);
  const [userLocations, setUserLocations] = useState([]);
  const { layoutConfig } = useSelector(
    ({ builder }) => ({ layoutConfig: builder.layoutConfig }),
    shallowEqual
  );

  const assetSavedHeadRows = [
    { id: "name", numeric: false, disablePadding: false, label: "Name" },
    { id: "creator", numeric: false, disablePadding: false, label: "Creator", searchByDisabled: true },
    { id: "creationDate", numeric: false, disablePadding: false, label: "Creation Date", searchByDisabled: true },
    { id: "autoMessage", numeric: false, disablePadding: false, label: "Auto Message" }
  ];

  const collections = {
    reports: {
      id: 'idReports',
      modal: 'openReportsModal',
      name: 'reports'
    }
  }

  const createReportSavedRow = (id, name, creator, creationDate, autoMessage) => {
    return { id, name, creator, creationDate, autoMessage };
  };

  const [tableControl, setTableControl] = useState({
    reports: {
      collection: 'reports',
      total: 0,
      page: 0,
      rowsPerPage: 5,
      orderBy: 'name',
      order: 1,
      search: '',
      searchBy: '',
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
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));
  };

  const loadReportsData = (collectionNames = ['reports']) => {
    collectionNames = !Array.isArray(collectionNames) ? [collectionNames] : collectionNames;
    collectionNames.forEach(collectionName => {
      let queryLike = '';
      let searchByFiltered = tableControl.reports.searchBy;
      let valueFiltered = tableControl.reports.search;
      let trueValues = ['y', 'ye', 'yes']
      let falseValues = ['n', 'no']
      if (trueValues.includes(valueFiltered)) {
        valueFiltered = true;
      }
      else if (falseValues.includes(valueFiltered)) {
        valueFiltered = false;
      }
      switch (tableControl.reports.searchBy) {
        case "name":
          searchByFiltered = 'reportName'
          break;
        case "autoMessage":
          searchByFiltered = 'enabled'
          break;
        default:
          searchByFiltered = searchByFiltered
          break;
      }
      if (collectionName === 'reports') {
        queryLike = tableControl.reports.searchBy ? (
          [{ key: searchByFiltered, value: valueFiltered }]
        ) : (
          ['reportName'].map(key => ({ key, value: valueFiltered }))
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

      let orderByFiltered = tableControl[collectionName].orderBy;
      switch (tableControl.reports.orderBy) {
        case "name":
          orderByFiltered = 'reportName'
          break;
        case "autoMessage":
          orderByFiltered = 'enabled'
          break;
        default:
          orderByFiltered = orderByFiltered
          break;
      }
            
      getDB('reports')
        .then(response => response.json())
        .then(data => {
          setData(data.response);
        })
        .catch(error => console.log('error>', error));

      getDBComplex({
        collection: collectionName,
        limit: tableControl[collectionName].rowsPerPage,
        skip: tableControl[collectionName].rowsPerPage * tableControl[collectionName].page,
        sort: [{ key: orderByFiltered, value: tableControl[collectionName].order }],
        queryLike: tableControl[collectionName].search ? queryLike : null
      })
        .then(response => response.json())
        .then(data => {
          const rows = data.response.map((row) => {
            const { _id, selectReport, reportName, enabled, creationUserFullName, creationDate } = row;
            const cast = enabled ? 'Yes' : 'No';
            const date = utcToZonedTime(creationDate).toLocaleString();
            return createReportSavedRow(_id, reportName, creationUserFullName, date, cast);
          });
          setControl((prev) => ({ ...prev, reportsRows: rows, reportsRowsSelected: [] }));
        })
        .catch(error => console.log('error>', error));
    });
  };

  const tableActions = (collectionName) => {
    const collection = collections[collectionName];
    return {
      onEdit(id) {
        setDataModal(data.filter((ele) => ele._id === id[0])[0])
        setControl({
          ...control,
          [collection.idReports]: id[0],
          [collection.modal]: true
        });
      },
      onGenerateReport(id) {
        setReportToGenerate(id[0]);
        setTab(0);
      },
      onDelete(id) {
        if (!id || !Array.isArray(id)) {
          return;
        }
        id.forEach((_id) => {
          deleteDB(`${collection.name}/`, _id)
            .then((response) => loadReportsData(collection.name))
            .catch((error) => console.log('Error', error));
        });
      }
    };
  };

  useEffect(() => {
    loadReportsData();
    loadUserLocations();
  }, []);

  useEffect(() => {
    loadReportsData();
  }, [tableControl.reports.page, tableControl.reports.rowsPerPage, tableControl.reports.order, tableControl.reports.orderBy, tableControl.reports.search, tableControl.reports.locationsFilter]);

  return (
    <>
      <ModalYesNo
        message={'Please first select a Reference from the next tab'}
        onCancel={() => setSelectReferenceConfirmation(false)}
        onOK={() => setSelectReferenceConfirmation(false)}
        showModal={selectReferenceConfirmation}
        title={'Add New Report'}
      />
      <ModalReportsSaved
        data={dataModal}
        module={module}
        reloadTable={() => loadReportsData('reports')}
        setShowModal={(onOff) =>
          setControl({ ...control, openReportsModal: onOff })
        }
        showModal={control.openReportsModal}
      />
      <div className="kt-form kt-form--label-right">
        <Portlet>
          <PortletHeader
            toolbar={
              <PortletHeaderToolbar>
                <Tabs
                  className="builder-tabs"
                  component="div"
                  onChange={(_, nextTab) => setTab(nextTab)}
                  value={tab}
                >
                  {TabsTitles('reports')}
                </Tabs>
              </PortletHeaderToolbar>
            }
          />
          {tab === 0 && (
            <PortletBody>
              <div className="kt-section kt-margin-t-0">
                <div className="kt-section__body">
                  <TabGeneral
                    id={reportToGenerate}
                    savedReports={data}
                    setId={setReportToGenerate}
                    reloadData={loadReportsData}
                    userLocations={userLocations}
                  />
                </div>
              </div>
            </PortletBody>
          )}
          {tab === 1 && (
            <PortletBody>
              <div className="kt-section kt-margin-t-0">
                <div className="kt-section__body">
                  <div className="kt-section">
                    <span className="kt-section__sub">
                      This section will integrate <code>Reports</code>
                    </span>
                    <div className="kt-separator kt-separator--dashed" />
                    <div className="kt-section__content">
                      <TableComponent2
                        controlValues={tableControl.reports}
                        headRows={assetSavedHeadRows}
                        onDelete={tableActions('reports').onDelete}
                        onEdit={tableActions('reports').onEdit}
                        onView={tableActions('reports').onGenerateReport}
                        onSelect={tableActions('reports').onSelect}
                        paginationControl={({ rowsPerPage, page }) =>
                          setTableControl(prev => ({
                            ...prev,
                            reports: {
                              ...prev.reports,
                              rowsPerPage: rowsPerPage,
                              page: page,
                            }
                          }))
                        }
                        rows={control.reportsRows}
                        searchControl={({ value, field }) => {
                          setTableControl(prev => ({
                            ...prev,
                            reports: {
                              ...prev.reports,
                              search: value,
                              searchBy: field,
                            }
                          }))
                        }}
                        sortByControl={({ orderBy, order }) => {
                          setTableControl(prev => ({
                            ...prev,
                            reports: {
                              ...prev.reports,
                              orderBy: orderBy,
                              order: order,
                            }
                          }))
                        }}
                        title={'Reports'}
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
}

const mapStateToProps = ({ auth: { user } }) => ({
  user
});

export default connect(mapStateToProps)(Reports);
