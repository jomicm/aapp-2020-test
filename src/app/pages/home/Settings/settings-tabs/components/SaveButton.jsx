import React, { useState } from 'react'
import clsx from "clsx";

const SaveButton = ({ handleOnClick }) => {
  const [loadingButtonPreviewStyle, setLoadingButtonPreviewStyle] = useState({
    paddingRight: "2.5rem"
  });
  const [loadingPreview, setLoadingPreview] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={handleOnClick}
        style={loadingButtonPreviewStyle}
        className={`btn btn-primary btn-elevate kt-login__btn-primary ${clsx(
          {
            "kt-spinner kt-spinner--right kt-spinner--md kt-spinner--light": loadingPreview
          }
        )}`}
      >
        <i className="la la-eye" /> Save
      </button>{" "}
    </div>
  )
}

export default SaveButton
