// import Cube from './components/cube';
// import createLight from './systems/light';
// import createBackground from './systems/background';
import init from './systems/init';
import Sphere from './components/PlanetSphere';
import Sun from './components/SunSphere';
import { Object3D } from 'three';
import { PointLight, AmbientLight, BackSide, TextureLoader, MeshStandardMaterial, SphereGeometry, Mesh } from 'three';

import Terre from './assets/images/earth.jpg';
import Lune from './assets/images/lune.jpg';
import Soleil from './assets/images/soleil.jpg';
import Vide from './assets/images/GalaxyDark.jpg';
import solarSystem from '../solar_system.json';


const [camera, renderer, scene, controls] = init();
controls.update();
// const light = createLight();
// scene.add(light);


const Void = new Sphere(50, Vide, BackSide);
scene.add(Void);



const SunLight = new PointLight(0xffffff, 2, 100);
const ambientLight = new AmbientLight(0xffffff, 0.1);
SunLight.position.set(0, 0, 0);
const sunData = solarSystem.sun;
console.log(sunData);
const sun = new Sun(1, Soleil);
// const sun = new Sun(sunData.radius, sunData.texture);
console.log(sun);
scene.add(sun);
sun.add(ambientLight);
sun.add(SunLight);

const orbitCenters = {}; // Stockage des orbites pour l'animation

const Earth = new Sphere(0.4, Terre);
const Moon = new Sphere(0.1, Lune);
Earth.position.x = 5;
Moon.position.x = 1;
//Changement inclinaison Earth
Earth.rotation.x = 0.23;

const earthOrbitCenter = new Object3D();
sun.add(earthOrbitCenter);

solarSystem.planets.forEach(planetData => { // La meme chose que l 49 50 pour mais pour chaque planete
    const planetOrbit = new Object3D();
    sun.add(planetOrbit);
    orbitCenters[planetData.name] = { orbit: planetOrbit, speed: planetData.orbitSpeed }; // Stockage de l'orbite
    const planet = new Sphere(planetData.radius, planetData.texture); // La meme chose que l 42-47 pour mais pour chaque planete
});


const moonOrbitCenter = new Object3D();

earthOrbitCenter.add(Earth);
Earth.add(moonOrbitCenter);
moonOrbitCenter.add(Moon);

function animate() {
    sun.tick();
    Earth.tick()
    Moon.tick();
    earthOrbitCenter.rotation.y += 0.009;
    moonOrbitCenter.rotation.y += 0.03;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();
document.body.appendChild(renderer.domElement);






// // Création du Soleil
// const sunData = solarSystemData.sun;
// const sun = new Sun(sunData.radius, sunData.texture);
// sun.rotationSpeed = sunData.rotationSpeed || 0.001;
// scene.add(sun);
// sun.add(SunLight);
// sun.add(ambientLight);

// // Stockage des orbites pour l'animation
// const orbitCenters = [];

// solarSystemData.planets.forEach(planetData => {
//   const planetOrbit = new Object3D();
//   sun.add(planetOrbit);
//   orbitCenters.push({ orbit: planetOrbit, speed: planetData.orbitSpeed });

//   const planet = new Sphere(planetData.radius, planetData.texture);
//   planet.position.x = planetData.distance;
//   planet.rotationSpeed = planetData.selfRotationSpeed || 0.01;
//   if (planetData.inclination) planet.rotation.x = planetData.inclination;

//   planetOrbit.add(planet);

//   // Ajout des lunes si présentes
//   if (planetData.moons) {
//     planetData.moons.forEach(moonData => {
//       const moonOrbit = new Object3D();
//       planet.add(moonOrbit);
//       orbitCenters.push({ orbit: moonOrbit, speed: moonData.orbitSpeed });

//       const moon = new Sphere(moonData.radius, moonData.texture);
//       moon.position.x = moonData.distance;
//       moon.rotationSpeed = moonData.selfRotationSpeed || 0.01;

//       moonOrbit.add(moon);

//       // Animation rotation interne de la lune
//       moon.tick = () => {
//         moon.rotation.y += moon.rotationSpeed;
//       };
//     });
//   }

//   // Animation rotation interne de la planète
//   planet.tick = () => {
//     planet.rotation.y += planet.rotationSpeed;
//   };
// });

// sun.tick = () => {
//   sun.rotation.y += sun.rotationSpeed;
// };

// // 🎞 Animation loop
// function animate() {
//   sun.tick();
//   orbitCenters.forEach(({ orbit, speed }) => orbit.rotation.y += speed);

//   scene.traverse(obj => {
//     if (obj.tick) obj.tick();
//   });

//   renderer.render(scene, camera);
//   requestAnimationFrame(animate);
// }

// animate();
// document.body.appendChild(renderer.domElement);
