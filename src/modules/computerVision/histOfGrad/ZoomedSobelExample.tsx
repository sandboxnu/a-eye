/* eslint-disable */
import React, {useState} from 'react';
import zoomedImage from '../../../media/modules/computerVision/zoomedExample/zoomed_image_pixels.png';
import diagonalDownDark from '../../../media/modules/computerVision/zoomedExample/zoomed_diagonaldown_darktolight.png';
import diagonalDownLight from '../../../media/modules/computerVision/zoomedExample/zoomed_diagonaldown_lighttodark.png';
import diagonalUpDark from '../../../media/modules/computerVision/zoomedExample/zoomed_diagonalup_darktolight.png';
import diagonalUpLight from '../../../media/modules/computerVision/zoomedExample/zoomed_diagonalup_lighttodark.png';
import horizontalDark from '../../../media/modules/computerVision/zoomedExample/zoomed_horizontal_darktolight.png';
import horizontalLight from '../../../media/modules/computerVision/zoomedExample/zoomed_horizontal_lighttodark.png';
import verticalDark from '../../../media/modules/computerVision/zoomedExample/zoomed_vertical_darktolight.png';
import verticalLight from '../../../media/modules/computerVision/zoomedExample/zoomed_vertical_lighttodark.png';

type ZoomedSobelType = {
  labelColor: string;
};

const zoomedImages: {[name: string]: any} = {
  "Diagonal Down, Dark to Light": diagonalDownDark,
  "Diagonal Down, Light to Dark": diagonalDownLight,
  "Diagonal Up, Dark to Light": diagonalUpDark,
  "Diagonal Up, Light to Dark": diagonalUpLight,
  "Horizontal, Dark to Light": horizontalDark,
  "Horizontal, Light to Dark": horizontalLight,
  "Vertical, Dark to Light": verticalDark,
  "Vertical, Light to Dark": verticalLight
}

const getZoomImage = (name: string): any => {
  const img: string | null = zoomedImages[name];
  if (!img) return (<div />);
  return (<img src={img} alt="zoomed-in" className=""/>)
}

const filters: string[] = [
    "Diagonal Down, Dark to Light",
    "Diagonal Down, Light to Dark",
    "Diagonal Up, Dark to Light",
    "Diagonal Up, Light to Dark",
    "Horizontal, Dark to Light",
    "Horizontal, Light to Dark",
    "Vertical, Dark to Light",
    "Vertical, Light to Dark"
];
const descriptions: string[] = [
    "760 is positive and large which indicates a prominent diagonal down, dark to light edge at this pixel.",
    "-760 is negative which indicates there is no diagonal down, light to dark edge at this pixel.",
    "270 is positive and smaller which indicates a minor diagonal up, dark to light edge at this pixel.",
    "-270 is negative which indicates there is no diagonal up, light to dark edge at this pixel.",
    "725 is positive and large which indicates a prominent horizontal, dark to light edge at this pixel.",
    "-725 is negative which indicates there is no horizontal, light to dark edge at this pixel.",
    "-415 is negative which indicates there is no vertical, dark to light edge at this pixel.",
    "415 is positive and medium-sized which indicates a vertical, light to dark edge at this pixel.",
];

const ZoomedSobelExample: React.FC<ZoomedSobelType> = ({ labelColor }) => {
  const [filterIdx, setFilterIdx] = useState<number>(0);

  return (
    <div className={`${labelColor} container flex flex-col justify-center`}>
      <p>From the following image, we pick a single pixel and its neighbors, which gives us a 3x3 grid:</p>
      <img src={zoomedImage} alt="zoomed" className="" />
      <p className="my-5">By applying a specific sobel filter to the pixel, we can determine the presence of an edge in that direction. Experiment with the 8 different filters below.</p>
      <div>
          <label htmlFor="filters">Filter: </label>
          <select className=" bg-white bg-opacity-50" id="filters" name="filters" onChange={(event) => {setFilterIdx(parseInt(event.target.value))}}>
            {
              ([0, 1, 2, 3, 4, 5, 6, 7]).map((idx) => <option value={idx} >{[filters[idx]]}</option>)
            }
          </select>
      </div>
      {
        getZoomImage(filters[filterIdx])
      }
      <p className="mb-5">{ descriptions[filterIdx] }</p>
    </div>
  );
};

export default ZoomedSobelExample;
