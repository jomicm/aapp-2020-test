import React, { useEffect, useState } from 'react';
import { getDB, deleteDB } from '../../../../crud/api';

export const useFieldValidator = (collectionName) => {
  const [fieldsToValidate, setFieldsToValidate] = useState({});

  useEffect(() => {
    getDB('settingsFields')
      .then(response => response.json())
      .then(data => {
        const fields = data?.response[0]?.fields[collectionName] || {};
        const fieldsToValidate = Object.keys(fields).reduce((acu, key) => (
          [...acu, ...fields[key].mandatory ? [key] : []]
        ), []);

        setFieldsToValidate({ fields, fieldsToValidate });
      })
      .catch(error => console.log('error>', error));
  }, [collectionName]);

  return fieldsToValidate;
};
