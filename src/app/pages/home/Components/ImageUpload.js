/* eslint-disable no-restricted-imports */
import React, { useState } from 'react';
import { Button } from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import './ImageUpload.scss';

const ImageUpload = ({ children, setImage }) => {
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
  return (
    <div className="image-upload-wrapper__picture">
      <h4 className="image-upload-wrapper__picture-title">{children}</h4>
      <div className="image-upload-wrapper__picture-wrapper">
        <Button
          variant="contained"
          color="secondary"
          className="image-upload-wrapper__picture-delete"
          onClick={() => setValues({ ...values, categoryPic: values.categoryPicDefault })}
        >
          <DeleteIcon />
        </Button>
        <img
          alt="categoryPic"
          className="image-upload-wrapper__picture-placeholder"
          src={values.categoryPic}
        />
      </div>
      <input type="file" onChange={updateValues} />
    </div>
  )
}

export default ImageUpload;


