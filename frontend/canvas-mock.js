// Mock canvas module for Konva in browser environment
// This provides the interface Konva expects without Node.js dependencies

const mockCanvas = {
  createCanvas: () => ({
    width: 0,
    height: 0,
    getContext: () => ({
      fillRect: () => {},
      clearRect: () => {},
      getImageData: () => ({ data: new Uint8ClampedArray() }),
      putImageData: () => {},
      createImageData: () => ({ data: new Uint8ClampedArray() }),
      setTransform: () => {},
      drawImage: () => {},
      save: () => {},
      fillText: () => {},
      restore: () => {},
      beginPath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      closePath: () => {},
      stroke: () => {},
      translate: () => {},
      scale: () => {},
      rotate: () => {},
      arc: () => {},
      fill: () => {},
      measureText: () => ({ width: 0 }),
      transform: () => {},
      rect: () => {},
      clip: () => {},
    }),
    toDataURL: () => '',
    toBuffer: () => Buffer.from(''),
  }),

  createImageData: () => ({ data: new Uint8ClampedArray() }),

  loadImage: () => Promise.resolve({
    width: 0,
    height: 0,
    onload: null,
    onerror: null,
  }),

  registerFont: () => {},
};

module.exports = mockCanvas;