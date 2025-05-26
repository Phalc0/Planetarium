import {
    RingGeometry,
    MeshStandardMaterial,
    Mesh,
    TextureLoader,
    DoubleSide
} from 'three';

export default class Ring extends Mesh {
    constructor({ innerRadius = 1, outerRadius = 2, segments = 32, texture, side = DoubleSide }) {
        const geometry = new RingGeometry(innerRadius, outerRadius, segments);
        const ringTexture = new TextureLoader().load(texture);
        const material = new MeshStandardMaterial({ map: ringTexture, side: side, transparent: true });
        super(geometry, material);
    }

    tick() {
    }
}