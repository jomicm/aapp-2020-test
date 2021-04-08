import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import {
  Typography,
  Grid,
  CircularProgress,
  makeStyles,
  IconButton,
  Avatar,
  Card,
  CardHeader,
  CardContent,
  Divider,
} from '@material-ui/core';

import {
  getCountDB,
  getDBComplex,
} from '../../../../crud/api';

import SearchIcon from '@material-ui/icons/Search';
import DeleteIcon from '@material-ui/icons/Delete';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ClearIcon from '@material-ui/icons/Clear';
import './TrashMessagesContainer.scss';
import Preview from './Preview';

const useStyles = makeStyles(() => ({
  progressIndicator: {
    alignSelf: 'center',
  },
  snapshot: {
    display: 'flex',
    flex: 1,
    width: '100%',
    position: 'relative',
    alignSelf: 'flex-start',
    '&:hover': {
      backgroundColor: '#F5F5F5',
      cursor: 'pointer',
    },
    alignItems: 'center',
  },
  deleteIcon: {
    position: 'absolute',
    top: '0px',
    right: '20px',
  },
  avatar: {
    marginRight: '10px',
  },
  snapshotInfo: {
    flex: 1,
    color: 'black',
    textOverflow: 'ellipsis',
  },
}));

export default function TrashMessagesContainer() {
  const classes = useStyles();

  /* React states */

  const [messages, setMessages] = useState();
  const [currentId, setCurrentId] = useState();
  const [currentUrl, setCurrentUrl] = useState();
  const [preview, setPreview] = useState('');
  const [headerInfo, setHeaderInfo] = useState({
    timeStamp: '',
    img: '',
    senderName: '',
    subject: '',
    to: ''
  });
  const [control, setControl] = useState({
    search: '',
    rowsPerPage: 5,
    page: 0,
    total: 1,
  });

  /* Functions */

  const loadMessages = () => {
    let queryLike = ['subject', 'html'].map(key => ({ key, value: control.search }))

    getCountDB({
      collection: 'messages',
      queryLike: control.search.length >= 3 ? queryLike : null,
    })
      .then(response => response.json())
      .then(data => {
        setControl(prev => ({
          ...prev,
          total: data.response.count === 0 ? 1 : data.response.count
        }))
      });

    getDBComplex({
      collection: 'messages',
      limit: control.rowsPerPage,
      skip: control.rowsPerPage * control.page,
      queryLike: control.search.length >= 3 ? queryLike : null,
      sort: [{ key: 'creationDate', value: -1 }]
    })
      .then(response => response.json())
      .then((data) => {
        setMessages(data.response);
        if (!data.response.length && control.page > 0) {
          setControl(prev => ({
            ...prev,
            page: prev.page - 1
          }));
        }
      })
      .catch((error) => { });
    reset();
  }

  const reset = () => {
    setPreview('');
    setHeaderInfo({
      timeStamp: '',
      img: '',
      senderName: '',
      subject: '',
      to: ''
    });
  }

  const handlePageChange = (action) => {
    if (action === 'add' && (control.page + 1) < Math.ceil(control.total / control.rowsPerPage)) {
      setControl(prev => ({ ...prev, page: prev.page + 1 }))
    }
    else if (action === 'reduce' && (control.page + 1) > 1) {
      setControl(prev => ({ ...prev, page: prev.page - 1 }))
    }
  };

  const handleChange = (event) => {
    setControl(prev => ({
      ...prev,
      search: event.target.value,
    }));
  };

  /* Component mounts */

  useEffect(() => {
    setMessages(null);
    const timer = setTimeout(() => {
      loadMessages();
    }, 600);
    return () => clearTimeout(timer);
  }, [control.search, control.page]);

  useEffect(() => {
    setCurrentUrl(window.location.search.slice(4).split('&')[0]);
    setControl(prev => ({
      ...prev,
      page: Number(window.location.search.slice(-1))
    }));
  }, [window.location.search]);

  useEffect(() => {
    if (messages != null) {
      if (messages.length) {
        const messageFiltered = messages.filter(({ _id }) => _id === currentUrl);
        if (messageFiltered.length) {
          setCurrentId(messageFiltered[0]._id);
          const { timeStamp, img, from, subject, to, html } = messageFiltered[0];
          setPreview(html);
          setHeaderInfo({
            img,
            senderName: from[0].name,
            subject,
            timeStamp,
            to: to[0].email
          });
        } else {
          reset();
        }
      }
    }
  }, [currentUrl, messages]);

  return (
    <div className="trash-container">
      <div className="messages-column-container">
        <div className="search-box-container">
          <SearchIcon />
          <input
            value={control.search}
            onChange={handleChange}
            placeholder="Buscar Mensaje..."
          />
          {
            control.search.length > 0 && (
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end'
              }}>
                <IconButton size="small" onClick={() => setControl(prev => ({ ...prev, search: '' }))}>
                  <ClearIcon />
                </IconButton>
              </div>
            )
          }
        </div>
        {
          control.search.length < 3 && control.search.length !== 0 && (
            <span
              style={{
                color: 'red',
                fontSize: '12px',
                display: 'flex',
                justifyContent: 'flex-start',
                width: '90%',
                margin: '15px 0px',
              }}
            >
              The search value must be at least 3 characters long
            </span>
          )
        }
        <div className="messages-container">
          {
            messages == null
              ? <CircularProgress className={classes.progressIndicator} />
              : messages.length == 0
                ? <span>No Messages Found</span>
                : messages.map(message => (
                  <div
                    style={{
                      backgroundColor: currentId == message._id
                        ? 'rgba(0, 0, 0, 0.1)'
                        : null
                    }}
                    className={classes.snapshot}
                    onClick={() => {
                      setPreview(message.html);
                      setCurrentId(message._id);
                    }}
                  >
                    <Link to={`/messages?id=${message._id}&page=${control.page}`}>
                      <Snapshot message={message} />
                    </Link>
                  </div>
                ))
          }
        </div>
        <div className="page-controller-container">
          <span>
            Page {control.page + 1}/{Math.ceil(control.total / control.rowsPerPage)}
          </span>
          <IconButton
            style={{ marginLeft: '5px' }}
            onClick={() => handlePageChange('reduce')}
          >
            <ChevronLeftIcon />
          </IconButton>
          <IconButton
            style={{ marginRight: '5px' }}
            onClick={() => handlePageChange('add')}
          >
            <ChevronRightIcon />
          </IconButton>
        </div>
      </div>
      <TrashMessagePreview
        headerInfo={headerInfo}
        preview={preview}
      />
    </div >
  )
}

