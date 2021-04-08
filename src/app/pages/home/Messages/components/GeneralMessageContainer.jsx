import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { makeStyles, Divider, Typography, IconButton } from '@material-ui/core';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';
import {
  getCountDB,
  getDBComplex,
  getDB
} from '../../../../crud/api';
import MessageInformation from './MessageInformation';
import './GeneralMessageContainer.scss';
import Snapshot from './Snapshot';

const useStyles = makeStyles(theme => ({
  search: {
    backgroundColor: '#fafafa',
    '&:hover': {
      backgroundColor: '#F5F5F5',
    },
    width: '90%',
    height: '40px',
    margin: '15px',
    border: '1px #ffffff00 solid',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'start',
  },
  searchIcon: {
    position: 'relative',
    paddingRight: '10px',
    paddingLeft: '10px'
  },
  inputInput: {
    width: '74%', 
    border: 'none',
    outline: 'none',
    backgroundColor: '#FFFFFF00'
  },
  IconButton: {
    margin: '10px'
  }
}));

const GeneralMessageContainer = () => {
  const classes = useStyles();
  const [currentId, setCurrentId] = useState(null);
  const [currentUrl, setCurrentUrl] = useState(null);
  const [data, setData] = useState([]);
  const [headerInfo, setHeaderInfo] = useState({
    timeStamp: '',
    img: '',
    senderName: '',
    subject: '',
    to: ''
  });
  const [preview, setPreview] = useState('');

  const changeColor = (id) => (
    id === currentId ? 'snapshot-color' : ''
  );

  const [control, setControl] = useState({
    search: '',
    rowsPerPage: 5,
    page: 0,
    total: 1,
  });

  const handlePageChange = (action) => {
    if (action === 'add' && (control.page + 1) < Math.ceil(control.total / control.rowsPerPage)) {
      setControl(prev => ({ ...prev, page: prev.page + 1 }))
    }
    else if (action === 'reduce' && (control.page + 1) > 1) {
      setControl(prev => ({ ...prev, page: prev.page - 1 }))
    }
  };

  const loadInitData = () => {
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
        setData(data.response);
        if(!data.response.length && control.page > 0){
          setControl(prev => ({
            ...prev,
            page: prev.page - 1
          })); 
        }
      })
      .catch((error) => {});
    reset();
  };

  const reset = () => {
    setPreview('');
    setHeaderInfo({
      timeStamp: '',
      img: '',
      senderName: '',
      subject: '',
      to: ''
    });
  };

  useEffect(() => {
    loadInitData()
  }, [control.search, control.page])

  useEffect(() => {
    setCurrentUrl(window.location.search.slice(4).split('&')[0]);
    setControl(prev => ({
      ...prev,
      page: Number(window.location.search.slice(-1))
    }));
  }, [window.location.search]);

  useEffect(() => {
    if (data.length) {
      const messageFiltered = data.filter(({ _id }) => _id === currentUrl);
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
  }, [currentUrl, data]);

  useEffect(() => {
    loadInitData();
  }, []);

  return (
    <div className='__container-gmc'>
      <div className='__container-general-snapshot'>
        <div aria-label='Search Box' className={classes.search} key='SearchDiv'>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <input
            className={classes.inputInput}
            key='SearchField'
            onChange={event => setControl(prev => ({ ...prev, search: event.target.value }))}
            value = {control.search}
            placeholder='Search...'
          />
          {
            control.search.length > 0 && (
              <div style={{
                display:'flex',
                justifyContent: 'flex-end'
              }}>
                <IconButton size="small" onClick={() => setControl(prev => ({ ...prev, search: '' }))}>
                  <ClearIcon />
                </IconButton>
              </div>
            )
          }
        </div>
        <span className='field-validator_error' style={{ display: 'flex', justifyContent: 'center', width: '90%' }}>
          {control.search.length >= 3 || control.search.length === 0 ? null : 'The search value must be at least 3 characters long'}
        </span>
        {data.length ? data.map((msg, index) => {
          const { html, _id, timeStamp, from, img, subject, to } = msg;
          return (
            <div key={msg._id} onClick={() => setPreview(html)}>
              <Link to={`/messages?id=${_id}&page=${control.page}`}>
                <div className={changeColor(_id)}>
                  <Snapshot
                    data={data}
                    dateTime={timeStamp}
                    name={from[0].name}
                    lastName={from[0].lastName}
                    id={_id}
                    img={img}
                    reload={loadInitData}
                    senderName={from[0].email}
                    subject={subject}
                    to={to[0].email}
                  />
                </div>
              </Link>
            </div>
          )
        }) : 'You have no messages'}
      </div>
      <div style={{
          position: 'fixed',
          bottom: 20,
          width: '40vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          backgroundColor: '#FFFFFF'
        }}>
          Page: {control.page + 1}/{Math.ceil(control.total / control.rowsPerPage)}
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
      <div className='__container-preview'>
        <MessageInformation
          dateTime={headerInfo.timeStamp}
          img={headerInfo.img}
          preview={preview}
          senderName={headerInfo.senderName}
          subject={headerInfo.subject}
          to={headerInfo.to}
        />
      </div>
    </div>
  );
};

export default GeneralMessageContainer;
