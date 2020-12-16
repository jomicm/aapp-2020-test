import React, { useState, useEffect } from "react";
import MyTickets from "./components/MyTickets";
import {
  Portlet,
  PortletBody,
  PortletFooter,
  PortletHeader,
  PortletHeaderToolbar,
} from "../../../../app/partials/content/Portlet";

export default function Help() {
  return (
    <Portlet>
      <PortletBody className="portlet-body" style={{padding: '0'}}>
        <MyTickets />
      </PortletBody>
    </Portlet>
  );
}
