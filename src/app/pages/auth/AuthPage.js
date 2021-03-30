import React, { useEffect, useState } from 'react';
import { Link, Switch, Route, Redirect } from 'react-router-dom';
import { toAbsoluteUrl } from '../../../_metronic';
import '../../../_metronic/_assets/sass/pages/login/login-1.scss';
import { getDB, getPublicDB, postDB, getOneDB, updateDB } from '../../crud/api';
import { hosts } from '../home/utils';
import Registration from './Registration';
import ForgotPassword from './ForgotPassword';
import Login from './Login';
import './AuthPage.scss';

const { apiHost, localHost } = hosts;

const defaultDesignValues = {
  logoTitle: 'Welcome to AApp 2020!!!',
  logoMessage: 'Having total control of your assets had never been so easy and fun. Log in to start organizing your assets!',
  logoWatermark: '© 2020 AApp20',
  //
  isPrivacy: true,
  privacyTitle: 'Privacy',
  privacyURL: 'https://www.google.com/search?q=privacy&rlz=1C5CHFA_enMX862MX863&oq=privacy&aqs=chrome..69i57.3870j0j1&sourceid=chrome&ie=UTF-8',
  //
  isLegal: true,
  legalTitle: 'Legal',
  legalURL: 'https://www.google.com/search?rlz=1C5CHFA_enMX862MX863&ei=v_Z7X9-rA5CGtQa80K3QCw&q=legal&oq=legal&gs_lcp=CgZwc3ktYWIQAzIICAAQsQMQgwEyAggAMgUILhCxAzIFCAAQsQMyBQgAELEDMgIIADIICAAQsQMQgwEyAggAMgUIABCxAzICCAA6BAgAEEc6CAguELEDEIMBOgQIABBDOgIILlDBuSFY2L0hYIu_IWgAcAJ4AIABugGIAeMGkgEDMC41mAEAoAEBqgEHZ3dzLXdpesgBCMABAQ&sclient=psy-ab&ved=0ahUKEwifh7POlJ_sAhUQQ80KHTxoC7oQ4dUDCA0&uact=5',
  //
  isContact: true,
  contactTitle: 'Contact',
  contactURL: 'https://www.google.com/search?rlz=1C5CHFA_enMX862MX863&ei=8_h7X7fOGfXqtQanhIroCA&q=contact&oq=contact&gs_lcp=CgZwc3ktYWIQAzIFCAAQsQMyAggAMgUIABCxAzIFCC4QsQMyBQguELEDMgUIABCxAzICCAAyBQgAELEDMggIABCxAxCDATIFCAAQsQM6BAgAEEc6BAgAEEM6CggAELEDEIMBEEM6BAguEENQ2oABWIuLAWCRjAFoAHACeACAAbwBiAGGCJIBAzAuNpgBAKABAaoBB2d3cy13aXrIAQjAAQE&sclient=psy-ab&ved=0ahUKEwj3k8Hblp_sAhV1dc0KHSeCAo0Q4dUDCA0&uact=5',
  //
  logoLoginExt: '',
  loginBackgroundColor: '1F6E30'
};

const AuthPage = () => {
  const loadDesignData = (collectionName = 'settingsDesign') => {
    getPublicDB(collectionName)
      .then(response => response.json())
      .then(data => {
        const designData = (data.response && data.response[0]) || {};
        setValues(designData);
        const { logoLoginExt, logoBackgroundExt } = designData;
        if (logoLoginExt) {
          setLogoLoginURL(`${apiHost}/uploads/settingsDesign/logoLogin.${logoLoginExt}`);
        }
        if (logoBackgroundExt) {
          setLogoBackgroundURL(`url(${apiHost}/uploads/settingsDesign/logoBackground.${logoBackgroundExt})`);
        }
      })
      .catch(error => console.log('error>', error));
  };

  const [values, setValues] = useState(defaultDesignValues);
  const [logoLoginURL, setLogoLoginURL] = useState(`${localHost}/media/misc/placeholder-image.jpg`)
  const [logoBackgroundURL, setLogoBackgroundURL] = useState(`url(${toAbsoluteUrl('/media/bg/bg-4.jpg')})`)

  useEffect(() => {
    loadDesignData();
  }, []);

  return (
    <>
      <div className='kt-grid kt-grid--ver kt-grid--root'>
        <div
          id='kt_login'
          className='kt-grid kt-grid--hor kt-grid--root kt-login kt-login--v1'
        >
          <div className='kt-grid__item kt-grid__item--fluid kt-grid kt-grid--desktop kt-grid--ver-desktop kt-grid--hor-tablet-and-mobile'>
            <div
              className='kt-grid__item kt-grid__item--order-tablet-and-mobile-2 kt-grid kt-grid--hor kt-login__aside'
              style={{ backgroundImage: logoBackgroundURL }}
            >
              <div className='logo-container'>
                <img
                  className='logo-container__logo'
                  alt='Logo'
                  src={logoLoginURL}
                />
              </div>
              <div className='kt-grid__item kt-grid__item--fluid kt-grid kt-grid--ver'>
                <div className='kt-grid__item kt-grid__item--middle'>
                  <h3 className='kt-login__title'>{values.logoTitle}</h3>
                  <h4 className='kt-login__subtitle'>{values.logoMessage}</h4>
                </div>
              </div>
              <div className='kt-grid__item'>
                <div className='kt-login__info'>
                  <div className='kt-login__copyright'>{values.logoWatermark}</div>
                  <div className='kt-login__menu'>
                    {values.isPrivacy &&
                      <a href={values.privacyURL} className='kt-link' target='_blank' rel='noopener noreferrer'>
                        {values.privacyTitle}
                      </a>}
                    {values.isLegal &&
                      <a href={values.legalURL} className='kt-link' target='_blank' rel='noopener noreferrer'>
                        {values.legalTitle}
                      </a>}
                    {values.isContact &&
                      <a href={values.contactURL} className='kt-link' target='_blank' rel='noopener noreferrer'>
                        {values.contactTitle}
                      </a>}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: values.loginBackgroundColor || 'white' }} className='kt-grid__item kt-grid__item--fluid  kt-grid__item--order-tablet-and-mobile-1  kt-login__wrapper'>
              <Switch>
                <Route path='/auth/login' component={Login} />
                <Route path='/auth/registration' component={Registration} />
                <Route path='/auth/forgot-password' component={ForgotPassword} />
                <Redirect from='/auth' exact={true} to='/auth/login' />
                <Redirect to='/auth/login' />
              </Switch>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthPage;
