/* eslint-disable global-require */
import React, { useRef, useState } from 'react';

export interface ImageUploaderProps {
  currImg: string;
  onSelect: (img: string, imgUrl: string) => any;
}

export interface Dimensions {
  width: number;
  height: number;
}

const ImageUploader = ({ currImg, onSelect }: ImageUploaderProps) => {
  const UPLOAD_IMG_KEY = 'upload';
  const [image, setImage] = useState('');
  const imgRef = useRef<HTMLImageElement>(null);

  const onImageChange = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      const img = e.target.files[0];
      setImage(URL.createObjectURL(img));
      onSelect(UPLOAD_IMG_KEY, URL.createObjectURL(img));
    }
  };

  return (
    <div className="flex flex-row justify-center mt-4">
      <div>
        {/* below was the original way img was being shown, not sure why not working with makeUploadImg */}
        {/* <img src={image} alt="" /> */}
        {/* eslint-disable-next-line */}
        <img
          key={UPLOAD_IMG_KEY}
          ref={UPLOAD_IMG_KEY === currImg ? imgRef : undefined}
          className={`img-visible ${
            UPLOAD_IMG_KEY === currImg ? 'selected' : 'unselected'
          }`}
          src={image}
          onClick={() => onSelect(UPLOAD_IMG_KEY, image)}
        />
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
