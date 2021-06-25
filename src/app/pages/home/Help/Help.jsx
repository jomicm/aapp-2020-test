import React from "react";
import {
  Portlet,
  PortletBody
} from "../../../../app/partials/content/Portlet";
import MyTickets from "./components/MyTickets";

const Help = () => {
  return (
    <Portlet>
      <PortletBody className="portlet-body" style={{ padding: "0" }}>
        <MyTickets />
      </PortletBody>
    </Portlet>
  );
}

export default Help;
