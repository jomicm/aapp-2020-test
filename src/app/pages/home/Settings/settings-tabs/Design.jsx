/* eslint-disable no-restricted-imports */
import React, { useEffect, useState, useRef } from 'react';
import { omit } from 'lodash';
import { useFormikContext } from 'formik';
import { ColorPicker } from 'material-ui-color';
import { FormControlLabel, Tabs, Tab, TextField, Switch } from '@material-ui/core';
import {
  Portlet,
  PortletBody,
  PortletHeader,
  PortletHeaderToolbar
} from '../../../../partials/content/Portlet';
import { getDB, postDB, updateDB } from '../../../../crud/api';
import ImageUpload from '../../Components/ImageUpload';
import { hosts, getFileExtension, saveImage, getFirstDocCollection } from '../../utils';
import Builder from '../../Builder';
import SaveButton from '../settings-tabs/components/SaveButton';
import './settings-tabs.scss';

const { apiHost, localHost } = hosts;

const Design = props => {
  const [tab, setTab] = useState(0);
  const [values, setValues] = useState({
    logoTitle: '',
    logoMessage: '',
    logoWatermark: '',
    isPrivacy: '',
    privacyTitle: '',
    privacyURL: '',
    isLegal: '',
    legalTitle: '',
    legalURL: '',
    isContact: '',
    contactTitle: '',
    contactURL: '',
    loginBackgroundColor: '#000',
    sideBarTitle: ''
  });
  const [imageURLS, setImagesURLS] = useState({
    logoLogin: `${localHost}/media/misc/placeholder-image.jpg`,
    logoBackground: `${localHost}/media/misc/placeholder-image.jpg`,
    logoSideBar: `${localHost}/media/misc/placeholder-image.jpg`
  });

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };
  const handleChangeCheck = name => event => {
    setValues({ ...values, [name]: event.target.checked });
  };
  const handleImageChange = (name, value) => {
    setImagesURLS(prev => ({ ...prev, [name]: value }));
  };

  const [layoutValues, setLayoutValues] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    const imagesInfo = [];
    const logoLoginExt = !logoLogin ? null : (typeof logoLogin !== 'object') ? values.logoLoginExt : getFileExtension(logoLogin);
    if (logoLogin) imagesInfo.push({ image: logoLogin, folderName: 'settingsDesign', id: 'logoLogin' });
    const logoBackgroundExt = !logoBackground ? null : (typeof logoBackground !== 'object') ? values.logoBackgroundExt : getFileExtension(logoBackground);
    if (logoBackground) imagesInfo.push({ image: logoBackground, folderName: 'settingsDesign', id: 'logoBackground' });
    const logoSideBarExt = !logoSideBar ? null : (typeof logoSideBar !== 'object') ? values.logoSideBarExt : getFileExtension(logoSideBar);
    if (logoSideBar) imagesInfo.push({ image: logoSideBar, folderName: 'settingsDesign', id: 'logoSideBar' });
    const body = { ...values, logoLoginExt, logoBackgroundExt, logoSideBarExt };
    getFirstDocCollection('settingsDesign')
      .then(id => {
        if (!id) {
          postDB('settingsDesign', body)
            .then(data => data.json())
            .then(response => {
              saveImages(imagesInfo);
            })
            .catch(error => console.log(error));
          setLoading(false);
        } else {
          updateDB('settingsDesign/', body, id)
            .then(response => {
              saveImages(imagesInfo);
            })
            .catch(error => console.log(error));
          setLoading(false);
        }
      })
      .catch(ex => { });
  };

  const [logoLogin, setLogoLogin] = useState(null);
  const [logoBackground, setLogoBackground] = useState(null);
  const [logoSideBar, setLogoSideBar] = useState(null);
  const Formik = useFormikContext();
  const saveImages = (info = []) => {
    info.forEach(({ image, folderName, id }) => {
      if (typeof image !== 'object') return;
      saveImage(image, folderName, id);
    });
  };

  const loadProcessesData = (collectionName = 'settingsDesign') => {
    getDB(collectionName)
      .then(response => response.json())
      .then(data => {
        const _values = data.response[0] || {};
        setValues(omit(_values, '_id'));
        const { logoLoginExt, logoBackgroundExt, loginBackgroundColor, logoSideBarExt } = _values;
        if (logoLoginExt) {
          handleImageChange('logoLogin', `${apiHost}/uploads/settingsDesign/logoLogin.${logoLoginExt}`);
          setLogoLogin(true);
        }
        if (logoBackgroundExt) {
          handleImageChange('logoBackground', `${apiHost}/uploads/settingsDesign/logoBackground.${logoBackgroundExt}`);
          setLogoBackground(true);
        }
        if (logoSideBarExt) {
          handleImageChange('logoSideBar', `${apiHost}/uploads/settingsDesign/logoSideBar.${logoSideBarExt}`);
          setLogoSideBar(true);
        }
        if (loginBackgroundColor) {
          handleChangeColor(loginBackgroundColor);
        }
      })
      .catch(error => console.log('error>', error));
  };

  useEffect(() => {
    loadProcessesData();
  }, []);

  const [color, setColor] = useState('');
  const handleChangeColor = async newValue => {
    setColor(newValue);
    await setValues(prev => ({ ...prev, loginBackgroundColor: `#${newValue.hex}` }));
  };

  const builderRef = useRef();

  return (
    <div>
      <Portlet>
        <PortletHeader
          toolbar={
            <PortletHeaderToolbar className='PortletHeaderToolbar-Settings-Design-MainApp'>
              <div>
                <Tabs
                  component='div'
                  className='builder-tabs'
                  value={tab}
                  onChange={(_, nextTab) => {
                    setTab(nextTab);
                  }}
                >
                  <Tab label='Log In' />
                  <Tab label='Main App' />
                </Tabs>
              </div>
              <div style={{ textAlign: 'end', display: 'flex' }}>
                <SaveButton
                  loading={loading}
                  handleOnClick={() => {
                    setLoading(true);
                    handleSave();
                    if (tab === 1) {
                      builderRef.current.update(layoutValues)
                    }
                  }} />
                {
                  tab === 1 && (
                    <button
                      className={'btn btn-secondary btn-elevate kt-login__btn-primary'}
                      onClick={() => Formik.handleReset()}
                      style={{ marginLeft: '5px', paddingRight: '2.5rem' }}
                      type='button'
                    >
                      <i className='la la-recycle' /> Reset
                    </button>
                  )
                }
              </div>
            </PortletHeaderToolbar>
          }
        />

        {tab === 0 && (
          <PortletBody>
            <div className='kt-section kt-margin-t-0'>
              <div className='kt-section__body'>
                <div className='kt-section'>
                  <div style={{ display: 'flex', marginTop: '20px' }} className='settings-design_content'>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '33%', minHeight: '100px' }} className='settings-design_content_col'>
                      <ImageUpload setImage={setLogoLogin} image={imageURLS.logoLogin}>
                        Logo Login Image
                      </ImageUpload>
                      <TextField
                        label={'Logo Title'}
                        style={{ width: '200px' }}
                        value={values.logoTitle}
                        onChange={handleChange('logoTitle')}
                        margin='normal'
                      />
                      <TextField
                        label={'Logo Message'}
                        style={{ width: '200px' }}
                        value={values.logoMessage}
                        onChange={handleChange('logoMessage')}
                        margin='normal'
                      />
                      <TextField
                        label={'Logo Watermark'}
                        style={{ width: '200px' }}
                        value={values.logoWatermark}
                        onChange={handleChange('logoWatermark')}
                        margin='normal'
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '33%', minHeight: '100px' }} className='settings-design_content_col'>
                      <FormControlLabel
                        value='start'
                        control={<Switch color='primary' checked={values.isPrivacy} onChange={handleChangeCheck('isPrivacy')} />}
                        label='Privacy Link'
                        labelPlacement='start'
                      />
                      <TextField
                        label={'Privacy Title'}
                        style={{ width: '200px' }}
                        value={values.privacyTitle}
                        onChange={handleChange('privacyTitle')}
                        margin='normal'
                        disabled={!values.isPrivacy}
                      />
                      <TextField
                        label={'Privacy URL'}
                        style={{ width: '200px' }}
                        value={values.privacyURL}
                        onChange={handleChange('privacyURL')}
                        margin='normal'
                        disabled={!values.isPrivacy}
                      />
                      <FormControlLabel
                        value='start'
                        control={<Switch color='primary' checked={values.isLegal} onChange={handleChangeCheck('isLegal')} />}
                        label='Legal Link'
                        labelPlacement='start'
                      />
                      <TextField
                        label={'Legal Title'}
                        style={{ width: '200px' }}
                        value={values.legalTitle}
                        onChange={handleChange('legalTitle')}
                        margin='normal'
                        disabled={!values.isLegal}
                      />
                      <TextField
                        label={'Legal URL'}
                        style={{ width: '200px' }}
                        value={values.legalURL}
                        onChange={handleChange('legalURL')}
                        margin='normal'
                        disabled={!values.isLegal}
                      />
                      <FormControlLabel
                        value='start'
                        control={<Switch color='primary' checked={values.isContact} onChange={handleChangeCheck('isContact')} />}
                        label='Contact Link'
                        labelPlacement='start'
                      />
                      <TextField
                        label={'Contact Title'}
                        style={{ width: '200px' }}
                        value={values.contactTitle}
                        onChange={handleChange('contactTitle')}
                        margin='normal'
                        disabled={!values.isContact}
                      />
                      <TextField
                        label={'Contact URL'}
                        style={{ width: '200px' }}
                        value={values.contactURL}
                        onChange={handleChange('contactURL')}
                        margin='normal'
                        disabled={!values.isContact}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '33%', minHeight: '100px' }} className='settings-design_content_col'>
                      <ImageUpload setImage={setLogoBackground} image={imageURLS.logoBackground}>
                        Logo Background Image
                      </ImageUpload>
                      <FormControlLabel
                        style={{ marginTop: '20px' }}
                        value='2'
                        control={(
                          <ColorPicker value={color} onChange={handleChangeColor} disableAlpha />
                        )}
                        label='Login Box Background color'
                        labelPlacement='top'
                      />
                    </div>
                  </div>
                  <div className='kt-separator kt-separator--dashed' />
                  <div className='kt-section__content'>
                  </div>
                </div>
              </div>
            </div>
          </PortletBody>
        )}

        {tab === 1 && (
          <PortletBody>
            <div className='kt-section kt-margin-t-0'>
              <div className='kt-section__body'>
                <div className='kt-section'>
                  <Builder
                    logoImage={imageURLS.logoSideBar}
                    onChange={(value) => {
                      setValues(prev => ({
                        ...prev,
                        sideBarTitle: value
                      }))
                    }}
                    ref={builderRef}
                    sideTitleValue={values.sideBarTitle}
                    setLogoImage={setLogoSideBar}
                    updateValues={(values) => {
                      setLayoutValues(values);
                    }}
                  />
                  <div className='kt-separator kt-separator--dashed' />
                  <div className='kt-section__content'>
                  </div>
                </div>
              </div>
            </div>
          </PortletBody>
        )}

      </Portlet>
    </div>
  );
}

export default Design;
