import React, { useState, useEffect } from 'react';
import { id } from 'date-fns/locale';
import { Nav, Tab, Dropdown } from 'react-bootstrap';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ReactTimeAgo from 'react-time-ago'
import Badge from '@material-ui/core/Badge';
import NotificationImportantIcon from '@material-ui/icons/NotificationImportant';
import NotificationsIcon from '@material-ui/icons/Notifications';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import NotificationsOffIcon from '@material-ui/icons/NotificationsOff';
import NotificationsPausedIcon from '@material-ui/icons/NotificationsPaused';
import ModalUserNotifications from './modalNotification/ModalUserNotifications'
import HeaderDropdownToggle from '../../content/CustomDropdowns/HeaderDropdownToggle';
import {
  postDBEncryptPassword,
  getOneDB,
  updateDB,
  postDB,
  getDB
} from '../../../crud/api'
import { ReactComponent as CompilingIcon } from '../../../../_metronic/layout/assets/layout-svg-icons/Compiling.svg';
import './UserNotifications.scss'

const perfectScrollbarOptions = {
  wheelPropagation: false,
  wheelSpeed: 2
};

const UserNotifications = ({
  bgImage,
  click,
  dot,
  icon,
  iconType,
  pulse,
  pulseLight,
  skin,
  type,
  useSVG,
}) => {
  const [countNotifications, setCountNotifications] = useState(0)
  const [data, setData] = useState([])
  const [getKey, setGetKey] = useState({ key: 'alerts' })
  const iconsList = {
    notificationImportantIcon: <NotificationImportantIcon />,
    notificationsIcon: <NotificationsIcon />,
    notificationsActiveIcon: <NotificationsActiveIcon />,
    notificationsNoneIcon: <NotificationsNoneIcon />,
    notificationsOffIcon: <NotificationsOffIcon />,
    notificationsPausedIcon: <NotificationsPausedIcon />
  };
  const [openModal, setOpenModal] = useState(false)
  const [values, setValues] = useState({
    formatDate: '',
    from: '',
    message: '',
    subject: ''
  })

  const backGroundStyle = () => {
    if (!bgImage) {
      return 'none';
    }
    return 'url(' + bgImage + ')';
  };

  const checkStatus = (read, id) => {
    const notif = data.findIndex(item => item._id === id)
    const newData = data;
    newData[notif].read = true
    setData(newData)
    updateCount(data);
  }

  const changeModal = (read, _id, subject, message, formatDate, from) => {
    setOpenModal(true)
    setValues({
      subject,
      message,
      formatDate,
      from: from.length ? from[0].email : ''
    })
    checkStatus(read, _id)
  }

  const changeColor = (read) => {
    if (read) {
      return 'firstColor'
    } else {
      return 'secondColor'
    }
  }

  const changeBarColor = (read) => {
    if (read) {
      return ''
    } else {
      return 'blue-bar'
    }
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
    getDB('notifications/')
      .then((response) => response.json())
      .then((data) => {
        setData(data.response);
        updateCount(data.response);
      })
      .catch((error) => console.log('error>', error));
  }, []);

  return (
    <Dropdown className='kt-header__topbar-item' drop='down' alignRight>
      <Dropdown.Toggle
        as={HeaderDropdownToggle}
        id='dropdown-toggle-user-notifications'
      >
        <span className={getHeaderTopBarCssClassList()}>
          <Badge badgeContent={countNotifications} color='error'>
            {!useSVG && <i className={icon} />}
            {useSVG && (
              <span className={getSvgCssClassList()}>
                <CompilingIcon />
              </span>
            )}
          </Badge>
          <span className='kt-pulse__ring' hidden={!pulse} />
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
                Notifications&nbsp;
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
                        {data && data.map(({ formatDate, icon, _id, message, subject, read, status, from }) => {
                          return (
                            <div style={{ display: 'flex', minHeight: '112px' }}>
                              <div className={changeBarColor(read)} />
                              <div
                                style={{ padding: '20px' }}
                                className={changeColor(read)}
                                onClick={() => changeModal(read, _id, subject, message, formatDate, from)}
                              >
                                <div className='kt-notification__item-icon' style={{ display: 'flex' }}>
                                  <div className='notification-icon'>
                                    {Object.keys(iconsList).map((key) => {
                                      return (key === icon) ? iconsList[key] : ''
                                    })}
                                  </div>
                                  <div
                                    className='kt-notification__item-title'
                                    style={{ padding: '0 10px 5px', textTransform: 'upperCase' }}
                                  >
                                    {subject ? ((subject.length > 20) ? subject.substring(0, 25) + '...' : subject) : ''}
                                  </div>
                                </div>
                                <div>
                                  {message ? ((message.length > 25) ? message.substring(0, 25) + '...' : message) : ''}
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
                            </div>
                          )
                        })}
                      </div>
                      <ModalUserNotifications
                        from={values.from}
                        subject={values.subject}
                        message={values.message}
                        formatDate={values.formatDate}
                        showModal={openModal}
                        setShowModal={(onOff) => setOpenModal(onOff)}
                      />
                    </div>
                  </PerfectScrollbar>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </div>
        </form>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default UserNotifications;
