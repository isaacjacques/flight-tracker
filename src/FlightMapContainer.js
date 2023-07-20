import React from 'react';
import { MapContainer, TileLayer} from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import FlightMap from './FlightMap';

export default function FlightMapContainer() {
    const mapBounds = [
        [-90, -180], 
        [90, 180], 
    ];
   

    return React.createElement(MapContainer, {
        center: [28, -81],
        zoom: 5,
        minZoom: 3,
        scrollWheelZoom: false,
        style: { width: '100%', height: '500px' },
        noWrap: true,
        maxBounds: mapBounds,
        maxBoundsViscosity: 1.0
      }, [
        React.createElement(TileLayer, {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          key: 'tileLayer'
        }),
        React.createElement(FlightMap, { key: 'flightMap' }) // Assuming you have defined the FlightMap component
      ]);
}