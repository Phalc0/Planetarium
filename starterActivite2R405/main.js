


// === Imports ===
import init from './systems/init';
import Sphere from './components/PlanetSphere';
import Sun from './components/SunSphere';
import { Object3D, PointLight, AmbientLight, BackSide } from 'three';
import Vide from './assets/images/GalaxyDark.jpg';
import solarSystem from '../solar_system.json';
import { Raycaster } from 'three';
import { Vector2 } from 'three';
import { Vector3 } from 'three';

const [camera, renderer, scene, controls] = init();
controls.update();

const raycaster = new Raycaster();
const mouse = new Vector2();
const clickablePlanets = [];

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

    clickablePlanets.push(planet);
    planet.name = planetData.name || 'Unknown';

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


window.addEventListener('click', (event) => {
    const canvasBounds = renderer.domElement.getBoundingClientRect();

    // Convertit la position de la souris dans le canvas en coordonnées NDC (-1 à 1)
    mouse.x = ((event.clientX - canvasBounds.left) / canvasBounds.width) * 2 - 1;
    mouse.y = -((event.clientY - canvasBounds.top) / canvasBounds.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(clickablePlanets, true);

    if (intersects.length > 0) {
        const clickedPlanet = intersects[0].object;
        ZoomPlanet(clickedPlanet);
        console.log('✅ Clicked on:', clickedPlanet.name || clickedPlanet);
    }
});


function ZoomPlanet(planet) {
    const offset = 5; // Distance à la planète
    const direction = new Vector3(1, 1, 1).normalize();

    const planetPos = planet.getWorldPosition(new Vector3());
    camera.position.copy(planetPos.clone().add(direction.multiplyScalar(offset)));
    camera.lookAt(planetPos);
    controls.update();
}

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

