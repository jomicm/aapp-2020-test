import React from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import "./Snapshot.scss";

const Snapshot = (props) => {
  return (
    <div>
      <div className="__container-s">
        <div className="__container-img">
          <img src={props.img} alt="" />
        </div>
        <div className="__container-mail">
          <div className="__container-subject-delete">
            <div className="__container-subject">
              {" "}
              {props.subject.substring(0, 20)}.{" "}
            </div>
            <div className="__container-delete">
              {" "}
              <DeleteIcon onClick={() => alert("Deleted")} />{" "}
            </div>
          </div>
          <div className="__container-message">
            <div className="__container-msg">
              {" "}
              {props.description.substring(0, 25)}...{" "}
            </div>
          </div>
          <div className="__container-sender-time">
            <div className="__container-sender"> {props.sender} </div>
            <div className="__container-time"> {props.time} </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Snapshot;
