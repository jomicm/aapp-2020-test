import React, { useEffect } from 'react';
import { GoogleApiWrapper, Map, Marker } from 'google-maps-react';

const GoogleMaps = ({ 
  center, 
  coords, 
  edit = false, 
  google, 
  setCoords, 
  setZoom, 
  styleMap, 
  zoom }) => {

  const handleClick = (mapProps, map, { latLng }) => {
    if (edit) {
      const lat = latLng.lat();
      const lng = latLng.lng();
      setCoords([{ lat, lng }]);
    }
  }

  const handleDragEnd = (mapProps, map, { latLng }) => {
    if (edit) {
      const lat = latLng.lat();
      const lng = latLng.lng();
      setCoords([{ lat, lng }]);
    }
  }

  const handleZoomChanged = (mapProps, { zoom }, clickEvent) => {
    if (edit) {
      setZoom(zoom)
    }
  }

  return (
      <Map
        google={google}
        initialCenter={center}
        onClick={handleClick}
        onZoomChanged={handleZoomChanged}
        style={styleMap}
        zoom={zoom}
      >
      {coords.map((coord) => (  
        <Marker
          draggable={edit}
          onDragend={handleDragEnd}
          position={coord}
        />
        ))}
      </Map>
  );
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyCaEeuOe9sg0qc0c40bH3-acdVLKWNd7Xg'
})(GoogleMaps);
