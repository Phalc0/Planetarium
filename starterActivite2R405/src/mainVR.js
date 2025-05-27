import init from '../systems/init';
import Sphere from '../components/PlanetSphere';
import Sun from '../components/SunSphere';
import { Object3D, PointLight, AmbientLight, BackSide } from 'three';
import Vide from '../assets/images/GalaxyDark.jpg';
import solarSystem from './solar_system.json';

import { VRButton } from 'three/addons/webxr/VRButton.js'; // VR

const [camera, renderer, scene, controls] = init();
renderer.xr.enabled = true;
controls.update();

// Fond Espace
const background = new Sphere(50, Vide, BackSide);
scene.add(background);

// Soleil
const sunLight = new PointLight(0xffffff, 2, 100);
const ambientLight = new AmbientLight(0xffffff, 0.1);
sunLight.position.set(0, 0, 0);

const sunData = solarSystem.sun;
const sun = new Sun(sunData.radius, sunData.texture);
sun.rotationSpeed = sunData.rotationSpeed || 0.001;

sun.add(sunLight);
sun.add(ambientLight);
scene.add(sun);

// Planètes et Satellites
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

    // Satellites
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

renderer.setAnimationLoop( function () {
    sun.tick();

    orbitCenters.forEach(({ orbit, speed }) => {
        orbit.rotation.y += speed;
    });

    renderer.render( scene, camera );
  } );

  document.body.appendChild(renderer.domElement);
  document.body.appendChild(VRButton.createButton(renderer));
  