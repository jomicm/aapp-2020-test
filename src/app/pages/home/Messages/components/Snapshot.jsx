import React from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import "./Snapshot.scss";

const Snapshot = ({ subject, description, img, senderName, dateTime }) => {
  return (
    <div>
      <div className="__container-s">
        <div className="__container-img">
          <img src={img} alt="" />
        </div>
        <div className="__container-mail">
          <div className="__container-subject-delete">
            <div className="__container-subject">
              {" "}
              {subject.substring(0, 20)}.{" "}
            </div>
            <div className="__container-delete">
              {" "}
              <DeleteIcon onClick={() => alert("Deleted")} />{" "}
            </div>
          </div>
          <div className="__container-message">
            <div className="__container-msg">
              {" "}
              {description.substring(0, 25)}...{" "}
            </div>
          </div>
          <div className="__container-sender-time">
            <div className="__container-sender"> {senderName} </div>
            <div className="__container-time"> {dateTime} </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Snapshot;
