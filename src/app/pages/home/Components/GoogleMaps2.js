// import React, { Component } from 'react';
// import { GoogleApiWrapper, InfoWindow, Map, Marker } from 'google-maps-react';

// const mapStyles = {
//   width: '100%',
//   height: '100%'
// };
// export class MapContainer extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       lat: 19.432608,
//       lng: -99.133209
//      };
//     // Esta línea es importante!
//     this.mapClicked = this.mapClicked.bind(this);
//   }

//   mapClicked(mapProps, map, clickEvent) {
//     const newLat = clickEvent.latLng.lat();
//     const newLng = clickEvent.latLng.lng();
//     // console.log(mapProps)
//     // console.log(map)
//     // console.log(clickEvent.latLng.lat())
//     // console.log(clickEvent.latLng.lng())
//     this.setState({
//       lat: newLat,
//       lng: newLng
//     })
//   }


//   render() {
//     return (
//       <Map
//         google={this.props.google}
//         zoom={12}
//         //style={mapStyles}
//         initialCenter={this.state}
//         initialCenter={this.props.initialCenter}
//         onClick={this.mapClicked}
//         onDragend={this.centerMoved}
//         // streetViewControl={false}
//       >
//         <Marker
//           title={'The marker`s title will appear as a tooltip.'}
//           name={'SOMA'}
//           position={this.state}
//         />
//         {/* <Marker onClick={this.onMarkerClick}
//           name={'Current location'} />
 
//         <InfoWindow onClose={this.onInfoWindowClose}>
//             <div>
//               <h1>Hola</h1>
//             </div>
//         </InfoWindow> */}
//       </Map>
//     );
//   }
// }

// export default GoogleApiWrapper({
//   apiKey: 'AIzaSyCaEeuOe9sg0qc0c40bH3-acdVLKWNd7Xg'
// })(MapContainer);