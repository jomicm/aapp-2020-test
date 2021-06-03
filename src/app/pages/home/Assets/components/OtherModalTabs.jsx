import React, { useState, useEffect } from 'react';
import { Tab, Tabs } from '@material-ui/core';

import {
  Portlet,
  PortletBody,
  PortletHeader,
  PortletHeaderToolbar,
} from '../../../../../app/partials/content/Portlet';

import { hosts, getImageURL } from '../../utils';
import { getDB } from '../../../../crud/api';
import OtherModalLayoutTab from './OtherModalLayoutTab';
import OtherModalMapTab from './OtherModalMapTab';
import OtherModalChildrenTab from './OtherModalChildrenTab';

const { localHost } = hosts;

export default function OtherModalTabs({
  locationReal, layoutMarker, setLayoutMarker,
  mapMarker, setMapMarker, assetRows,
  onAssetFinderSubmit, onDeleteAssetAssigned,
  userLocations
}) {

  /* States */

  const [tab, setTab] = useState(0);
  
  // Layout
  const [locations, setLocations] = useState([]);
  const [realImageURL, setRealImageURL] = useState();

  /* Functions */

  const loadLocations = () => {
    getDB('locationsReal')
      .then(response => response.json())
      .then(data => setLocations(data.response))
      .catch(error => console.log(error));
  };

  const getImageUrl = (id) => {
    if (id === 'root') {
      setRealImageURL()
    } else {
      const result = locations.filter((location) => location._id === id);
      const image = result.map((coordinate) => coordinate.fileExt);
      if (image[0]) {
        const imageURLLayout = getImageURL(id, 'locationsReal', image[0]);
        setRealImageURL(imageURLLayout);
      } else {
        setRealImageURL();
      }
    }
  };

  /* Component Mounts */

  useEffect(() => {
    loadLocations();
  }, []);

  useEffect(() => {
    getImageUrl(locationReal._id);
  }, [locations]);

  /* Render */

  return (
    <Portlet>
      <PortletHeader
        toolbar={
          <PortletHeaderToolbar>
            <Tabs
              className='builder-tabs'
              component='div'
              onChange={(_, nextTab) => setTab(nextTab)}
              value={tab}
            >
              <Tab label="Map" />
              <Tab label="Layout" />
              <Tab label="Children" />
            </Tabs>
          </PortletHeaderToolbar>
        }
      />
      {tab === 0 && (
        <PortletBody>
          <OtherModalMapTab
            mapInfo={locationReal ? locationReal.mapInfo : null}
            mapMarker={mapMarker}
            setMapMarker={setMapMarker}
          />
        </PortletBody>
      )}

      {tab === 1 && (
        <PortletBody>
          <OtherModalLayoutTab
            realImageURL={realImageURL}
            layoutMarker={layoutMarker}
            setLayoutMarker={setLayoutMarker}
          />
        </PortletBody>
      )}

      {tab === 2 && (
        <PortletBody>
          <OtherModalChildrenTab
            assetRows={assetRows}
            onAssetFinderSubmit={onAssetFinderSubmit}
            onDeleteAssetAssigned={onDeleteAssetAssigned}
            userLocations={userLocations}
          />
        </PortletBody>
      )}
    </Portlet>
  )
}
