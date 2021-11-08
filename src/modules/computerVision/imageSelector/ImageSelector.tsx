/* eslint-disable global-require */
import React, { useEffect, useRef, useState } from 'react';
import './ImageSelector.css';
import ImageUploader from './ImageUploader';

const ALL_IMGS: { [name: string]: any } = {
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

export interface ImageSelectorProps {
  currImg: string;
  currImgUrl: string;
  onSelect: (img: string, imgUrl: string) => any;
}

const ImageSelector = ({
  currImg,
  currImgUrl,
  onSelect,
}: ImageSelectorProps) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => onSelect(currImg, ALL_IMGS[currImg]), []);

  const makeImg = (key: string) => (
    // eslint-disable-next-line
    <img
      key={key}
      className={`img-visible ${key === currImg ? 'selected' : 'unselected'}`}
      src={ALL_IMGS[key]}
      onClick={() => onSelect(key, ALL_IMGS[key])}
    />
  );

  return (
    <div className="image-selector">
      {/* eslint-disable-next-line */}
      <img
        key={`hidden ${currImg}`}
        ref={imgRef}
        className="hidden"
        src={currImgUrl}
        onLoad={() =>
          setDimensions({
            width: imgRef.current?.width ?? 0,
            height: imgRef.current?.height ?? 0,
          })
        }
      />
      Select Image
      <div className="selection-window">
        {Object.keys(ALL_IMGS).map(key => ALL_IMGS[key] && makeImg(key))}
      </div>
      <ImageUploader currImg={currImg} onSelect={onSelect} />
      Image Size:&nbsp;
      {dimensions.width === 0 ? '?' : dimensions.width}
      &nbsp;px by&nbsp;
      {dimensions.height === 0 ? '?' : dimensions.height}
      &nbsp;px
    </div>
  );
};

export default ImageSelector;
