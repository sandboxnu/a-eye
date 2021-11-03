// https://stevenbas.art/examples/ImageProcessing/ex4/

/**
 * Applies the haar transformation to the image in `inCanvas`, and draws the output
 * on `outCanvas`
 *
 * @param inCanvas
 * @param outCanvas
 * @param iterations how many recursions to do
 */
function haarFilter(
    inCanvas: HTMLCanvasElement,
    outCanvas: HTMLCanvasElement,
    iterations: number
) {
  const inData = inCanvas
      .getContext("2d")
      ?.getImageData(0, 0, inCanvas.width, inCanvas.height);
  const outData = outCanvas
      .getContext("2d")
      ?.getImageData(0, 0, outCanvas.width, outCanvas.height);
  if (!inData || !outData) return;

  const inPix = inData.data;
  const imgWidth = inCanvas.width; //should be the same for outCanvas
  const imgHeight = inCanvas.height;

  // initialize array with original pix values
  const haar: number[][][] = [];
  for (let row = 0; row < imgHeight; row++) {
    haar[row] = [];
    for (let col = 0; col < imgWidth; col++) {
      haar[row][col] = [];
      for (let i = 0; i < 3; i++) {
        haar[row][col][i] = inPix[4 * (row * imgWidth + col + i)];
      }
    }
  }

  //Do a Haar Wavelet Transform
  let currWidth = imgWidth;
  let currHeight = imgHeight;
  let haarRow: number[] = [];
  while ((currWidth > 1 || currHeight > 1) && iterations > 1) {
    iterations = iterations - 1;

    //Do it for each row first
    if (currWidth > 1) {
      for (let row = 0; row < currHeight; row++) {
        for (let i = 0; i < 3; i++) {
          for (let col = 0; col < currWidth; col++) {
            haarRow[col] = haar[row][col][i];
          }

          oneDHaarTransform(haarRow);

          for (let col = 0; col < currWidth; col++) {
            haar[row][col][i] = haarRow[col];
          }
        }
      }
    }

    //Then perform Haar transform on each column
    haarRow = [];
    if (currHeight > 1) {
      for (let col = 0; col < currWidth; col++) {
        for (let i = 0; i < 3; i++) {
          for (let row = 0; row < currHeight; row++) {
            haarRow[row] = haar[row][col][i];
          }

          oneDHaarTransform(haarRow);

          for (let row = 0; row < currHeight; row++) {
            haar[row][col][i] = haarRow[row];
          }
        }
      }
    }
    haarRow = [];

    if (currHeight > 1) {
      currHeight = currHeight / 2;
    }
    if (currWidth > 1) {
      currWidth = currWidth / 2;
    }
  }

  //Copy pix data to canvas
  const outPix = outData.data;
  for (let row = 0; row < imgHeight; row++) {
    for (let col = 0; col < imgWidth; col++) {
      outPix[4 * (row * imgWidth + col)] = haar[row][col][0];
      outPix[4 * (row * imgWidth + col) + 1] = haar[row][col][1];

      outPix[4 * (row * imgWidth + col) + 2] = haar[row][col][2];

      outPix[4 * (row * imgWidth + col) + 3] = 255;
    }
  }
  outCanvas.getContext("2d")?.putImageData(outData, 0, 0);
}

function oneDHaarTransform(pixRow: number[]) {
  var sum = 0;
  var diff = 0;
  var halfLen = pixRow.length / 2;
  var tempHaar: number[] = [];

  //It only recurses on first half of the array
  for (var i = 0; i < halfLen; i++) {
    sum = pixRow[2 * i] + pixRow[2 * i + 1];
    sum = sum / Math.sqrt(2);
    diff = pixRow[2 * i] - pixRow[2 * i + 1];
    diff = diff / Math.sqrt(2);
    tempHaar[i] = sum;
    tempHaar[i + halfLen] = diff;
  }
  for (var j = 0; j < pixRow.length; j++) {
    pixRow[j] = tempHaar[j];
  }
}

export { haarFilter };