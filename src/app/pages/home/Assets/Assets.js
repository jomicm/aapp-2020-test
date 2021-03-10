/* eslint-disable no-restricted-imports */
import React, { useEffect, useState } from 'react';
import { Tabs } from '@material-ui/core';
import {
  Portlet,
  PortletBody,
  PortletHeader,
  PortletHeaderToolbar
} from '../../../partials/content/Portlet';

// AApp Components
import { TabsTitles } from '../Components/Translations/tabsTitles';
import TableComponent2 from '../Components/TableComponent2';
import ModalAssetCategories from './modals/ModalAssetCategories';
import ModalAssetReferences from './modals/ModalAssetReferences';
import ModalAssetList from './modals/ModalAssetList';

import './Assets.scss';

//DB API methods
import { deleteDB, getDBComplex, getCountDB } from '../../../crud/api';
import ModalYesNo from '../Components/ModalYesNo';

const localStorageActiveTabKey = 'builderActiveTab';
export default function Assets() {

  const activeTab = localStorage.getItem(localStorageActiveTabKey);
  const [tab, setTab] = useState(activeTab ? +activeTab : 0);

  const createAssetCategoryRow = (id, name, depreciation, creator, creation_date, fileExt) => {
    return { id, name, depreciation, creator, creation_date, fileExt };
  };

  const assetCategoriesHeadRows = [
    { id: 'name', numeric: false, disablePadding: false, label: 'Description' },
    { id: 'depreciation', numeric: true, disablePadding: false, label: 'Depreciation' },
    { id: 'creator', numeric: false, disablePadding: false, label: 'Creator', searchByDisabled: true },
    { id: 'creation_date', numeric: false, disablePadding: false, label: 'Creation Date', searchByDisabled: true }
  ];

  const createAssetReferenceRow = (id, name, brand, model, category, creator, creation_date, price) => {
    return { id, name, brand, model, category, creator, creation_date, price };
  };

  const assetReferencesHeadRows = [
    { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
    { id: 'brand', numeric: true, disablePadding: false, label: 'Brand' },
    { id: 'model', numeric: true, disablePadding: false, label: 'Model' },
    { id: 'category', numeric: true, disablePadding: false, label: 'Category', searchByDisabled: true },
    { id: 'creator', numeric: false, disablePadding: false, label: 'Creator', searchByDisabled: true },
    { id: 'creation_date', numeric: false, disablePadding: false, label: 'Creation Date', searchByDisabled: true },
    { id: 'price', numeric: false, disablePadding: false, label: 'Price' }
  ];

  const createAssetListRow = (id, name, brand, model, category, serial, EPC, creator, creation_date, location) => {
    return { id, name, brand, model, category, serial, EPC, creator, creation_date, location };
  };

  const assetListHeadRows = [
    { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
    { id: 'brand', numeric: true, disablePadding: false, label: 'Brand' },
    { id: 'model', numeric: true, disablePadding: false, label: 'Model' },
    { id: 'category', numeric: true, disablePadding: false, label: 'Category', searchByDisabled: true },
    { id: 'serial', numeric: true, disablePadding: false, label: 'Serial Number' },
    { id: 'EPC', numeric: true, disablePadding: false, label: 'EPC' },
    { id: 'creator', numeric: false, disablePadding: false, label: 'Creator', searchByDisabled: true },
    { id: 'creation_date', numeric: false, disablePadding: false, label: 'Creation Date', searchByDisabled: true }
  ];

  const loadAssetsData = (collectionNames = ['assets', 'categories', 'references']) => {
    collectionNames = !Array.isArray(collectionNames) ? [collectionNames] : collectionNames;
    collectionNames.forEach(collectionName => {
      let queryLike = '';
      if (collectionName === 'assets') {
        if (tableControl.assets.locationsFilter.length) {
          queryLike = tableControl.assets.locationsFilter.map(locationID => ({ key: 'location', value: locationID }))
        }
        else {
          queryLike = tableControl.assets.searchBy ? (
            [{ key: tableControl.assets.searchBy, value: tableControl.assets.search }]
          ) : (
            ['name', 'brand', 'model'].map(key => ({ key, value: tableControl.assets.search }))
          )
        }
      }
      if (collectionName === 'references') {
        queryLike = tableControl.references.searchBy ? (
          [{ key: tableControl.references.searchBy, value: tableControl.references.search }]
        ) : (
          ['name', 'brand', 'model'].map(key => ({ key, value: tableControl.references.search }))
        )
      }
      if (collectionName === 'categories') {
        queryLike = tableControl.categories.searchBy ? (
          [{ key: tableControl.categories.searchBy, value: tableControl.categories.search }]
        ) : (
          ['description', 'depreciation'].map(key => ({ key, value: tableControl.categories.search }))
        )
      }

      getCountDB({
        collection: collectionName,
        queryLike: tableControl[collectionName].search || tableControl['assets'].locationsFilter.length ? queryLike : null
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
        queryLike: tableControl[collectionName].search || tableControl['assets'].locationsFilter.length ? queryLike : null
      })
        .then(response => response.json())
        .then(data => {
          if (collectionName === 'assets') {
            const rows = data.response.map(row => {
              return createAssetListRow(row._id, row.name, row.brand, row.model, row.category, row.serial, row.EPC, 'Admin', '11/03/2020', row.location);
            });
            setControl(prev => ({ ...prev, assetRows: rows, assetRowsSelected: [] }));
          }
          if (collectionName === 'references') {
            const rows = data.response.map(row => {
              return createAssetReferenceRow(row._id, row.name, row.brand, row.model, row.category, 'Admin', '11/03/2020', row.price);
            });
            setControl(prev => ({ ...prev, referenceRows: rows, referenceRowsSelected: [] }));
          }
          if (collectionName === 'categories') {
            const rows = data.response.map(row => {
              return createAssetCategoryRow(row._id, row.name, row.depreciation, 'Admin', '11/03/2020', row.fileExt);
            });
            setControl(prev => ({ ...prev, categoryRows: rows, categoryRowsSelected: [] }));
          }
        })
        .catch(error => console.log('error>', error));
    });
  };

  const [control, setControl] = useState({
    idReference: null,
    openReferencesModal: false,
    referenceRows: [],
    referenceRowsSelected: [],

    idCategory: null,
    openCategoriesModal: false,
    openTileView: false,
    categoryRows: [],
    categoryRowsSelected: [],

    idAsset: null,
    openAssetsModal: false,
    openTreeView: false,
    treeViewFiltering: [],
    assetRows: [],
    assetRowsSelected: [],
  });

  const [tableControl, setTableControl] = useState({
    references: {
      collection: 'references',
      total: 0,
      page: 0,
      rowsPerPage: 5,
      orderBy: 'name',
      order: 1,
      search: '',
      searchBy: '',
    },
    assets: {
      collection: 'assets',
      total: 0,
      page: 0,
      rowsPerPage: 5,
      orderBy: 'name',
      order: 1,
      search: '',
      searchBy: '',
      locationsFilter: [],
    },
    categories: {
      collection: 'categories',
      total: 0,
      page: 0,
      rowsPerPage: 5,
      orderBy: 'name',
      order: 1,
      search: '',
      searchBy: '',
    }
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

  useEffect(() => {
    loadAssetsData('assets');
  }, [tableControl.assets.page, tableControl.assets.rowsPerPage, tableControl.assets.order, tableControl.assets.orderBy, tableControl.assets.search, tableControl.assets.locationsFilter]);

  useEffect(() => {
    loadAssetsData('references');
  }, [tableControl.references.page, tableControl.references.rowsPerPage, tableControl.references.order, tableControl.references.orderBy, tableControl.references.search]);

  useEffect(() => {
    loadAssetsData('categories');
  }, [tableControl.categories.page, tableControl.categories.rowsPerPage, tableControl.categories.order, tableControl.categories.orderBy, tableControl.categories.search]);

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
                  {TabsTitles('assets')}
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
                      This section will integrate <code>Assets List</code>
                    </span>
                    <ModalAssetList
                      showModal={control.openAssetsModal}
                      setShowModal={(onOff) => setControl({ ...control, openAssetsModal: onOff })}
                      reloadTable={() => loadAssetsData('assets')}
                      id={control.idAsset}
                      categoryRows={control.categoryRows}
                      referencesSelectedId={referencesSelectedId}
                    />
                    <div className='kt-separator kt-separator--dashed' />
                    <div className='kt-section__content'>
                      <TableComponent2
                        controlValues={tableControl.assets}
                        headRows={assetListHeadRows}
                        locationControl={(locations) => {
                          setTableControl(prev => ({
                            ...prev,
                            assets: {
                              ...prev.assets,
                              locationsFilter: locations
                            }
                          }))
                        }}
                        onAdd={tableActions('assets').onAdd}
                        onDelete={tableActions('assets').onDelete}
                        onEdit={tableActions('assets').onEdit}
                        onSelect={tableActions('assets').onSelect}
                        paginationControl={({ rowsPerPage, page }) =>
                          setTableControl(prev => ({
                            ...prev,
                            assets: {
                              ...prev.assets,
                              rowsPerPage: rowsPerPage,
                              page: page,
                            }
                          }))
                        }
                        rows={control.assetRows}
                        searchControl={({ value, field }) => {
                          setTableControl(prev => ({
                            ...prev,
                            assets: {
                              ...prev.assets,
                              search: value,
                              searchBy: field,
                            }
                          }))
                        }}
                        sortByControl={({ orderBy, order }) => {
                          setTableControl(prev => ({
                            ...prev,
                            assets: {
                              ...prev.assets,
                              orderBy: orderBy,
                              order: order,
                            }
                          }))
                        }}
                        title={'Asset List'}
                        tileView
                        treeView
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
                      This section will integrate <code>Assets References</code>
                    </span>
                    <ModalAssetReferences
                      showModal={control.openReferencesModal}
                      setShowModal={(onOff) => setControl({ ...control, openReferencesModal: onOff })}
                      reloadTable={() => loadAssetsData('references')}
                      id={control.idReference}
                      categoryRows={control.categoryRows}
                    />
                    <div className='kt-separator kt-separator--dashed' />
                    <div className='kt-section__content'>
                      <TableComponent2
                        controlValues={tableControl.references}
                        headRows={assetReferencesHeadRows}
                        onAdd={tableActions('references').onAdd}
                        onDelete={tableActions('references').onDelete}
                        onEdit={tableActions('references').onEdit}
                        onSelect={tableActions('references').onSelect}
                        paginationControl={({ rowsPerPage, page }) =>
                          setTableControl(prev => ({
                            ...prev,
                            references: {
                              ...prev.references,
                              rowsPerPage: rowsPerPage,
                              page: page,
                            }
                          }))
                        }
                        rows={control.referenceRows}
                        searchControl={({ value, field }) => {
                          setTableControl(prev => ({
                            ...prev,
                            references: {
                              ...prev.references,
                              search: value,
                              searchBy: field,
                            }
                          }))
                        }}
                        sortByControl={({ orderBy, order }) => {
                          setTableControl(prev => ({
                            ...prev,
                            references: {
                              ...prev.references,
                              orderBy: orderBy,
                              order: order,
                            }
                          }))
                        }}
                        title={'Asset References'}
                        tableView
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
                      This section will integrate <code>Assets Categories</code>
                    </span>
                    <div className='kt-separator kt-separator--dashed' />
                    <ModalAssetCategories
                      showModal={control.openCategoriesModal}
                      setShowModal={(onOff) => setControl({ ...control, openCategoriesModal: onOff })}
                      reloadTable={() => loadAssetsData('categories')}
                      id={control.idCategory}
                    />
                    <div className='kt-section__content'>
                      <TableComponent2
                        controlValues={tableControl.categories}
                        headRows={assetCategoriesHeadRows}
                        onAdd={tableActions('categories').onAdd}
                        onDelete={tableActions('categories').onDelete}
                        onEdit={tableActions('categories').onEdit}
                        onSelect={tableActions('categories').onSelect}
                        paginationControl={({ rowsPerPage, page }) =>
                          setTableControl(prev => ({
                            ...prev,
                            categories: {
                              ...prev.categories,
                              rowsPerPage: rowsPerPage,
                              page: page,
                            }
                          }))
                        }
                        rows={control.categoryRows}
                        searchControl={({ value, field }) => {
                          setTableControl(prev => ({
                            ...prev,
                            categories: {
                              ...prev.categories,
                              search: value,
                              searchBy: field,
                            }
                          }))
                        }}
                        sortByControl={({ orderBy, order }) => {
                          setTableControl(prev => ({
                            ...prev,
                            categories: {
                              ...prev.categories,
                              orderBy: orderBy,
                              order: order,
                            }
                          }))
                        }}
                        title={'Asset Categories'}
                        tableView
                      />
                    </div>
                  </div>
                </div>
              </div>
            </PortletBody>
          )}

          {tab === 3 && (
            <PortletBody>
              <div className='kt-section kt-margin-t-0'>
                <div className='kt-section__body'>
                  <div className='kt-section'>
                    <span className='kt-section__sub'>
                      This section will integrate <code>Asset Policies</code>
                    </span>
                    <div className='kt-separator kt-separator--dashed' />
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
