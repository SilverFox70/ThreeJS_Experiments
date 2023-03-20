export function createPlanet(planetData) {
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