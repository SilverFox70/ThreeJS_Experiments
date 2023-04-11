// Super basic example of a "tumbling" cube.
import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import * as TWEEN from 'https://cdnjs.cloudflare.com/ajax/libs/tween.js/18.6.4/tween.esm.min.js';

// Set up scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

// Adjust this value to control the speed of the vibrations (lower value = slower vibrations)
const vibrationSpeedFactor = 0.04; 

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Create particle systems with different materials
const particleCount = 120000/3;
const whiteMaterial = new THREE.PointsMaterial({ color: 0xeeeeee, size: 0.1 });
const lightGrayMaterial = new THREE.PointsMaterial({ color: 0xaaaaaa, size: 0.15 });
const darkGrayMaterial = new THREE.PointsMaterial({ color: 0x444444, size: 0.2, opacity: 0.5 });

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

// Chladni pattern parameters
const initialParams = { n: 1.4, m: 8, a: 1, b: 1 };
const targetParams = { n: 3, m: 2, a: 1.5, b: 1.5 };
const tweenDuration = 5000; // Duration in milliseconds

const tween = new TWEEN.Tween(initialParams)
  .to(targetParams, tweenDuration)
  .easing(TWEEN.Easing.Quadratic.InOut)
  .yoyo(true)
  .repeat(Infinity)
  .start();

let lastVibrationTime = Date.now();

// Animate the scene so that we can see it.
function animate(time) {
  // How close to 0 the Chladni return must be in order for the particle to be visible
  const tolerance = 0.3;

  requestAnimationFrame(animate);

  // Update tweens for the current frame
  TWEEN.update(time);

  const currentTime = Date.now();
  const timeSinceLastVibration = currentTime - lastVibrationTime;

  if (timeSinceLastVibration > (1 / vibrationSpeedFactor)) {
    // Update the particle positions
    let whiteIndex = 0;
    let lightGrayIndex = 0;
    let darkGrayIndex = 0;

    for (let x = 0; x < gridSize; x += stepSize) {
      for (let y = 0; y < gridSize; y += stepSize) {
        const value = chladniPattern(x / gridSize, y / gridSize, initialParams.n, initialParams.m, initialParams.a, initialParams.b);

        const absValue = Math.abs(value);

        let targetPositions;
        let targetIndex;
        let vibrationAmplitude;

        if (absValue < 0.1) {
          targetPositions = whiteParticles.geometry.attributes.position.array;
          targetIndex = whiteIndex;
          whiteIndex += 4;
          vibrationAmplitude = 0.3 * 2;
        } else if (absValue >= 0.1 && absValue < 0.15) {
          targetPositions = lightGrayParticles.geometry.attributes.position.array;
          targetIndex = lightGrayIndex;
          lightGrayIndex += 4;
          vibrationAmplitude = 0.5 * 2;
        } else if (absValue >= 0.15 && absValue < 0.25) {
          targetPositions = darkGrayParticles.geometry.attributes.position.array;
          targetIndex = darkGrayIndex;
          darkGrayIndex += 4;
          vibrationAmplitude = 0.75 * 2;
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

    // Update the particle systems
    whiteParticles.geometry.attributes.position.needsUpdate = true;
    lightGrayParticles.geometry.attributes.position.needsUpdate = true;
    darkGrayParticles.geometry.attributes.position.needsUpdate = true;

    // Update lastVibrationTime
    lastVibrationTime = currentTime;
  }

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