import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { OrbitControls } from "https://unpkg.com/three@0.112/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js";
import { TTFLoader } from "https://unpkg.com/three@0.112/examples/jsm/loaders/TTFLoader.js";


let orbitControls, renderer, camera, scene;

function createTextMesh(text, chevron) {
  const loader = new FontLoader();
  let textMesh;

  loader.load("https://threejs.org/examples/fonts/helvetiker_regular.typeface.json", font => {
    const geometry = new THREE.TextGeometry(text, {
      font: font,
      size: 0.1,
      height: 0.015,
      curveSegments: 12,
      bevelEnabled: false,
    });

    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    textMesh = new THREE.Mesh(geometry, material);

    // Calculate the chevron's bounding box
    const chevronBox = new THREE.Box3().setFromObject(chevron);
    const chevronCenter = new THREE.Vector3();
    chevronBox.getCenter(chevronCenter);
    console.log("chevronCenter: ", chevronCenter);

    // Calculate the text's bounding box
    const textBox = new THREE.Box3().setFromObject(textMesh);
    const textCenter = new THREE.Vector3();
    textBox.getCenter(textCenter);
    console.log("textCenter: ", textCenter);

    const relativePosition = new THREE.Vector3(
      chevronCenter.x - textCenter.x,
      chevronCenter.y - textCenter.y + 0.25,
      0.1
    );
    console.log("relativePosition: ", relativePosition);

    textMesh.position.set(relativePosition.x, relativePosition.y, relativePosition.z);
    scene.add(textMesh);
  });

  return textMesh;
}


function createChevron(originX, originY, color) {
  const width = 1;
  const height = 1;
  const depth = 0.1;
  const offset = 0.25;
  const p = {
    "a": [(width / 2) * -1, 0],
    "b": [(offset + (width / 2)) * -1, (height / 2)],
    "c": [(width / 2) - offset, (height / 2)],
    "d": [(width / 2), 0],
    "e": [(width / 2) - offset, (height / 2) * -1],
    "f": [(offset + (width / 2)) * -1, (height / 2) * -1],
  }
  const shape = new THREE.Shape();
  shape.moveTo(p.a[0] + originX, p.a[1] + originY);
  shape.lineTo(p.b[0] + originX, p.b[1] + originY);
  shape.lineTo(p.c[0] + originX, p.c[1] + originY);
  shape.lineTo(p.d[0] + originX, p.d[1] + originY);
  shape.lineTo(p.e[0] + originX, p.e[1] + originY);
  shape.lineTo(p.f[0] + originX, p.f[1] + originY);
  shape.lineTo(p.a[0] + originX, p.a[1] + originY);

  const extrudeSettings = {
    steps: 1,
    depth: depth,
    bevelEnabled: false,
  };

  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  const material = new THREE.MeshLambertMaterial({ color: color });
  const chevron = new THREE.Mesh(geometry, material);

  return chevron;
}

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Add OrbitControls
  orbitControls = new OrbitControls(camera, renderer.domElement);
  orbitControls.enabled = true;

  const chevron1 = createChevron((0.825 * -2), 0, 0xff9c00);
  const chevron2 = createChevron((0.55 * -1), 0, 0x88ce35);
  const chevron3 = createChevron((0.55 * 1), 0, 0x00a1d9);
  const chevron4 = createChevron((0.825 * 2), 0, 0x562778);
  const text1 = createTextMesh("Phase 1", chevron1);
  const text2 = createTextMesh("Phase 2", chevron2);
  const text3 = createTextMesh("Phase 3", chevron3);
  const text4 = createTextMesh("Phase 4", chevron4);
  // chevron1.add(text1);
  scene.add(chevron1);
  scene.add(chevron2);
  scene.add(chevron3);
  scene.add(chevron4);

  const light = new THREE.PointLight(0xffffff, 1, 100);
  light.position.set(0, 0, 10);
  scene.add(light);

  // Add ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.25); // color, intensity
  scene.add(ambientLight);

  camera.position.z = 3;
}

function animate() {
  requestAnimationFrame(animate);

  // Update the controls for each frame
  orbitControls.update();

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
  renderer.setSize( window.innerWidth, window.innerHeight );

  // This version would in theory be better for mobile, but seems buggy on desktop
  // renderer.setSize(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, false);

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