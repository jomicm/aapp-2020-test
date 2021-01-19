import React, { useState } from 'react';
import Snapshot from './Snapshot';
import MessageInformation from './MessageInformation';
import './GeneralMessageContainer.scss';

const GeneralMessageContainer = () => {

  const [data, setData] = useState([
    {
      id: 1,
      date: "",
      subject: "Technique Guides",
      description: "Learn amazing street workout and calisthenics",
      senderName: "José",
      time: "5:12 a.m.",
      img: "https://picsum.photos/id/237/200",
      newMessage: true,
      content:
        "<p><strong>⭐⭐This is an %{employeeName} example ⭐</strong></p>\n<ul>\n<li><strong>dsds⭐⭐%{currentDate}⭐⭐⭐⭐</strong></li>\n<li><del><em><ins>new bullet!⭐</ins></em></del></li>\n</ul>\n<p><strong>La responsiva %{currentDate} %{employeeName} %{currentTime}<br><br>ds</strong></p>\n<p></p>\n"
    },
    {
      id: 2,
      date: "",
      subject: "Skills Training",
      description: "Learn the secrets of bodyweight techniques",
      senderName: "Miguel",
      time: "13:10 p.m.",
      img: "https://picsum.photos/id/238/200",
      newMessage: true,
      content: "<h2> Hey!</h2>, hola <strong>Miguel</strong>"
    },
    {
      id: 3,
      date: "",
      subject: "Strength Training",
      description: "Train anytime, everywere and become a superhero!",
      senderName: "Carlos",
      time: "12:59 p.m.",
      img: "https://picsum.photos/id/239/200",
      newMessage: false,
      content:
        "\n<ul<li><h1>Hola</h1></li>\n<li><h2>Hola</h2></li>\n<li><h3>Hola</h3></li>\n<li><h4>Hola</h4></li></ul>"
    },
    {
      id: 4,
      date: "",
      subject: "Segurity",
      description: "Problems with your PC security",
      senderName: "Diego",
      time: "4:10 p.m.",
      img: "https://picsum.photos/id/240/200",
      newMessage: false,
      content: "<h1>Prueba 4</h1>"
    },
    {
      id: 5,
      date: "",
      subject: "Reports",
      description: "Mail about your reports",
      senderName: "Philip",
      time: "1:06 a.m.",
      img: "https://picsum.photos/id/241/200",
      newMessage: false,
      content: "<h1>Prueba 5</h1>"
    },
    {
      id: 6,
      date: "",
      subject: "Confidential Information",
      description: "Please read the information",
      senderName: "Francisco",
      time: "9:34 p.m.",
      img: "https://picsum.photos/id/242/200",
      newMessage: false,
      content: "<h1>Prueba 6</h1>"
    },
    {
      id: 7,
      date: "",
      subject: "Confidential 7",
      description: "Please read the information 7",
      senderName: "Sergio",
      time: "9:35 p.m.",
      img: "https://picsum.photos/id/243/200",
      newMessage: false,
      content: "<h1>Prueba 7</h1>"
    },
    {
      id: 8,
      date: "",
      subject: "Confidential 8",
      description: "Please read the information 8",
      senderName: "Alejandro",
      time: "9:36 p.m.",
      img: "https://picsum.photos/id/244/200",
      newMessage: false,
      content: "<h1>Prueba 8</h1>"
    },
  ]);
  const [preview, setPreview] = useState('');
  const [headerInfo, setHeaderInfo] = useState({
    dateTime: '',
    img: '',
    senderName: '',
    subject: ''
  });

  return (
    <div className='__container-gmc'>
      <div className='__container-general-snapshot'>
        {data.map((msg, index) => (
          <div key={msg.id} onClick={() => setPreview(msg.content)}>
            <div
              onClick={() =>
                setHeaderInfo({
                  dateTime: msg.time,
                  img: msg.img,
                  senderName: msg.senderName,
                  subject: msg.subject
                })
              }
            >
              <Snapshot
                dateTime={msg.dateTime}
                description={msg.description}
                id={msg.id}
                img={msg.img}
                senderName={msg.senderName}
                subject={msg.subject}
              />
            </div>
          </div>
        ))}
      </div>
      <div className='__container-preview'>
        <MessageInformation
          dateTime={headerInfo.dateTime}
          img={headerInfo.img}
          preview={preview}
          senderName={headerInfo.senderName}
          subject={headerInfo.subject}
        />
      </div>
    </div>
  );
};

export default GeneralMessageContainer;
