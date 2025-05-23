// Creation d'une div + du style dans js

const infoPanel = document.createElement('div');
infoPanel.className = "planet-panel";
document.body.appendChild(infoPanel);

export function showPlanetPanel(planet) {
    // toFixed = arrondi à 2 chiffres après la virgule
    infoPanel.innerHTML = `
      <h2>${planet.name}</h2>
      <h3>${planet.type}</h3>
      <p>${planet.description}</p>
      <p id=border></p>
      <p>Rayon : ${planet.geometry.parameters.radius.toFixed(2)} unités</p>  
      <p>Distance au Soleil: ${planet.position.length().toFixed(2)} unités</p>
      <p>Position X : ${planet.position.x.toFixed(2)}</p>
      <p>Position Z : ${planet.position.z.toFixed(2)}</p>
      <p id=border></p>

      <button id="close-panel" style="margin-top: 10px; padding: 6px 10px; background: #444; color: white; border: none;">Fermer</button>
    `;
    infoPanel.style.display = 'flex';

    document.getElementById("close-panel").onclick = () => {
        infoPanel.style.display = 'none';
    };
}

export default infoPanel;
