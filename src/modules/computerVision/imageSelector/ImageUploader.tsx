/* eslint-disable global-require */
import React, { useState } from 'react';

const ImageUploader = (props: {
  onSelect: (img: string, imgUrl: string) => any;
}) => {
  const [image, setImage] = useState('');

  const onImageChange = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      const img = e.target.files[0];
      setImage(URL.createObjectURL(img));
      props.onSelect('upload', URL.createObjectURL(img));
    }
  };

  return (
    <div className="flex flex-row justify-center mt-4">
      <div>
        <img src={image} alt="" />
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
