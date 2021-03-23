import React, { useEffect, useState } from 'react';
import { getDB } from '../../../app/crud/api';
import { hosts } from '../../../app/pages/home/utils';

const { apiHost, localHost } = hosts;

const LogoAndTitle = () => {
  const [values, setValues] = useState({});

  const loadData = (collectionName = 'settingsDesign') => {
    getDB(collectionName)
      .then(response => response.json())
      .then(data => {
        const { sideBarTitle, logoSideBarExt } = data.response[0] || {};
        setValues({ sideBarTitle, logoSideBarExt })
      })
      .catch(error => console.log('error>', error));
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className='kt-aside-LogoAndTitle'>
      <img
        src={
          values.logoSideBarExt ? (
            `${apiHost}/uploads/settingsDesign/logoSideBar.${values.logoSideBarExt}`
          ) : (
            `${localHost}/media/misc/placeholder-image.jpg`
          )}
        alt='Logo'
      />
      <span>
        {values.sideBarTitle}
      </span>
    </div>
  );
}

export default (LogoAndTitle)
