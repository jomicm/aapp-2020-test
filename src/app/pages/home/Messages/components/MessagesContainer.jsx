import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import {
  Grid,
  CircularProgress,
  makeStyles,
  IconButton,
  Typography,
} from '@material-ui/core';

import {
  getCountDB,
  getDBComplex,
  updateDB,
} from '../../../../crud/api';

import SearchIcon from '@material-ui/icons/Search';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ClearIcon from '@material-ui/icons/Clear';
import MessageInformation from './MessageInformation';
import MessageSnapshot from './MessageSnapshot';

const useStyles = makeStyles(() => ({
  root: {
    minHeight: '500px',
  },
  searchBox: {
    width: '100%;',
    height: '40px',
    marginBottom: '20px',
    padding: '0px 10px',
    alignSelf: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fafafa;',
    border: '1px solid #E7E7E7',
    borderRadius: '10px',
    '&:hover': {
      backgroundColor: '#F5F5F5',
    }
  },
  inputStyle: {
    flex: 1,
    marginLeft: '5px',
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesList: {
    display: 'flex',
    flexDirection: 'column',
    flex: 11,
    // overflowY: 'scroll',
  },
  controllerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  progressIndicator: {
    alignSelf: 'center',
  },
}));

export default function MessagesContainer() {
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

  const handleMessageStatus = ({ _id, read }) => {
    if (!read) {
      const index = messages.findIndex((message) => message._id === _id);
      const newMessage = messages;
      newMessage[index].read = true;
      handleUpdate(_id, read);
      loadMessages();
    }
  }

  const handleUpdate = (id, read) => {
    const body = { read: true };
    updateDB('messages/', body, id)
      .catch(error => console.log('Error', error));
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
    <Grid container className={classes.root} direction="row">
      <Grid container item md={6} direction="column">
        {/* Search */}
        <Grid
          container
          item
          className={classes.searchBox}
          direction="row"
        >
          <SearchIcon />
          <input
            className={classes.inputStyle}
            placeholder="Buscar Mensaje..."
            value={control.search}
            onChange={handleChange}
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
        </Grid>
        {
          control.search.length < 3 && control.search.length !== 0 && (
            <span
              style={{
                color: 'red',
                fontSize: '8px',
                display: 'flex',
                justifyContent: 'flex-start',
                width: '90%',
                marginTop: '-10px',
              }}
            >
              The search value must be at least 3 characters long
            </span>
          )
        }
        <Grid className={classes.messagesContainer} container item direction="column">
          <Grid
            style={{ flex: 11, justifyContent: 'center' }}
            container
            item
            direction="column"
          >
            {
              messages == null
                ? (
                  <CircularProgress className={classes.progressIndicator} />
                )
                : messages.length == 0
                  ? <span>No Messages Found</span>
                  : (
                    <div className={classes.messagesList}>
                      {
                        messages.map(message => (
                          <Link
                            key={message._id}
                            to={`/messages?id=${message._id}&page=${control.page}`}
                            style={{
                              display: 'flex',
                              flex: 1,
                              backgroundColor: currentId == message._id ? 'rgba(0, 0, 0, 0.1)' : null
                            }}
                            onClick={() => {
                              handleMessageStatus(message);
                              setPreview(message.html);
                              setCurrentId(message._id);
                            }}
                          >
                            <MessageSnapshot
                              message={message}
                              currentId={currentId}
                              loadMessages={loadMessages}
                            />
                          </Link>
                        ))
                      }
                    </div>
                  )
            }
          </Grid>
          <Grid className={classes.controllerContainer} container item>
            <Typography>
              Page {control.page + 1}/{Math.ceil(control.total / control.rowsPerPage)}
            </Typography>
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
          </Grid>
        </Grid>
      </Grid>
      {/* Preview Container */}
      <Grid container item md={6} alignItems="center" justify="center">
        <MessageInformation
          headerInfo={headerInfo}
          preview={preview}
        />
      </Grid>
    </Grid>
  )
}
