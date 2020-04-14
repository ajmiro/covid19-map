import React, { useState, useRef, useEffect } from 'react';
import mapboxgl from "mapbox-gl";
import lookup from "country-code-lookup"; // npm module to get ISO Code for countries
// import Popup from './map/popup';

// Mapbox css - needed to make tooltips work later in this article
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = "pk.eyJ1IjoiYWptaXJvMTEiLCJhIjoiY2s4djBtaDQ3MDM0dDNmcXBpNWxvbTN5bCJ9.7sko-vjf0AKOdvVhr5PpJw";

const Map = ({ data, mapState, setMapState, isSidebarClose }) => {
    console.log({ data });
    const mapboxElRef = useRef(null); // DOM element to render map
    const [mapStyle, setMapStyle] = useState(data);

    useEffect(() => {

        if( data ) {
          const mapboxData = data.map((point, index) => ({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [
                point.coordinates.longitude,
                point.coordinates.latitude
              ]
            },
            properties: {
              id: index, // unique identifier in this case the index
              country: point.country,
              province: point.province,
              cases: point.stats.confirmed,
              deaths: point.stats.deaths
            }
          }))
          // You can store the map instance with useRef too
        const map = new mapboxgl.Map({
          container: mapboxElRef.current,
          style: "mapbox://styles/ajmiro11/ck8wdd38a1gjy1ik50a6urghu",
          center: [16, 27], // initial geo location
          zoom: 2 // initial zoom
        });
    
        // Add navigation controls to the top right of the canvas
        map.addControl(new mapboxgl.NavigationControl());
          // Call this method when the map is loaded
          map.once("load", function() {
            // Add our SOURCE
            // with id "points"
            map.addSource("points", {
              type: "geojson",
              data: {
                type: "FeatureCollection",
                features: mapboxData
              }
            });
    
            // Add our layer
            map.addLayer({
              id: "circles",
              source: "points", // this should be the id of the source
              type: "circle",
              // paint properties
              paint: {
                "circle-opacity": 0.80,
                "circle-stroke-width": [
                  "interpolate",
                  ["linear"],
                  ["get", "cases"],
                  1, 0.5,
                  100000, 1,
                ],
                "circle-radius": [
                  "interpolate",
                  ["linear"],
                  ["get", "cases"],
                  1, 4,
                  1000, 8,
                  4000, 10,
                  8000, 14,
                  12000, 18,
                  100000, 40
                ],
                "circle-color": [
                  "interpolate",
                  ["linear"],
                  ["get", "cases"],
                  1, '#ffffb2',
                  5000, '#fed976',
                  10000, '#feb24c',
                  25000, '#fd8d3c',
                  50000, '#fc4e2a',
                  75000, '#e31a1c',
                  100000, '#b10026'
                ],
                "circle-stroke-color": [
                  "interpolate",
                  ["linear"],
                  ["get", "cases"],
                  1, '#ffffb2',
                  5000, '#fed976',
                  10000, '#feb24c',
                  25000, '#fd8d3c',
                  50000, '#fc4e2a',
                  75000, '#e31a1c',
                  100000, '#b10026'
                ]
              }
            });
    
            // Create a mapbox popup
            const popup = new mapboxgl.Popup({
              closeButton: true,
              closeOnClick: true
            });
    
            // Variable to hold the active country/province on hover
            let lastId;
    
            // Mouse move event
            map.on("mousemove", "circles", e => {
              // Get the id from the properties
              const id = e.features[0].properties.id;
    
              // Only if the id are different we process the tooltip
              if (id !== lastId) {
                lastId = id;
    
                // Change the pointer type on move move
                map.getCanvas().style.cursor = "pointer";
    
                const { cases, deaths, country, province } = e.features[0].properties;
                const coordinates = e.features[0].geometry.coordinates.slice();
    
                // Get all data for the tooltip
                const countryISO =
                  lookup.byCountry(country)?.iso2 || lookup.byInternet(country)?.iso2;
    
                const provinceHTML =
                  province !== "null" ? `<p>Province: <b>${province}</b></p>` : "";
    
                const mortalityRate = ((deaths / cases) * 100).toFixed(2);
    
                const countryFlagHTML = Boolean(countryISO)
                  ? `<img src="https://www.countryflags.io/${countryISO}/flat/64.png"></img>`
                  : "";
    
                const HTML = `<p>Country: <b>${country}</b></p>
                  ${provinceHTML}
                  <p>Cases: <b>${cases}</b></p>
                  <p>Deaths: <b>${deaths}</b></p>
                  <p>Mortality Rate: <b>${mortalityRate}%</b></p>
                  ${countryFlagHTML}`;
    
                // Ensure that if the map is zoomed out such that multiple
                // copies of the feature are visible, the popup appears
                // over the copy being pointed to.
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                  coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }
    
                popup
                  .setLngLat(coordinates)
                  .setHTML(HTML)
                  .addTo(map);
              }
            });
    
            // Mouse leave event
            map.on("mouseleave", "circles", function() {
              // Reset the last Id
              lastId = undefined;
              map.getCanvas().style.cursor = "";
              popup.remove();
            });
          });
        }
        
    }, [data, isSidebarClose]);

    useEffect(() => {
        if( isSidebarClose ) {
            setMapStyle({ width: '100%' });
        } else {
            setMapStyle({ width: '80%' });
        }
        
    }, [isSidebarClose])

    return (
        <div className="mapContainer" style={mapStyle}>
            {/* Assigned Mapbox container */}
            <div className="mapBox" ref={mapboxElRef} />
      </div>
    )
}

export default Map