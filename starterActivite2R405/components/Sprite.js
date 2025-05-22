import { CanvasTexture, Sprite, SpriteMaterial } from 'three';

export function createTextSprite(message, options = {}) {
    const fontface = options.fontface || 'Arial';
    const fontsize = options.fontsize || 32;
    const borderThickness = options.borderThickness || 2;
    const borderColor = options.borderColor || { r: 0, g: 0, b: 0, a: 1.0 };
    const backgroundColor = options.backgroundColor || { r: 255, g: 255, b: 255, a: 0 };

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = `${fontsize}px ${fontface}`;

    const textWidth = context.measureText(message).width;
    canvas.width = textWidth + borderThickness * 4;
    canvas.height = fontsize * 1.5 + borderThickness * 4;

    // Redessiner avec bonne taille
    context.font = `${fontsize}px ${fontface}`;
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(message, canvas.width / 2, canvas.height / 2);

    const texture = new CanvasTexture(canvas);
    const spriteMaterial = new SpriteMaterial({ map: texture, depthTest: false });
    const sprite = new Sprite(spriteMaterial);

    const scaleFactor = 0.01;
    sprite.scale.set(canvas.width * scaleFactor, canvas.height * scaleFactor, 1);

    return sprite;
}
