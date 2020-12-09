import React, { useState, useEffect } from "react";

// import './Messages.scss';

import GeneralMessageContainer from './Components/GeneralMessageContainer'

import { FormHelperText, Switch, Tab, Tabs, Styles } from "@material-ui/core";

import {
  Portlet,
  PortletBody,
  PortletFooter,
  PortletHeader,
  PortletHeaderToolbar,
} from "../../../../app/partials/content/Portlet";

export default function Messages() {
  const localStorageActiveTabKey = "builderActiveTab";
  const activeTab = localStorage.getItem(localStorageActiveTabKey);
  const [tab, setTab] = useState(activeTab ? +activeTab : 0);

  return (
    <>
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
                  <Tab label="Inbox" />
                  <Tab label="Trash" />
                </Tabs>
              </PortletHeaderToolbar>
            }
          />
          {tab === 0 && (
            <PortletBody className="portlet-body">
              <div>
                <GeneralMessageContainer />
              </div>
            </PortletBody>
          )}
          {tab === 1 && (
            <PortletBody>
              <h2>Villa</h2>
            </PortletBody>
          )}
        </Portlet>
      </div>
    </>
  );
}
