import React, { useState, useEffect } from 'react';
import Snapshot from './Snapshot';
import MessageInformation from './MessageInformation';
import './GeneralMessageContainer.scss';
import {
  postDBEncryptPassword,
  getOneDB,
  updateDB,
  postDB,
  getDB
} from '../../../../crud/api';

const GeneralMessageContainer = () => {

  const [data, setData] = useState([]);
  const [preview, setPreview] = useState('');
  const [headerInfo, setHeaderInfo] = useState({
    timeStamp: '',
    img: '',
    senderName: '',
    subject: '',
    to: ''
  });

  console.log('messageForm: ', data)

  useEffect(() => {
    getDB('messages')
    .then((response) => response.json())
    .then((data) => {
      setData(data.response);
      })
      .catch((error) => console.log('error>', error));
  }, []);

  return (
    <div className='__container-gmc'>
      <div className='__container-general-snapshot'>
        {data.map((msg, index) => (
          <div key={msg.id} onClick={() => setPreview(msg.html)}>
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
          </div>
        ))}
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
