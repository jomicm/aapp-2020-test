import React, { useEffect, useState } from 'react'
import { getDB } from '../../../app/crud/api';

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
    <div className='ket-aside-LogoAndTitle'>
      <img
        src={
          values.logoSideBarExt ? (
            `http://159.203.41.87:3001/uploads/settingsDesign/logoSideBar.${values.logoSideBarExt}`
          ) : (
              'http://localhost:3000/media/misc/placeholder-image.jpg'
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
