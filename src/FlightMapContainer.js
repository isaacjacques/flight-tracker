import React, { useState, useEffect  } from 'react';
import { MapContainer, TileLayer} from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import FlightMap from './FlightMap';

export default function FlightMapContainer() {
    const mapBounds = [
        [-90, -180], 
        [90, 180], 
    ];
   

    return (
        <MapContainer 
            center={[28,-81]} 
            zoom={5} 
            minZoom={3} 
            scrollWheelZoom={false}
            style={{ width: '100%', height: '500px' }} 
            noWrap={true} 
            maxBounds={mapBounds} 
            maxBoundsViscosity={1.0}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <FlightMap />
        </MapContainer>
    );
}