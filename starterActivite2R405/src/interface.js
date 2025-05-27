// Creation d'une div + du style dans js

const infoPanel = document.createElement("div");
infoPanel.className = "planet-panel";
document.body.appendChild(infoPanel);

export function showPlanetPanel(planet) {
  // toFixed = arrondi à 2 chiffres après la virgule
  infoPanel.innerHTML = `
      <h2>${planet.name}</h2>
      <h3>${planet.type}</h3>
      <p>${planet.description}</p>
      <p id=border></p>
      <p>Rayon : ${planet.RRadius} km </p>  
      <p>Distance au Soleil: ${planet.UA} UA</p>
      <p>1 Tour autour du soleil en : ${planet.Turn} jours</p>
      <p>Vitesse de rotation : ${planet.RotationSpeed.toFixed(2)} h</p>
      <p id=border></p>

      <button id="close-panel" style="margin-top: 10px; padding: 6px 10px; background: #444; color: white; border: none; border-radius: 5px;">Fermer</button>
    `;
  infoPanel.style.display = "flex";

  document.getElementById("close-panel").onclick = () => {
    infoPanel.style.display = "none";
  };
}

export default infoPanel;
