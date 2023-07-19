import ReactDOM from 'react-dom/server';
import React, { useState, useEffect  } from 'react';
import { Marker, Popup } from "react-leaflet";
import { useMapEvents } from 'react-leaflet/hooks'
import 'leaflet/dist/leaflet.css';
import { IoIosAirplane } from 'react-icons/io';
import L from 'leaflet';
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


    const flightIcon = new L.divIcon({
        className: 'flight-icon',
        html: ReactDOM.renderToString(<IoIosAirplane size="33" color = "#CF9603"/>),
        
    }); 


    return(
        <>
            {flightsDisplayed.map((flight) => (
                <Marker 
                    key = {flight[0]} 
                    position={[flight[6], flight[5]]} 
                    icon={flightIcon}
                >
                    <Popup autoClose={true}>
                        <div>
                            <p><strong>ICAO24: </strong>{flight[0]}</p>
                            <p><strong>Callsign: </strong>{flight[1]}</p>
                            <p><strong>Origin: </strong>{flight[2]}</p>
                            <p><strong>Position: </strong>{flight[6]}, {flight[5]}</p>
                            <p><strong>Altitude: </strong>{flight[7] ? flight[7] : 0}</p>
                            <p><strong>Velocity: </strong>{flight[9]}</p>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </>
    );
}