/* eslint-disable global-require */
import React, { useRef, useState } from 'react';

export interface ImageUploaderProps {
  currImg: string;
  onSelect: (img: string, imgUrl: string) => any;
  setDimensions: (dim: Dimensions) => void;
}

export interface Dimensions {
  width: number;
  height: number;
}

const ImageUploader = ({
  currImg,
  onSelect,
  setDimensions,
}: ImageUploaderProps) => {
  const UPLOAD_IMG_KEY = 'upload';
  const [image, setImage] = useState('');
  const imgRef = useRef<HTMLImageElement>(null);

  const onImageChange = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      const img = e.target.files[0];
      setImage(URL.createObjectURL(img));
      onSelect(UPLOAD_IMG_KEY, URL.createObjectURL(img));
      setDimensions({
        width: imgRef.current?.width ?? 0,
        height: imgRef.current?.height ?? 0,
      });
    }
  };

  const makeUploadImg = () => {
    // eslint-disable-next-line
    <img
      key={UPLOAD_IMG_KEY}
      ref={UPLOAD_IMG_KEY === currImg ? imgRef : undefined}
      className={UPLOAD_IMG_KEY === currImg ? 'selected' : 'unselected'}
      src={image}
      onClick={() => {
        onSelect(UPLOAD_IMG_KEY, image);
        setDimensions({
          width: imgRef.current?.width ?? 0,
          height: imgRef.current?.height ?? 0,
        });
      }}
    />;
  };

  return (
    <div className="flex flex-row justify-center mt-4">
      <div>
        {/* below was the original way img was being shown, not sure why not working with makeUploadImg}
        {/* <img src={image} alt="" /> */}
        {makeUploadImg}
      </div>
      <div>
        <h1>Upload Image</h1>
        <input
          type="file"
          name="myImage"
          accept="image/*"
          onChange={onImageChange}
        />
      </div>
    </div>
  );
};

export default ImageUploader;
