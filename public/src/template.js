import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
// import { OrbitControls } from "https://unpkg.com/three@0.112/examples/jsm/controls/OrbitControls.js";
// import { FontLoader } from "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js";
// import * as TWEEN from 'https://cdnjs.cloudflare.com/ajax/libs/tween.js/18.6.4/tween.esm.min.js';


let orbitControls, renderer, camera, scene, cameraStartPosition;


function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  // Setting the cameras start position just after instantiation 0,0,0
  // so camera will move away from origin when Tweened.
  cameraStartPosition = camera.position.clone();

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Add OrbitControls
  orbitControls = new OrbitControls(camera, renderer.domElement);
  orbitControls.minDistance = 2;    // adjust as necessary
  orbitControls.maxDistance = 200;  // adjust as necessary
  orbitControls.enabled = true;

  // Add a point light
  const light = new THREE.PointLight(0xffffff, 1, 100);
  light.position.set(0, 0, 10);
  scene.add(light);

  // Add ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.25); // color, intensity
  scene.add(ambientLight);

  camera.position.z = 3;
  camera.lookAt(scene);
}

function animate() {
  requestAnimationFrame(animate);

  
  // Update the controls for each frame
  // TWEEN.update();

  // Render the scene
  renderer.render(scene, camera);
}

// Debounce function to limit the rate at which a function can be called
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

// Create a function to handle the window resize event
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );

  // Any other custom resizing logic (if any) should be placed here...
}

// Debounced version of the window resize handler
const debouncedResizeHandler = debounce(onWindowResize, 100);

// Add the event listener for the window resize event
window.addEventListener('resize', debouncedResizeHandler);

// Cleanup function to remove the event listeners when they are no longer needed
function cleanupResizeHandlers() {
  window.removeEventListener('resize', debouncedResizeHandler);
}

init();
animate();