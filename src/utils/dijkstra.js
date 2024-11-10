class PriorityQueue {
    constructor() {
      this.queue = [];
    }
  
    enqueue(element, priority) {
      this.queue.push({ element, priority });
      this.queue.sort((a, b) => a.priority - b.priority);
    }
  
    dequeue() {
      return this.queue.shift();
    }
  
    isEmpty() {
      return this.queue.length === 0;
    }
  }
  
  function dijkstra(graph, start) {
    const distances = {};
    const previous = {};
    const nodes = new PriorityQueue();
  
    // Initialize distances to infinity, except for the start city
    for (let city in graph) {
      distances[city] = Infinity;
      previous[city] = null;
      nodes.enqueue(city, Infinity);
    }
    distances[start] = 0;
    nodes.enqueue(start, 0);
  
    while (!nodes.isEmpty()) {
      const closestNode = nodes.dequeue().element;
      
      for (let neighbor in graph[closestNode]) {
        const alt = distances[closestNode] + graph[closestNode][neighbor];
        if (alt < distances[neighbor]) {
          distances[neighbor] = alt;
          previous[neighbor] = closestNode;
          nodes.enqueue(neighbor, distances[neighbor]);
        }
      }
    }
  
    return { distances, previous };
  }
  
  export default dijkstra;
  