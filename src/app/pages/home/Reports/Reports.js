import React, { useMemo, useState, useEffect } from "react";
import { Formik, setNestedObjectValues } from "formik";
import { get, merge } from "lodash";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import clsx from "clsx";
import { FormHelperText, Switch, Tab, Tabs, Styles } from "@material-ui/core";
import { metronic, initLayoutConfig, LayoutConfig } from "../../../../_metronic";
import {
  Portlet,
  PortletBody,
  PortletFooter,
  PortletHeader,
  PortletHeaderToolbar
} from "../../../partials/content/Portlet";
import { getDB, deleteDB } from '../../../crud/api';
import { TabsTitles } from '../Components/Translations/tabsTitles';
import TableComponent from '../Components/TableComponent';
import ModalYesNo from '../Components/ModalYesNo';
import TabGeneral from './TabGeneral';
import ModalReportsSaved from './modals/ModalReportsSaved'

const localStorageActiveTabKey = "builderActiveTab";

const Reports = () => {

  const activeTab = localStorage.getItem(localStorageActiveTabKey);
  const [control, setControl] = useState({
    idReports: null,
    openReportsModal: false,
    reportsRows: [],
    reportsRowsSelected: []
  });
  const [data, setData] = useState([]);
  const [dataModal, setDataModal] = useState({});
  const [loadingButtonResetStyle, setLoadingButtonResetStyle] = useState({
    paddingRight: "2.5rem"
  });
  const [loadingButtonPreviewStyle, setLoadingButtonPreviewStyle] = useState({
    paddingRight: "2.5rem"
  });
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [loadingReset, setLoadingReset] = useState(false);
  const [reportToGenerate, setReportToGenerate] = useState([]);
  const [selectReferenceConfirmation, setSelectReferenceConfirmation] = useState(false);
  const [tab, setTab] = useState(activeTab ? +activeTab : 0);
  const { layoutConfig } = useSelector(
    ({ builder }) => ({ layoutConfig: builder.layoutConfig }),
    shallowEqual
  );

  const assetSavedHeadRows = [
    { id: "name", numeric: false, disablePadding: false, label: "Name" },
    { id: "creator", numeric: false, disablePadding: false, label: "Creator" },
    { id: "creationDate", numeric: false, disablePadding: false, label: "Creation Date" },
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

  const dispatch = useDispatch();

  const enableLoadingPreview = () => {
    setLoadingPreview(true);
    setLoadingButtonPreviewStyle({ paddingRight: "3.5rem" });
  };
  const enableLoadingReset = () => {
    setLoadingReset(true);
    setLoadingButtonResetStyle({ paddingRight: "3.5rem" });
  };
  const updateLayoutConfig = _config => {
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

  const loadInitData = (collectionNames = ['reports']) => {
    collectionNames =  !Array.isArray(collectionNames) ? [collectionNames] : collectionNames;
    collectionNames.forEach(collectionName => {
      getDB(collectionName)
        .then((response) => response.json())
        .then((data) => {
          setData(data.response);
            const rows = data.response.map((row) => {
              const { _id, selectReport, reportName, enabled } = row;
              const cast = enabled ? 'Yes' : 'No';
              return createReportSavedRow(_id, reportName, 'Admin', '11/03/2020', cast);
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
            .then((response) => loadInitData(collection.name))
            .catch((error) => console.log('Error', error));
        });
      }
    };
  };

  useEffect(() => {
    loadInitData();
  }, []);

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
        reloadTable={() => loadInitData('reports')}
        setShowModal={(onOff) =>
          setControl({ ...control, openReportsModal: onOff })
        }
        showModal={control.openReportsModal}
      />
      <Formik
        initialValues={initialValues}
        onReset={() => {
          enableLoadingReset();
          updateLayoutConfig(initLayoutConfig);
        }}
        onSubmit={values => {
          enableLoadingPreview();
          updateLayoutConfig(values);
        }}
      >
        {({ values, handleReset, handleSubmit, handleChange, handleBlur }) => (
          <div className="kt-form kt-form--label-right">
            <Portlet>
              <PortletHeader
                toolbar={
                  <PortletHeaderToolbar>
                    <Tabs
                      className="builder-tabs"
                      component="div"
                      onChange={(_, nextTab) => {
                        setTab(nextTab);
                        localStorage.setItem(localStorageActiveTabKey, nextTab);
                      }}
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
                          reloadData={loadInitData}
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
                            <div className="kt-separator kt-separator--dashed"/>
                            <div className="kt-section__content">
                              <TableComponent 
                                headRows={assetSavedHeadRows}
                                noAdd
                                onEdit={tableActions('reports').onEdit}
                                onGenerateReport={tableActions('reports').onGenerateReport}
                                onDelete={tableActions('reports').onDelete}
                                rows={control.reportsRows}
                                showGenerateReport={true}
                                title={'Reports'}
                              />
                            </div>
                        </div>
                    </div>
                  </div>
                </PortletBody>
              )}
              <PortletFooter>
                <div className="kt-padding-30 text-center">
                  <button
                    className={`btn btn-primary btn-elevate kt-login__btn-primary ${clsx(
                      {
                        "kt-spinner kt-spinner--right kt-spinner--md kt-spinner--light": loadingPreview
                      }
                      )}`}
                    onClick={handleSubmit}
                    style={loadingButtonPreviewStyle}
                    type="button"
                  >
                    <i className="la la-eye"/> Preview
                  </button>{" "}
                  <button
                    className={`btn btn-secondary btn-elevate kt-login__btn-primary ${clsx(
                      {
                        "kt-spinner kt-spinner--right kt-spinner--md kt-spinner--dark": loadingReset
                      }
                      )}`}
                    onClick={handleReset}
                    style={loadingButtonResetStyle}
                    type="button"
                      >
                    <i className="la la-recycle"/> Reset
                  </button>
                </div>
              </PortletFooter>
            </Portlet>
          </div>
        )}
      </Formik>
    </>
  );
}

export default Reports;
