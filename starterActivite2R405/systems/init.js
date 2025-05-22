import { WebGLRenderer, PerspectiveCamera, Scene } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function init() {
  const camera = new PerspectiveCamera(75, 1.77, 0.1, 10000);
  camera.position.z = 8;
  const renderer = new WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minPolarAngle = 0; // vers le haut complètement
  controls.maxPolarAngle = Math.PI; // vers le bas complètement

  controls.update();
  const scene = new Scene();
  return [camera, renderer, scene, controls];
}
