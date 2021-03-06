import { locationsTreeData } from './constants';
let locations;

const constructLocationTreeRecursive = (locs) => {
  if (!locs || !Array.isArray(locs) || !locs.length) {
    return [];
  }
  let res = [];
  locs.forEach((location) => {
    const locObj = (({_id: id, name, profileLevel, parent}) => ({id, name, profileLevel, parent}))(location);
    const children = locations.filter(loc => loc.parent === locObj.id);
    locObj.children = constructLocationTreeRecursive(children);
    res.push(locObj);
  });

  return res;
};

export const generateLocationsTreeData = (data) => {
  locations = data.response.map(res => ({ ...res, id: res._id }));
  const homeLocations = data.response.filter(loc => loc.profileLevel === 0);
  const children = constructLocationTreeRecursive(homeLocations);
  locationsTreeData.children = children;
  
  return locationsTreeData;
};