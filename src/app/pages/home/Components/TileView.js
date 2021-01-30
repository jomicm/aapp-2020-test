import React, { useState, useEffect } from 'react';
import { makeStyles, Typography, Button, Collapse, IconButton } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import ModalYesNo from '../Components/ModalYesNo';
import { getImageURL } from '../utils';

const useStyles = makeStyles((theme) => ({
  root: {
    overflow: 'auto',
    backgroundColor: theme.palette.background.paper,
    width: '100%',
    maxHeight: 400,
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  tile: {
    margin: 2,
    position: 'relative',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#BCBCBC',
    '&:hover': {
      borderColor: '#0061A699',
      cursor: 'pointer',
      borderWidth: 2,
    },
    zIndex: 3,
  },
  optionsNotShow: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    width: '100%',
    height: '100%',
  },
  optionsShow: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
  },
  textContainer: {
    zIndex: 2,
    backgroundColor: '#00000099',
    width: '100%',
    height: '20%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonsContainer: {
    zIndex: 2,
    padding: 4,
    borderBottomLeftRadius: 12,
    backgroundColor: '#8e8b8b99',
    alignSelf: 'flex-end',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    height: '80%',
    color: 'white',
    padding: 1,
  },
  image: {
    zIndex: 1,
    position: 'absolute'
  },
  button: {
    marginTop: 20,
  },
  iconButton: {
    margin: 2,
  }
}));

const TileView = ({ tiles, collection, tailWidth = '120px', tailHeight = '120px', onEdit, onDelete, onReload, showTileView }) => {
  const classes = useStyles();
  const [selectedId, setSelectedId] = useState([])
  const [openYesNoModal, setOpenYesNoModal] = useState([false, []]);

  const onTileHover = (id) => {
    if (id) {
      setSelectedId([id])
    }
    else {
      setSelectedId([])
    }
  }

  const confirmDelete = () => {
    onDelete(openYesNoModal[1])
    setOpenYesNoModal([false, []])
    onReload()
    setSelectedId([])
  }
  
  
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
                      :
                      <div className={classes.optionsNotShow}>
                        <div className={classes.textContainer}>
                          <div className={classes.text}>
                            <Typography noWrap={true}>{tile.name}</Typography>
                          </div>
                        </div>
                      </div>
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
