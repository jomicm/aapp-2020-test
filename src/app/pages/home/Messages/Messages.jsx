import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Tabs, Tab } from '@material-ui/core';
import PropTypes from 'prop-types';

import {
  Portlet,
  PortletBody,
  PortletHeader,
  PortletHeaderToolbar,
} from '../../../../app/partials/content/Portlet';

import MessagesContainer from './components/MessagesContainer';

function Messages({ user }) {

  /* States */

  const [tab, setTab] = useState(0);

  return (
    <div className='kt-form kt-form--label-right'>
      <Portlet>
        <PortletHeader
          toolbar={
            <PortletHeaderToolbar>
              <Tabs
                className='builder-tabs'
                component='div'
                onChange={(_, nextTab) => setTab(nextTab)}
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

Messages.propTypes = {
  user: PropTypes.shape.isRequired,
};

export default connect(mapStateToProps)(Messages);
