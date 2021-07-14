import React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  FormControlLabel,
  makeStyles,
  Switch,
  TextField,
} from '@material-ui/core';
import NotificationImportantIcon from '@material-ui/icons/NotificationImportant';
import NotificationsIcon from '@material-ui/icons/Notifications';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import NotificationsOffIcon from '@material-ui/icons/NotificationsOff';
import NotificationsPausedIcon from '@material-ui/icons/NotificationsPaused';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { PortletBody } from '../../../../../a../../../app/partials/content/Portlet';
import '../modals/ModalPolicies.scss';

const useStyles = makeStyles((theme) => ({
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200
  }
}));

export default function NotificationTemplate({
  notificationFromValue, notificationFromOnChange, notificationFromOptions,
  notificationToValue, notificationToOnChange, notificationToOptions,
  subjectNotificationValue, subjectNotificationOnChange, subjectNotificationOnClick, subjectNotificationName,
  disablesOnChange, disabledValue,
  selectedIcon, handleAlignment, alignment, handleClickIcon, messageOnChange, messageValue, setSelectedControl
}) {
  const classes = useStyles();
  const iconsList = {
    notificationImportantIcon: <NotificationImportantIcon />,
    notificationsIcon: <NotificationsIcon />,
    notificationsActiveIcon: <NotificationsActiveIcon />,
    notificationsNoneIcon: <NotificationsNoneIcon />,
    notificationsOffIcon: <NotificationsOffIcon />,
    notificationsPausedIcon: <NotificationsPausedIcon />
  };
  return (
    <PortletBody>
      <div className='__container-sendnotification-panel'>
        <div className='__container-form-checkbox'>
          <div className='__container-form'>
            <Autocomplete
              className={classes.textField}
              defaultValue={notificationFromValue}
              getOptionLabel={(option) => option.email}
              id='tags-notification-from'
              multiple
              onChange={(event, values) => (notificationFromOnChange)(event, values)}
              options={notificationFromOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label='From'
                  variant='standard'
                />
              )}
              value={notificationFromValue}
            />
            <Autocomplete
              className={classes.textField}
              defaultValue={notificationToValue}
              getOptionLabel={(option) => option.email}
              id='tags-notification-to'
              multiple
              onChange={(event, values) => (notificationToOnChange)(event, values)}
              options={notificationToOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='standard'
                  label='To'
                />
              )}
              value={notificationToValue}
            />
            <TextField
              className={classes.textField}
              id='standard-subjectNotification'
              label='Subject'
              margin='normal'
              name={subjectNotificationName}
              onChange={(event) => (subjectNotificationOnChange)(event)}
              onClick={subjectNotificationOnClick}
              value={subjectNotificationValue}
            />
          </div>
          <div className='__container-checkbox-notification'>
            <FormControlLabel
              control={
                <Switch
                  color='primary'
                  checked={disabledValue}
                  onChange={(event) => (disablesOnChange)(event)}
                />
              }
              label='Disabled'
              labelPlacement='start'
              value='start'
            />
            <div className='__container-icons'>
              <h6 className='iconSelected'>
                Icon selected:
                {iconsList[selectedIcon]}
              </h6>
              <div className='__box-icons'>
                {Object.keys(iconsList).map((key) => (
                  <ToggleButtonGroup
                    aria-label='text aligment'
                    exclusive
                    onChange={handleAlignment}
                    value={alignment}
                  >
                    <ToggleButton
                      className='notification-icons'
                      id={key}
                      key={key}
                      onClick={() => handleClickIcon(key)}
                      value={key}
                    >
                      <span
                        style={{ color: 'black' }}
                        value={key}
                      >
                        {iconsList[key]}
                      </span>
                    </ToggleButton>
                  </ToggleButtonGroup>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className='__container-message-multiline'>
          <TextField
            className={classes.textField}
            id='outlined-multiline-static'
            label='Message'
            margin='normal'
            multiline
            onChange={(event) => (messageOnChange)(event)}
            onClick={setSelectedControl}
            rows='4'
            style={{ width: '100%' }}
            value={messageValue}
          />
        </div>
      </div>
    </PortletBody>
  )
}
