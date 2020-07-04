/* eslint-disable no-restricted-imports */
import React, { useState } from 'react';
import { Button } from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import './ImageUpload.scss';

const ImageUpload = (props) => {
  const [values, setValues] = useState({
    categoryPic: '/media/misc/placeholder-image.jpg',
    categoryPicDefault: '/media/misc/placeholder-image.jpg'
  });
  return (
    <div className="image-upload-wrapper__picture">
      <h4 className="image-upload-wrapper__picture-title">{props.children}</h4>
      <div className="image-upload-wrapper__picture-wrapper">
        <Button variant="contained" color="secondary" className="image-upload-wrapper__picture-delete" onClick={() => setValues({ ...values, categoryPic: values.categoryPicDefault })}>
          <DeleteIcon />
        </Button>
        <img src={values.categoryPic} alt="categoryPic" className="image-upload-wrapper__picture-placeholder"/>
      </div>
      <input type="file" onChange={e => setValues({ ...values, categoryPic: URL.createObjectURL(e.target.files[0]) })}/>
    </div>
  )
}

export default ImageUpload;


