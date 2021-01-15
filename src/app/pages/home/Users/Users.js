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
import { CodeBlock } from "../../../partials/content/CodeExample";
import Notice from "../../../partials/content/Notice";

import CodeExample from '../../../partials/content/CodeExample';

import {
  makeStyles,
  lighten,
  withStyles,
  useTheme
} from "@material-ui/core/styles";
import {
  Checkbox,
  Card,
  CardHeader,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Divider,
} from "@material-ui/core";

// AApp Components
import TableComponent from '../Components/TableComponent';
import ModalUserProfiles from './modals/ModalUserProfiles';
import Autocomplete from '../Components/Inputs/Autocomplete';
import ModalUsers from './modals/ModalUsers';

import TreeView from '../Components/TreeViewComponent';
// import GoogleMaps from '../Components/GoogleMaps';
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


//DB API methods
import { getDB, deleteDB } from '../../../crud/api';
import ModalYesNo from '../Components/ModalYesNo';

import { useIntl } from "react-intl";

const TabsConfig = {
  tabs:[
    {
      title: "List",
      translate: "TABS.USERS.LIST"
    },
    {
      title: "References",
      translate: "TABS.USERS.REFERENCES"
    },
    {
      title: "Policies",
      translate: "TABS.USERS.POLICIES"
    }
  ]
};

const localStorageActiveTabKey = "builderActiveTab";
export default function Users() {

  const intl = useIntl();
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

  const createUserProfilesRow = (id, name, creator, creation_date) => {
    return { id, name, creator, creation_date };
  };

  const userProfilesHeadRows = [
    // { id: "id", numeric: true, disablePadding: false, label: "ID" },
    { id: "name", numeric: false, disablePadding: false, label: "Name" },
    { id: "creator", numeric: false, disablePadding: false, label: "Creator" },
    { id: "creation_date", numeric: false, disablePadding: false, label: "Creation Date" }
  ];
 
  const createUserRow = (id, name, lastName, email, designation, manager, creator, creation_date) => {
    return { id, name, lastName, email, designation, manager, creator, creation_date };
  };

  const usersHeadRows = [
    { id: "name", numeric: false, disablePadding: false, label: "Name" },
    { id: "lastName", numeric: true, disablePadding: false, label: "Last Name" },
    { id: "email", numeric: true, disablePadding: false, label: "Email" },
    { id: "designation", numeric: true, disablePadding: false, label: "Designation" },
    { id: "manager", numeric: true, disablePadding: false, label: "Manager" },
    { id: "creator", numeric: false, disablePadding: false, label: "Creator" },
    { id: "creation_date", numeric: false, disablePadding: false, label: "Creation Date" }
  ];

  const loadUsersData = (collectionNames = ['user', 'userProfiles']) => {
    console.log('lets reload')
    collectionNames =  !Array.isArray(collectionNames) ? [collectionNames] : collectionNames;
    collectionNames.forEach(collectionName => {
      getDB(collectionName)
      .then(response => response.json())
      .then(data => {
        if (collectionName === 'userProfiles') {
          console.log('User Profiles id:', data)
          const rows = data.response.map(row => {
            console.log('row:', row)
            return createUserProfilesRow(row._id, row.name, 'Admin', '11/03/2020');
          });
          setControl(prev => ({ ...prev, userProfilesRows: rows, userProfilesRowsSelected: [] }));
          console.log('inside User Profiles', rows)
        }
        if (collectionName === 'user') {
          const rows = data.response.map(row => {
            return createUserRow(row._id, row.name, row.lastName, row.email, row.designation, row.manager, 'Admin', '11/03/2020');
          });
          setControl(prev => ({ ...prev, usersRows: rows, usersRowsSelected: [] }));
         }})
      .catch(error => console.log('error>', error));
    });
  };

  useEffect(() => {
    loadUsersData();
  }, []);

  const [control, setControl] = useState({
    idUserProfile: null,
    openUserProfilesModal: false,
    userProfilesRows: [],
    userProfilesRowsSelected: [],
    //
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
    // return;
    const collection = collections[collectionName];
    return {
      onAdd() {
        console.log('MAIN ON ADD>> ', referencesSelectedId);
        // if (!referencesSelectedId && collectionName === 'assets') {
        //   setSelectReferenceConfirmation(true);
        //   return;
        // }
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
            .then(response => console.log('success', response))
            .catch(error => console.log('Error', error));
        });
        loadUsersData(collection.name);
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
                    {
                        TabsConfig.tabs.map((e) => {
                          return (
                            <Tab label={
                              !e.translate ? (e.title) : (
                                intl.formatMessage({id:e.translate})
                              )
                            }/>
                          );
                        })
                      }
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
                          <ModalUsers
                            showModal={control.openUsersModal}
                            setShowModal={(onOff) => setControl({ ...control, openUsersModal: onOff })}
                            reloadTable={() => loadUsersData('user')}
                            id={control.idUser}
                            userProfileRows={control.userProfilesRows}
                            // categoryRows={control.usersRows}
                            // referencesSelectedId={ referencesSelectedId}
                          />
                          <div className="kt-separator kt-separator--dashed"/>
                          <div className="kt-section__content">
                            <TableComponent
                              title={'User List'}
                              headRows={usersHeadRows}
                              rows={control.usersRows}
                              onEdit={tableActions('users').onEdit}
                              onAdd={tableActions('users').onAdd}
                              onDelete={tableActions('users').onDelete}
                              onSelect={tableActions('users').onSelect}
                            />
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
                            This section will integrate <code>User Profiles</code>
                          </span>
                            <ModalUserProfiles
                              showModal={control.openUserProfilesModal}
                              setShowModal={(onOff) => setControl({ ...control, openUserProfilesModal: onOff })}
                              reloadTable={() => loadUsersData('userProfiles')}
                              id={control.idUserProfile}
                              // categoryRows={control.categoryRows}
                            />
                            <div className="kt-separator kt-separator--dashed"/>
                            <div className="kt-section__content">
                              <TableComponent 
                                title={'User Profiles'}
                                headRows={userProfilesHeadRows}
                                rows={control.userProfilesRows}
                                onEdit={tableActions('userProfiles').onEdit}
                                onAdd={tableActions('userProfiles').onAdd}
                                onDelete={tableActions('userProfiles').onDelete}
                                onSelect={tableActions('userProfiles').onSelect}
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
                            This section will integrate <code>Asset Policies</code>
                          </span>
                          <div className="kt-separator kt-separator--dashed"/>
                          <Autocomplete />
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
