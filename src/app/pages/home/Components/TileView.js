import React, { useState, useEffect } from 'react';
import { Typography, Collapse, IconButton } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import ModalYesNo from '../Components/ModalYesNo';
import { getImageURL } from '../utils';
import {TileViewStyles} from './styles';


const TileView = ({ 
  tiles, 
  collection, 
  tailWidth = '120px', 
  tailHeight = '120px', 
  onEdit, 
  onDelete, 
  onReload, 
  showTileView
 }) => {
  const classes = TileViewStyles();
  const [selectedId, setSelectedId] = useState([]);
  const [openYesNoModal, setOpenYesNoModal] = useState([false, []]);

  const onTileHover = (id) => setSelectedId([id] || []);

  const confirmDelete = () => {
    onDelete(openYesNoModal[1]);
    setOpenYesNoModal([false, []]);
    onReload();
    setSelectedId([]);
  };
  
  return (
    <Collapse in={showTileView}>
      <div className={classes.root}>
        <ModalYesNo
          showModal={openYesNoModal[0]}
          onOK={() => confirmDelete()}
          onCancel={() => setOpenYesNoModal([false, []])}
          title={'Remove Element'}
          message={'Are you sure you want to remove this element?'}
        />
          <div className={classes.container}>
            {tiles.map((tile) => {
              const imageURL = getImageURL(tile._id, collection, tile.fileExt)
              return (
                <div 
                  className={classes.tile} 
                  style={{ width: tailWidth, height: tailHeight }} 
                  onMouseEnter={() => onTileHover(tile._id)} 
                  onMouseLeave={() => onTileHover(null)} 
                  key={tile._id}
                >
                  <img 
                    src={imageURL ? `${imageURL}?${new Date()}` : 'http://localhost:3000/media/misc/placeholder-image.jpg'} 
                    width='100%' 
                    height='100%' 
                    className={classes.image} 
                    alt='Categories' 
                  />
                  {
                    tile._id === selectedId[0] ?
                    (
                      <div className={classes.optionsShow}>
                        <div className={classes.buttonsContainer}>
                          <IconButton size='small' className={classes.iconButton} onClick={() => onEdit(selectedId)}>
                            <EditIcon fontSize='small' />
                          </IconButton>
                          <IconButton size='small' color='grey' className={classes.iconButton} onClick={() => setOpenYesNoModal([true, [selectedId]])}>
                            <DeleteIcon fontSize='small' />
                          </IconButton>
                        </div>
                        <div className={classes.textContainer}>
                          <div className={classes.text}>
                            <Typography noWrap={true}>{tile.name}</Typography>
                          </div>
                        </div>
                      </div>
                    )
                    :
                    (
                      <div className={classes.optionsNotShow}>
                        <div className={classes.textContainer}>
                          <div className={classes.text}>
                            <Typography noWrap={true}>{tile.name}</Typography>
                          </div>
                        </div>
                      </div>
                    )
                  }
                </div>
              )
            }
            )}
          </div>
      </div>
    </Collapse>
  )
}

export default TileView
