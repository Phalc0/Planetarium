


// === Imports ===
import init from './systems/init';
import Sphere from './components/PlanetSphere';
import Sun from './components/SunSphere';
import { Object3D, PointLight, AmbientLight, BackSide } from 'three';
import Vide from './assets/images/GalaxyDark.jpg';
import solarSystem from '../solar_system.json';

const [camera, renderer, scene, controls] = init();
controls.update();

// === Fond galactique ===
const background = new Sphere(50, Vide, BackSide);
scene.add(background);

// === Lumières ===
const sunLight = new PointLight(0xffffff, 2, 100);
const ambientLight = new AmbientLight(0xffffff, 0.1);
sunLight.position.set(0, 0, 0);

// === Soleil ===
const sunData = solarSystem.sun;
const sun = new Sun(sunData.radius, sunData.texture);
sun.rotationSpeed = sunData.rotationSpeed || 0.001;

sun.add(sunLight);
sun.add(ambientLight);
scene.add(sun);

// === Planètes & Lunes ===
const orbitCenters = [];

solarSystem.planets.forEach(planetData => {
    const planetOrbit = new Object3D();
    sun.add(planetOrbit);
    orbitCenters.push({ orbit: planetOrbit, speed: planetData.orbitSpeed });

    const planet = new Sphere(planetData.radius, planetData.texture);
    planet.position.x = planetData.distance;
    planet.rotationSpeed = planetData.selfRotationSpeed || 0.01;

    if (planetData.inclination) {
        planet.rotation.x = planetData.inclination;
    }

    planet.tick = () => {
        planet.rotation.y += planet.rotationSpeed;
    };

    planetOrbit.add(planet);

    // === Lunes ===
    if (planetData.moons) {
        planetData.moons.forEach(moonData => {
            const moonOrbit = new Object3D();
            planet.add(moonOrbit);
            orbitCenters.push({ orbit: moonOrbit, speed: moonData.orbitSpeed });

            const moon = new Sphere(moonData.radius, moonData.texture);
            moon.position.x = moonData.distance;
            moon.rotationSpeed = moonData.selfRotationSpeed || 0.01;

            moon.tick = () => {
                moon.rotation.y += moon.rotationSpeed;
            };

            moonOrbit.add(moon);
        });
    }
});

// Tick pour le soleil 
sun.tick = () => {
    sun.rotation.y += sun.rotationSpeed;
};

// === Boucle d'animation ===
function animate() {
    sun.tick();

    // Rotation des orbites
    orbitCenters.forEach(({ orbit, speed }) => {
        orbit.rotation.y += speed;
    });

    // Tick pour objets avec rotation propre
    // scene.traverse(obj => {
    //     if (obj.tick) obj.tick();
    // });

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
