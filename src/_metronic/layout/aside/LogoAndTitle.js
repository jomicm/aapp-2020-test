import React, { useEffect, useState } from 'react'
import { getDB } from '../../../app/crud/api';

const {
  REACT_APP_API_SERVER,
  REACT_APP_API_PORT,
  REACT_APP_LOCALHOST,
  LOCALHOST_PORT
} = process.env;

const host = `${REACT_APP_API_SERVER}:${REACT_APP_API_PORT}`;
const localHost = `${REACT_APP_LOCALHOST}:${LOCALHOST_PORT}`;

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
            `${host}/uploads/settingsDesign/logoSideBar.${values.logoSideBarExt}`
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
