const scalingFactor = 10; // Adjust this value to change the overall scale of the distances

const planetData = {
  mercury: {
    size: 0.2,
    color: 0x8c8c8c,
    texture: '2k_mercury.jpeg',
    distance: 0.39 * scalingFactor,
    rotationPeriod: 58.6,
    orbitalPeriod: 87.97
  },
  venus: {
    size: 0.5,
    color: 0xffbf80,
    texture: '2k_venus_atmosphere.jpeg',
    distance: 0.72 * scalingFactor,
    rotationPeriod: -243,
    orbitalPeriod: 224.70
  },
  earth: {
    size: 0.5,
    color: 0x4da6ff,
    texture: '2k_earth_daymap.jpeg',
    distance: 1.00 * scalingFactor,
    rotationPeriod: 1.01,
    orbitalPeriod: 365.24
  },
  mars: {
    size: 0.3,
    color: 0xff4d4d,
    texture: '2k_mars.jpeg',
    distance: 1.52 * scalingFactor,
    rotationPeriod: 1.03,
    orbitalPeriod: 687
  },
  jupiter: {
    size: 1.7,
    color: 0xffa64d,
    texture: '2k_jupiter.jpeg',
    distance: 5.20 * scalingFactor,
    rotationPeriod: 0.41,
    orbitalPeriod: 4331
  },
  saturn: {
    size: 1.4,
    color: 0xffd24d,
    texture: '2k_saturn.jpeg',
    distance: 9.58 * scalingFactor,
    rotationPeriod: 0.44,
    orbitalPeriod: 10747
  },
  uranus: {
    size: 0.8,
    color: 0x66b2ff,
    texture: '2k_uranus.jpeg',
    distance: 19.18 * scalingFactor,
    rotationPeriod: -0.72,
    orbitalPeriod: 30589
  },
  neptune: {
    size: 0.8,
    color: 0x1a53ff,
    texture: '2k_neptune.jpeg',
    distance: 30.07 * scalingFactor,
    rotationPeriod: 0.67,
    orbitalPeriod: 59800
  }
};

export default planetData;
