import { useEffect, useState } from 'react';
import { getDB } from '../../../../crud/api';

export const usePolicies = () => {
  const [policies, setPolicies] = useState([]);

  useEffect(() => {
    getDB('policies')
      .then((response) => response.json())
      .then((data) => {
        setPolicies(data.response);
      })
      .catch((error) => console.log('error: ', error));
  }, []);

  return policies;
};
