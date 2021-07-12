import React from 'react';
import { withStyles, Tooltip, } from '@material-ui/core';

const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: '#2D2D2DF2',
    color: '#ffffff',
    maxWidth: 400,
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}))(Tooltip);

export default function CustomizedTooltips({ tooltipContent, content }) {
  return (
    <div>
      <HtmlTooltip
        title={
          <React.Fragment>
            {
              tooltipContent
            }
          </React.Fragment>
        }
      >
        {
          content
        }
      </HtmlTooltip>
    </div>
  );
}
