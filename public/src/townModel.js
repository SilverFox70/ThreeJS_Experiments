import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import { OrbitControls } from "https://unpkg.com/three@0.112/examples/jsm/controls/OrbitControls.js";
// import { SimplexNoise } from 'https://cdnjs.cloudflare.com/ajax/libs/simplex-noise/2.0.0/simplex-noise.js';



const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// Set the camera position
camera.position.set(0, 90 * Math.sin(Math.PI / 6), 35 * Math.cos(Math.PI / 6));
camera.lookAt(scene.position);
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add OrbitControls
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enabled = true;

camera.position.z = 50;

// Create a directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // color, intensity
directionalLight.position.set(25, 50, 50);
directionalLight.castShadow = true;
directionalLight.castShadow = true;
directionalLight.shadow.camera.left = -100;
directionalLight.shadow.camera.right = 100;
directionalLight.shadow.camera.top = 100;
directionalLight.shadow.camera.bottom = -100;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 500;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
scene.add(directionalLight);

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
scene.add(directionalLightHelper);


// Add ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.25); // color, intensity
scene.add(ambientLight);

const terrainGeometry = new THREE.PlaneBufferGeometry(200, 200, 199, 199);
terrainGeometry.rotateX(-Math.PI / 2);
// const terrainTexture = new THREE.TextureLoader().load(
//   `src/media/aerial_grass_rock.jpg`
// );
// // Set the texture repeat
// terrainTexture.wrapS = terrainTexture.wrapT = THREE.RepeatWrapping;
// terrainTexture.repeat.set(10, 10);
// const terrainMaterial = new THREE.MeshBasicMaterial({
//   map: terrainTexture
// });

const terrainMaterial = new THREE.MeshLambertMaterial({ color: 0x32a852 })
const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
terrain.receiveShadow = true;


// Instantiate the Simplex noise generator
const simplex = new SimplexNoise();

// Set the noise scale (increase or decrease for more or less detail)
const noiseScale = 200;

// Modify the terrain vertices to create a gently rolling landscape using Simplex noise
for (let i = 0, l = terrainGeometry.attributes.position.array.length; i < l; i += 3) {
  const x = terrainGeometry.attributes.position.array[i];
  const z = terrainGeometry.attributes.position.array[i + 2];
  const noiseValue = simplex.noise2D(x / noiseScale, z / noiseScale);

  terrainGeometry.attributes.position.array[i + 1] = noiseValue * 10; // Multiply by a factor to control the amplitude of the hills
}

terrainGeometry.attributes.position.needsUpdate = true;

// Compute vertex normals
terrainGeometry.computeVertexNormals();

scene.add(terrain);

// Single build material for now....
const buildingMaterial = new THREE.MeshLambertMaterial({ color: 0xd4d2cf });

function createBuilding(x, y, z, width, height, depth, color) {
  const buildingGeometry = new THREE.BoxGeometry(width, height, depth);
  const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
  building.castShadow = true;
  building.position.set(x, 0, z);
  scene.add(building);
}

// Add a few buildings to the scene
createBuilding(-40, 0, -40, 10, 20, 10, 0xff0000);
createBuilding(40, 0, -40, 10, 15, 10, 0x00ff00);
createBuilding(-40, 0, 40, 10, 25, 10, 0x0000ff);

// Handles when window is resized
window.onresize = function () {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

};

function animate() {
  requestAnimationFrame(animate);

  // Update the controls for each frame
  orbitControls.update();

  // Render the scene
  renderer.render(scene, camera);
}

animate();
