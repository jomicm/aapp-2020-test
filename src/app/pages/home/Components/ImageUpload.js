/* eslint-disable no-restricted-imports */
import React, { useState, useEffect } from 'react';
import { Button } from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import './ImageUpload.scss';

const ImageUpload = ({ children, setImage = () => {}, image = null }) => {
  const [values, setValues] = useState({
    categoryPic: '/media/misc/placeholder-image.jpg',
    categoryPicDefault: '/media/misc/placeholder-image.jpg'
  });
  const updateValues = e => {
    const file = e.target.files[0];
    setImage(file);
    setValues({
      ...values,
      categoryPic: URL.createObjectURL(file)
    });
  };

  useEffect(() => {
    setValues({
      ...values,
      categoryPic: image? `${image}?${new Date()}` : values.categoryPicDefault
    });
  }, [image]);

  const handleOnDeleteClick = () => {
    setValues({ ...values, categoryPic: values.categoryPicDefault });
    setImage(null);
  };

  return (
    <div className="image-upload-wrapper__picture">
      <h4 className="image-upload-wrapper__picture-title">{children}</h4>
      <div className="image-upload-wrapper__picture-wrapper">
        <Button
          variant="contained"
          color="secondary"
          className="image-upload-wrapper__picture-delete"
          onClick={handleOnDeleteClick}
        >
          <DeleteIcon />
        </Button>
        <img
          key={Date.now()}
          alt="categoryPic"
          className="image-upload-wrapper__picture-placeholder"
          src={values.categoryPic}
        />
      </div>
      <input type="file" onChange={updateValues} />
    </div>
  );
}

export default ImageUpload;


