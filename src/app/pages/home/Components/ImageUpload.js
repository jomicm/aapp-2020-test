/* eslint-disable no-restricted-imports */
import React, { useState, useEffect } from 'react';
import { Button } from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import { urltoFile } from '../../../crud/api';
import './ImageUpload.scss';

const ImageUpload = ({ children, setImage = () => { }, image = null, disabled = false, showButton = true, showDeleteButton = true }) => {
  const [values, setValues] = useState({
    categoryPic: '/media/misc/placeholder-image.jpg',
    categoryPicDefault: '/media/misc/placeholder-image.jpg'
  });
  const updateValues = e => {
    const file = e.target.files[0];
    console.log(file);
    setImage(file);
    setValues({
      ...values,
      categoryPic: URL.createObjectURL(file)
    });
  };

  const getFile = async () => {
    const filename = image.split('/')[5];
    urltoFile(image, filename, `image/${filename.split('.')[1]}`).then(res => console.log(res));
    setImage({
      name: image,
      type: `image/${image.split('.')[image.split('.').length - 1]}`
    });
  };

  useEffect(() => {

    if (image && image?.length) {
      getFile();
    }

    setValues({
      ...values,
      categoryPic: image ? `${image}?${new Date()}` : values.categoryPicDefault
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
          color="secondary"
          className="image-upload-wrapper__picture-delete"
          onClick={handleOnDeleteClick}
          style={{ display: showDeleteButton ? null : 'none' }}
          variant="contained"
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
      <input
        accept="image/*"
        disabled={disabled}
        onChange={updateValues}
        type="file"
        style={{ display: showButton ? null : 'none' }}
      />
    </div>
  );
}

export default ImageUpload;


