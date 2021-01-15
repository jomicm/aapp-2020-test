import React from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { ReactComponent as MessageIcon } from '../../../_metronic/layout/assets/layout-svg-icons/Message.svg';
import { FormattedMessage } from 'react-intl';

export default class Messages extends React.Component {
  render() {
    const { useSVG, iconType } = this.props;

    return (
      <FormattedMessage id={'TOPBAR.TOOLTIP.MESSAGES'} defaultMessage={'Messages'}>
      {
        (msg) => <OverlayTrigger
        placement='bottom'
        overlay={<Tooltip id='quick-panel-tooltip'>{msg}</Tooltip>}
      >
        <Link to={'/help'} className='kt-header__topbar-item' drop='down' alignRight>
          
            <span
              className={clsx('kt-header__topbar-icon', {
                'kt-header__topbar-icon--brand': iconType === 'brand'
              })}
            >
              {useSVG && (
                <span
                  className={clsx('kt-svg-icon', {
                    'kt-svg-icon-brand': iconType === 'brand'
                  })}
                >
                  <MessageIcon className='kt-svg-icon kt-svg-icon--primary' />
                </span>
              )}
            </span>
          
        </Link>
      </OverlayTrigger>
      }
    </FormattedMessage>
    );
  }
}
