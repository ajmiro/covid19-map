import React, { useState } from "react";
import mapboxgl from "mapbox-gl";
import useSWR from "swr"; // React hook to fetch the data
import Aside from './Aside';
import Map from './Map';

import "./App.scss";

// Mapbox css - needed to make tooltips work later in this article
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = "pk.eyJ1IjoiYWptaXJvMTEiLCJhIjoiY2s4djBtaDQ3MDM0dDNmcXBpNWxvbTN5bCJ9.7sko-vjf0AKOdvVhr5PpJw";

function App() {
  const fetcher = async(url) => 
    fetch(url)
      .then(r => r.json())
      // .then(data =>
      //   data.map((point, index) => ({
      //     type: "Feature",
      //     geometry: {
      //       type: "Point",
      //       coordinates: [
      //         point.coordinates.longitude,
      //         point.coordinates.latitude
      //       ]
      //     },
      //     properties: {
      //       id: index, // unique identifier in this case the index
      //       country: point.country,
      //       province: point.province,
      //       cases: point.stats.confirmed,
      //       deaths: point.stats.deaths
      //     }
      //   }))
      // );

  const [{ data }, setData] = useState(useSWR("https://corona.lmao.ninja/v2/jhucsse", fetcher));
  const [isSidebarClose, setIsSidebarClose ] = useState(false);
  console.log({ data });

  return (
    <div className="App" style={{ display: 'flex'}}>
      {
        data && 
        <Aside cases={[]} data={data} isSidebarClose={isSidebarClose} setIsSidebarClose={setIsSidebarClose} />
      }
      <Map data={data} mapState={null} setMapState={null} isSidebarClose={isSidebarClose} /> 
    </div>
  );
}

export default App;