function Snapshot({ message }) {
  const classes = useStyles();
  const name = `${message.from[0].name} ${message.from[0].lastName}`;
  const senderName = message.from[0].email;
  return (
    <>
      <Grid container item>
        <div className="snapshot-message">
          <Avatar className={classes.avatar} alt="user image" sizes src={message.img} />
          <div className="snapshot-message-info">
            <Typography
              className={classes.snapshotInfo}
              style={{ fontWeight: 'bold' }}
              variant="subtitle1"
            >
              {name}
            </Typography>
            <Typography
              className={classes.snapshotInfo}
              style={{ width: '80%' }}
              variant="body1"
            >
              {message.subject}
            </Typography>
            <Grid container item direction="row" alignItems="space-between">
              <Typography
                className={classes.snapshotInfo}
                variant="caption"
              >
                {senderName}
              </Typography>
              <Typography
                className={classes.snapshotInfo}
                variant="caption"
              >
                {message.timeStamp}
              </Typography>
            </Grid>
          </div>
        </div>
        <IconButton
          className={classes.deleteIcon}
          aria-label="Move message to trash"
          onClick={() => console.log('Eliminando...')}
        >
          <DeleteIcon />
        </IconButton>
      </Grid>
    </>
  );
}

function TrashMessagePreview({ headerInfo, preview }) {
  const classes = useStyles();
  const {
    timeStamp,
    img,
    senderName,
    subject,
    to,
  } = headerInfo;

  return (
    <div className="message-preview-container">
      <Card style={{ flex: 1, height: '100%', marginLeft: '20px' }}>
        <CardHeader
          avatar={<Avatar alt="user image" src={img} />}
          title={
            <Typography variant="h5">
              {subject}
            </Typography>
          }
          subheader={
            <Typography>
              {timeStamp}
            </Typography>
          }
        />
        <Divider />
        <CardContent>
          <Typography
            style={{ fontSize: '20px' }}
            variant="body2"
            color="primary"
          >
            <Preview preview={preview} />
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}
