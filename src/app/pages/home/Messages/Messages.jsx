import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { Tabs, Tab } from '@material-ui/core';

import {
  Portlet,
  PortletBody,
  PortletHeader,
  PortletHeaderToolbar,
} from '../../../../app/partials/content/Portlet';

import {
  getMessages,
  getTotalMessages,
} from '../../../crud/api';

import MessagesContainer from './components/MessagesContainer';

function Messages({ user }) {

  const localStorageActiveTabKey = 'builderActiveTab';
  const activeTab = localStorage.getItem(localStorageActiveTabKey);

  /* States */

  const [tab, setTab] = useState(activeTab ? +activeTab : 0);
  const [messages, setMessages] = useState([]);
  const [trashMessages, setTrashMessages] = useState([]);

  /* Functions */

  // const loadMessages = useCallback(() => {
  //   getTotalMessages({
  //     collection: 'messages',
  //     userId: user.id,
  //   }).then(response => response.json());

  //   getMessages({
  //     sort: [{ key: 'creationDate', value: -1 }],
  //     userId: user.id,
  //   })
  //     .then(response => response.json())
  //     .then(data => {
  //       const userMessages = data.response;
  //       const userTrashMessages = userMessages.filter(message => message.status === 'trash');
  //       setTrashMessages(userTrashMessages);
  //       setMessages(userMessages);
  //     })
  //     .catch(error => {});
  // }, [messages, trashMessages])

  // useEffect(() => {
  //   loadMessages();
  // });

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
            <MessagesContainer user={user} />
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
