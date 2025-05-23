
const button = document.createElement("button");
button.innerText = "Lancer l'animation";
button.className = "system-solaire-animations";
document.body.appendChild(button);

let isActivated = false;

export function systemsAnimate(orbitCenters, sun, planets) {
  if (isActivated) return;
  isActivated = true;

  // Soleil
  sun.tick = () => {
    sun.rotation.y += sun.rotationSpeed;
  };

  // Orbites
  orbitCenters.forEach(({ orbit, speed }) => {
    orbit.tick = () => {
      orbit.rotation.y += speed;
    };
  });

  // Planètes
  planets.forEach((planet) => {
    const originalTick = planet.tick || (() => {});
    planet.tick = () => {
      originalTick();
      planet.rotation.y += planet.rotationSpeed;
    };
  });
}

// Boutton pour lancer
button.addEventListener("click", () => {
  if (typeof window.startSolarSystemAnimation === "function") {
    window.startSolarSystemAnimation();
  }
});

export default button;