import {
    SphereGeometry,
    MeshStandardMaterial,
    Mesh,
    TextureLoader,
} from 'three';

export default class Sphere extends Mesh {
    constructor(size, texturePath) {
        const textureLoader = new TextureLoader();
        const geometry = new SphereGeometry(size, 32, 32);
        const texture = textureLoader.load(texturePath);
        const material = new MeshStandardMaterial({ map: texture });
        super(geometry, material);
    }

    tick() {
        this.rotation.x += -0.001;
        this.rotation.y += -0.001;
    }
}