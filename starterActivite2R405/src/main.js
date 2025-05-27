import init from "../systems/init.js";
import Sphere from "../components/PlanetSphere.js";
import Ring from "../components/Ring.js";
import Sun from "../components/SunSphere.js";
import OrbitLine from "../components/Trajectoire.js";
import { createTextSprite } from "../components/Sprite.js";
import {
  Object3D,
  PointLight,
  AmbientLight,
  BackSide,
  Raycaster,
  Vector2,
  Vector3,
} from "three";
import Vide from "../assets/images/GalaxyDark.jpg";
import solarSystem from "../../solar_system.json";
import { showPlanetPanel } from "./interface.js";
import SaturnRing from "../assets/images/SaturneRingAlpha.png";

const [camera, renderer, scene, controls] = init();

const raycaster = new Raycaster();
const mouse = new Vector2();


let selectedPlanet = null; // Variable pour savoir si une planète est sélectionnée, Let car changement possible
let isFollowingPlanet = false; // Variable pour savoir si la caméra suit une planète
let initialCameraPosition = new Vector3();
let targetCameraPosition = new Vector3();
let animation = 0; // pour le zoom
const clickablePlanets = [];


let isAnimate = false; //pour le bouton 

// Fond
const background = new Sphere(500, Vide, BackSide);
scene.add(background);

//Soleil
const sunData = solarSystem.sun;
const sun = new Sun(sunData.radius, sunData.texture);
sun.rotationSpeed = sunData.rotationSpeed || 0.001;

const sunLight = new PointLight(0xffffff, 2, 100);
sunLight.position.set(0, 0, 0);
const ambientLight = new AmbientLight(0xffffff, 0.17);

sun.add(sunLight);
sun.add(ambientLight);
scene.add(sun);




//Il faut que j'attache la caméra() a orbitCenters pour que la caméra suive la planète sélectionnée

// Planètes
const orbitCenters = [];

