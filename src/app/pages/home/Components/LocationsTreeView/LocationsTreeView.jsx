import React, { useState, useEffect } from 'react';
import { Card, CardContent, FormLabel } from "@material-ui/core";
import { getDB } from '../../../../crud/api';
import TreeView from '../TreeViewComponent.js';
import { generateLocationsTreeData } from './utils';

const LocationsTreeView = ({ onTreeElementClick = () => {} }) => {
  const [locationsTree, setLocationsTree] = useState({});

  const loadInitData = () => {
    getDB('locationsReal')
      .then(response => response.json())
      .then(data => {
        const locationsTree = generateLocationsTreeData(data);
        setLocationsTree(locationsTree);
      })
      .catch(error => console.log('error>', error));
  };

  useEffect(() => loadInitData(), []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <FormLabel style={{marginTop: '0px'}} component="legend">Location Finder</FormLabel>
      <TreeView data={locationsTree} onClick={onTreeElementClick} />
    </div>
  );
};

export default LocationsTreeView;
