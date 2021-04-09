import React, { forwardRef } from 'react';

const SnapshotToggle = forwardRef((props, ref) => {
  return (
    <div
      ref={ref}
      className="kt-header__topbar-wrapper"
      onClick={e => {
        e.preventDefault();
        props.onClick(e);
      }}
    >
      {props.children}
    </div>
  );  
});

SnapshotToggle.displayName = 'SnapshotToggle';
export default SnapshotToggle;
