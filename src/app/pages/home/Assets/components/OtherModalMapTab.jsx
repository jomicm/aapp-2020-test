import React, { useState } from 'react';

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

export default function OtherModalMapTab({ mapInfo }) {
  const classes = useStyles();
  const [marker, setMarker] = useState();

  return (
    <Grid className={classes.root} container>
      {
        mapInfo
          ? (
            <>
              <GoogleMaps
                styleMap={{ height: PIN_HEIGHT, width: '90%', position: 'relative' }}
                center={mapInfo}
                coords={[]}
                zoom={17}
                setCoords={({ lat, lng }) => { }}
                setZoom={(val) => { }}
              />
              <RoomIcon
                className={classes.pin}
                fontSize="large"
                htmlColor="#C70039"
              />
            </>
          )
          : (
            <Grid style={{ flex: 1 }} item container alignItems="center" justify="center">
              <h6 style={{ alignSelf: 'center' }}>
                No Map Informtation Found
              </h6>
            </Grid>
          )
      }
    </Grid>
  )
}
