import React, { useState, useEffect } from 'react';
import { FormHelperText, Switch, Tab, Tabs, Styles } from '@material-ui/core';
import {
  Portlet,
  PortletBody,
  PortletFooter,
  PortletHeader,
  PortletHeaderToolbar
} from '../../../../app/partials/content/Portlet';
import GeneralMessageContainer from './components/GeneralMessageContainer';

export default function Messages() {

  const localStorageActiveTabKey = 'builderActiveTab';
  const activeTab = localStorage.getItem(localStorageActiveTabKey);
  const [tab, setTab] = useState(activeTab ? +activeTab : 0);

  return (
    <div className='kt-form kt-form--label-right'>
      <Portlet>
        <PortletHeader
          toolbar={
            <PortletHeaderToolbar>
              <Tabs
                className='builder-tabs'
                component='div'
                onChange={(_, nextTab) => {
                  setTab(nextTab);
                  localStorage.setItem(localStorageActiveTabKey, nextTab);
                }}
                value={tab}
              >
                <Tab label='Inbox' />
                <Tab label='Trash' />
              </Tabs>
            </PortletHeaderToolbar>
          }
        />
        {tab === 0 && (
          <PortletBody className='portlet-body'>
            <div>
              <GeneralMessageContainer />
            </div>
          </PortletBody>
        )}
        {tab === 1 && (
          <PortletBody>
          </PortletBody>
        )}
      </Portlet>
    </div>
  );
}
