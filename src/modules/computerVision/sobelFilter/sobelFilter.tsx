/* eslint-disable */
import Jimp from 'jimp';

export type GradientsType = {
  vertLightDark: ImageData,
  horizLightDark: ImageData,
  diagDownLightDark: ImageData,
  diagUpLightDark: ImageData,
  vertDarkLight: ImageData,
  horizDarkLight: ImageData,
  diagDownDarkLight: ImageData,
  diagUpDarkLight: ImageData,
  combined: ImageData
}

export async function gradientImages(imageUrl: string): Promise<GradientsType | undefined> {
  // kernels are transposed
  const vertKernelLightDark: number[][] = [
    [1, 2, 1],
    [0, 0, 0],
    [-1, -2, -1,]
  ];

  const horizKernelLightDark: number[][] = [
    [1, 0, -1],
    [2, 0, -2],
    [1, 0, -1,]
  ];

  const diagDownKernelLightDark: number[][] = [
    [-2, -1,0],
    [-1, 0, 1],
    [0,  1, 2]
  ];

  const diagUpKernelLightDark: number[][] = [
    [0, 1, 2],
    [-1, 0, 1],
    [-2, -1, 0,]
  ];
  const vertKernelDarkLight: number[][] = [
    [-1, -2, -1],
    [0, 0, 0],
    [1, 2, 1,]
  ];

  const horizKernelDarkLight: number[][] = [
    [-1, 0, 1],
    [-2, 0, 2],
    [-1, 0, 1,]
  ];

  const diagDownKernelDarkLight: number[][] = [
    [2, 1,0],
    [1, 0, -1],
    [0,  -1, -2]
  ];

  const diagUpKernelDarkLight: number[][] = [
    [0, -1, -2],
    [1, 0, -1],
    [2, 1, 0,]
  ];

  const kernels: number[][][] = [
    vertKernelLightDark,
    horizKernelLightDark,
    diagDownKernelLightDark,
    diagUpKernelLightDark,
    vertKernelDarkLight,
    horizKernelDarkLight,
    diagDownKernelDarkLight,
    diagUpKernelDarkLight
  ];

  return Jimp.read(imageUrl)
    .then(image => {
      image.greyscale()
      let imageDataList: ImageData[] = []
      kernels.forEach((kernel) => {
        let currentImage = image.clone()
        currentImage.convolute(kernel)
        let clampedArray = Uint8ClampedArray.from(currentImage.bitmap.data)
        let imageData = new ImageData(clampedArray, currentImage.bitmap.width, currentImage.bitmap.height)
        imageDataList.push(imageData)
      })

      let combinedClampedArray = Uint8ClampedArray.from(imageDataList[0].data)

      combinedClampedArray = combinedClampedArray.map((_, index) => {
        let sum = 0
        for (let i = 0; i < 8; i++) {
          sum += imageDataList[i].data[index]
        }
        return sum;
      })
      let combinedImageData =  new ImageData(combinedClampedArray, imageDataList[0].width, imageDataList[0].height)

      return {
        vertLightDark: imageDataList[0],
        horizLightDark: imageDataList[1],
        diagDownLightDark: imageDataList[2],
        diagUpLightDark: imageDataList[3],
        vertDarkLight: imageDataList[4],
        horizDarkLight: imageDataList[5],
        diagDownDarkLight: imageDataList[6],
        diagUpDarkLight: imageDataList[7],
        combined: combinedImageData
      }
    }).catch(e => {console.log(e); return {
      vertLightDark: new ImageData(385,385),
      horizLightDark: new ImageData(385,385),
      diagDownLightDark: new ImageData(385,385),
      diagUpLightDark: new ImageData(385,385),
      vertDarkLight: new ImageData(385,385),
      horizDarkLight: new ImageData(385,385),
      diagDownDarkLight: new ImageData(385,385),
      diagUpDarkLight: new ImageData(385,385),
      combined: new ImageData(385,385)
    };});

}