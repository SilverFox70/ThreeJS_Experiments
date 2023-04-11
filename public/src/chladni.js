// Super basic example of a "tumbling" cube.
import * as THREE from 'https://unpkg.com/three/build/three.module.js';

// Set up scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Create cube geometry
const cubeGeometry = new THREE.BoxGeometry( 1, 1, 1 );
const cubeMaterial = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
const cube2 = new THREE.Mesh( cubeGeometry, cubeMaterial );
cube2.position.set(-10, -10, 0);
scene.add( cube );
scene.add( cube2 );

// Create plane geometry
// const planeGeometry = new THREE.PlaneGeometry(4, 4, 100, 100); // Width, height, widthSegments, heightSegments
// const planeMaterial = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
// const plane = new THREE.Mesh( planeGeometry, planeMaterial );
// scene.add( plane );

// Create particle systems with different materials
const particleCount = 60000/3;
const whiteMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });
const lightGrayMaterial = new THREE.PointsMaterial({ color: 0xaaaaaa, size: 0.15 });
const darkGrayMaterial = new THREE.PointsMaterial({ color: 0x444444, size: 0.2 });

const whiteParticles = createParticleSystem(particleCount, whiteMaterial);
const lightGrayParticles = createParticleSystem(particleCount, lightGrayMaterial);
const darkGrayParticles = createParticleSystem(particleCount, darkGrayMaterial);

scene.add(whiteParticles);
scene.add(lightGrayParticles);
scene.add(darkGrayParticles);

function createParticleSystem(count, material) {
  const particles = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3); // 3 coordinates per point (x, y, z)
  particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  return new THREE.Points(particles, material);
}




// Add a point light
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(0, 0, 10);
scene.add(light);

// Add ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.25); // color, intensity
scene.add(ambientLight);

camera.position.z = 30;

// Grid and step size for Chladni pattern
const canvasSize = setCanvasSize();
const gridSize = canvasSize * 0.08;
const stepSize = gridSize / Math.sqrt(particleCount);
console.log(`gridSize: ${gridSize}\nstepSize: ${stepSize}`);



function chladniPattern(x, y, n, m, a, b) {
  const pi = Math.PI;
  const term1 = a * Math.sin(pi * n * x) * Math.sin(pi * m * y);
  const term2 = b * Math.sin(pi * m * x) * Math.sin(pi * n * y);
  return term1 + term2;
}


// Animate the scene so that we can see it.
function animate() {
  requestAnimationFrame(animate);

  // Chladni pattern parameters
  const n = 1.4;
  const m = 7.1;
  const a = 1;
  const b = 1;

  const tolerance = 0.3;

  let whiteIndex = 0;
  let lightGrayIndex = 0;
  let darkGrayIndex = 0;

  for (let x = 0; x < gridSize; x += stepSize) {
    for (let y = 0; y < gridSize; y += stepSize) {
      const value = chladniPattern(x / gridSize, y / gridSize, n, m, a, b);
      const absValue = Math.abs(value);

      let targetPositions;
      let targetIndex;
      let vibrationAmplitude;

      if (absValue < 0.1) {
        targetPositions = whiteParticles.geometry.attributes.position.array;
        targetIndex = whiteIndex;
        whiteIndex += 4;
        vibrationAmplitude = 0.3;
      } else if (absValue >= 0.1 && absValue < 0.15) {
        targetPositions = lightGrayParticles.geometry.attributes.position.array;
        targetIndex = lightGrayIndex;
        lightGrayIndex += 4;
        vibrationAmplitude = 0.5;
      } else if (absValue >= 0.15 && absValue < 0.25) {
        targetPositions = darkGrayParticles.geometry.attributes.position.array;
        targetIndex = darkGrayIndex;
        darkGrayIndex += 4;
        vibrationAmplitude = 0.75;
      } else {
        continue;
      }

      if (Math.abs(value) < tolerance) {
        // Generate random displacements
        const dx = (Math.random() - 0.5) * vibrationAmplitude;
        const dy = (Math.random() - 0.5) * vibrationAmplitude;

        // Quadrant 1
        targetPositions[targetIndex * 3] = x + dx;
        targetPositions[targetIndex * 3 + 1] = y + dy;
        targetPositions[targetIndex * 3 + 2] = 0;
        targetIndex++;

        // Quadrant 2
        targetPositions[targetIndex * 3] = -x + dx;
        targetPositions[targetIndex * 3 + 1] = y + dy;
        targetPositions[targetIndex * 3 + 2] = 0;
        targetIndex++;

        // Quadrant 3
        targetPositions[targetIndex * 3] = -x + dx;
        targetPositions[targetIndex * 3 + 1] = -y + dy;
        targetPositions[targetIndex * 3 + 2] = 0;
        targetIndex++;

        // Quadrant 4
        targetPositions[targetIndex * 3] = x + dx;
        targetPositions[targetIndex * 3 + 1] = -y + dy;
        targetPositions[targetIndex * 3 + 2] = 0;
        targetIndex++;
      }
    }
  }

  // Update the particle system
  // Update the particle systems
  whiteParticles.geometry.attributes.position.needsUpdate = true;
  lightGrayParticles.geometry.attributes.position.needsUpdate = true;
  darkGrayParticles.geometry.attributes.position.needsUpdate = true;



  // Optional: Rotate the Chladni plate for a more dynamic view
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}

function setCanvasSize() {
  const size = Math.min(window.innerWidth / 2, window.innerHeight - 200);
  renderer.setSize(size, size);
  camera.aspect = 1; // aspect ratio for a square
  camera.updateProjectionMatrix();
  return size;
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
  window.addEventListener('resize', setCanvasSize);
  renderer.setPixelRatio( window.devicePixelRatio );

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

animate();