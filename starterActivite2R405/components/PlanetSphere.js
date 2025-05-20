import {
    SphereGeometry,
    MeshStandardMaterial,
    Mesh,
    TextureLoader,
    FrontSide
} from 'three';

export default class Planet extends Mesh {
    constructor(size, texturePath, side = FrontSide) {
        const textureLoader = new TextureLoader();
        const geometry = new SphereGeometry(size, 32, 32);
        const texture = textureLoader.load(texturePath);
        const material = new MeshStandardMaterial({ map: texture, side: side });
        super(geometry, material);
    }

    tick() {
        this.rotation.y += -0.01;
    }
}