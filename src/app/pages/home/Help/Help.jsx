import React, { useState, useEffect } from "react";
import {
  Portlet,
  PortletBody,
  PortletFooter,
  PortletHeader,
  PortletHeaderToolbar
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
