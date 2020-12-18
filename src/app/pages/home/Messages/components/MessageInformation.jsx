import React from "react";
import "./MessageInformation.scss";

const MessageInformation = ({ dateTime, senderName, subject }) => {
  return (
    <div className="__container-mi">
      <div className="__container-subject-mi">{subject}</div>
      <div className="__container-sender-time-mi">
        <div className="__container-sender-mi">{senderName}</div>
        <div className="__container-time-mi">{dateTime}</div>
      </div>
    </div>
  );
};

export default MessageInformation;
