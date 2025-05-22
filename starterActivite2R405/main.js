import init from "./systems/init";
import Sphere from "./components/PlanetSphere";
import Sun from "./components/SunSphere";
// import OrbitLine from "./components/Trajectoire";
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
    // // Ligne de trajectoire
    // const orbitLine = new OrbitLine(planetData.distance, planetData.inclination);
    // scene.add(orbitLine);
  const planetOrbit = new Object3D();
  sun.add(planetOrbit);
  orbitCenters.push({ orbit: planetOrbit, speed: planetData.orbitSpeed });

  const planet = new Sphere(planetData.radius, planetData.texture);
  planet.position.x = planetData.distance;
  planet.rotationSpeed = planetData.selfRotationSpeed || 0.01;
  planet.name = planetData.name || "Unknown";

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
  console.log(intersects);
  intersects.forEach((intersect) => {
    if (intersect.object.click) {
      intersect.object.click();
      if (intersects.length > 0) {
        // En gros si il y a une planete
        selectedPlanet = intersect.object;
        isFollowingPlanet = true; // La caméra suit une planète
      } else if (isFollowingPlanet) {
        isFollowingPlanet = false; // La caméra ne suit plus la planète
        selectedPlanet = null; // Réinitialiser la planète sélectionnée
      }
    }
  });
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

  if (isFollowingPlanet && selectedPlanet) { //Si la caméra suit une planète cliquée
    const planetRadius = selectedPlanet.geometry.parameters.radius;
    const offset = new Vector3(
      planetRadius * 0,
      planetRadius * 3,
      planetRadius * 2
    );
  
    const newCameraPosition = new Vector3().copy(selectedPlanet.position).add(offset);
    camera.position.lerp(newCameraPosition, 0.01); // Smooth follow
    camera.lookAt(selectedPlanet.position);
  }

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
document.body.appendChild(renderer.domElement);
