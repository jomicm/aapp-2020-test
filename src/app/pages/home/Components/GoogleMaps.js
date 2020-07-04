import React, { Component } from 'react';
import { Map, GoogleApiWrapper } from 'google-maps-react';

const mapStyles = {
  width: '100%',
  height: '100%'
};

export class MapContainer extends Component {
  render() {
    return (
      <Map
        google={this.props.google}
        zoom={12}
        //style={mapStyles}
        initialCenter={{
         lat: 19.432608,
         lng: -99.133209
        }}
      />
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyCaEeuOe9sg0qc0c40bH3-acdVLKWNd7Xg'
})(MapContainer);