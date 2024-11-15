import React, { useState } from 'react';
import CityMap from './components/CityMap';
import dijkstra from './utils/dijkstra';

// Function to generate a random network
const generateRandomGraph = () => {
  const cities = [
    "City A", "City B", "City C", "City D", "City E", 
    "City F", "City G", "City H", "City I", "City J", 
    "City K", "City L", "City M"
  ];

  const graph = {};

  cities.forEach(city => {
    graph[city] = {};
  });

  // Randomly generate edges and weights between cities
  cities.forEach(city => {
    cities.forEach(neighbor => {
      if (city !== neighbor && !graph[neighbor][city]) {  // Avoid adding a reverse edge or self-loop
        const weight = Math.floor(Math.random() * 10) + 1;  // Random weight between 1 and 20
        graph[city][neighbor] = weight;
      }
    });
  });

  return graph;
};

const App = () => {
  // Initialize the graph with random connections
  const citiesGraph = generateRandomGraph();
  
  const [shortestPath, setShortestPath] = useState(null);
  const [startCity, setStartCity] = useState("City A");  // Default start city
  const [endCity, setEndCity] = useState("City L");  // Default end city

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
      
      {/* Dropdown for selecting start city */}
      <label htmlFor="start-city">Select Start City: </label>
      <select
        id="start-city"
        value={startCity}
        onChange={(e) => setStartCity(e.target.value)}
      >
        {Object.keys(citiesGraph).map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>

      {/* Dropdown for selecting end city */}
      <label htmlFor="end-city">Select End City: </label>
      <select
        id="end-city"
        value={endCity}
        onChange={(e) => setEndCity(e.target.value)}
      >
        {Object.keys(citiesGraph).map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>

      <button onClick={() => findShortestPath(startCity, endCity)}>
        Find Path
      </button>
      
      {/* Render the city map and shortest path visualization */}
      <CityMap graph={citiesGraph} shortestPath={shortestPath} />
    </div>
  );
};

export default App;
