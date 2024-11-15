import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const CityMap = ({ graph, shortestPath }) => {
  const svgRef = useRef();
  const [cityPositions, setCityPositions] = useState({});
  const [initialized, setInitialized] = useState(false);  // Track initialization

  useEffect(() => {
    // Only run the position calculation once (when the graph changes and has not been initialized)
    if (initialized) return;  // Skip recalculating if already initialized

    // Sample city coordinates (this can be customized)
    const cities = Object.keys(graph);
    const positions = cities.reduce((acc, city, index) => {
      // Adjust the horizontal space (width) to be more spacious
      acc[city] = { x: 150 + (index % 6) * 200, y: 100 + Math.floor(index / 6) * 150 + Math.random() * 200 };
      return acc;
    }, {});
    setCityPositions(positions);
    setInitialized(true);  // Mark as initialized
  }, [graph, initialized]);  // Dependency on graph, so it runs only when graph changes.

  useEffect(() => {
    if (Object.keys(cityPositions).length === 0) return; // Ensure positions are available

    const svg = d3.select(svgRef.current)
      .attr('width', 1800)  // Increased width for more space
      .attr('height', 800)  // Adjusted height for a larger view
      .style('background-color', '#f4f4f4');

    // Draw roads (edges)
    for (let city in graph) {
      for (let neighbor in graph[city]) {
        const cityPos = cityPositions[city];
        const neighborPos = cityPositions[neighbor];
        
        // Check if both positions exist before drawing the line
        if (cityPos && neighborPos) {
          svg.append('line')
            .attr('x1', cityPos.x)
            .attr('y1', cityPos.y)
            .attr('x2', neighborPos.x)
            .attr('y2', neighborPos.y)
            .attr('stroke', '#ccc')
            .attr('stroke-width', 2);
        }
      }
    }

    // Draw cities (nodes)
    for (let city in cityPositions) {
      const pos = cityPositions[city];
      
      // Check if position exists before rendering city
      if (pos) {
        svg.append('circle')
          .attr('cx', pos.x)
          .attr('cy', pos.y)
          .attr('r', 10)
          .attr('fill', '#69b3a2')
          .on('click', () => alert(`City: ${city}`));

        svg.append('text')
          .attr('x', pos.x)
          .attr('y', pos.y + 30)
          .attr('text-anchor', 'middle')
          .attr('font-size', '12px')
          .attr('fill', '#333')
          .text(city);
      }
    }

    // Highlight shortest path
    if (shortestPath) {
      for (let i = 0; i < shortestPath.length - 1; i++) {
        const cityPos = cityPositions[shortestPath[i]];
        const nextCityPos = cityPositions[shortestPath[i + 1]];

        // Ensure positions are valid before drawing path
        if (cityPos && nextCityPos) {
          svg.append('line')
            .attr('x1', cityPos.x)
            .attr('y1', cityPos.y)
            .attr('x2', nextCityPos.x)
            .attr('y2', nextCityPos.y)
            .attr('stroke', 'red')
            .attr('stroke-width', 4);
        }
      }
    }
  }, [graph, cityPositions, shortestPath]);

  return <svg ref={svgRef}></svg>;
};

export default CityMap;
