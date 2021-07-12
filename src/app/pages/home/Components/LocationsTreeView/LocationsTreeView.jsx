import React, { useState, useEffect } from 'react';
import { Card, CardContent, FormLabel } from "@material-ui/core";
import { getDB } from '../../../../crud/api';
import TreeView from '../TreeViewComponent.js';
import { generateLocationsTreeData } from './utils';
import { getLocationPath } from '../../utils';

const LocationsTreeView = ({ onTreeElementClick = () => {} }) => {
  const [locationsTree, setLocationsTree] = useState({});
  const [locationsInfo, setLocationsInfo] = useState([]);
  
  const handleClick = async (info) => {
    const selected = locationsInfo.find(({id}) => id === info);
    const name = await getLocationPath(selected.id);
    onTreeElementClick({...selected, name})
  };

  const loadInitData = () => {
    getDB('locationsReal')
      .then(response => response.json())
      .then(data => {
        setLocationsInfo(data.response.map(({ _id: id, profileLevel, name }) => ({ id, profileLevel, name })));
        const locationsTree = generateLocationsTreeData(data);
        setLocationsTree(locationsTree);
      })
      .catch(error => console.log('error>', error));
  };

  useEffect(() => loadInitData(), []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <FormLabel style={{marginTop: '0px'}} component="legend">Location Finder</FormLabel>
      <TreeView data={locationsTree} onClick={handleClick} />
    </div>
  );
};

export default LocationsTreeView;
