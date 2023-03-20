import * as THREE from 'https://unpkg.com/three/build/three.module.js';

const scene = new THREE.Scene();
console.log("script imported: ");
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const cubeDefaultColor = 0x00cccc;
const cubeHoverColor = 0xff0000;
const material = new THREE.MeshLambertMaterial({ color: cubeDefaultColor });
const cube = new THREE.Mesh(geometry, material);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // color, intensity
scene.add(ambientLight);
const spotLight = new THREE.SpotLight(0xffffff, 1); // color, intensity
spotLight.position.set(5, 10, 5);
spotLight.angle = Math.PI / 4; // 45 degrees
scene.add(spotLight);

scene.add(cube);

camera.position.z = 5;

// Create a raycaster and a mouse vector
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Add event listeners for the mouse
window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('click', onMouseClick, false);

function onMouseMove(event) {
  // Normalize mouse position to [-1, 1] range
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onMouseClick() {
  // Check if there's an intersection with the cube
  if (raycaster.intersectObject(cube).length > 0) {
    // Handle the click event, e.g., navigate to a URL
    window.location.href = 'https://www.example.com';
  }
}

function animate() {
  requestAnimationFrame(animate);

  // Update the raycaster with the camera and mouse position
  raycaster.setFromCamera(mouse, camera);

  // Check for intersections with the cube
  const intersects = raycaster.intersectObjects([cube]);

  let isHovering = false;

  // Iterate through all intersections
  for (let i = 0; i < intersects.length; i++) {
    if (intersects[i].object === cube) {
      isHovering = true;
      break;
    }
  }

  if (isHovering) {
    // Change the cube's material color when hovering
    cube.material.color.set(cubeHoverColor);
  } else {
    // Reset the cube's material color when not hovering
    cube.material.color.set(cubeDefaultColor);
  }

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}

animate();


