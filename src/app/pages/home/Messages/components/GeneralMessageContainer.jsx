import React, { useState, useEffect } from 'react';
import { makeStyles, Divider, Typography, IconButton } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

import Snapshot from './Snapshot';
import MessageInformation from './MessageInformation';
import './GeneralMessageContainer.scss';
import {
  getCountDB,
  getDBComplex
} from '../../../../crud/api';

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
  const [data, setData] = useState([]);
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

  const handlePageChange = (action) => {
    if (action === 'add' && (control.page + 1) < Math.ceil(control.total / control.rowsPerPage)) {
      setControl(prev => ({ ...prev, page: prev.page + 1 }))
    }
    else if (action === 'reduce' && (control.page + 1) > 1) {
      setControl(prev => ({ ...prev, page: prev.page - 1 }))
    }
  }

  useEffect(() => {
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
    })
      .then(response => response.json())
      .then((data) => {
        setData(data.response);
      })
      .catch((error) => console.log('error>', error));
  }, [control.search, control.page]);

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
            placeholder='Search...'
          />
        </div>
        <span className='field-validator_error'>
          {control.search.length >= 3 || control.search.length === 0 ? null : 'The search value must be at least 3 characters long'}
        </span>
        {
          data.length > 0 ? (
            data.map((msg, index) => (
              <>
                <div key={msg.id}
                  onClick={() => setPreview(msg.html)}
                  style={{
                    width: '90%'
                  }}
                >
                  <div
                    onClick={() => (
                      setHeaderInfo({
                        timeStamp: msg.timeStamp,
                        img: msg.img,
                        senderName: msg.from,
                        subject: msg.subject,
                        to: msg.to[0].email
                      })
                    )
                    }
                  >
                    <Snapshot
                      dateTime={msg.timeStamp}
                      name={msg.from[0].name}
                      lastName={msg.from[0].lastName}
                      id={msg.id}
                      img={msg.img}
                      senderName={msg.from[0].email}
                      subject={msg.subject}
                      to={msg.to[0].email}
                    />
                  </div>
                  <Divider />
                </div>
              </>
            ))
          ) : (
            <Typography align='center' style={{ width: '90%', marginTop: '20px' }}>
              There are no messages to display
            </Typography>
          )
        }
        <div style={{
          position: 'fixed',
          bottom: 40,
          width: '28%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end'
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
