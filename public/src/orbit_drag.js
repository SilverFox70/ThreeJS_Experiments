import * as THREE from "https://unpkg.com/three@0.112/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.112/examples/jsm/controls/OrbitControls.js";
import { DragControls } from "https://unpkg.com/three@0.112/examples/jsm/controls/DragControls.js";
import { TransformControls } from 'https://unpkg.com/three@0.112/examples/jsm/controls/TransformControls.js';


const scene = new THREE.Scene();
console.log("script imported: ");
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000);
document.body.appendChild(renderer.domElement);

// Create a box
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshLambertMaterial({color: 0x00cccc});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Create ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // color, intensity
scene.add(ambientLight);

// Create a spotlight
const spotLight = new THREE.SpotLight(0xffffff, 1); // color, intensity
spotLight.position.set(5, 10, 5);
spotLight.angle = Math.PI / 4; // 45 degrees
scene.add(spotLight);

// Create plane
const planeGeometry = new THREE.PlaneGeometry(10, 10);
const planeMaterial = new THREE.MeshLambertMaterial({color: 0x87cefa, side: THREE.DoubleSide});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -0.5;
scene.add(plane);

// Camera position and rotation
camera.position.set(0, 3, 5);
camera.lookAt(scene.position);

// Add OrbitControls
const orbitControls = new OrbitControls(camera, renderer.domElement);

// Add DragControls
const objects = [cube];
// const dragControls = new DragControls(objects, camera, renderer.domElement);
// dragControls.enabled = false;

// dragControls.addEventListener('dragstart', () => {
//   orbitControls.enabled = false;
// })

// dragControls.addEventListener('dragend', () => {
//   orbitControls.enabled = true;
// })

function render() {
  renderer.render(scene, camera);
}

// Add Transform controls
const transformControls = new TransformControls(camera, renderer.domElement);
transformControls.attach(cube);
scene.add(transformControls);

transformControls.addEventListener('dragging-changed', (event) => {
  orbitControls.enabled = !event.value;
})

// Add raycaster to handle "hover" events
// const raycaster = new THREE.Raycaster();
// const mouse = new THREE.Vector2();

// renderer.domElement.addEventListener('mousemove', onMouseMove);
// renderer.domElement.addEventListener('mousedown', onMouseDown);
// renderer.domElement.addEventListener('mouseup', onMouseUp);

// function onMouseMove(evt) {
//   evt.preventDefault();
//   mouse.x = (evt.clientX / window.innerWidth) * 2 - 1;
//   mouse.y = -(evt.clientY / window.innerHeight) * 2 - 1;
// }

// function onMouseDown() {
//   raycaster.setFromCamera(mouse, camera);
//   const intersects = rayscaster.intersectObjects([cube]);

//   if (intersects.length > 0) {
//     dragControls.enabled = true;
//   }
// }

// function onMouseUp() {
//   dragControls.enabled = false;
// }

function animate() {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  render();
}

animate();
