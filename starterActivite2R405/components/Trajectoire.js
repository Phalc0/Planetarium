import { BufferGeometry, Float32BufferAttribute, LineBasicMaterial, LineLoop, Vector3 } from 'three';

export default function createOrbitLine(radius, inclination = 0, color = 0xffffff) {
  const segments = 64;
  const points = [];

  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * 2 * Math.PI;
    points.push(new Vector3(radius * Math.cos(theta), 0, radius * Math.sin(theta)));
  }

  const geometry = new BufferGeometry().setFromPoints(points);
  const material = new LineBasicMaterial({ color, opacity: 0.5, transparent: true });
  const orbitLine = new LineLoop(geometry, material);

  // Placer dans le plan XZ (horizontal)
  orbitLine.rotation.x = Math.PI / 2;

  // Appliquer inclinaison
  orbitLine.rotation.z = inclination;

  return orbitLine;
}
