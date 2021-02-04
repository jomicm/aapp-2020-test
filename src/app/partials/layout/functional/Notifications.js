import React, {useState, useEffect} from 'react';
import clsx from 'clsx';
import { id } from 'date-fns/locale';
import { Nav, Tab, Dropdown } from 'react-bootstrap';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ReactTimeAgo from 'react-time-ago'
import { makeStyles } from '@material-ui/core/styles';
import {
  Badge,
  Fade,
  Tooltip,
  Typography
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete';
import NotificationImportantIcon from '@material-ui/icons/NotificationImportant';
import NotificationsIcon from '@material-ui/icons/Notifications';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import NotificationsOffIcon from '@material-ui/icons/NotificationsOff';
import NotificationsPausedIcon from '@material-ui/icons/NotificationsPaused';
import ModalNotifications from './modalNotification/ModalNotifications'
import HeaderDropdownToggle from '../../content/CustomDropdowns/HeaderDropdownToggle';
import { ReactComponent as CompilingIcon } from '../../../../_metronic/layout/assets/layout-svg-icons/Compiling.svg';
import {
  deleteDB,
  getDB,
  getOneDB,
  postDB,
  postDBEncryptPassword,
  updateDB
} from '../../../crud/api'
import './Notifications.scss'

const perfectScrollbarOptions = {
  wheelPropagation: false,
  wheelSpeed: 2
};

const useStyles = makeStyles((theme) => ({
  customWidth: {
    maxWidth: 500,
    fontSize: 13,
  },
  noMaxWidth: {
    maxWidth: 'none',
  },
}));

const Notifications = ({ 
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
  
  const classes = useStyles();
  const [countNotifications, setCountNotifications] = useState(0)
  const [data, setData] = useState([])
  const [getKey, setGetKey] = useState({key: 'alerts'})
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
    id: '',
    formatDate: '',
    from: '',
    message: '',
    status: '',
    subject: ''
  })

  const backGroundStyle = () => {
    return clsx('url(' + bgImage + ')', !bgImage && 'none');
  };

  const changeBarColor = (read) => {
    return clsx('', !read && 'blue-bar')
  }

  const changeColor = (read) => {
    return clsx('firstColor', !read && 'secondColor')
  }

  const changeModal = (_id, formatDate, from, message, read, status, subject) => {
    setOpenModal(true)
    setValues({subject: subject, message: message, formatDate: formatDate, from: from[0].email})
    checkStatus(read, _id)
    handleUpdate(_id, read)
  }

  const checkStatus = (read, id) => {
    const notif = data.findIndex( item => item._id === id)
    const newData = data;
    newData[notif].read = true
    setData(newData)
    updateCount(data);
  }

  const getHeaderTopBarCssClassList = () => {
    let result = 'kt-header__topbar-icon ';
    result += pulse ? 'kt-pulse kt-pulse--brand ' : '';
    result += iconType ? `kt-header__topbar-icon--${iconType}` : '';
    return result;
  };

  const getHetBackGroundCssClassList = () => {
    let result = 'kt-head ';
    if (skin) {
      result += `kt-head--skin-${skin} `;
    }
    result += 'kt-head--fit-x kt-head--fit-b';
    return result;
  };
  
  const getSvgCssClassList = () => {
    let result = 'kt-svg-icon';
    return clsx(`${result}`, iconType && `${result} kt-svg-icon--${iconType}`)
  };
  
  const handleDelete = (id) => {
    deleteDB('notifications/', id)
    .then(response => console.log('success', response))
    .catch(error => console.log('Error', error));
    alert('Deleted: ' + id)
    loadNotificationsData();
  }

  const handleUpdate = (id, read) => {
    const body = {read: true}
    updateDB('notifications/', body, id)
    .then(response => console.log('success', response))
    .catch(error => console.log('Error', error));
    alert('Updated: ' + id + ' ' + read)
  }

  const loadNotificationsData = () => {
    getDB('notifications/')
    .then((response) => response.json())
    .then((data) => {
      setData(data.response);
      updateCount(data.response);
    })
    .catch((error) => console.log('error>', error));
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
    const filteredData = dataNotif.filter( ele => ele.read === false )
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
    loadNotificationsData();
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
              <span style={{paddingRight:'10px'}}>
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
                      {data.map(({ _id, formatDate, from, icon, message, read, status, subject,  }) => {
                        return(
                          <div style={{ display: 'flex'}}>
                            <div className={changeBarColor(read)} />
                            <div
                              style={{padding: '20px'}}
                              className={changeColor(read)}
                              onClick={() => changeModal(_id, formatDate, from, message, read, status, subject)}
                            >
                              <div className='container-notifications-subject-message-date' style={{ display: 'flex'}}>
                                <div className='kt-notification__item-icon' style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
                                  <div className='notification-icon' style={{display: 'flex'}}>
                                    {Object.keys(iconsList).map((key) => {
                                      return (key === icon) ? iconsList[key] : ''
                                    })}
                                    <div 
                                      className='kt-notification__item-title' 
                                      style={{padding: '0 10px 5px', textTransform: 'upperCase', width: '95%'}}
                                    >
                                      <Tooltip 
                                        classes={{ tooltip: classes.customWidth }} 
                                        placement="left"
                                        title={subject}
                                        TransitionProps={{ timeout: 600 }}
                                        >
                                        <Typography variant="body1" noWrap='true' gutterBottom>
                                          {subject}
                                        </Typography>
                                      </Tooltip>
                                    </div>
                                  </div>
                                <div className='notifications-text-ellipsis'>
                                  <Tooltip 
                                    classes={{ tooltip: classes.customWidth }} 
                                    placement="left"
                                    TransitionProps={{ timeout: 600 }}
                                    title={message}>
                                    <Typography variant="body1" noWrap='true' gutterBottom>
                                      {message}
                                    </Typography>
                                  </Tooltip>
                                </div>
                                  <div className='kt-notification__item-time'>
                                    {formatDate && 
                                      (<ReactTimeAgo 
                                        date={formatDate}
                                        locale='en-EN'
                                        timeStyle='round' />)
                                        }
                                  </div>
                                </div>
                              </div>
                            </div>
                                <div className="container-notifications-deleteicon" style={{alignSelf: 'center'}}> 
                                  <DeleteIcon onClick={() => handleDelete(_id)} />
                                </div>
                          </div>
                      )})}
                    </div>
                      <ModalNotifications
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

export default Notifications;
