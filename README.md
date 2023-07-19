# Flight Tracker
A react app using [Leaflet](https://react-leaflet.js.org/) to visualize publicly available flight data provided by [OpenSky REST API](https://openskynetwork.github.io/opensky-api/rest.html)

![Flights](https://github.com/isaacjacques/flight-tracker/assets/137218652/b7561832-2451-4be2-b6d0-2f106ac316a1)

![FlightPopul](https://github.com/isaacjacques/flight-tracker/assets/137218652/d224620e-d72f-41ce-ac71-97c7053b66de)

## How it works
The app fetches data from the OpenSky API every 10 seconds (see API [Limitations](https://openskynetwork.github.io/opensky-api/rest.html#limitations)).
```js
    useEffect(() => {
        fetchFlights();
        setCurrentBounds(map.getBounds());
        const intervalId = setInterval(fetchFlights, 10000);
        return () => clearInterval(intervalId);
    }, []);
```

Using the map events leaflet hooks, the map boundaries are stored when users finish paning or zooming.
```js
const map = useMapEvents({
    moveend: () => {
        setCurrentBounds(map.getBounds());
    },
})
```

This allows for some optimization by only creating map markers for flights positioned within the bounds of the map.
This hook is triggered by a change to the stored map boundry OR the raw flight data fetched every 10 seconds.
```js
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
```

Each marker contains a leaflet popup component which is triggered by selecting the flight.
The popup displays information such as the Callsign, Origin country, Altitude etc.
```js
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
```

## Technologies Used
* VS Code
* React
  * react-leaflet
  * axios
  * react-icons

## Authors
* **Isaac Jacques** - *Initial work* - [isaacjacques](https://isaacjacques.com)
 
## License
This project is licensed under the terms of the MIT license, see LICENSE.
