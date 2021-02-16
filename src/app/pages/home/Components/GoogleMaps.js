import React from 'react';
import { GoogleApiWrapper, InfoWindow, Map, Marker } from 'google-maps-react';

const GoogleMaps = ({ center, coords, edit = false, google, setCoords, setZoom, styleMap, zoom }) => {

  const handleClick = (mapProps, map, clickEvent) => {
    if(edit){
      const newLat = clickEvent.latLng.lat();
      const newLng = clickEvent.latLng.lng();
      setCoords([{lat: newLat, lng: newLng}]);
    }
  }

  const handleDragend = (mapProps, map, clickEvent) => {
    if(edit){
      const newLat = clickEvent.latLng.lat();
      const newLng = clickEvent.latLng.lng();
      setCoords([{lat: newLat, lng: newLng}]);
    }
  }

  const handleMouse = (mapProps, map, clickEvent) => {
    if(edit){
      const newZoom = map.zoom;
      setZoom(newZoom)
    }
  }

  return (
      <Map
        initialCenter={center || {lat: 19.432608, lng:  -99.133209}}
        google={google}
        onClick={(mapProps, map, clickEvent) => handleClick(mapProps, map, clickEvent)}
        onZoomChanged={(mapProps, map, clickEvent) => handleMouse(mapProps, map, clickEvent)}
        style={styleMap}
        zoom={zoom}
        >
        {coords.map(coord => (  
          <Marker
            draggable={edit}
            onDragend={(mapProps, map, clickEvent) => handleDragend(mapProps, map, clickEvent)}
            position={coord}
          />
          ))}
      </Map>
  );
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyCaEeuOe9sg0qc0c40bH3-acdVLKWNd7Xg'
})(GoogleMaps);
