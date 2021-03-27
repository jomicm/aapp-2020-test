import React from 'react'
import CircularProgressCustom from './CircularProgressCustom';
import { connect } from 'react-redux';

function GeneralLoading({ children, generalLoading }) {
    
  const showLoader = () => {
    if (generalLoading.active) {
      return (
        <div
          style={{
            width: '100%',
            height: '100vh',
            display: 'flex',
            alignContent: 'center',
            justifyContent: 'center',
            backgroundColor: '#000000B3',
            position: 'fixed',
            zIndex: 1000
          }}
          id='GeneralLoading'
          ariaLabel='GeneralLoading'
        >
          <CircularProgressCustom size={75} />
        </div>
      )
    } else return null
  };

  return (
    <>
      { showLoader() }
      { children }
    </>
  )
}

const mapStateToProps = ({ general: { generalLoading } }) => ({
  generalLoading
});
export default connect(mapStateToProps)(GeneralLoading);
