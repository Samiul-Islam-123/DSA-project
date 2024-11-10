import React, { useState } from 'react';
import CityMap from './components/CityMap';
import dijkstra from './utils/dijkstra';

const citiesGraph = {
  "City A": { "City B": Math.floor(Math.random() * 20) + 1, "City C": Math.floor(Math.random() * 20) + 1, "City E": Math.floor(Math.random() * 20) + 1, "City F": Math.floor(Math.random() * 20) + 1 },
  "City B": { "City A": Math.floor(Math.random() * 20) + 1, "City D": Math.floor(Math.random() * 20) + 1, "City C": Math.floor(Math.random() * 20) + 1, "City E": Math.floor(Math.random() * 20) + 1 },
  "City C": { "City A": Math.floor(Math.random() * 20) + 1, "City B": Math.floor(Math.random() * 20) + 1, "City D": Math.floor(Math.random() * 20) + 1, "City F": Math.floor(Math.random() * 20) + 1 },
  "City D": { "City B": Math.floor(Math.random() * 20) + 1, "City C": Math.floor(Math.random() * 20) + 1, "City E": Math.floor(Math.random() * 20) + 1 },
  "City E": { "City A": Math.floor(Math.random() * 20) + 1, "City B": Math.floor(Math.random() * 20) + 1, "City D": Math.floor(Math.random() * 20) + 1, "City F": Math.floor(Math.random() * 20) + 1 },
  "City F": { "City A": Math.floor(Math.random() * 20) + 1, "City C": Math.floor(Math.random() * 20) + 1, "City E": Math.floor(Math.random() * 20) + 1 },
  "City G": { "City H": Math.floor(Math.random() * 20) + 1, "City I": Math.floor(Math.random() * 20) + 1 },
  "City H": { "City G": Math.floor(Math.random() * 20) + 1, "City I": Math.floor(Math.random() * 20) + 1, "City J": Math.floor(Math.random() * 20) + 1 },
  "City I": { "City G": Math.floor(Math.random() * 20) + 1, "City H": Math.floor(Math.random() * 20) + 1, "City J": Math.floor(Math.random() * 20) + 1 },
  "City J": { "City H": Math.floor(Math.random() * 20) + 1, "City I": Math.floor(Math.random() * 20) + 1 },
  "City K": { "City L": Math.floor(Math.random() * 20) + 1, "City M": Math.floor(Math.random() * 20) + 1 },
  "City L": { "City K": Math.floor(Math.random() * 20) + 1, "City M": Math.floor(Math.random() * 20) + 1 },
  "City M": { "City K": Math.floor(Math.random() * 20) + 1, "City L": Math.floor(Math.random() * 20) + 1 }
};



const App = () => {
  const [shortestPath, setShortestPath] = useState(null);

  const findShortestPath = (start, end) => {
    const { distances, previous } = dijkstra(citiesGraph, start);
    
    let path = [];
    let currentCity = end;
    while (currentCity) {
      path.unshift(currentCity);
      currentCity = previous[currentCity];
    }

    setShortestPath(path);
  };

  return (
    <div>
      <h1>Shortest Path Finder</h1>
      <button onClick={() => findShortestPath('City A', 'City D')}>Find Path from City A to City D</button>
      <CityMap graph={citiesGraph} shortestPath={shortestPath} />
    </div>
  );
};

export default App;
