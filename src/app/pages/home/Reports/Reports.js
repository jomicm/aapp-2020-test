/* eslint-disable no-restricted-imports */
import React, { useMemo, useState, useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Formik, setNestedObjectValues } from "formik";
import { get, merge } from "lodash";
import { FormHelperText, Switch, Tab, Tabs, Styles } from "@material-ui/core";
import clsx from "clsx";
import { metronic, initLayoutConfig, LayoutConfig } from "../../../../_metronic";
import {
  Portlet,
  PortletBody,
  PortletFooter,
  PortletHeader,
  PortletHeaderToolbar
} from "../../../partials/content/Portlet";

// AApp Components
import { TabsTitles } from '../Components/Translations/tabsTitles';
import TableComponent from '../Components/TableComponent';
// import ModalAssetCategories from './modals/ModalAssetCategories';
// import ModalAssetReferences from './modals/ModalAssetReferences';
// import ModalAssetList from './modals/ModalAssetList';

import TreeView from '../Components/TreeViewComponent';
import GoogleMaps from '../Components/GoogleMaps';
// import './Assets.scss';

//Icons
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from '@material-ui/icons/Delete';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';


//Custom Fields Preview
import {
  SingleLine,
  MultiLine,
  Date,
  DateTime,
  DropDown,
  RadioButtons,
  Checkboxes,
  FileUpload,
  SingleLineSettings,
  MultiLineSettings,
  DateSettings,
  DateTimeSettings,
  DropDownSettings,
  RadioButtonsSettings,
  CheckboxesSettings,
  FileUploadSettings
} from '../Components/CustomFields/CustomFieldsPreview';
import SwipeableViews from "react-swipeable-views";

//DB API methods
import { getDB, deleteDB } from '../../../crud/api';
import ModalYesNo from '../Components/ModalYesNo';
import TabGeneral from './TabGeneral';

import ModalReportsSaved from './modals/ModalReportsSaved'

const localStorageActiveTabKey = "builderActiveTab";

