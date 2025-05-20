import {
    SphereGeometry,
    MeshStandardMaterial,
    Mesh,
    TextureLoader,
    FrontSide,
    Color,
} from 'three';

export default class Sun extends Mesh {
    constructor(size, texturePath) {
        const textureLoader = new TextureLoader();
        const geometry = new SphereGeometry(size, 32, 32);
        const texture = textureLoader.load(texturePath);
        const material = new MeshStandardMaterial({
            map: texture,
            emissive: 0xffffff,
            emissiveIntensity: 1.3,
            emissiveMap: texture,
        });
        super(geometry, material);
    }

    tick() {
        this.rotation.y += -0.001;
    }
}