import React, { useState, useEffect } from 'react';
import TreeView from '../../Components/TreeViewComponent';
import { getDB, deleteDB } from '../../../../crud/api';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Fab,
  Button
} from '@material-ui/core';
import './LocationAssignment.scss';
import SelectIcon from '@material-ui/icons/ArrowForwardIos';
import DeleteIcon from '@material-ui/icons/Delete';

const locationsTreeData = {
  id: 'root',
  name: 'Locations',
  profileLevel: -1,
  parent: null
};

const LocationAssignment = ({ locationsTable, setLocationsTable }) => {
  console.log('locationsTable:', locationsTable)
  const [locationsTree, setLocationsTree] = useState({});
  // const [locationsTable, setLocationsTable] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState({});
  
  const constructLocationTreeRecursive = (locs) => {
    if (!locs || !Array.isArray(locs) || !locs.length) return [];
    let res = [];
    locs.forEach((location) => {
      const locObj = (({_id: id, name, profileLevel, parent}) => ({id, name, profileLevel, parent}))(location);
      const children = locations.filter(loc => loc.parent === locObj.id);
      locObj.children = constructLocationTreeRecursive(children);
      res.push(locObj);
    });
    return res;
  };

  const handleSelectLocation = (parent, level, realParent, name) => {
    console.log('level, parent, realParent', level, parent, realParent)
    setSelectedLocation({ name, level, parent, realParent });
  };

  let locations;
  const handleLoadLocations = () => {
    setLocationsTree({});
    getDB('locationsReal')
      .then(response => response.json())
      .then(async data => {
        locations = data.response.map(res => ({ ...res, id: res._id }));
        const homeLocations = data.response.filter(loc => loc.profileLevel === 0);
        const children = constructLocationTreeRecursive(homeLocations);
        locationsTreeData.children = children;
        console.log('locationsTreeData:', locationsTreeData)
        setLocationsTree(locationsTreeData);
      })
      .catch(error => console.log('error>', error));
  };

  const handleAddSelectedLocation = () => {
    if (!selectedLocation || selectedLocation.level < 0) return;
    const found = locationsTable.find(row => row.parent === selectedLocation.parent);
    if (found) return;
    setLocationsTable([ ...locationsTable, selectedLocation ]);
  };

  const handleDeleteLocationTable = (id) => () => {
    const newLocations = locationsTable.filter(row => row.parent !== id);
    setLocationsTable(newLocations);
  };

  useEffect(() => {
    handleLoadLocations();
  }, []);

  return (
    <div>
      <h2>Locs 2</h2>
      <div className="location-assignment">
        <div className="location-assignment__tree-section">
          <Fab
            aria-label="Select"
            className="location-assignment__select-button"
            color="primary"
            onClick={handleAddSelectedLocation}
            variant="extended"
          >
            Select
            <SelectIcon />
          </Fab>
          <TreeView data={locationsTree} onClick={handleSelectLocation} />
        </div>
        <div className="location-assignment__table-section">
          <Table /*className={classes.table}*/>
            <TableHead>
              <TableRow>
                <TableCell>Location</TableCell>
                <TableCell align="right">Level</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {locationsTable.map((row, ix) => (
                <TableRow key={`row-id-${ix}`}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.level}</TableCell>
                  <TableCell align="right">
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handleDeleteLocationTable(row.parent)}
                    >
                      <DeleteIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

export default LocationAssignment;