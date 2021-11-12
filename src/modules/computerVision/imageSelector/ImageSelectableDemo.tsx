import React, { useState } from 'react';
import ImageSelector from './ImageSelector';

export interface DemoProps {
  imgUrl: string;
  labelColor: string;
  [arg: string]: any;
}

export interface ImageSelectableDemoProps {
  initImg: string;
  Demo: React.ComponentType<DemoProps>;
  demoProps: { labelColor: string };
}

/**
 *
 * @param props
 * @param props.initImg the initial image that the demo should use, a string for the image filename
 *                      (including extension, without filepath)
 * @param props.Demo    react component for the demo
 * @param props.demoProps     object containing any other props that the demo needs
 */
export const ImageSelectableDemo = ({
  initImg,
  Demo,
  demoProps,
}: ImageSelectableDemoProps) => {
  const [imgName, setImgName] = useState(initImg);
  const [imgUrl, setImgUrl] = useState('');

  const onImgChange = (img: string, url: string) => {
    setImgName(img);
    setImgUrl(url);
  };

  return (
    <div>
      <ImageSelector
        currImg={imgName}
        currImgUrl={imgUrl}
        onSelect={onImgChange}
      />
      <Demo imgUrl={imgUrl} labelColor={demoProps.labelColor} />
    </div>
  );
};
