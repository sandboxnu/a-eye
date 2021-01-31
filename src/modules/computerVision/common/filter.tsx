export { convolute, getPixels, createImageData };

/// utility functions for filtering / manipulating a DOM canvas
// reference: https://www.html5rocks.com/en/tutorials/canvas/imagefilters/

/**
 * Run an image convolution based on inCanvas, and draws the output to outCanvas.
 * Don't ask me how any of this works!!!! I dont know!!!!!!!
 *
 * @param inCanvas the canvas to be filtered, with an image already drawn on it
 * @param outCanvas the canvas to be outputted to
 * @param animate whether or not to animate the filter by each row of pixels
 * @param weights the kernel (matrix of numbers)
 * @param opaque (optional) is the image opaque?
 */
function convolute(
  inCanvas: HTMLCanvasElement,
  outCanvas: HTMLCanvasElement,
  animate: boolean,
  weights: number[],
  opaque?: boolean,
) {
  const pixels = getPixels(inCanvas);
  const output = getPixels(outCanvas);
  if (!pixels || !output) return;

  const side = Math.round(Math.sqrt(weights.length));
  const halfSide = Math.floor(side / 2);
  const src = pixels.data;
  const sw = pixels.width;
  const sh = pixels.height;
  // pad output by the convolution matrix
  const w = sw;
  const h = sh;
  const dst = output.data;
  // go through the destination image pixels
  const alphaFac = opaque ? 1 : 0;

  const processRow = (y: number) => {
    for (let x = 0; x < w; x++) {
      const sy = y;
      const sx = x;
      const dstOff = (y * w + x) * 4;
      const nextDstOff = ((y + 1) * w + x) * 4;
      // calculate the weighed sum of the source image pixels that
      // fall under the convolution matrix
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;
      for (let cy = 0; cy < side; cy++) {
        for (let cx = 0; cx < side; cx++) {
          const scy = sy + cy - halfSide;
          const scx = sx + cx - halfSide;
          if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
            const srcOff = (scy * sw + scx) * 4;
            const wt = weights[cy * side + cx];
            r += src[srcOff] * wt;
            g += src[srcOff + 1] * wt;
            b += src[srcOff + 2] * wt;
            a += src[srcOff + 3] * wt;
          }
        }
      }

      dst[dstOff] = r;
      dst[dstOff + 1] = g;
      dst[dstOff + 2] = b;
      dst[dstOff + 3] = a + alphaFac * (255 - a);
      dst[nextDstOff] = 255;
      dst[nextDstOff + 1] = 0;
      dst[nextDstOff + 2] = 0;
    }
  };

  if (animate) {
    var y = 0;
    const interval = setInterval(() => {
      processRow(y);
      outCanvas.getContext('2d')?.putImageData(output, 0, 0);
      y++;
      if (y >= h) clearInterval(interval);
    }, 10);
  } else {
    for (var y = 0; y < h; y++) {
      processRow(y);
    }
    outCanvas.getContext('2d')?.putImageData(output, 0, 0);
  }
}

function getPixels(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  return ctx && ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function createImageData(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  return ctx && ctx.createImageData(canvas.width, canvas.height);
}
