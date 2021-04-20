import React, { useState, useEffect } from 'react';

import {
  Grid,
  makeStyles,
} from '@material-ui/core';

import { hosts } from '../../utils';
import GoogleMaps from '../../Components/GoogleMaps';
import RoomIcon from '@material-ui/icons/Room';

const PIN_HEIGHT = '500px';
const { localHost } = hosts;

const useStyles = makeStyles(() => ({
  root: {
    height: PIN_HEIGHT,
    maxHeight: PIN_HEIGHT,
  },
  pin: {
    position: 'absolute',
  },
}));

export default function OtherModalMapTab({ mapInfo, mapMarker, setMapMarker }) {

  /* States */

  const classes = useStyles();
  const [marker, setMarker] = useState(mapMarker ? [mapMarker] : []);
  const [zoom, setZoom] = useState(mapInfo ? zoom : 6);

  /* Component Mounts */

  useEffect(() => setMapMarker(marker[0]), [marker]);

  useEffect(() => {
    if (mapInfo) {
      console.log(mapInfo);
      setZoom(mapInfo.zoom);
    }
  }, [mapInfo]);

  return (
    <Grid className={classes.root} container>
      {
        mapInfo
          ? (
            <>
              <GoogleMaps
                edit
                styleMap={{ height: PIN_HEIGHT, width: '90%', position: 'relative' }}
                center={mapInfo}
                coords={marker ? marker : []}
                zoom={zoom}
                setCoords={setMarker}
                setZoom={setZoom}
              />
            </>
          )
          : (
            <Grid style={{ flex: 1 }} item container alignItems="center" justify="center">
              <h6 style={{ alignSelf: 'center' }}>
                No Map Information Found
              </h6>
            </Grid>
          )
      }
    </Grid>
  )
}
