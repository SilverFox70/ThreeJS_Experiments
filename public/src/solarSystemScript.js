import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import { OrbitControls } from "https://unpkg.com/three@0.112/examples/jsm/controls/OrbitControls.js";
// import { createPlanet } from './solarSystemElements.js';
import planetData from './data/planet_data.js';

const planets = [];

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// Set the camera position
camera.position.set(0, 90 * Math.sin(Math.PI / 6), 35 * Math.cos(Math.PI / 6));
camera.lookAt(scene.position);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add OrbitControls
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enabled = true;

camera.position.z = 50;

// Add lights
const light = new THREE.PointLight(0xffffff, 1.5); // color, intensity
scene.add(light);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.25); // color, intensity
scene.add(ambientLight);

// Create the planets, orbit rings, then animate
init();
animate();

function createPlanets(planetData) {
  Object.keys(planetData).forEach(planet => {
    console.log(`${planet}: ${JSON.stringify(planetData[planet])}`);
    const currentPlanet = createPlanet(planetData[planet]);
    scene.add(currentPlanet);
    planets.push(currentPlanet);
    const currentOrbit = createOrbit(planetData[planet].distance);
    scene.add(currentOrbit);
  });
}

function createSun() {
  const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00, emissive: 0xffff00 });
  const sun = new THREE.Mesh(
    new THREE.SphereGeometry(3, 32, 32),
    sunMaterial
  );
  scene.add(sun);
}

function createPlanet(planetData) {
  const color = planetData.color;
  const planet = new THREE.Mesh(
    new THREE.SphereGeometry(planetData.size, 32, 32),
    new THREE.MeshLambertMaterial({ color })
  );
  planet.position.set(planetData.distance, 0, 0);
  planet.distance = planetData.distance;
  planet.speed = 1 / planetData.distance;
  return planet;
}

function createOrbit(distance) {
  const circleGeometry = new THREE.CircleGeometry(distance, 100);
  // Remove the unnecessary bits of the geometry
  circleGeometry.deleteAttribute('normal');
  circleGeometry.deleteAttribute('uv');
  circleGeometry.deleteAttribute('color');
  // Remove the positions that define the center vertices of the circle so
  // that we only draw the outer circumference
  const positionAttribute = circleGeometry.getAttribute('position');
  const newPositionArray = new Float32Array(positionAttribute.array.length - 3);
  newPositionArray.set(positionAttribute.array.subarray(3));
  const orbitGeometry = new THREE.BufferGeometry();
  orbitGeometry.setAttribute('position', new THREE.BufferAttribute(newPositionArray, 3));
  const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xaaaaaa, transparent: true, opacity: 0.5 });
  const orbit = new THREE.LineLoop(orbitGeometry, orbitMaterial);
  orbit.rotation.x = Math.PI / 2; // Rotate the orbit to align with the x-axis
  // scene.add(orbit);
  return orbit;
}

// function createOrbit(distance) {
//   const orbitGeometry = new THREE.CircleGeometry(distance, 100);
//   // orbitGeometry.vertices.shift(); // remove the center vertex
//   console.log("orbitGeometry", orbitGeometry);
//   const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xaaaaaa, transparent: true, opacity: 0.5});
//   const orbit = new THREE.LineLoop(orbitGeometry, orbitMaterial);
//   orbit.rotation.x = Math.PI / 2; // Rotate the orbit to align with the x-axis
//   scene.add(orbit);
//   return orbit;
// }

function init() {
  createSun();  
  createPlanets(planetData);
}

function animate() {
  requestAnimationFrame(animate);
  const time = performance.now() * 0.001;
  planets.forEach(planet => {
    planet.rotation.y += 0.005;
    const angle = time * planet.speed;
    planet.position.set(
      planet.distance * Math.cos(angle),
      0,
      planet.distance * Math.sin(angle)
    );
  });
  renderer.render(scene, camera);
}