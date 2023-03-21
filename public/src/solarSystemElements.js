// importing the function from here was causing an odd renderer.onBeforeMesh issue
export function createPlanet(planetData) {
  let material;
  const color = planetData.color;
  console.log("color: ", color);
  const geometry = new THREE.SphereGeometry(planetData.size, 32, 32);
  if (color === 0xffa64d) {
    material = new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load(
        'https://www.solarsystemscope.com/textures/download/2k_jupiter.jpg'
      )
    });
  } else {
    material = new THREE.MeshLambertMaterial({ color });
  }
  const planet = new THREE.Mesh(
    geometry,
    material
  );
  planet.position.set(planetData.distance, 0, 0);
  planet.distance = planetData.distance;
  planet.speed = 1 / planetData.distance;
  return planet;
}