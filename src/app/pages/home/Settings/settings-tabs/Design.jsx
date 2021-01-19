/* eslint-disable no-restricted-imports */
import React, { useEffect, useState } from 'react';
import { FormControlLabel, Tabs, Tab, TextField, Switch } from "@material-ui/core";
import { omit } from 'lodash';
import { ColorPicker } from 'material-ui-color';
import {
  Portlet,
  PortletBody,
  PortletHeader,
  PortletHeaderToolbar
} from "../../../../partials/content/Portlet";
import { getDB, postDB, getOneDB, updateDB } from '../../../../crud/api';
import ImageUpload from '../../Components/ImageUpload';
import { getFileExtension, saveImage, getImageURL, getFirstDocCollection } from '../../utils';
import SaveButton from '../settings-tabs/components/SaveButton';
import { useStyles } from './styles';
import './settings-tabs.scss';


const Design = props => {
  const classes = useStyles();
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
    loginBackgroundColor: '#000'
  });
  const [imageURLS, setImagesURLS] = useState({
    logoLogin: 'http://localhost:3000/media/misc/placeholder-image.jpg',
    logoBackground: ''
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

  const handleSave = () => {
    const imagesInfo = [];
    const logoLoginExt = !logoLogin ? null : values.logoLoginExt || getFileExtension(logoLogin);
    if (logoLogin) imagesInfo.push({ image: logoLogin, folderName: 'settingsDesign', id: 'logoLogin' });
    const logoBackgroundExt = !logoBackground ? null : values.logoBackgroundExt || getFileExtension(logoBackground);
    if (logoBackground) imagesInfo.push({ image: logoBackground, folderName: 'settingsDesign', id: 'logoBackground' });
    const body = { ...values, logoLoginExt, logoBackgroundExt };
    getFirstDocCollection('settingsDesign')
      .then(id => {
        if (!id) {
          postDB('settingsDesign', body)
            .then(data => data.json())
            .then(response => {
              saveImages(imagesInfo);
            })
            .catch(error => console.log(error));
        } else {
          updateDB('settingsDesign/', body, id)
            .then(response => {
              saveImages(imagesInfo);
              // saveAndReload('settingsDesign', 'logoLogin');
            })
            .catch(error => console.log(error));
        }
      })
      .catch(ex => {});
  };

  const [logoLogin, setLogoLogin] = useState(null);
  const [logoBackground, setLogoBackground] = useState(null);
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
      const { logoLoginExt, logoBackgroundExt, loginBackgroundColor } = _values;
      if (logoLoginExt) {
        handleImageChange('logoLogin', `http://159.203.41.87:3001/uploads/settingsDesign/logoLogin.${logoLoginExt}`);
        setLogoLogin(true);
      }
      if (logoBackgroundExt) {
        handleImageChange('logoBackground', `http://159.203.41.87:3001/uploads/settingsDesign/logoBackground.${logoBackgroundExt}`);
        setLogoBackground(true);
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
    console.log('ALRT', newValue)
    await setValues(prev => ({ ...prev, loginBackgroundColor: `#${newValue.hex}` }));
    console.log('VASL', values)
    // action('changed')(newValue);
  };

  return (
    <div>
      <div style={{textAlign: 'end', marginBottom: '15px'}}>
        <SaveButton handleOnClick={handleSave}/>
      </div>
      <Portlet>
        <PortletHeader
          toolbar={
            <PortletHeaderToolbar>
              <Tabs
                component="div"
                className="builder-tabs"
                value={tab}
                onChange={(_, nextTab) => {
                  setTab(nextTab);
                }}
              >
                <Tab label="Log In" />
                <Tab label="Main App" />
              </Tabs>
            </PortletHeaderToolbar>
          }
        />

        {tab === 0 && (
          <PortletBody>
            <div className="kt-section kt-margin-t-0">
              <div className="kt-section__body">
                <div className="kt-section">
                    <div style={{display: 'flex', marginTop: '20px'}} className='settings-design_content'>
                      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '33%', minHeight: '100px'}} className='settings-design_content_col'>
                        <ImageUpload setImage={setLogoLogin} image={imageURLS.logoLogin}>
                          Logo Login Image
                        </ImageUpload>
                        <TextField
                          label={'Logo Title'}
                          style={{width: '200px'}}
                          value={values.logoTitle}
                          onChange={handleChange('logoTitle')}
                          margin="normal"
                        />
                        <TextField
                          label={'Logo Message'}
                          style={{width: '200px'}}
                          value={values.logoMessage}
                          onChange={handleChange('logoMessage')}
                          margin="normal"
                        />
                        <TextField
                          label={'Logo Watermark'}
                          style={{width: '200px'}}
                          value={values.logoWatermark}
                          onChange={handleChange('logoWatermark')}
                          margin="normal"
                        />
                      </div>
                      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '33%', minHeight: '100px'}} className='settings-design_content_col'>
                        <FormControlLabel
                          value="start"
                          control={<Switch color="primary" checked={values.isPrivacy} onChange={handleChangeCheck('isPrivacy')}/>}
                          label="Privacy Link"
                          labelPlacement="start"
                        />
                        <TextField
                          label={'Privacy Title'}
                          style={{width: '200px'}}
                          value={values.privacyTitle}
                          onChange={handleChange('privacyTitle')}
                          margin="normal"
                          disabled={!values.isPrivacy}
                        />
                        <TextField
                          label={'Privacy URL'}
                          style={{width: '200px'}}
                          value={values.privacyURL}
                          onChange={handleChange('privacyURL')}
                          margin="normal"
                          disabled={!values.isPrivacy}
                        />
                        <FormControlLabel
                          value="start"
                          control={<Switch color="primary" checked={values.isLegal} onChange={handleChangeCheck('isLegal')}/>}
                          label="Legal Link"
                          labelPlacement="start"
                        />
                        <TextField
                          label={'Legal Title'}
                          style={{width: '200px'}}
                          value={values.legalTitle}
                          onChange={handleChange('legalTitle')}
                          margin="normal"
                          disabled={!values.isLegal}
                        />
                        <TextField
                          label={'Legal URL'}
                          style={{width: '200px'}}
                          value={values.legalURL}
                          onChange={handleChange('legalURL')}
                          margin="normal"
                          disabled={!values.isLegal}
                        />
                        <FormControlLabel
                          value="start"
                          control={<Switch color="primary" checked={values.isContact} onChange={handleChangeCheck('isContact')}/>}
                          label="Contact Link"
                          labelPlacement="start"
                        />
                        <TextField
                          label={'Contact Title'}
                          style={{width: '200px'}}
                          value={values.contactTitle}
                          onChange={handleChange('contactTitle')}
                          margin="normal"
                          disabled={!values.isContact}
                        />
                        <TextField
                          label={'Contact URL'}
                          style={{width: '200px'}}
                          value={values.contactURL}
                          onChange={handleChange('contactURL')}
                          margin="normal"
                          disabled={!values.isContact}
                        />
                      </div>
                      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '33%', minHeight: '100px'}} className='settings-design_content_col'>
                        <ImageUpload setImage={setLogoBackground} image={imageURLS.logoBackground}>
                          Logo Background Image
                        </ImageUpload>
                        <FormControlLabel
                          style={{marginTop: '20px'}}
                          value="2"
                          control={(
                             <ColorPicker value={color} onChange={handleChangeColor} disableAlpha/>
                          )}
                          label="Login Box Background color"
                          labelPlacement="top"
                        />
                      </div>
                    </div>
                    <div className="kt-separator kt-separator--dashed"/>
                    <div className="kt-section__content">
                    </div>
                  </div>
              </div>
            </div>
          </PortletBody>
        )}

        {tab === 1 && (
          <PortletBody>
            <div className="kt-section kt-margin-t-0">
              <div className="kt-section__body">
                <div className="kt-section">
                    <span className="kt-section__sub">
                      This section will integrate <code>Main App</code>
                    </span>
                    <div className="kt-separator kt-separator--dashed"/>
                    <div className="kt-section__content">
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
