import ReactDOM from 'react-dom/server';
import React, { useState, useEffect  } from 'react';
import { Marker, Popup } from "react-leaflet";
import { useMapEvents } from 'react-leaflet/hooks'
import 'leaflet/dist/leaflet.css';
import { IoIosAirplane } from 'react-icons/io';
import { divIcon } from 'leaflet';
import axios from 'axios'; 
//import testdata from './testdata.json';


export default function FlightMap() {
    const [flights, setFlights] = useState([]);
    const [flightsDisplayed, setFlightsDisplayed] = useState([]);
    const [currentBounds, setCurrentBounds] = useState(null);
 
    const map = useMapEvents({
        moveend: () => {
            setCurrentBounds(map.getBounds());
        },
    })

    const fetchFlights = async () => {
        try {
            const response = await axios.get('https://opensky-network.org/api/states/all');
            setFlights(response.data.states);
            //setFlights(testdata.states);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };  

    useEffect(() => {
        fetchFlights();
        setCurrentBounds(map.getBounds());
        const intervalId = setInterval(fetchFlights, 10000);
        return () => clearInterval(intervalId);
    }, []);

      
    useEffect(() => {
        if (flights?.length){
            
            const flightsWithinBounds = flights.filter((flight) => {
                if (!currentBounds || !flight[5] || !flight[6]) {
                    return false;
                }
                return currentBounds.contains([flight[6],flight[5]]);
            });
            setFlightsDisplayed(flightsWithinBounds);
        }
    }, [currentBounds, flights]);


    const flightIcon = new divIcon({
        className: 'flight-icon',
        html: ReactDOM.renderToString(React.createElement(IoIosAirplane, { size: "33", color: "#CF9603" })),
    }); 

    return React.createElement(React.Fragment, null,
        flightsDisplayed.map((flight) => {
          const key = flight[0];
          const position = [flight[6], flight[5]];
          const popupContent = (
            React.createElement('div', null,
              React.createElement('p', null, React.createElement('strong', null, 'ICAO24: '), flight[0]),
              React.createElement('p', null, React.createElement('strong', null, 'Callsign: '), flight[1]),
              React.createElement('p', null, React.createElement('strong', null, 'Origin: '), flight[2]),
              React.createElement('p', null, React.createElement('strong', null, 'Position: '), `${flight[6]}, ${flight[5]}`),
              React.createElement('p', null, React.createElement('strong', null, 'Altitude: '), flight[7] ? flight[7] : 0),
              React.createElement('p', null, React.createElement('strong', null, 'Velocity: '), flight[9])
            )
          );
    
          return React.createElement(Marker, {
            key: key,
            position: position,
            icon: flightIcon
          },
            React.createElement(Popup, { autoClose: true }, popupContent)
          );
        })
      );
}