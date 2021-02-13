import React, { useState  } from 'react';
import { Collapse,  IconButton, Typography } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import ModalYesNo from '../Components/ModalYesNo';
import { getImageURL } from '../utils';
import { TileViewStyles } from './styles';

const TileView = ({ 
  collection, 
  onDelete, 
  onEdit,  
  onReload,
  showTileView, 
  tailHeight = '120px',
  tailWidth = '120px', 
  tiles
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
          message={'Are you sure you want to remove this element?'}
          onCancel={() => setOpenYesNoModal([false, []])}
          onOK={() => confirmDelete()}
          showModal={openYesNoModal[0]}
          title={'Remove Element'}
        />
          <div className={classes.container}>
            {tiles.map((tile) => {
              const imageURL = getImageURL(tile._id, collection, tile.fileExt)
              return (
                <div 
                  className={classes.tile} 
                  key={tile._id}
                  onMouseEnter={() => onTileHover(tile._id)} 
                  onMouseLeave={() => onTileHover(null)} 
                  style={{ width: tailWidth, height: tailHeight }} 
                >
                  <img 
                    src={imageURL ? `${imageURL}?${new Date()}` : 'http://localhost:3000/media/misc/placeholder-image.jpg'} 
                    width='100%' 
                    height='100%' 
                    className={classes.image} 
                    alt='Categories' 
                  />
                  {
                    tile._id === selectedId[0] ? (
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
                    ) : (
                      <div className={classes.optionsNotShow} aria-label={'OptionsNotShow'}>
                        <div className={classes.textContainer} aria-label={'TextContainer'}>
                          <div className={classes.text} aria-label={'Text'}>
                            <Typography noWrap>{tile.name}</Typography>
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
