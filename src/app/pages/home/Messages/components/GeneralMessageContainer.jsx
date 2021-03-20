import React, { useEffect, useState } from 'react';
import Snapshot from './Snapshot';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import {
  postDBEncryptPassword,
  getOneDB,
  updateDB,
  postDB,
  getDB
} from '../../../../crud/api';
import MessageInformation from './MessageInformation';
import './GeneralMessageContainer.scss';

const GeneralMessageContainer = () => {
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

  const loadInitData = () => {
    getDB('messages')
      .then((response) => response.json())
      .then((data) => {
        setData(data.response);
      })
      .catch((error) => console.log('error>', error));
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
    setCurrentUrl(window.location.search.slice(4));
  }, [window.location.search]);

  useEffect(() => {
    if (data.length) {
      const messageFiltered = data.filter(({ _id }) => _id === currentUrl);
      if (messageFiltered.length) {
        setCurrentId(messageFiltered[0]._id);
        const { timeStamp, img, from, subject, to, html } = messageFiltered[0];
        setPreview(html);
        setHeaderInfo({
          timeStamp: timeStamp,
          img: img,
          senderName: from[0].name,
          subject: subject,
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
        {data.length ? data.map((msg, index) => {
          const { html, _id, timeStamp, from, img, subject, to } = msg;
          return (
            <div key={msg._id} onClick={() => setPreview(html)}>
              <Link to={`/messages?id=${_id}`}>
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
        }).reverse() : 'You have no messages'}
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
