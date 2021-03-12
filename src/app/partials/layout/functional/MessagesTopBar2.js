import React from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { ReactComponent as MessageIcon } from '../../../_metronic/layout/assets/layout-svg-icons/Message.svg';
import { FormattedMessage } from 'react-intl';

const MessagesTopBar2 = () => {
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
                <MessageIcon />
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
                Messages&nbsp;
                </span>
                <span className={userNotificationsButtonCssClassList()} >
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
                        </div>
                      </div>
                    </PerfectScrollbar>
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </div>
          </form>
        </Dropdown.Menu>
      </Dropdown>
  )
}

export default MessagesTopBar2;
