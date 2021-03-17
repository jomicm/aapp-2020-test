import React, { useEffect, useState } from 'react';
import { Nav, Tab, Dropdown } from "react-bootstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import ReactTimeAgo from 'react-time-ago'
import clsx from 'clsx';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import Badge from '@material-ui/core/Badge';
import { ReactComponent as MessageIcon } from '../../../_metronic/layout/assets/layout-svg-icons/Message.svg';
import {
  postDBEncryptPassword,
  getOneDB,
  updateDB,
  postDB,
  getDB
} from '../../crud/api'
import HeaderDropdownToggle from "../content/CustomDropdowns/HeaderDropdownToggle";
// import Messages from './MessagesTopBar';
import Messages from '../../pages/home/Messages/Messages';

const perfectScrollbarOptions = {
  wheelSpeed: 2,
  wheelPropagation: false
};

const MessagesTopBar2 = ({
  bgImage,
  icon,
  iconType,
  pulse,
  skin,
  type,
  useSVG,
}) => {

  const [countNotifications, setCountNotifications] = useState(0)
  const [data, setData] = useState([])
  const [getKey, setGetKey] = useState({ key: 'alerts' })
  const [openModal, setOpenModal] = useState(false)

  const backGroundStyle = () => {
    if (!bgImage) {
      return 'none';
    }
    return 'url(' + bgImage + ')';
  };

  const changeColor = (read) => (
    read ? 'firstColor' : 'secondColor'
  )

  const changeBarColor = (read) => {
    if (read) {
      return ''
    } else {
      return 'blue-bar'
    }
  }

  const checkStatus = (id, read) => {
    const notif = data.findIndex(({ _id }) => _id === id)
    const newData = data;
    newData[notif].read = true
    setData(newData)
    updateCount(data);
    handleUpdate(id, read)
  }

  const handleUpdate = (id, read) => {
    const body = { read: true }
    updateDB('messages/', body, id)
      .then(response => console.log('success', response))
      .catch(error => console.log('Error', error));
  }

  const getHetBackGroundCssClassList = () => {
    let result = 'kt-head ';
    if (skin) {
      result += `kt-head--skin-${skin} `;
    }
    result += 'kt-head--fit-x kt-head--fit-b';
    return result;
  };

  const getHeaderTopBarCssClassList = () => {
    let result = 'kt-header__topbar-icon ';
    if (pulse) {
      result += 'kt-pulse kt-pulse--brand ';
    }
    if (iconType) {
      result += `kt-header__topbar-icon--${iconType}`;
    }
    return result;
  };

  const getSvgCssClassList = () => {
    let result = 'kt-svg-icon ';
    if (iconType) {
      result += `kt-svg-icon--${iconType}`;
    }
    return result;
  };

  const ulTabsClassList = () => {
    let result = 'nav nav-tabs nav-tabs-line nav-tabs-bold nav-tabs-line-3x  ';
    if (type) {
      result += `nav-tabs-line-${type} `;
    }
    result += 'kt-notification-item-padding-x';
    return result;
  };

  const updateCount = (dataNotif) => {
    const filteredData = dataNotif.filter(ele => ele.read === false)
    setCountNotifications(filteredData.length)
  }

  const userNotificationsButtonCssClassList = () => {
    let result = 'btn ';
    if (type) {
      result += `btn-${type} `;
    }
    result += 'btn-sm btn-bold btn-font-md';
    return result;
  };

  useEffect(() => {
    getDB('messages/')
      .then((response) => response.json())
      .then((data) => {
        setData(data.response);
        updateCount(data.response);
        console.log(data.response)
      })
      .catch((error) => console.log('error>', error));
  }, [data]);

  return (
    <Dropdown className='kt-header__topbar-item' drop='down' alignRight>
      <Dropdown.Toggle
        as={HeaderDropdownToggle}
        id='dropdown-toggle-user-notifications'
      >
        <span className={getHeaderTopBarCssClassList()}>
          <Badge badgeContent={countNotifications} color='error' style={{ left: '25px', top: '-10px' }} />
          {!useSVG && <i className={icon} />}
          {useSVG && (
            <span className={getSvgCssClassList()}>
              <MessageIcon />
            </span>
          )}
        </span>
      </Dropdown.Toggle>
      <Dropdown.Menu className='dropdown-menu-fit dropdown-menu-right dropdown-menu-anim dropdown-menu-top-unround dropdown-menu-lg'>
        <form>
          {/** Head */}
          <div
            className={getHetBackGroundCssClassList()}
            style={{ backgroundImage: backGroundStyle() }}
          >
            <h3 className='kt-head__title'>
              <span style={{ paddingRight: '10px' }}>
                Messages&nbsp;
                </span>
              <span className={userNotificationsButtonCssClassList()} >
                {countNotifications}
              </span>
            </h3>

            <Tab.Container
              defaultActiveKey='List'
              className={ulTabsClassList()}
            >
              <Nav
                className={ulTabsClassList()}
                onSelect={_key => setGetKey({ key: _key })}
              >
                <Nav.Item className='nav-item'>
                  <Nav.Link eventKey='List' className='nav-link show'>
                    List
                    </Nav.Link>
                </Nav.Item>
              </Nav>

              <Tab.Content>
                <Tab.Pane eventKey='List'>
                  <PerfectScrollbar
                    options={perfectScrollbarOptions}
                    style={{ maxHeight: '100vh', position: 'relative' }}
                  >
                    <div
                      className='kt-notification kt-margin-t-10 kt-margin-b-10'
                      style={{ maxHeight: '40vh', position: 'relative' }}
                    >
                      <div
                        className='kt-notification kt-margin-t-10 kt-margin-b-10 kt-scroll'
                        data-scroll='true'
                        data-height='300'
                        data-mobile-height='200'
                      >
                        {data.length ? data.map(({ _id, from, html, formatDate, read, subject }) => (
                          <div style={{ display: 'flex', minHeight: '100px' }}>
                            <div className={changeBarColor(read)} />
                            <Link
                              to={`/messages?id=${_id}`}
                              className='kt-header__topbar-item'
                              drop='down'
                              style={{ width: '100%' }}
                            >
                              <div
                                style={{ padding: '20px' }}
                                className={changeColor(read)}
                                onClick={() => checkStatus(_id, read)}
                              >
                                <div style={{ color: 'black', fontSize: '1.3rem' }}>
                                  {subject}
                                </div>
                                <div className='kt-notification__item-time'>
                                  {formatDate ?
                                    (<ReactTimeAgo
                                      date={formatDate}
                                      locale='en-EN'
                                      timeStyle='round' />)
                                    : ''}
                                </div>
                              </div>
                            </Link>
                          </div>
                        )) : 'You have no messages'}
                        

                      </div>
                    </div>
                  </PerfectScrollbar>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </div>
        </form>
      </Dropdown.Menu>
    </Dropdown >
  );
}
export default MessagesTopBar2;
