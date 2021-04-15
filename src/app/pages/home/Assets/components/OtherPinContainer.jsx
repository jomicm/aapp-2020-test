import React, { useState, useEffect } from 'react';
import ImageMarker from 'react-image-marker';

import {
  Grid,
  makeStyles,
} from '@material-ui/core';

import { hosts, getImageURL } from '../../utils';
import { getDB } from '../../../../crud/api';
import OtherPinContent from './OtherPinContent';
import RoomIcon from '@material-ui/icons/Room';

const PIN_HEIGHT = '500px';
const { localHost } = hosts;

const useStyles = makeStyles(() => ({
  root: {
    height: PIN_HEIGHT,
    maxHeight: PIN_HEIGHT,
  },
  layoutPin: {
    height: PIN_HEIGHT,
    maxHeight: PIN_HEIGHT,
    width: '100%',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
  },
}));

export default function OtherPinContainer({ locationReal }) {

  /* State */

  const classes = useStyles();
  const [locations, setLocations] = useState([]);
  const { imageURL, mapInfo } = locationReal;
  const [realImageURL, setRealImageURL] = useState();
  const [temporalMarker, setTemporalMarker] = useState();
  const [markers, setMarkers] = useState([]);

  /* Functions */

  const loadLocations = () => {
    getDB('locationsReal')
      .then(response => response.json())
      .then(data => setLocations(data.response))
      .catch(error => console.log(error));
  };

  const handleMarkers = (marker) => {
    if (temporalMarker) {
      let filteredMarkers = markers.filter(e => e !== temporalMarker);
      filteredMarkers.push(marker);
      setTemporalMarker(marker);
      setMarkers(filteredMarkers);
      return;
    }
    setTemporalMarker(marker);
    setMarkers(prev => [ ...prev, marker ]);
  };

  const getImageUrl = (id) => {
    if (id === 'root') {
      setRealImageURL(`${localHost}/media/misc/placeholder-image.jpg`)
    } else {
      const result = locations.filter((location) => location._id === id);
      const image = result.map((coordinate) => coordinate.fileExt);
      if (image[0]) {
        const imageURLLayout = getImageURL(id, 'locationsReal', image[0]);
        console.log(imageURLLayout);
        setRealImageURL(imageURLLayout);
      } else {
        setRealImageURL(`${localHost}/media/misc/placeholder-image.jpg`);
      }
    }
  };

  /* Component Mount */

  useEffect(() => {
    loadLocations();
  }, []);

  useEffect(() => {
    getImageUrl(locationReal._id);
  }, [locations]);

  useEffect(() => {}, [markers]);

  return (
    <Grid className={classes.root} container direction="row">
      {
        mapInfo && (
          <Grid style={{ flex: 1 }} container item direction="column" alignItems="left" justify="left">
            <OtherPinContent title="Location Map Pin">
              Mapa
            </OtherPinContent>
          </Grid>
        )
      }
      {
        imageURL.length && (
          <Grid style={{ flex: 1 }} container item direction="column" alignItems="left" justify="left">
            <OtherPinContent title="Location Layout Pin">
              <ImageMarker
                src={realImageURL}
                extraClass={classes.layoutPin}
                markers={markers}
                markerComponent={() => <RoomIcon htmlColor="#C70039" fontSize="large" />}
                alt="Location Layout Pin"
                onAddMarker={handleMarkers}
              />
            </OtherPinContent>
          </Grid>
        )
      }
    </Grid>
  )
}
