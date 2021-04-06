import React, { useState  } from 'react';
import { connect } from 'react-redux';
import { Tab, Tabs } from '@material-ui/core';
import {
  Portlet,
  PortletBody,
  PortletFooter,
  PortletHeader,
  PortletHeaderToolbar
} from '../../../../app/partials/content/Portlet';
import GeneralMessageContainer from './components/GeneralMessageContainer';

function Messages({user}) {

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
              <GeneralMessageContainer user={user} />
          </PortletBody>
        )}
        {tab === 1 && (
          <PortletBody>
            <GeneralMessageContainer user={user} />
          </PortletBody>
        )}
      </Portlet>
    </div>
  );
}

const mapStateToProps = ({ auth: { user } }) => ({
  user
});
export default connect(mapStateToProps)(Messages);
