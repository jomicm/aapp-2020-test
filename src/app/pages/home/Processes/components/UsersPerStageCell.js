import React from 'react';
import { Chip, Typography} from '@material-ui/core';
import CustomizedToolTip from '../../Components/CustomizedToolTip';

export default function UsersPerStageCell({ number, values}) {
    return (
        <div style={{ display:'table-cell', verticalAlign: 'middle', textAlign:'center', padding: '16px', borderBottom: '1px solid rgba(224, 224, 224, 1)'}}>
        {
          number > 0 && (
            <CustomizedToolTip 
              tooltipContent={
                <ul style={{marginTop: '10px', listStyleType: 'none', marginRight: '20px'}}>
                  {
                    values.map(({name, users}) => (
                      <li style={{margin: '12px 0px'}}>
                        <h6> {`${name}:`} </h6>
                        <ul>
                          {
                            users.map((userInfo) => (
                              <>
                                <li>
                                  {userInfo}
                                </li>
                              </>
                            ))
                          }
                          {
                            users.length === 0 && 
                            <li>
                              N/A
                            </li>
                          }
                        </ul>
                      </li>
                    ))
                  }
                </ul>
              }
              content = {
                <Chip
                  label={`Users: ${number}`}
                  style={{ backgroundColor: '#8e8e8e', height: '28px'}}
                  color='secondary'
                  onClick={() => {}}
                />
              }
            />
          )
        }
        {
          number === 0 && (
            <il> 
              <Typography style={{ fontSize: '0.875rem' }}>
                N/A
              </Typography>
            </il>
          )
        }
      </div>
    )
}
