import React, { useState, useEffect } from 'react';
import Snapshot from './Snapshot';
import MessageInformation from './MessageInformation';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import {
  postDBEncryptPassword,
  getOneDB,
  updateDB,
  postDB,
  getDB
} from '../../../../crud/api';
import './GeneralMessageContainer.scss';

const GeneralMessageContainer = () => {
  const [currentUrl, setCurrentUrl] = useState(null)
  const [data, setData] = useState([]);
  const [currentId, setCurrentId] = useState(null)
  const [preview, setPreview] = useState('');
  const [headerInfo, setHeaderInfo] = useState({
    timeStamp: '',
    img: '',
    senderName: '',
    subject: '',
    to: ''
  });

  useEffect(() => {
    setCurrentUrl(window.location.search.slice(4));
    if (data.length) {
      const messageFiltered = data.filter(({ _id }) => _id === currentUrl)
      setCurrentId(messageFiltered[0]._id)
      const { timeStamp, img, from, subject, to, html } = messageFiltered[0];
      setPreview(html)
      setHeaderInfo({
        timeStamp: timeStamp,
        img: img,
        senderName: from[0].name,
        subject: subject,
        to: to[0].email
      })
    }
  }, [window.location.search, data, currentUrl])

  useEffect(() => {
    getDB('messages')
      .then((response) => response.json())
      .then((data) => {
        setData(data.response);
      })
      .catch((error) => console.log('error>', error));
  }, []);

  const changeColor = (id) => {
    console.log(id)
    if (id === currentId) {
      return 'snapshot-color'
    }
  }

  return (
    <div className='__container-gmc'>
      <div className='__container-general-snapshot'>
        {data.length ? data.map((msg, index) => (
          <div key={msg._id} onClick={() => setPreview(msg.html)}>
            <Link
              to={`/messages?id=${msg._id}`}
            >
              <div className={changeColor(msg._id)}>
                <Snapshot
                  data={data}
                  dateTime={msg.timeStamp}
                  name={msg.from[0].name}
                  lastName={msg.from[0].lastName}
                  id={msg._id}
                  img={msg.img}
                  senderName={msg.from[0].email}
                  subject={msg.subject}
                  to={msg.to[0].email}
                />
              </div>
            </Link>
          </div>
        )).reverse() : 'You have no messages'}
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
