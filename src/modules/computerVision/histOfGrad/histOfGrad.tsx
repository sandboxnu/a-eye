const { Image } = require('image-js');
const hog = require('hog-features');
const img = require('../../../media/modules/computerVision/imageLibrary/purpleFlowers.jpeg')
  .default;

function histogram() {
  Image.load(img).then((image: any) => {
    const options = {
      cellSize: 8,
      blockSize: 2,
      blockStride: 1,
      bins: 9,
    };
    const descriptor = hog.extractHOG(image, options);
    /* eslint-disable-next-line */
    const blockWidth = Math.floor((image.width / options.cellSize - options.blockSize) / options.blockStride) + 1;
    /* eslint-disable-next-line */
    const blockHeight = Math.floor((image.height / options.cellSize - options.blockSize) / options.blockStride) + 1;

    const blockHistograms: number[][][] = [];
    for (let blockRow = 0; blockRow < blockWidth; blockRow += 1) {
      const row: number[][] = [];
      for (let blockCol = 0; blockCol < blockHeight; blockCol += 1) {
        const index = blockRow * blockWidth + blockCol;
        row.push(
          descriptor.slice(
            index * options.bins,
            index * options.bins + options.bins,
          ),
        );
      }
      blockHistograms.push(row);
    }
    console.log(blockHistograms);
  });
}

export default histogram;
