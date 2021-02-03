import { makeStyles } from '@material-ui/core';

export const TileViewStyles = makeStyles((theme) => ({
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
