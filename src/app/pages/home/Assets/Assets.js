/* eslint-disable no-restricted-imports */
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Grid,
  makeStyles,
  Tabs,
  Typography
} from '@material-ui/core';
import { connect, useDispatch } from "react-redux";
import {
  Portlet,
  PortletBody,
  PortletHeader,
  PortletHeaderToolbar
} from '../../../partials/content/Portlet';

import { utcToZonedTime } from 'date-fns-tz';
import LanguageIcon from '@material-ui/icons/Language';
import CheckIcon from '@material-ui/icons/Check';
import BuildIcon from '@material-ui/icons/Build';
import NotInterestedIcon from '@material-ui/icons/NotInterested';
import TimelineRoundedIcon from '@material-ui/icons/TimelineRounded';

import * as general from "../../../store/ducks/general.duck";
// AApp Components
import { TabsTitles } from '../Components/Translations/tabsTitles';
import TableComponent2 from '../Components/TableComponent2';
import ModalAssetCategories from './modals/ModalAssetCategories';
import ModalAssetReferences from './modals/ModalAssetReferences';
import ModalAssetList from './modals/ModalAssetList';
import Policies from '../Components/Policies/Policies';
import { allBaseFields } from '../constants';
import { executePolicies } from '../Components/Policies/utils';

import './Assets.scss';

//DB API methods
import { deleteDB, getDBComplex, getCountDB, getDB, getOneDB } from '../../../crud/api';
import ModalYesNo from '../Components/ModalYesNo';

const useStyles = makeStyles((theme) => ({
  assetsInfoContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
  },
  assetsInfoCard: {
    display: 'flex',
    margin: '10px',
    [theme.breakpoints.down('xs')]: {
      width: '100%'
    },
  },
  cardTextContainer: {
    width: '135px',
    [theme.breakpoints.down('xs')]: {
      width: '100%'
    },
  },
  cardSnapshot: {
    width: '80px',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      width: '30%'
    },
  },
}));

