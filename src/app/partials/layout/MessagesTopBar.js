import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Nav, Tab, Dropdown } from 'react-bootstrap';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ReactTimeAgo from 'react-time-ago';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Badge, IconButton } from '@material-ui/core';

import PersonIcon from '@material-ui/icons/Person';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { ReactComponent as MessageIcon } from '../../../_metronic/layout/assets/layout-svg-icons/Message.svg';
import {
  updateDB,
  getDB,
  getMessages,
  getTotalMessages,
  getDBComplex,
} from '../../crud/api';
import HeaderDropdownToggle from '../content/CustomDropdowns/HeaderDropdownToggle';

const perfectScrollbarOptions = {
  wheelSpeed: 2,
  wheelPropagation: false
};

const MessagesTopBar = ({
  bgImage,
  icon,
  iconType,
  pulse,
  skin,
  type,
  useSVG,
  user,
}) => {
  const [countNotifications, setCountNotifications] = useState(0);
  const [data, setData] = useState([]);
  const [getKey, setGetKey] = useState({ key: 'alerts' });
  const [openModal, setOpenModal] = useState(false);

  const backGroundStyle = () => !bgImage ? ('none') : ('url(' + bgImage + ')');

  const changeColor = (read) => (
    read ? 'firstColor' : 'secondColor'
  )

  const changeBarColor = (read) => (
    read ? '' : 'blue-bar'
  )

  const checkStatus = (id, read) => {
    const notif = data.findIndex(({ _id }) => _id === id);
    const newData = data;
    newData[notif].read = true;
    handleUpdate(id, read);
    getMessagesData();
  }

  const handleUpdate = (id, read) => {
    const body = { read: true };
    updateDB('messages/', body, id)
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
    const filteredData = dataNotif.filter(ele => ele.read === false);
    setCountNotifications(filteredData.length);
  }

  const userNotificationsButtonCssClassList = () => {
    let result = 'btn ';
    if (type) {
      result += `btn-${type} `;
    }
    result += 'btn-sm btn-bold btn-font-md';
    return result;
  };

  const [control, setControl] = useState({
    search: '',
    rowsPerPage: 5,
    page: 0,
    total: 1,
  });

  const handlePageChange = (action) => {
    if (action === 'add' && (control.page + 1) < Math.ceil(control.total / control.rowsPerPage)) {
      setControl(prev => ({ ...prev, page: prev.page + 1 }))
    }
    else if (action === 'reduce' && (control.page + 1) > 1) {
      setControl(prev => ({ ...prev, page: prev.page - 1 }))
    }
  }

  const getMessagesData = () => {
    getTotalMessages({
      collection: 'messages',
      userId: user.id,
    })
      .then(response => response.json())
      .then(data => {
        setControl(prev => ({
          ...prev,
          total: data.response.count === 0 ? 1 : data.response.count
        }))
      });

    getDBComplex({
      collection: 'messages',
      condition: [{ "to": { "$elemMatch": { "_id": user.id } } }]
    })
      .then(response => response.json())
      .then(data => {
        const userMessages = data.response.filter((message) => message.status === "new");
        updateCount(userMessages);
      })
      .catch((error) => console.log(error));

    getMessages({
      limit: control.rowsPerPage,
      skip: control.rowsPerPage * control.page,
      sort: [{ key: 'creationDate', value: -1 }],
      userId: user.id,
    })
      .then((response) => response.json())
      .then((data) => setData(data.response.reverse()))
      .catch((error) => console.log('error>', error));
  };

  useEffect(() => {
    getMessagesData();
  }, [control.search, control.page]);


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
          <div
            className={getHetBackGroundCssClassList()}
            style={{ backgroundImage: backGroundStyle() }}
          >
            <Link to='/messages'>
              <h3 className='kt-head__title'>
                <span style={{ cursor: 'pointer', paddingRight: '10px' }}>
                  Messages&nbsp;
                </span>
                <span className={userNotificationsButtonCssClassList()} >
                  {countNotifications}
                </span>
              </h3>
            </Link>

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
                  <div style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end'
                  }}>
                    Page: {control.page + 1}/{Math.ceil(control.total / control.rowsPerPage)}
                    <IconButton
                      style={{ marginLeft: '5px' }}
                      onClick={() => handlePageChange('reduce')}
                    >
                      <ChevronLeftIcon />
                    </IconButton>
                    <IconButton
                      style={{ marginRight: '5px' }}
                      onClick={() => handlePageChange('add')}
                    >
                      <ChevronRightIcon />
                    </IconButton>
                  </div>
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
                        {data.length ? data.map(({ _id, from, formatDate, read, subject }) => (
                          <div style={{ display: 'flex', minHeight: '100px' }}>
                            <div className={changeBarColor(read)} />
                            <Link
                              to={`/messages?id=${_id}&page=${control.page}&tab=0`}
                              className='kt-header__topbar-item'
                              drop='down'
                              style={{ width: '100%' }}
                            >
                              <div
                                style={{
                                  padding: '20px',
                                  display: 'flex',
                                  flexDirection: 'column',
                                }}
                                className={changeColor(read)}
                                onClick={() => checkStatus(_id, read)}
                              >
                                <div
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'row'
                                  }}
                                >
                                  <PersonIcon />
                                  <div style={{ fontWeight: 'bold', paddingLeft: '5px' }}>
                                    {from[0].email}
                                  </div>
                                </div>
                                <div style={{ color: 'black' }}>
                                  {subject}
                                </div>
                                <div className='kt-notification__item-time'>
                                  {formatDate ? (
                                    <ReactTimeAgo
                                      date={formatDate}
                                      locale='en-EN'
                                      timeStyle='round'
                                    />
                                  ) : 'Unreadable date'
                                  }
                                </div>
                              </div>
                            </Link>
                          </div>
                        )).reverse() : 'You have no messages'}
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

const mapStateToProps = ({ auth: { user } }) => ({
  user
});

export default connect(mapStateToProps)(MessagesTopBar);
