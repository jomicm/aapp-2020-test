import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Tabs, Tab } from '@material-ui/core';

import {
  Portlet,
  PortletBody,
  PortletHeader,
  PortletHeaderToolbar,
} from '../../../../app/partials/content/Portlet';

import MessagesContainer from './components/MessagesContainer';

function Messages({ user }) {

  const localStorageActiveTabKey = 'builderActiveTab';
  const activeTab = localStorage.getItem(localStorageActiveTabKey);

  /* States */

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
            <MessagesContainer user={user} />
          </PortletBody>
        )}
        {tab === 1 && (
          <PortletBody className='portlet-body'>
            <MessagesContainer user={user} trash />
          </PortletBody>
        )}
      </Portlet>
    </div>
  );
}

const mapStateToProps = ({ auth: { user } }) => ({
  user,
});

export default connect(mapStateToProps)(Messages);
