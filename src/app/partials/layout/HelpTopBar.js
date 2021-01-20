import React from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { ReactComponent as HeadPhonesIcon } from '../../../_metronic/layout/assets/layout-svg-icons/HeadPhones.svg';
import { FormattedMessage } from 'react-intl';

export default class Help extends React.Component {
  render() {
    const { useSVG, iconType } = this.props;
    return (
      <FormattedMessage id={'TOPBAR.TOOLTIP.HELP'} defaultMessage={'Help'}>
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
                    <HeadPhonesIcon className='kt-svg-icon kt-svg-icon--primary' />
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