const Reports = () => {

  const activeTab = localStorage.getItem(localStorageActiveTabKey);
  const [tab, setTab] = useState(activeTab ? +activeTab : 0);
  const [id, setId] = useState(null)
  const dispatch = useDispatch();
  const { layoutConfig } = useSelector(
    ({ builder }) => ({ layoutConfig: builder.layoutConfig }),
    shallowEqual
  );
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [loadingButtonPreviewStyle, setLoadingButtonPreviewStyle] = useState({
    paddingRight: "2.5rem"
  });
  const [loadingReset, setLoadingReset] = useState(false);
  const [loadingButtonResetStyle, setLoadingButtonResetStyle] = useState({
    paddingRight: "2.5rem"
  });

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
        // Fulfill changeable fields.
        LayoutConfig,
        layoutConfig
      ),
    [layoutConfig]
  );
 
  const createReportSavedRow = (id, name, creator, creationDate, autoMessage) => {
    return { id, name, creator, creationDate, autoMessage };
  };

  const assetSavedHeadRows = [
    { id: "name", numeric: false, disablePadding: false, label: "Name" },
    { id: "creator", numeric: false, disablePadding: false, label: "Creator" },
    { id: "creationDate", numeric: false, disablePadding: false, label: "Creation Date" },
    { id: "autoMessage", numeric: false, disablePadding: false, label: "Auto Message" }
  ];

  // const assetSavedRows = [
  //   createAssetSavedRow('Laptop', 'Acer', 'vhrf12', 'Electronics', 'SN: 12131', 'ABCDEF123', 'Admin', '11/03/2020'),
  //   createAssetSavedRow('Chair',  'PMP', 'derds25', 'Furniture', 'SN: 2343', 'ABCDEF124', 'Admin', '11/03/2020'),
  //   createAssetSavedRow('Pump',  'CKT', 'wedsd52', 'Vehicles', 'SN: 435665', 'ABCDEF125', 'Admin', '11/03/2020'),
  // ];
  
  const [openSavedModal, setOpenSavedModal] = useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const loadInitData = (collectionNames = ['reports']) => {
    collectionNames =  !Array.isArray(collectionNames) ? [collectionNames] : collectionNames;
    collectionNames.forEach(collectionName => {
      getDB(collectionName)
      .then(response => response.json())
      .then(data => {
        if (collectionName === 'reports') {
          // console.log('d:', data)
          const rows = data.response.map((row) => {
            const { _id, selectReport, reportEnabled } = row
            const cast = reportEnabled ? 'Yes' : 'No'
            // return createAssetSavedRow(row._id, row.name, row.brand, row.model, row.category, row.serial, row.EPC, 'Admin', '11/03/2020');
            return createReportSavedRow(_id, selectReport, 'Admin', '11/03/2020', cast)
          });
          setControl((prev) => ({ ...prev, savedRows: rows, savedRowsSelected: [] }));
          console.log('inside assets', rows)
        }
      })
      .catch(error => console.log('error>', error));
    });
  };

  useEffect(() => {
    loadInitData();
  }, []);

  // const [control, setControl] = useState({
  //   idReference: null,
  //   openReferencesModal: false,
  //   referenceRows: [],
  //   referenceRowsSelected: [],
  //   //
  //   idCategory: null,
  //   openCategoriesModal: false,
  //   categoryRows: [],
  //   categoryRowsSelected: [],
  //   //
  //   idAsset: null,
  //   openAssetsModal: false,
  //   assetRows: [],
  //   assetRowsSelected: [],
  // });

  const [control, setControl] = useState({
    idSaved: null,
    openSavedModal: false,
    savedRows: [],
    savedRowsSelected: [],
  })

  const [referencesSelectedId, setReferencesSelectedId] = useState(null);
  const [selectReferenceConfirmation, setSelectReferenceConfirmation] = useState(false);

  // const collections = {
  //   references: {
  //     id: 'idReference',
  //     modal: 'openReferencesModal',
  //     name: 'references'
  //   },
  //   categories: {
  //     id: 'idCategory',
  //     modal: 'openCategoriesModal',
  //     name: 'categories'
  //   },
  //   assets: {
  //     id: 'idAsset',
  //     modal: 'openAssetsModal',
  //     name: 'assets'
  //   },
  // };

  const collections = {
    saved: {
      id: 'idSaved',
      modal: 'openSavedModal',
      name: 'saved'
    }
  }

  const tableActions = (collectionName) => {
    const collection = collections[collectionName];
    return {
      onAdd() {
        setControl({
          ...control,
          [collection.id]: null,
          [collection.modal]: true,
        });
      },
      onEdit(id) {
        setControl({
          ...control,
          [collection.id]: id,
          [collection.modal]: true,
        });
      },
      onGenerateReport(id) {
        setControl({
          ...control,
          [collection.id]: id
        });
        setId(id)
        setTab(0)
      },
      onDelete(id) {
        if (!id || !Array.isArray(id)) return;
        id.forEach((_id) => {
          deleteDB(`${collection.name}/`, _id)
            .then((response) => loadInitData(collection.name))
            .catch((error) => console.log('Error', error));
        });
      },
      onSelect(id) {
        if (collectionName === 'saved') {
        }
      },
    };
  };

  const handleSave = () => {
    alert('SAVED')
  }

  return (
    <>
      <ModalYesNo
        showModal={selectReferenceConfirmation}
        onOK={() => setSelectReferenceConfirmation(false)}
        onCancel={() => setSelectReferenceConfirmation(false)}
        title={'Add New Report'}
        message={'Please first select a Reference from the next tab'}
      />
      <ModalReportsSaved
        id={control.idSaved}
        employeeProfileRows={[]}
        module={module}
        reloadTable={() => loadInitData('reports')}
        setShowModal={(onOff) =>
          setControl({ ...control, openSavedModal: onOff })
        }
        showModal={control.openSavedModal}
      />
      {/*Formic off site: https://jaredpalmer.com/formik/docs/overview*/}
      <Formik
        initialValues={initialValues}
        onSubmit={values => {
          enableLoadingPreview();
          updateLayoutConfig(values);
        }}
        onReset={() => {
          enableLoadingReset();
          updateLayoutConfig(initLayoutConfig);
        }}
      >
        {({ values, handleReset, handleSubmit, handleChange, handleBlur }) => (
          <div className="kt-form kt-form--label-right">
            <Portlet>
              <PortletHeader
                toolbar={
                  <PortletHeaderToolbar>
                    <Tabs
                      component="div"
                      className="builder-tabs"
                      value={tab}
                      onChange={(_, nextTab) => {
                        setTab(nextTab);
                        localStorage.setItem(localStorageActiveTabKey, nextTab);
                      }}
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
                        <TabGeneral id={id} saveData={handleSave}/>
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
                            {/* <ModalAssetReferences
                              showModal={control.openReferencesModal}
                              setShowModal={(onOff) => setControl({ ...control, openReferencesModal: onOff })}
                              reloadTable={() => loadAssetsData('references')}
                              id={control.idReference}
                              categoryRows={control.categoryRows}
                            /> */}
                            <div className="kt-separator kt-separator--dashed"/>
                            <div className="kt-section__content">
                              <TableComponent 
                                title={'Reports'}
                                headRows={assetSavedHeadRows}
                                // rows={control.savedRows}
                                rows={control.savedRows}
                                onEdit={tableActions('saved').onEdit}
                                noAdd
                                onDelete={tableActions('saved').onDelete}
                                onSelect={tableActions('saved').onSelect}
                                onGenerateReport={tableActions('saved').onGenerateReport}
                                showGenerateReport={true}
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
                    type="button"
                    onClick={handleSubmit}
                    style={loadingButtonPreviewStyle}
                    className={`btn btn-primary btn-elevate kt-login__btn-primary ${clsx(
                      {
                        "kt-spinner kt-spinner--right kt-spinner--md kt-spinner--light": loadingPreview
                      }
                    )}`}
                  >
                    <i className="la la-eye" /> Preview
                  </button>{" "}
                  <button
                    type="button"
                    onClick={handleReset}
                    style={loadingButtonResetStyle}
                    className={`btn btn-secondary btn-elevate kt-login__btn-primary ${clsx(
                      {
                        "kt-spinner kt-spinner--right kt-spinner--md kt-spinner--dark": loadingReset
                      }
                    )}`}
                  >
                    <i className="la la-recycle" /> Reset
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
