/* eslint-disable global-require */
import React, { useEffect } from 'react';
import './ImageSelector.css';

export const ALL_IMGS: { [name: string]: any } = {
  'three.png': require('../../../media/modules/computerVision/imageLibrary/three.png')
    .default,
  'diamond.png': require('../../../media/modules/computerVision/imageLibrary/diamond.png')
    .default,
  'square.png': require('../../../media/modules/computerVision/imageLibrary/square.png')
    .default,
  'circles.jpg': require('../../../media/modules/computerVision/imageLibrary/circles.jpg')
    .default,
  'dogSilhouette.jpg': require('../../../media/modules/computerVision/imageLibrary/dogSilhouette.jpg')
    .default,
  'purpleFlowers.jpeg': require('../../../media/modules/computerVision/imageLibrary/purpleFlowers.jpeg')
    .default,
  'steps.png': require('../../../media/modules/computerVision/imageLibrary/steps.png')
    .default,
  'tabbyCat.jpg': require('../../../media/modules/computerVision/imageLibrary/tabbyCat.jpg')
    .default,
  'teddyBear.jpg': require('../../../media/modules/computerVision/imageLibrary/teddyBear.jpg')
    .default,
  'zebra.jpg': require('../../../media/modules/computerVision/imageLibrary/zebra.jpg')
    .default,
  'bwWoman.jpg': require('../../../media/modules/computerVision/imageLibrary/bwWoman.jpg')
    .default,
  'bwMan.jpg': require('../../../media/modules/computerVision/imageLibrary/bwMan.jpg')
    .default,
};

const ImageSelector = (props: {
  currImg: string;
  onSelect: (img: string, imgUrl: string) => any;
}) => {
  useEffect(() => props.onSelect(props.currImg, ALL_IMGS[props.currImg]), []);

  const makeImg = (key: string) => (
    // eslint-disable-next-line
    <img
      key={key}
      className={key === props.currImg ? 'selected' : ''}
      src={ALL_IMGS[key]}
      onClick={() => props.onSelect(key, ALL_IMGS[key])}
    />
  );

  return (
    <div className="image-selector">
      Select Image
      <div className="selection-window">
        {Object.keys(ALL_IMGS).map(key => ALL_IMGS[key] && makeImg(key))}
      </div>
    </div>
  );
};

export default ImageSelector;
