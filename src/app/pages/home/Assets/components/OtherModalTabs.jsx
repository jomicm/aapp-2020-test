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

const { localHost } = hosts;

export default function OtherModalTabs({ locationReal, layoutMarker, setLayoutMarker }) {

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
      setRealImageURL(`${localHost}/media/misc/placeholder-image.jpg`)
    } else {
      const result = locations.filter((location) => location._id === id);
      const image = result.map((coordinate) => coordinate.fileExt);
      if (image[0]) {
        const imageURLLayout = getImageURL(id, 'locationsReal', image[0]);
        setRealImageURL(imageURLLayout);
      } else {
        setRealImageURL(`${localHost}/media/misc/placeholder-image.jpg`);
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
          <OtherModalMapTab mapInfo={locationReal.mapInfo}/>
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
          <div>Children</div>
        </PortletBody>
      )}
    </Portlet>
  )
}