solarSystem.planets.forEach((planetData) => {
  // Ligne de trajectoire
  // const orbitLine = new OrbitLine(planetData.distance, planetData.inclination);
  // scene.add(orbitLine);

  const planetOrbit = new Object3D();
  planetOrbit.userData.initialAngle = planetData.initialAngle || 0;
  planetOrbit.userData.distance = planetData.distance;
  sun.add(planetOrbit);
  orbitCenters.push({
    orbit: planetOrbit,
    speed: planetData.orbitSpeed,
    initialAngle: planetData.initialAngle || 0,
    distance: planetData.distance
  });


  // Info du JSON
  const planet = new Sphere(planetData.radius, planetData.texture);
  const angle = planetData.initialAngle || 0;
  planet.position.x = Math.cos(angle) * planetData.distance;
  planet.position.z = Math.sin(angle) * planetData.distance;
  planet.rotationSpeed = planetData.selfRotationSpeed || 0.01;
  planet.name = planetData.name;
  planet.type = planetData.type;
  planet.description = planetData.description;



  // Anneau Saturne 
  if(planetData.name === "Saturn") {
    const RingPolaire = new Ring({
      innerRadius : planetData.radius * 1.5, 
      outerRadius : planetData.radius * 2.5,
      texture : SaturnRing,
    });

    RingPolaire.rotation.x = Math.PI / 2;
    planet.add(RingPolaire);
    RingPolaire.raycast = () => { }; // Ignore les clics sur l'anneau et Eviter le crash du clic
  }



  //Sprite
  const labelSprite = createTextSprite(planetData.name, {
    fontsize: 28,
    backgroundColor: { r: 255, g: 255, b: 255, a: 0.7 },
  });
  labelSprite.position.set(0, planetData.radius + 0.5, 0);
  planet.add(labelSprite);
  labelSprite.raycast = () => { };   // Ignore les clics sur le sprite et Eviter le crash du clic


  // Inclinaison
  if (planetData.inclination) {
    planet.rotation.x = planetData.inclination;
  }

  clickablePlanets.push(planet);

  // La function click sur planete
  planet.click = () => {
    console.log(planet.name);
    showPlanetPanel(planet); // Afficher les informations de la planète
  };

  planet.tick = () => {
    planet.rotation.y += planet.rotationSpeed;
  };

  planetOrbit.add(planet);








  // === Satellites ===
  if (planetData.moons) {
    planetData.moons.forEach((moonData) => {
      const moonOrbit = new Object3D();
      planet.add(moonOrbit);
      orbitCenters.push({ orbit: moonOrbit, speed: moonData.orbitSpeed });

      const moon = new Sphere(moonData.radius, moonData.texture);
      const angle = moonData.initialAngle || 0;
      moon.position.x = Math.cos(angle) * moonData.distance;
      moon.position.z = Math.sin(angle) * moonData.distance;
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
  if (intersects.length > 0) { // En gros si ya une planete 
    const intersect = intersects[0];
    selectedPlanet = intersect.object;
    isFollowingPlanet = true;

    // Afficher le panneau d'information de la planète
    if (typeof selectedPlanet.click === "function") {
      selectedPlanet.click();
    }


    // Animation de la caméra + Reset de l'animation pour renouveler la position
    initialCameraPosition.copy(camera.position);


    targetCameraPosition.copy(controls.target); //controls.target = endroit pointé par la caméra
    animation = 0;

  }
});

//Stop le suivi de caméra du LookAt mais reste sur la caméra planete
controls.addEventListener("start", () => {
  if (isFollowingPlanet && selectedPlanet) { // Si la camera suit une planete (selectionnée)
    isFollowingPlanet = false; // La caméra ne suit plus la planète
    controls.target.copy(selectedPlanet.position); // Mettre à jour la cible de la caméra
    console.log("Suivi de caméra desactivé");
  }
});

sun.tick = () => {
  //   sun.rotation.y += sun.rotationSpeed;
};


//Bouton animation

const button = document.createElement("button");
button.innerText = "Lancer l'animation";
button.className = "system-solaire-animations";
document.body.appendChild(button);
button.addEventListener("click", () => { //Inversion 
  isAnimate = !isAnimate;
  button.textContent = isAnimate ? 'Stop Animation' : 'Start Animation';
})


function animate() {
  // Rotation du soleil
  sun.tick();
  controls.update();

  // Camera qui suit la rotation (actuellement du soleil)
  //   scene.traverse((obj) => {
  //     if (obj.tick) obj.tick();
  //   });

  if (isAnimate) { // Si True lance l'animation 
    orbitCenters.forEach(({ orbit, speed }) => {
      orbit.rotation.y += speed;
    });

  };


  // Zoom sur planete
  if (isFollowingPlanet && selectedPlanet) { // Si la camera suit une planete (selectionnée) 
    const planetRadius = selectedPlanet.geometry.parameters.radius;
    const worldPos = new Vector3();
    selectedPlanet.getWorldPosition(worldPos); // Contient la position mondiale de la planete selectionnée
    // console.log("Position monde de la planète :", worldPos);


    const offset = new Vector3(-3, planetRadius * 2, planetRadius * -4); //Vector3(x, y, z) pour la position de la caméra x positif = droite, y positif = haut, z positif = avant ; planete radius pour la distance
    const desiredPosition = new Vector3() //definit la position voulu  avec worldPos
      .copy(worldPos)
      .add(offset);

    animation += 0.02;
    if (animation > 1) animation = 1; // Le Stop de l'animation 

    // Interpolation entre position de départ et position finale
    camera.position.lerpVectors(initialCameraPosition, desiredPosition, animation); // lerpVectors(Départ, Arrivé, Interpolation)
    controls.target.lerpVectors(targetCameraPosition, worldPos, animation);

    if (animation === 1) {
      isFollowingPlanet = false; // Arrêter le suivi de la planète
      selectedPlanet = null; // Réinitialiser la sélection
      animation = 0; // Réinitialiser l'animation
    }
  }

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
document.body.appendChild(renderer.domElement);
