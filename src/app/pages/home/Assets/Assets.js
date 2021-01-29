/* eslint-disable no-restricted-imports */
import React, { useMemo, useState, useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Formik, setNestedObjectValues } from "formik";
import { get, merge } from "lodash";
import { FormHelperText, Switch, Tab, Tabs, Styles, Button, Grid, responsiveFontSizes } from "@material-ui/core";
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
import TileView from '../Components/TileView';
import ModalAssetCategories from './modals/ModalAssetCategories';
import ModalAssetReferences from './modals/ModalAssetReferences';
import ModalAssetList from './modals/ModalAssetList';

import TreeView from '../Components/TreeViewComponent';
import GoogleMaps from '../Components/GoogleMaps';
import './Assets.scss';

//DB API methods
import { getDB, deleteDB } from '../../../crud/api';
import ModalYesNo from '../Components/ModalYesNo';

const localStorageActiveTabKey = "builderActiveTab";
export default function Assets() {

  const activeTab = localStorage.getItem(localStorageActiveTabKey);
  const [tab, setTab] = useState(activeTab ? +activeTab : 0);
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

  const createAssetCategoryRow = (id, name, depreciation, creator, creation_date) => {
    return { id, name, depreciation, creator, creation_date };
  };

  const assetCategoriesHeadRows = [
    { id: "name", numeric: false, disablePadding: false, label: "Description" },
    { id: "depreciation", numeric: true, disablePadding: false, label: "Depreciation" },
    { id: "creator", numeric: false, disablePadding: false, label: "Creator" },
    { id: "creation_date", numeric: false, disablePadding: false, label: "Creation Date" }
  ];

  const assetCategoriesRows = [
    createAssetCategoryRow('Laptop', '0.3', 'Admin', '11/03/2020'),
    createAssetCategoryRow('Chair', '0.25', 'Admin', '11/03/2020'),
    createAssetCategoryRow('Pump', '0.44', 'Admin', '11/03/2020'),
  ];

  const createAssetReferenceRow = (id, name, brand, model, category, creator, creation_date) => {
    return { id, name, brand, model, category, creator, creation_date };
  };

  const assetReferencesHeadRows = [
    { id: "name", numeric: false, disablePadding: false, label: "Name" },
    { id: "brand", numeric: true, disablePadding: false, label: "Brand" },
    { id: "model", numeric: true, disablePadding: false, label: "Model" },
    { id: "category", numeric: true, disablePadding: false, label: "Category" },
    { id: "creator", numeric: false, disablePadding: false, label: "Creator" },
    { id: "creation_date", numeric: false, disablePadding: false, label: "Creation Date" }
  ];

  const assetReferencesRows = [
    createAssetReferenceRow('Laptop', 'Acer', 'vhrf12', 'Electronics', 'Admin', '11/03/2020'),
    createAssetReferenceRow('Chair', 'PMP', 'derds25', 'Furniture', 'Admin', '11/03/2020'),
    createAssetReferenceRow('Pump', 'CKT', 'wedsd52', 'Vehicles', 'Admin', '11/03/2020'),
  ];

  const createAssetListRow = (id, name, brand, model, category, serial, EPC, creator, creation_date, location) => {
    return { id, name, brand, model, category, serial, EPC, creator, creation_date, location};
  };

  const assetListHeadRows = [
    { id: "name", numeric: false, disablePadding: false, label: "Name" },
    { id: "brand", numeric: true, disablePadding: false, label: "Brand" },
    { id: "model", numeric: true, disablePadding: false, label: "Model" },
    { id: "category", numeric: true, disablePadding: false, label: "Category" },
    { id: "serial", numeric: true, disablePadding: false, label: "Serial Number" },
    { id: "EPC", numeric: true, disablePadding: false, label: "EPC" },
    { id: "creator", numeric: false, disablePadding: false, label: "Creator" },
    { id: "creation_date", numeric: false, disablePadding: false, label: "Creation Date" }
  ];

  const assetListRows = [
    createAssetListRow('Laptop', 'Acer', 'vhrf12', 'Electronics', 'SN: 12131', 'ABCDEF123', 'Admin', '11/03/2020'),
    createAssetListRow('Chair', 'PMP', 'derds25', 'Furniture', 'SN: 2343', 'ABCDEF124', 'Admin', '11/03/2020'),
    createAssetListRow('Pump', 'CKT', 'wedsd52', 'Vehicles', 'SN: 435665', 'ABCDEF125', 'Admin', '11/03/2020'),
  ];

  const [openCategoriesModal, setOpenCategoriesModal] = useState(false);
  const [openListModal, setOpenListModal] = useState(false);
  const [openReferencesModal, setOpenReferencesModal] = useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);

  let locations;
  const [locationsTree, setLocationsTree] = useState({});
  const loadAssetsData = (collectionNames = ['assets', 'references', 'categories', 'locationsReal']) => {
    collectionNames = !Array.isArray(collectionNames) ? [collectionNames] : collectionNames;
    collectionNames.forEach(collectionName => {
      getDB(collectionName)
        .then(response => response.json())
        .then(data => {
          if (collectionName === 'assets') {
            console.log('d:', data)
            const rows = data.response.map(row => {
              console.log('row:', row)
              return createAssetListRow(row._id, row.name, row.brand, row.model, row.category, row.serial, row.EPC, 'Admin', '11/03/2020', row.location);
            });
            setControl(prev => ({ ...prev, assetRows: rows, assetRowsSelected: [] }));
            console.log('inside assets', rows)
          }
          if (collectionName === 'references') {
            const rows = data.response.map(row => {
              return createAssetReferenceRow(row._id, row.name, row.brand, row.model, row.category, 'Admin', '11/03/2020');
            });
            setControl(prev => ({ ...prev, referenceRows: rows, referenceRowsSelected: [] }));
          }
          if (collectionName === 'categories') {
            const categoriesInfo = data.response
            const rows = data.response.map(row => {
              return createAssetCategoryRow(row._id, row.name, row.depreciation, 'Admin', '11/03/2020');
            });
            setControl(prev => ({ ...prev, categoryRows: rows, categoryRowsSelected: [], categories: categoriesInfo }));
          }
          if (collectionName === 'locationsReal') {
            locations = data.response.map(res => ({ ...res, id: res._id }));
            const homeLocations = data.response.filter(loc => loc.profileLevel === 0);
            const children = constructLocationTreeRecursive(homeLocations);
            locationsTreeData.children = children;
            setLocationsTree(locationsTreeData);
          }
        })
        .catch(error => console.log('error>', error));
    });
  };
  const locationsTreeData = {
    id: 'root',
    name: 'Locations',
    profileLevel: -1,
    parent: null
  };
  const constructLocationTreeRecursive = (locs) => {
    if (!locs || !Array.isArray(locs) || !locs.length) return [];
    let res = [];
    locs.forEach((location) => {
      const locObj = (({ _id: id, name, profileLevel, parent }) => ({ id, name, profileLevel, parent }))(location);
      const children = locations.filter(loc => loc.parent === locObj.id);
      locObj.children = constructLocationTreeRecursive(children);
      res.push(locObj);
    });
    return res;
  };
  const locationsChildren = (children, res) =>{
    if (!children || !Array.isArray(children) || !children.length) return [];
    children.map((child) => {
      locationsChildren(child.children, res);
      res.push(child.id);
    })
    return res;
  }
  const selectLocation = (locationId, level, parent, locationName, children) => {
    let res = [];
    let allchildren = locationsChildren(children, res)
    allchildren.push(locationId)
    let filtered = control.assetRows.filter((row) => allchildren.includes(row.location))
    console.log('filtered: ', filtered)
    setControl({...control, treeViewFiltering: filtered})
  };
  useEffect(() => {
    loadAssetsData();
  }, []);

  const [control, setControl] = useState({
    idReference: null,
    openReferencesModal: false,
    referenceRows: [],
    referenceRowsSelected: [],
    //
    idCategory: null,
    openCategoriesModal: false,
    openTileView: false,
    categoryRows: [],
    categories: [],
    categoryRowsSelected: [],
    //
    idAsset: null,
    openAssetsModal: false,
    openTreeView: false,
    treeViewFiltering: [],
    assetRows: [],
    assetRowsSelected: [],
  });

  const [referencesSelectedId, setReferencesSelectedId] = useState(null);
  const [selectReferenceConfirmation, setSelectReferenceConfirmation] = useState(false);

  const collections = {
    references: {
      id: 'idReference',
      modal: 'openReferencesModal',
      name: 'references'
    },
    categories: {
      id: 'idCategory',
      modal: 'openCategoriesModal',
      name: 'categories'
    },
    assets: {
      id: 'idAsset',
      modal: 'openAssetsModal',
      name: 'assets'
    },
  };

  const tableActions = (collectionName) => {
    // return;
    const collection = collections[collectionName];
    return {
      onAdd() {
        console.log('MAIN ON ADD>> ', referencesSelectedId);
        if (!referencesSelectedId && collectionName === 'assets') {
          setSelectReferenceConfirmation(true);
          return;
        }
        setControl({ ...control, [collection.id]: null, [collection.modal]: true })
      },
      onEdit(id) {
        setControl({ ...control, [collection.id]: id, [collection.modal]: true })
      },
      onDelete(id) {
        if (!id || !Array.isArray(id)) return;
        id.forEach(_id => {
          deleteDB(`${collection.name}/`, _id)
            .then(response => console.log('success', response))
            .catch(error => console.log('Error', error));
        });
        loadAssetsData(collection.name);
      },
      onSelect(id) {
        if (collectionName === 'references') {
          setReferencesSelectedId(id);
        }
      }
    }
  };

  const toggleTreeView = () => {
    control.openTreeView ? setControl({ ...control, openTreeView: false }) : setControl({ ...control, openTreeView: true }) 
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
                      {TabsTitles('assets')}
                    </Tabs>
                  </PortletHeaderToolbar>
                }
              />

              {tab === 0 && (
                <PortletBody>
                  <div className="kt-section kt-margin-t-0">
                    <div className="kt-section__body">
                      <div className="kt-section">
                        <span className="kt-section__sub">
                          This section will integrate <code>Assets List</code>
                        </span>
                        <Button
                          variant="contained"
                          onClick={() => toggleTreeView()}
                        >
                          Tree View
                        </Button>
                        <ModalAssetList
                          showModal={control.openAssetsModal}
                          setShowModal={(onOff) => setControl({ ...control, openAssetsModal: onOff })}
                          reloadTable={() => loadAssetsData('assets')}
                          id={control.idAsset}
                          categoryRows={control.categoryRows}
                          referencesSelectedId={referencesSelectedId}
                        />
                        <div className="kt-separator kt-separator--dashed" />
                        <div className="kt-section__content">
                          {
                            control.openTreeView ?
                              <TableComponent
                                title={'Asset List'}
                                headRows={assetListHeadRows}
                                rows={control.assetRows}
                                onEdit={tableActions('assets').onEdit}
                                onAdd={tableActions('assets').onAdd}
                                onDelete={tableActions('assets').onDelete}
                                onSelect={tableActions('assets').onSelect}
                              />
                              :
                              <Grid container>
                                <Grid item sm={12} md={2} lg={2}>
                                  <TreeView data={locationsTree} onClick={selectLocation} />
                                </Grid>
                                <Grid item sm={12} md={10} lg={10} >
                                  <TableComponent
                                    title={'Asset List'}
                                    headRows={assetListHeadRows}
                                    rows={control.treeViewFiltering}
                                    onEdit={tableActions('assets').onEdit}
                                    onAdd={tableActions('assets').onAdd}
                                    onDelete={tableActions('assets').onDelete}
                                    onSelect={tableActions('assets').onSelect}
                                  />
                                </Grid>
                              </Grid>
                          }
                        </div>
                      </div>
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
                          This section will integrate <code>Assets References</code>
                        </span>
                        <ModalAssetReferences
                          showModal={control.openReferencesModal}
                          setShowModal={(onOff) => setControl({ ...control, openReferencesModal: onOff })}
                          reloadTable={() => loadAssetsData('references')}
                          id={control.idReference}
                          categoryRows={control.categoryRows}
                        />
                        <div className="kt-separator kt-separator--dashed" />
                        <div className="kt-section__content">
                          <TableComponent
                            title={'Asset References'}
                            headRows={assetReferencesHeadRows}
                            rows={control.referenceRows}
                            onEdit={tableActions('references').onEdit}
                            onAdd={tableActions('references').onAdd}
                            onDelete={tableActions('references').onDelete}
                            onSelect={tableActions('references').onSelect}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </PortletBody>
              )}

              {tab === 2 && (
                <PortletBody>
                  <div className="kt-section kt-margin-t-0">
                    <div className="kt-section__body">
                      <div className="kt-section">
                        <span className="kt-section__sub">
                          This section will integrate <code>Assets Categories</code>
                        </span>
                        <Button variant='contained' onClick={() => control.openTileView ? setControl({...control, openTileView: false}):setControl({...control, openTileView: true})} >Tile View</Button>
                        <div className="kt-separator kt-separator--dashed" />
                        <TileView 
                          showTileView={control.openTileView}
                          tiles={control.categories} 
                          collection='categories'
                          onEdit={tableActions('categories').onEdit}
                          onDelete={tableActions('categories').onDelete}
                          onReload={() => loadAssetsData('categories')}
                        />
                        { /* <TileView /> */}
                        <ModalAssetCategories
                          // showModal={openCategoriesModal}
                          // setShowModal={setOpenCategoriesModal}
                          // reloadTable={loadAssetsData.categories}
                          // id={idCategory}
                          showModal={control.openCategoriesModal}
                          setShowModal={(onOff) => setControl({ ...control, openCategoriesModal: onOff })}
                          reloadTable={() => loadAssetsData('categories')}
                          id={control.idCategory}
                        />

                        <div className="kt-separator kt-separator--dashed" />
                        <div className="kt-section__content">
                          <TableComponent
                            title={'Asset Categories'}
                            headRows={assetCategoriesHeadRows}
                            rows={control.categoryRows}
                            onEdit={tableActions('categories').onEdit}
                            onAdd={tableActions('categories').onAdd}
                            onDelete={tableActions('categories').onDelete}
                            onSelect={tableActions('categories').onSelect}
                          // rows={categoryRows.rows}
                          // onEdit={categoriesTableActions.onEditProfileLocation}
                          // onAdd={categoriesTableActions.onAddProfileLocation}
                          // onDelete={categoriesTableActions.onDeleteProfileLocation}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </PortletBody>
              )}

              {tab === 3 && (
                <PortletBody>
                  <div className="kt-section kt-margin-t-0">
                    <div className="kt-section__body">
                      <div className="kt-section">
                        <span className="kt-section__sub">
                          This section will integrate <code>Asset Policies</code>
                        </span>
                        <div className="kt-separator kt-separator--dashed" />
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
