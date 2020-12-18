import React from "react";
import "./MessageInformation.scss";

const MessageInformation = (props) => {
  return (
    <div className="__container-mi">
      <div className="__container-subject-mi">{props.subject}</div>
      <div className="__container-sender-time-mi">
        <div className="__container-sender-mi">{props.senderName}</div>
        <div className="__container-time-mi">{props.time}</div>
      </div>
    </div>
  );
};

export default MessageInformation;
