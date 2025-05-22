import init from "./systems/init";
import Sphere from "./components/PlanetSphere";
import Sun from "./components/SunSphere";
import OrbitLine from "./components/Trajectoire";
import { createTextSprite } from "./components/Sprite";
import {
  Object3D,
  PointLight,
  AmbientLight,
  BackSide,
  Raycaster,
  Vector2,
  Vector3,
} from "three";
import Vide from "./assets/images/GalaxyDark.jpg";
import solarSystem from "../solar_system.json";

const [camera, renderer, scene, controls] = init();

const raycaster = new Raycaster();
const mouse = new Vector2();
let selectedPlanet = null; // Variable pour savoir si une planète est sélectionnée, Let car changement possible
let isFollowingPlanet = false; // Variable pour savoir si la caméra suit une planète
const initialCameraPosition = new Vector3(0, 30, 50); // Position initiale de la caméra
const initialCameraTarget = new Vector3(0, 0, 0); // Cible initiale de la caméra

const clickablePlanets = [];

// Fond
const background = new Sphere(500, Vide, BackSide);
scene.add(background);

//Soleil
const sunData = solarSystem.sun;
const sun = new Sun(sunData.radius, sunData.texture);
sun.rotationSpeed = sunData.rotationSpeed || 0.001;

const sunLight = new PointLight(0xffffff, 2, 100);
sunLight.position.set(0, 0, 0);
const ambientLight = new AmbientLight(0xffffff, 0.1);

sun.add(sunLight);
sun.add(ambientLight);
scene.add(sun);

// Planètes
const orbitCenters = [];

solarSystem.planets.forEach((planetData) => {
  // Ligne de trajectoire
  const orbitLine = new OrbitLine(planetData.distance, planetData.inclination);
  scene.add(orbitLine);

  const planetOrbit = new Object3D();
  sun.add(planetOrbit);
  orbitCenters.push({ orbit: planetOrbit, speed: planetData.orbitSpeed });

  const planet = new Sphere(planetData.radius, planetData.texture);
  planet.position.x = planetData.distance;
  planet.rotationSpeed = planetData.selfRotationSpeed || 0.01;
  planet.name = planetData.name || "Unknown";

  //Sprite
  const labelSprite = createTextSprite(planetData.name, {
    fontsize: 28,
    backgroundColor: { r: 255, g: 255, b: 255, a: 0.7 },
  });
  labelSprite.position.set(0, planetData.radius + 0.5, 0);
  planet.add(labelSprite);
  labelSprite.raycast = () => {};   // Ignore les clics sur le sprite et Eviter le crash du clic


  // Inclinaison
  if (planetData.inclination) {
    planet.rotation.x = planetData.inclination;
  }

  clickablePlanets.push(planet);

  // La function click sur planete
  planet.click = () => {
    console.log(planet.name);
  };

  planet.tick = () => {
    // planet.rotation.y += planet.rotationSpeed;
  };

  planetOrbit.add(planet);

  // === Satellites ===
  if (planetData.moons) {
    planetData.moons.forEach((moonData) => {
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

// === Gestion des interactions souris ===
window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

window.addEventListener("click", () => {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(clickablePlanets, true);
  if (intersects.length > 0) {
    const intersect = intersects[0];
    selectedPlanet = intersect.object;
    isFollowingPlanet = true;

    // Fixe directement la cible de controls sur la planète
    controls.target.copy(selectedPlanet.position);

    // NE TOUCHE PAS à camera.position ici !
  }
});

//Stop le suivi de caméra du LookAt mais reste sur la caméra planete
controls.addEventListener("start", () => {
  if (isFollowingPlanet && selectedPlanet) {
    isFollowingPlanet = false; // La caméra ne suit plus la planète
    controls.target.copy(selectedPlanet.position); // Mettre à jour la cible de la caméra
    console.log("Suivi de caméra desactivé");
  }
});

sun.tick = () => {
  //   sun.rotation.y += sun.rotationSpeed;
};

function animate() {
  // Rotation du soleil
  sun.tick();
  controls.update();

  // Rotation des orbites (orbite autour du soleil ou des planètes)
  //   orbitCenters.forEach(({ orbit, speed }) => {
  //     orbit.rotation.y += speed;
  //   });

  // Camera qui suit la rotation (actuellement du soleil)
  //   scene.traverse((obj) => {
  //     if (obj.tick) obj.tick();
  //   });
  if (isFollowingPlanet && selectedPlanet) {
    const planetRadius = selectedPlanet.geometry.parameters.radius;
    const offset = new Vector3(0, planetRadius * 3, planetRadius * 2);
    const desiredPosition = new Vector3()
      .copy(selectedPlanet.position)
      .add(offset);

    camera.position.lerp(desiredPosition, 0.05);
    controls.target.lerp(selectedPlanet.position, 0.05);
  }

  controls.update(); // Update **après** avoir changé pos & target !

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
document.body.appendChild(renderer.domElement);
