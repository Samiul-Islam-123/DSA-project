import React, { useState, useEffect } from 'react';
import './index.css';
// CityMap component
const CityMap = ({ graph, shortestPath, pathDetails }) => {
  const [cityPositions, setCityPositions] = useState({});
  
  // Generate positions for cities in a circular layout
  useEffect(() => {
    const positions = {};
    const cities = Object.keys(graph);
    const centerX = 400;
    const centerY = 300;
    const radius = 250;
    
    cities.forEach((city, index) => {
      const angle = (2 * Math.PI * index) / cities.length;
      positions[city] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      };
    });
    
    setCityPositions(positions);
  }, [graph]);

  const isPathEdge = (city1, city2) => {
    if (!shortestPath) return false;
    for (let i = 0; i < shortestPath.length - 1; i++) {
      if ((shortestPath[i] === city1 && shortestPath[i + 1] === city2) ||
          (shortestPath[i] === city2 && shortestPath[i + 1] === city1)) {
        return true;
      }
    }
    return false;
  };

  const getEdgeWeight = (city1, city2) => {
    return graph[city1][city2];
  };

  return (
    <div className="w-full h-[600px] border rounded-lg bg-white shadow-sm overflow-hidden">
      <svg width="800" height="600" className="w-full h-full">
        {/* Draw edges */}
        {Object.keys(cityPositions).map(city1 => 
          Object.keys(graph[city1]).map(city2 => {
            if (city1 < city2) { // Avoid drawing edges twice
              const isPath = isPathEdge(city1, city2);
              const weight = getEdgeWeight(city1, city2);
              return (
                <g key={`${city1}-${city2}`}>
                  <line
                    x1={cityPositions[city1]?.x}
                    y1={cityPositions[city1]?.y}
                    x2={cityPositions[city2]?.x}
                    y2={cityPositions[city2]?.y}
                    stroke={isPath ? "#ef4444" : "#94a3b8"}
                    strokeWidth={isPath ? 3 : 1}
                    className={isPath ? "shadow-lg" : ""}
                  />
                  {/* Edge weight */}
                  <text
                    x={(cityPositions[city1]?.x + cityPositions[city2]?.x) / 2}
                    y={(cityPositions[city1]?.y + cityPositions[city2]?.y) / 2}
                    fill={isPath ? "#ef4444" : "#64748b"}
                    className="text-sm font-medium"
                    textAnchor="middle"
                    dy="-5"
                  >
                    {weight}
                  </text>
                </g>
              );
            }
            return null;
          })
        )}
        
        {/* Draw cities */}
        {Object.entries(cityPositions).map(([city, pos]) => (
          <g key={city}>
            <circle
              cx={pos.x}
              cy={pos.y}
              r={8}
              fill={shortestPath?.includes(city) ? "#ef4444" : "#3b82f6"}
              className="shadow-md"
            />
            <text
              x={pos.x}
              y={pos.y - 15}
              textAnchor="middle"
              className="text-sm font-semibold fill-gray-700"
            >
              {city}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

// Main App component
const App = () => {
  const [citiesGraph, setCitiesGraph] = useState({});
  const [shortestPath, setShortestPath] = useState(null);
  const [pathWeight, setPathWeight] = useState(0);
  const [startCity, setStartCity] = useState("City A");
  const [endCity, setEndCity] = useState("City L");
  const [pathDetails, setPathDetails] = useState([]);

  useEffect(() => {
    // Generate initial graph
    const graph = generateRandomGraph();
    setCitiesGraph(graph);
  }, []);

  const generateRandomGraph = () => {
    const cities = [
      "City A", "City B", "City C", "City D", "City E",
      "City F", "City G", "City H"
    ];
    const graph = {};
    cities.forEach(city => {
      graph[city] = {};
    });
    
    cities.forEach(city => {
      cities.forEach(neighbor => {
        if (city !== neighbor && !graph[neighbor][city]) {
          const weight = Math.floor(Math.random() * 9) + 1;
          graph[city][neighbor] = weight;
          graph[neighbor][city] = weight;
        }
      });
    });
    return graph;
  };

  const dijkstra = (graph, start) => {
    const distances = {};
    const previous = {};
    const unvisited = new Set();

    // Initialize distances
    Object.keys(graph).forEach(city => {
      distances[city] = Infinity;
      previous[city] = null;
      unvisited.add(city);
    });
    distances[start] = 0;

    while (unvisited.size > 0) {
      // Find the unvisited city with minimum distance
      let minCity = null;
      let minDistance = Infinity;
      unvisited.forEach(city => {
        if (distances[city] < minDistance) {
          minCity = city;
          minDistance = distances[city];
        }
      });

      if (minDistance === Infinity) break;

      unvisited.delete(minCity);

      // Update distances to neighbors
      Object.entries(graph[minCity]).forEach(([neighbor, weight]) => {
        if (unvisited.has(neighbor)) {
          const newDistance = distances[minCity] + weight;
          if (newDistance < distances[neighbor]) {
            distances[neighbor] = newDistance;
            previous[neighbor] = minCity;
          }
        }
      });
    }

    return { distances, previous };
  };

  const findShortestPath = () => {
    const { distances, previous } = dijkstra(citiesGraph, startCity);
    
    let path = [];
    let currentCity = endCity;
    
    if (distances[endCity] === Infinity) {
      alert("No path exists between these cities!");
      setShortestPath(null);
      setPathWeight(0);
      setPathDetails([]);
      return;
    }

    while (currentCity) {
      path.unshift(currentCity);
      currentCity = previous[currentCity];
    }

    const segments = [];
    let totalWeight = 0;
    
    for (let i = 0; i < path.length - 1; i++) {
      const weight = citiesGraph[path[i]][path[i + 1]];
      totalWeight += weight;
      segments.push({
        from: path[i],
        to: path[i + 1],
        weight: weight
      });
    }

    setShortestPath(path);
    setPathWeight(totalWeight);
    setPathDetails(segments);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Shortest Path Finder
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Start City
          </label>
          <select
            value={startCity}
            onChange={(e) => setStartCity(e.target.value)}
            className="w-full p-2 border rounded-md shadow-sm"
          >
            {Object.keys(citiesGraph).map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            End City
          </label>
          <select
            value={endCity}
            onChange={(e) => setEndCity(e.target.value)}
            className="w-full p-2 border rounded-md shadow-sm"
          >
            {Object.keys(citiesGraph).map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={findShortestPath}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Find Shortest Path
          </button>
        </div>
      </div>

      {shortestPath && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">
            Path Details
          </h2>
          <p className="text-lg font-bold text-blue-600 mb-2">
            Total Distance: {pathWeight} units
          </p>
          <div className="space-y-1">
            {pathDetails.map((segment, index) => (
              <div key={index} className="text-gray-600">
                {segment.from} → {segment.to}: {segment.weight} units
              </div>
            ))}
          </div>
        </div>
      )}

      <CityMap
        graph={citiesGraph}
        shortestPath={shortestPath}
        pathDetails={pathDetails}
      />
      <footer className="mt-6 text-center text-gray-500 text-sm">
      Made by Shovon Manisha Samuel Arijit Satyajit
    </footer>
    </div>
  );
};

export default App;