import React, { useState, useEffect } from 'react';
import ImageMarker from 'react-image-marker';

import {
  Grid,
  makeStyles,
} from '@material-ui/core';

import { hosts } from '../../utils';
import OtherPinContent from './OtherPinContent';
import RoomIcon from '@material-ui/icons/Room';

const PIN_HEIGHT = '500px';
const { localHost } = hosts;

const useStyles = makeStyles(() => ({
  root: {
    height: PIN_HEIGHT,
    maxHeight: PIN_HEIGHT,
  },
  mapPin: {
    height: PIN_HEIGHT,
    width: '100%',
    position: 'relative',
  },
  layoutPin: {
    height: PIN_HEIGHT,
    width: '100%',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
  },
}));

export default function OtherModalLayoutTab({ layoutMarker, setLayoutMarker, realImageURL }) {
  
  /* State */

  const classes = useStyles();
  const [temporalMarker, setTemporalMarker] = useState(layoutMarker);
  const [markers, setMarkers] = useState(layoutMarker ? [layoutMarker] : []);

  /* Functions */

  const handleMarkers = (marker) => {
    if (temporalMarker) {
      let filteredMarkers = markers.filter(e => e !== temporalMarker);
      filteredMarkers.push(marker);
      setTemporalMarker(marker);
      setLayoutMarker(marker);
      setMarkers(filteredMarkers);

      return;
    }

    setTemporalMarker(marker);
    setLayoutMarker(marker);
    setMarkers(prev => [ ...prev, marker ]);
  };

  useEffect(() => { }, [markers]);

  return (
    <Grid className={classes.root} container>
      {
        realImageURL && (
          <Grid style={{ flex: 1 }} container item direction="column" alignItems="left" justify="left">
            <OtherPinContent title="Location Layout Pin">
              <ImageMarker
                src={realImageURL}
                extraClass={classes.layoutPin}
                markers={markers}
                markerComponent={() => <RoomIcon htmlColor="#C70039" fontSize="large" />}
                alt="Location Layout Pin"
                onAddMarker={marker => {
                  if (realImageURL !== `${localHost}/media/misc/placeholder-image.jpg`) {
                    handleMarkers(marker);
                  }
                }}
              />
            </OtherPinContent>
          </Grid>
        )
      }
    </Grid>
  )
}