function Assets({ globalSearch, user, setGeneralSearch, showDeletedAlert, showErrorAlert }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [tab, setTab] = useState(0);
  const [userLocations, setUserLocations] = useState([]);

  const policiesBaseFields = {
    list: { ...allBaseFields.assets1, ...allBaseFields.assets2 },
    references: allBaseFields.references,
    categories: allBaseFields.categories
  };

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

  const [assetsKPI, setAssetsKPI] = useState({
    total: {
      number: 0,
      text: 'Total',
      icon: <LanguageIcon style={{ fill: 'white', fontSize: 35 }} />,
      color: '#1E1E2D'
    },
    available: {
      number: 0,
      text: 'Available',
      icon: <CheckIcon style={{ fill: 'white', fontSize: 35 }} />,
      color: '#427241'
    },
    onProcess: {
      number: 0,
      text: 'On Process',
      icon: <TimelineRoundedIcon style={{ fill: 'white', fontSize: 35 }} />,
      color: '#3e4fa8'
    },
    maintenance: {
      number: 0,
      text: 'Maintenance',
      icon: <BuildIcon style={{ fill: 'white', fontSize: 35 }} />,
      color: '#f2b200'
    },
    decommissioned: {
      number: 0,
      text: 'Decommissioned',
      icon: <NotInterestedIcon style={{ fill: 'white', fontSize: 35 }} />,
      color: '#ad2222'
    }
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
            locationsTable.forEach((location) => {
              let res = [];
              const currentLoc = data.response.find((e) => e._id === location.parent);

              if (!userLocations.includes(currentLoc._id)) {
                res.push(currentLoc._id);
              }

              const children = data.response.filter((e) => e.parent === currentLoc._id);

              if (children.length) {
                children.forEach((e) => res.push(e._id));
                children.forEach((e) => locationsRecursive(data, e, res));
              }
              setUserLocations(prev => {
                let index = 0;
                const found = prev.some(e => {
                  index = res.indexOf(e)
                  if (index >= 0) {
                    return true;
                  }
                });

                if (found) {
                  res.splice(index, 1);
                }

                return prev.concat(res);
              });
            });
          })
          .catch((error) => dispatch(showErrorAlert()));
      })
      .catch((error) => dispatch(showErrorAlert()));
  };

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
        queryLike: tableControl[collectionName].search || tableControl['assets'].locationsFilter.length ? queryLike : null,
        condition: collectionName === 'assets' ? { "location": { "$in": userLocations } } : null
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
        sort: [{ key: tableControl[collectionName].orderBy, value: tableControl[collectionName].order }],
        queryLike: tableControl[collectionName].search || tableControl['assets'].locationsFilter.length ? queryLike : null,
        condition: collectionName === 'assets' ? { "location": { "$in": userLocations } } : null
      })
        .then(response => response.json())
        .then(data => {
          if (collectionName === 'assets') {
            const rows = data.response.map(row => {
              const creationDate = utcToZonedTime(row.creationDate).toLocaleString();
              return createAssetListRow(row._id, row.name, row.brand, row.model, row.category, row.serial, row.EPC, row.creationUserFullName, creationDate, row.location);
            });
            setControl(prev => ({ ...prev, assetRows: rows, assetRowsSelected: [] }));
          }
          if (collectionName === 'references') {
            const rows = data.response.map(row => {
              const creationDate = utcToZonedTime(row.creationDate).toLocaleString();
              return createAssetReferenceRow(row._id, row.name, row.brand, row.model, row.category, row.creationUserFullName, creationDate, row.price);
            });
            setControl(prev => ({ ...prev, referenceRows: rows, referenceRowsSelected: [] }));
          }
          if (collectionName === 'categories') {
            const rows = data.response.map(row => {
              const creationDate = utcToZonedTime(row.creationDate).toLocaleString();
              return createAssetCategoryRow(row._id, row.name, row.depreciation, row.creationUserFullName, creationDate, row.fileExt);
            });
            setControl(prev => ({ ...prev, categoryRows: rows, categoryRowsSelected: [] }));
          }
        })
        .catch(error => dispatch(showErrorAlert()));
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
        getDB('policies')
          .then((response) => response.json())
          .then((data => {
            id.forEach(_id => {
              deleteDB(`${collection.name}/`, _id)
                .then(_ => {
                  dispatch(showDeletedAlert());
                  const currentCollection = collection.name === 'assets' ? 'list' : collection.name;
                  executePolicies('OnDelete', 'assets', currentCollection, data.response);
                  loadAssetsData(collection.name);
                })
                .catch((_) => showErrorAlert());
            });
          }))
          .catch((_) => dispatch(showErrorAlert()));
      },
      onSelect(id) {
        if (collectionName === 'references') {
          setReferencesSelectedId(id);
        }
      }
    }
  };

  useEffect(() => loadUserLocations(), []);

  useEffect(() => {
    loadAssetsData('assets');
  }, [userLocations]);

  useEffect(() => {
    loadAssetsData('assets');
  }, [tableControl.assets.page, tableControl.assets.rowsPerPage, tableControl.assets.order, tableControl.assets.orderBy, tableControl.assets.search, tableControl.assets.locationsFilter]);

  useEffect(() => {
    loadAssetsData('references');
  }, [tableControl.references.page, tableControl.references.rowsPerPage, tableControl.references.order, tableControl.references.orderBy, tableControl.references.search]);

  useEffect(() => {
    loadAssetsData('categories');
  }, [tableControl.categories.page, tableControl.categories.rowsPerPage, tableControl.categories.order, tableControl.categories.orderBy, tableControl.categories.search]);

  const kpis = [
    { kpi: 'total', queryExact: null },
    { kpi: 'available', queryExact: [{ key: 'status', value: 'active' }] },
    { kpi: 'onProcess', queryExact: [{ key: 'status', value: 'inProcess' }] },
    { kpi: 'maintenance', queryExact: [{ key: 'status', value: 'maintenance' }] },
    { kpi: 'decommissioned', queryExact: [{ key: 'status', value: 'decommissioned' }] }
  ];

  const tabIntToText = ['assets', 'references', 'categories'];

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
      setGeneralSearch({});
    }
  }, [globalSearch.tabIndex, globalSearch.searchValue]);

  useEffect(() => {
    kpis.forEach(({ kpi, queryExact }) => {
      getCountDB({ collection: 'assets', queryExact })
        .then(response => response.json())
        .then(data => {
          setAssetsKPI(prev => ({
            ...prev,
            [kpi]: {
              ...prev[kpi],
              number: data.response.count
            }
          }));
        });
    });
  }, []);

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
                      <Grid className={classes.assetsInfoContainer} container direction="row">
                        {
                          Object.entries(assetsKPI).map(([key, val]) => (
                            <Card
                              elevation={2}
                              className={classes.assetsInfoCard}
                            >
                              <div
                                className={classes.cardSnapshot}
                                style={{ backgroundColor: val.color }}
                              >
                                {val.icon}
                              </div>
                              <div className={classes.cardTextContainer}>
                                <CardContent style={{ padding: '12px' }} >
                                  <center>
                                    <Typography variant='subtitle'>
                                      {val.text}
                                    </Typography>
                                    <Typography variant='h4'>
                                      {val.number}
                                    </Typography>
                                  </center>
                                </CardContent>
                              </div>
                            </Card>
                          ))
                        }
                      </Grid>
                    </span>
                    <ModalAssetList
                      categoryRows={control.categoryRows}
                      id={control.idAsset}
                      key={control.idAsset}
                      referenceRows={control.referenceRows}
                      referencesSelectedId={referencesSelectedId}
                      reloadTable={() => loadAssetsData('assets')}
                      setShowModal={(onOff) => setControl({ ...control, openAssetsModal: onOff })}
                      showModal={control.openAssetsModal}
                    />
                    <div className='kt-separator kt-separator--dashed' />
                    <div className='kt-section__content'>
                      <TableComponent2
                        controlValues={tableControl.assets}
                        userLocations={userLocations}
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
                        tileView
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
                        tileView
                      />
                    </div>
                  </div>
                </div>
              </div>
            </PortletBody>
          )}

          {tab === 3 && <Policies module="assets" baseFields={policiesBaseFields} />}
        </Portlet>
      </div>
    </>
  );
}
const mapStateToProps = ({ general: { globalSearch }, auth: { user } }) => ({
  globalSearch,
  user
});
export default connect(mapStateToProps, general.actions)(Assets);
