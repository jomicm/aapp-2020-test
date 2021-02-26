import React from 'react'
import clsx from 'clsx';

const SaveButton = ({ handleOnClick, loading }) => {
  return (
    <div>
      <button
        type='button'
        onClick={handleOnClick}
        style={loading ? { paddingRight: '3.5rem' } : { paddingRight: '2.5rem' }}
        className={`btn btn-primary btn-elevate kt-login__btn-primary ${clsx(
          {
            'kt-spinner kt-spinner--right kt-spinner--md kt-spinner--light': loading
          }
        )}`}
      >
        <i className='la la-eye' /> Save
      </button>{' '}
    </div>
  )
}

export default SaveButton
